---
description: "Research Paper AI domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Research Paper AI — Domain Knowledge

This workspace implements AI for research — paper search and retrieval, literature review generation, citation network analysis, research gap identification, and structured summarization of academic papers.

## Research AI Architecture (What the Model Gets Wrong)

### Literature Review Pipeline
```python
async def generate_literature_review(topic: str, num_papers: int = 50) -> LiteratureReview:
    # 1. Semantic search across paper databases
    papers = await search_papers(topic, sources=["semantic_scholar", "arxiv", "pubmed"], top_k=num_papers)
    
    # 2. Relevance filtering + dedup
    relevant = [p for p in papers if p.relevance_score > 0.7]
    deduplicated = deduplicate_by_doi(relevant)
    
    # 3. Per-paper structured extraction
    summaries = []
    for paper in deduplicated:
        summary = await extract_structured(paper, fields=[
            "objective", "methodology", "key_findings", "limitations", "future_work"
        ])
        summaries.append(summary)
    
    # 4. Synthesize into review (group by theme, not chronologically)
    review = await synthesize_review(summaries, grouping="thematic")
    
    # 5. Identify research gaps
    gaps = await identify_gaps(summaries, topic)
    
    return LiteratureReview(papers=summaries, synthesis=review, gaps=gaps, citations=format_citations(deduplicated))
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM generates citations from training data | Hallucinated papers, wrong authors/years | Search real databases (Semantic Scholar API, arXiv) |
| Chronological instead of thematic | Reads like a timeline, not a synthesis | Group by theme, compare/contrast across papers |
| No citation verification | Cited paper may not exist | Verify DOI resolves, author names match |
| Summarize abstracts only | Miss methodology and limitations | Extract from full paper: methods, results, limitations |
| No research gap analysis | Review without actionable insight | Explicitly identify what's missing in current literature |
| Single database | Miss papers in specialized databases | Multi-source: Semantic Scholar + arXiv + PubMed + Google Scholar |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Synthesis model, extraction model, temperature=0.3 |
| `config/guardrails.json` | Relevance threshold, max papers, citation verification |
| `config/agents.json` | Data sources, search APIs, review structure |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement paper search, extraction, synthesis pipeline |
| `@reviewer` | Audit citation accuracy, synthesis quality, gap analysis |
| `@tuner` | Optimize search relevance, extraction quality, synthesis coherence |

## Slash Commands
`/deploy` — Deploy research AI | `/test` — Generate sample review | `/review` — Audit citations | `/evaluate` — Measure extraction accuracy
