#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FrootAI License Checker
# Scans dependencies for license compliance across npm,
# pip, NuGet, and Go ecosystems. Categorizes licenses as
# permissive/copyleft/proprietary/unknown with SPDX
# identifiers and configurable allowlist/blocklist.
#
# ENV:
#   CHECKER_MODE       = warn (default) | block
#   LICENSE_ALLOWLIST  = (optional) pipe-delimited allowed SPDX IDs
#   LICENSE_BLOCKLIST  = (optional) pipe-delimited blocked SPDX IDs
#   LICENSE_REPORT     = (optional) path to write JSON report
#   LICENSE_UNKNOWN    = warn (default) | block | ignore
#
# Exit: 0 = clean or warn mode, 1 = block mode + violations
# ─────────────────────────────────────────────────────────
set -euo pipefail

MODE="${CHECKER_MODE:-warn}"
ALLOWLIST="${LICENSE_ALLOWLIST:-}"
BLOCKLIST="${LICENSE_BLOCKLIST:-}"
REPORT_FILE="${LICENSE_REPORT:-}"
UNKNOWN_POLICY="${LICENSE_UNKNOWN:-warn}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")

FINDINGS=0
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
UNKNOWN_COUNT=0
SCANNED_COUNT=0
OUTPUT=""
ECOSYSTEM_SUMMARY=""

# ─── SPDX license categories ──────────────────────────
COPYLEFT_STRONG="GPL-2\.0|GPL-3\.0|AGPL-1\.0|AGPL-3\.0|SSPL|OSL-3\.0|EUPL-1\.[12]|RPL-1\.[15]|CPAL-1\.0"
COPYLEFT_WEAK="LGPL-2\.0|LGPL-2\.1|LGPL-3\.0|MPL-2\.0|EPL-[12]\.0|CPL-1\.0|CDDL-1\.[01]"
PERMISSIVE="MIT|Apache-2\.0|BSD-[23]-Clause|ISC|0BSD|Unlicense|CC0-1\.0|Zlib|PSF-2\.0|BSL-1\.0|Artistic-2\.0"
PROPRIETARY="Proprietary|Commercial|BUSL-1\.1|Elastic-2\.0|SSPL-1\.0|Confluent"

# ─── Category classifier ──────────────────────────────
classify_license() {
  local license="$1"
  if [ -z "$license" ] || [ "$license" = "UNKNOWN" ]; then
    echo "unknown"
  elif echo "$license" | grep -qiE "$COPYLEFT_STRONG"; then
    echo "copyleft-strong"
  elif echo "$license" | grep -qiE "$COPYLEFT_WEAK"; then
    echo "copyleft-weak"
  elif echo "$license" | grep -qiE "$PERMISSIVE"; then
    echo "permissive"
  elif echo "$license" | grep -qiE "$PROPRIETARY"; then
    echo "proprietary"
  else
    echo "unknown"
  fi
}

severity_from_category() {
  local cat="$1"
  case "$cat" in
    copyleft-strong) echo "CRITICAL" ;;
    proprietary)     echo "CRITICAL" ;;
    copyleft-weak)   echo "HIGH" ;;
    unknown)         echo "MEDIUM" ;;
    *)               echo "LOW" ;;
  esac
}

is_blocked() {
  local license="$1"
  [ -n "$BLOCKLIST" ] && echo "$license" | grep -qiE "$BLOCKLIST" && return 0
  return 1
}

is_explicitly_allowed() {
  local license="$1"
  [ -n "$ALLOWLIST" ] && echo "$license" | grep -qiE "$ALLOWLIST" && return 0
  return 1
}

# ─── Finding recorder ─────────────────────────────────
add_finding() {
  local ecosystem="$1"
  local package="$2"
  local license="$3"
  local category="$4"
  local severity="$5"

  FINDINGS=$((FINDINGS + 1))
  case "$severity" in
    CRITICAL) CRITICAL_COUNT=$((CRITICAL_COUNT + 1)) ;;
    HIGH)     HIGH_COUNT=$((HIGH_COUNT + 1)) ;;
    MEDIUM)   MEDIUM_COUNT=$((MEDIUM_COUNT + 1)) ;;
  esac
  OUTPUT="${OUTPUT}  [${severity}] ${ecosystem}: ${package} — ${license} (${category})\n"
}

# ─── Check single dependency ──────────────────────────
check_dependency() {
  local ecosystem="$1"
  local package="$2"
  local license="$3"

  SCANNED_COUNT=$((SCANNED_COUNT + 1))
  [ -z "$license" ] && license="UNKNOWN"

  # Explicit allowlist → skip
  is_explicitly_allowed "$license" && return

  # Explicit blocklist → always flag
  if is_blocked "$license"; then
    add_finding "$ecosystem" "$package" "$license" "blocklisted" "CRITICAL"
    return
  fi

  local category
  category=$(classify_license "$license")
  local severity
  severity=$(severity_from_category "$category")

  case "$category" in
    copyleft-strong|proprietary)
      add_finding "$ecosystem" "$package" "$license" "$category" "$severity"
      ;;
    copyleft-weak)
      add_finding "$ecosystem" "$package" "$license" "$category" "$severity"
      ;;
    unknown)
      UNKNOWN_COUNT=$((UNKNOWN_COUNT + 1))
      [ "$UNKNOWN_POLICY" != "ignore" ] && \
        add_finding "$ecosystem" "$package" "$license" "$category" "$severity"
      ;;
  esac
}

