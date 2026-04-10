---
description: "Predictive Maintenance AI domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Predictive Maintenance AI — Domain Knowledge

This workspace implements predictive maintenance — sensor data analysis, remaining useful life (RUL) prediction, failure pattern recognition, maintenance scheduling, and root cause analysis for industrial equipment.

## Predictive Maintenance Architecture (What the Model Gets Wrong)

### RUL Prediction Pipeline
```python
async def predict_maintenance(equipment_id: str) -> MaintenancePrediction:
    # 1. Collect sensor telemetry (vibration, temperature, pressure, current)
    telemetry = await get_sensor_data(equipment_id, lookback_days=90)
    
    # 2. Feature engineering (statistical + domain-specific)
    features = extract_features(telemetry)
    # RMS vibration, temperature trend, duty cycle, operating hours since last maintenance
    
    # 3. ML model predicts RUL (days until maintenance needed)
    rul = rul_model.predict(features)
    confidence = rul_model.predict_proba(features)
    
    # 4. LLM explains prediction + recommends actions
    explanation = await llm.analyze(
        f"Equipment {equipment_id}: RUL={rul.days} days. "
        f"Key indicators: vibration trend={features.vibration_trend}, "
        f"temp anomaly={features.temp_anomaly}. What maintenance actions?"
    )
    
    return MaintenancePrediction(
        equipment_id=equipment_id, rul_days=rul.days,
        confidence=confidence, explanation=explanation,
        schedule="urgent" if rul.days < 7 else "planned" if rul.days < 30 else "monitor",
    )
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM for time-series prediction | Statistical/ML models far superior at RUL | ML for prediction, LLM for explanation only |
| Single sensor analysis | Miss multi-sensor correlation patterns | Multivariate: vibration + temperature + pressure together |
| Fixed maintenance schedule | Over/under maintenance | Condition-based: maintain when predicted RUL < threshold |
| Ignore operating context | Different load = different wear patterns | Include duty cycle, load profile in features |
| No historical failure data | Model can't learn failure patterns | Collect failure labels, survival analysis |
| Alert on every anomaly | Alert fatigue, maintenance team ignores | Severity ranking, aggregate, batch notifications |
| No feedback loop | Model doesn't improve | Track: predicted vs actual failure → retrain quarterly |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for root cause analysis, explanation |
| `config/guardrails.json` | RUL thresholds (urgent/planned/monitor), alert rules |
| `config/agents.json` | Sensor sources, feature config, retrain schedule |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement sensor pipeline, RUL model, scheduling logic |
| `@reviewer` | Audit prediction accuracy, false alarm rate, safety |
| `@tuner` | Optimize RUL thresholds, feature selection, model accuracy |

## Slash Commands
`/deploy` — Deploy maintenance AI | `/test` — Test with historical data | `/review` — Audit accuracy | `/evaluate` — Measure prediction vs actual
