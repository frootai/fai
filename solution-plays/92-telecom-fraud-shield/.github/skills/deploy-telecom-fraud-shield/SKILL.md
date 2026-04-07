---
name: "deploy-92-telecom-fraud-shield"
description: "Deploy Telecom Fraud Shield."
---
# Deploy Telecom Fraud Shield
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-telecom-fraud-shield -f infra/main.bicep
## Step 3: Verify