# ═══════════════════════════════════════════════════════
# NPM ECOSYSTEM
# ═══════════════════════════════════════════════════════

check_npm() {
  [ ! -f "package.json" ] && return
  [ ! -d "node_modules" ] && return

  local npm_count=0

  while IFS= read -r pkg_json; do
    [ ! -f "$pkg_json" ] && continue

    local name license
    name=$(grep -oE '"name"[[:space:]]*:[[:space:]]*"[^"]+"' "$pkg_json" 2>/dev/null | head -1 | sed 's/.*"name"[[:space:]]*:[[:space:]]*"//' | sed 's/"//' || true)
    license=$(grep -oE '"license"[[:space:]]*:[[:space:]]*"[^"]+"' "$pkg_json" 2>/dev/null | head -1 | sed 's/.*"license"[[:space:]]*:[[:space:]]*"//' | sed 's/"//' || true)

    [ -z "$name" ] && continue
    npm_count=$((npm_count + 1))
    check_dependency "npm" "$name" "$license"
  done < <(find node_modules -maxdepth 2 -name "package.json" -not -path "*/node_modules/*/node_modules/*" 2>/dev/null || true)

  ECOSYSTEM_SUMMARY="${ECOSYSTEM_SUMMARY}  npm: ${npm_count} packages scanned\n"
}

# ═══════════════════════════════════════════════════════
# PIP ECOSYSTEM
# ═══════════════════════════════════════════════════════

check_pip() {
  local has_reqs=false
  [ -f "requirements.txt" ] && has_reqs=true
  [ -f "pyproject.toml" ] && has_reqs=true
  [ -f "setup.py" ] && has_reqs=true
  [ "$has_reqs" = false ] && return

  local pip_cmd=""
  command -v pip3 &>/dev/null && pip_cmd="pip3"
  [ -z "$pip_cmd" ] && command -v pip &>/dev/null && pip_cmd="pip"
  [ -z "$pip_cmd" ] && return

  local pip_count=0
  local packages=""

  if [ -f "requirements.txt" ]; then
    packages=$(grep -vE '^[[:space:]]*(#|$|--)' requirements.txt | sed 's/[><=!;].*//' | sed 's/\[.*//' | tr -d '[:space:]' || true)
  fi

  [ -z "$packages" ] && return

  while IFS= read -r pkg; do
    [ -z "$pkg" ] && continue
    local info
    info=$($pip_cmd show "$pkg" 2>/dev/null || true)
    [ -z "$info" ] && continue

    local license
    license=$(echo "$info" | grep -i '^License:' | sed 's/^License:[[:space:]]*//' || true)
    [ -z "$license" ] && license="UNKNOWN"

    pip_count=$((pip_count + 1))
    check_dependency "pip" "$pkg" "$license"
  done <<< "$packages"

  ECOSYSTEM_SUMMARY="${ECOSYSTEM_SUMMARY}  pip: ${pip_count} packages scanned\n"
}

# ═══════════════════════════════════════════════════════
# NUGET ECOSYSTEM
# ═══════════════════════════════════════════════════════

check_nuget() {
  local found_csproj=false
  for f in *.csproj */*.csproj; do
    [ -f "$f" ] && found_csproj=true && break
  done
  [ "$found_csproj" = false ] && return

  local nuget_count=0

  while IFS= read -r csproj; do
    [ ! -f "$csproj" ] && continue
    local refs
    refs=$(grep -oE 'Include="[^"]+"\s+Version="[^"]+"' "$csproj" 2>/dev/null || true)
    [ -z "$refs" ] && continue

    while IFS= read -r ref; do
      local name
      name=$(echo "$ref" | sed 's/Include="//' | sed 's/".*//')
      [ -z "$name" ] && continue

      local license="UNKNOWN"
      local cache_dir="${HOME}/.nuget/packages/${name,,}"
      if [ -d "$cache_dir" ]; then
        local nuspec
        nuspec=$(find "$cache_dir" -name "*.nuspec" -print -quit 2>/dev/null || true)
        if [ -n "$nuspec" ]; then
          license=$(grep -oE '<license[^>]*>[^<]+</license>' "$nuspec" 2>/dev/null | sed 's/<[^>]*>//g' || echo "UNKNOWN")
        fi
      fi

      nuget_count=$((nuget_count + 1))
      check_dependency "nuget" "$name" "$license"
    done <<< "$refs"
  done < <(find . -maxdepth 3 -name "*.csproj" 2>/dev/null || true)

  [ "$nuget_count" -gt 0 ] && ECOSYSTEM_SUMMARY="${ECOSYSTEM_SUMMARY}  nuget: ${nuget_count} packages scanned\n"
}

