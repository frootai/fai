# Solution Play 14: Cost-Optimized AI Gateway

> **Complexity:** Medium | **Status:** Skeleton
> APIM-based AI gateway with semantic caching, load balancing, and token budgets.

## Architecture

```mermaid
graph LR
    A[Input] --> B[Process] --> C[AI] --> D[Output]
```

## DevKit

Infra: API Management  Redis Cache  Azure OpenAI (multi-region)

| File | Purpose |
|------|---------|
| agent.md | Agent personality |
| instructions.md | System prompts |
| .github/copilot-instructions.md | IDE context |
| .vscode/mcp.json | MCP auto-connect |
| mcp/index.js | Solution tools |
| plugins/ | Reusable functions |

## TuneKit

Tuning: Token budgets, caching rules, fallback chain, rate limits

| Config | What |
|--------|------|
| config/openai.json | AI parameters |
| config/guardrails.json | Safety rules |
| infra/main.bicep | Azure resources |
| evaluation/ | Test + scoring |

---

> DevKit builds. TuneKit ships.
