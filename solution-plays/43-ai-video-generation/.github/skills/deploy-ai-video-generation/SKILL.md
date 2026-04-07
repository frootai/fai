---
name: "deploy-43-ai-video-generation"
description: "Deploy AI Video Generation Pipeline."
---
# Deploy AI Video Generation Pipeline
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-video-generation -f infra/main.bicep
## Step 3: Verify
Check results.
