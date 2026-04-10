---
description: "Network Optimization Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Network Optimization Agent — Domain Knowledge

This workspace implements AI for telecom network optimization — capacity planning, traffic routing, anomaly detection, predictive maintenance of network equipment, and 5G resource allocation.

## Network Optimization Architecture (What the Model Gets Wrong)

### Traffic-Aware Resource Allocation
```python
async def optimize_network(region: str) -> NetworkPlan:
    # 1. Current network state
    topology = await get_network_topology(region)
    traffic = await get_real_time_traffic(region)
    equipment_health = await get_equipment_metrics(region)
    
    # 2. Predict traffic for next 4 hours
    forecast = traffic_model.predict(traffic.features, horizon_hours=4)
    
    # 3. Optimize resource allocation
    plan = optimize_allocation(
        forecast=forecast, topology=topology,
        constraints={
            "max_utilization": 0.80,      # No link above 80% capacity
            "min_redundancy": 2,           # At least 2 paths between nodes
            "latency_sla_ms": 20,          # Max latency for critical traffic
        },
    )
    
    # 4. Predictive maintenance alerts
    at_risk = [e for e in equipment_health if e.failure_probability > 0.7]
    
    return NetworkPlan(allocation=plan, at_risk_equipment=at_risk, forecast=forecast)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| LLM for traffic prediction | Time-series models far better | ARIMA/LSTM for traffic, LLM for report generation |
| React to congestion (not predict) | Packet loss already happening when detected | Predictive: forecast traffic 2-4 hours ahead |
| Ignore equipment health | Equipment fails without warning | Predictive maintenance: monitor temp, error rates, age |
| Static routing | Can't adapt to traffic changes | Dynamic routing based on real-time + predicted load |
| 100% utilization target | No headroom for spikes | Max 80% link utilization, 20% headroom |
| No redundancy validation | Single point of failure | Verify 2+ paths between all critical nodes |
| Optimize latency only | Miss throughput, jitter, packet loss | Multi-objective: latency + throughput + reliability |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | LLM for anomaly analysis, report generation |
| `config/guardrails.json` | Utilization caps, latency SLAs, failure thresholds |
| `config/agents.json` | Network topology, traffic sources, equipment sensors |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement traffic forecasting, routing optimization, monitoring |
| `@reviewer` | Audit SLA compliance, redundancy, equipment health |
| `@tuner` | Optimize utilization caps, forecast accuracy, maintenance scheduling |

## Slash Commands
`/deploy` — Deploy optimizer | `/test` — Simulate traffic | `/review` — SLA audit | `/evaluate` — Measure network performance
