#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FAI Governance Audit
# Detects threat signals in user prompts across 7 OWASP
# LLM Top 10 categories. Privacy-first: never logs full
# prompts — only threat metadata and redacted evidence.
#
# Input: JSON on stdin for UserPromptSubmit:
#        {"userMessage":"..."}
# ENV:
#   AUDIT_LEVEL      = open | standard (default) | strict | locked
#   AUDIT_EVENT      = sessionStart | stop (lifecycle)
#   AUDIT_LOG_DIR    = logs/copilot (default)
#   AUDIT_REPORT     = (optional) path to write JSON report
#   AUDIT_POLICY     = (optional) path to custom policy file
#
# Exit: 0 = clean or below threshold, 1 = blocked
# ─────────────────────────────────────────────────────────
set -euo pipefail

LEVEL="${AUDIT_LEVEL:-standard}"
EVENT="${AUDIT_EVENT:-prompt}"
LOG_DIR="${AUDIT_LOG_DIR:-logs/copilot}"
REPORT_FILE="${AUDIT_REPORT:-}"
POLICY_FILE="${AUDIT_POLICY:-}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")

MAX_SEVERITY=0
THREAT_COUNT=0
THREATS=""
CATEGORIES_HIT=""

# ─── Session lifecycle events ──────────────────────────
handle_lifecycle() {
  local event_type="$1"
  mkdir -p "$LOG_DIR"
  echo "{\"timestamp\":\"${TIMESTAMP}\",\"event\":\"${event_type}\",\"level\":\"${LEVEL}\",\"cwd\":\"$(pwd)\"}" \
    >> "${LOG_DIR}/audit.jsonl" 2>/dev/null || true
  exit 0
}

[ "$EVENT" = "sessionStart" ] && handle_lifecycle "sessionStart"
[ "$EVENT" = "sessionEnd" ] && handle_lifecycle "sessionEnd"

# ─── Read prompt from stdin ────────────────────────────
RAW_INPUT=$(cat 2>/dev/null || echo "")
if [ -z "$RAW_INPUT" ]; then
  exit 0
fi

# Extract userMessage (handles JSON or raw text)
USER_MSG=$(echo "$RAW_INPUT" | sed -n 's/.*"userMessage"[[:space:]]*:[[:space:]]*"\(.*\)".*/\1/p' | head -1)
if [ -z "$USER_MSG" ]; then
  USER_MSG="$RAW_INPUT"
fi

