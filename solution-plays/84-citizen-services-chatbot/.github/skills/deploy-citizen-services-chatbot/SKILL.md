---
name: "deploy-84-citizen-services-chatbot"
description: "Deploy Citizen Services Chatbot."
---
# Deploy Citizen Services Chatbot
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-citizen-services-chatbot -f infra/main.bicep
## Step 3: Verify
