---
description: "Fraud Detection Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Fraud Detection Agent — Domain Knowledge

This workspace implements an AI fraud detection agent — real-time transaction scoring, behavioral anomaly detection, network analysis (graph-based fraud rings), and explainable decision output for regulatory compliance.

## Fraud Detection Architecture (What the Model Gets Wrong)

### Three-Layer Detection
```python
async def detect_fraud(transaction: Transaction) -> FraudDecision:
    # Layer 1: Rule engine (instant, deterministic)
    rule_flags = apply_rules(transaction)
    # velocity: 5+ transactions in 1 min, amount > 3x average, geo-impossible travel
    
    # Layer 2: ML model (statistical patterns, <50ms)
    ml_score = fraud_model.predict_proba(transaction.features)
    
    # Layer 3: Graph analysis (network patterns, only for high-risk)
    if ml_score > 0.5:
        graph_score = analyze_fraud_network(transaction.sender, transaction.receiver)
        # Detects: ring patterns, mule accounts, coordinated attacks
    
    # Decision with explanation
    combined = weighted_score(rule_flags, ml_score, graph_score)
    return FraudDecision(
        action="block" if combined > 0.9 else "review" if combined > 0.7 else "allow",
        score=combined,
        explanation=generate_explanation(rule_flags, ml_score, graph_score),
    )
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM for real-time scoring | 2s latency = transaction already processed | Rules (<1ms) + ML (<50ms), LLM for post-hoc only |
| No explanation for blocks | Regulatory non-compliance (PSD2, fair lending) | Every block must include factors + reasoning |
| Static rules only | Miss novel fraud patterns | ML model catches statistical anomalies rules miss |
| No graph analysis | Miss coordinated fraud rings | Network analysis for connected account patterns |
| Train on imbalanced data | 99.9% legit → model always says "legit" | Oversample fraud, use SMOTE, precision-recall metrics |
| No feedback loop | Model can't learn from analyst decisions | Track: confirmed fraud vs false positives → retrain |
| Alert fatigue | Too many false positives | Tune thresholds by transaction type, reduce noise |
| No velocity checks | Miss rapid-fire small transactions | Track per-account velocity: count + amount per window |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for explanation generation |
| `config/guardrails.json` | Score thresholds (block/review/allow), velocity rules |
| `config/agents.json` | Rule definitions, ML model config, graph analysis depth |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement detection pipeline, rules, ML model, graph analysis |
| `@reviewer` | Audit false positive rate, explanation quality, regulatory compliance |
| `@tuner` | Optimize thresholds, reduce false positives, improve detection rate |

## Slash Commands
`/deploy` — Deploy fraud detection | `/test` — Test with scenarios | `/review` — Regulatory audit | `/evaluate` — Measure precision/recall
