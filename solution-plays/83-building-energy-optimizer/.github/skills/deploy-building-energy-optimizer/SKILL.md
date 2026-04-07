---
name: "deploy-83-building-energy-optimizer"
description: "Deploy Building Energy Optimizer."
---
# Deploy Building Energy Optimizer
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-building-energy-optimizer -f infra/main.bicep
## Step 3: Verify
