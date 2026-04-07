---
name: "deploy-50-financial-risk-intelligence"
description: "Deploy Financial Risk Intelligence Agent."
---
# Deploy Financial Risk Intelligence Agent
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-financial-risk-intelligence -f infra/main.bicep
## Step 3: Verify
Check results.
