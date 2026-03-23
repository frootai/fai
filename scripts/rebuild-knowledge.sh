#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# FrootAI — Rebuild Knowledge Bundle
# ─────────────────────────────────────────────────────────────────────
# Rebuilds knowledge.json from docs/ and syncs it across packages.
#
# Usage:
#   ./scripts/rebuild-knowledge.sh              # Rebuild only
#   ./scripts/rebuild-knowledge.sh --publish    # Rebuild + bump version + npm publish
#
# What it does:
#   1. Runs build-knowledge.js to regenerate knowledge.json from docs/
#   2. Copies the new knowledge.json to vscode-extension/
#   3. Prints diff stats (old size vs new size, module count)
#   4. Optionally bumps version and publishes to npm (--publish flag)
# ─────────────────────────────────────────────────────────────────────

set -euo pipefail

# ─── Colors & Helpers ───────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()  { echo -e "${CYAN}ℹ ${NC} $*"; }
ok()    { echo -e "${GREEN}✅${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠️ ${NC} $*"; }
fail()  { echo -e "${RED}❌${NC} $*"; exit 1; }

# ─── Parse Arguments ────────────────────────────────────────────────
PUBLISH=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --publish) PUBLISH=true; shift ;;
    -h|--help)
      echo "Usage: $0 [--publish]"
      echo "  --publish   Bump patch version and publish MCP server to npm"
      exit 0 ;;
    *) fail "Unknown argument: $1" ;;
  esac
done

# ─── Resolve Paths ──────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_DIR="$REPO_ROOT/mcp-server"
VSCODE_DIR="$REPO_ROOT/vscode-extension"
KNOWLEDGE_MCP="$MCP_DIR/knowledge.json"
KNOWLEDGE_VSCODE="$VSCODE_DIR/knowledge.json"

echo -e "\n${BOLD}🌳 FrootAI — Rebuilding Knowledge Bundle${NC}\n"

# ─── Step 1: Capture old stats ──────────────────────────────────────
OLD_SIZE=0
OLD_MODULES=0
if [[ -f "$KNOWLEDGE_MCP" ]]; then
  OLD_SIZE=$(wc -c < "$KNOWLEDGE_MCP" | tr -d ' ')
  OLD_MODULES=$(node -e "const k=JSON.parse(require('fs').readFileSync('$KNOWLEDGE_MCP','utf-8')); console.log(Object.keys(k.modules||{}).length)" 2>/dev/null || echo "0")
fi

info "Old bundle: ${OLD_SIZE} bytes, ${OLD_MODULES} modules"

# ─── Step 2: Rebuild knowledge.json ────────────────────────────────
info "Running build-knowledge.js..."
cd "$MCP_DIR"
node build-knowledge.js || fail "build-knowledge.js failed"

# ─── Step 3: Capture new stats ──────────────────────────────────────
NEW_SIZE=$(wc -c < "$KNOWLEDGE_MCP" | tr -d ' ')
NEW_MODULES=$(node -e "const k=JSON.parse(require('fs').readFileSync('$KNOWLEDGE_MCP','utf-8')); console.log(Object.keys(k.modules||{}).length)" 2>/dev/null || echo "?")

# ─── Step 4: Sync to vscode-extension ──────────────────────────────
info "Syncing knowledge.json → vscode-extension/"
cp "$KNOWLEDGE_MCP" "$KNOWLEDGE_VSCODE"
ok "Copied to vscode-extension/knowledge.json"

# ─── Step 5: Print diff stats ──────────────────────────────────────
echo ""
echo -e "${BOLD}📊 Knowledge Bundle Stats${NC}"
echo -e "  Old size:    ${OLD_SIZE} bytes"
echo -e "  New size:    ${NEW_SIZE} bytes"

if [[ "$OLD_SIZE" -gt 0 ]]; then
  DIFF=$((NEW_SIZE - OLD_SIZE))
  if [[ "$DIFF" -ge 0 ]]; then
    echo -e "  Delta:       ${GREEN}+${DIFF} bytes${NC}"
  else
    echo -e "  Delta:       ${RED}${DIFF} bytes${NC}"
  fi
fi

echo -e "  Old modules: ${OLD_MODULES}"
echo -e "  New modules: ${NEW_MODULES}"
echo ""

# ─── Step 6: Publish (optional) ────────────────────────────────────
if [[ "$PUBLISH" == "true" ]]; then
  info "Bumping patch version..."
  cd "$MCP_DIR"
  npm version patch --no-git-tag-version
  NEW_VERSION=$(node -e "console.log(require('./package.json').version)")
  info "Publishing frootai-mcp@${NEW_VERSION} to npm..."
  npm publish --access public
  ok "Published frootai-mcp@${NEW_VERSION}"
else
  info "Skipping publish (use --publish to bump version and publish to npm)"
fi

echo ""
ok "Knowledge rebuild complete! 🌳"
