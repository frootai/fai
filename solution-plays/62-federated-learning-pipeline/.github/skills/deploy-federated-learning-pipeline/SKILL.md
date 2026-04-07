---
name: "deploy-62-federated-learning-pipeline"
description: "Deploy Federated Learning Pipeline."
---
# Deploy Federated Learning Pipeline
## Step 1: Prerequisites
- Azure CLI, Azure Machine Learning access
## Step 2: Execute
az deployment group create -g rg-frootai-federated-learning-pipeline -f infra/main.bicep
## Step 3: Verify
