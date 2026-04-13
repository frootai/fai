# FAI — Hooks (10)

> 10 security hooks that run at session lifecycle events — secrets scanning, tool guarding, governance audit, PII redaction, cost tracking, WAF compliance, license checking, session logging, token budgets, output validation.

## What Are FAI Hooks?

Hooks are bash scripts triggered by VS Code Copilot session events. They enforce security, compliance, and observability automatically — without user intervention.

## Hook Event Model

| Event | When | Stdin | Use Case |
|-------|------|-------|----------|
| `SessionStart` | Session begins | None | Governance audit, session logging |
| `Stop` | Session ends | None | Secrets scanning, license checking, auto-commit |
| `UserPromptSubmit` | User sends prompt | `{"userMessage":"..."}` | Prompt threat detection |
| `PreToolUse` | Before tool executes | `{"toolName":"...","toolInput":"..."}` | Block dangerous operations |

## hooks.json Schema

```json
{
  
  "hooks": {
    "<event>": [{
      "type": "command",
      "bash": "path/to/script.sh",
      "cwd": ".",
      "env": { "MODE": "warn" },
      "timeout": 30
    }]
  }
}
```

## Folder Structure

```
hooks/
  FAI-secrets-scanner/
    README.md          # Documentation
    hooks.json         # Event configuration
    scan-secrets.sh    # The scanning script
  FAI-tool-guardian/
    README.md
    hooks.json
    guard-tool.sh
  FAI-governance-audit/
    README.md
    hooks.json
    audit-prompt.sh
```

## Planned Hooks

| Hook | Event | Priority | Mode |
|------|-------|----------|------|
| **FAI-secrets-scanner** | Stop | P0 Critical | warn/block |
| **FAI-tool-guardian** | PreToolUse | P0 Critical | warn/block |
| **FAI-governance-audit** | SessionStart, Stop, UserPromptSubmit | P0 Critical | open/standard/strict |
| FAI-license-checker | Stop | P1 High | warn/block |
| FAI-waf-compliance-check | Stop | P1 High | warn |
| FAI-session-logger | all events | P2 Medium | log |
| FAI-cost-tracker | Stop | P2 Medium | log |

## Naming Convention

`FAI-kebab-case/` folder with `hooks.json` + script.

## Validation

```bash
node scripts/validate-primitives.js hooks/
```
