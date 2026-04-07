#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FrootAI PII Redactor
# Scans uncommitted changes for PII with configurable
# redaction strategy, sensitivity levels, locale-aware
# patterns, and GDPR/HIPAA compliance markers.
#
# ENV:
#   REDACT_MODE       = warn | block (default: warn)
#   REDACT_STRATEGY   = mask | hash | remove (default: mask)
#   REDACT_LOCALE     = us | eu | all (default: all)
#   REDACT_MIN_LEVEL  = low | medium | high | critical (default: medium)
#   REDACT_COMPLIANCE = none | gdpr | hipaa | both (default: none)
#
# Exit: 0 = clean or warn mode, 1 = block mode + findings
# ─────────────────────────────────────────────────────────
set -euo pipefail

# ─── Configuration ─────────────────────────────────────
MODE="${REDACT_MODE:-warn}"
STRATEGY="${REDACT_STRATEGY:-mask}"
LOCALE="${REDACT_LOCALE:-all}"
MIN_LEVEL="${REDACT_MIN_LEVEL:-medium}"
COMPLIANCE="${REDACT_COMPLIANCE:-none}"

FINDINGS=0
OUTPUT=""

# Map severity levels to numbers for comparison
level_num() {
  case "$1" in
    low)      echo 1 ;;
    medium)   echo 2 ;;
    high)     echo 3 ;;
    critical) echo 4 ;;
    *)        echo 2 ;;
  esac
}

MIN_LEVEL_NUM=$(level_num "$MIN_LEVEL")

# ─── Get diff content ──────────────────────────────────
DIFF_CONTENT=$(git diff --unified=0 2>/dev/null || echo "")

if [ -z "$DIFF_CONTENT" ]; then
  echo "🛡️  FrootAI PII Redactor: no changes to scan."
  exit 0
fi

ADDED_LINES=$(echo "$DIFF_CONTENT" | grep '^+[^+]' | sed 's/^+//' || true)

if [ -z "$ADDED_LINES" ]; then
  echo "🛡️  FrootAI PII Redactor: no added lines to scan."
  exit 0
fi

# ─── False positive exclusions ─────────────────────────
FALSE_POSITIVES="example|placeholder|test|dummy|fake|sample|localhost|127\.0\.0\.1|0\.0\.0\.0|255\.255\.255\.255|@example\.com|@example\.org|@test\.com|noreply|foo@bar|user@host|changeme|TODO|FIXME|xxx|000-00-0000|123-45-6789|4111111111111111"

# ─── Redaction helper ──────────────────────────────────
redact() {
  local val="$1"
  local len=${#val}

  case "$STRATEGY" in
    hash)
      if command -v sha256sum >/dev/null 2>&1; then
        printf '%s' "$val" | sha256sum | cut -c1-12
      elif command -v shasum >/dev/null 2>&1; then
        printf '%s' "$val" | shasum -a 256 | cut -c1-12
      else
        echo "[HASHED]"
      fi
      ;;
    remove)
      echo "[REMOVED]"
      ;;
    *)  # mask
      if [ "$len" -le 6 ]; then
        echo "***"
      else
        echo "${val:0:2}***${val:$((len-2)):2}"
      fi
      ;;
  esac
}

# ─── GDPR/HIPAA compliance tags ───────────────────────
compliance_tag() {
  local pii_type="$1"
  local tags=""

  case "$COMPLIANCE" in
    gdpr|both)
      case "$pii_type" in
        EMAIL*|PHONE*|NAME*|DOB*|PASSPORT*|IBAN*)
          tags="GDPR:Art.4(1)" ;;
        SSN*|CC_*|IPV4*)
          tags="GDPR:Art.9" ;;
      esac
      ;;
  esac

  case "$COMPLIANCE" in
    hipaa|both)
      case "$pii_type" in
        EMAIL*|PHONE*|SSN*|DOB*|NAME*)
          tags="${tags:+$tags,}HIPAA:§164.514" ;;
        IPV4*|CC_*)
          tags="${tags:+$tags,}HIPAA:§164.512" ;;
      esac
      ;;
  esac

  if [ -n "$tags" ]; then
    echo " [${tags}]"
  fi
}

# ─── Pattern scanner ───────────────────────────────────
scan_pattern() {
  local name="$1"
  local severity="$2"
  local pattern="$3"

  # Check minimum severity threshold
  local sev_num
  sev_num=$(level_num "$severity")
  if [ "$sev_num" -lt "$MIN_LEVEL_NUM" ]; then
    return
  fi

  local matches
  matches=$(echo "$ADDED_LINES" | grep -iEo "$pattern" 2>/dev/null || true)

  if [ -z "$matches" ]; then
    return
  fi

  while IFS= read -r match; do
    if echo "$match" | grep -qiE "$FALSE_POSITIVES"; then
      continue
    fi
    FINDINGS=$((FINDINGS + 1))
    local redacted
    redacted=$(redact "$match")
    local tag
    tag=$(compliance_tag "$name")
    OUTPUT="${OUTPUT}  ⛔ [${severity^^}] ${name}: ${redacted}${tag}\n"
  done <<< "$matches"
}

