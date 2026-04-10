---
description: "Building Energy Optimizer domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Building Energy Optimizer — Domain Knowledge

This workspace implements AI for building energy optimization — HVAC scheduling, occupancy-based control, energy consumption prediction, fault detection, and sustainability reporting.

## Building Energy Architecture (What the Model Gets Wrong)

### Occupancy-Based HVAC Control
```python
async def optimize_hvac(building_id: str) -> HVACSchedule:
    # 1. Predict occupancy per zone (next 24 hours)
    occupancy = await predict_occupancy(building_id, horizon_hours=24)
    # Sources: badge-in data, calendar events, WiFi device count, historical patterns
    
    # 2. Weather forecast integration
    weather = await get_weather(building_id, hours=24)
    
    # 3. Optimize setpoints per zone based on occupancy + weather
    schedule = []
    for zone in building.zones:
        if occupancy[zone.id] == 0:
            schedule.append(SetPoint(zone=zone.id, temp=setback_temp, mode="eco"))  # Empty = save energy
        else:
            optimal = calculate_comfort_temp(weather, zone.orientation, occupancy[zone.id])
            schedule.append(SetPoint(zone=zone.id, temp=optimal, mode="comfort"))
    
    return HVACSchedule(setpoints=schedule, estimated_savings=calculate_savings(schedule))
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Same temp all zones | Wastes energy in empty zones | Zone-based control with occupancy prediction |
| Ignore weather forecast | React to temp instead of anticipate | Pre-cool/pre-heat based on forecast |
| Fixed schedule only | Doesn't adapt to actual use | Adaptive: occupancy sensors + calendar + ML prediction |
| No fault detection | Equipment degradation unnoticed | Monitor: runtime, energy per degree, COP trends |
| Report annual energy only | Too coarse for optimization | 15-minute interval data for granular analysis |
| LLM controls HVAC directly | Safety risk, unreliable | ML model recommends → BMS executes → human override |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for sustainability reporting, anomaly explanation |
| `config/guardrails.json` | Comfort ranges, setback temps, override rules |
| `config/agents.json` | Zone definitions, sensor mappings, BMS integration |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement occupancy prediction, HVAC optimization, fault detection |
| `@reviewer` | Audit comfort compliance, energy savings accuracy |
| `@tuner` | Optimize setpoints, prediction accuracy, savings vs comfort trade-off |

## Slash Commands
`/deploy` — Deploy optimizer | `/test` — Simulate optimization | `/review` — Energy audit | `/evaluate` — Measure savings
