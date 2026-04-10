---
description: "Edge AI Deployment domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Edge AI Deployment — Domain Knowledge

This workspace implements edge AI deployment — containerized model serving on IoT/edge devices, model optimization (quantization, pruning), OTA updates, offline inference, and fleet management.

## Edge Deployment Architecture (What the Model Gets Wrong)

### Containerized Edge Inference
```yaml
# Docker container for edge device (ARM64 or x86)
FROM mcr.microsoft.com/onnxruntime:latest
COPY model/ /app/model/
COPY inference.py /app/
EXPOSE 8080
CMD ["python", "/app/inference.py"]

# Deploy via IoT Edge module
# azure-iot-edge-module.json:
{
  "moduleName": "ai-inference",
  "image": "myregistry.azurecr.io/ai-inference:v1.2.0",
  "createOptions": { "HostConfig": { "Binds": ["/data:/data"] } },
  "env": { "MODEL_PATH": "/app/model/phi-3-mini-q4.onnx" }
}
```

### Model Optimization for Edge
| Technique | Size Reduction | Quality Impact | When to Use |
|-----------|---------------|----------------|-------------|
| FP16 quantization | 50% | <1% loss | GPU edge devices |
| INT8 quantization | 75% | 2-3% loss | CPU edge devices |
| INT4 quantization | 87% | 5-8% loss | Severely constrained devices |
| Pruning | 30-60% | Varies | After quantization |
| Knowledge distillation | Model-dependent | Teacher→student | Train smaller model from larger |
| ONNX conversion | Variable | None | Cross-platform compatibility |

### OTA Model Updates via IoT Hub
```python
# Fleet-wide model update with rollback capability
async def deploy_model_update(fleet: str, model_version: str):
    # 1. Deploy to canary group first (5% of devices)
    await iot_hub.update_twin(fleet, "canary", {"model_version": model_version})
    
    # 2. Monitor canary for 1 hour
    metrics = await monitor_canary(fleet, duration_hours=1)
    if metrics.error_rate > 0.05:
        await rollback(fleet, "canary")
        raise DeploymentError("Canary failed — rolling back")
    
    # 3. Progressive rollout: 25% → 50% → 100%
    for pct in [25, 50, 100]:
        await iot_hub.update_twin(fleet, f"ring-{pct}", {"model_version": model_version})
        await asyncio.sleep(3600)  # Wait 1 hour between rings
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Cloud-only inference | Fails offline, high latency | Local inference with ONNX Runtime |
| No model versioning on device | Can't roll back bad updates | Version tracking in IoT Hub twin |
| Big-bang deployment | All devices fail at once | Canary → progressive rollout (5% → 25% → 100%) |
| No offline fallback | Device useless without cloud | Cache last-good model + responses |
| x86 container on ARM device | Architecture mismatch, won't run | Multi-arch builds (buildx) |
| No device telemetry | Blind to edge performance | IoT Hub D2C messages: latency, accuracy, errors |
| Full model on constrained device | OOM crash | Quantize to INT4/INT8, measure memory first |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model path, quantization level, inference settings |
| `config/guardrails.json` | Memory limits, latency SLA, rollback thresholds |
| `config/agents.json` | Fleet groups, rollout rings, update schedule |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Package models, build containers, configure IoT Edge deployment |
| `@reviewer` | Audit model size, memory usage, rollback capability, offline mode |
| `@tuner` | Optimize quantization, container size, rollout strategy |

## Slash Commands
`/deploy` — Deploy to edge fleet | `/test` — Test on single device | `/review` — Audit deployment | `/evaluate` — Measure edge metrics
