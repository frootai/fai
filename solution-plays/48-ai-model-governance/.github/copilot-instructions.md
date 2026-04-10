---
description: "AI Model Governance domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Model Governance — Domain Knowledge

This workspace implements AI model governance — model registry, approval workflows, A/B testing gates, model cards, lineage tracking, and automated compliance checks before deployment.

## Model Governance Architecture (What the Model Gets Wrong)

### Model Lifecycle
```
Develop → Register → Review → Approve → Stage → A/B Test → Production → Monitor → Retire
            ↓           ↓        ↓                  ↓           ↓
        Model Card   Eval Gate  Human Sign-off   Champion/     Drift
        + Lineage    (automated) (manual)        Challenger    Detection
```

### Model Registry with Versioning
```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import Model

# Register model with full metadata
ml_client.models.create_or_update(Model(
    name="customer-classifier",
    version="3.2.1",                      # Semantic versioning
    path="models/classifier-v3.2.1/",
    type="custom_model",
    description="Customer intent classifier fine-tuned on support tickets",
    tags={
        "framework": "transformers",
        "base_model": "gpt-4o-mini",
        "training_data": "support-tickets-2024-q4",
        "eval_accuracy": "0.94",
        "approved_by": "ml-review-board",
        "compliance": "gdpr-approved",
    },
))
```

### Model Card (Required Before Deployment)
```yaml
model_card:
  name: customer-classifier
  version: 3.2.1
  purpose: "Classify customer support intent for ticket routing"
  limitations: "English only, trained on B2C support data, may underperform on B2B"
  training_data: "500K support tickets, 2024 Q3-Q4, de-identified"
  evaluation:
    accuracy: 0.94
    f1_score: 0.91
    bias_testing: "Tested across age, gender, region — no significant disparities"
  risks: "Misclassification may route urgent tickets to wrong team"
  mitigations: "Human review for P1 tickets, confidence threshold 0.85"
  approved_by: "Dr. Smith (ML Lead), Jan 15 2025"
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Deploy without model card | No documentation of capabilities/limitations | Require model card before registration |
| No approval workflow | Anyone deploys any model | Multi-stage: eval gate → peer review → ML lead sign-off |
| No A/B testing | New model may be worse than current | Champion/challenger with 5-10% traffic split |
| No rollback capability | Bad model stuck in production | Instant rollback to previous version |
| No drift monitoring | Model degrades silently over time | Monitor accuracy, data drift, concept drift weekly |
| No lineage tracking | Can't trace model to training data | Track: data → training run → model → deployment |
| Hard-switch deployment | 100% traffic to new model instantly | Progressive rollout: 5% → 25% → 50% → 100% |
| No bias testing | Discriminatory outcomes undetected | Test across protected attributes before approval |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model for governance analysis |
| `config/guardrails.json` | Approval requirements, eval thresholds, A/B split ratio |
| `config/agents.json` | Approval workflow stages, reviewer assignments, drift thresholds |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement registry, approval workflow, A/B framework, model cards |
| `@reviewer` | Audit model cards, bias testing, compliance, lineage |
| `@tuner` | Optimize A/B test duration, drift detection sensitivity, rollout speed |

## Slash Commands
`/deploy` — Deploy governance pipeline | `/test` — Test approval workflow | `/review` — Audit compliance | `/evaluate` — Generate model card
