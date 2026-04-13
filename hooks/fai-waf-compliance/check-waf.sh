#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FAI WAF Compliance Checker
# Validates code changes against all 6 Well-Architected
# Framework pillars with per-pillar scoring.
#
# Each pillar is scored 0-100 based on weighted pattern
# detection. Findings below configurable thresholds trigger
# warnings or block the commit.
#
# ENV:
#   WAF_MODE            = warn (default) | block
#   WAF_THRESHOLD       = 60 (default) minimum passing score
#   WAF_REPORT_FILE     = (optional) path to write JSON report
#   WAF_FALSE_POSITIVES = (optional) pipe-delimited extra FP terms
#
# Exit: 0 = all pillars pass or warn mode, 1 = block + failures
# ─────────────────────────────────────────────────────────
set -euo pipefail

MODE="${WAF_MODE:-warn}"
THRESHOLD="${WAF_THRESHOLD:-60}"
REPORT_FILE="${WAF_REPORT_FILE:-}"
EXTRA_FP="${WAF_FALSE_POSITIVES:-}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")

# Per-pillar tracking (score starts at 100, decremented per finding)
declare -A PILLAR_FINDINGS
declare -A PILLAR_SCORES
PILLARS=("reliability" "security" "cost-optimization" "operational-excellence" "performance-efficiency" "responsible-ai")
for p in "${PILLARS[@]}"; do
  PILLAR_FINDINGS["$p"]=0
  PILLAR_SCORES["$p"]=100
done

TOTAL_FINDINGS=0
OUTPUT=""

# ─── Collect diff content ──────────────────────────────
DIFF_CONTENT=$(git diff --unified=0 2>/dev/null || echo "")
STAGED_CONTENT=$(git diff --cached --unified=0 2>/dev/null || echo "")

if [ -z "$DIFF_CONTENT" ] && [ -z "$STAGED_CONTENT" ]; then
  echo "🏛️  FAI WAF Compliance: no changes to scan."
  exit 0
fi

ADDED_LINES=$(printf "%s\n%s" "$DIFF_CONTENT" "$STAGED_CONTENT" | grep '^+[^+]' | sed 's/^+//' || true)

if [ -z "$ADDED_LINES" ]; then
  echo "🏛️  FAI WAF Compliance: no added lines to scan."
  exit 0
fi

# ─── False positive filter ─────────────────────────────
BASE_FP="example|placeholder|your_|xxx|changeme|TODO|FIXME|dummy|fake|test_key|sample|<secret>|INSERT_|REPLACE_ME|__PLACEHOLDER__"
if [ -n "$EXTRA_FP" ]; then
  FALSE_POSITIVES="${BASE_FP}|${EXTRA_FP}"
else
  FALSE_POSITIVES="$BASE_FP"
fi

