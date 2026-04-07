---
name: "deploy-49-creative-ai-studio"
description: "Deploy Creative AI Multi-Modal Content Studio."
---
# Deploy Creative AI Multi-Modal Content Studio
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-creative-ai-studio -f infra/main.bicep
## Step 3: Verify
Check results.
