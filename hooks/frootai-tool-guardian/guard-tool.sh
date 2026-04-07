#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FrootAI Tool Guardian
# Intercepts tool calls with allowlist/blocklist, regex URL
# filtering, per-tool rate limiting, audit trail, and
# sandbox mode for untrusted tools.
#
# Input: JSON on stdin: {"toolName":"bash","toolInput":"..."}
# ENV:
#   GUARD_MODE       = warn | block (default: warn)
#   GUARD_ALLOWLIST  = "" (comma-separated tool names, empty=all)
#   GUARD_BLOCKLIST  = "" (comma-separated tool names to deny)
#   GUARD_URL_DENY   = "" (regex patterns for blocked URLs)
#   GUARD_RATE_LIMIT = 30 (max tool calls per 5-min window)
#   GUARD_SANDBOX    = false (sandbox mode for untrusted tools)
#   GUARD_AUDIT      = true (write audit trail)
#   GUARD_AUDIT_DIR  = logs/copilot (default)
#
# Exit: 0 = safe or warn, 1 = block mode + threat/denied
# ─────────────────────────────────────────────────────────
set -euo pipefail

# ─── Configuration ─────────────────────────────────────
MODE="${GUARD_MODE:-warn}"
ALLOWLIST="${GUARD_ALLOWLIST:-}"
BLOCKLIST="${GUARD_BLOCKLIST:-}"
URL_DENY="${GUARD_URL_DENY:-}"
RATE_LIMIT="${GUARD_RATE_LIMIT:-30}"
SANDBOX="${GUARD_SANDBOX:-false}"
AUDIT_ENABLED="${GUARD_AUDIT:-true}"
AUDIT_DIR="${GUARD_AUDIT_DIR:-logs/copilot}"
AUDIT_FILE="${AUDIT_DIR}/tool-audit.jsonl"

THREAT_FOUND=0
THREAT_CATEGORY=""
THREAT_SEVERITY=""
SUGGESTION=""
TOOL_NAME=""

# ─── Read tool input from stdin ────────────────────────
INPUT=$(cat 2>/dev/null || echo "")
if [ -z "$INPUT" ]; then
  exit 0
fi

