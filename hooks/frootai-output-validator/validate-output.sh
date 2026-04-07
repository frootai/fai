#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FrootAI Output Validator
# Validates LLM-generated code and config files against:
#   1. FrootAI naming & frontmatter conventions
#   2. JSON schema structure
#   3. Content safety (profanity, hate, violence markers)
#   4. Factual grounding (hallucination markers)
#   5. Format compliance (markdown structure)
#   6. Length constraints
#   7. PII detection
#
# ENV:
#   VALIDATE_MODE      = warn (default) | block
#   VALIDATE_MAX_LINES = 500 (default) max lines per file
#   VALIDATE_SAFETY    = on (default) | off
#   VALIDATE_REPORT    = (optional) path to write JSON report
#
# Exit: 0 = clean or warn mode, 1 = block mode + violations
# ─────────────────────────────────────────────────────────
set -euo pipefail

MODE="${VALIDATE_MODE:-warn}"
MAX_LINES="${VALIDATE_MAX_LINES:-500}"
SAFETY_CHECK="${VALIDATE_SAFETY:-on}"
REPORT_FILE="${VALIDATE_REPORT:-}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")

FINDINGS=0
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
LOW_COUNT=0
WARNINGS=0
OUTPUT=""
FILES_CHECKED=0

# ─── Collect changed files ────────────────────────────
CHANGED_FILES=$(git diff --name-only 2>/dev/null || echo "")
STAGED_FILES=$(git diff --cached --name-only 2>/dev/null || echo "")
ALL_CHANGED=$(printf "%s\n%s" "$CHANGED_FILES" "$STAGED_FILES" | sort -u | grep -v '^$' || true)

if [ -z "$ALL_CHANGED" ]; then
  echo "✅ FrootAI Output Validator: no changes to validate."
  exit 0
fi

# ─── Finding recorder ─────────────────────────────────
record() {
  local level="$1"
  local file="$2"
  local check="$3"
  local message="$4"

  case "$level" in
    CRITICAL) FINDINGS=$((FINDINGS + 1)); CRITICAL_COUNT=$((CRITICAL_COUNT + 1)) ;;
    HIGH)     FINDINGS=$((FINDINGS + 1)); HIGH_COUNT=$((HIGH_COUNT + 1)) ;;
    MEDIUM)   FINDINGS=$((FINDINGS + 1)); MEDIUM_COUNT=$((MEDIUM_COUNT + 1)) ;;
    LOW)      FINDINGS=$((FINDINGS + 1)); LOW_COUNT=$((LOW_COUNT + 1)) ;;
    WARN)     WARNINGS=$((WARNINGS + 1)) ;;
  esac

  OUTPUT="${OUTPUT}  [${level}] ${check}: ${file}\n     ${message}\n"
}

# ═══════════════════════════════════════════════════════
# 1. NAMING CONVENTION (lowercase-hyphen)
# ═══════════════════════════════════════════════════════

check_naming() {
  local file="$1"
  local basename
  basename=$(basename "$file")

  case "$basename" in
    *.agent.md|*.instructions.md|*.prompt.md|hooks.json|SKILL.md|plugin.json|fai-manifest.json|fai-context.json) ;;
    *) return ;;
  esac

  # File name check (SKILL.md and JSON configs are exempt)
  if [ "$basename" != "SKILL.md" ] && [ "$basename" != "hooks.json" ] && \
     [ "$basename" != "plugin.json" ] && [ "$basename" != "fai-manifest.json" ] && \
     [ "$basename" != "fai-context.json" ]; then
    local name_part
    name_part=$(echo "$basename" | sed 's/\.\(agent\|instructions\|prompt\)\.md$//')
    if echo "$name_part" | grep -qE '[A-Z_]'; then
      record "MEDIUM" "$file" "NAMING" "file name '${basename}' must be lowercase-hyphen"
    fi
  fi

  local dirname
  dirname=$(basename "$(dirname "$file")")
  if echo "$dirname" | grep -qE '[A-Z_]' && [ "$dirname" != "." ]; then
    record "MEDIUM" "$file" "NAMING" "directory '${dirname}' must be lowercase-hyphen"
  fi
}

# ═══════════════════════════════════════════════════════
# 2. AGENT FRONTMATTER
# ═══════════════════════════════════════════════════════

