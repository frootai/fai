---
name: "deploy-44-foundry-local-on-device"
description: "Deploy Foundry Local On-Device AI."
---
# Deploy Foundry Local On-Device AI
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-foundry-local-on-device -f infra/main.bicep
## Step 3: Verify
Check results.
