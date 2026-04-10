---
description: "AI Compliance Engine domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Compliance Engine — Domain Knowledge

This workspace implements an AI compliance engine — automated regulatory compliance checking (GDPR, HIPAA, SOC 2, EU AI Act), policy enforcement, audit trail generation, and risk scoring for AI systems.

## Compliance Architecture (What the Model Gets Wrong)

### Regulatory Framework Mapping
| Regulation | Scope | Key AI Requirements |
|-----------|-------|-------------------|
| EU AI Act | AI systems in EU | Risk classification, transparency, human oversight, bias testing |
| GDPR | Personal data in EU | Right to explanation, data minimization, consent, DPIAs |
| HIPAA | Healthcare data in US | PHI protection, access controls, audit trails, BAAs |
| SOC 2 | SaaS/cloud services | Security controls, availability, processing integrity |
| NIST AI RMF | US federal AI | Risk management, governance, trustworthiness characteristics |

### Automated Compliance Check
```python
class ComplianceCheck:
    regulation: str          # "eu-ai-act", "gdpr", "hipaa"
    requirement: str         # "Article 13 - Transparency"
    check_type: str          # "automated", "manual-review", "documentation"
    status: str              # "compliant", "non-compliant", "partial", "not-applicable"
    evidence: list[str]      # Links to evidence artifacts
    risk_score: float        # 0.0 (no risk) to 1.0 (critical risk)
    remediation: str         # What to fix if non-compliant

async def run_compliance_audit(ai_system: dict) -> ComplianceReport:
    checks = []
    
    # EU AI Act checks
    checks.append(check_risk_classification(ai_system))     # High/limited/minimal risk?
    checks.append(check_transparency(ai_system))            # Users informed it's AI?
    checks.append(check_human_oversight(ai_system))         # Human-in-the-loop for decisions?
    checks.append(check_bias_testing(ai_system))            # Fairness metrics evaluated?
    
    # GDPR checks
    checks.append(check_data_minimization(ai_system))       # Only necessary data collected?
    checks.append(check_right_to_explanation(ai_system))     # Can explain AI decisions?
    checks.append(check_consent_management(ai_system))       # User consent obtained?
    
    return ComplianceReport(checks=checks, overall_risk=calculate_risk(checks))
```

### Risk Classification (EU AI Act)
| Risk Level | Examples | Requirements |
|-----------|---------|-------------|
| Unacceptable | Social scoring, real-time biometric in public | Prohibited |
| High Risk | Credit scoring, hiring, medical diagnosis | Conformity assessment, CE marking, human oversight |
| Limited Risk | Chatbots, emotion recognition | Transparency obligations (disclose it's AI) |
| Minimal Risk | Spam filters, recommendation engines | No specific requirements, voluntary codes |

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Manual compliance checks only | Slow, inconsistent, error-prone | Automate deterministic checks, manual for judgment calls |
| No audit trail | Can't prove compliance during audit | Log every decision, check result, timestamp |
| Compliance as afterthought | Expensive to retrofit | Build compliance checks into CI/CD pipeline |
| Treating all AI as same risk | Over/under regulation | Classify risk first, apply proportional controls |
| No bias testing | Discriminatory outcomes undetected | Regular fairness testing across protected attributes |
| No data lineage | Can't trace where training data came from | Track data provenance from source to model |
| Ignoring model drift | Compliant at launch ≠ compliant 6 months later | Continuous monitoring, periodic re-assessment |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/guardrails.json` | Applicable regulations, risk thresholds, check frequency |
| `config/openai.json` | Model for compliance analysis, report generation |
| `config/agents.json` | Audit schedule, notification channels, evidence storage |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement compliance checks, audit trail, risk scoring |
| `@reviewer` | Audit check completeness, evidence quality, gap analysis |
| `@tuner` | Optimize check frequency, reduce false positives, scoring calibration |

## Slash Commands
`/deploy` — Deploy compliance engine | `/test` — Run compliance audit | `/review` — Gap analysis | `/evaluate` — Generate compliance report
