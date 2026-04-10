---
description: "Carbon Footprint Tracker domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Carbon Footprint Tracker — Domain Knowledge

This workspace implements AI-powered carbon footprint tracking — Scope 1/2/3 emissions calculation, supply chain carbon analysis, reduction recommendations, regulatory reporting (GHG Protocol, CDP, TCFD), and offset verification.

## Carbon Tracking Architecture (What the Model Gets Wrong)

### Emission Scopes
| Scope | What | Examples | Data Source |
|-------|------|---------|-------------|
| Scope 1 | Direct emissions from owned assets | Company vehicles, on-site generators | Fuel consumption records |
| Scope 2 | Indirect from purchased energy | Electricity, heating, cooling | Utility bills, grid emission factors |
| Scope 3 | All other indirect (supply chain) | Business travel, purchased goods, waste | Supplier data, spend-based estimation |

### AI-Enhanced Calculation
```python
async def calculate_emissions(company_data: CompanyData) -> EmissionReport:
    # Scope 1: Direct calculations (deterministic)
    scope1 = calculate_scope1(company_data.fuel_records, emission_factors)
    
    # Scope 2: Location-based + market-based
    scope2_location = calculate_scope2_location(company_data.energy, grid_factors)
    scope2_market = calculate_scope2_market(company_data.energy, supplier_factors)
    
    # Scope 3: AI-assisted estimation (most complex, often >70% of total)
    scope3 = await estimate_scope3(
        spend_data=company_data.procurement,
        travel_data=company_data.business_travel,
        supply_chain=company_data.suppliers,
    )
    # LLM helps classify unclear spend categories → emission factors
    
    return EmissionReport(scope1=scope1, scope2=scope2_location, scope3=scope3, total=scope1+scope2_location+scope3)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Ignore Scope 3 | Often >70% of total emissions | Estimate with spend-based method + supplier data |
| LLM calculates emissions directly | Hallucinate numbers, no audit trail | Deterministic formulas + LLM for classification only |
| Outdated emission factors | Factors change yearly | Use latest GHG Protocol factors, auto-update |
| No data lineage | Can't audit calculations during reporting | Log every data source, factor, calculation step |
| Single reporting framework | Miss CDP vs TCFD vs GHG Protocol differences | Support multiple frameworks from same data |
| Manual data collection | Slow, error-prone, incomplete | API integrations: utility providers, travel systems, ERP |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for spend classification, recommendation generation |
| `config/guardrails.json` | Emission factor sources, reporting framework selection |
| `config/agents.json` | Data connectors, calculation methodology, reporting schedule |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement calculation engine, data connectors, reporting |
| `@reviewer` | Audit calculation accuracy, factor currency, data completeness |
| `@tuner` | Optimize Scope 3 estimation, data collection efficiency |

## Slash Commands
`/deploy` — Deploy tracker | `/test` — Test calculations | `/review` — Audit accuracy | `/evaluate` — Generate emission report
