---
description: "Food Safety Inspector AI domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Food Safety Inspector AI — Domain Knowledge

This workspace implements AI for food safety — HACCP compliance checking, contamination risk scoring, supply chain traceability, recall management, and regulatory reporting (FDA, EFSA).

## Food Safety AI Architecture (What the Model Gets Wrong)

### HACCP Digital Twin
```python
class HACCPCheckpoint(BaseModel):
    control_point: str       # "receiving", "storage", "cooking", "cooling", "serving"
    critical: bool           # Is this a Critical Control Point (CCP)?
    parameter: str           # "temperature", "pH", "time", "moisture"
    limit: float             # Critical limit (e.g., 165°F cooking temp)
    actual: float            # Measured value
    compliant: bool          # actual meets limit?
    corrective_action: str   # What to do if non-compliant

async def inspect_food_safety(facility_id: str) -> InspectionReport:
    checkpoints = await get_haccp_data(facility_id)
    violations = [cp for cp in checkpoints if not cp.compliant]
    
    # AI-enhanced: pattern detection across historical inspections
    historical = await get_inspection_history(facility_id, months=12)
    patterns = await detect_violation_patterns(historical)
    # Recurring cold storage temp violations = equipment issue, not process issue
    
    risk_score = calculate_risk(violations, patterns)
    return InspectionReport(checkpoints=checkpoints, violations=violations, patterns=patterns, risk=risk_score)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| AI replaces human inspectors | Regulatory non-compliance | AI assists inspectors, doesn't replace |
| Ignore historical patterns | Treat each inspection independently | Track violation patterns over time |
| Static HACCP plans | Plans don't evolve with operations | AI suggests HACCP plan updates based on data |
| No traceability | Can't trace contamination source | Full supply chain tracking: farm → fork |
| Binary pass/fail only | Miss trending toward failure | Trend analysis: "temp rising 2°F/month" |
| No recall simulation | Unprepared for recall events | Practice recall with simulation + AI coordination |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for pattern analysis, report generation |
| `config/guardrails.json` | Critical limits, risk thresholds, alert rules |
| `config/agents.json` | HACCP plan, checkpoint definitions, regulatory framework |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement HACCP monitoring, traceability, pattern detection |
| `@reviewer` | Audit regulatory compliance, data accuracy, risk scoring |
| `@tuner` | Optimize critical limits, pattern sensitivity, alert thresholds |

## Slash Commands
`/deploy` — Deploy food safety AI | `/test` — Simulate inspection | `/review` — Compliance audit | `/evaluate` — Measure detection rate
