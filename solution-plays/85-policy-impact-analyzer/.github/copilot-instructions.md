---
description: "Policy Impact Analyzer domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Policy Impact Analyzer — Domain Knowledge

This workspace implements AI policy impact analysis — regulatory change assessment, stakeholder impact scoring, cost-benefit modeling, public comment analysis, and evidence-based policy recommendation.

## Policy Impact Architecture (What the Model Gets Wrong)

### Impact Assessment Pipeline
```python
async def analyze_policy_impact(policy: PolicyDocument) -> ImpactAssessment:
    # 1. Extract policy provisions (structured)
    provisions = await extract_provisions(policy)
    # Each provision: who it affects, what changes, when effective
    
    # 2. Identify affected stakeholders
    stakeholders = await identify_stakeholders(provisions)
    # Citizens, businesses, government agencies, specific industries
    
    # 3. Cost-benefit analysis per stakeholder group
    for stakeholder in stakeholders:
        stakeholder.costs = await estimate_costs(provisions, stakeholder)
        stakeholder.benefits = await estimate_benefits(provisions, stakeholder)
        stakeholder.net_impact = stakeholder.benefits - stakeholder.costs
    
    # 4. Analyze public comments (if available)
    if policy.public_comments:
        sentiment = await analyze_comments(policy.public_comments)
        themes = await extract_themes(policy.public_comments)
    
    # 5. Generate evidence-based recommendation
    recommendation = await generate_recommendation(provisions, stakeholders, evidence_base)
    
    return ImpactAssessment(provisions=provisions, stakeholders=stakeholders, recommendation=recommendation)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM estimates economic impact | Hallucinated numbers, no methodology | Ground in economic models, cite data sources |
| Ignore distributional effects | Average impact hides who gains/loses | Analyze per stakeholder group, especially vulnerable populations |
| No counter-argument analysis | One-sided assessment lacks credibility | Present arguments for AND against, with evidence |
| Treat all comments equally | Organized campaigns skew sentiment | Weight by unique commenters, detect coordinated campaigns |
| No uncertainty quantification | False precision in impact estimates | Express as ranges with confidence levels |
| Partisan framing | Undermines policy analysis credibility | Evidence-based, cite sources, present multiple perspectives |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Analysis model, temperature=0.2 for balanced analysis |
| `config/guardrails.json` | Evidence standards, bias detection, sourcing requirements |
| `config/agents.json` | Stakeholder taxonomy, economic models, comment analysis rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement impact analysis, comment analysis, cost-benefit models |
| `@reviewer` | Audit evidence quality, balance, methodology rigor |
| `@tuner` | Optimize stakeholder identification, cost estimation accuracy |

## Slash Commands
`/deploy` — Deploy analyzer | `/test` — Analyze sample policy | `/review` — Methodology audit | `/evaluate` — Measure analysis quality
