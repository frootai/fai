---
description: "Visual Product Search domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Visual Product Search — Domain Knowledge

This workspace implements AI visual product search — image-based product matching, visual similarity ranking, multi-modal search (image + text), product attribute extraction, and shoppable image recognition.

## Visual Search Architecture (What the Model Gets Wrong)

### Image → Product Match Pipeline
```python
async def visual_search(query_image: bytes, text_hint: str = None) -> list[ProductMatch]:
    # 1. Extract visual features (embedding)
    image_embedding = await vision_encoder.encode(query_image)  # CLIP or Florence-2
    
    # 2. Optional: combine with text (multi-modal)
    if text_hint:
        text_embedding = await text_encoder.encode(text_hint)
        combined = fuse_embeddings(image_embedding, text_embedding, weights=(0.7, 0.3))
    else:
        combined = image_embedding
    
    # 3. Search product catalog by visual similarity
    matches = await product_index.search(combined, top_k=20)
    
    # 4. Re-rank by visual similarity + availability + relevance
    ranked = rerank(matches, factors=["visual_similarity", "in_stock", "price_range", "popularity"])
    
    return ranked[:10]
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Text-only product search | Customers can't describe what they see | Visual search: upload photo → find similar products |
| Generic image embeddings | Miss fine-grained product differences (color, pattern, style) | Domain-fine-tuned embeddings on product catalog |
| No multi-modal fusion | Image-only misses "blue version of this" | Combine image + text query signals |
| Index entire product images | Background noise reduces matching accuracy | Crop to product region, remove background |
| No availability filtering | Show out-of-stock matches | Filter/demote unavailable products |
| LLM for visual matching | Too slow per query, not trained for visual similarity | CLIP/Florence for embeddings, vector DB for search |
| No feedback loop | Can't improve from "customer bought X after searching Y" | Click-through tracking → fine-tune ranking |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Vision encoder model, embedding dimensions |
| `config/search.json` | top_k, similarity threshold, reranking weights |
| `config/guardrails.json` | Content safety on uploaded images, size limits |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement visual encoder, product indexing, search API |
| `@reviewer` | Audit search relevance, content safety, performance |
| `@tuner` | Optimize embeddings, reranking, catalog indexing |

## Slash Commands
`/deploy` — Deploy visual search | `/test` — Test with sample images | `/review` — Audit relevance | `/evaluate` — Measure click-through rate
