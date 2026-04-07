#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FrootAI Cost Tracker
# Per-session cost estimation with model-aware pricing,
# time-range aggregation, anomaly detection, and CSV export.
#
# ENV:
#   COST_MODE            = log | alert (default: log)
#   COST_DAILY_THRESHOLD = 5.00 (USD, alert mode only)
#   COST_LOG_DIR         = logs/copilot (default)
#   COST_EXPORT_CSV      = false (default)
#   COST_MODEL           = gpt-4o (default, for pricing)
#
# Exit: 0 always (tracking must never block workflow)
# ─────────────────────────────────────────────────────────
set -euo pipefail

# ─── Configuration ─────────────────────────────────────
MODE="${COST_MODE:-log}"
DAILY_THRESHOLD="${COST_DAILY_THRESHOLD:-5.00}"
LOG_DIR="${COST_LOG_DIR:-logs/copilot}"
EXPORT_CSV="${COST_EXPORT_CSV:-false}"
MODEL="${COST_MODEL:-gpt-4o}"
LOG_FILE="${LOG_DIR}/costs.jsonl"
CSV_FILE="${LOG_DIR}/costs.csv"

mkdir -p "$LOG_DIR"

# ─── Model pricing table (USD per 1K tokens) ──────────
# Prices as of 2026-Q1 Azure OpenAI (input/output blended)
price_per_1k() {
  case "$1" in
    gpt-4o)          echo "0.005"  ;;
    gpt-4o-mini)     echo "0.0003" ;;
    o3)              echo "0.010"  ;;
    o3-mini)         echo "0.0012" ;;
    gpt-4-turbo)     echo "0.010"  ;;
    text-embedding*) echo "0.0001" ;;
    *)               echo "0.005"  ;;
  esac
}

# ─── Gather session diff stats ─────────────────────────
gather_diff_stats() {
  local diff_numstat
  diff_numstat=$(git diff --numstat 2>/dev/null || echo "")

  if [ -z "$diff_numstat" ]; then
    FILES_CHANGED=0
    LINES_ADDED=0
    LINES_REMOVED=0
    return
  fi

  FILES_CHANGED=$(echo "$diff_numstat" | wc -l | tr -d '[:space:]')
  LINES_ADDED=$(echo "$diff_numstat" | awk '{s+=$1} END {print s+0}')
  LINES_REMOVED=$(echo "$diff_numstat" | awk '{s+=$2} END {print s+0}')
}

# ─── Estimate tokens from diff ─────────────────────────
estimate_tokens() {
  local added_chars
  added_chars=$(git diff --unified=0 2>/dev/null \
    | grep '^+[^+]' | sed 's/^+//' \
    | wc -c | tr -d '[:space:]' || echo "0")
  # ~4 characters per token (conservative)
  ESTIMATED_TOKENS=$(( (added_chars + 3) / 4 ))
}

# ─── Calculate cost ────────────────────────────────────
calculate_cost() {
  local rate
  rate=$(price_per_1k "$MODEL")
  # cost = (tokens / 1000) * rate — using awk for float math
  ESTIMATED_COST=$(awk "BEGIN {printf \"%.6f\", ($ESTIMATED_TOKENS / 1000) * $rate}")
}

# ─── Aggregate costs by time range ─────────────────────
aggregate_costs() {
  local range="$1"  # today | week | month
  local since_date=""

  case "$range" in
    today) since_date=$(date -u +"%Y-%m-%d") ;;
    week)
      if date --version >/dev/null 2>&1; then
        since_date=$(date -u -d "7 days ago" +"%Y-%m-%d")
      else
        since_date=$(date -u -v-7d +"%Y-%m-%d" 2>/dev/null || date -u +"%Y-%m-%d")
      fi
      ;;
    month)
      if date --version >/dev/null 2>&1; then
        since_date=$(date -u -d "30 days ago" +"%Y-%m-%d")
      else
        since_date=$(date -u -v-30d +"%Y-%m-%d" 2>/dev/null || date -u +"%Y-%m-%d")
      fi
      ;;
  esac

  if [ ! -f "$LOG_FILE" ]; then
    echo "0"
    return
  fi

  grep "\"${since_date}" "$LOG_FILE" 2>/dev/null \
    | grep -oE '"estimated_cost_usd":[0-9.]+' \
    | sed 's/"estimated_cost_usd"://' \
    | awk '{s+=$1} END {printf "%.4f", s+0}' || echo "0"
}

