---
description: "Low-Code AI Builder domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Low-Code AI Builder — Domain Knowledge

This workspace implements a low-code AI application builder — visual workflow designer, pre-built AI connectors (OpenAI, Document Intelligence, Speech), drag-and-drop pipeline composition, and one-click deployment.

## Low-Code AI Architecture (What the Model Gets Wrong)

### Declarative Pipeline Definition (Not Imperative Code)
```json
{
  "pipeline": "customer-support",
  "steps": [
    { "type": "input", "source": "email", "connector": "outlook-connector" },
    { "type": "ai", "model": "gpt-4o-mini", "task": "classify", "output": "category" },
    { "type": "condition", "if": "category == 'urgent'", "then": "escalate", "else": "auto-reply" },
    { "type": "ai", "model": "gpt-4o", "task": "generate-reply", "context": "knowledge-base" },
    { "type": "output", "destination": "email", "connector": "outlook-connector" }
  ]
}
```

### Pre-Built Connectors vs Custom Code
| Connector | Use Case | Config Only |
|-----------|----------|-------------|
| OpenAI | Text generation, classification, extraction | Model, temperature, prompt template |
| Document Intelligence | OCR, form extraction, table recognition | Model ID, confidence threshold |
| Speech | STT/TTS for voice workflows | Language, voice, speed |
| Outlook/Teams | Email/message input/output | Auth, mailbox, channel |
| SharePoint | Document source for RAG | Site URL, library, permissions |
| SQL/Cosmos | Data read/write | Connection string, query template |

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Code-first for simple workflows | Over-engineering, slow to iterate | Use declarative pipeline definition |
| Hardcoded AI prompts in pipeline | Can't iterate without redeploying | Prompt registry with version control |
| No error handling in steps | One step failure kills entire pipeline | Per-step retry + fallback + DLQ |
| No input validation | Bad data flows through entire pipeline | Validate at each step boundary |
| Monolithic pipeline | Can't reuse steps across workflows | Modular steps with standard interfaces |
| No monitoring per step | Can't identify bottleneck | Emit metrics per step: latency, success rate |
| No preview/test mode | Changes go to production untested | Sandbox mode with test data |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Default model, temperature per task type |
| `config/guardrails.json` | Step timeout, retry limits, validation rules |
| `config/agents.json` | Connector configs, auth settings |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Design pipelines, configure connectors, set up deployment |
| `@reviewer` | Audit pipeline logic, error handling, security |
| `@tuner` | Optimize step performance, model selection, cost |

## Slash Commands
`/deploy` — Deploy pipeline | `/test` — Test with sample data | `/review` — Audit pipeline | `/evaluate` — Measure step metrics