TOOL_NAME=$(echo "$INPUT" | sed -n 's/.*"toolName"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
TOOL_INPUT=$(echo "$INPUT" | sed -n 's/.*"toolInput"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p' | head -1)
if [ -z "$TOOL_INPUT" ]; then
  TOOL_INPUT="$INPUT"
fi

INPUT_LOWER=$(printf '%s' "$TOOL_INPUT" | tr '[:upper:]' '[:lower:]')

# ─── Audit trail ───────────────────────────────────────
write_audit() {
  if [ "$AUDIT_ENABLED" != "true" ]; then
    return
  fi
  mkdir -p "$AUDIT_DIR"
  local ts
  ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")
  local verdict="$1"
  local category="${2:-}"
  local tool_esc
  tool_esc=$(printf '%s' "$TOOL_NAME" | sed 's/"/\\"/g')
  local entry="{\"timestamp\":\"${ts}\",\"tool\":\"${tool_esc}\",\"verdict\":\"${verdict}\""
  if [ -n "$category" ]; then
    entry="${entry},\"category\":\"${category}\""
  fi
  entry="${entry}}"
  echo "$entry" >> "$AUDIT_FILE" 2>/dev/null || true
}

# ─── Threat flagging helper ────────────────────────────
flag_threat() {
  THREAT_FOUND=1
  THREAT_CATEGORY="$1"
  THREAT_SEVERITY="$2"
  SUGGESTION="$3"
}

# ─── Allowlist / Blocklist check ───────────────────────
check_access_lists() {
  if [ -n "$BLOCKLIST" ] && [ -n "$TOOL_NAME" ]; then
    local IFS=','
    for blocked in $BLOCKLIST; do
      blocked=$(printf '%s' "$blocked" | tr -d '[:space:]')
      if [ "$TOOL_NAME" = "$blocked" ]; then
        flag_threat "TOOL_BLOCKED" "HIGH" "Tool '${TOOL_NAME}' is on the blocklist."
        return
      fi
    done
  fi

  if [ -n "$ALLOWLIST" ] && [ -n "$TOOL_NAME" ]; then
    local found=0
    local IFS=','
    for allowed in $ALLOWLIST; do
      allowed=$(printf '%s' "$allowed" | tr -d '[:space:]')
      if [ "$TOOL_NAME" = "$allowed" ]; then
        found=1
        break
      fi
    done
    if [ "$found" -eq 0 ]; then
      flag_threat "TOOL_NOT_ALLOWED" "MEDIUM" "Tool '${TOOL_NAME}' is not on the allowlist."
    fi
  fi
}

# ─── Per-tool rate limiting ────────────────────────────
check_rate_limit() {
  local state_dir="${TMPDIR:-/tmp}/frootai-guardian"
  mkdir -p "$state_dir"

  local window_file="${state_dir}/rate-$(printf '%s' "$TOOL_NAME" | tr -c '[:alnum:]' '-').log"
  local now
  now=$(date +%s 2>/dev/null || echo "0")
  local cutoff=$((now - 300))  # 5-minute window

  echo "$now" >> "$window_file" 2>/dev/null || true

  # Prune old entries and count recent
  local count=0
  if [ -f "$window_file" ]; then
    local tmp="${window_file}.tmp"
    while IFS= read -r ts; do
      if [[ "$ts" =~ ^[0-9]+$ ]] && [ "$ts" -ge "$cutoff" ]; then
        echo "$ts"
        count=$((count + 1))
      fi
    done < "$window_file" > "$tmp" 2>/dev/null || true
    mv "$tmp" "$window_file" 2>/dev/null || true
  fi

  if [ "$count" -gt "$RATE_LIMIT" ]; then
    flag_threat "RATE_LIMIT_EXCEEDED" "MEDIUM" "Tool '${TOOL_NAME}' hit ${count}/${RATE_LIMIT} calls in 5 min."
  fi
}

# ─── URL pattern filtering ─────────────────────────────
check_url_patterns() {
  if [ -z "$URL_DENY" ]; then
    return
  fi
  local IFS=','
  for pattern in $URL_DENY; do
    pattern=$(printf '%s' "$pattern" | tr -d '[:space:]')
    if echo "$INPUT_LOWER" | grep -qiE "$pattern" 2>/dev/null; then
      flag_threat "URL_DENIED" "HIGH" "Input matches blocked URL pattern: ${pattern}"
      return
    fi
  done
}

# ─── Sandbox mode ──────────────────────────────────────
check_sandbox() {
  if [ "$SANDBOX" != "true" ]; then
    return
  fi
  # In sandbox mode, block any writes outside the project
  if echo "$INPUT_LOWER" | grep -qE '(^|\s)(\/etc|\/usr|\/var|\/root|~\/\.)'; then
    flag_threat "SANDBOX_VIOLATION" "CRITICAL" "Sandbox mode blocks access outside the project directory."
  fi
}

# ─── Category 1: Destructive File Operations ──────────
check_destructive_files() {
  if echo "$INPUT_LOWER" | grep -qE 'rm\s+(-[a-z]*f[a-z]*\s+)?(-[a-z]*r[a-z]*\s+)?(\/|~|\.)(\s|$|/)'; then
    flag_threat "DESTRUCTIVE_FILE_OPS" "CRITICAL" "Use targeted paths. Backup with 'mv' before removing."
  elif echo "$INPUT_LOWER" | grep -qE 'rm\s+.*\.(env|git|ssh|gnupg)'; then
    flag_threat "DESTRUCTIVE_FILE_OPS" "CRITICAL" "Never delete config/secret directories."
  fi
}

# ─── Category 2: Destructive Git Operations ───────────
check_destructive_git() {
  if echo "$INPUT_LOWER" | grep -qE 'git\s+push\s+(-f|--force)\s+(origin\s+)?(main|master|production|release)'; then
    flag_threat "DESTRUCTIVE_GIT_OPS" "CRITICAL" "Use --force-with-lease on protected branches."
  elif echo "$INPUT_LOWER" | grep -qE 'git\s+reset\s+--hard'; then
    flag_threat "DESTRUCTIVE_GIT_OPS" "HIGH" "Use 'git stash' first, or 'git reset --soft'."
  elif echo "$INPUT_LOWER" | grep -qE 'git\s+clean\s+-[a-z]*f'; then
    flag_threat "DESTRUCTIVE_GIT_OPS" "HIGH" "Use 'git clean -n' (dry-run) first."
  fi
}

# ─── Category 3: Database Destruction ──────────────────
check_database() {
  if echo "$INPUT_LOWER" | grep -qE 'drop\s+(table|database|schema|index)'; then
    flag_threat "DATABASE_DESTRUCTION" "CRITICAL" "Use migrations. Backup with pg_dump/mysqldump first."
  elif echo "$INPUT_LOWER" | grep -qE 'truncate\s+'; then
    flag_threat "DATABASE_DESTRUCTION" "HIGH" "Use DELETE with WHERE. Backup first."
  elif echo "$INPUT_LOWER" | grep -qE 'delete\s+from\s+[a-z_]+\s*;'; then
    flag_threat "DATABASE_DESTRUCTION" "HIGH" "DELETE without WHERE clause deletes all rows."
  fi
}

# ─── Category 4: Permission Abuse ─────────────────────
check_permissions() {
  if echo "$INPUT_LOWER" | grep -qE 'chmod\s+(-[a-z]*\s+)?777'; then
    flag_threat "PERMISSION_ABUSE" "HIGH" "Use 755 for dirs, 644 for files."
  fi
}

# ─── Category 5: Network Exfiltration ─────────────────
check_network() {
  if echo "$INPUT_LOWER" | grep -qE 'curl\s.*\|\s*(ba)?sh'; then
    flag_threat "NETWORK_EXFILTRATION" "CRITICAL" "Download first, review, then execute."
  elif echo "$INPUT_LOWER" | grep -qE 'wget\s.*\|\s*(ba)?sh'; then
    flag_threat "NETWORK_EXFILTRATION" "CRITICAL" "Download first, inspect, then execute."
  elif echo "$INPUT_LOWER" | grep -qE 'curl\s+--data\s+@'; then
    flag_threat "NETWORK_EXFILTRATION" "HIGH" "Verify destination URL before uploading files."
  fi
}

# ─── Category 6: System Danger ─────────────────────────
check_system() {
  if echo "$INPUT_LOWER" | grep -qE '(^|\s)sudo\s'; then
    flag_threat "SYSTEM_DANGER" "HIGH" "Avoid sudo in AI-generated commands."
  elif echo "$INPUT_LOWER" | grep -qE 'npm\s+publish(\s|$)' && ! echo "$INPUT_LOWER" | grep -q 'dry-run'; then
    flag_threat "SYSTEM_DANGER" "HIGH" "Use 'npm publish --dry-run' first."
  fi
}

# ─── Category 7: Infrastructure Teardown ──────────────
check_infra() {
  if echo "$INPUT_LOWER" | grep -qE 'az\s+group\s+delete'; then
    flag_threat "INFRA_TEARDOWN" "CRITICAL" "Use 'az group delete --what-if' first."
  elif echo "$INPUT_LOWER" | grep -qE 'terraform\s+destroy'; then
    flag_threat "INFRA_TEARDOWN" "CRITICAL" "Use 'terraform plan -destroy' to review first."
  elif echo "$INPUT_LOWER" | grep -qE 'az\s+keyvault\s+(delete|purge)'; then
    flag_threat "INFRA_TEARDOWN" "CRITICAL" "Key Vault deletion may be irreversible."
  elif echo "$INPUT_LOWER" | grep -qE 'az\s+ad\s+app\s+(credential\s+reset|delete)'; then
    flag_threat "INFRA_TEARDOWN" "CRITICAL" "Resetting app credentials breaks dependent services."
  fi
}

# ─── Main ──────────────────────────────────────────────
main() {
  check_access_lists
  [ "$THREAT_FOUND" -eq 0 ] && check_rate_limit
  [ "$THREAT_FOUND" -eq 0 ] && check_url_patterns
  [ "$THREAT_FOUND" -eq 0 ] && check_sandbox
  [ "$THREAT_FOUND" -eq 0 ] && check_destructive_files
  [ "$THREAT_FOUND" -eq 0 ] && check_destructive_git
  [ "$THREAT_FOUND" -eq 0 ] && check_database
  [ "$THREAT_FOUND" -eq 0 ] && check_permissions
  [ "$THREAT_FOUND" -eq 0 ] && check_network
  [ "$THREAT_FOUND" -eq 0 ] && check_system
  [ "$THREAT_FOUND" -eq 0 ] && check_infra

  if [ "$THREAT_FOUND" -eq 0 ]; then
    write_audit "ALLOW"
    exit 0
  fi

  write_audit "DENY" "$THREAT_CATEGORY"

  echo ""
  echo "🛡️  FrootAI Tool Guardian — threat detected"
  echo "─────────────────────────────────────────"
  echo "  Tool:       ${TOOL_NAME:-unknown}"
  echo "  Category:   ${THREAT_CATEGORY}"
  echo "  Severity:   ${THREAT_SEVERITY}"
  echo "  Suggestion: ${SUGGESTION}"
  echo "─────────────────────────────────────────"

  if [ "$MODE" = "block" ]; then
    echo "  🚫 BLOCKED — operation not permitted."
    exit 1
  else
    echo "  ⚠️  WARNING — threat detected (mode=warn)."
    exit 0
  fi
}

main
