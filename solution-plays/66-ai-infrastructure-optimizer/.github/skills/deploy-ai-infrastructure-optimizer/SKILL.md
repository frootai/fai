---
name: "deploy-66-ai-infrastructure-optimizer"
description: "Deploy AI Infrastructure Optimizer."
---
# Deploy AI Infrastructure Optimizer
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-infrastructure-optimizer -f infra/main.bicep
## Step 3: Verify
