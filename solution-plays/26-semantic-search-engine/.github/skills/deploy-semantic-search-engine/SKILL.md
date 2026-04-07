---
name: "deploy-26-semantic-search-engine"
description: "Deploy Semantic Search Engine infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy Semantic Search Engine

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure AI Search, Azure OpenAI, Azure Blob Storage, Azure Container Apps access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-semantic-search-engine -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-semantic-search-engine -o table
```
