# 🎯 FrootAI Solution Plays

> **One command. Complete AI solution. Pre-tuned. Evaluated.**
> Each solution play is a deployable package: infrastructure + AI configuration + agent instructions + evaluation pipeline.

---

## Available Solution Plays

| # | Solution | Complexity | What It Deploys | Status |
|---|---------|-----------|----------------|--------|
| 01 | [Enterprise RAG Q&A](./01-enterprise-rag/) | Medium | RAG pipeline with AI Search + OpenAI + Container App | ✅ Ready |
| 02 | [AI Landing Zone](./02-ai-landing-zone/) | Foundation | VNet + Private Endpoints + RBAC + GPU + AI Services | ✅ Ready |
| 03 | [Deterministic Agent](./03-deterministic-agent/) | Medium | Reliable agent with temp=0, structured output, guardrails | ✅ Ready |

## Coming Soon

| # | Solution | Status |
|---|---------|--------|
| 04 | Call Center Voice AI | 🔜 Phase 2 |
| 05 | IT Ticket Resolution | 🔜 Phase 2 |
| 06 | Document Intelligence Pipeline | 🔜 Phase 2 |
| 07 | Multi-Agent Customer Service | 🔜 Phase 2 |
| 08–20 | [See full roadmap](../ROADMAP.md) | 🔜 Phase 2–3 |

## How Solution Plays Work

```
solution-plays/01-enterprise-rag/
├── README.md           ← Overview + architecture diagram
├── agent.md            ← Agent personality + rules + examples
├── config/
│   ├── openai.json     ← Model + temperature + top-k (pre-tuned)
│   ├── search.json     ← Index + retrieval + reranking config
│   └── chunking.json   ← Chunk size + overlap + strategy
├── infra/
│   └── main.bicep      ← One-click Azure deployment
├── evaluation/
│   ├── test-set.jsonl  ← 100 test questions with ground truth
│   └── eval.py         ← Automated quality scoring
└── mcp/
    └── index.js        ← Solution-specific MCP tools
```

**The power**: An infra person reviews the config files, adjusts knobs if needed, runs `azd up`, and gets a production AI solution — with the AI parameters already tuned by architects.

---

> **FrootAI** — Know the roots. Ship the fruit.
