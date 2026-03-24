# frootai-mcp

> **22-tool MCP server for AI architecture.** Knowledge + compute + agent chain  works offline, fetches live, chains in chat.

[![npm](https://img.shields.io/npm/v/frootai-mcp)](https://www.npmjs.com/package/frootai-mcp) [![license](https://img.shields.io/npm/l/frootai-mcp)](LICENSE)

---

## Quick Start

```bash
npx frootai-mcp
```

Or install globally:

```bash
npm i -g frootai-mcp && frootai-mcp
```

### Connect to Your AI Agent

**VS Code** (`.vscode/mcp.json`):
```json
{ "servers": { "frootai": { "type": "stdio", "command": "npx", "args": ["frootai-mcp"] } } }
```

**Claude Desktop / Cursor**:
```json
{ "mcpServers": { "frootai": { "command": "npx", "args": ["frootai-mcp"] } } }
```

---

## 22 Tools

### Static (6)  Bundled knowledge, works offline

| Tool | What it does |
|------|-------------|
| `list_modules` | Browse 18 FROOT modules by layer |
| `get_module` | Read any module (F1-F4, R1-R3, O1-O6, T1-T3) |
| `lookup_term` | 200+ AI/ML term definitions |
| `search_knowledge` | Full-text search across all modules |
| `get_architecture_pattern` | 7 decision guides (RAG vs fine-tuning, model selection, etc.) |
| `get_froot_overview` | Complete framework summary |

### Live (4)  Network-enabled, graceful offline fallback

| Tool | What it does |
|------|-------------|
| `fetch_azure_docs` | Search Microsoft Learn for Azure docs |
| `fetch_external_mcp` | Find MCP servers from public registries |
| `list_community_plays` | List 20 solution plays from GitHub |
| `get_github_agentic_os` | .github Agentic OS guide (7 primitives) |

### Agent Chain (3)  Build > Review > Tune in conversation

| Tool | What it does |
|------|-------------|
| `agent_build` | Architecture guidance + code patterns, suggests review |
| `agent_review` | Security + quality checklist, suggests tuning |
| `agent_tune` | Production readiness validation, suggests deploy |

Just talk: *"Build me an IT ticket API"* then *"Review this"* then *"Validate my config"*. Each tool hands off to the next.

### Ecosystem (3)  Azure AI model intelligence

| Tool | What it does |
|------|-------------|
| `get_model_catalog` | Azure AI model catalog with pricing + capabilities |
| `get_azure_pricing` | Monthly cost estimates for 25+ Azure services |
| `compare_models` | Side-by-side model comparison for your use case |

### Compute (6)  Real calculations, not just lookups

| Tool | What it does |
|------|-------------|
| `semantic_search_plays` | Embedding-powered search across 20 solution plays |
| `estimate_cost` | Itemized Azure cost estimate per play + scale |
| `validate_config` | Validate openai.json / guardrails.json against best practices |
| `compare_plays` | Side-by-side comparison of solution plays |
| `generate_architecture_diagram` | Mermaid architecture diagrams for any play |
| `embedding_playground` | Cosine similarity between texts (educational) |

---

## What is Bundled

- **18 FROOT modules**  Foundations, Reasoning, Orchestration, Operations, Transformation
- **200+ glossary terms**  from ablation to zero-shot
- **20 solution plays**  each with .github Agentic OS (19 files per play)
- **7 architecture decision guides**  RAG, agents, hosting, cost, deterministic AI
- **682KB knowledge bundle**  curated, verified, zero hallucination

---

## Links

| | |
|---|---|
| **Website** | [frootai.dev](https://frootai.dev) |
| **VS Code** | [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=pavleenbali.frootai) |
| **GitHub** | [github.com/gitpavleenbali/frootai](https://github.com/gitpavleenbali/frootai) |
| **Setup Guide** | [frootai.dev/setup-guide](https://frootai.dev/setup-guide) |

---

**FrootAI**  From the Roots to the Fruits. The open glue for GenAI.
