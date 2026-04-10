---
description: "Enterprise RAG domain knowledge — auto-injected into every Copilot conversation in this workspace"
applyTo: "**"
---

# Enterprise RAG — Domain Knowledge

This workspace implements a production-grade Enterprise RAG (Retrieval-Augmented Generation) system on Azure. The following rules supplement your existing knowledge with RAG-specific patterns, Azure AI integration pitfalls, and project conventions.

## RAG Architecture (What the Model Often Gets Wrong)

### Chunking Strategy
| Parameter | Value | Why |
|-----------|-------|-----|
| Chunk size | 512-1024 tokens | Too small = no context. Too large = irrelevant noise. |
| Overlap | 10-15% of chunk size | Prevents splitting mid-sentence at chunk boundaries |
| Strategy | Semantic (sentence-aware) | Character-based splitting breaks meaning |

### Retrieval Pattern (Hybrid Search — Not Just Vector)
```python
# ❌ WRONG — vector-only search misses keyword matches
results = search_client.search(query, vector_queries=[vector])

# ✅ CORRECT — hybrid: keyword + vector + semantic reranking
results = search_client.search(
    search_text=query,                    # BM25 keyword search
    vector_queries=[vector],              # Vector similarity
    query_type="semantic",                # Semantic reranking
    semantic_configuration_name="default",
    top=5
)
```

### Grounding Pattern (Prevent Hallucination)
```python
system_prompt = """Answer based ONLY on the provided context.
If the context doesn't contain the answer, say 'I don't have enough information.'
Always cite the source document: [Source: {document_name}]
Never make up facts not in the context."""
```

## Azure AI SDK Pitfalls

### Authentication — Always DefaultAzureCredential
```python
# ❌ WRONG — hardcoded key
client = AzureOpenAI(api_key="sk-xxx")

# ✅ CORRECT — Managed Identity
from azure.identity import DefaultAzureCredential
credential = DefaultAzureCredential()
client = AzureOpenAI(azure_ad_token_provider=get_bearer_token_provider(credential, "https://cognitiveservices.azure.com/.default"))
```

### Search Client — Use Semantic Configuration
```python
from azure.search.documents import SearchClient
# semantic_configuration_name MUST match what's deployed in AI Search
# Common mistake: "default" vs "my-semantic-config" — check Azure portal
```

### Token Counting — tiktoken for Accurate Budgets
```python
import tiktoken
enc = tiktoken.encoding_for_model("gpt-4o")
token_count = len(enc.encode(text))
# Rule: context window = system_prompt + retrieved_chunks + user_query + response
# Budget: system ~500, chunks ~3000, query ~200, response ~1000 = ~4700 total
```

### Embedding Model Mismatch
```python
# ❌ WRONG — query embedding model differs from index embedding model
query_vector = embed("text-embedding-ada-002", query)  # Different model!
# Index was built with text-embedding-3-large → dimension mismatch → 0 results

# ✅ CORRECT — same model for query AND index
query_vector = embed("text-embedding-3-large", query)  # Must match index
```

## Content Safety (Non-Negotiable for Enterprise)
```python
from azure.ai.contentsafety import ContentSafetyClient
# Check BOTH user input AND model output
# Categories: Hate, Violence, SelfHarm, Sexual
# Severity threshold: reject >= 4 (Medium), log >= 2 (Low)
```

## Coverage Targets for RAG Evaluation

| Metric | Target | Tool |
|--------|--------|------|
| Groundedness | ≥ 0.8 | Azure AI Evaluation SDK |
| Relevance | ≥ 0.7 | Azure AI Evaluation SDK |
| Coherence | ≥ 0.8 | Azure AI Evaluation SDK |
| Fluency | ≥ 0.8 | Azure AI Evaluation SDK |
| Content Safety | Pass all | Content Safety API |

## File Naming Conventions
- Python: `snake_case.py` (e.g., `document_processor.py`)
- API routes: `kebab-case` (e.g., `/api/v1/chat-completion`)
- Config: `kebab-case.json` (e.g., `model-comparison.json`)
- Tests: `test_module_name.py` (e.g., `test_document_processor.py`)
- Bicep: `kebab-case.bicep` (e.g., `ai-search.bicep`)

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | model, temperature (0.1 for factual, 0.7 for creative), max_tokens |
| `config/chunking.json` | chunk_size, overlap, strategy |
| `config/search.json` | search_type (hybrid), top_k, score_threshold |
| `config/guardrails.json` | content_safety thresholds, groundedness_min, max_latency_ms |

## Common Mistakes in Enterprise RAG

| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Vector-only search | Misses exact keyword matches (product codes, IDs) | Use hybrid search (BM25 + vector + semantic) |
| No reranking | Top-5 vector results may not be the most relevant | Enable semantic reranking in AI Search |
| Prompt with no grounding instruction | Model hallucinates beyond retrieved context | "Answer ONLY from context. If unsure, say so." |
| Same temperature for all tasks | Factual queries need 0.1, creative need 0.7 | Model routing with per-task temperature |
| No token budgeting | Response truncated or context overflow | Budget: system(500) + chunks(3000) + query(200) + response(1000) |
| Embedding model mismatch | Query uses different model than index → 0 results | Same model for indexing and querying |
| No evaluation pipeline | Ship without measuring quality | Run eval.py with groundedness/relevance/coherence gates |

## Available Specialist Agents (optional)

| Agent | Use For |
|-------|---------|
| `@builder` | Implement RAG pipeline features (chunking, retrieval, generation) |
| `@reviewer` | Audit for security (Managed Identity, Content Safety), RAG quality |
| `@tuner` | Optimize config values, model routing, caching, evaluation gates |

## Slash Commands
| Command | Action |
|---------|--------|
| `/deploy` | Deploy infrastructure with Bicep + configure app |
| `/test` | Run pytest with coverage |
| `/review` | Security + RAG quality review |
| `/evaluate` | Run evaluation pipeline (groundedness, relevance, coherence) |
