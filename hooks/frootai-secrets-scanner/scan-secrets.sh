#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FrootAI Secrets Scanner
# Detects leaked credentials across cloud providers, SaaS
# platforms, private keys, and generic secrets. Includes
# Shannon entropy detection for unknown secret formats.
#
# ENV:
#   SCAN_MODE       = warn (default) | block
#   SCAN_SCOPE      = diff (default) | staged | all
#   SCAN_ALLOWLIST  = (optional) path to allowlist file
#   SCAN_REPORT     = (optional) path to write JSON report
#   SCAN_MIN_ENTROPY = 4.0 (default) threshold for entropy
#
# Exit: 0 = clean or warn mode, 1 = block mode + findings
# ─────────────────────────────────────────────────────────
set -euo pipefail

MODE="${SCAN_MODE:-warn}"
SCOPE="${SCAN_SCOPE:-diff}"
ALLOWLIST_FILE="${SCAN_ALLOWLIST:-}"
REPORT_FILE="${SCAN_REPORT:-}"
MIN_ENTROPY="${SCAN_MIN_ENTROPY:-4.0}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")

FINDINGS=0
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
OUTPUT=""

# ─── Collect diff content ──────────────────────────────
case "$SCOPE" in
  staged) DIFF_CONTENT=$(git diff --cached --unified=0 2>/dev/null || echo "") ;;
  all)    DIFF_CONTENT=$(git diff HEAD --unified=0 2>/dev/null || echo "") ;;
  *)      DIFF_CONTENT=$(git diff --unified=0 2>/dev/null || echo "") ;;
esac

if [ -z "$DIFF_CONTENT" ]; then
  echo "🔒 FrootAI Secrets Scanner: no changes to scan."
  exit 0
fi

ADDED_LINES=$(echo "$DIFF_CONTENT" | grep '^+[^+]' | sed 's/^+//' || true)

if [ -z "$ADDED_LINES" ]; then
  echo "🔒 FrootAI Secrets Scanner: no added lines to scan."
  exit 0
fi

# ─── False positive + custom allowlist ─────────────────
BASE_FP="example|placeholder|your_|xxx|changeme|TODO|FIXME|dummy|fake|test_key|sample|<secret>|INSERT_|REPLACE_ME|__PLACEHOLDER__|__REDACTED__|00000000"
CUSTOM_FP=""
if [ -n "$ALLOWLIST_FILE" ] && [ -f "$ALLOWLIST_FILE" ]; then
  CUSTOM_FP=$(grep -vE '^[[:space:]]*(#|$)' "$ALLOWLIST_FILE" | tr '\n' '|' | sed 's/|$//' || true)
fi

is_false_positive() {
  local val="$1"
  echo "$val" | grep -qiE "$BASE_FP" && return 0
  [ -n "$CUSTOM_FP" ] && echo "$val" | grep -qiE "$CUSTOM_FP" && return 0
  return 1
}

# ─── Redaction helper ──────────────────────────────────
redact() {
  local val="$1"
  local len=${#val}
  if [ "$len" -le 12 ]; then
    echo "[REDACTED ${len}c]"
  else
    echo "${val:0:4}****${val:$((len-4)):4}"
  fi
}

# ─── Pattern scanner ───────────────────────────────────
scan_pattern() {
  local name="$1"
  local severity="$2"
  local pattern="$3"

  local matches
  matches=$(echo "$ADDED_LINES" | grep -iEo "$pattern" 2>/dev/null || true)
  [ -z "$matches" ] && return

  while IFS= read -r match; do
    [ -z "$match" ] && continue
    is_false_positive "$match" && continue

    FINDINGS=$((FINDINGS + 1))
    case "$severity" in
      CRITICAL) CRITICAL_COUNT=$((CRITICAL_COUNT + 1)) ;;
      HIGH)     HIGH_COUNT=$((HIGH_COUNT + 1)) ;;
      MEDIUM)   MEDIUM_COUNT=$((MEDIUM_COUNT + 1)) ;;
    esac

    local redacted
    redacted=$(redact "$match")
    OUTPUT="${OUTPUT}  [${severity}] ${name}: ${redacted}\n"
  done <<< "$matches"
}

