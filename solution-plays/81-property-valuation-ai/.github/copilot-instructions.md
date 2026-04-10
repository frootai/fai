---
description: "Property Valuation AI domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Property Valuation AI — Domain Knowledge

This workspace implements AI property valuation — automated property appraisal, comparable sales analysis (comps), market trend prediction, risk factor scoring, and regulatory-compliant valuation reports.

## Valuation AI Architecture (What the Model Gets Wrong)

### Automated Valuation Model (AVM)
```python
async def value_property(property_data: PropertyData) -> Valuation:
    # 1. Find comparable sales (comps)
    comps = await find_comparables(
        location=property_data.location, radius_km=2,
        property_type=property_data.type, sqft_range=(property_data.sqft * 0.8, property_data.sqft * 1.2),
        sold_within_months=6,
    )
    
    # 2. Adjust comps for differences
    adjusted_comps = [adjust_comp(comp, property_data) for comp in comps]
    # Adjustments: sqft difference, condition, age, lot size, features (pool, garage)
    
    # 3. ML model: regression on adjusted comps + market features
    ml_estimate = valuation_model.predict(property_data.features, market_context)
    
    # 4. LLM: narrative explanation (not the valuation itself)
    explanation = await llm.explain(f"Property at {property_data.address}: estimated ${ml_estimate:,.0f}. Key factors: {top_factors}")
    
    return Valuation(estimate=ml_estimate, confidence_range=(ml_estimate*0.92, ml_estimate*1.08), comps=adjusted_comps, explanation=explanation)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM estimates the value | Hallucinated numbers, no audit trail | ML model for valuation, LLM for explanation only |
| No comparable adjustment | Raw comp prices ignore differences | Adjust for: sqft, condition, age, features |
| Old comps (>12 months) | Market changes quickly | Prefer recent sales (3-6 months) |
| Ignore market trends | Static analysis misses appreciation/depreciation | Include market trend features (price index, days-on-market) |
| Single estimate without range | False precision | Always provide confidence interval (±8-10%) |
| No bias testing | May discriminate by neighborhood demographics | Test for disparate impact across demographics |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for report narrative generation |
| `config/guardrails.json` | Comp search radius, age limits, confidence threshold |
| `config/agents.json` | Data sources, adjustment factors, market indices |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement AVM, comp search, adjustment engine |
| `@reviewer` | Audit valuation accuracy, bias testing, regulatory compliance |
| `@tuner` | Optimize adjustment factors, model accuracy, comp selection |

## Slash Commands
`/deploy` — Deploy valuation AI | `/test` — Test with sample properties | `/review` — Audit accuracy | `/evaluate` — Measure vs actual sales
