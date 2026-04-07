---
name: "deploy-46-healthcare-clinical-ai"
description: "Deploy Healthcare Clinical AI Agent."
---
# Deploy Healthcare Clinical AI Agent
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-healthcare-clinical-ai -f infra/main.bicep
## Step 3: Verify
Check results.
