# FrootAI MCP Server — Glama.ai Listing

## Name
FrootAI MCP Server

## Tagline
The open glue for the GenAI ecosystem — 25 MCP tools, 100 solution plays, 830+ AI primitives

## Description

FrootAI is the missing binding layer for AI development. While MCP handles tool calling, A2A handles delegation, and AG-UI handles rendering, FrootAI handles **wiring** — declaring how AI primitives (agents, instructions, skills, hooks, plugins) connect, share context, and enforce quality gates.

### Key Capabilities

- **25 MCP Tools** — Architecture guidance, solution plays, model comparison, cost estimation, AI evaluation
- **100 Solution Plays** — Production-ready AI architectures (Enterprise RAG, Multi-Agent, Voice AI, etc.)
- **830+ Primitives** — 238 agents, 176 instructions, 322 skills, 10 hooks, 77 plugins
- **FAI Protocol** — Declarative context-wiring standard (`fai-manifest.json`) — the Dockerfile for AI systems
- **16 Knowledge Modules** — Covering GenAI foundations, RAG, agents, infrastructure, responsible AI
- **Framework Adapters** — Semantic Kernel and LangChain adapters for cross-framework portability

### Installation

```bash
# stdio transport
npx frootai-mcp@latest

# HTTP transport
npx frootai-mcp@latest --transport http --port 3001

# Docker
docker run -p 3001:3001 ghcr.io/frootai/mcp-server:latest

# Python
pip install frootai-mcp
python -m frootai_mcp
```

### Links

- **Website**: https://frootai.dev
- **GitHub**: https://github.com/frootai/frootai
- **npm**: https://www.npmjs.com/package/frootai-mcp
- **PyPI**: https://pypi.org/project/frootai-mcp/
- **VS Code**: https://marketplace.visualstudio.com/items?itemName=frootai.frootai

## Category
Developer Tools, AI/ML

## Tags
mcp, ai, agents, rag, architecture, azure, evaluation, primitives
