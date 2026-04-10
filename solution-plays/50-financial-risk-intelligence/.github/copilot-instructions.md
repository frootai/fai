---
description: "Financial Risk Intelligence domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Financial Risk Intelligence — Domain Knowledge

This workspace implements AI for financial risk — credit risk scoring, fraud detection, market sentiment analysis, regulatory reporting, and explainable AI for financial decisions.

## Financial Risk Architecture (What the Model Gets Wrong)

### Explainable Credit Risk Scoring
```python
# WRONG — black-box LLM score with no explanation
score = llm.predict(f"Credit score for: {applicant_data}")  # Not auditable

# CORRECT — structured scoring with feature importance
class CreditRiskScore(BaseModel):
    score: int = Field(..., ge=300, le=850, description="Credit risk score")
    risk_level: str = Field(..., description="low, medium, high, very_high")
    factors: list[RiskFactor]  # Top factors influencing the score
    recommendation: str       # approve, review, decline
    confidence: float         # Model confidence

class RiskFactor(BaseModel):
    factor: str       # "high_debt_to_income_ratio"
    impact: str       # "negative", "positive"
    weight: float     # 0.0-1.0, contribution to final score
    explanation: str  # Human-readable explanation

# Every decision must be explainable (regulatory requirement)
```

### Fraud Detection (Real-Time)
```python
async def detect_fraud(transaction: Transaction) -> FraudResult:
    # 1. Rule-based checks (fast, deterministic)
    rule_flags = apply_fraud_rules(transaction)
    # velocity check, amount threshold, geo-impossible travel
    
    # 2. ML model scoring (statistical patterns)
    ml_score = fraud_model.predict_proba(transaction.features)
    
    # 3. LLM analysis for novel patterns (expensive, use sparingly)
    if ml_score > 0.5 and ml_score < 0.9:  # Uncertain zone only
        llm_analysis = await analyze_with_context(transaction, account_history)
    
    # 4. Decision: block, allow, or human review
    if rule_flags or ml_score > 0.9: return FraudResult(action="block")
    if ml_score > 0.7: return FraudResult(action="review")
    return FraudResult(action="allow")
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM-only risk scoring | Not explainable, not auditable, regulatory violation | Structured scoring with feature importance |
| No explanation for decisions | Regulatory non-compliance (ECOA, GDPR Art.22) | Every score must include top factors + reasoning |
| LLM for every transaction | Too slow and expensive at 1000+ TPS | Rules first, ML second, LLM only for edge cases |
| No model bias testing | Discriminatory outcomes (age, race, gender) | Regular fairness testing across protected attributes |
| Real-time LLM for fraud | 2s latency = transaction already processed | <100ms rules + ML, LLM for post-hoc analysis |
| No audit trail | Can't reproduce past decisions | Log: input, model version, score, factors, timestamp |
| Training on biased historical data | Model perpetuates historical discrimination | Bias-aware training, fairness constraints |
| No stress testing | Model untested under extreme conditions | Simulate: market crash, fraud spike, data drift |

## Regulatory Requirements
| Regulation | Requirement | Implementation |
|-----------|-------------|---------------|
| ECOA (US) | Explain adverse credit decisions | RiskFactor list with human-readable explanations |
| GDPR Art.22 | Right to explanation of automated decisions | Structured output with reasoning chain |
| Basel III | Model risk management | Model card, validation, ongoing monitoring |
| SOX | Financial data integrity | Audit trail, access controls, data lineage |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Analysis model, temperature=0 for deterministic scoring |
| `config/guardrails.json` | Risk thresholds, fraud rules, bias testing schedule |
| `config/agents.json` | Decision rules, human review criteria, audit retention |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement risk scoring, fraud detection, regulatory reporting |
| `@reviewer` | Audit explainability, bias testing, regulatory compliance |
| `@tuner` | Optimize decision thresholds, model accuracy, latency |

## Slash Commands
`/deploy` — Deploy risk engine | `/test` — Test with scenarios | `/review` — Regulatory audit | `/evaluate` — Measure accuracy + fairness
