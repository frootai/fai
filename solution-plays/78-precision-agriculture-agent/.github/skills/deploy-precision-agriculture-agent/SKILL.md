---
name: "deploy-78-precision-agriculture-agent"
description: "Deploy Precision Agriculture Agent."
---
# Deploy Precision Agriculture Agent
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-precision-agriculture-agent -f infra/main.bicep
## Step 3: Verify
