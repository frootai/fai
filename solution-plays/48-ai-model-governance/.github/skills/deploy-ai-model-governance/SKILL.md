---
name: "deploy-48-ai-model-governance"
description: "Deploy AI Model Governance & Registry."
---
# Deploy AI Model Governance & Registry
## Step 1: Prerequisites
- Azure CLI, Azure Machine Learning access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-model-governance -f infra/main.bicep
## Step 3: Verify
Check results.
