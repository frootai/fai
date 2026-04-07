---
name: "deploy-93-continual-learning-agent"
description: "Deploy Continual Learning Agent."
---
# Deploy Continual Learning Agent
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-continual-learning-agent -f infra/main.bicep
## Step 3: Verify
