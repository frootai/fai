---
name: "deploy-77-research-paper-ai"
description: "Deploy Research Paper Ai."
---
# Deploy Research Paper Ai
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-research-paper-ai -f infra/main.bicep
## Step 3: Verify
