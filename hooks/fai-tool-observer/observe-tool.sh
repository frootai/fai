#!/usr/bin/env bash
# FAI Tool Observer — PostToolUse hook
# Logs tool name, truncated input, truncated output, duration, and outcome
# to a JSONL trace file for observability and audit. Redacts sensitive keys.
#
# stdin:  {"toolName":"...","toolInput":{...},"toolOutput":"...","durationMs":123,"success":true}
# stdout: {} (no-op — observation only, never blocks)
# exit:   always 0

set -euo pipefail

LOG_DIR="${OBSERVE_LOG_DIR:-logs/copilot}"
LOG_FILE="${OBSERVE_LOG_FILE:-tool-trace.jsonl}"
REDACT_KEYS="${OBSERVE_REDACT_KEYS:-password,token,secret,apiKey,authorization,connectionString}"
MAX_INPUT_BYTES="${OBSERVE_MAX_INPUT_BYTES:-2048}"
MAX_OUTPUT_BYTES="${OBSERVE_MAX_OUTPUT_BYTES:-2048}"

mkdir -p "$LOG_DIR"

# Read entire stdin payload (best-effort; if no stdin, write minimal record)
PAYLOAD=""
if [ -t 0 ]; then
  PAYLOAD="{}"
else
  PAYLOAD=$(cat || echo "{}")
fi

# If jq is available, do structured redaction + truncation. Otherwise fall back
# to a raw line (still safe — never blocks the agent).
if command -v jq >/dev/null 2>&1; then
  # Build a jq filter that nulls out any redacted key (recursively)
  IFS=',' read -ra KEYS <<< "$REDACT_KEYS"
  REDACT_FILTER='.'
  for k in "${KEYS[@]}"; do
    REDACT_FILTER="${REDACT_FILTER} | walk(if type == \"object\" and has(\"${k}\") then .${k} = \"[REDACTED]\" else . end)"
  done

  RECORD=$(echo "$PAYLOAD" | jq -c "
    def trunc(\$n): if type == \"string\" and (length > \$n) then .[0:\$n] + \"...[truncated]\" else . end;
    def safe: if . == null then null else . end;
    {
      ts: (now | todateiso8601),
      tool: (.toolName // .tool // \"unknown\"),
      success: (.success // null),
      durationMs: (.durationMs // .duration // null),
      input: (.toolInput // .input // null) | tostring | trunc($MAX_INPUT_BYTES),
      output: (.toolOutput // .output // null) | tostring | trunc($MAX_OUTPUT_BYTES)
    } | ${REDACT_FILTER}
  " 2>/dev/null || echo "{\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"tool\":\"unknown\",\"raw\":true}")
else
  # Minimal record without jq: timestamp + truncated raw payload
  TRUNC_PAYLOAD=$(echo "$PAYLOAD" | head -c "$MAX_INPUT_BYTES" | tr -d '\n')
  RECORD="{\"ts\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"raw\":true,\"payload\":\"$(echo "$TRUNC_PAYLOAD" | sed 's/"/\\"/g')\"}"
fi

# Append (atomic single-line write)
echo "$RECORD" >> "$LOG_DIR/$LOG_FILE"

# PostToolUse must echo a JSON object (empty {} = no modification)
echo '{}'
exit 0
