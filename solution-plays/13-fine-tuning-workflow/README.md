# Solution Play 13: Fine-Tuning Workflow

> **Complexity:** High | **Status:** Skeleton
> End-to-end fine-tuning pipeline  data prep, LoRA training, evaluation, deployment.

## Architecture

```mermaid
graph LR
    A[Input] --> B[Process] --> C[AI] --> D[Output]
```

## DevKit

Infra: AI Foundry  GPU Compute  Storage  MLflow

| File | Purpose |
|------|---------|
| agent.md | Agent personality |
| instructions.md | System prompts |
| .github/copilot-instructions.md | IDE context |
| .vscode/mcp.json | MCP auto-connect |
| mcp/index.js | Solution tools |
| plugins/ | Reusable functions |

## TuneKit

Tuning: LoRA rank, learning rate, epochs, eval metrics

| Config | What |
|--------|------|
| config/openai.json | AI parameters |
| config/guardrails.json | Safety rules |
| infra/main.bicep | Azure resources |
| evaluation/ | Test + scoring |

---

> DevKit builds. TuneKit ships.
