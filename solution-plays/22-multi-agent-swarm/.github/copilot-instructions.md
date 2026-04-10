---
description: "Multi-Agent Swarm domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Multi-Agent Swarm — Domain Knowledge

This workspace implements a multi-agent swarm — distributed agent teams with dynamic task allocation, parallel execution, consensus mechanisms, and conflict resolution.

## Swarm Architecture (What the Model Gets Wrong)

### Swarm vs Supervisor (Key Difference)
```python
# SUPERVISOR (Play 07) — one orchestrator routes to specialists
class Supervisor:
    def route(self, task): return self.agents[task.type]

# SWARM (Play 22) — agents self-organize, bid on tasks, reach consensus
class Swarm:
    async def process(self, task: Task) -> Result:
        # Step 1: Broadcast task to all capable agents
        bids = await asyncio.gather(*[a.bid(task) for a in self.agents if a.can_handle(task)])
        
        # Step 2: Select best agent(s) based on bid confidence
        selected = sorted(bids, key=lambda b: b.confidence, reverse=True)[:3]
        
        # Step 3: Execute in parallel, collect results
        results = await asyncio.gather(*[a.execute(task) for a in selected])
        
        # Step 4: Consensus — majority vote or confidence-weighted merge
        return self.consensus(results)
```

### Consensus Mechanisms
| Mechanism | When to Use | How |
|-----------|------------|-----|
| Majority vote | Factual questions, classification | 3 agents vote, majority wins |
| Confidence-weighted | Variable agent expertise | Weight results by confidence score |
| Debate + judge | Complex reasoning | Agents argue, judge agent decides |
| Best-of-N | Creative tasks | Generate N outputs, score and select best |

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| All agents identical | No diversity = no benefit from swarm | Specialize agents (researcher, critic, synthesizer) |
| No consensus mechanism | First response wins, ignoring others | Implement voting or confidence-weighted merge |
| Unlimited parallel agents | Token cost explosion | Cap at 3-5 concurrent agents per task |
| No timeout per agent | Slow agent blocks entire swarm | 30s timeout, use partial results |
| No dedup on results | Redundant content from similar agents | Deduplicate before consensus |
| No cost tracking | Swarm multiplies API costs | Track cost per task = sum of all agent costs |
| Synchronous execution | Sequential = no swarm benefit | Use asyncio.gather for parallel execution |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Per-agent model selection, temperature |
| `config/agents.json` | Swarm size, bidding rules, consensus method, timeout |
| `config/guardrails.json` | Max concurrent agents, cost cap per task |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement swarm topology, bidding, consensus, parallel execution |
| `@reviewer` | Audit consensus quality, cost, deduplication, timeout handling |
| `@tuner` | Optimize swarm size, agent selection, cost/quality trade-off |

## Slash Commands
`/deploy` — Deploy swarm | `/test` — Test consensus | `/review` — Audit swarm | `/evaluate` — Measure swarm vs single-agent
