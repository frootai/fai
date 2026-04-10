---
description: "AI Infrastructure Optimizer domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# AI Infrastructure Optimizer — Domain Knowledge

This workspace implements AI infrastructure optimization — right-sizing Azure resources, GPU utilization analysis, cost anomaly detection, auto-scaling recommendations, and FinOps dashboards for AI workloads.

## Infrastructure Optimization (What the Model Gets Wrong)

### Right-Sizing Analysis
```python
async def analyze_right_sizing(resource_group: str) -> list[Recommendation]:
    recommendations = []
    resources = await list_resources(resource_group)
    for resource in resources:
        metrics = await get_metrics(resource, period_days=30)
        
        # CPU/GPU utilization check
        if metrics.avg_cpu < 20:
            recommendations.append(Recommendation(
                resource=resource.name, current_sku=resource.sku,
                suggested_sku=downsize_sku(resource.sku),
                savings_pct=estimate_savings(resource.sku, downsize_sku(resource.sku)),
                reason=f"Avg CPU {metrics.avg_cpu}% over 30 days — over-provisioned",
            ))
        
        # GPU utilization (AI-specific)
        if resource.has_gpu and metrics.avg_gpu < 30:
            recommendations.append(Recommendation(
                resource=resource.name, reason=f"GPU utilization {metrics.avg_gpu}% — consider CPU-only or smaller GPU",
            ))
    return recommendations
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Right-size based on peak usage | Over-provisions for rare spikes | Use p95, not max — with auto-scale for spikes |
| Ignore GPU utilization | Paying for idle GPUs ($2-10/hr) | Monitor GPU util, switch to CPU for inference if <30% |
| No cost anomaly detection | Surprise bills undetected | Alert on >20% daily cost increase |
| Manual scaling only | Can't respond to demand changes fast enough | KEDA/HPA auto-scaling based on queue depth or latency |
| Optimize compute only | Miss storage, network, egress costs | Full FinOps: compute + storage + network + data transfer |
| One-time analysis | Resources change, drift from recommendations | Continuous monitoring (weekly re-analysis) |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for recommendation explanations |
| `config/guardrails.json` | Utilization thresholds, cost anomaly sensitivity |
| `config/agents.json` | Resource scopes, analysis frequency, alert channels |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement monitoring, right-sizing engine, auto-scaling |
| `@reviewer` | Audit recommendations safety, cost accuracy |
| `@tuner` | Optimize thresholds, alert sensitivity, analysis frequency |

## Slash Commands
`/deploy` — Deploy optimizer | `/test` — Run analysis | `/review` — Audit recommendations | `/evaluate` — Measure cost savings
