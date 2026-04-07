---
name: "deploy-74-ai-tutoring-agent"
description: "Deploy Ai Tutoring Agent."
---
# Deploy Ai Tutoring Agent
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-tutoring-agent -f infra/main.bicep
## Step 3: Verify
