---
description: "Dynamic Pricing Engine domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Dynamic Pricing Engine — Domain Knowledge

This workspace implements AI dynamic pricing — demand-based price optimization, competitor price monitoring, elasticity modeling, A/B testing of price points, and regulatory-compliant pricing with fairness constraints.

## Dynamic Pricing Architecture (What the Model Gets Wrong)

### Price Optimization Pipeline
```python
async def optimize_price(product_id: str) -> PriceRecommendation:
    # 1. Current market context
    demand = await get_demand_signals(product_id)  # Sales velocity, search interest, cart adds
    competitors = await get_competitor_prices(product_id)
    inventory = await get_inventory_level(product_id)
    
    # 2. Elasticity model (how demand changes with price)
    elasticity = price_elasticity_model.predict(product_id, demand.features)
    
    # 3. Optimize for revenue (or margin, or market share)
    optimal_price = optimize(
        current_price=product.price,
        elasticity=elasticity,
        competitor_range=(min(competitors), max(competitors)),
        inventory_pressure=inventory.days_of_supply,
        constraints=PricingConstraints(
            min_margin=0.15,            # Never below 15% margin
            max_change_pct=0.10,        # Max 10% change per day
            no_discriminatory_pricing=True,  # Same price for all demographics
        ),
    )
    return PriceRecommendation(price=optimal_price, confidence=elasticity.confidence, factors=top_factors)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM sets prices | Hallucinated numbers, no optimization model | Elasticity model + optimization, LLM for explanation |
| Price discrimination by demographics | Illegal (many jurisdictions), unethical | Same price for same product regardless of user |
| Unlimited price swings | Customers lose trust on wild price changes | Cap daily change (±10%), implement price memory |
| Ignore competitor context | Price in vacuum = lost customers | Monitor competitor prices, set ceiling/floor |
| No A/B testing | Don't know if new price is better | A/B test price points, measure conversion + revenue |
| Surge pricing without limits | PR disaster, regulatory risk | Maximum multiplier (e.g., 2x), transparency notice |
| No margin floor | Sell below cost in optimization | Hard constraint: min margin 15% |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for pricing explanations, market analysis |
| `config/guardrails.json` | Min margin, max daily change, fairness constraints |
| `config/agents.json` | Competitor monitoring, A/B test config, optimization objective |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement pricing engine, elasticity model, A/B framework |
| `@reviewer` | Audit fairness, regulatory compliance, margin protection |
| `@tuner` | Optimize elasticity model, change limits, revenue vs margin |

## Slash Commands
`/deploy` — Deploy pricing engine | `/test` — Simulate pricing | `/review` — Fairness audit | `/evaluate` — Measure revenue impact
