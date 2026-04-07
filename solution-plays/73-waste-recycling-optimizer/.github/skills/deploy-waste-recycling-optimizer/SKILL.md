---
name: "deploy-73-waste-recycling-optimizer"
description: "Deploy Waste Recycling Optimizer."
---
# Deploy Waste Recycling Optimizer
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-waste-recycling-optimizer -f infra/main.bicep
## Step 3: Verify
