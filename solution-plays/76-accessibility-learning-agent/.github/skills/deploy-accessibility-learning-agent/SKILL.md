---
name: "deploy-76-accessibility-learning-agent"
description: "Deploy Accessibility Learning Agent."
---
# Deploy Accessibility Learning Agent
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-accessibility-learning-agent -f infra/main.bicep
## Step 3: Verify
