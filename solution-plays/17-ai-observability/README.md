# Solution Play 17: AI Observability Dashboard

> **Complexity:** Medium | **Status:** Skeleton
> Monitor AI workloads with custom KQL queries, quality alerts, and workbooks.

## Architecture

```mermaid
graph LR
    A[Input] --> B[Process] --> C[AI] --> D[Output]
```

## DevKit

Infra: Application Insights  Log Analytics  Azure Monitor  Workbooks

| File | Purpose |
|------|---------|
| agent.md | Agent personality |
| instructions.md | System prompts |
| .github/copilot-instructions.md | IDE context |
| .vscode/mcp.json | MCP auto-connect |
| mcp/index.js | Solution tools |
| plugins/ | Reusable functions |

## TuneKit

Tuning: KQL queries, alert thresholds, quality metrics, dashboards

| Config | What |
|--------|------|
| config/openai.json | AI parameters |
| config/guardrails.json | Safety rules |
| infra/main.bicep | Azure resources |
| evaluation/ | Test + scoring |

---

> DevKit builds. TuneKit ships.
