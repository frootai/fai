---
description: "Citizen Services Chatbot domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Citizen Services Chatbot — Domain Knowledge

This workspace implements a government citizen services chatbot — multi-lingual public information, form assistance, permit/license status tracking, complaint routing, and accessibility-compliant interactions.

## Citizen Services Architecture (What the Model Gets Wrong)

### Public Service Chatbot Requirements
```python
# Government chatbots have unique requirements vs commercial
CITIZEN_BOT_RULES = """
1. ACCURACY: Only provide information from official government sources. Never guess.
2. ACCESSIBILITY: WCAG 2.2 AA compliant. Support screen readers. Plain language (8th grade level).
3. MULTILINGUAL: Support top 5 languages of the jurisdiction + real-time translation for others.
4. PRIVACY: No data collection beyond necessary. No cookies for tracking. GDPR/CCPA compliant.
5. TRANSPARENCY: "I am an AI assistant. For official decisions, contact [department]."
6. HANDOFF: Always offer human agent option. Never force AI-only path.
7. NON-PARTISAN: No opinions on policy. Factual information only.
8. OFFLINE CAPABILITY: Core info available without internet (cached responses).
"""
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Commercial chatbot patterns | Government has different trust/compliance requirements | Follow government-specific guidelines (Digital Services Playbook) |
| AI makes binding decisions | Legal liability, due process violations | "For official decisions, contact [department]" — always |
| English-only | Excludes non-English-speaking citizens | Multi-lingual from day one + real-time translation fallback |
| Complex language | Low literacy citizens can't understand | Plain language: 8th grade reading level, short sentences |
| No human escalation | Citizens stuck with AI on complex issues | Always offer "Talk to a person" option |
| Opinionated responses | Government must be non-partisan | Factual only, no subjective statements |
| Track user behavior | Privacy violation for government services | Minimal data collection, no behavioral tracking |
| No accessibility | Exclude disabled citizens | WCAG 2.2 AA: screen reader, keyboard nav, contrast |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model, temperature=0 for factual accuracy |
| `config/guardrails.json` | Language options, reading level, privacy rules |
| `config/agents.json` | Department routing, escalation rules, service catalog |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement chatbot, multi-lingual, form assistance |
| `@reviewer` | Audit accessibility, privacy, accuracy, non-partisanship |
| `@tuner` | Optimize response quality, language clarity, resolution rate |

## Slash Commands
`/deploy` — Deploy citizen bot | `/test` — Test conversations | `/review` — Accessibility audit | `/evaluate` — Measure citizen satisfaction
