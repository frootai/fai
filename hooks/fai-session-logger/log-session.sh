#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# FAI Session Logger
# Appends structured JSON Lines audit entries for session
# events with rotation, compression, and error recovery.
# Privacy-by-design: never logs prompt content.
#
# ENV:
#   SESSION_EVENT      = sessionStart | sessionEnd | userPromptSubmitted
#   LOG_DIR            = logs/copilot (default)
#   LOG_MAX_SIZE_MB    = 10 (default) — triggers rotation
#   LOG_KEEP_ROTATED   = 5 (default) — max rotated files
#   LOG_COMPRESS       = true (default) — gzip rotated logs
#   LOG_RATE_LIMIT_SEC = 1 (default) — min seconds between entries
#
# Exit: 0 always (logging must never block workflow)
# ─────────────────────────────────────────────────────────
set -euo pipefail

# ─── Configuration ─────────────────────────────────────
EVENT="${SESSION_EVENT:-unknown}"
LOG_DIR="${LOG_DIR:-logs/copilot}"
LOG_FILE="${LOG_DIR}/session.jsonl"
MAX_SIZE_MB="${LOG_MAX_SIZE_MB:-10}"
KEEP_ROTATED="${LOG_KEEP_ROTATED:-5}"
COMPRESS="${LOG_COMPRESS:-true}"
RATE_LIMIT_SEC="${LOG_RATE_LIMIT_SEC:-1}"
RATE_FILE="${LOG_DIR}/.rate-limit"

MAX_SIZE_BYTES=$((MAX_SIZE_MB * 1024 * 1024))

# ─── Ensure log directory ──────────────────────────────
mkdir -p "$LOG_DIR"

# ─── Rate limiting ─────────────────────────────────────
enforce_rate_limit() {
  if [ ! -f "$RATE_FILE" ]; then
    return 0
  fi
  local last_ts
  last_ts=$(cat "$RATE_FILE" 2>/dev/null || echo "0")
  if ! [[ "$last_ts" =~ ^[0-9]+$ ]]; then
    return 0
  fi
  local now
  now=$(date +%s 2>/dev/null || echo "0")
  local elapsed=$((now - last_ts))
  if [ "$elapsed" -lt "$RATE_LIMIT_SEC" ]; then
    return 1
  fi
  return 0
}

update_rate_stamp() {
  date +%s > "$RATE_FILE" 2>/dev/null || true
}

# ─── Log rotation ──────────────────────────────────────
rotate_logs() {
  if [ ! -f "$LOG_FILE" ]; then
    return
  fi
  local file_size
  file_size=$(wc -c < "$LOG_FILE" 2>/dev/null || echo "0")
  file_size=$(echo "$file_size" | tr -d '[:space:]')
  if [ "$file_size" -lt "$MAX_SIZE_BYTES" ]; then
    return
  fi

  # Shift existing rotated files
  local i="$KEEP_ROTATED"
  while [ "$i" -gt 1 ]; do
    local prev=$((i - 1))
    local src="${LOG_FILE}.${prev}"
    local dst="${LOG_FILE}.${i}"
    if [ "$COMPRESS" = "true" ]; then
      src="${src}.gz"
      dst="${dst}.gz"
    fi
    if [ -f "$src" ]; then
      mv "$src" "$dst"
    fi
    i=$((i - 1))
  done

  if [ "$COMPRESS" = "true" ] && command -v gzip >/dev/null 2>&1; then
    gzip -c "$LOG_FILE" > "${LOG_FILE}.1.gz"
  else
    cp "$LOG_FILE" "${LOG_FILE}.1"
  fi

  : > "$LOG_FILE"

  # Remove excess rotated files
  local j=$((KEEP_ROTATED + 1))
  while [ "$j" -le 20 ]; do
    rm -f "${LOG_FILE}.${j}" "${LOG_FILE}.${j}.gz"
    j=$((j + 1))
  done
}

# ─── Gather metadata ──────────────────────────────────
collect_metadata() {
  local ts
  ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date +"%Y-%m-%dT%H:%M:%SZ")

  local cwd
  cwd=$(pwd)
  local cwd_esc
  cwd_esc=$(printf '%s' "$cwd" | sed 's/\\/\\\\/g; s/"/\\"/g')

  local branch
  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

  # Anonymized user hash (first 12 chars of SHA-256)
  local user_hash="unavailable"
  local raw_user="${USER:-${USERNAME:-unknown}}"
  if command -v sha256sum >/dev/null 2>&1; then
    user_hash=$(printf '%s' "$raw_user" | sha256sum | cut -d' ' -f1)
  elif command -v shasum >/dev/null 2>&1; then
    user_hash=$(printf '%s' "$raw_user" | shasum -a 256 | cut -d' ' -f1)
  fi
  user_hash="${user_hash:0:12}"

  # Session duration tracking
  local session_id="${COPILOT_SESSION_ID:-$$}"
  local duration_sec=""
  local start_file="${LOG_DIR}/.session-start-${session_id}"

  if [ "$EVENT" = "sessionStart" ]; then
    date +%s > "$start_file" 2>/dev/null || true
    duration_sec="0"
  elif [ "$EVENT" = "sessionEnd" ] && [ -f "$start_file" ]; then
    local start_epoch
    start_epoch=$(cat "$start_file" 2>/dev/null || echo "")
    if [[ "$start_epoch" =~ ^[0-9]+$ ]]; then
      local now_epoch
      now_epoch=$(date +%s 2>/dev/null || echo "0")
      duration_sec=$((now_epoch - start_epoch))
    fi
    rm -f "$start_file"
  fi

  # Assemble JSON
  local entry="{\"timestamp\":\"${ts}\""
  entry="${entry},\"event\":\"${EVENT}\""
  entry="${entry},\"session_id\":\"${session_id}\""
  entry="${entry},\"cwd\":\"${cwd_esc}\""
  entry="${entry},\"git_branch\":\"${branch}\""
  entry="${entry},\"user_hash\":\"${user_hash}\""
  if [ -n "$duration_sec" ]; then
    entry="${entry},\"duration_sec\":${duration_sec}"
  fi
  entry="${entry},\"level\":\"info\"}"

  echo "$entry"
}

# ─── Main ──────────────────────────────────────────────
main() {
  # Rate-limit userPromptSubmitted (always log start/end)
  if [ "$EVENT" = "userPromptSubmitted" ]; then
    if ! enforce_rate_limit; then
      exit 0
    fi
  fi

  rotate_logs

  local entry
  entry=$(collect_metadata)

  echo "$entry" >> "$LOG_FILE" 2>/dev/null || {
    echo "⚠️  FAI Session Logger: write failed." >&2
    exit 0
  }

  update_rate_stamp

  echo "📝 FAI Session Logger: ${EVENT} recorded."
}

# Error recovery wrapper — logging must never break workflow
main "$@" 2>/dev/null || exit 0
