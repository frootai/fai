---
name: "deploy-47-synthetic-data-factory"
description: "Deploy Synthetic Data Generation Factory."
---
# Deploy Synthetic Data Generation Factory
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-synthetic-data-factory -f infra/main.bicep
## Step 3: Verify
Check results.
