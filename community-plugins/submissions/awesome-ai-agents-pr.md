# awesome-ai-agents PR Entry

Add this entry under the appropriate section (Frameworks / Platforms / Open Source):

---

### FrootAI

> Open-source AI primitive unification platform — the missing glue layer for AI agent ecosystems.

- **830+ Primitives**: 238 agents, 176 instructions, 322 skills, 10 hooks, 77 plugins, 12 workflows
- **100 Solution Plays**: Production-ready architectures (RAG, Multi-Agent, Voice AI, Document Intelligence, etc.)
- **FAI Protocol**: Declarative standard for wiring AI primitives — the Dockerfile equivalent for AI systems
- **Framework Adapters**: Semantic Kernel, LangChain, AutoGen, CrewAI compatible
- **25 MCP Tools**: Full MCP server for AI architecture guidance and evaluation
- **6 Distribution Channels**: npm, PyPI, VS Code, Docker, GitHub Actions, CLI

**Links**: [Website](https://frootai.dev) · [GitHub](https://github.com/frootai/frootai) · [MCP Server](https://www.npmjs.com/package/frootai-mcp)

---

## PR Template

**Title**: Add FrootAI — AI primitive unification platform (830+ primitives, 100 plays)

**Body**:

This PR adds [FrootAI](https://frootai.dev) — an open-source platform for unifying AI primitives (agents, instructions, skills, hooks, plugins) via the FAI Protocol.

**Key differentiators:**
- **FAI Protocol** (`fai-manifest.json`) — declarative context-wiring standard. While MCP handles tool calling and A2A handles delegation, FAI handles how primitives share context and enforce quality gates.
- **100 solution plays** — each is a self-contained, deployable AI architecture with agents, infrastructure (Bicep + Terraform), evaluation pipelines, and quality guardrails.
- **830+ reusable primitives** cataloged with WAF (Well-Architected Framework) alignment.
- **Cross-framework**: adapters for Semantic Kernel, LangChain, and more.

**License:** MIT
