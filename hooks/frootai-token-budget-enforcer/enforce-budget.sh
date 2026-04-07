#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FrootAI Token Budget Enforcer
# Per-model token budgets with sliding window tracking,
# grace period, alert thresholds, and multi-tenant support.
#
# Input: JSON on stdin with toolName/toolInput (optional)
# ENV:
#   BUDGET_MODE         = warn | block (default: warn)
#   TOKEN_BUDGET        = 50000 (default, per-session max)
#   TOKEN_ESTIMATE      = 1000 (default, per tool call)
#   BUDGET_ALERT_PCT    = 80 (default, % to trigger alert)
#   BUDGET_GRACE_CALLS  = 3 (default, extra calls after limit)
#   BUDGET_WINDOW_MIN   = 0 (default, 0=session, >0=sliding)
#   BUDGET_RESET_DAILY  = false (default, auto-reset at midnight)
#   BUDGET_TENANT_ID    = default (default, multi-tenant key)
#   BUDGET_GPT4O        = 80000  (per-model override)
#   BUDGET_GPT4O_MINI   = 120000 (per-model override)
#   BUDGET_O3           = 40000  (per-model override)
#
# Exit: 0 = under budget or warn mode, 1 = block + over budget
# ─────────────────────────────────────────────────────────
set -euo pipefail

# ─── Configuration ─────────────────────────────────────
MODE="${BUDGET_MODE:-warn}"
BUDGET="${TOKEN_BUDGET:-50000}"
ESTIMATE="${TOKEN_ESTIMATE:-1000}"
ALERT_PCT="${BUDGET_ALERT_PCT:-80}"
GRACE_CALLS="${BUDGET_GRACE_CALLS:-3}"
WINDOW_MIN="${BUDGET_WINDOW_MIN:-0}"
RESET_DAILY="${BUDGET_RESET_DAILY:-false}"
TENANT_ID="${BUDGET_TENANT_ID:-default}"

# Per-model budget overrides
BUDGET_GPT4O="${BUDGET_GPT4O:-80000}"
BUDGET_GPT4O_MINI="${BUDGET_GPT4O_MINI:-120000}"
BUDGET_O3="${BUDGET_O3:-40000}"

# ─── Session tracking paths ────────────────────────────
SESSION_ID="${COPILOT_SESSION_ID:-$$}"
STATE_DIR="${TMPDIR:-/tmp}/frootai-budget"
mkdir -p "$STATE_DIR"

safe_hash() {
  local input="$1"
  if command -v md5sum >/dev/null 2>&1; then
    printf '%s' "$input" | md5sum | cut -d' ' -f1
  elif command -v md5 >/dev/null 2>&1; then
    printf '%s' "$input" | md5 -q
  else
    printf '%s' "$input"
  fi
}

SESSION_HASH=$(safe_hash "${TENANT_ID}-${SESSION_ID}")
USAGE_FILE="${STATE_DIR}/${SESSION_HASH}.usage"
GRACE_FILE="${STATE_DIR}/${SESSION_HASH}.grace"
HISTORY_FILE="${STATE_DIR}/${SESSION_HASH}.history"

# ─── Detect model from stdin ───────────────────────────
resolve_model_budget() {
  local input
  input=$(cat 2>/dev/null || echo "")
  local model=""
  if [ -n "$input" ]; then
    model=$(echo "$input" | sed -n 's/.*"model"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
  fi

  case "$model" in
    *gpt-4o-mini*) BUDGET="$BUDGET_GPT4O_MINI" ;;
    *gpt-4o*)      BUDGET="$BUDGET_GPT4O" ;;
    *o3*)          BUDGET="$BUDGET_O3" ;;
  esac
}

# ─── Daily reset check ─────────────────────────────────
check_daily_reset() {
  if [ "$RESET_DAILY" != "true" ]; then
    return
  fi
  local reset_marker="${STATE_DIR}/${SESSION_HASH}.reset"
  local today
  today=$(date -u +"%Y-%m-%d")

  if [ -f "$reset_marker" ]; then
    local last_reset
    last_reset=$(cat "$reset_marker" 2>/dev/null || echo "")
    if [ "$last_reset" = "$today" ]; then
      return
    fi
  fi

  # New day — reset usage
  echo "0" > "$USAGE_FILE"
  echo "0" > "$GRACE_FILE"
  : > "$HISTORY_FILE"
  echo "$today" > "$reset_marker"
}

