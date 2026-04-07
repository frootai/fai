---
name: "deploy-70-esg-compliance-agent"
description: "Deploy Esg Compliance Agent."
---
# Deploy Esg Compliance Agent
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-esg-compliance-agent -f infra/main.bicep
## Step 3: Verify
