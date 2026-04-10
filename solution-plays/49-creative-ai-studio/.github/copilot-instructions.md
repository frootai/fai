---
description: "Creative AI Studio domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Creative AI Studio — Domain Knowledge

This workspace implements a creative AI studio — multi-modal content generation (text, images, audio, video), brand voice consistency, content calendar automation, and creative asset management.

## Creative AI Architecture (What the Model Gets Wrong)

### Brand Voice Consistency
```python
# WRONG — generic prompt produces inconsistent tone
response = llm.generate("Write a blog post about our new product")

# CORRECT — brand voice template with guardrails
BRAND_VOICE = """Tone: Professional yet approachable. Avoid jargon.
Voice: First-person plural ("we", "our team").
Style: Short sentences. Active voice. Max 3 sentences per paragraph.
Forbidden: "revolutionary", "game-changing", "synergy", "leverage"
Required: Include one customer benefit per paragraph.
Format: Title (H1) → Hook → 3 body sections → CTA"""

response = llm.generate(
    system=f"You are a content writer. Follow this brand voice exactly:\n{BRAND_VOICE}",
    user="Write a blog post about our new AI-powered search feature",
    temperature=0.7,  # Creative but consistent
)
```

### Multi-Modal Content Pipeline
```python
async def create_campaign(brief: str) -> Campaign:
    # 1. Generate copy variations
    headlines = await generate_variations(brief, type="headline", count=5)
    body_copy = await generate_variations(brief, type="body", count=3)
    
    # 2. Generate matching images
    images = await generate_images(brief, style="brand-consistent", count=3)
    
    # 3. Generate social media adaptations
    social = await adapt_for_platforms(headlines[0], body_copy[0], platforms=["linkedin", "twitter", "instagram"])
    
    # 4. Content safety + brand compliance check
    for asset in [*headlines, *body_copy, *images, *social]:
        await check_brand_compliance(asset)
        await check_content_safety(asset)
    
    return Campaign(headlines=headlines, body=body_copy, images=images, social=social)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| No brand voice template | Inconsistent tone across content | Define brand voice doc, include in every prompt |
| temperature=0 for creative | Repetitive, boring output | 0.7-0.9 for creative content |
| Generate one version only | Miss better alternatives | Generate 3-5 variations, pick best |
| No content safety on generated images | Brand-inappropriate imagery | Content Safety API on all generated visuals |
| Manual cross-platform adaptation | Time-consuming, inconsistent | Auto-adapt: LinkedIn (professional) vs Twitter (concise) |
| No A/B testing content | Don't know what performs better | Test headline/image variations, track CTR |
| Ignore copyright/IP | Generated content may infringe | Content policy filter, no copyrighted references |
| No content calendar | Ad-hoc posting, gaps in schedule | Auto-generate content calendar from campaign brief |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Creative model, temperature (0.7-0.9), image model |
| `config/guardrails.json` | Brand voice rules, forbidden words, content safety thresholds |
| `config/agents.json` | Platform templates, variation count, A/B test settings |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement content pipeline, brand voice, multi-platform generation |
| `@reviewer` | Audit brand consistency, content safety, copyright compliance |
| `@tuner` | Optimize content quality, variation diversity, A/B performance |

## Slash Commands
`/deploy` — Deploy creative studio | `/test` — Generate sample campaign | `/review` — Brand audit | `/evaluate` — Measure content quality
