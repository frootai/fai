---
name: "deploy-94-ai-podcast-generator"
description: "Deploy Ai Podcast Generator."
---
# Deploy Ai Podcast Generator
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-podcast-generator -f infra/main.bicep
## Step 3: Verify
