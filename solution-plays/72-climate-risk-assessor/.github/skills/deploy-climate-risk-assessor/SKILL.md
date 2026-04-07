---
name: "deploy-72-climate-risk-assessor"
description: "Deploy Climate Risk Assessor."
---
# Deploy Climate Risk Assessor
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-climate-risk-assessor -f infra/main.bicep
## Step 3: Verify
