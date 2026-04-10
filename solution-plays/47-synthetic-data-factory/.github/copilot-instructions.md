---
description: "Synthetic Data Factory domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Synthetic Data Factory — Domain Knowledge

This workspace implements a synthetic data generation factory — creating realistic but privacy-safe datasets for training, testing, and evaluation using LLMs, statistical models, and differential privacy.

## Synthetic Data Architecture (What the Model Gets Wrong)

### Generation Approaches
| Approach | When to Use | Privacy | Quality |
|----------|------------|---------|---------|
| LLM generation | Text data, conversations, documents | High (no real data) | Good for structure, varies for stats |
| Statistical (CTGAN) | Tabular data with correlations | Medium (DP needed) | Preserves distributions |
| Differential privacy | When training on real data | Highest (mathematical guarantee) | Some utility loss |
| Rule-based | Structured data with known schemas | High | Exact control over output |
| Augmentation | Expand existing small datasets | Depends on source | Good for NLP/vision |

### LLM-Based Synthetic Generation
```python
async def generate_synthetic_dataset(schema: dict, count: int, constraints: list) -> list:
    prompt = f"""Generate {count} realistic synthetic records matching this schema:
{json.dumps(schema, indent=2)}

Constraints:
{chr(10).join(f'- {c}' for c in constraints)}

Requirements:
- Realistic distributions (not uniform random)
- Preserve correlations between fields (e.g., age correlates with job_title)
- No real PII — all names, addresses, SSNs must be fictional
- Output as JSON array"""

    response = await client.chat.completions.create(
        model="gpt-4o", temperature=0.7,  # Higher temp for diversity
        response_format={"type": "json_object"},
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(response.choices[0].message.content)["records"]
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Copy real data, change names | Still identifiable (quasi-identifiers) | Generate from scratch or use differential privacy |
| Uniform random values | Unrealistic distributions | Specify real-world distributions (Gaussian, Zipf) |
| No correlation preservation | Independent columns lose relationships | Model correlations (CTGAN, copula) |
| temperature=0 for generation | All records identical | temperature=0.7-0.9 for diversity |
| No validation against real stats | Synthetic data diverges from reality | Compare distributions, correlations with original |
| Generating PII patterns | SSN, email formats look real | Add obvious markers: "SYNTH-" prefix, .example.com |
| One-shot large dataset | Context overflow, quality drops | Generate in batches of 50-100, merge |
| No seed for reproducibility | Can't reproduce exact dataset | Fixed seed for deterministic re-generation |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Generation model, temperature (0.7-0.9), batch size |
| `config/guardrails.json` | Privacy level, PII markers, validation thresholds |
| `config/agents.json` | Schema definitions, constraint rules, output format |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement generation pipelines, statistical models, validation |
| `@reviewer` | Audit privacy guarantees, distribution fidelity, PII leakage |
| `@tuner` | Optimize diversity, statistical accuracy, generation cost |

## Slash Commands
`/deploy` — Deploy data factory | `/test` — Generate + validate sample | `/review` — Privacy audit | `/evaluate` — Compare synthetic vs real distributions
