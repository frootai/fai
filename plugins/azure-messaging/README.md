# azure-messaging

> Azure Messaging — Service Bus, Event Hubs, and Event Grid patterns for async communication, event sourcing, and CQRS. Build reliable message-driven architectures with dead-letter handling and partitioning.

## Overview

This plugin bundles **11 primitives** (3 agents, 2 instructions, 3 skills, 3 hooks) into a single installable package. All primitives are WAF-aligned and compatible with the FAI Protocol auto-wiring system.

## Installation

```bash
npx frootai install azure-messaging
```

Or manually copy the referenced primitives from the FrootAI repository into your project.

## What's Included

| Type | Name | Purpose |
|------|------|---------|
| Agent | `frootai-azure-service-bus-expert` | Azure service bus expert specialist |
| Agent | `frootai-azure-event-hubs-expert` | Azure event hubs expert specialist |
| Agent | `frootai-event-driven-expert` | Event driven expert specialist |
| Instruction | `reliability-python` | Reliability python standards |
| Instruction | `reliability-typescript` | Reliability typescript standards |
| Skill | `frootai-azure-service-bus-setup` | Azure service bus setup capability |
| Skill | `frootai-azure-event-hubs-setup` | Azure event hubs setup capability |
| Skill | `frootai-azure-event-grid-setup` | Azure event grid setup capability |
| Hook | `frootai-secrets-scanner` | Secrets scanner gate |
| Hook | `frootai-tool-guardian` | Tool guardian gate |
| Hook | `frootai-governance-audit` | Governance audit gate |

## Keywords

`azure` `service-bus` `event-hubs` `event-grid` `messaging` `async` `cqrs` `event-sourcing`

## Usage

After installation, the primitives are available in your project:

1. **Agents** activate when you `@mention` them in Copilot Chat
2. **Instructions** auto-apply to matching files via `applyTo` glob patterns
3. **Skills** are invoked by agents or via `/skill` commands
4. **Hooks** fire automatically at session lifecycle events

When used inside a solution play with `fai-manifest.json`, all primitives auto-wire through the FAI Protocol — shared context, WAF guardrails, and evaluation thresholds propagate automatically.

## WAF Alignment

| Pillar | Coverage |
|--------|----------|
| Operational Excellence | CI/CD integration, observability, IaC templates, automated testing |
| Performance Efficiency | Async patterns, streaming, caching, parallel execution |

## Quality Gates

When used inside a play, this plugin enforces:

| Metric | Threshold |
|--------|-----------|
| Groundedness | ≥ 0.85 |
| Coherence | ≥ 0.80 |
| Relevance | ≥ 0.80 |
| Safety | 0 violations |
| Cost per query | ≤ $0.05 |

## Contributing

To improve this plugin:

1. Fork the [FrootAI repository](https://github.com/FrootAI/frootai)
2. Edit files in `plugins/azure-messaging/`
3. Run `npm run validate:primitives` to verify
4. Open a PR — CI validates schema and naming automatically

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

## License

MIT — see [LICENSE](../../LICENSE)