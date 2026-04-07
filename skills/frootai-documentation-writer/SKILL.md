---
name: frootai-documentation-writer
description: 'Generates documentation aligned with the FROOT knowledge framework — module-style docs with duration, audience, table of contents, mermaid diagrams, code examples, and key takeaways sections.'
---

# FrootAI Documentation Writer

Generate documentation following the FrootAI FROOT module style.

## Parameters

- **Topic**: ${TOPIC="The subject to document"}
- **Audience**: ${AUDIENCE="Cloud Architects|Platform Engineers|Developers|All"}
- **Duration**: ${DURATION="30 min|60 min|90 min"}
- **FROOT Layer**: ${LAYER="Foundations|Reasoning|Orchestration|Operations|Transformation"}

## Document Template

```markdown
# Module N: [Title] — [Subtitle]

> **Duration:** {DURATION} | **Level:** {Level}
> **Audience:** {AUDIENCE}
> **Part of:** {LAYER_EMOJI} FROOT {LAYER} Layer

---

## N.1 [First Section]
[Content with explanation, context, WHY it matters]

### Subsection
[Deeper detail with code examples]

| Concept | Definition | Example |
|---------|-----------|---------|
| ... | ... | ... |

```mermaid
[Diagram illustrating the concept]
```

## Key Takeaways
1. [Actionable insight]
2. [Actionable insight]
3. [Actionable insight]

---

> **Next:** [Link to next module]
```

## Style Rules

- Write for architects, not academics — practical, opinionated, experience-driven
- Every section answers "why does this matter for MY infrastructure?"
- Code examples must be runnable — no pseudocode, no placeholders
- Mermaid diagrams for architecture, sequence flows, decision trees
- Tables for comparisons (always include a recommendation column)
- Key takeaways start with action verbs
