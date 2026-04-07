---
name: "deploy-54-ai-customer-support-v2"
description: "Deploy AI Customer Support v2."
---
# Deploy AI Customer Support v2
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-customer-support-v2 -f infra/main.bicep
## Step 3: Verify
