# AGENTS.md — FrootAI Cross-Platform Agent Discovery

> **Standard**: This file follows the [AGENTS.md specification](https://github.com/anthropics/agent-specification) for cross-platform agent discovery.
> Any AI coding assistant (Copilot, Claude, Cursor, Windsurf, Cody, etc.) can read this file to discover available agents.

## Overview

FrootAI provides **201 specialized AI agents** organized by domain. Each agent is a `.agent.md` file with YAML frontmatter defining its description, tools, model preferences, and WAF (Well-Architected Framework) alignment.

**Browse the full catalog**: [frootai.dev/primitives/agents](https://frootai.dev/primitives/agents)

## Agent Architecture

```
agents/
├── frootai-rag-architect.agent.md          # RAG specialist
├── frootai-azure-ai-search-expert.agent.md # AI Search expert
├── frootai-security-auditor.agent.md       # Security reviewer
├── ... (201 agents)
└── fai-context.json                        # Per-agent FAI Protocol context
```

Each agent follows this structure:
```yaml
---
description: "One-line description of what this agent does"
tools: ["tool1", "tool2"]                    # MCP tools the agent can call
model: "gpt-4o"                              # Preferred model
waf: ["security", "reliability"]             # WAF pillar alignment
plays: ["01-enterprise-rag", "21-agentic-rag"] # Compatible solution plays
---

# Agent Name

Detailed instructions for the agent's behavior, expertise, and constraints.
```

## Agent Categories

### 🔍 RAG & Search (15+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-rag-architect` | RAG pipeline design — chunking, indexing, retrieval, reranking | 01, 21, 28 |
| `frootai-azure-ai-search-expert` | AI Search configuration, semantic ranking, hybrid search | 01, 09, 26 |
| `frootai-agentic-retriever` | Autonomous retrieval — source selection, iteration, citations | 21 |
| `frootai-knowledge-graph-expert` | Graph-based RAG — entity extraction, relationship mapping | 28 |
| `frootai-semantic-search-optimizer` | Search relevance tuning, scoring profiles, personalization | 26, 56, 95 |

### 🤖 Agent & Multi-Agent (15+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-multi-agent-architect` | Multi-agent orchestration — supervisor, delegation, handoffs | 07, 22 |
| `frootai-deterministic-agent-expert` | Zero-temperature, reproducible agents with guardrails | 03 |
| `frootai-swarm-coordinator` | Distributed agent teams — topology, conflict resolution | 22 |
| `frootai-continual-learning-expert` | Persistent memory, reflection, knowledge distillation | 93 |
| `frootai-autonomous-coding-expert` | Issue-to-PR, multi-file changes, test generation | 51 |

### 🏗️ Infrastructure & Platform (20+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-architect` | Solution architecture — Azure services, patterns, WAF | All plays |
| `frootai-ai-infra-expert` | GPU, networking, AKS, private endpoints | 02, 11, 12 |
| `frootai-bicep-expert` | Bicep IaC — modules, parameters, deployment | All plays |
| `frootai-cost-optimizer` | FinOps — model routing, caching, right-sizing | 14, 52, 66 |
| `frootai-edge-ai-expert` | On-device inference, ONNX, IoT Hub sync | 19, 34, 44 |

### 🔒 Security & Compliance (15+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-security-auditor` | OWASP LLM Top 10, prompt injection defense | 30, 41 |
| `frootai-compliance-expert` | GDPR, HIPAA, SOC 2, EU AI Act | 35, 70, 99 |
| `frootai-responsible-ai-expert` | Fairness, bias detection, transparency | 60 |
| `frootai-content-safety-expert` | Content moderation, severity scoring | 10, 61 |
| `frootai-red-team-specialist` | Adversarial testing, jailbreak simulation | 41 |

### 🎙️ Voice & Speech (5+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-voice-ai-architect` | STT→LLM→TTS pipelines, real-time streaming | 04, 33, 96 |
| `frootai-speech-specialist` | Speech-to-text, text-to-speech, diarization | 04, 33, 39 |

### 📄 Document Processing (10+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-document-intelligence-expert` | OCR, form extraction, table recognition | 06, 15, 38 |
| `frootai-legal-ai-expert` | Contract review, clause extraction, compliance | 53 |

### 🏥 Industry Specialists (20+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-healthcare-ai-expert` | HIPAA, clinical coding, drug interactions | 46 |
| `frootai-financial-risk-expert` | Market analysis, credit risk, fraud detection | 50, 63 |
| `frootai-climate-ai-expert` | Carbon accounting, ESG, energy optimization | 69, 70, 71 |
| `frootai-education-ai-expert` | Tutoring, assessment, adaptive learning | 74, 75, 76 |
| `frootai-agriculture-ai-expert` | Crop health, irrigation, yield prediction | 78 |
| `frootai-retail-ai-expert` | Pricing, inventory, visual search | 87, 88, 89 |
| `frootai-telecom-ai-expert` | Network optimization, churn, fraud | 90, 91, 92 |
| `frootai-government-ai-expert` | Citizen services, policy analysis | 84, 85, 86 |

### ⚙️ DevOps & Tooling (15+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-devops-agent` | CI/CD, incident response, deployment risk | 37 |
| `frootai-testing-expert` | Test generation, mutation testing, coverage | 32 |
| `frootai-code-reviewer` | PR review, OWASP scanning, style checks | 24 |
| `frootai-observability-expert` | KQL queries, dashboards, alerting | 17 |
| `frootai-prompt-engineer` | Prompt versioning, A/B testing, optimization | 18 |

### 🧠 ML & Model Management (10+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-fine-tuning-expert` | LoRA, QLoRA, data prep, evaluation | 13 |
| `frootai-model-governance-expert` | Model registry, approval gates, A/B testing | 48 |
| `frootai-evaluation-specialist` | Benchmarking, scoring, leaderboards | 98 |

### 🎨 Creative & Media (10+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-creative-ai-expert` | Multi-modal content, brand voice | 49 |
| `frootai-translation-expert` | Multilingual, glossaries, quality scoring | 57 |
| `frootai-video-generation-expert` | Text-to-video, batch processing | 43 |

### 🔌 Platform Agents (10+ agents)
| Agent | Description | Compatible Plays |
|-------|-------------|-----------------|
| `frootai-copilot-studio-expert` | Declarative agents, M365, Graph API | 08, 16, 40 |
| `frootai-mcp-expert` | MCP protocol, tool calling, gateway | 29 |
| `frootai-semantic-kernel-expert` | SK plugins, planners, orchestration | All plays |

## How to Use

### In VS Code (with GitHub Copilot)
```
# Copilot automatically discovers agents from .agent.md files
# Reference an agent in Copilot Chat:
@workspace Which agent should I use for RAG?
```

### In a Solution Play
Agents are wired via `fai-manifest.json`:
```json
{
  "primitives": {
    "agents": ["./agent.md", "../../agents/frootai-rag-architect.agent.md"]
  }
}
```

### Via MCP Server
```bash
npx frootai-mcp@latest  # 25 tools including agent_build, agent_review, agent_tune
```

### Via CLI
```bash
npx frootai primitives --type agents  # Browse all 201 agents
```

## Related Resources

- **Full Catalog**: [frootai.dev/primitives/agents](https://frootai.dev/primitives/agents)
- **Agent Patterns (L3)**: [frootai.dev/learning-hub/agent-patterns](https://frootai.dev/learning-hub/agent-patterns)
- **Primitive Primer (L2)**: [frootai.dev/learning-hub/primitive-primer](https://frootai.dev/learning-hub/primitive-primer)
- **FAI Protocol**: [frootai.dev/fai-protocol](https://frootai.dev/fai-protocol)
- **100 Solution Plays**: [frootai.dev/solution-plays](https://frootai.dev/solution-plays)
- **GitHub**: [github.com/frootai/frootai/tree/main/agents](https://github.com/frootai/frootai/tree/main/agents)