check_agent_frontmatter() {
  local file="$1"
  [ ! -f "$file" ] && return

  local first_line
  first_line=$(head -1 "$file" 2>/dev/null || echo "")
  if [ "$first_line" != "---" ]; then
    record "HIGH" "$file" "FRONTMATTER" "missing YAML frontmatter (must start with ---)"
    return
  fi

  local frontmatter
  frontmatter=$(sed -n '1,/^---$/{ /^---$/!p; }' "$file" 2>/dev/null | tail -n +1 | head -50)

  if ! echo "$frontmatter" | grep -qE '^description:'; then
    record "HIGH" "$file" "FRONTMATTER" "missing required 'description' field"
  else
    local desc
    desc=$(echo "$frontmatter" | grep -E '^description:' | sed 's/^description:[[:space:]]*//' | tr -d '"'"'")
    if [ ${#desc} -lt 10 ]; then
      record "HIGH" "$file" "FRONTMATTER" "description must be >= 10 characters (got ${#desc})"
    fi
  fi

  # Validate WAF references
  if echo "$frontmatter" | grep -qE '^waf:'; then
    local valid_pillars="reliability|security|cost-optimization|operational-excellence|performance-efficiency|responsible-ai"
    local waf_values
    waf_values=$(echo "$frontmatter" | sed -n '/^waf:/,/^[a-z]/p' | grep -E '^\s*-' | sed 's/.*-[[:space:]]*//')
    while IFS= read -r val; do
      [ -z "$val" ] && continue
      if ! echo "$val" | grep -qiE "^(${valid_pillars})$"; then
        record "MEDIUM" "$file" "WAF_REF" "invalid WAF pillar: '${val}'"
      fi
    done <<< "$waf_values"
  fi
}

# ═══════════════════════════════════════════════════════
# 3. INSTRUCTION FRONTMATTER
# ═══════════════════════════════════════════════════════

check_instruction_frontmatter() {
  local file="$1"
  [ ! -f "$file" ] && return

  local first_line
  first_line=$(head -1 "$file" 2>/dev/null || echo "")
  if [ "$first_line" != "---" ]; then
    record "HIGH" "$file" "FRONTMATTER" "missing YAML frontmatter (must start with ---)"
    return
  fi

  local frontmatter
  frontmatter=$(sed -n '1,/^---$/{ /^---$/!p; }' "$file" 2>/dev/null | tail -n +1 | head -50)

  if ! echo "$frontmatter" | grep -qE '^description:'; then
    record "HIGH" "$file" "FRONTMATTER" "missing required 'description' field"
  fi

  if ! echo "$frontmatter" | grep -qE '^applyTo:'; then
    record "HIGH" "$file" "FRONTMATTER" "missing required 'applyTo' glob pattern"
  fi
}

# ═══════════════════════════════════════════════════════
# 4. HOOKS.JSON SCHEMA
# ═══════════════════════════════════════════════════════

check_hook_schema() {
  local file="$1"
  [ ! -f "$file" ] && return

  # JSON syntax check
  if command -v node &>/dev/null; then
    if ! node -e "JSON.parse(require('fs').readFileSync('$file','utf8'))" 2>/dev/null; then
      record "CRITICAL" "$file" "JSON_SCHEMA" "invalid JSON syntax"
      return
    fi
  fi

  if ! grep -q '"version"[[:space:]]*:[[:space:]]*1' "$file"; then
    record "HIGH" "$file" "JSON_SCHEMA" "missing or invalid 'version: 1'"
  fi

  local has_event=false
  for event in sessionStart sessionEnd userPromptSubmitted preToolUse; do
    grep -q "\"${event}\"" "$file" && has_event=true && break
  done

  [ "$has_event" = false ] && record "HIGH" "$file" "JSON_SCHEMA" "no valid event key found"
}

# ═══════════════════════════════════════════════════════
# 5. FAI-MANIFEST SCHEMA
# ═══════════════════════════════════════════════════════

check_fai_manifest() {
  local file="$1"
  [ ! -f "$file" ] && return

  if command -v node &>/dev/null; then
    if ! node -e "JSON.parse(require('fs').readFileSync('$file','utf8'))" 2>/dev/null; then
      record "CRITICAL" "$file" "JSON_SCHEMA" "invalid JSON syntax"
      return
    fi
  fi

  grep -q '"play"' "$file" || record "HIGH" "$file" "FAI_MANIFEST" "missing 'play' field"
  grep -q '"version"' "$file" || record "HIGH" "$file" "FAI_MANIFEST" "missing 'version' field"
  grep -q '"knowledge"' "$file" || record "MEDIUM" "$file" "FAI_MANIFEST" "missing 'context.knowledge'"
  grep -q '"primitives"' "$file" || record "HIGH" "$file" "FAI_MANIFEST" "missing 'primitives' block"
}

# ═══════════════════════════════════════════════════════
# 6. CONTENT SAFETY
# ═══════════════════════════════════════════════════════

check_content_safety() {
  local file="$1"
  [ "$SAFETY_CHECK" = "off" ] && return
  [ ! -f "$file" ] && return

  case "$file" in
    *.md|*.txt|*.json|*.yaml|*.yml|*.ts|*.js|*.py) ;;
    *) return ;;
  esac

  local content
  content=$(cat "$file" 2>/dev/null || echo "")
  local content_lower
  content_lower=$(echo "$content" | tr '[:upper:]' '[:lower:]')

  if echo "$content_lower" | grep -qE '\b(kill\s+all|exterminate|genocide|ethnic\s+cleansing)\b'; then
    record "CRITICAL" "$file" "CONTENT_SAFETY" "violent/hateful content detected"
  fi

  if echo "$content_lower" | grep -qE '\b(how\s+to\s+(make|build)\s+(a\s+)?(bomb|weapon|explosive))\b'; then
    record "CRITICAL" "$file" "CONTENT_SAFETY" "harmful instruction content detected"
  fi

  # PII in non-test files
  if ! echo "$file" | grep -qiE '(test|spec|mock|fixture|__test__)'; then
    if echo "$content" | grep -qE '\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b'; then
      record "HIGH" "$file" "PII_DETECTION" "possible SSN pattern found"
    fi
    if echo "$content" | grep -qE '\b[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}\b'; then
      record "HIGH" "$file" "PII_DETECTION" "possible credit card number found"
    fi
    if echo "$content" | grep -qE '"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"'; then
      record "LOW" "$file" "PII_DETECTION" "hardcoded email address found"
    fi
  fi
}

