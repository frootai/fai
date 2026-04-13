# FAI Hooks Audit Report

> **Date:** April 13, 2026
> **Scope:** All 10 standalone hooks in `hooks/` folder + website data + distribution channels
> **Status:** ✅ COMPLETE — 10/10 hooks pass all gates

---

## Executive Summary

Full audit and improvisation of all 10 standalone hooks. Every hook now follows the VS Code April 2026 hooks specification, uses `fai-*` naming convention, and is synced across GitHub + website.

---

## Final Metrics

| Metric | Before | After |
|--------|--------|-------|
| Hooks with `fai-*` naming | 0/10 | 10/10 ✅ |
| Hooks using VS Code April 2026 spec | 0/10 | 10/10 ✅ |
| Stale `frootai-` refs | ~50 | 0 ✅ |
| Old event names (sessionEnd, etc.) | 10/10 | 0/10 ✅ |
| Old field names (timeoutSec, bash) | 10/10 | 0/10 ✅ |
| Cross-platform Windows support | 0/10 | 1/10 (cost-tracker has .ps1) |
| Website hooks.json synced | ❌ | ✅ |
| Rule 33 violations (PreToolUse) | 1 (token-budget) | 0 ✅ |

---

## Per-Hook Audit Results

| # | Hook | Events | Files | Size | Windows | Stale | Status |
|---|------|--------|-------|------|---------|-------|--------|
| 1 | fai-cost-tracker | Stop | 4 | 14.5 KB | ✅ .ps1 | 0 | ✅ PASS |
| 2 | fai-governance-audit | UserPromptSubmit, SessionStart, Stop | 3 | 21.7 KB | — | 0 | ✅ PASS |
| 3 | fai-license-checker | Stop | 3 | 19.2 KB | — | 0 | ✅ PASS |
| 4 | fai-output-validator | Stop | 3 | 23.3 KB | — | 0 | ✅ PASS |
| 5 | fai-pii-redactor | Stop | 3 | 13.8 KB | — | 0 | ✅ PASS |
| 6 | fai-secrets-scanner | Stop | 3 | 19.2 KB | — | 0 | ✅ PASS |
| 7 | fai-session-logger | SessionStart, Stop, UserPromptSubmit | 3 | 11.1 KB | — | 0 | ✅ PASS |
| 8 | fai-token-budget-enforcer | SessionStart | 3 | 11.4 KB | — | 0 | ✅ PASS |
| 9 | fai-tool-guardian | PreToolUse | 3 | 15.9 KB | — | 0 | ✅ PASS |
| 10 | fai-waf-compliance | Stop | 3 | 20.0 KB | — | 0 | ✅ PASS |

**Total content: 31 files, 170 KB across 10 hooks**

---

## Changes Applied Per Hook

| Hook | Naming Fix | Event Fix | Spec Fix | Content Fix |
|------|-----------|-----------|----------|-------------|
| cost-tracker | frootai→fai | sessionEnd→Stop | bash→command+windows, timeoutSec→timeout, version removed | Added track-cost.ps1 |
| governance-audit | frootai→fai | userPromptSubmitted→UserPromptSubmit, sessionStart→SessionStart, sessionEnd→Stop | bash→command+windows, timeoutSec→timeout, version removed | Script comments updated |
| license-checker | frootai→fai | sessionEnd→Stop | bash→command+windows, timeoutSec→timeout, version removed | README event name fixed |
| output-validator | frootai→fai | sessionEnd→Stop | bash→command+windows, timeoutSec→timeout, version removed | FrootAI→FAI in examples |
| pii-redactor | frootai→fai | sessionEnd→Stop | bash→command+windows, timeoutSec→timeout, version removed | — |
| secrets-scanner | frootai→fai | sessionEnd→Stop | bash→command+windows, timeoutSec→timeout, version removed | — |
| session-logger | frootai→fai | All 3 events updated | bash→command+windows, timeoutSec→timeout, version removed | — |
| token-budget-enforcer | frootai→fai | **preToolUse→SessionStart** (Rule 33 fix) | bash→command+windows, timeoutSec→timeout, version removed | Event logic changed |
| tool-guardian | frootai→fai | preToolUse→PreToolUse (kept — security exception) | bash→command+windows, timeoutSec→timeout, version removed | — |
| waf-compliance | frootai→fai | sessionEnd→Stop | bash→command+windows, timeoutSec→timeout, version removed | — |

