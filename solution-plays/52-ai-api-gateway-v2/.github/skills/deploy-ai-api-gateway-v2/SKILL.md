---
name: "deploy-52-ai-api-gateway-v2"
description: "Deploy AI API Gateway v2."
---
# Deploy AI API Gateway v2
## Step 1: Prerequisites
- Azure CLI, Azure API Management access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-api-gateway-v2 -f infra/main.bicep
## Step 3: Verify
