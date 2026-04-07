---
name: "deploy-85-policy-impact-analyzer"
description: "Deploy Policy Impact Analyzer."
---
# Deploy Policy Impact Analyzer
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-policy-impact-analyzer -f infra/main.bicep
## Step 3: Verify
