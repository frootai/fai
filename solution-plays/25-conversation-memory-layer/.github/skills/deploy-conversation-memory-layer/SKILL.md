---
name: "deploy-25-conversation-memory-layer"
description: "Deploy Conversation Memory Layer infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy Conversation Memory Layer

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Cosmos DB, Azure AI Search, Azure Redis Cache access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-conversation-memory-layer -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-conversation-memory-layer -o table
```
