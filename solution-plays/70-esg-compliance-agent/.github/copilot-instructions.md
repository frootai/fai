---
description: "ESG Compliance Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# ESG Compliance Agent — Domain Knowledge

This workspace implements an ESG (Environmental, Social, Governance) compliance agent — automated ESG data collection, scoring against frameworks (GRI, SASB, CSRD), gap analysis, report generation, and greenwashing detection.

## ESG Compliance Architecture (What the Model Gets Wrong)

### ESG Scoring Framework
```python
class ESGScore(BaseModel):
    overall: float           # 0-100
    environmental: float     # Carbon, waste, water, biodiversity
    social: float            # Labor, diversity, community, health & safety
    governance: float        # Board composition, ethics, transparency, risk mgmt
    framework: str           # GRI, SASB, CSRD, TCFD
    gaps: list[ComplianceGap]
    evidence: list[Evidence]  # Links to supporting documents

async def assess_esg(company_data: dict, framework: str = "CSRD") -> ESGScore:
    requirements = get_framework_requirements(framework)
    scores = {}
    gaps = []
    
    for pillar in ["environmental", "social", "governance"]:
        pillar_reqs = requirements[pillar]
        pillar_data = company_data.get(pillar, {})
        
        met = 0
        for req in pillar_reqs:
            evidence = find_evidence(pillar_data, req)
            if evidence and evidence.confidence > 0.7:
                met += 1
            else:
                gaps.append(ComplianceGap(requirement=req, pillar=pillar, severity="high" if req.mandatory else "medium"))
        
        scores[pillar] = (met / len(pillar_reqs)) * 100
    
    return ESGScore(overall=sum(scores.values())/3, gaps=gaps, framework=framework, **scores)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Self-reported data only | Greenwashing risk, no verification | Cross-reference with public data, third-party audits |
| Single framework | Different stakeholders need different frameworks | Support GRI + SASB + CSRD + TCFD from same data |
| LLM scores without evidence | Hallucinated compliance claims | Every score must link to evidence document |
| No gap analysis | Score without actionable improvement plan | Identify gaps + priority + effort + deadline |
| Ignore double materiality | CSRD requires impact AND financial materiality | Assess both directions: company→world AND world→company |
| Annual assessment only | Risks emerge between cycles | Continuous monitoring with alert on material changes |
| No greenwashing detection | Misleading claims in reports | AI checks: claims vs evidence, quantified vs vague |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for evidence matching, gap analysis, report generation |
| `config/guardrails.json` | Framework requirements, evidence confidence thresholds |
| `config/agents.json` | Data sources, assessment schedule, materiality criteria |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement scoring engine, evidence matching, report generation |
| `@reviewer` | Audit evidence quality, greenwashing detection, framework compliance |
| `@tuner` | Optimize evidence matching, gap prioritization, assessment cadence |

## Slash Commands
`/deploy` — Deploy ESG agent | `/test` — Test with sample data | `/review` — Audit compliance | `/evaluate` — Generate ESG report
