---
name: "deploy-67-ai-knowledge-management"
description: "Deploy AI Knowledge Management."
---
# Deploy AI Knowledge Management
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-knowledge-management -f infra/main.bicep
## Step 3: Verify