MSG_LOWER=$(echo "$USER_MSG" | tr '[:upper:]' '[:lower:]')
MSG_LEN=${#USER_MSG}

# ─── Threat detection engine ──────────────────────────
record_threat() {
  local category="$1"
  local owasp_id="$2"
  local severity="$3"
  local evidence="$4"

  THREAT_COUNT=$((THREAT_COUNT + 1))

  # Truncate + encode evidence for privacy
  local truncated="${evidence:0:64}"
  local encoded
  encoded=$(echo -n "$truncated" | base64 2>/dev/null || echo "REDACTED")

  THREATS="${THREATS}  [${severity}] ${category} (${owasp_id})\n     Evidence: ${encoded}\n"
  CATEGORIES_HIT="${CATEGORIES_HIT}${category},"

  # Severity tracking (multiply by 100 for integer math)
  local sev_int
  sev_int=$(echo "$severity" | awk '{printf "%d", $1 * 100}')
  if [ "${sev_int:-0}" -gt "$MAX_SEVERITY" ]; then
    MAX_SEVERITY="$sev_int"
  fi

  # Append to audit trail (never log full prompt)
  mkdir -p "$LOG_DIR"
  echo "{\"timestamp\":\"${TIMESTAMP}\",\"event\":\"threat\",\"category\":\"${category}\",\"owasp\":\"${owasp_id}\",\"severity\":${severity},\"evidence\":\"${encoded}\",\"msgLen\":${MSG_LEN}}" \
    >> "${LOG_DIR}/audit.jsonl" 2>/dev/null || true
}

extract_context() {
  local pattern="$1"
  echo "$MSG_LOWER" | grep -oE ".{0,30}${pattern}.{0,30}" | head -1
}

# ═══════════════════════════════════════════════════════
# LLM01: PROMPT INJECTION
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE 'ignore\s+(previous|above|all|prior|earlier)\s+(instructions|rules|guidelines|constraints|prompts)'; then
  record_threat "PROMPT_INJECTION" "LLM01" "0.92" "$(extract_context 'ignore')"
fi

if echo "$MSG_LOWER" | grep -qE 'you\s+are\s+now\s+(a|an|my)\s+(different|new|unrestricted)'; then
  record_threat "PROMPT_INJECTION" "LLM01" "0.85" "role reassignment attempt"
fi

if echo "$MSG_LOWER" | grep -qE '(system|instructions?)\s*:\s*(you are|act as|pretend|roleplay)'; then
  record_threat "PROMPT_INJECTION" "LLM01" "0.88" "system prompt override"
fi

if echo "$MSG_LOWER" | grep -qE 'forget\s+(everything|all|your)\s+(instructions|training|rules|guidelines)'; then
  record_threat "PROMPT_INJECTION" "LLM01" "0.80" "memory wipe attempt"
fi

if echo "$MSG_LOWER" | grep -qE 'do\s+not\s+follow\s+(any|your|the)\s+(rules|guidelines|safety|restrictions)'; then
  record_threat "PROMPT_INJECTION" "LLM01" "0.88" "safety bypass"
fi

if echo "$MSG_LOWER" | grep -qE 'disregard\s+(all|your|any)\s+(previous|prior)?\s*(instructions|rules)'; then
  record_threat "PROMPT_INJECTION" "LLM01" "0.90" "disregard instructions"
fi

if echo "$MSG_LOWER" | grep -qE '\[system\]|\{system\}|<system>|<<sys>>'; then
  record_threat "PROMPT_INJECTION" "LLM01" "0.85" "injected system tag"
fi

# ═══════════════════════════════════════════════════════
# LLM02: INSECURE OUTPUT HANDLING
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE 'generate.*<script|write.*eval\(|create.*innerhtml'; then
  record_threat "INSECURE_OUTPUT" "LLM02" "0.82" "$(extract_context 'script\|eval\|innerhtml')"
fi

if echo "$MSG_LOWER" | grep -qE 'write.*sql.*(drop|delete|truncate|update).*without.*where'; then
  record_threat "INSECURE_OUTPUT" "LLM02" "0.85" "unguarded SQL generation"
fi

# ═══════════════════════════════════════════════════════
# LLM03: TRAINING DATA POISONING / EXTRACTION
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE 'what\s+(is|are)\s+your\s+(training|system|base)\s+(data|prompt|instructions)'; then
  record_threat "DATA_EXTRACTION" "LLM03" "0.75" "$(extract_context 'training\|system')"
fi

if echo "$MSG_LOWER" | grep -qE 'reveal\s+(your|the)\s+(system|hidden|secret)\s+(prompt|instructions|rules)'; then
  record_threat "DATA_EXTRACTION" "LLM03" "0.88" "system prompt extraction"
fi

if echo "$MSG_LOWER" | grep -qE 'repeat\s+(your|the)\s+(system|initial|first)\s+(message|prompt|instructions)'; then
  record_threat "DATA_EXTRACTION" "LLM03" "0.82" "prompt replay attack"
fi

# ═══════════════════════════════════════════════════════
# LLM04: DATA EXFILTRATION
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE 'send\s+(all|every|the)\s+.*(record|data|row|table|database).*(external|outside|third[_-]?party)'; then
  record_threat "DATA_EXFILTRATION" "LLM04" "0.95" "$(extract_context 'send')"
fi

if echo "$MSG_LOWER" | grep -qE 'export.*(to|into).*(external|third[_-]?party|public|s3|blob)'; then
  record_threat "DATA_EXFILTRATION" "LLM04" "0.85" "$(extract_context 'export')"
fi

if echo "$MSG_LOWER" | grep -qE 'upload.*(credential|secret|key|token|password)'; then
  record_threat "DATA_EXFILTRATION" "LLM04" "0.90" "credential upload"
fi

if echo "$MSG_LOWER" | grep -qE 'curl\s.*-d.*@'; then
  record_threat "DATA_EXFILTRATION" "LLM04" "0.72" "curl file upload"
fi

# ═══════════════════════════════════════════════════════
# LLM06: SENSITIVE INFORMATION DISCLOSURE
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE '(api[_-]?key|secret[_-]?key|password|access[_-]?token)\s*[=:]\s*[a-z0-9_/+=.~-]{12,}'; then
  record_threat "CREDENTIAL_EXPOSURE" "LLM06" "0.90" "hardcoded credential in prompt"
fi

if echo "$USER_MSG" | grep -qE 'AKIA[0-9A-Z]{16}'; then
  record_threat "CREDENTIAL_EXPOSURE" "LLM06" "0.95" "AWS key in prompt"
fi

if echo "$USER_MSG" | grep -qE 'ghp_[0-9A-Za-z]{36}'; then
  record_threat "CREDENTIAL_EXPOSURE" "LLM06" "0.95" "GitHub PAT in prompt"
fi

if echo "$USER_MSG" | grep -qE '-----BEGIN.*PRIVATE KEY-----'; then
  record_threat "CREDENTIAL_EXPOSURE" "LLM06" "0.95" "private key in prompt"
fi

if echo "$MSG_LOWER" | grep -qE '(ssn|social.security|credit.card|passport)\s*(number|#|no)?\s*[:=]?\s*[0-9]'; then
  record_threat "PII_EXPOSURE" "LLM06" "0.92" "PII data in prompt"
fi

# ═══════════════════════════════════════════════════════
# LLM07: PRIVILEGE ESCALATION
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE '(sudo|as root|admin access|run as administrator|runas)'; then
  record_threat "PRIVILEGE_ESCALATION" "LLM07" "0.85" "$(extract_context 'sudo\|root\|admin\|runas')"
fi

if echo "$MSG_LOWER" | grep -qE 'chmod\s+777'; then
  record_threat "PRIVILEGE_ESCALATION" "LLM07" "0.90" "chmod 777"
fi

if echo "$MSG_LOWER" | grep -qE 'add.*(sudoers|administrators|admin.group|wheel)'; then
  record_threat "PRIVILEGE_ESCALATION" "LLM07" "0.95" "$(extract_context 'sudoers\|administrators\|wheel')"
fi

if echo "$MSG_LOWER" | grep -qE 'disable.*(firewall|selinux|apparmor|defender|uac)'; then
  record_threat "PRIVILEGE_ESCALATION" "LLM07" "0.88" "security control disable"
fi

# ═══════════════════════════════════════════════════════
# LLM08: SYSTEM DESTRUCTION
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE 'rm\s+-rf\s+(/|~|\*|\./|--no-preserve-root)'; then
  record_threat "SYSTEM_DESTRUCTION" "LLM08" "0.95" "rm -rf system path"
fi

if echo "$MSG_LOWER" | grep -qE '(drop|delete)\s+(database|table|collection|index)\s+(if exists\s+)?[a-z_]'; then
  record_threat "SYSTEM_DESTRUCTION" "LLM08" "0.90" "$(extract_context 'drop\|delete')"
fi

if echo "$MSG_LOWER" | grep -qE 'wipe\s+(all|entire|every|the\s+(whole|entire))'; then
  record_threat "SYSTEM_DESTRUCTION" "LLM08" "0.95" "$(extract_context 'wipe')"
fi

if echo "$MSG_LOWER" | grep -qE '(format\s+c:|del\s+/s\s+/q|diskpart.*clean)'; then
  record_threat "SYSTEM_DESTRUCTION" "LLM08" "0.95" "disk format"
fi

if echo "$MSG_LOWER" | grep -qE 'truncate\s+table|drop\s+schema|destroy\s+all'; then
  record_threat "SYSTEM_DESTRUCTION" "LLM08" "0.88" "$(extract_context 'truncate\|schema\|destroy')"
fi

# ═══════════════════════════════════════════════════════
# LLM09: OVERRELIANCE
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE 'generate\s+(legal|medical|financial)\s+(advice|diagnosis|recommendation)'; then
  record_threat "OVERRELIANCE" "LLM09" "0.70" "professional advice generation"
fi

# ═══════════════════════════════════════════════════════
# LLM10: MODEL THEFT / EXTRACTION
# ═══════════════════════════════════════════════════════

if echo "$MSG_LOWER" | grep -qE '(extract|dump|serialize|export)\s+(the|your)\s+(model|weights|parameters)'; then
  record_threat "MODEL_THEFT" "LLM10" "0.85" "$(extract_context 'extract\|dump\|serialize')"
fi

# ─── Custom policy checks ─────────────────────────────
if [ -n "$POLICY_FILE" ] && [ -f "$POLICY_FILE" ]; then
  while IFS='|' read -r pattern category severity description; do
    [ -z "$pattern" ] && continue
    [[ "$pattern" == \#* ]] && continue
    if echo "$MSG_LOWER" | grep -qE "$pattern"; then
      record_threat "${category:-CUSTOM_POLICY}" "POLICY" "${severity:-0.80}" "${description:-custom policy violation}"
    fi
  done < "$POLICY_FILE"
fi

# ─── Determine action ─────────────────────────────────
if [ "$THREAT_COUNT" -eq 0 ]; then
  exit 0
fi

SHOULD_BLOCK=0
case "$LEVEL" in
  open)     SHOULD_BLOCK=0 ;;
  standard) [ "$MAX_SEVERITY" -ge 90 ] && SHOULD_BLOCK=1 ;;
  strict)   [ "$MAX_SEVERITY" -ge 70 ] && SHOULD_BLOCK=1 ;;
  locked)   SHOULD_BLOCK=1 ;;
