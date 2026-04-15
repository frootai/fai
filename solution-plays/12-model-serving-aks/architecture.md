# Architecture — Play 12: Model Serving on AKS

## Overview

GPU-accelerated model serving platform on Azure Kubernetes Service. Self-hosted open-source and fine-tuned LLMs are deployed as containerized inference endpoints using vLLM or TGI, with KEDA-based autoscaling driven by GPU utilization and request queue depth. Azure OpenAI provides managed fallback for overflow traffic.

## Architecture Diagram

```mermaid
graph TB
    subgraph Client Layer
        Client[Client Applications<br/>REST / gRPC / OpenAI-compatible]
    end

    subgraph Ingress
        LB[Load Balancer<br/>Health Probes · Round Robin]
        Ingress[NGINX Ingress<br/>TLS Termination · Rate Limiting]
    end

    subgraph AKS Cluster
        subgraph GPU Node Pool
            vLLM1[vLLM Pod 1<br/>Llama 3 · A100 GPU]
            vLLM2[vLLM Pod 2<br/>Mistral · A100 GPU]
        end
        subgraph System Node Pool
            KEDA[KEDA Autoscaler<br/>GPU % · Queue Depth]
            Prometheus[Prometheus<br/>GPU Metrics · Latency]
        end
    end

    subgraph Supporting Services
        ACR[Container Registry<br/>Model Images · Artifacts]
        Blob[Blob Storage<br/>Model Weights · Checkpoints]
        OpenAI[Azure OpenAI<br/>Overflow Fallback]
    end

    subgraph Security
        KV[Key Vault<br/>API Keys · TLS Certs]
        VNet[Virtual Network<br/>Private Endpoints]
    end

    subgraph Monitoring
        Monitor[Azure Monitor<br/>GPU Utilization · Throughput]
    end

    Client -->|HTTPS| LB
    LB --> Ingress
    Ingress --> vLLM1
    Ingress --> vLLM2
    KEDA -->|Scale| vLLM1
    KEDA -->|Scale| vLLM2
    Prometheus -->|Metrics| KEDA
    ACR -->|Pull Images| vLLM1
    ACR -->|Pull Images| vLLM2
    Blob -->|Load Weights| vLLM1
    Blob -->|Load Weights| vLLM2
    Ingress -->|Overflow| OpenAI
    vLLM1 -->|Auth| KV
    vLLM2 -->|Auth| KV
    Prometheus -->|Telemetry| Monitor

    style Client fill:#3b82f6,color:#fff,stroke:#2563eb
    style LB fill:#3b82f6,color:#fff,stroke:#2563eb
    style Ingress fill:#3b82f6,color:#fff,stroke:#2563eb
    style vLLM1 fill:#10b981,color:#fff,stroke:#059669
    style vLLM2 fill:#10b981,color:#fff,stroke:#059669
    style KEDA fill:#06b6d4,color:#fff,stroke:#0891b2
    style Prometheus fill:#0ea5e9,color:#fff,stroke:#0284c7
    style ACR fill:#3b82f6,color:#fff,stroke:#2563eb
    style Blob fill:#f59e0b,color:#fff,stroke:#d97706
    style OpenAI fill:#10b981,color:#fff,stroke:#059669
    style KV fill:#7c3aed,color:#fff,stroke:#6d28d9
    style VNet fill:#7c3aed,color:#fff,stroke:#6d28d9
    style Monitor fill:#0ea5e9,color:#fff,stroke:#0284c7
```

## Data Flow

1. **Image Build**: Model serving container (vLLM/TGI + model config) built and pushed to Azure Container Registry → Model weights stored in Blob Storage as SafeTensors/GGUF artifacts
2. **Deployment**: Kubernetes deployment pulls container image from ACR → Init container downloads model weights from Blob → GPU node allocates VRAM and loads model for inference
3. **Inference**: Client sends prompt via OpenAI-compatible API → NGINX Ingress routes to available GPU pod → vLLM serves request using PagedAttention for efficient batching → Streaming response returned
4. **Scaling**: Prometheus scrapes GPU utilization and request queue depth → KEDA evaluates scaling rules → Horizontal Pod Autoscaler adds/removes GPU pods based on demand
5. **Overflow**: When GPU capacity is saturated, Ingress routes overflow to Azure OpenAI managed endpoint → Seamless failover with compatible API format
6. **Monitoring**: GPU metrics (VRAM usage, compute %, latency P99) pushed to Azure Monitor → Dashboards and alerts for capacity planning

## Service Roles

| Service | Layer | Role |
|---------|-------|------|
| AKS (GPU Node Pool) | Compute | GPU inference hosting, vLLM/TGI containers |
| AKS (System Pool) | Compute | KEDA, Prometheus, ingress controllers |
| Container Registry | Compute | Private Docker image and model artifact storage |
| Azure OpenAI | AI | Managed fallback for overflow traffic |
| Blob Storage | Data | Model weights, checkpoints, fine-tuned artifacts |
| Key Vault | Security | API keys, TLS certificates, registry credentials |
| Virtual Network | Security | Private endpoints, subnet isolation |
| Azure Monitor | Monitoring | GPU utilization, inference latency, throughput metrics |

## Security Architecture

- **Private AKS Cluster**: API server accessible only via private endpoint within VNet
- **Managed Identity**: Workload identity for pod-level access to ACR, Blob, Key Vault
- **Network Policies**: Calico policies restrict pod-to-pod traffic to inference paths only
- **Private Endpoints**: ACR and Blob Storage accessible only within VNet
- **TLS Everywhere**: Ingress terminates TLS, internal traffic encrypted via mTLS (Istio optional)
- **RBAC**: Kubernetes RBAC + Azure RBAC for least-privilege access

## Scaling

| Metric | Dev | Production | Enterprise |
|--------|-----|-----------|------------|
| GPU nodes | 1 (T4) | 2-4 (A100) | 4-16 (A100/H100) |
| Models served | 1 | 2-3 | 5-10 |
| Requests/second | 5 | 50-100 | 500+ |
| GPU utilization target | 50% | 70-80% | 75-85% |
| VRAM per node | 16GB | 80GB | 80-640GB |
| Autoscale latency | N/A | 3-5 min (pod) | 1-2 min (pre-warmed) |
