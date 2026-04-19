# awesome-ai-agents PR Entry

Add this entry under the appropriate section (Frameworks / Platforms / Open Source):

---

### FrootAI

> Open-source AI primitive unification platform — the uniFAIng layer for AI agent ecosystems. Context-wires agents, instructions, skills, hooks, and plugins into deployable AI systems via the FAI Protocol.

- **AI Primitives**: Agents, instructions, skills, hooks, plugins, workflows, cookbook recipes
- **Solution Plays**: Production-ready architectures (Enterprise RAG, Agentic RAG, Multi-Agent, Voice AI, Document Intelligence, Edge AI, Browser Agents, and more)
- **FAI Protocol v2.0**: Declarative standard for wiring AI primitives with moonshot contract types — the Dockerfile equivalent for AI systems
- **Framework Adapters**: Semantic Kernel, LangChain native adapters for cross-framework portability
- **MCP Tools**: Full MCP server (v5.2.0) for AI architecture guidance, primitive management, and evaluation
- **Infrastructure as Code**: Bicep + Terraform templates for every Azure-based solution play
- **Multi-Channel Distribution**: npm, PyPI, VS Code Marketplace, Docker (ghcr.io), GitHub Actions, CLI
- **Knowledge Modules**: Covering GenAI foundations through production operations

**Links**: [Website](https://frootai.dev) · [GitHub](https://github.com/frootai/frootai) · [MCP Server](https://www.npmjs.com/package/frootai-mcp) · [Docker](https://github.com/frootai/frootai/pkgs/container/mcp-server)

---

## PR Template

**Title**: Add FrootAI — AI primitive unification platform (AI primitives, solution plays, MCP tools)

**Body**:

This PR adds [FrootAI](https://frootai.dev) — an open-source platform for unifying AI primitives (agents, instructions, skills, hooks, plugins) via the FAI Protocol.

**Key differentiators:**
- **FAI Protocol v2.0** (`fai-manifest.json`) — declarative context-wiring standard with moonshot contract types. While MCP handles tool calling and A2A handles delegation, FAI handles how primitives share context, enforce quality gates, and wire into deployable systems.
- **Solution plays** — each is a self-contained, deployable AI architecture with agents, infrastructure (Bicep + Terraform), evaluation pipelines, and quality guardrails.
- **Reusable AI primitives** cataloged with WAF (Well-Architected Framework) alignment across 6 pillars.
- **MCP tools** (v5.2.0) — architecture guidance, play discovery, model comparison, cost estimation, evaluation, and primitive management via stdio and Streamable HTTP transports.
- **Cross-framework**: native adapters for Semantic Kernel and LangChain.
- **Multi-channel distribution**: npm, PyPI, VS Code Marketplace, Docker, GitHub Actions, CLI.

**License:** MIT
