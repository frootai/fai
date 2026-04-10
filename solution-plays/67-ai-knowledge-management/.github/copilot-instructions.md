---
description: "AI Knowledge Management domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Knowledge Management — Domain Knowledge

This workspace implements AI-powered knowledge management — automatic knowledge capture from conversations/documents, taxonomy generation, knowledge graph construction, expertise finder, and organizational memory.

## Knowledge Management Architecture (What the Model Gets Wrong)

### Knowledge Capture Pipeline
```python
async def capture_knowledge(source: KnowledgeSource) -> list[KnowledgeItem]:
    # 1. Extract knowledge from various sources
    match source.type:
        case "conversation": items = await extract_from_chat(source)    # Teams/Slack
        case "document": items = await extract_from_document(source)     # SharePoint/Confluence
        case "ticket": items = await extract_from_ticket(source)        # ServiceNow/Jira
        case "meeting": items = await extract_from_transcript(source)   # Meeting recordings
    
    # 2. Classify and tag
    for item in items:
        item.taxonomy = await classify_taxonomy(item)     # Category hierarchy
        item.entities = await extract_entities(item)      # People, products, processes
        item.expertise_level = await assess_depth(item)   # beginner, intermediate, expert
    
    # 3. Deduplicate against existing knowledge base
    unique = await deduplicate(items, knowledge_base)
    
    # 4. Store with metadata
    await knowledge_base.upsert(unique)
    return unique
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Manual knowledge entry only | Knowledge captured at <5% rate | Auto-capture from conversations, docs, tickets |
| No deduplication | Same knowledge stored 100x | Semantic dedup: embed + similarity threshold >0.95 |
| Flat taxonomy | Users can't browse or discover | Hierarchical taxonomy with auto-classification |
| No expertise finder | "Who knows about X?" unanswerable | Track knowledge contributions → expertise profiles |
| Stale knowledge | Outdated info misleads users | TTL + review cadence + freshness scoring |
| No access control | Sensitive knowledge exposed | Inherit permissions from source system |
| No feedback loop | Don't know if knowledge helped | Track: views, helpful/not helpful, usage in answers |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Extraction model, classification model |
| `config/guardrails.json` | Dedup threshold, freshness TTL, access rules |
| `config/agents.json` | Source connectors, taxonomy schema, capture frequency |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement capture pipeline, taxonomy, expertise finder |
| `@reviewer` | Audit knowledge quality, access control, freshness |
| `@tuner` | Optimize capture rate, dedup accuracy, taxonomy depth |

## Slash Commands
`/deploy` — Deploy KM system | `/test` — Test capture pipeline | `/review` — Audit quality | `/evaluate` — Measure knowledge coverage
