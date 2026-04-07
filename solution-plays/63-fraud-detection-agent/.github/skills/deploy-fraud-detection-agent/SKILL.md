---
name: "deploy-63-fraud-detection-agent"
description: "Deploy Fraud Detection Agent."
---
# Deploy Fraud Detection Agent
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-fraud-detection-agent -f infra/main.bicep
## Step 3: Verify
