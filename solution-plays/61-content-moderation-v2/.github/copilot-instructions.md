---
description: "Content Moderation V2 domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Content Moderation V2 — Domain Knowledge

This workspace implements advanced content moderation — multi-modal safety (text + image + video), custom category training, human-in-the-loop review queues, appeal workflows, and real-time streaming moderation.

## Moderation V2 Architecture (What the Model Gets Wrong)

### Multi-Modal Moderation Pipeline
```python
async def moderate_content(content: Content) -> ModerationResult:
    results = []
    # Parallel moderation across modalities
    if content.text: results.append(await moderate_text(content.text))
    if content.images: results.extend([await moderate_image(img) for img in content.images])
    if content.video: results.append(await moderate_video_frames(content.video))
    
    # Aggregate: worst severity wins
    worst = max(results, key=lambda r: r.severity)
    
    # Routing: auto-action or human review
    if worst.severity >= 6: return ModerationResult(action="block", auto=True)
    if worst.severity >= 4: return ModerationResult(action="review", queue="human-review")
    if worst.severity >= 2: return ModerationResult(action="flag", log=True)
    return ModerationResult(action="allow")
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Text-only moderation | Images/video bypass safety | Multi-modal: text + image + video moderation |
| No human review queue | Borderline cases auto-decided | severity 4-5 → human review queue |
| No appeal workflow | Users can't contest false positives | Appeal API → human reviewer → overturn/uphold |
| Block without explanation | Users don't know why content was blocked | Return category + severity + policy reference |
| Same thresholds all categories | Hate speech needs lower threshold than mild language | Per-category severity thresholds |
| No custom categories | Miss domain-specific violations | Train custom blocklists for your domain |
| Synchronous for streaming | Can't moderate live chat/video fast enough | Async pipeline with <200ms SLA for text |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/guardrails.json` | Per-category severity thresholds, custom blocklists |
| `config/openai.json` | LLM for borderline analysis |
| `config/agents.json` | Review queue routing, appeal workflow, SLA targets |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement multi-modal pipeline, custom categories, appeal workflow |
| `@reviewer` | Audit false positive rates, threshold calibration, coverage |
| `@tuner` | Optimize per-category thresholds, reduce false positives, latency |

## Slash Commands
`/deploy` — Deploy moderation | `/test` — Test with samples | `/review` — Audit accuracy | `/evaluate` — Measure precision/recall
