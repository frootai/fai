---
name: "deploy-61-content-moderation-v2"
description: "Deploy Content Moderation v2."
---
# Deploy Content Moderation v2
## Step 1: Prerequisites
- Azure CLI, Azure AI Content Safety access
## Step 2: Execute
az deployment group create -g rg-frootai-content-moderation-v2 -f infra/main.bicep
## Step 3: Verify
