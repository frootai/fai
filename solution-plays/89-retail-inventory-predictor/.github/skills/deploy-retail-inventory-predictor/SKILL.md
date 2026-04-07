---
name: "deploy-89-retail-inventory-predictor"
description: "Deploy Retail Inventory Predictor."
---
# Deploy Retail Inventory Predictor
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-retail-inventory-predictor -f infra/main.bicep
## Step 3: Verify