# ─── Email Addresses ───────────────────────────────────
scan_pattern "EMAIL_ADDRESS" "high" \
  "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"

# ─── Phone Numbers — US ───────────────────────────────
if [ "$LOCALE" = "us" ] || [ "$LOCALE" = "all" ]; then
  scan_pattern "PHONE_US_PARENS" "high" \
    "\([0-9]{3}\)[[:space:]]*[0-9]{3}-[0-9]{4}"
  scan_pattern "PHONE_US_DASHES" "high" \
    "[0-9]{3}-[0-9]{3}-[0-9]{4}"
  scan_pattern "PHONE_US_INTL" "high" \
    "\+1[0-9]{10}"
fi

# ─── Phone Numbers — EU/UK ────────────────────────────
if [ "$LOCALE" = "eu" ] || [ "$LOCALE" = "all" ]; then
  scan_pattern "PHONE_UK" "high" \
    "\+44[0-9]{10}"
  scan_pattern "PHONE_DE" "high" \
    "\+49[0-9]{10,11}"
  scan_pattern "PHONE_FR" "high" \
    "\+33[0-9]{9}"
fi

# ─── Social Security Numbers ──────────────────────────
scan_pattern "SSN" "critical" \
  "[0-9]{3}-[0-9]{2}-[0-9]{4}"

# ─── Credit Card Numbers ──────────────────────────────
scan_pattern "CC_VISA" "critical" \
  "4[0-9]{3}[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}"
scan_pattern "CC_MASTERCARD" "critical" \
  "5[1-5][0-9]{2}[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}"
scan_pattern "CC_AMEX" "critical" \
  "3[47][0-9]{2}[[:space:]-]?[0-9]{6}[[:space:]-]?[0-9]{5}"
scan_pattern "CC_DISCOVER" "critical" \
  "6(?:011|5[0-9]{2})[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}[[:space:]-]?[0-9]{4}"

# ─── IPv4 Addresses (string literals) ─────────────────
scan_pattern "IPV4_ADDRESS" "medium" \
  "['\"][0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}['\"]"

# ─── Date of Birth ────────────────────────────────────
scan_pattern "DOB_PATTERN" "medium" \
  "(date[_-]?of[_-]?birth|dob|birth[_-]?date)[[:space:]]*[=:][[:space:]]*['\"]?[0-9]{1,4}[-/][0-9]{1,2}[-/][0-9]{1,4}['\"]?"

# ─── IBAN (EU) ─────────────────────────────────────────
if [ "$LOCALE" = "eu" ] || [ "$LOCALE" = "all" ]; then
  scan_pattern "IBAN" "critical" \
    "[A-Z]{2}[0-9]{2}[[:space:]]?[A-Z0-9]{4}[[:space:]]?[0-9]{4}[[:space:]]?[0-9]{4}[[:space:]]?[0-9]{4}[[:space:]]?[0-9]{0,4}"
fi

# ─── Passport Numbers ─────────────────────────────────
scan_pattern "PASSPORT" "high" \
  "(passport[_-]?(number|no|num|id))[[:space:]]*[=:][[:space:]]*['\"]?[A-Z0-9]{6,12}['\"]?"

# ─── Name fields (assignment patterns) ────────────────
scan_pattern "NAME_FIELD" "low" \
  "(full[_-]?name|first[_-]?name|last[_-]?name|surname)[[:space:]]*[=:][[:space:]]*['\"][A-Z][a-z]+"

# ─── Report ────────────────────────────────────────────
echo ""
echo "🛡️  FrootAI PII Redactor — scan results"
echo "─────────────────────────────────────────"
echo "  Strategy:   ${STRATEGY}"
echo "  Locale:     ${LOCALE}"
echo "  Min level:  ${MIN_LEVEL}"
if [ "$COMPLIANCE" != "none" ]; then
  echo "  Compliance: ${COMPLIANCE^^}"
fi
echo "─────────────────────────────────────────"

if [ "$FINDINGS" -eq 0 ]; then
  echo "  ✅ No PII patterns detected."
  exit 0
fi

echo "  Found ${FINDINGS} potential PII pattern(s):"
echo ""
printf '%b' "$OUTPUT"
echo "─────────────────────────────────────────"

if [ "$MODE" = "block" ]; then
  echo "  🚫 BLOCKED — remove PII before committing."
  echo "  Tip: use synthetic/anonymized data for tests."
  exit 1
else
  echo "  ⚠️  WARNING — PII detected (mode=warn)."
  echo "  Set REDACT_MODE=block to enforce."
  exit 0
fi
