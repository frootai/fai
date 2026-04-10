---
description: "Conversation Memory Layer domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Conversation Memory Layer — Domain Knowledge

This workspace implements a conversation memory layer — persistent memory, session management, context compression, and knowledge distillation for long-running AI conversations.

## Memory Architecture (What the Model Gets Wrong)

### Three-Tier Memory System
```python
class MemoryLayer:
    # Tier 1: Working Memory (current conversation, <8K tokens)
    working_memory: list[Message]  # Last N messages, always in context
    
    # Tier 2: Session Memory (conversation summary, persists within session)
    session_summary: str  # Compressed summary of earlier conversation
    
    # Tier 3: Long-Term Memory (across conversations, persists forever)
    long_term: VectorStore  # Searchable knowledge from all past conversations

    async def build_context(self, query: str) -> list[Message]:
        messages = []
        # Always include session summary (compressed)
        if self.session_summary:
            messages.append({"role": "system", "content": f"Previous context: {self.session_summary}"})
        # Retrieve relevant long-term memories
        relevant = await self.long_term.search(query, top_k=3)
        if relevant:
            messages.append({"role": "system", "content": f"Relevant history: {format_memories(relevant)}"})
        # Add working memory (recent messages)
        messages.extend(self.working_memory[-10:])  # Last 10 messages
        return messages
```

### Context Compression (Sliding Window + Summary)
```python
# WRONG — truncate oldest messages (loses important context)
messages = messages[-10:]  # Loses early decisions, requirements

# CORRECT — summarize then truncate
async def compress_context(messages: list, max_tokens: int = 4000):
    if count_tokens(messages) <= max_tokens:
        return messages
    
    # Split: old messages → summarize, recent messages → keep
    midpoint = len(messages) // 2
    old_messages = messages[:midpoint]
    recent_messages = messages[midpoint:]
    
    summary = await summarize(old_messages)  # LLM compresses to ~200 tokens
    return [{"role": "system", "content": f"Earlier context: {summary}"}] + recent_messages
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| No memory between sessions | User repeats preferences every time | Long-term vector store persists across sessions |
| Truncate oldest messages | Loses critical early context (requirements, decisions) | Summarize old messages, keep recent |
| All history in context | Token overflow after 20+ turns | Three-tier: working (raw) + session (summary) + long-term (search) |
| No relevance filtering | All past memories loaded | Vector search: only load relevant memories |
| Storing full messages | Storage cost grows fast | Store embeddings + compressed summaries |
| No memory TTL | Outdated info persists forever | TTL: 7 days for preferences, 90 days for facts |
| No user consent | GDPR/privacy violation | Opt-in memory, ability to delete |
| Summarization too aggressive | Important details lost | Include: decisions made, preferences, key facts |

### Memory Storage
| Store | Type | Use Case | TTL |
|-------|------|----------|-----|
| Redis | Working memory | Current session messages | Session duration |
| Cosmos DB | Session summaries | Per-conversation compressed context | 30 days |
| AI Search | Long-term memories | Searchable knowledge vectors | 90 days |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Summarization model, embedding model |
| `config/guardrails.json` | Memory TTL, PII filtering, max memory size |
| `config/agents.json` | Compression thresholds, retrieval top_k |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement memory layer, compression, vector storage |
| `@reviewer` | Audit privacy, PII handling, memory relevance, consent |
| `@tuner` | Optimize compression ratio, retrieval quality, storage costs |

## Slash Commands
`/deploy` — Deploy memory layer | `/test` — Test memory recall | `/review` — Audit privacy | `/evaluate` — Measure recall accuracy
