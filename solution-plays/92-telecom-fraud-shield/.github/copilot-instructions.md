---
description: "Telecom Fraud Shield domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Telecom Fraud Shield — Domain Knowledge

This workspace implements AI telecom fraud detection — SIM swap detection, international revenue sharing fraud (IRSF), Wangiri callback fraud, subscription fraud, and real-time CDR (Call Detail Record) analysis.

## Telecom Fraud Architecture (What the Model Gets Wrong)

### Multi-Pattern Fraud Detection
```python
async def detect_telecom_fraud(cdr: CallDetailRecord) -> FraudDecision:
    alerts = []
    
    # Pattern 1: SIM swap (sudden location change + new device + high-value calls)
    if await detect_sim_swap(cdr.subscriber_id):
        alerts.append(FraudAlert(type="sim_swap", severity="critical"))
    
    # Pattern 2: IRSF (calls to premium-rate numbers in specific countries)
    if cdr.destination in irsf_number_ranges:
        alerts.append(FraudAlert(type="irsf", severity="high"))
    
    # Pattern 3: Wangiri (short-duration calls to many numbers → callback trap)
    if await detect_wangiri_pattern(cdr.subscriber_id):
        alerts.append(FraudAlert(type="wangiri", severity="medium"))
    
    # Pattern 4: ML anomaly on CDR patterns
    anomaly_score = fraud_model.score(cdr.features)
    if anomaly_score > 0.8:
        alerts.append(FraudAlert(type="anomaly", score=anomaly_score))
    
    # Decision
    if any(a.severity == "critical" for a in alerts):
        return FraudDecision(action="block_immediately", alerts=alerts)
    elif alerts:
        return FraudDecision(action="flag_for_review", alerts=alerts)
    return FraudDecision(action="allow")
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM analyzes CDRs | Too slow for millions of CDRs/sec | Rule engine + ML model, LLM for investigation reports |
| Single fraud pattern | Misses novel attack types | Multi-pattern: SIM swap + IRSF + Wangiri + anomaly |
| Block without investigation | False positive = angry customer | Block critical, flag others for human review |
| No velocity detection | Miss rapid-fire fraud bursts | Track calls/min per subscriber, flag spikes |
| Static IRSF number list | New premium numbers added daily | Auto-update IRSF ranges from industry databases |
| No subscriber profiling | Can't distinguish normal travel from SIM swap | Build behavioral baseline per subscriber |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for fraud investigation reports |
| `config/guardrails.json` | Fraud score thresholds, IRSF ranges, velocity limits |
| `config/agents.json` | CDR sources, pattern rules, alert routing |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement fraud detection pipeline, pattern engines |
| `@reviewer` | Audit false positive rate, pattern coverage, response time |
| `@tuner` | Optimize thresholds, reduce false positives, add patterns |

## Slash Commands
`/deploy` — Deploy fraud shield | `/test` — Simulate fraud scenarios | `/review` — Audit detection | `/evaluate` — Measure precision/recall
