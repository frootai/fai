---
name: "deploy-64-ai-sales-assistant"
description: "Deploy AI Sales Assistant."
---
# Deploy AI Sales Assistant
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-sales-assistant -f infra/main.bicep
## Step 3: Verify
