---
description: "Public Safety Analytics domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Public Safety Analytics — Domain Knowledge

This workspace implements AI for public safety — incident pattern detection, resource allocation optimization, predictive policing alternatives (community-focused), emergency response routing, and crime trend analysis with bias mitigation.

## Public Safety AI Architecture (What the Model Gets Wrong)

### Ethical Incident Analysis (Not Predictive Policing)
```python
# WRONG — predict where crime will happen (biased, self-fulfilling prophecy)
hotspots = model.predict_crime_locations(historical_data)  # Perpetuates over-policing in minority areas

# CORRECT — analyze patterns for resource optimization, not targeting
async def analyze_safety_patterns(region: str) -> SafetyAnalysis:
    incidents = await get_incident_data(region, months=12)
    
    # Pattern detection (temporal, not geographic targeting)
    temporal_patterns = analyze_temporal(incidents)  # Peak hours, seasonal trends
    resource_gaps = identify_resource_gaps(incidents, current_resources)
    response_time_analysis = analyze_response_times(incidents)
    
    # Community-focused recommendations
    recommendations = await generate_recommendations(
        patterns=temporal_patterns, gaps=resource_gaps,
        focus="community_safety_improvement",  # NOT "crime prediction"
    )
    return SafetyAnalysis(patterns=temporal_patterns, gaps=resource_gaps, recommendations=recommendations)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Predictive policing models | Perpetuate racial/socioeconomic bias | Pattern analysis for resource allocation, not targeting |
| Historical crime data without bias audit | Over-policed areas appear as "high crime" | Audit data for enforcement bias before analysis |
| No community input | Top-down analytics miss ground truth | Integrate community feedback and 311 data |
| Real-time facial recognition | Privacy violation, disproportionate impact | Restrict to voluntary, consent-based identification |
| Geographic targeting | Over-police specific neighborhoods | Temporal patterns (when) not geographic (where) |
| No transparency | Public can't scrutinize AI decisions | Publish methodology, allow public audit |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Analysis model, temperature=0 for factual |
| `config/guardrails.json` | Bias audit thresholds, privacy rules, transparency requirements |
| `config/agents.json` | Data sources, analysis scope, community input channels |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement pattern analysis, resource optimization, dashboards |
| `@reviewer` | Audit bias, privacy, community impact, transparency |
| `@tuner` | Optimize resource allocation, response time improvement |

## Slash Commands
`/deploy` — Deploy analytics | `/test` — Test with sample data | `/review` — Bias audit | `/evaluate` — Measure community impact