# ─── Shannon entropy calculator ────────────────────────
compute_entropy() {
  local s="$1"
  local len=${#s}
  [ "$len" -eq 0 ] && echo "0" && return

  declare -A freq
  for (( i=0; i<len; i++ )); do
    local c="${s:$i:1}"
    freq["$c"]=$(( ${freq["$c"]:-0} + 1 ))
  done

  # Integer approximation: entropy * 100
  local entropy_x100=0
  for c in "${!freq[@]}"; do
    local count="${freq[$c]}"
    local pct=$(( count * 100 / len ))
    if [ "$pct" -gt 0 ] && [ "$pct" -lt 100 ]; then
      local log_approx=0
      if   [ "$pct" -le 5 ];  then log_approx=430
      elif [ "$pct" -le 10 ]; then log_approx=332
      elif [ "$pct" -le 20 ]; then log_approx=232
      elif [ "$pct" -le 30 ]; then log_approx=174
      elif [ "$pct" -le 40 ]; then log_approx=132
      elif [ "$pct" -le 50 ]; then log_approx=100
      elif [ "$pct" -le 60 ]; then log_approx=74
      elif [ "$pct" -le 70 ]; then log_approx=51
      elif [ "$pct" -le 80 ]; then log_approx=32
      elif [ "$pct" -le 90 ]; then log_approx=15
      else log_approx=4
      fi
      entropy_x100=$(( entropy_x100 + (pct * log_approx / 100) ))
    fi
  done
  echo "$entropy_x100"
}

# ─── Entropy-based unknown secret detection ────────────
check_entropy_secrets() {
  local threshold_x100
  threshold_x100=$(echo "$MIN_ENTROPY" | sed 's/\.//' | sed 's/^0*//')
  [ -z "$threshold_x100" ] && threshold_x100=40

  local candidates
  candidates=$(echo "$ADDED_LINES" | grep -oE '[=:][[:space:]]*["\x27]?[A-Za-z0-9+/=_-]{24,}["\x27]?' 2>/dev/null || true)
  [ -z "$candidates" ] && return

  while IFS= read -r candidate; do
    [ -z "$candidate" ] && continue
    local val
    val=$(echo "$candidate" | sed "s/^[=:][[:space:]]*//" | tr -d "\"'" || true)
    [ ${#val} -lt 24 ] && continue
    is_false_positive "$val" && continue

    local ent
    ent=$(compute_entropy "$val")
    if [ "$ent" -ge "$threshold_x100" ]; then
      FINDINGS=$((FINDINGS + 1))
      HIGH_COUNT=$((HIGH_COUNT + 1))
      local redacted
      redacted=$(redact "$val")
      OUTPUT="${OUTPUT}  [HIGH] ENTROPY_SECRET (score=${ent}): ${redacted}\n"
    fi
  done <<< "$candidates"
}

# ═══════════════════════════════════════════════════════
# SECRET PATTERNS BY PROVIDER
# ═══════════════════════════════════════════════════════

# ─── AWS ───────────────────────────────────────────────
scan_pattern "AWS_ACCESS_KEY" "CRITICAL" "AKIA[0-9A-Z]{16}"
scan_pattern "AWS_SECRET_KEY" "CRITICAL" "aws_secret_access_key[[:space:]]*=[[:space:]]*[A-Za-z0-9/+=]{40}"
scan_pattern "AWS_SESSION_TOKEN" "HIGH" "aws_session_token[[:space:]]*=[[:space:]]*[A-Za-z0-9/+=]{100,}"

# ─── Azure ─────────────────────────────────────────────
scan_pattern "AZURE_CLIENT_SECRET" "CRITICAL" "azure[_-]?client[_-]?secret[[:space:]]*[=:][[:space:]]*[A-Za-z0-9_~.=-]{34,}"
scan_pattern "AZURE_STORAGE_KEY" "CRITICAL" "AccountKey=[A-Za-z0-9+/=]{86,}"
scan_pattern "AZURE_SAS_TOKEN" "HIGH" "[?&]sig=[A-Za-z0-9%+/=]{40,}"
scan_pattern "AZURE_CONNSTR" "HIGH" "DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[^;]+"
scan_pattern "AZURE_SQL_CONNSTR" "HIGH" "Server=tcp:.*\.database\.windows\.net.*Password=[^;]+"
scan_pattern "AZURE_COSMOSDB_KEY" "CRITICAL" "AccountEndpoint=https://.*\.documents\.azure\.com.*AccountKey=[^;]+"
scan_pattern "AZURE_OPENAI_KEY" "CRITICAL" "api-key[[:space:]]*[:=][[:space:]]*[a-f0-9]{32}"

# ─── GCP ───────────────────────────────────────────────
scan_pattern "GCP_SERVICE_ACCOUNT" "CRITICAL" "\"type\"[[:space:]]*:[[:space:]]*\"service_account\""
scan_pattern "GCP_API_KEY" "HIGH" "AIza[0-9A-Za-z_-]{35}"
scan_pattern "GCP_OAUTH_SECRET" "HIGH" "client_secret[[:space:]]*[:=][[:space:]]*[A-Za-z0-9_-]{24}"

# ─── GitHub ────────────────────────────────────────────
scan_pattern "GITHUB_PAT" "CRITICAL" "ghp_[0-9A-Za-z]{36}"
scan_pattern "GITHUB_FINE_GRAINED" "CRITICAL" "github_pat_[0-9A-Za-z_]{82}"
scan_pattern "GITHUB_OAUTH" "CRITICAL" "gho_[0-9A-Za-z]{36}"
scan_pattern "GITHUB_APP_TOKEN" "CRITICAL" "ghs_[0-9A-Za-z]{36}"
scan_pattern "GITHUB_REFRESH" "CRITICAL" "ghr_[0-9A-Za-z]{36}"

# ─── Package Registries ───────────────────────────────
scan_pattern "NPM_TOKEN" "HIGH" "npm_[0-9A-Za-z]{36}"
scan_pattern "NUGET_API_KEY" "HIGH" "oy2[a-z0-9]{43}"
scan_pattern "PYPI_TOKEN" "HIGH" "pypi-[A-Za-z0-9_-]{50,}"

# ─── Private Keys ─────────────────────────────────────
scan_pattern "PRIVATE_KEY" "CRITICAL" "-----BEGIN (RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----"
scan_pattern "PGP_PRIVATE" "CRITICAL" "-----BEGIN PGP PRIVATE KEY BLOCK-----"
scan_pattern "PKCS12_REF" "HIGH" "\.(p12|pfx)['\"]"

# ─── Payment / SaaS ───────────────────────────────────
scan_pattern "STRIPE_SECRET" "CRITICAL" "sk_live_[0-9A-Za-z]{24,}"
scan_pattern "STRIPE_RESTRICTED" "HIGH" "rk_live_[0-9A-Za-z]{24,}"
scan_pattern "SENDGRID_KEY" "HIGH" "SG\.[0-9A-Za-z_-]{22}\.[0-9A-Za-z_-]{43}"
scan_pattern "TWILIO_KEY" "HIGH" "SK[0-9a-fA-F]{32}"
scan_pattern "OPENAI_API_KEY" "CRITICAL" "sk-[A-Za-z0-9]{20,}T3BlbkFJ[A-Za-z0-9]{20,}"
scan_pattern "OPENAI_PROJECT_KEY" "CRITICAL" "sk-proj-[A-Za-z0-9_-]{40,}"

# ─── Messaging ─────────────────────────────────────────
scan_pattern "SLACK_TOKEN" "HIGH" "xox[baprs]-[0-9]{10,}-[0-9A-Za-z-]+"
scan_pattern "SLACK_WEBHOOK" "HIGH" "https://hooks\.slack\.com/services/T[0-9A-Z]{8,}/B[0-9A-Z]{8,}/[0-9A-Za-z]{24}"
scan_pattern "DISCORD_TOKEN" "HIGH" "[MN][A-Za-z0-9]{23,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}"
scan_pattern "TEAMS_WEBHOOK" "HIGH" "https://.*\.webhook\.office\.com/webhookb2/[a-z0-9-]+"

# ─── Connection Strings ───────────────────────────────
scan_pattern "DATABASE_URI" "HIGH" "(mongodb(\+srv)?|postgres(ql)?|mysql|redis|amqp|mssql)://[^[:space:]]{10,}"
scan_pattern "SMTP_CREDS" "HIGH" "smtp://[^:]+:[^@]+@[^[:space:]]+"

# ─── Generic / Catch-All ──────────────────────────────
scan_pattern "GENERIC_SECRET" "HIGH" "(secret|password|api[_-]?key|access[_-]?token|auth[_-]?token)[[:space:]]*[=:][[:space:]]*['\"]?[A-Za-z0-9_/+=.~-]{12,}['\"]?"
scan_pattern "BEARER_TOKEN" "MEDIUM" "[Bb]earer [A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}"
scan_pattern "JWT_TOKEN" "MEDIUM" "eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"
scan_pattern "BASE64_LONG" "MEDIUM" "['\"][A-Za-z0-9+/]{64,}={0,2}['\"]"

# ─── Certificates ─────────────────────────────────────
scan_pattern "CERTIFICATE" "MEDIUM" "-----BEGIN CERTIFICATE-----"
scan_pattern "KEYSTORE_PASS" "HIGH" "(keystore|truststore)[_-]?pass(word)?[[:space:]]*[=:][[:space:]]*[^ ]+"

# ─── Entropy check for unknown formats ────────────────
check_entropy_secrets

# ═══════════════════════════════════════════════════════
# REPORT
# ═══════════════════════════════════════════════════════

echo ""
echo "🔒 FrootAI Secrets Scanner — ${SCOPE} scan"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Timestamp: ${TIMESTAMP}"
echo "  Patterns:  40+ provider-specific + entropy"
echo ""

if [ "$FINDINGS" -eq 0 ]; then
  echo "  ✅ No secrets detected."
  exit 0
fi

echo "  Found ${FINDINGS} potential secret(s):"
printf "    Critical: %d  |  High: %d  |  Medium: %d\n" "$CRITICAL_COUNT" "$HIGH_COUNT" "$MEDIUM_COUNT"
echo ""
echo -e "$OUTPUT"

# ─── JSON report (optional) ───────────────────────────
if [ -n "$REPORT_FILE" ]; then
  {
    echo "{"
    echo "  \"timestamp\": \"${TIMESTAMP}\","
    echo "  \"scope\": \"${SCOPE}\","
    echo "  \"findings\": ${FINDINGS},"
    echo "  \"critical\": ${CRITICAL_COUNT},"
    echo "  \"high\": ${HIGH_COUNT},"
    echo "  \"medium\": ${MEDIUM_COUNT}"
    echo "}"
  } > "$REPORT_FILE"
  echo "  Report written to: ${REPORT_FILE}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$MODE" = "block" ]; then
  echo "  🚫 BLOCKED — remove secrets before committing."
  echo "  Remediation: use Azure Key Vault, env vars, or .env + .gitignore."
  exit 1
else
  echo "  ⚠️  WARNING — secrets detected (mode=warn, not blocking)."
  echo "  Set SCAN_MODE=block to enforce."
  exit 0
fi
