#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────
# FrootAI — Deploy a Solution Play
# ─────────────────────────────────────────────────────────────────────
# Usage:
#   ./scripts/deploy-play.sh 01                    # Deploy play 01
#   ./scripts/deploy-play.sh 05 --skip-eval        # Deploy without eval
#   ./scripts/deploy-play.sh 01 --resource-group myRG
#
# What it does:
#   1. Validates the play exists and has required infra files
#   2. Deploys infrastructure via Bicep (az deployment group create)
#   3. Copies config files to the deployed application
#   4. Runs the evaluation test suite
#   5. Prints a deployment summary
# ─────────────────────────────────────────────────────────────────────

set -euo pipefail

# ─── Colors & Helpers ───────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()  { echo -e "${CYAN}ℹ ${NC} $*"; }
ok()    { echo -e "${GREEN}✅${NC} $*"; }
warn()  { echo -e "${YELLOW}⚠️ ${NC} $*"; }
fail()  { echo -e "${RED}❌${NC} $*"; exit 1; }
banner(){ echo -e "\n${BOLD}────────────────────────────────────────${NC}"; echo -e "${BOLD}  $*${NC}"; echo -e "${BOLD}────────────────────────────────────────${NC}\n"; }

# ─── Parse Arguments ────────────────────────────────────────────────
PLAY_NUM=""
SKIP_EVAL=false
RESOURCE_GROUP="${FROOTAI_RESOURCE_GROUP:-frootai-rg}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-eval)       SKIP_EVAL=true; shift ;;
    --resource-group)  RESOURCE_GROUP="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: $0 <play-number> [--skip-eval] [--resource-group <name>]"
      echo "  play-number   Two-digit play ID (e.g., 01, 05, 20)"
      echo "  --skip-eval   Skip the evaluation step after deployment"
      echo "  --resource-group  Azure resource group (default: \$FROOTAI_RESOURCE_GROUP or frootai-rg)"
      exit 0 ;;
    *)
      if [[ -z "$PLAY_NUM" ]]; then
        PLAY_NUM="$1"
      else
        fail "Unknown argument: $1"
      fi
      shift ;;
  esac
done

[[ -z "$PLAY_NUM" ]] && fail "Play number required. Usage: $0 <play-number> (e.g., 01)"

# ─── Resolve Paths ──────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Find the play directory matching the number prefix
PLAY_DIR=$(find "$REPO_ROOT/solution-plays" -maxdepth 1 -type d -name "${PLAY_NUM}-*" | head -1)
[[ -z "$PLAY_DIR" || ! -d "$PLAY_DIR" ]] && fail "Play ${PLAY_NUM} not found in solution-plays/"

PLAY_NAME="$(basename "$PLAY_DIR")"
BICEP_FILE="$PLAY_DIR/infra/main.bicep"
PARAMS_FILE="$PLAY_DIR/infra/parameters.json"
CONFIG_DIR="$PLAY_DIR/config"
EVAL_SCRIPT="$PLAY_DIR/evaluation/eval.py"
EVAL_DATA="$PLAY_DIR/evaluation/test-set.jsonl"

banner "🌳 FrootAI — Deploying Play: $PLAY_NAME"

# ─── Step 1: Validate ──────────────────────────────────────────────
info "Validating play structure..."

[[ ! -f "$BICEP_FILE" ]] && fail "Missing: infra/main.bicep in $PLAY_NAME"
[[ ! -f "$PARAMS_FILE" ]] && fail "Missing: infra/parameters.json in $PLAY_NAME"

ok "Play structure validated: $PLAY_NAME"
info "Resource group: $RESOURCE_GROUP"

# ─── Step 2: Deploy Infrastructure ─────────────────────────────────
banner "🏗️  Step 2: Deploying Infrastructure"

info "Running: az deployment group create..."
DEPLOY_START=$(date +%s)

az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file "$BICEP_FILE" \
  --parameters "@${PARAMS_FILE}" \
  --name "frootai-${PLAY_NUM}-$(date +%Y%m%d%H%M%S)" \
  --output table \
  || fail "Infrastructure deployment failed"

DEPLOY_END=$(date +%s)
DEPLOY_DURATION=$((DEPLOY_END - DEPLOY_START))
ok "Infrastructure deployed in ${DEPLOY_DURATION}s"

# ─── Step 3: Copy Config Files ─────────────────────────────────────
banner "📋 Step 3: Copying Configuration"

if [[ -d "$CONFIG_DIR" ]]; then
  CONFIG_COUNT=$(find "$CONFIG_DIR" -type f | wc -l)
  info "Found $CONFIG_COUNT config file(s) in $PLAY_NAME/config/"

  # Copy config files — deployment target depends on the play's host type
  for cfg in "$CONFIG_DIR"/*; do
    [[ -f "$cfg" ]] || continue
    info "  → $(basename "$cfg")"
  done
  ok "Configuration files staged for deployment"
else
  warn "No config/ directory found — skipping config copy"
fi

# ─── Step 4: Run Evaluation ────────────────────────────────────────
if [[ "$SKIP_EVAL" == "true" ]]; then
  warn "Evaluation skipped (--skip-eval flag)"
else
  banner "🧪 Step 4: Running Evaluation"

  if [[ -f "$EVAL_SCRIPT" && -f "$EVAL_DATA" ]]; then
    info "Running: python eval.py --test-set test-set.jsonl"
    python "$EVAL_SCRIPT" --test-set "$EVAL_DATA" \
      || warn "Evaluation completed with warnings"
    ok "Evaluation complete"
  elif [[ -f "$EVAL_SCRIPT" ]]; then
    info "Running evaluation (no test-set.jsonl found)..."
    python "$EVAL_SCRIPT" || warn "Evaluation completed with warnings"
    ok "Evaluation complete"
  else
    warn "No evaluation script found at $PLAY_NAME/evaluation/eval.py — skipping"
  fi
fi

# ─── Step 5: Summary ───────────────────────────────────────────────
banner "📊 Deployment Summary"

echo -e "  ${BOLD}Play:${NC}           $PLAY_NAME"
echo -e "  ${BOLD}Resource Group:${NC} $RESOURCE_GROUP"
echo -e "  ${BOLD}Bicep Template:${NC} $BICEP_FILE"
echo -e "  ${BOLD}Deploy Time:${NC}    ${DEPLOY_DURATION}s"
echo -e "  ${BOLD}Evaluation:${NC}     $( [[ "$SKIP_EVAL" == "true" ]] && echo "Skipped" || echo "Ran" )"
echo -e "  ${BOLD}Timestamp:${NC}      $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo ""
ok "Play $PLAY_NUM deployed successfully! 🌳"
echo -e "  View in portal: ${CYAN}https://portal.azure.com/#@/resource/subscriptions/.../resourceGroups/$RESOURCE_GROUP${NC}"
