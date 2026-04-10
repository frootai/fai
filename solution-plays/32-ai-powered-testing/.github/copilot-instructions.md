---
description: "AI-Powered Testing domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI-Powered Testing — Domain Knowledge

This workspace implements AI-powered test generation — automatic test case creation from source code, mutation testing, visual regression testing, and intelligent test prioritization using LLM analysis.

## AI Testing Architecture (What the Model Gets Wrong)

### Test Generation from Source Code (Not from Scratch)
```python
# WRONG — LLM generates tests from description only (no source analysis)
tests = llm.generate("Write tests for a user management module")

# CORRECT — analyze source code AST first, then generate targeted tests
async def generate_tests(source_file: str) -> list[TestCase]:
    # 1. Parse source code to understand structure
    ast_tree = parse_ast(source_file)
    functions = extract_functions(ast_tree)
    
    # 2. For each function: analyze inputs, outputs, branches, dependencies
    for fn in functions:
        params = fn.parameters          # Types, defaults, validation
        branches = fn.branch_count      # if/else/switch paths
        dependencies = fn.external_calls # APIs, DB, file I/O to mock
        
    # 3. Generate tests with full context
    tests = await llm.generate_tests(
        source_code=fn.source,
        parameters=params,
        branches=branches,
        dependencies=dependencies,
        framework="pytest",  # or Jest, Pester, etc.
    )
    return tests
```

### Mutation Testing (Verify Tests Actually Catch Bugs)
```python
# After generating tests, mutate source code and check tests still catch it
mutations = [
    ("==", "!="),      # Boundary conditions
    (">=", ">"),       # Off-by-one
    ("and", "or"),     # Logic errors
    ("return x", "return None"),  # Return value
]
# If test passes with mutation → test is weak → improve it
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Tests from description only | Misses actual code paths | Analyze AST first, then generate |
| No mutation testing | Tests may be tautological (always pass) | Mutate source, verify tests catch it |
| All tests are unit tests | Missing integration, E2E coverage | Pyramid: 70% unit, 20% integration, 10% E2E |
| Copy-paste test patterns | DRY violation, maintenance burden | Parameterized tests / test factories |
| No test prioritization | Run all tests every time (slow CI) | Prioritize by: changed files, failure history |
| Mocking too much | Tests pass but code is broken | Mock only external deps, not internal logic |
| No flaky test detection | Intermittent failures ignored | Run 3x, flag inconsistent results |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model for test generation, temperature=0 |
| `config/guardrails.json` | Coverage target, mutation score target, flaky threshold |
| `config/agents.json` | Test framework, prioritization rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Generate tests from source, set up mutation testing, CI integration |
| `@reviewer` | Audit test quality, mock completeness, coverage gaps |
| `@tuner` | Optimize test prioritization, reduce flaky tests, improve speed |

## Slash Commands
`/deploy` — Deploy test pipeline | `/test` — Run generated tests | `/review` — Audit test quality | `/evaluate` — Measure coverage + mutation score
