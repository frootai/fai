---
description: "Cost-Optimized AI Gateway domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Cost-Optimized AI Gateway — Domain Knowledge

This workspace implements an AI API gateway — intelligent model routing, response caching, token budgeting, rate limiting, and cost tracking for multi-model AI deployments.

## AI Gateway Architecture (What the Model Gets Wrong)

### Model Routing (Route by Complexity, Not by Default)
```python
# WRONG — always use the most expensive model
response = client.chat.completions.create(model="gpt-4o", ...)  # $5/1M tokens

# CORRECT — route by query complexity
def route_model(query: str, complexity: str) -> str:
    routing_table = {
        "simple": "gpt-4o-mini",     # $0.15/1M — 30x cheaper (FAQs, lookups)
        "medium": "gpt-4o-mini",     # $0.15/1M — summarization, extraction
        "complex": "gpt-4o",         # $5/1M — reasoning, multi-step, code gen
        "embedding": "text-embedding-3-small",  # $0.02/1M — 10x cheaper than large
    }
    return routing_table.get(complexity, "gpt-4o-mini")

# Classify complexity BEFORE calling the model
complexity = classify_query_complexity(query)  # Rule-based or mini-model classifier
model = route_model(query, complexity)
```

### Response Caching (Semantic Cache)
```python
import hashlib

def get_cache_key(query: str, model: str) -> str:
    normalized = query.strip().lower()
    return f"ai:{model}:{hashlib.sha256(normalized.encode()).hexdigest()[:16]}"

# Check cache BEFORE calling API
cached = redis.get(cache_key)
if cached:
    return json.loads(cached)  # Cache hit — $0 cost, <10ms latency

# API call only on cache miss
response = client.chat.completions.create(model=model, ...)
redis.setex(cache_key, 3600, json.dumps(response_dict))  # Cache for 1 hour
```

### Token Budget Management
```python
# Track token usage per department/team
def track_usage(department: str, tokens: int, model: str, cost: float):
    redis.hincrby(f"usage:{department}:{date}", "tokens", tokens)
    redis.hincrbyfloat(f"usage:{department}:{date}", "cost", cost)
    
    # Check budget
    monthly_budget = budgets[department]  # e.g., $500/month
    current_spend = float(redis.hget(f"usage:{department}:total", "cost") or 0)
    if current_spend > monthly_budget * 0.8:
        send_alert(f"{department} at {current_spend/monthly_budget*100:.0f}% of budget")
    if current_spend >= monthly_budget:
        raise BudgetExceededError(f"{department} exceeded ${monthly_budget} budget")
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| One model for everything | 30x cost overhead on simple queries | Route: simple→mini, complex→4o |
| No caching | Same query costs money every time | Semantic cache with 1-24h TTL |
| No token tracking | Cost surprises at month end | Track per-dept, alert at 80% |
| No rate limiting | Single user exhausts quota | Per-user rate limits (100 req/min) |
| Embedding with large model | `text-embedding-3-large` when small suffices | Use `-small` for 90% of cases |
| No PTU consideration | Pay-per-token at high volume | PTU (Provisioned Throughput) at >1M tokens/day |
| max_tokens too high | Paying for unused capacity | Set max_tokens to actual need (512-2048) |
| No fallback model | Primary model outage = total outage | Fallback chain: gpt-4o → gpt-4o-mini → cached |

## Cost Comparison
| Model | Input/1M | Output/1M | Use Case |
|-------|---------|----------|----------|
| gpt-4o | $5.00 | $15.00 | Complex reasoning |
| gpt-4o-mini | $0.15 | $0.60 | Simple tasks (30x cheaper) |
| text-embedding-3-large | $0.13 | — | High-quality embeddings |
| text-embedding-3-small | $0.02 | — | Standard embeddings (6x cheaper) |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | default model, fallback chain |
| `config/guardrails.json` | budget limits per dept, rate limits |
| `config/model-comparison.json` | routing rules, cost/quality matrix |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement gateway, routing logic, caching layer, budget tracking |
| `@reviewer` | Audit routing accuracy, cache hit rates, security, rate limits |
| `@tuner` | Optimize routing thresholds, cache TTL, budget alerts, PTU sizing |

## Slash Commands
`/deploy` — Deploy AI gateway | `/test` — Test routing + caching | `/review` — Audit cost | `/evaluate` — Evaluate savings
