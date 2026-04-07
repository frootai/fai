---
name: "deploy-86-public-safety-analytics"
description: "Deploy Public Safety Analytics."
---
# Deploy Public Safety Analytics
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-public-safety-analytics -f infra/main.bicep
## Step 3: Verify