# ─── Anomaly detection ─────────────────────────────────
detect_anomaly() {
  if [ ! -f "$LOG_FILE" ]; then
    return
  fi
  local line_count
  line_count=$(wc -l < "$LOG_FILE" | tr -d '[:space:]')
  if [ "$line_count" -lt 5 ]; then
    return
  fi

  # Average tokens over last 10 sessions
  local avg_tokens
  avg_tokens=$(tail -10 "$LOG_FILE" 2>/dev/null \
    | grep -oE '"estimated_tokens":[0-9]+' \
    | sed 's/"estimated_tokens"://' \
    | awk '{s+=$1; c++} END {if(c>0) printf "%d", s/c; else print 0}')

  if [ "$avg_tokens" -gt 0 ] && [ "$ESTIMATED_TOKENS" -gt $((avg_tokens * 3)) ]; then
    echo "  ⚡ ANOMALY — this session used ${ESTIMATED_TOKENS} tokens (avg: ${avg_tokens})"
  fi
}

# ─── CSV export ────────────────────────────────────────
export_csv() {
  if [ "$EXPORT_CSV" != "true" ]; then
    return
  fi

  # Write header if file doesn't exist
  if [ ! -f "$CSV_FILE" ]; then
    echo "timestamp,model,files_changed,lines_added,lines_removed,estimated_tokens,estimated_cost_usd" > "$CSV_FILE"
  fi

  echo "${TIMESTAMP},${MODEL},${FILES_CHANGED},${LINES_ADDED},${LINES_REMOVED},${ESTIMATED_TOKENS},${ESTIMATED_COST}" >> "$CSV_FILE"
}

# ─── Main ──────────────────────────────────────────────
main() {
  gather_diff_stats
  estimate_tokens
  calculate_cost

  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")
  local session_id="${COPILOT_SESSION_ID:-$$}"

  # Build JSON entry
  local entry="{\"timestamp\":\"${TIMESTAMP}\""
  entry="${entry},\"event\":\"sessionEnd\""
  entry="${entry},\"session_id\":\"${session_id}\""
  entry="${entry},\"model\":\"${MODEL}\""
  entry="${entry},\"files_changed\":${FILES_CHANGED}"
  entry="${entry},\"lines_added\":${LINES_ADDED}"
  entry="${entry},\"lines_removed\":${LINES_REMOVED}"
  entry="${entry},\"estimated_tokens\":${ESTIMATED_TOKENS}"
  entry="${entry},\"estimated_cost_usd\":${ESTIMATED_COST}"
  entry="${entry},\"mode\":\"${MODE}\"}"

  echo "$entry" >> "$LOG_FILE"
  export_csv

  # Report
  echo ""
  echo "💰 FrootAI Cost Tracker"
  echo "─────────────────────────────────────────"
  echo "  Model:            ${MODEL}"
  echo "  Files changed:    ${FILES_CHANGED}"
  echo "  Lines +/-:        +${LINES_ADDED} / -${LINES_REMOVED}"
  echo "  Estimated tokens: ${ESTIMATED_TOKENS}"
  echo "  Estimated cost:   \$${ESTIMATED_COST}"

  # Anomaly check
  detect_anomaly

  # Aggregation
  local daily_cost
  daily_cost=$(aggregate_costs "today")
  local weekly_cost
  weekly_cost=$(aggregate_costs "week")
  local monthly_cost
  monthly_cost=$(aggregate_costs "month")

  echo "  ───────────────────────────────────────"
  echo "  Today:   \$${daily_cost}"
  echo "  Week:    \$${weekly_cost}"
  echo "  Month:   \$${monthly_cost}"

  # Budget alert (alert mode)
  if [ "$MODE" = "alert" ]; then
    local over
    over=$(awk "BEGIN {print ($daily_cost > $DAILY_THRESHOLD) ? 1 : 0}")
    if [ "$over" -eq 1 ]; then
      echo ""
      echo "  ⚠️  Daily cost \$${daily_cost} exceeds threshold \$${DAILY_THRESHOLD}"
    fi
  fi

  echo "─────────────────────────────────────────"
  echo "  📝 Logged to ${LOG_FILE}"
}

main 2>/dev/null || exit 0
