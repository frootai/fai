---
name: "deploy-53-legal-document-ai"
description: "Deploy Legal Document AI."
---
# Deploy Legal Document AI
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-legal-document-ai -f infra/main.bicep
## Step 3: Verify
