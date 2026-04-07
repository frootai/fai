---
name: "deploy-60-responsible-ai-dashboard"
description: "Deploy Responsible AI Dashboard."
---
# Deploy Responsible AI Dashboard
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-responsible-ai-dashboard -f infra/main.bicep
## Step 3: Verify
