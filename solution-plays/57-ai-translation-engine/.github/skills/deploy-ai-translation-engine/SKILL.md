---
name: "deploy-57-ai-translation-engine"
description: "Deploy AI Translation Engine."
---
# Deploy AI Translation Engine
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-translation-engine -f infra/main.bicep
## Step 3: Verify
