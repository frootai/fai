---
description: "Biodiversity Monitor domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Biodiversity Monitor — Domain Knowledge

This workspace implements AI biodiversity monitoring — species identification from images/audio, population tracking, habitat health assessment, invasive species detection, and conservation priority scoring.

## Biodiversity AI Architecture (What the Model Gets Wrong)

### Multi-Modal Species Identification
```python
async def identify_species(observation: Observation) -> SpeciesIdentification:
    results = []
    
    # Image-based identification (camera traps, field photos)
    if observation.images:
        for img in observation.images:
            result = await vision_classifier.classify(img, taxonomy="species")
            results.append(result)  # {"species": "Lynx lynx", "confidence": 0.92}
    
    # Audio-based identification (bioacoustics)
    if observation.audio:
        spectrograms = generate_spectrograms(observation.audio)
        result = await audio_classifier.classify(spectrograms, taxonomy="species")
        results.append(result)  # Bird calls, amphibian calls, bat echolocation
    
    # Consensus across modalities
    consensus = merge_identifications(results)
    
    # Geo-spatial validation: is this species expected in this location?
    if not is_expected_species(consensus.species, observation.location):
        consensus.flag = "unexpected_range"  # Possible invasive or range expansion
    
    return consensus
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Visual-only identification | Miss nocturnal species, birds by call | Multi-modal: camera + bioacoustics + eDNA |
| No geo-spatial validation | Species misidentified as look-alike common in area | Cross-reference ID with known range maps |
| Single observation = population estimate | Statistically invalid | Occupancy modeling: multiple surveys over time |
| Ignore temporal patterns | Miss seasonal migration, breeding cycles | Track observations over annual cycle |
| LLM for species classification | Not trained on specialized taxonomy | Purpose-built classifiers (iNaturalist, BirdNET) |
| No invasive species alerting | Invasive detected but not flagged | Alert on unexpected species in region |
| Camera trap data overload | 10K images/day, can't review manually | AI filters: animal/empty/human, auto-classify species |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for conservation report generation |
| `config/guardrails.json` | Classification confidence threshold, invasive species alerts |
| `config/agents.json` | Species databases, range maps, sensor configurations |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement species ID, bioacoustics, population tracking |
| `@reviewer` | Audit identification accuracy, invasive detection, data quality |
| `@tuner` | Optimize classifier accuracy, filter empty images, alert sensitivity |

## Slash Commands
`/deploy` — Deploy biodiversity monitor | `/test` — Test with sample data | `/review` — Audit accuracy | `/evaluate` — Measure species detection rate
