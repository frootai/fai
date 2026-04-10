---
description: "AI Sales Assistant domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Sales Assistant — Domain Knowledge

This workspace implements an AI sales assistant — lead scoring, opportunity analysis, email/call preparation, CRM integration, competitive intelligence, and deal coaching with conversational AI.

## Sales AI Architecture (What the Model Gets Wrong)

### Lead Scoring with CRM Context
```python
class LeadScore(BaseModel):
    score: int = Field(..., ge=0, le=100)
    temperature: str  # hot, warm, cold
    factors: list[ScoringFactor]
    next_action: str  # "schedule_demo", "send_case_study", "nurture_sequence"
    talk_track: str   # Personalized talking points for this lead

async def score_lead(lead: CRMContact) -> LeadScore:
    # Ground in CRM data, not LLM speculation
    context = {
        "company_size": lead.company.employees,
        "industry": lead.company.industry,
        "engagement": lead.email_opens + lead.website_visits,
        "previous_deals": lead.company.closed_won_count,
        "budget_signals": lead.company.funding_round or lead.company.revenue,
    }
    return await llm.score(lead_context=context, temperature=0)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM guesses company info | Hallucinated revenue, employee count | Ground in CRM data (Salesforce, HubSpot, Dynamics) |
| Generic email templates | Low response rate, feels robotic | Personalize with lead's industry, role, recent activity |
| No CRM integration | Manual data entry, stale context | API integration: Salesforce, HubSpot, Dynamics 365 |
| Score without engagement data | Miss behavioral signals | Include: email opens, page visits, content downloads |
| Same pitch for all leads | Ignore industry/role differences | Customize talk track by industry + persona |
| No competitive intelligence | Blind to competitor positioning | Ground in win/loss data + competitor battle cards |
| AI sends emails without review | Brand risk, compliance issues | AI drafts → sales rep reviews → sends |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Scoring model, email generation temperature (0.5) |
| `config/guardrails.json` | Score thresholds (hot/warm/cold), email review rules |
| `config/agents.json` | CRM connector, scoring weights, personalization rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement lead scoring, CRM integration, email generation |
| `@reviewer` | Audit scoring fairness, email quality, CRM data accuracy |
| `@tuner` | Optimize scoring model, conversion correlation, personalization |

## Slash Commands
`/deploy` — Deploy sales AI | `/test` — Test with sample leads | `/review` — Audit quality | `/evaluate` — Measure lead-to-close rate
