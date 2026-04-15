# Architecture — Play 13: Fine-Tuning Workflow

## Overview

End-to-end fine-tuning pipeline for customizing Azure OpenAI models with domain-specific data. The workflow covers data preparation (JSONL formatting, validation, deduplication), supervised fine-tuning with hyperparameter tuning, automated evaluation against baseline, and production deployment with A/B testing. Azure Machine Learning provides experiment tracking and model registry.

## Architecture Diagram

```mermaid
graph TB
    subgraph Data Preparation
        Raw[Raw Data Sources<br/>Logs · Feedback · Documents]
        Prep[Data Pipeline<br/>JSONL Format · Validation · Dedup]
        Blob[Blob Storage<br/>Training · Validation · Test Sets]
    end

    subgraph Training
        FT[Azure OpenAI Fine-Tuning<br/>GPT-4o / GPT-4o-mini]
        AML[Azure ML Workspace<br/>Experiment Tracking · Hyperparams]
    end

    subgraph Evaluation
        Eval[AI Foundry Evaluation<br/>Groundedness · Relevance · Coherence]
        Baseline[Baseline Comparison<br/>Base vs Fine-tuned A/B]
    end

    subgraph Deployment
        Deploy[Fine-Tuned Deployment<br/>Azure OpenAI Endpoint]
        Gateway[API Gateway<br/>A/B Traffic Split]
        App[Application Layer<br/>Production Consumers]
    end

    subgraph Security
        KV[Key Vault<br/>API Keys · Credentials]
        MI[Managed Identity<br/>Zero-secret Auth]
    end

    subgraph Monitoring
        AppInsights[Application Insights<br/>Accuracy Drift · Latency · Tokens]
    end

    Raw -->|Extract| Prep
    Prep -->|Upload| Blob
    Blob -->|Training Data| FT
    FT -->|Metrics| AML
    FT -->|Checkpoints| Blob
    FT -->|Fine-tuned Model| Eval
    Eval -->|Score| Baseline
    Baseline -->|Approved| Deploy
    Deploy --> Gateway
    Gateway -->|Route| App
    Deploy -->|Auth| MI
    MI -->|Secrets| KV
    Deploy -->|Telemetry| AppInsights

    style Raw fill:#f59e0b,color:#fff,stroke:#d97706
    style Prep fill:#3b82f6,color:#fff,stroke:#2563eb
    style Blob fill:#f59e0b,color:#fff,stroke:#d97706
    style FT fill:#10b981,color:#fff,stroke:#059669
    style AML fill:#10b981,color:#fff,stroke:#059669
    style Eval fill:#10b981,color:#fff,stroke:#059669
    style Baseline fill:#10b981,color:#fff,stroke:#059669
    style Deploy fill:#3b82f6,color:#fff,stroke:#2563eb
    style Gateway fill:#3b82f6,color:#fff,stroke:#2563eb
    style App fill:#3b82f6,color:#fff,stroke:#2563eb
    style KV fill:#7c3aed,color:#fff,stroke:#6d28d9
    style MI fill:#7c3aed,color:#fff,stroke:#6d28d9
    style AppInsights fill:#0ea5e9,color:#fff,stroke:#0284c7
```

## Data Flow

1. **Data Collection**: Raw interaction logs, user feedback, and domain documents collected from production systems → Cleaned and formatted into JSONL (system/user/assistant message triplets)
2. **Validation**: Data pipeline validates format, removes duplicates, splits into train/validation/test sets (80/10/10) → Uploaded to Blob Storage with versioning
3. **Fine-Tuning**: Azure OpenAI fine-tuning job launched with training data → Hyperparameters (epochs, learning rate, batch size) tracked in Azure ML → Checkpoints saved to Blob
4. **Evaluation**: Fine-tuned model evaluated against test set using AI Foundry → Metrics: groundedness ≥ 4.0, relevance ≥ 4.0, coherence ≥ 4.5 → Compared against base model baseline
5. **Deployment**: If evaluation passes thresholds, model deployed to Azure OpenAI endpoint → API Gateway splits traffic (90% base / 10% fine-tuned) for A/B validation
6. **Monitoring**: Production metrics tracked in Application Insights → Accuracy drift detection triggers retraining alerts → Token usage and latency monitored per deployment

## Service Roles

| Service | Layer | Role |
|---------|-------|------|
| Azure OpenAI Fine-Tuning | AI | Supervised fine-tuning with custom JSONL datasets |
| Azure OpenAI Inference | AI | Hosting fine-tuned model deployments |
| Azure Machine Learning | AI | Experiment tracking, model registry, versioning |
| Azure AI Foundry | AI | Evaluation pipelines — quality scoring |
| Blob Storage | Data | Training data, checkpoints, evaluation results |
| Key Vault | Security | API keys, storage credentials |
| Managed Identity | Security | Service-to-service authentication |
| Application Insights | Monitoring | Accuracy drift, latency, token usage tracking |

## Security Architecture

- **Managed Identity**: All services authenticate via workload identity — no API keys in code
- **Data Isolation**: Training data stored in dedicated containers with SAS token access policies
- **Key Vault**: Fine-tuning API keys and endpoint secrets rotated automatically
- **RBAC**: Data scientists get ML Workspace Contributor; production gets Reader only
- **PII Handling**: Training data scanned for PII before fine-tuning — masked or removed
- **Audit Logging**: All fine-tuning jobs and model deployments logged for compliance

## Scaling

| Metric | Dev | Production | Enterprise |
|--------|-----|-----------|------------|
| Training data size | 500 examples | 5K-50K examples | 100K+ examples |
| Training frequency | Manual, ad-hoc | Monthly | Weekly / continuous |
| Concurrent fine-tune jobs | 1 | 2-3 | 5-10 |
| Evaluation runs per model | 1 | 3 (multi-metric) | 5+ (multi-metric + bias) |
| Active model deployments | 1 | 2-3 | 5-10 |
| Inference tokens/day | 50K | 500K | 5M+ |