# ─── Pattern scanner ───────────────────────────────────
scan_waf() {
  local pillar="$1"
  local name="$2"
  local severity="$3"
  local weight="$4"
  local pattern="$5"

  local matches
  matches=$(echo "$ADDED_LINES" | grep -iE "$pattern" 2>/dev/null || true)
  [ -z "$matches" ] && return

  while IFS= read -r match; do
    [ -z "$match" ] && continue
    echo "$match" | grep -qiE "$FALSE_POSITIVES" && continue

    TOTAL_FINDINGS=$((TOTAL_FINDINGS + 1))
    PILLAR_FINDINGS["$pillar"]=$(( ${PILLAR_FINDINGS["$pillar"]} + 1 ))
    local new_score=$(( ${PILLAR_SCORES["$pillar"]} - weight ))
    [ "$new_score" -lt 0 ] && new_score=0
    PILLAR_SCORES["$pillar"]=$new_score

    local display="${match:0:90}"
    [ ${#match} -gt 90 ] && display="${display}..."
    OUTPUT="${OUTPUT}  [${severity}] ${pillar} / ${name}\n     ${display}\n"
  done <<< "$matches"
}

# ═══════════════════════════════════════════════════════
# RELIABILITY PILLAR
# ═══════════════════════════════════════════════════════

scan_waf "reliability" "Bare catch block — swallows errors" "HIGH" 15 \
  "catch[[:space:]]*(\([^)]*\))?[[:space:]]*\{[[:space:]]*(//.*)?[[:space:]]*\}"

scan_waf "reliability" "HTTP call without .catch or try/catch" "MEDIUM" 8 \
  "(fetch|axios\.(get|post|put|delete|patch)|http\.request)\([^)]*\)[[:space:]]*;?[[:space:]]*$"

scan_waf "reliability" "HTTP client without timeout config" "MEDIUM" 6 \
  "(new HttpClient|axios\.create|got\.extend)\([[:space:]]*\{[^}]*\}[[:space:]]*\)"

scan_waf "reliability" "Single replica count — no HA" "MEDIUM" 8 \
  "(replicas?|min_count)[[:space:]]*[:=][[:space:]]*1[^0-9]"

scan_waf "reliability" "process.exit() in non-CLI code" "MEDIUM" 6 \
  "process\.exit\([0-9]*\)"

scan_waf "reliability" "Promise without rejection handler" "MEDIUM" 6 \
  "new Promise\([^)]*\)[^.]*$"

# ═══════════════════════════════════════════════════════
# SECURITY PILLAR
# ═══════════════════════════════════════════════════════

scan_waf "security" "Hardcoded secret in assignment" "CRITICAL" 25 \
  "(password|secret|api[_-]?key|access[_-]?token|client[_-]?secret)[[:space:]]*[=:][[:space:]]*['\"][A-Za-z0-9_/+=.~-]{8,}['\"]"

scan_waf "security" "Overly permissive chmod" "HIGH" 15 \
  "chmod[[:space:]]+(777|666|a\+rwx)"

scan_waf "security" "Bicep param may need @secure()" "HIGH" 12 \
  "^param[[:space:]]+(.*[Ss]ecret|.*[Pp]assword|.*[Kk]ey)[[:space:]]+string"

scan_waf "security" "TLS verification disabled" "CRITICAL" 20 \
  "(NODE_TLS_REJECT_UNAUTHORIZED|PYTHONHTTPSVERIFY|verify[[:space:]]*=[[:space:]]*[Ff]alse|rejectUnauthorized[[:space:]]*:[[:space:]]*false)"

scan_waf "security" "String concatenation in SQL query" "HIGH" 15 \
  "(execute|query|raw)\([[:space:]]*[\"'\`].*\+.*[\"'\`]"

scan_waf "security" "Inline connection string (use Key Vault)" "HIGH" 12 \
  "(Server|Data Source)=.*\.(database\.windows\.net|database\.azure\.com|documents\.azure\.com)"

scan_waf "security" "Wildcard CORS origin" "HIGH" 10 \
  "(Access-Control-Allow-Origin|cors|allowedOrigins)[[:space:]]*[:=][[:space:]]*['\"]?\*['\"]?"

scan_waf "security" "eval() or Function() constructor" "HIGH" 12 \
  "(eval|Function)[[:space:]]*\([[:space:]]*['\"\`]"

# ═══════════════════════════════════════════════════════
# COST OPTIMIZATION PILLAR
# ═══════════════════════════════════════════════════════

scan_waf "cost-optimization" "Hardcoded premium SKU" "MEDIUM" 8 \
  "(sku|tier)[[:space:]]*[:=][[:space:]]*['\"]?(Premium|P1|P2|P3|P4|S3|Dedicated)['\"]?"

scan_waf "cost-optimization" "OpenAI call without max_tokens" "MEDIUM" 6 \
  "completions\.create\([^)]*\)"

scan_waf "cost-optimization" "GPT-4 model for potential low-complexity task" "LOW" 4 \
  "model[[:space:]]*[:=][[:space:]]*['\"]gpt-4['\"]"

scan_waf "cost-optimization" "While-true loop in serverless context" "MEDIUM" 8 \
  "while[[:space:]]*\([[:space:]]*true[[:space:]]*\)"

scan_waf "cost-optimization" "Unbounded database query" "MEDIUM" 6 \
  "\.(find|select|query)\(\)[[:space:]]*\."

scan_waf "cost-optimization" "No TTL on cache set" "LOW" 4 \
  "\.set\([^,]+,[^,]+\)[[:space:]]*[;]?[[:space:]]*$"

# ═══════════════════════════════════════════════════════
# OPERATIONAL EXCELLENCE PILLAR
# ═══════════════════════════════════════════════════════

scan_waf "operational-excellence" "Bicep resource without @description" "MEDIUM" 6 \
  "^resource[[:space:]]+[a-zA-Z]"

scan_waf "operational-excellence" "Logging potentially sensitive data" "HIGH" 10 \
  "console\.(log|info|debug)\(.*([Pp]assword|[Ss]ecret|[Tt]oken|[Kk]ey)"

scan_waf "operational-excellence" "Print/console.log instead of structured logger" "LOW" 3 \
  "^[[:space:]]*(print|console\.log)\("

scan_waf "operational-excellence" "Catch block without telemetry/logging" "MEDIUM" 6 \
  "catch[[:space:]]*\([^)]*\)[[:space:]]*\{[[:space:]]*(return|throw)"

scan_waf "operational-excellence" "Hardcoded URL/endpoint (use env var)" "MEDIUM" 5 \
  "https?://[a-z0-9.-]+\.(azure|openai|cognitiveservices)\.(com|net)"

scan_waf "operational-excellence" "Missing IaC metadata/tags" "LOW" 3 \
  "resource[[:space:]].*'Microsoft\." 

# ═══════════════════════════════════════════════════════
# PERFORMANCE EFFICIENCY PILLAR
# ═══════════════════════════════════════════════════════

scan_waf "performance-efficiency" "Sync file I/O in async context" "MEDIUM" 8 \
  "(readFileSync|writeFileSync|appendFileSync|mkdirSync)\("

scan_waf "performance-efficiency" "List/query without pagination" "MEDIUM" 6 \
  "\.(list|findAll|find)\([[:space:]]*\)[[:space:]]*;"

scan_waf "performance-efficiency" "N+1 query pattern in loop" "HIGH" 10 \
  "for.*\{[^}]*(await|\.query|\.findOne|\.get)\("

scan_waf "performance-efficiency" "Missing async/await on I/O" "MEDIUM" 6 \
  "[^a][[:space:]](fetch|fs\.promises|readFile|writeFile)\("

scan_waf "performance-efficiency" "JSON.parse on large unbounded input" "MEDIUM" 5 \
  "JSON\.parse\([^)]*body[^)]*\)"

scan_waf "performance-efficiency" "Regex without bounds in user input" "MEDIUM" 6 \
  "new RegExp\([^)]*req\."

# ═══════════════════════════════════════════════════════
# RESPONSIBLE AI PILLAR
# ═══════════════════════════════════════════════════════

scan_waf "responsible-ai" "System prompt without safety boundary" "MEDIUM" 6 \
  "role[[:space:]]*[:=][[:space:]]*['\"]system['\"]"

scan_waf "responsible-ai" "Raw user input passed to LLM prompt" "HIGH" 12 \
  "(user_input|req\.body|request\.body)[^.]*\+.*prompt"

scan_waf "responsible-ai" "LLM output used without validation" "MEDIUM" 6 \
  "(completion|response)\.(choices|data|text)[^;]*;[[:space:]]*$"

scan_waf "responsible-ai" "PII field names in prompt template" "HIGH" 10 \
  "(email|phone|ssn|social_security|date_of_birth|credit_card).*\{.*\}"

scan_waf "responsible-ai" "Missing content safety filter" "MEDIUM" 8 \
  "openai\.(chat\.completions|completions)\.create\("

scan_waf "responsible-ai" "Temperature set above 1.0" "LOW" 4 \
  "temperature[[:space:]]*[:=][[:space:]]*[1-9]\.[0-9]|temperature[[:space:]]*[:=][[:space:]]*2"

# ═══════════════════════════════════════════════════════
# REPORT
# ═══════════════════════════════════════════════════════

echo ""
echo "🏛️  FAI WAF Compliance Report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Timestamp: ${TIMESTAMP}"
echo "  Threshold: ${THRESHOLD}/100"
echo ""

FAILING_PILLARS=0
for p in "${PILLARS[@]}"; do
  local_score="${PILLAR_SCORES[$p]}"
  local_count="${PILLAR_FINDINGS[$p]}"
  if [ "$local_score" -lt "$THRESHOLD" ]; then
    status="FAIL"
    FAILING_PILLARS=$((FAILING_PILLARS + 1))
  elif [ "$local_count" -gt 0 ]; then
    status="WARN"
  else
    status="PASS"
  fi
  printf "  %-28s %3d/100  (%d findings)  [%s]\n" "$p" "$local_score" "$local_count" "$status"
done

echo ""

if [ "$TOTAL_FINDINGS" -gt 0 ]; then
  echo "  Findings Detail:"
  echo "  ─────────────────────────────────────"
  echo -e "$OUTPUT"
fi

# ─── JSON report (optional) ───────────────────────────
if [ -n "$REPORT_FILE" ]; then
  {
    echo "{"
    echo "  \"timestamp\": \"${TIMESTAMP}\","
    echo "  \"threshold\": ${THRESHOLD},"
    echo "  \"totalFindings\": ${TOTAL_FINDINGS},"
    echo "  \"failingPillars\": ${FAILING_PILLARS},"
    echo "  \"pillars\": {"
    first=true
    for p in "${PILLARS[@]}"; do
      $first || echo ","
      first=false
      printf "    \"%s\": { \"score\": %d, \"findings\": %d }" "$p" "${PILLAR_SCORES[$p]}" "${PILLAR_FINDINGS[$p]}"
    done
    echo ""
    echo "  }"
    echo "}"
  } > "$REPORT_FILE"
  echo "  Report written to: ${REPORT_FILE}"
fi

# ─── Exit decision ─────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$FAILING_PILLARS" -eq 0 ] && [ "$TOTAL_FINDINGS" -eq 0 ]; then
  echo "  ✅ All 6 WAF pillars pass."
  exit 0
fi

if [ "$MODE" = "block" ] && [ "$FAILING_PILLARS" -gt 0 ]; then
  echo "  🚫 BLOCKED — ${FAILING_PILLARS} pillar(s) below threshold (${THRESHOLD}/100)."
  echo "  Docs: https://learn.microsoft.com/azure/well-architected/"
  exit 1
else
  echo "  ⚠️  ${TOTAL_FINDINGS} finding(s), ${FAILING_PILLARS} pillar(s) below threshold."
  [ "$MODE" != "block" ] && echo "  Set WAF_MODE=block to enforce."
  exit 0
fi