# ═══════════════════════════════════════════════════════
# 7. HALLUCINATION MARKERS
# ═══════════════════════════════════════════════════════

check_hallucination_markers() {
  local file="$1"
  [ ! -f "$file" ] && return

  case "$file" in
    *.md|*.txt) ;;
    *) return ;;
  esac

  local content
  content=$(cat "$file" 2>/dev/null || echo "")

  if echo "$content" | grep -qE 'As of my (last |knowledge )?cutoff|As an AI( language model)?'; then
    record "MEDIUM" "$file" "HALLUCINATION" "LLM self-reference — likely hallucinated content"
  fi

  if echo "$content" | grep -qE 'I (cannot|can.t) (verify|confirm|access)'; then
    record "LOW" "$file" "HALLUCINATION" "LLM uncertainty marker — review factual claims"
  fi

  if echo "$content" | grep -qiE 'Azure (Quantum Computing|Neural Search|Smart Cache|AI Gateway)'; then
    record "MEDIUM" "$file" "HALLUCINATION" "possible hallucinated Azure service name"
  fi

  if echo "$content" | grep -qE '\[TODO\]|\[PLACEHOLDER\]|\[INSERT .*\]|\[YOUR .*\]|lorem ipsum'; then
    record "MEDIUM" "$file" "PLACEHOLDER" "unresolved placeholder text"
  fi
}

# ═══════════════════════════════════════════════════════
# 8. LENGTH CONSTRAINTS
# ═══════════════════════════════════════════════════════

check_length() {
  local file="$1"
  [ ! -f "$file" ] && return

  local line_count
  line_count=$(wc -l < "$file" 2>/dev/null || echo "0")

  if [ "$line_count" -gt "$MAX_LINES" ]; then
    record "LOW" "$file" "LENGTH" "file has ${line_count} lines (max: ${MAX_LINES})"
  fi

  if grep -qE '.{500}' "$file" 2>/dev/null; then
    record "LOW" "$file" "LENGTH" "line exceeds 500 characters — consider wrapping"
  fi
}

# ═══════════════════════════════════════════════════════
# 9. MARKDOWN STRUCTURE
# ═══════════════════════════════════════════════════════

