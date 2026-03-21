# Solution Play 15: Multi-Modal Document Processing

> **Complexity:** Medium | **Status:** Skeleton
> Process documents with text + images using GPT-4o multi-modal capabilities.

## Architecture

```mermaid
graph LR
    A[Input] --> B[Process] --> C[AI] --> D[Output]
```

## DevKit

Infra: GPT-4o  Blob Storage  Cosmos DB  Functions

| File | Purpose |
|------|---------|
| agent.md | Agent personality |
| instructions.md | System prompts |
| .github/copilot-instructions.md | IDE context |
| .vscode/mcp.json | MCP auto-connect |
| mcp/index.js | Solution tools |
| plugins/ | Reusable functions |

## TuneKit

Tuning: Image prompts, extraction schemas, confidence thresholds

| Config | What |
|--------|------|
| config/openai.json | AI parameters |
| config/guardrails.json | Safety rules |
| infra/main.bicep | Azure resources |
| evaluation/ | Test + scoring |

---

> DevKit builds. TuneKit ships.