# ─── Sliding window pruning ───────────────────────────
prune_sliding_window() {
  if [ "$WINDOW_MIN" -le 0 ]; then
    return
  fi
  if [ ! -f "$HISTORY_FILE" ]; then
    return
  fi

  local cutoff
  cutoff=$(( $(date +%s) - (WINDOW_MIN * 60) ))
  local new_total=0
  local tmp_file="${HISTORY_FILE}.tmp"
  : > "$tmp_file"

  while IFS=',' read -r ts tokens; do
    if [[ "$ts" =~ ^[0-9]+$ ]] && [ "$ts" -ge "$cutoff" ]; then
      echo "${ts},${tokens}" >> "$tmp_file"
      new_total=$((new_total + tokens))
    fi
  done < "$HISTORY_FILE"

  mv "$tmp_file" "$HISTORY_FILE"
  echo "$new_total" > "$USAGE_FILE"
}

# ─── Read current usage ───────────────────────────────
read_usage() {
  if [ -f "$USAGE_FILE" ]; then
    local val
    val=$(cat "$USAGE_FILE" 2>/dev/null || echo "0")
    if [[ "$val" =~ ^[0-9]+$ ]]; then
      echo "$val"
      return
    fi
  fi
  echo "0"
}

# ─── Main ──────────────────────────────────────────────
main() {
  resolve_model_budget
  check_daily_reset
  prune_sliding_window

  local current_usage
  current_usage=$(read_usage)
  local new_usage=$((current_usage + ESTIMATE))

  # Record in history (for sliding window)
  echo "$(date +%s),${ESTIMATE}" >> "$HISTORY_FILE" 2>/dev/null || true
  echo "$new_usage" > "$USAGE_FILE"

  local percent=0
  if [ "$BUDGET" -gt 0 ]; then
    percent=$(( (new_usage * 100) / BUDGET ))
  fi

  # Alert threshold notification
  local prev_percent=0
  if [ "$BUDGET" -gt 0 ] && [ "$current_usage" -gt 0 ]; then
    prev_percent=$(( (current_usage * 100) / BUDGET ))
  fi

  if [ "$prev_percent" -lt "$ALERT_PCT" ] && [ "$percent" -ge "$ALERT_PCT" ]; then
    echo "💰 FrootAI Budget Alert: ${percent}% used (${new_usage}/${BUDGET} tokens)"
  fi

  # Under budget — normal flow
  if [ "$new_usage" -le "$BUDGET" ]; then
    exit 0
  fi

  # Grace period — allow a few extra calls after soft limit
  local grace_count=0
  if [ -f "$GRACE_FILE" ]; then
    grace_count=$(cat "$GRACE_FILE" 2>/dev/null || echo "0")
    if ! [[ "$grace_count" =~ ^[0-9]+$ ]]; then
      grace_count=0
    fi
  fi
  grace_count=$((grace_count + 1))
  echo "$grace_count" > "$GRACE_FILE"

  if [ "$grace_count" -le "$GRACE_CALLS" ]; then
    echo "💰 FrootAI Budget: grace call ${grace_count}/${GRACE_CALLS} (budget exceeded)"
    exit 0
  fi

  # Over budget and past grace period
  echo ""
  echo "💰 FrootAI Token Budget Enforcer"
  echo "─────────────────────────────────────────"
  echo "  Tenant:    ${TENANT_ID}"
  echo "  Budget:    ${BUDGET} tokens"
  echo "  Used:      ${new_usage} tokens (${percent}%)"
  echo "  Over by:   $(( new_usage - BUDGET )) tokens"
  echo "  Grace:     ${grace_count}/${GRACE_CALLS} (exhausted)"
  echo "─────────────────────────────────────────"

  if [ "$MODE" = "block" ]; then
    echo "  🚫 BLOCKED — token budget exceeded."
    echo "  Tip: increase TOKEN_BUDGET or start a new session."
    exit 1
  else
    echo "  ⚠️  WARNING — over budget (mode=warn, not blocking)."
    exit 0
  fi
}

main
