---
name: "deploy-100-fai-meta-agent"
description: "Deploy Fai Meta Agent."
---
# Deploy Fai Meta Agent
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-fai-meta-agent -f infra/main.bicep
## Step 3: Verify
