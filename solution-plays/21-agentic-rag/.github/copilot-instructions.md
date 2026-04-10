---
description: "Agentic RAG domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Agentic RAG — Domain Knowledge

This workspace implements agentic RAG — an autonomous retrieval agent that decides WHEN to search, WHICH sources to query, and WHETHER to iterate on results, rather than always retrieving on every query.

## Agentic RAG vs Traditional RAG (What the Model Gets Wrong)

### Traditional RAG (Always Retrieve)
```python
# WRONG for agentic — always retrieves regardless of query
chunks = search(query)  # Always runs
response = generate(query, chunks)  # Always uses retrieval
```

### Agentic RAG (Decide → Search → Evaluate → Iterate)
```python
# CORRECT — agent decides whether retrieval is needed
class AgenticRAG:
    async def process(self, query: str) -> Response:
        # Step 1: Does this query NEED retrieval?
        if self.can_answer_directly(query):
            return self.direct_answer(query)  # Skip retrieval for simple facts
        
        # Step 2: Which sources to search?
        sources = self.select_sources(query)  # [web, internal_docs, code_repo]
        
        # Step 3: Retrieve and evaluate
        chunks = await self.multi_source_retrieve(query, sources)
        
        # Step 4: Are results sufficient? If not, reformulate and retry
        if self.evaluate_sufficiency(chunks, query) < 0.7:
            refined_query = self.reformulate_query(query, chunks)
            chunks = await self.multi_source_retrieve(refined_query, sources)
        
        # Step 5: Generate grounded response with citations
        return self.generate_with_citations(query, chunks)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Always retrieve on every query | Wastes latency on simple queries ("what time is it?") | Agent decides: retrieve only when needed |
| Single source retrieval | Misses cross-source insights | Multi-source: docs + web + code + DB |
| No result evaluation | Uses bad chunks without checking quality | Evaluate chunk relevance before generation |
| No query reformulation | First query fails, gives up | Reformulate and retry (max 2 iterations) |
| No source attribution | Can't verify which source answered | Include source + confidence per chunk |
| Tool-calling without planning | Agent calls tools randomly | Plan-then-execute: decide tools first, then call |
| Infinite retrieval loops | Agent keeps searching without stopping | Max 3 retrieval iterations, then answer with what you have |
| No confidence score | All answers presented equally | Score 0-1, abstain below 0.6 |

### Source Selection Strategy
| Query Type | Sources | Why |
|-----------|---------|-----|
| Company policy | Internal SharePoint | Authoritative internal docs |
| Technical how-to | Code repo + docs | Implementation details |
| Current events | Web search | Internal docs may be stale |
| Customer data | CRM/DB | Structured data queries |
| Multi-domain | All sources | Cross-reference for completeness |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model, temperature, max_iterations |
| `config/search.json` | Sources, top_k per source, score_threshold |
| `config/guardrails.json` | Confidence threshold, max iterations, abstention rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement agentic retrieval, source routing, iteration logic |
| `@reviewer` | Audit retrieval quality, citation accuracy, loop prevention |
| `@tuner` | Optimize source selection, iteration thresholds, latency |

## Slash Commands
`/deploy` — Deploy agentic RAG | `/test` — Test retrieval quality | `/review` — Audit citations | `/evaluate` — Measure retrieval metrics
