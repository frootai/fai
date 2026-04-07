---
name: "deploy-56-semantic-code-search"
description: "Deploy Semantic Code Search."
---
# Deploy Semantic Code Search
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-semantic-code-search -f infra/main.bicep
## Step 3: Verify
