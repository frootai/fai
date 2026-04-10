---
description: "Anomaly Detection domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Anomaly Detection — Domain Knowledge

This workspace implements AI-powered anomaly detection — time-series analysis, multivariate detection, root cause analysis, and alerting using Azure AI Anomaly Detector and custom ML models.

## Anomaly Detection Architecture (What the Model Gets Wrong)

### Azure AI Anomaly Detector Client
```python
from azure.ai.anomalydetector import AnomalyDetectorClient
from azure.ai.anomalydetector.models import UnivariateDetectionOptions, TimeSeriesPoint
from azure.identity import DefaultAzureCredential

client = AnomalyDetectorClient(
    endpoint=config["endpoint"],
    credential=DefaultAzureCredential(),
)

# Univariate detection (single metric)
points = [TimeSeriesPoint(timestamp=ts, value=val) for ts, val in time_series_data]
result = client.detect_univariate_entire_series(
    UnivariateDetectionOptions(series=points, granularity="hourly", sensitivity=85)
)
anomalies = [(p.timestamp, p.value) for p, is_anomaly in zip(points, result.is_anomaly) if is_anomaly]
```

### Univariate vs Multivariate Detection
| Type | When to Use | Example | API |
|------|------------|---------|-----|
| Univariate | Single metric anomaly | CPU spike, revenue drop | `detect_univariate_entire_series` |
| Multivariate | Correlated metrics anomaly | CPU+memory+disk together | `detect_multivariate_entire_series` |
| Streaming | Real-time per-point detection | IoT sensor readings | `detect_univariate_last_point` |

### Sensitivity Tuning
```python
# sensitivity: 0-99 (higher = more sensitive = more anomalies detected)
# WRONG — default sensitivity catches too many false positives
result = client.detect(..., sensitivity=95)  # Too sensitive

# CORRECT — tune sensitivity based on domain
# Financial data: 85-90 (catch important anomalies, tolerate some noise)
# IoT sensors: 70-80 (sensors are noisy, reduce false positives)
# Security logs: 90-95 (better to over-detect than miss threats)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Univariate for correlated metrics | Misses multi-dimensional patterns | Use multivariate when metrics are related |
| Sensitivity too high (>95) | False positive flood | Start at 80, tune based on precision/recall |
| No seasonality configuration | Weekly/daily patterns flagged as anomalies | Set `granularity` + `period` correctly |
| Batch-only detection | Can't catch real-time anomalies | Use `detect_last_point` for streaming |
| No root cause analysis | "Anomaly detected" without context | Combine with LLM for root cause explanation |
| Insufficient training data | Model can't learn normal pattern | Minimum 2 full cycles (e.g., 2 weeks for weekly) |
| No feedback loop | Model doesn't improve on false positives | Track confirmed vs dismissed, retrain |
| Alert fatigue | Too many alerts, team ignores them | Prioritize by impact, batch low-severity |

### Root Cause Analysis with LLM
```python
async def explain_anomaly(anomaly_point: dict, context_metrics: list) -> str:
    prompt = f"""An anomaly was detected:
- Metric: {anomaly_point['metric_name']}
- Value: {anomaly_point['value']} (expected: {anomaly_point['expected']})
- Time: {anomaly_point['timestamp']}
- Related metrics at the same time: {json.dumps(context_metrics)}

Provide a root cause analysis. Consider: deployment changes, traffic spikes, 
infrastructure issues, upstream service degradation."""
    
    response = await client.chat.completions.create(
        model="gpt-4o", temperature=0.1,
        messages=[{"role": "system", "content": "You are an SRE expert analyzing anomalies."},
                  {"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content
```

## Evaluation Targets
| Metric | Target |
|--------|--------|
| Precision (true anomalies / detected) | >= 85% |
| Recall (detected / actual anomalies) | >= 95% |
| Detection latency (streaming) | < 30 seconds |
| False positive rate | < 10% |
| Root cause accuracy | >= 70% (human eval) |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model for root cause analysis |
| `config/guardrails.json` | sensitivity, alert thresholds, suppression rules |
| `config/agents.json` | notification channels, escalation rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement detection pipeline, alerting, root cause integration |
| `@reviewer` | Audit sensitivity settings, false positive rates, alert routing |
| `@tuner` | Optimize sensitivity, reduce false positives, tune notification rules |

## Slash Commands
`/deploy` — Deploy detection pipeline | `/test` — Test with historical data | `/review` — Audit alert coverage | `/evaluate` — Measure precision/recall
