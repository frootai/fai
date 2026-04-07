---
name: "deploy-55-supply-chain-ai"
description: "Deploy Supply Chain AI."
---
# Deploy Supply Chain AI
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-supply-chain-ai -f infra/main.bicep
## Step 3: Verify
