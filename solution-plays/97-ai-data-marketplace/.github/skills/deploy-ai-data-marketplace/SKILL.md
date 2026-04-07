---
name: "deploy-97-ai-data-marketplace"
description: "Deploy Ai Data Marketplace."
---
# Deploy Ai Data Marketplace
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-data-marketplace -f infra/main.bicep
## Step 3: Verify
