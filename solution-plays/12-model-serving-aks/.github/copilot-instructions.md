---
description: "Model Serving on AKS domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Model Serving on AKS — Domain Knowledge

This workspace implements GPU-accelerated model serving on Azure Kubernetes Service — deploying LLMs, embedding models, and custom ML models at scale with autoscaling, health checks, and A/B testing.

## AKS Model Serving Architecture (What the Model Gets Wrong)

### GPU Node Pool Configuration
```bash
# WRONG — using CPU nodes for inference
az aks nodepool add --name inferencepool --node-vm-size Standard_D8s_v5

# CORRECT — GPU node pool with NVIDIA driver
az aks nodepool add \
  --name gpupool \
  --node-vm-size Standard_NC16as_T4_v3 \  # T4 GPU for inference
  --node-count 2 \
  --node-taints sku=gpu:NoSchedule \       # Only GPU workloads scheduled here
  --labels workload=inference
```

### Model Deployment with Triton/vLLM
```yaml
# Kubernetes deployment for vLLM inference server
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
spec:
  replicas: 2
  template:
    spec:
      nodeSelector:
        workload: inference
      tolerations:
        - key: sku
          value: gpu
          effect: NoSchedule
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          resources:
            limits:
              nvidia.com/gpu: 1    # Request 1 GPU per pod
          ports:
            - containerPort: 8000
          env:
            - name: MODEL
              value: "microsoft/phi-3-mini-4k-instruct"
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| CPU nodes for LLM inference | 10-100x slower than GPU | Use GPU node pools (T4/A100) |
| No GPU taints | CPU workloads scheduled on GPU nodes (waste) | Add `sku=gpu:NoSchedule` taint |
| No HPA (autoscaling) | Fixed replicas → over/under provisioned | HPA on GPU utilization or queue depth |
| No health checks | Failed pods serve errors | Liveness + readiness probes on /health |
| No model versioning | Can't roll back bad models | Use model registry + version labels |
| Cluster autoscaler disabled | GPU nodes idle or insufficient | Enable with min=1 max=5 |
| No spot instances for dev | Full-price GPUs in dev/test | Use spot VMs for non-prod |
| No resource quotas | Teams over-consume GPU | Set ResourceQuota per namespace |

## Evaluation Targets
| Metric | Target |
|--------|--------|
| Inference latency (p95) | < 500ms |
| GPU utilization | 60-80% |
| Throughput | > 100 req/s per GPU |
| Availability | >= 99.9% |
| Scale-up time | < 5 minutes |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model name, version, quantization |
| `config/guardrails.json` | latency SLA, error rate thresholds |
| `config/model-comparison.json` | GPU SKUs, cost per inference |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Set up AKS cluster, GPU node pools, model deployment, HPA |
| `@reviewer` | Audit resource limits, security, networking, health checks |
| `@tuner` | Optimize GPU utilization, spot instances, autoscaling thresholds |

## Slash Commands
`/deploy` — Deploy model to AKS | `/test` — Load test inference | `/review` — Audit cluster | `/evaluate` — Measure inference metrics
