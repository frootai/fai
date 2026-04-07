---
name: "deploy-91-customer-churn-predictor"
description: "Deploy Customer Churn Predictor."
---
# Deploy Customer Churn Predictor
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-customer-churn-predictor -f infra/main.bicep
## Step 3: Verify
