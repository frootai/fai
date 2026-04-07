# FrootAI — Hooks (10)

> 10 security hooks that run at session lifecycle events — secrets scanning, tool guarding, governance audit, PII redaction, cost tracking, WAF compliance, license checking, session logging, token budgets, output validation.

## What Are FrootAI Hooks?

Hooks are bash scripts triggered by VS Code Copilot session events. They enforce security, compliance, and observability automatically — without user intervention.

## Hook Event Model

| Event | When | Stdin | Use Case |
|-------|------|-------|----------|
| `sessionStart` | Session begins | None | Governance audit, session logging |
| `sessionEnd` | Session ends | None | Secrets scanning, license checking, auto-commit |
| `userPromptSubmitted` | User sends prompt | `{"userMessage":"..."}` | Prompt threat detection |
| `preToolUse` | Before tool executes | `{"toolName":"...","toolInput":"..."}` | Block dangerous operations |

## hooks.json Schema

```json
{
  "version": 1,
  "hooks": {
    "<event>": [{
      "type": "command",
      "bash": "path/to/script.sh",
      "cwd": ".",
      "env": { "MODE": "warn" },
      "timeoutSec": 30
    }]
  }
}
```

## Folder Structure

```
hooks/
  frootai-secrets-scanner/
    README.md          # Documentation
    hooks.json         # Event configuration
    scan-secrets.sh    # The scanning script
  frootai-tool-guardian/
    README.md
    hooks.json
    guard-tool.sh
  frootai-governance-audit/
    README.md
    hooks.json
    audit-prompt.sh
```

## Planned Hooks

| Hook | Event | Priority | Mode |
|------|-------|----------|------|
| **frootai-secrets-scanner** | sessionEnd | P0 Critical | warn/block |
| **frootai-tool-guardian** | preToolUse | P0 Critical | warn/block |
| **frootai-governance-audit** | sessionStart, sessionEnd, userPromptSubmitted | P0 Critical | open/standard/strict |
| frootai-license-checker | sessionEnd | P1 High | warn/block |
| frootai-waf-compliance-check | sessionEnd | P1 High | warn |
| frootai-session-logger | all events | P2 Medium | log |
| frootai-cost-tracker | sessionEnd | P2 Medium | log |

## Naming Convention

`frootai-kebab-case/` folder with `hooks.json` + script.

## Validation

```bash
node scripts/validate-primitives.js hooks/
```
