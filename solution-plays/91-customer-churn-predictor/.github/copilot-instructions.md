---
description: "Customer Churn Predictor domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Customer Churn Predictor — Domain Knowledge

This workspace implements AI churn prediction — customer risk scoring, early warning signals, retention action recommendations, cohort analysis, and lifetime value optimization.

## Churn Prediction Architecture (What the Model Gets Wrong)

### Churn Risk Scoring Pipeline
```python
async def predict_churn(customer_id: str) -> ChurnPrediction:
    # 1. Behavioral signals (usage patterns)
    behavior = await get_usage_data(customer_id, days=90)
    # Login frequency trend, feature adoption, support tickets, NPS score
    
    # 2. Engagement signals
    engagement = await get_engagement_data(customer_id)
    # Email open rate trend, product page visits, community participation
    
    # 3. Contract/billing signals
    billing = await get_billing_data(customer_id)
    # Payment delays, downgrade requests, contract end date proximity
    
    # 4. ML model prediction
    features = build_features(behavior, engagement, billing)
    risk_score = churn_model.predict_proba(features)  # 0-1 probability
    
    # 5. Top churn drivers (explainable)
    drivers = explain_prediction(churn_model, features)
    # ["login_frequency_dropped_60%", "3_support_tickets_unresolved", "contract_expires_30_days"]
    
    # 6. Retention recommendation
    action = await recommend_retention(risk_score, drivers, customer.segment)
    
    return ChurnPrediction(risk=risk_score, drivers=drivers, action=action)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM predicts churn probability | Not trained on your customer data | ML model on historical churn data |
| Single feature (last login) | Misses multi-signal patterns | Combine: usage + engagement + billing + support |
| No explainability | "High risk" without why | SHAP/LIME for top churn drivers |
| Same retention for all | Discount for price-sensitive ≠ feature request | Segment-specific retention actions |
| Predict but don't act | Prediction without intervention is useless | Auto-trigger retention workflows |
| Train on canceled only | Survivorship bias — miss near-churners | Include: churned + retained + at-risk in training |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for retention message personalization |
| `config/guardrails.json` | Risk thresholds (high/medium/low), action triggers |
| `config/agents.json` | Data sources, feature weights, retention playbooks |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement churn model, feature engineering, retention workflows |
| `@reviewer` | Audit model fairness, prediction accuracy, action effectiveness |
| `@tuner` | Optimize risk thresholds, feature selection, retention ROI |

## Slash Commands
`/deploy` — Deploy predictor | `/test` — Test with cohort | `/review` — Audit accuracy | `/evaluate` — Measure retention impact