check_markdown_structure() {
  local file="$1"
  [ ! -f "$file" ] && return

  case "$file" in
    *.md) ;;
    *) return ;;
  esac

  if ! head -20 "$file" | grep -qE '^# '; then
    record "LOW" "$file" "MARKDOWN" "missing H1 heading in first 20 lines"
  fi

  local prev_level=0
  while IFS= read -r line; do
    local hashes
    hashes=$(echo "$line" | grep -oE '^#{1,6}' || true)
    [ -z "$hashes" ] && continue
    local level=${#hashes}
    if [ "$prev_level" -gt 0 ] && [ "$level" -gt $((prev_level + 1)) ]; then
      record "LOW" "$file" "MARKDOWN" "skipped heading level: H${prev_level} -> H${level}"
      break
    fi
    prev_level=$level
  done < "$file"
}

# ═══════════════════════════════════════════════════════
# PROCESS FILES
# ═══════════════════════════════════════════════════════

while IFS= read -r file; do
  [ -z "$file" ] && continue
  [ ! -f "$file" ] && continue
  FILES_CHECKED=$((FILES_CHECKED + 1))

  check_naming "$file"
  check_length "$file"
  check_content_safety "$file"
  check_hallucination_markers "$file"

  case "$file" in
    *.agent.md)
      check_agent_frontmatter "$file"
      check_markdown_structure "$file"
      ;;
    *.instructions.md)
      check_instruction_frontmatter "$file"
      check_markdown_structure "$file"
      ;;
    */hooks.json)
      check_hook_schema "$file"
      ;;
    */fai-manifest.json)
      check_fai_manifest "$file"
      ;;
    *.md)
      check_markdown_structure "$file"
      ;;
  esac
done <<< "$ALL_CHANGED"

# ─── Run validate-primitives.js if available ───────────
VALIDATOR="scripts/validate-primitives.js"
if [ -f "$VALIDATOR" ] && command -v node &>/dev/null; then
  PRIMITIVE_FILES=$(echo "$ALL_CHANGED" | grep -E '\.(agent|instructions|prompt)\.md$|hooks\.json$|SKILL\.md$|plugin\.json$|fai-manifest\.json$' || true)
  if [ -n "$PRIMITIVE_FILES" ]; then
    echo "  Running validate-primitives.js..."
    if ! node "$VALIDATOR" 2>&1; then
      record "HIGH" "validate-primitives.js" "SCHEMA" "primitive validation failed"
    fi
  fi
fi

# ═══════════════════════════════════════════════════════
# REPORT
# ═══════════════════════════════════════════════════════

echo ""
echo "✅ FrootAI Output Validator"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Timestamp:     ${TIMESTAMP}"
echo "  Files checked: ${FILES_CHECKED}"
echo "  Safety checks: ${SAFETY_CHECK}"
echo ""

if [ "$FINDINGS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo "  ✅ All files pass validation."
  exit 0
fi

if [ "$FINDINGS" -gt 0 ]; then
  echo "  Found ${FINDINGS} violation(s), ${WARNINGS} warning(s):"
  printf "    Critical: %d  |  High: %d  |  Medium: %d  |  Low: %d\n" \
    "$CRITICAL_COUNT" "$HIGH_COUNT" "$MEDIUM_COUNT" "$LOW_COUNT"
  echo ""
  echo -e "$OUTPUT"
fi

# ─── JSON report (optional) ───────────────────────────
if [ -n "$REPORT_FILE" ]; then
  {
    echo "{"
    echo "  \"timestamp\": \"${TIMESTAMP}\","
    echo "  \"filesChecked\": ${FILES_CHECKED},"
    echo "  \"findings\": ${FINDINGS},"
    echo "  \"warnings\": ${WARNINGS},"
    echo "  \"critical\": ${CRITICAL_COUNT},"
    echo "  \"high\": ${HIGH_COUNT},"
    echo "  \"medium\": ${MEDIUM_COUNT},"
    echo "  \"low\": ${LOW_COUNT}"
    echo "}"
  } > "$REPORT_FILE"
  echo "  Report: ${REPORT_FILE}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$MODE" = "block" ] && [ "$CRITICAL_COUNT" -gt 0 ]; then
  echo "  🚫 BLOCKED — ${CRITICAL_COUNT} critical violation(s)."
  echo "  Run: node scripts/validate-primitives.js --verbose"
  exit 1
elif [ "$MODE" = "block" ] && [ "$HIGH_COUNT" -gt 0 ]; then
  echo "  🚫 BLOCKED — ${HIGH_COUNT} high-severity violation(s)."
  exit 1
else
  [ "$FINDINGS" -gt 0 ] && echo "  ⚠️  Violations detected (mode=${MODE})."
  [ "$MODE" != "block" ] && echo "  Set VALIDATE_MODE=block to enforce."
  exit 0
fi