---

## Rule 33 Compliance

**Rule 33:** NEVER use PreToolUse hooks in solution plays — they fire per tool call (5s delay each).

| Hook | Before | After | Rationale |
|------|--------|-------|-----------|
| token-budget-enforcer | ❌ preToolUse | ✅ SessionStart | Budget checked once at session start, not per tool call |
| tool-guardian | preToolUse | ✅ PreToolUse (kept) | Legitimate security exception — blocks rm -rf, DROP TABLE, destructive commands |

---

## VS Code April 2026 Spec Compliance

### hooks.json Format (All 10 Updated)

| Field | Old (Copilot CLI) | New (VS Code April 2026) |
|-------|-------------------|--------------------------|
| Event names | `sessionEnd`, `sessionStart`, `preToolUse`, `userPromptSubmitted` | `Stop`, `SessionStart`, `PreToolUse`, `UserPromptSubmit` |
| Command field | `"bash": "script.sh"` | `"command": "bash path/script.sh"` + `"windows": "powershell ..."` |
| Timeout | `"timeoutSec": N` | `"timeout": N` |
| Version | `"version": 1` | Removed (not in current spec) |

### 8 Available Events (Usage Summary)

| Event | Used By | Count |
|-------|---------|-------|
| SessionStart | governance-audit, session-logger, token-budget-enforcer | 3 hooks |
| UserPromptSubmit | governance-audit, session-logger | 2 hooks |
| PreToolUse | tool-guardian (security exception) | 1 hook |
| PostToolUse | — | 0 (future: auto-format) |
| PreCompact | — | 0 |
| SubagentStart | — | 0 |
| SubagentStop | — | 0 |
| Stop | cost-tracker, governance-audit, license-checker, output-validator, pii-redactor, secrets-scanner, session-logger, waf-compliance | 8 hooks |

---

## Distribution Channel Status

| Channel | Status | What Was Updated |
|---------|--------|-----------------|
| GitHub `hooks/` folder | ✅ | 10 folders renamed, 31 files updated, 10 hooks.json rewritten |
| `hooks/README.md` index | ✅ | All names, events, folder paths updated |
| Website `hooks.json` | ✅ | All 10 hooks: FAI names, VS Code events, descriptions, sizes |
| Website search index | ✅ | Already clean from previous sync |
| Hook improvisation blueprint | ✅ | Created at `.internal/improvisation/hook-improvisation.md` |

---

## What Was NOT Changed

1. **Script logic** — bash scripts left functionally intact (only naming/comments updated)
2. **Solution play hooks** — 101 play `guardrails.json` files were already updated in a prior commit (environment fix)
3. **Plugin hooks** — community-plugins hooks format not touched (different distribution)

---

## Future Improvements

| Gap | Priority | Action |
|-----|----------|--------|
| Only 1 hook has Windows .ps1 | LOW | Add PowerShell scripts for remaining 9 hooks |
| PostToolUse not used | MEDIUM | Add auto-format hook (Prettier/Black after file edits) |
| SubagentStart/Stop unused | LOW | Track builder→reviewer→tuner agent chain |
| No agent-scoped hooks | MEDIUM | Add `hooks:` to agent frontmatter for per-agent PostToolUse |
| Bash scripts not tested cross-platform | MEDIUM | Add CI test matrix (ubuntu + macos) |

---

*Report generated: April 13, 2026 | 10/10 hooks audited and improvised | ~170 KB total content*
