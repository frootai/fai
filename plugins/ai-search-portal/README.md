# ai-search-portal

> AI Search Portal — full-text and vector hybrid search with semantic ranking, faceted navigation, autocomplete, and personalized results. Build a production search experience on Azure AI Search with RAG integration.

## Overview

This plugin bundles **16 primitives** (5 agents, 3 instructions, 5 skills, 3 hooks) into a single installable package. All primitives are WAF-aligned and compatible with the FAI Protocol auto-wiring system.

## Installation

```bash
npx frootai install ai-search-portal
```

Or manually copy the referenced primitives from the FrootAI repository into your project.

## What's Included

| Type | Name | Purpose |
|------|------|---------|
| Agent | `frootai-play-09-builder` | Play 09 builder specialist |
| Agent | `frootai-play-09-reviewer` | Play 09 reviewer specialist |
| Agent | `frootai-play-09-tuner` | Play 09 tuner specialist |
| Agent | `frootai-azure-ai-search-expert` | Azure ai search expert specialist |
| Agent | `frootai-embedding-expert` | Embedding expert specialist |
| Instruction | `play-09-ai-search-portal-patterns` | Play 09 ai search portal patterns standards |
| Instruction | `python-waf` | Python waf standards |
| Instruction | `nextjs-waf` | Nextjs waf standards |
| Skill | `frootai-deploy-09-ai-search-portal` | Deploy 09 ai search portal capability |
| Skill | `frootai-evaluate-09-ai-search-portal` | Evaluate 09 ai search portal capability |
| Skill | `frootai-tune-09-ai-search-portal` | Tune 09 ai search portal capability |
| Skill | `frootai-azure-ai-search-index` | Azure ai search index capability |
| Skill | `frootai-build-semantic-search` | Build semantic search capability |
| Hook | `frootai-secrets-scanner` | Secrets scanner gate |
| Hook | `frootai-tool-guardian` | Tool guardian gate |
| Hook | `frootai-governance-audit` | Governance audit gate |

## Compatible Solution Plays

- **Play 09-ai-search-portal**

## Keywords

`ai-search` `vector-search` `semantic-ranking` `hybrid-search` `faceted-navigation` `azure-ai-search` `rag`

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
| Security | Secrets scanning, Managed Identity, Key Vault integration, RBAC |
| Reliability | Retry with backoff, circuit breaker, health probes, fallback chains |
| Operational Excellence | CI/CD integration, observability, IaC templates, automated testing |

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
2. Edit files in `plugins/ai-search-portal/`
3. Run `npm run validate:primitives` to verify
4. Open a PR — CI validates schema and naming automatically

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.

## License

MIT — see [LICENSE](../../LICENSE)