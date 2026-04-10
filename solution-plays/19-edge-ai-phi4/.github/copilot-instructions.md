---
description: "Edge AI with Phi-4 domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Edge AI with Phi-4 — Domain Knowledge

This workspace implements on-device AI inference using Microsoft Phi-4 small language models — ONNX Runtime, quantization, IoT Hub sync, and offline-capable edge deployments.

## Edge AI Architecture (What the Model Gets Wrong)

### ONNX Runtime for On-Device Inference
```python
# WRONG — calling cloud API from edge device (requires connectivity)
response = openai_client.chat.completions.create(model="gpt-4o", ...)

# CORRECT — local ONNX inference (works offline)
import onnxruntime_genai as og

model = og.Model("models/phi-4-mini-onnx")
tokenizer = og.Tokenizer(model)
params = og.GeneratorParams(model)
params.set_search_options(max_length=2048, temperature=0.0)

tokens = tokenizer.encode("What is the sensor reading threshold?")
generator = og.Generator(model, params)
generator.append_tokens(tokens)
while not generator.is_done():
    generator.generate_next_token()
output = tokenizer.decode(generator.get_sequence(0))
```

### Model Quantization for Edge
| Quantization | Model Size | Latency | Quality | Device |
|-------------|------------|---------|---------|--------|
| FP32 | 7.6 GB | Baseline | Best | GPU server |
| FP16 | 3.8 GB | -30% | ~Same | GPU edge |
| INT8 | 1.9 GB | -50% | -2% quality | CPU edge |
| INT4 | 0.95 GB | -60% | -5% quality | IoT/mobile |

### IoT Hub Model Sync
```python
# Cloud pushes model updates to edge via IoT Hub
from azure.iot.device import IoTHubDeviceClient

client = IoTHubDeviceClient.create_from_connection_string(conn_str)

def on_model_update(twin):
    new_version = twin["desired"]["model_version"]
    if new_version != current_version:
        download_model(new_version)  # Pull from Blob Storage
        reload_model()               # Hot-swap ONNX model
        report_status(new_version)   # Report back to IoT Hub
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Cloud API on edge | Fails offline, high latency | ONNX Runtime local inference |
| FP32 model on IoT device | Too large, too slow | Quantize to INT4/INT8 |
| No model versioning on edge | Can't roll back bad updates | IoT Hub twin + version tracking |
| No offline fallback | Device useless without cloud | Cache responses + local model |
| Ignoring device memory limits | OOM crash | Profile memory before deploying |
| No telemetry from edge | Blind to edge quality | IoT Hub D2C messages with metrics |
| Same prompt as cloud model | Edge model is smaller, needs different prompt | Optimize prompts for small model capabilities |
| No warm-up | First inference slow (model loading) | Pre-load model on device boot |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | model_path, quantization_level, max_tokens |
| `config/guardrails.json` | memory limits, latency SLA, quality thresholds |
| `config/agents.json` | sync frequency, update policy, fallback rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Set up ONNX Runtime, quantize model, configure IoT Hub sync |
| `@reviewer` | Audit model size, memory usage, offline capability, security |
| `@tuner` | Optimize quantization level, inference speed, prompt engineering for small models |

## Slash Commands
`/deploy` — Deploy to edge device | `/test` — Test local inference | `/review` — Audit edge config | `/evaluate` — Benchmark latency + quality
