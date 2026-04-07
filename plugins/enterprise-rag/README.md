# Enterprise RAG Plugin

> Production-grade Retrieval-Augmented Generation — the first FrootAI plugin, packaging Play 01 with all standalone primitives wired together.

## What's Included

| Primitive | Name | Purpose |
|-----------|------|---------|
| **Agent** | `frootai-rag-architect` | Designs RAG pipelines with Azure AI Search, evaluation, and cost controls |
| **Instruction** | `python-waf` | Python coding standards aligned with 4 WAF pillars |
| **Instruction** | `bicep-waf` | Bicep IaC standards aligned with 5 WAF pillars |
| **Skill** | `frootai-play-initializer` | Scaffolds new solution plays with full FAI Protocol structure |
| **Hook** | `frootai-secrets-scanner` | 25+ regex patterns for credential leak detection |
| **Hook** | `frootai-tool-guardian` | 7 threat categories blocking dangerous operations |
| **Hook** | `frootai-governance-audit` | 5 threat categories with 4 audit levels for prompt safety |

## Installation

### Via FrootAI CLI (coming soon)
```bash
npx frootai plugin install enterprise-rag
```

### Manual
Copy the referenced primitives from the FrootAI repository into your project's `.github/` directory.

## Compatible Plays

- **Play 01** — Enterprise RAG Q&A
- **Play 09** — AI Search Portal
- **Play 21** — Agentic RAG (planned)

## Quality Gates

This plugin enforces these evaluation thresholds when used inside a play:

| Metric | Threshold | Action |
|--------|-----------|--------|
| Groundedness | ≥ 0.95 | Retry on failure |
| Coherence | ≥ 0.90 | Retry on failure |
| Relevance | ≥ 0.85 | Warn |
| Safety violations | 0 | Block |
| Cost per query | ≤ $0.01 | Alert |

## WAF Pillar Coverage

| Pillar | How This Plugin Addresses It |
|--------|------------------------------|
| Security | Secrets scanner hook, Managed Identity in Bicep, Key Vault in Python |
| Reliability | Retry patterns in Python, health probes in Bicep, circuit breaker guidance |
| Cost Optimization | Model routing in agent, token budgets in Python, consumption SKUs in Bicep |
| Performance | Async patterns in Python, streaming in agent, CDN in Bicep |
| Responsible AI | Governance audit hook, content safety in agent, grounding enforcement |

## License

MIT — see [LICENSE](../../LICENSE)
