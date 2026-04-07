---
name: "deploy-79-food-safety-inspector-ai"
description: "Deploy Food Safety Inspector Ai."
---
# Deploy Food Safety Inspector Ai
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-food-safety-inspector-ai -f infra/main.bicep
## Step 3: Verify
