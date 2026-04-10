---
description: "Prompt Management domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Prompt Management — Domain Knowledge

This workspace implements a prompt management platform — version control, A/B testing, template engine, evaluation pipeline, and prompt registry for enterprise LLM applications.

## Prompt Management Architecture (What the Model Gets Wrong)

### Prompt as Code (Version-Controlled, Not Hardcoded)
```python
# WRONG — hardcoded prompt in application code
system_prompt = "You are a helpful assistant that answers questions about our products."

# CORRECT — prompt loaded from registry with version
from prompt_registry import PromptRegistry

registry = PromptRegistry(storage="azure-blob")
prompt = registry.get("product-qa", version="2.3.1")
# prompt.template: "You are a {role} that {task}. Rules: {rules}"
# prompt.variables: {"role": "product specialist", "task": "answers questions", "rules": "..."}
response = client.chat.completions.create(
    model=prompt.model,
    temperature=prompt.temperature,
    messages=[{"role": "system", "content": prompt.render()}],
)
```

### Prompt Template Engine
```python
# Template with typed variables + validation
class PromptTemplate:
    template: str          # "Answer about {product} for {audience}. Tone: {tone}."
    variables: dict        # {"product": "required", "audience": "required", "tone": "optional:professional"}
    model: str             # "gpt-4o"
    temperature: float     # 0.1
    max_tokens: int        # 2048
    version: str           # "2.3.1" (semver)
    
    def render(self, **kwargs) -> str:
        # Validate all required variables provided
        for var, rule in self.variables.items():
            if rule.startswith("required") and var not in kwargs:
                raise ValueError(f"Missing required variable: {var}")
        return self.template.format(**kwargs)
```

### A/B Testing Prompts
```python
# Route 50% traffic to each variant, measure quality
async def ab_test_prompt(query: str, user_id: str):
    variant = "A" if hash(user_id) % 2 == 0 else "B"
    prompt = registry.get("product-qa", variant=variant)
    response = await generate(query, prompt)
    # Log variant + quality metrics for analysis
    log_experiment(variant=variant, query=query, groundedness=response.groundedness)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Prompts hardcoded in code | Can't iterate without deploy | Prompt registry with version control |
| No prompt versioning | Can't roll back bad prompts | Semver: major.minor.patch |
| No A/B testing | Can't measure prompt improvements | Route traffic to variants, measure quality |
| No evaluation on change | New prompt may be worse | Run eval pipeline on every prompt change |
| String concatenation for templates | Injection risk, messy code | Template engine with typed variables |
| No prompt review process | Anyone pushes production prompts | PR-based prompt review (like code review) |
| No token budget per prompt | Prompt grows until context overflow | Max token limit per prompt template |
| Logging full prompts | PII exposure | Log prompt version + hash, not content |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Default model, temperature per prompt type |
| `config/guardrails.json` | Prompt size limits, banned patterns, injection detection |
| `config/agents.json` | A/B test traffic split, rollout percentage |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement prompt registry, template engine, A/B framework |
| `@reviewer` | Audit prompt quality, injection risks, version hygiene |
| `@tuner` | Optimize prompts via A/B results, reduce token usage, improve quality |

## Slash Commands
`/deploy` — Deploy prompt registry | `/test` — Run prompt evaluation | `/review` — Audit prompts | `/evaluate` — Analyze A/B results
