---
name: "deploy-65-ai-training-curriculum"
description: "Deploy AI Training Curriculum."
---
# Deploy AI Training Curriculum
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-training-curriculum -f infra/main.bicep
## Step 3: Verify
