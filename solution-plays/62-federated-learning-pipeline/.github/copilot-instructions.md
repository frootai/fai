---
description: "Federated Learning Pipeline domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Federated Learning Pipeline — Domain Knowledge

This workspace implements federated learning — distributed model training across data silos without centralizing data, with differential privacy, secure aggregation, and model convergence monitoring.

## Federated Learning Architecture (What the Model Gets Wrong)

### Federated Averaging (FedAvg)
```python
# Central server orchestrates, data NEVER leaves client nodes
class FederatedServer:
    async def training_round(self, global_model, clients: list) -> Model:
        # 1. Distribute global model to selected clients
        selected = random.sample(clients, k=min(10, len(clients)))
        
        # 2. Each client trains locally on their private data
        local_updates = await asyncio.gather(*[
            client.train_locally(global_model, epochs=3) for client in selected
        ])
        
        # 3. Aggregate updates (FedAvg: weighted average by dataset size)
        aggregated = federated_average(local_updates, weights=[c.data_size for c in selected])
        
        # 4. Apply differential privacy noise
        noisy_update = add_dp_noise(aggregated, epsilon=1.0, delta=1e-5)
        
        # 5. Update global model
        return apply_update(global_model, noisy_update)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Centralize data for training | Privacy violation, regulatory non-compliance | Federated: data stays at client, only gradients shared |
| No differential privacy | Gradients can leak training data | Add DP noise (epsilon=1.0 for strong privacy) |
| Equal weighting all clients | Clients with 10 samples same as 10K samples | Weight by dataset size in aggregation |
| No convergence monitoring | Training diverges silently | Track global loss, detect non-converging clients |
| Synchronous training only | Slow clients block entire round | Async federated: accept partial updates |
| No client selection strategy | All clients every round (expensive) | Random + stratified selection per round |
| Ignore data heterogeneity | Non-IID data across clients causes drift | FedProx or scaffold for non-IID handling |
| No model validation | Aggregated model may be worse | Validate on held-out server dataset after each round |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Base model, local training epochs, learning rate |
| `config/guardrails.json` | DP epsilon/delta, min clients per round, convergence threshold |
| `config/agents.json` | Client selection strategy, aggregation method, round limits |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement federated server, client training, secure aggregation |
| `@reviewer` | Audit privacy guarantees, DP parameters, data isolation |
| `@tuner` | Optimize convergence speed, client selection, privacy/utility trade-off |

## Slash Commands
`/deploy` — Deploy federated pipeline | `/test` — Simulate training round | `/review` — Privacy audit | `/evaluate` — Measure convergence + privacy
