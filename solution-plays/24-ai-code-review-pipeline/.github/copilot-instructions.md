---
description: "AI Code Review Pipeline domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Code Review Pipeline — Domain Knowledge

This workspace implements an AI-powered code review pipeline — automated PR review, security scanning, style checking, complexity analysis, and suggested fixes using LLM + static analysis.

## Code Review Architecture (What the Model Gets Wrong)

### Hybrid Review: Static Analysis + LLM
```python
# WRONG — LLM-only review (misses deterministic issues)
review = llm.review(pr_diff)

# CORRECT — static analysis catches deterministic issues, LLM adds semantic review
async def review_pr(pr: PullRequest) -> ReviewResult:
    diff = pr.get_diff()
    
    # Layer 1: Static analysis (deterministic, fast)
    lint_issues = run_linter(diff)          # ESLint, Pylint, PSScriptAnalyzer
    security_issues = run_sast(diff)         # Semgrep, CodeQL, Bandit
    complexity = calculate_complexity(diff)   # Cyclomatic complexity per function
    
    # Layer 2: LLM review (semantic, catches design issues)
    llm_review = await llm_review_diff(diff, context={
        "lint_issues": lint_issues,
        "pr_description": pr.description,
        "related_files": pr.get_related_files(),
    })
    
    # Merge results
    return ReviewResult(
        static_issues=lint_issues + security_issues,
        llm_suggestions=llm_review.suggestions,
        complexity_warnings=complexity.warnings,
        verdict=determine_verdict(lint_issues, security_issues, llm_review),
    )
```

### LLM Review Prompt (Focused, Not Generic)
```python
REVIEW_PROMPT = """Review this code diff. Focus on:
1. Logic errors and edge cases the author may have missed
2. Security vulnerabilities (OWASP Top 10, injection, auth)
3. Performance issues (N+1 queries, missing async, large allocations)
4. Maintainability (naming, complexity, missing error handling)

Do NOT comment on: formatting, import order, or style (linter handles these).
For each issue, provide: severity (critical/warning/info), line number, and suggested fix."""
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM-only review | Misses deterministic issues (unused vars, syntax) | Static analysis first, LLM for semantics |
| Full file in context | Context overflow on large PRs | Review diff only, not entire files |
| Generic review prompt | "Looks good" responses | Focus prompt on logic, security, performance |
| No severity levels | All comments equal weight | Critical/warning/info classification |
| Reviewing generated code | Noise from auto-generated files | Exclude: lock files, generated, vendor |
| No line number references | Comments can't be mapped to code | Include line numbers in review output |
| Blocking on style issues | Nit-picks slow PRs | Linter for style, LLM for design only |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model (gpt-4o for complex, mini for simple PRs), temperature=0 |
| `config/guardrails.json` | Severity thresholds, auto-approve rules, blocked patterns |
| `config/agents.json` | Review focus areas, excluded file patterns |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement review pipeline, GitHub integration, static analysis setup |
| `@reviewer` | Audit review quality, false positive rate, coverage |
| `@tuner` | Optimize review prompt, reduce noise, improve actionability |

## Slash Commands
`/deploy` — Deploy review pipeline | `/test` — Test on sample PRs | `/review` — Meta-review the reviewer | `/evaluate` — Measure review effectiveness
