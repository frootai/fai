---
description: "AI Observability domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Observability — Domain Knowledge

This workspace implements an AI observability platform — tracing LLM calls, monitoring token usage, tracking quality metrics (groundedness, latency, cost), alerting on degradation, and building dashboards.

## AI Observability Architecture (What the Model Gets Wrong)

### The Three Pillars for AI Systems
```
Traces (per-request)          Metrics (aggregated)        Logs (events)
├── Query received            ├── Token usage/min         ├── Model version changes
├── Retrieval: 5 chunks       ├── Latency p50/p95/p99     ├── Guardrail violations
├── LLM: gpt-4o, 234ms       ├── Cost per query          ├── Configuration changes
├── Safety check: pass        ├── Groundedness score      ├── Deployment events
└── Response: 189 tokens      ├── Error rate              └── Audit trail
                              └── Cache hit rate
```

### OpenTelemetry for LLM Tracing
```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider

tracer = trace.get_tracer("ai-app")

async def process_query(query: str):
    with tracer.start_as_current_span("ai.query") as span:
        span.set_attribute("ai.query.text_length", len(query))
        
        with tracer.start_as_current_span("ai.retrieval") as ret_span:
            chunks = await search(query)
            ret_span.set_attribute("ai.retrieval.chunk_count", len(chunks))
            ret_span.set_attribute("ai.retrieval.latency_ms", retrieval_time)
        
        with tracer.start_as_current_span("ai.llm") as llm_span:
            response = await generate(query, chunks)
            llm_span.set_attribute("ai.llm.model", "gpt-4o")
            llm_span.set_attribute("ai.llm.tokens.input", response.usage.prompt_tokens)
            llm_span.set_attribute("ai.llm.tokens.output", response.usage.completion_tokens)
            llm_span.set_attribute("ai.llm.latency_ms", llm_time)
            llm_span.set_attribute("ai.llm.cost", calculate_cost(response.usage))
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| No correlation ID | Can't trace request across services | Add `x-correlation-id` header, propagate in spans |
| Logging full prompts | PII exposure + storage cost | Log prompt hash + metadata only |
| No token tracking | Cost surprises | Track tokens per request, per model, per user |
| Alerting on raw errors only | Miss quality degradation | Alert on groundedness drop, latency spike, cost anomaly |
| No baseline metrics | Can't detect regression | Establish baselines first week, then alert on deviation |
| Dashboard without SLOs | No target to measure against | Define SLOs: latency <2s, groundedness >0.8 |
| No model version tracking | Silent model updates break quality | Log system_fingerprint, alert on changes |
| Sampling at 100% | Storage cost explosion at scale | Sample traces at 10-20%, keep 100% for errors |

### KQL Queries for AI Monitoring (Application Insights)
```kql
// Token usage by model (last 24h)
customMetrics
| where name == "ai.llm.tokens.total"
| summarize TotalTokens=sum(value) by model=tostring(customDimensions.model), bin(timestamp, 1h)
| render timechart

// Latency percentiles
customMetrics
| where name == "ai.llm.latency_ms"
| summarize p50=percentile(value, 50), p95=percentile(value, 95), p99=percentile(value, 99) by bin(timestamp, 1h)

// Cost per department
customMetrics
| where name == "ai.llm.cost"
| summarize DailyCost=sum(value) by department=tostring(customDimensions.department), bin(timestamp, 1d)
```

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model for analysis, temperature |
| `config/guardrails.json` | Alert thresholds, SLOs, sampling rate |
| `config/agents.json` | Dashboard refresh interval, notification channels |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement tracing, custom metrics, dashboards, alert rules |
| `@reviewer` | Audit data collection, PII handling, alert coverage |
| `@tuner` | Optimize sampling rates, alert thresholds, storage costs |

## Slash Commands
`/deploy` — Deploy observability stack | `/test` — Test tracing | `/review` — Audit coverage | `/evaluate` — Evaluate alert effectiveness
