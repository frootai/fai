---
description: "Accessibility Learning Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Accessibility Learning Agent — Domain Knowledge

This workspace implements an AI accessibility learning agent — WCAG compliance checking, screen reader optimization, alt-text generation, cognitive load assessment, and inclusive design recommendations.

## Accessibility AI Architecture (What the Model Gets Wrong)

### WCAG Automated Checking
```python
async def audit_accessibility(url: str) -> AccessibilityReport:
    # 1. Automated WCAG checks (axe-core / Lighthouse)
    automated = await run_axe_core(url)
    # Catches: missing alt text, color contrast, heading hierarchy, ARIA labels
    
    # 2. AI-enhanced checks (things automated tools miss)
    page_content = await extract_page_content(url)
    ai_checks = await llm.analyze(
        system="You are a WCAG 2.2 AA accessibility expert. Identify issues automated tools miss.",
        content=page_content,
        checks=["meaningful alt text (not just 'image')", "logical reading order",
                "keyboard navigation flow", "cognitive load assessment",
                "plain language (reading level)", "consistent navigation"]
    )
    
    return AccessibilityReport(automated=automated, ai_enhanced=ai_checks, wcag_level="AA")
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Automated tools only | Miss 40-60% of accessibility issues | Automated + AI analysis + manual testing |
| Generic alt text ("image of...") | Screen reader says "image of image of..." | Descriptive: purpose + content of the image |
| Color contrast only | Miss cognitive load, reading order | Full WCAG audit: perceivable + operable + understandable + robust |
| WCAG A only | Enterprise standard is AA minimum | Target WCAG 2.2 AA compliance |
| Test with mouse only | Keyboard-only users can't navigate | Test full keyboard navigation (Tab, Enter, Escape) |
| No screen reader testing | Visual design ≠ screen reader experience | Test with NVDA/JAWS/VoiceOver |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for cognitive analysis, alt-text generation |
| `config/guardrails.json` | WCAG level target (A/AA/AAA), severity thresholds |
| `config/agents.json` | Audit scope, check categories, reporting format |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement WCAG checks, alt-text gen, remediation suggestions |
| `@reviewer` | Audit compliance completeness, false positive rate |
| `@tuner` | Optimize check accuracy, prioritize high-impact fixes |

## Slash Commands
`/deploy` — Deploy accessibility checker | `/test` — Audit a page | `/review` — Compliance report | `/evaluate` — Measure WCAG score