# ═══════════════════════════════════════════════════════
# GO ECOSYSTEM
# ═══════════════════════════════════════════════════════

check_go() {
  [ ! -f "go.mod" ] && return
  command -v go &>/dev/null || return

  local go_count=0
  local deps
  deps=$(grep -E '^\t[a-z]' go.mod 2>/dev/null | awk '{print $1}' || true)
  [ -z "$deps" ] && return

  local gopath
  gopath=$(go env GOPATH 2>/dev/null || echo "$HOME/go")

  while IFS= read -r dep; do
    [ -z "$dep" ] && continue
    local dep_dir="${gopath}/pkg/mod/${dep}"

    local license_file=""
    for f in "${dep_dir}"*/LICENSE*; do
      [ -f "$f" ] && license_file="$f" && break
    done
    [ -z "$license_file" ] && continue

    local license_text
    license_text=$(head -20 "$license_file" 2>/dev/null || true)

    local detected="UNKNOWN"
    if echo "$license_text" | grep -qiE "MIT License"; then detected="MIT"
    elif echo "$license_text" | grep -qiE "Apache License.*2\.0"; then detected="Apache-2.0"
    elif echo "$license_text" | grep -qiE "BSD"; then detected="BSD-3-Clause"
    elif echo "$license_text" | grep -qiE "AFFERO|AGPL"; then detected="AGPL-3.0"
    elif echo "$license_text" | grep -qiE "GNU GENERAL PUBLIC LICENSE.*Version 3"; then detected="GPL-3.0"
    elif echo "$license_text" | grep -qiE "GNU GENERAL PUBLIC LICENSE.*Version 2"; then detected="GPL-2.0"
    elif echo "$license_text" | grep -qiE "LESSER GENERAL PUBLIC|LGPL"; then detected="LGPL-3.0"
    elif echo "$license_text" | grep -qiE "SSPL|Server Side Public License"; then detected="SSPL"
    elif echo "$license_text" | grep -qiE "Mozilla Public License.*2\.0"; then detected="MPL-2.0"
    fi

    go_count=$((go_count + 1))
    check_dependency "go" "$dep" "$detected"
  done <<< "$deps"

  [ "$go_count" -gt 0 ] && ECOSYSTEM_SUMMARY="${ECOSYSTEM_SUMMARY}  go: ${go_count} modules scanned\n"
}

# ─── Run all ecosystem checks ─────────────────────────
check_npm
check_pip
check_nuget
check_go

# ═══════════════════════════════════════════════════════
# REPORT
# ═══════════════════════════════════════════════════════

echo ""
echo "📋 FrootAI License Checker"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Timestamp: ${TIMESTAMP}"
echo "  Scanned:   ${SCANNED_COUNT} dependencies"
echo ""
echo -e "$ECOSYSTEM_SUMMARY"

if [ "$FINDINGS" -eq 0 ]; then
  echo "  ✅ No license compliance issues detected."
  exit 0
fi

echo "  Found ${FINDINGS} license issue(s):"
printf "    Critical: %d  |  High: %d  |  Medium: %d  |  Unknown: %d\n" \
  "$CRITICAL_COUNT" "$HIGH_COUNT" "$MEDIUM_COUNT" "$UNKNOWN_COUNT"
echo ""
echo -e "$OUTPUT"

# ─── JSON report (optional) ───────────────────────────
if [ -n "$REPORT_FILE" ]; then
  {
    echo "{"
    echo "  \"timestamp\": \"${TIMESTAMP}\","
    echo "  \"scanned\": ${SCANNED_COUNT},"
    echo "  \"findings\": ${FINDINGS},"
    echo "  \"critical\": ${CRITICAL_COUNT},"
    echo "  \"high\": ${HIGH_COUNT},"
    echo "  \"medium\": ${MEDIUM_COUNT},"
    echo "  \"unknown\": ${UNKNOWN_COUNT}"
    echo "}"
  } > "$REPORT_FILE"
  echo "  Report: ${REPORT_FILE}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$MODE" = "block" ] && [ "$CRITICAL_COUNT" -gt 0 ]; then
  echo "  🚫 BLOCKED — ${CRITICAL_COUNT} critical license issue(s)."
  echo "  Docs: https://choosealicense.com"
  exit 1
elif [ "$MODE" = "block" ] && [ "$UNKNOWN_POLICY" = "block" ] && [ "$UNKNOWN_COUNT" -gt 0 ]; then
  echo "  🚫 BLOCKED — ${UNKNOWN_COUNT} unknown license(s) (LICENSE_UNKNOWN=block)."
  exit 1
else
  [ "$FINDINGS" -gt 0 ] && echo "  ⚠️  WARNING — license issues detected (mode=${MODE})."
  [ "$MODE" != "block" ] && echo "  Set CHECKER_MODE=block to enforce."
  exit 0
fi