esac

# ─── Report ────────────────────────────────────────────
echo ""
echo "🏛️  FAI Governance Audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Timestamp:  ${TIMESTAMP}"
echo "  Level:      ${LEVEL}"
echo "  Threats:    ${THREAT_COUNT}"
echo "  Categories: $(echo "$CATEGORIES_HIT" | tr ',' '\n' | sort -u | tr '\n' ',' | sed 's/,$//')"
echo ""
echo -e "$THREATS"

# ─── JSON report (optional) ───────────────────────────
if [ -n "$REPORT_FILE" ]; then
  {
    echo "{"
    echo "  \"timestamp\": \"${TIMESTAMP}\","
    echo "  \"level\": \"${LEVEL}\","
    echo "  \"threatCount\": ${THREAT_COUNT},"
    echo "  \"maxSeverity\": $(echo "$MAX_SEVERITY" | awk '{printf "%.2f", $1/100}'),"
    echo "  \"blocked\": $([ "$SHOULD_BLOCK" -eq 1 ] && echo "true" || echo "false"),"
    echo "  \"categories\": \"$(echo "$CATEGORIES_HIT" | sed 's/,$//')\""
    echo "}"
  } > "$REPORT_FILE"
  echo "  Report: ${REPORT_FILE}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$SHOULD_BLOCK" -eq 1 ]; then
  echo "  🚫 BLOCKED — prompt contains threat signals (level=${LEVEL})."
  exit 1
else
  echo "  ⚠️  WARNING — threats detected (level=${LEVEL}, not blocking)."
  exit 0
fi
