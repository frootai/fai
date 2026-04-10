---
description: "Precision Agriculture Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Precision Agriculture Agent — Domain Knowledge

This workspace implements AI for precision agriculture — crop health monitoring (satellite/drone imagery), irrigation optimization, yield prediction, pest/disease detection, and soil analysis.

## Agriculture AI Architecture (What the Model Gets Wrong)

### Crop Health Monitoring Pipeline
```python
async def monitor_crop_health(field_id: str) -> CropHealthReport:
    # 1. Get latest satellite/drone imagery
    imagery = await get_field_imagery(field_id, source="sentinel-2")  # NDVI, RGB, NIR
    
    # 2. Computer vision: detect stress areas
    ndvi_map = calculate_ndvi(imagery)  # Normalized Difference Vegetation Index
    stress_zones = detect_stress_areas(ndvi_map, threshold=0.3)  # NDVI < 0.3 = stressed
    
    # 3. Classify stress cause (pest, disease, drought, nutrient)
    for zone in stress_zones:
        zone.diagnosis = await classify_stress(zone.imagery, zone.spectral_data)
        zone.recommendation = await generate_recommendation(zone.diagnosis)
    
    # 4. Soil data integration
    soil = await get_soil_data(field_id)  # pH, moisture, nutrients
    
    return CropHealthReport(field_id=field_id, ndvi_avg=ndvi_map.mean(),
        stress_zones=stress_zones, soil=soil, recommendations=compile_actions(stress_zones, soil))
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| RGB-only analysis | Miss stress invisible to human eye | Use multispectral: NDVI, NIR, SWIR |
| Single-date analysis | Can't track trends or catch early stress | Time-series comparison (weekly delta NDVI) |
| LLM for spectral analysis | Can't process raster/spectral data | Specialized CV models for remote sensing |
| Ignore soil data | Aerial view misses root-zone problems | Integrate soil sensors: moisture, pH, nutrients |
| Same recommendation everywhere | Field variability within zones | Variable-rate prescriptions per management zone |
| No weather integration | Miss weather-caused stress vs disease | Correlate stress patterns with recent weather events |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for recommendation generation |
| `config/guardrails.json` | NDVI thresholds, stress classification confidence |
| `config/agents.json` | Imagery sources, field boundaries, sensor config |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement monitoring pipeline, stress detection, recommendations |
| `@reviewer` | Audit detection accuracy, recommendation quality |
| `@tuner` | Optimize NDVI thresholds, classification models, imagery frequency |

## Slash Commands
`/deploy` — Deploy agriculture AI | `/test` — Analyze sample field | `/review` — Audit accuracy | `/evaluate` — Measure detection rate
