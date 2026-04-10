---
description: "Fine-Tuning Workflow domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Fine-Tuning Workflow — Domain Knowledge

This workspace implements an end-to-end fine-tuning pipeline — data preparation, LoRA/QLoRA training, evaluation, model registration, and deployment on Azure AI.

## Fine-Tuning Pipeline (What the Model Gets Wrong)

### Data Preparation Format
```python
# WRONG — raw text without instruction format
training_data = [{"text": "What is RAG? RAG is retrieval-augmented generation."}]

# CORRECT — instruction-following format (chat completions)
training_data = [
    {"messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is RAG?"},
        {"role": "assistant", "content": "RAG (Retrieval-Augmented Generation) is a pattern that combines document retrieval with LLM generation to produce grounded, factual answers."}
    ]}
]
# Save as JSONL (one JSON object per line)
with open("train.jsonl", "w") as f:
    for item in training_data:
        f.write(json.dumps(item) + "\n")
```

### LoRA vs Full Fine-Tuning
| Approach | When to Use | GPU Memory | Training Time | Quality |
|----------|------------|-----------|---------------|---------|
| Full fine-tuning | Large dataset (>100K), significant behavior change | 80GB+ (A100) | Days | Highest |
| LoRA | Medium dataset (1K-100K), style/domain adaptation | 16-24GB (T4/A10) | Hours | Very good |
| QLoRA | Small dataset (<10K), limited GPU budget | 8-16GB | Hours | Good |
| Prompt tuning | <1K examples, quick iteration | Minimal | Minutes | Moderate |

### Azure OpenAI Fine-Tuning
```python
# Upload training file
file = client.files.create(file=open("train.jsonl", "rb"), purpose="fine-tune")

# Create fine-tuning job
job = client.fine_tuning.jobs.create(
    training_file=file.id,
    model="gpt-4o-mini-2024-07-18",  # Base model
    hyperparameters={
        "n_epochs": 3,               # 2-4 for most cases
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
    },
)
# Monitor: client.fine_tuning.jobs.retrieve(job.id)
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Raw text format | Model expects chat format | Use messages array with roles |
| No validation split | Can't detect overfitting | Split 80/10/10 (train/val/test) |
| Too many epochs (>5) | Overfitting — model memorizes, doesn't generalize | Start with 2-3, check val loss |
| No base model evaluation | Can't measure improvement | Eval base model first as baseline |
| Fine-tuning for knowledge | Knowledge injection is lossy | Use RAG for knowledge, fine-tune for style |
| No data deduplication | Duplicates bias the model | Deduplicate training data |
| Skipping data quality review | Garbage in = garbage out | Review 10% of data manually |
| No model versioning | Can't roll back | Register each fine-tuned model with version |

## Evaluation After Fine-Tuning
| Metric | Compare Against | Target |
|--------|----------------|--------|
| Task accuracy | Base model on same eval set | > base + 10% |
| Perplexity | Base model perplexity | Lower is better |
| Hallucination rate | Base model rate | <= base model |
| Latency | Base model inference time | < 2x base model |
| Token cost | Base model cost | Document trade-off |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | base_model, n_epochs, learning_rate, batch_size |
| `config/guardrails.json` | eval thresholds, max training cost |
| `config/model-comparison.json` | base vs fine-tuned performance matrix |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Prepare data, configure training job, deploy fine-tuned model |
| `@reviewer` | Audit data quality, check for overfitting, validate improvements |
| `@tuner` | Optimize hyperparameters, evaluate cost/quality trade-offs |

## Slash Commands
`/deploy` — Deploy fine-tuned model | `/test` — Run eval suite | `/review` — Audit training | `/evaluate` — Compare base vs fine-tuned
