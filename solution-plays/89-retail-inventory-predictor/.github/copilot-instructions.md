---
description: "Retail Inventory Predictor domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Retail Inventory Predictor — Domain Knowledge

This workspace implements AI retail inventory prediction — demand forecasting per SKU/store, stockout prevention, overstock reduction, seasonal planning, and automated replenishment recommendations.

## Inventory Prediction Architecture (What the Model Gets Wrong)

### SKU-Level Demand Forecasting
```python
async def forecast_demand(sku: str, store: str, horizon_days: int = 14) -> DemandForecast:
    # 1. Historical sales (2+ years for seasonality)
    sales = await get_sales_history(sku, store, lookback_days=730)
    
    # 2. External signals
    signals = {
        "promotions": await get_planned_promotions(sku, store),
        "weather": await get_weather_forecast(store, days=horizon_days),
        "events": await get_local_events(store, days=horizon_days),
        "holidays": get_holidays(store, days=horizon_days),
        "competitor_prices": await get_competitor_pricing(sku),
    }
    
    # 3. ML forecast (not LLM)
    forecast = demand_model.predict(sales.features, signals, horizon=horizon_days)
    
    # 4. Replenishment recommendation
    reorder_point = calculate_reorder_point(forecast, lead_time_days=3, service_level=0.95)
    current_stock = await get_current_inventory(sku, store)
    
    if current_stock <= reorder_point:
        action = "reorder"
        quantity = calculate_order_quantity(forecast, lead_time=3, safety_stock=reorder_point)
    else:
        action = "monitor"
        quantity = 0
    
    return DemandForecast(predictions=forecast, reorder_action=action, order_qty=quantity)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM for demand forecasting | Statistical models far superior for time-series | ML model (LightGBM, Prophet) for forecast |
| Aggregate forecast only | Store A ≠ Store B for same SKU | Forecast per SKU × store combination |
| Ignore promotions | Promotion spikes look like anomalies | Include planned promotions as feature |
| Fixed safety stock | Over-stock slow movers, under-stock fast movers | Dynamic safety stock based on demand variability |
| Same lead time assumption | Supplier lead times vary | Per-supplier, per-SKU lead time tracking |
| No cannibal/halo effects | Promoting Product A reduces Product B demand | Model cross-product effects |
| Annual planning only | Miss mid-season shifts | Rolling 2-4 week forecasts, updated daily |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for anomaly explanation, report generation |
| `config/guardrails.json` | Service level targets, stockout/overstock thresholds |
| `config/agents.json` | Forecast horizon, reorder rules, supplier lead times |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement forecasting, replenishment, promotion modeling |
| `@reviewer` | Audit forecast accuracy, stockout rates, overstock levels |
| `@tuner` | Optimize safety stock, service levels, forecast refresh rate |

## Slash Commands
`/deploy` — Deploy predictor | `/test` — Test with historical data | `/review` — Audit accuracy | `/evaluate` — Measure stockout + overstock
