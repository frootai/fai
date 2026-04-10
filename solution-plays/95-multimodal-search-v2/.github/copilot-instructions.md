---
description: "Multimodal Search V2 domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Multimodal Search V2 — Domain Knowledge

This workspace implements advanced multimodal search — unified search across text, images, audio, and video with cross-modal retrieval (search images with text, find videos by audio), late fusion ranking, and personalized results.

## Multimodal Search Architecture (What the Model Gets Wrong)

### Unified Multimodal Index
```python
class MultimodalDocument:
    id: str
    text_embedding: list[float]     # Text content embedding
    image_embedding: list[float]    # Image visual embedding (CLIP)
    audio_embedding: list[float]    # Audio content embedding (Whisper → text → embed)
    metadata: dict                  # Title, source, date, format, duration

async def multimodal_search(query: str, query_image: bytes = None, modalities: list = ["text", "image", "audio", "video"]) -> list:
    # 1. Encode query in all relevant modalities
    query_embeddings = {}
    query_embeddings["text"] = text_encoder.encode(query)
    if query_image:
        query_embeddings["image"] = vision_encoder.encode(query_image)
    
    # 2. Search across all modality indices
    results_per_modality = {}
    for modality in modalities:
        if modality in query_embeddings:
            results_per_modality[modality] = await search_index(modality, query_embeddings[modality])
        else:
            # Cross-modal: text query → image index (CLIP enables this)
            results_per_modality[modality] = await cross_modal_search(query_embeddings["text"], target_modality=modality)
    
    # 3. Late fusion: merge and re-rank across modalities
    merged = late_fusion_rank(results_per_modality, weights={"text": 0.4, "image": 0.3, "audio": 0.2, "video": 0.1})
    
    return merged[:20]
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Separate search per modality | User must search 4 times for 4 types | Unified index with cross-modal retrieval |
| Early fusion (concat embeddings) | Loses modality-specific information | Late fusion: search each, merge results |
| Text-only for audio/video | Miss visual/audio content | Transcribe audio → embed, extract frames → embed |
| No cross-modal search | Can't find images with text query | CLIP-style shared embedding space |
| Same weights all modalities | Not all modalities equally relevant per query | Query-dependent weighting (text heavy for factual, image heavy for visual) |
| No personalization | Same results for everyone | User preference model: boost preferred formats/topics |
| Index everything raw | Audio/video files too large for embedding | Extract: transcript (audio), key frames (video), metadata |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Embedding models per modality (CLIP, Whisper, text-embedding-3) |
| `config/search.json` | Fusion weights, top_k per modality, score thresholds |
| `config/guardrails.json` | Content safety per modality, file size limits |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement multimodal indexing, cross-modal search, fusion |
| `@reviewer` | Audit search relevance, cross-modal accuracy, content safety |
| `@tuner` | Optimize fusion weights, embedding models, personalization |

## Slash Commands
`/deploy` — Deploy multimodal search | `/test` — Test cross-modal | `/review` — Audit relevance | `/evaluate` — Measure NDCG per modality
