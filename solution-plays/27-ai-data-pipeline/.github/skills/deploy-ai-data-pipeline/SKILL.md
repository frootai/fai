---
name: "deploy-27-ai-data-pipeline"
description: "Deploy AI Data Pipeline infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy AI Data Pipeline

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Data Factory, Azure Blob Storage, Azure Cosmos DB, Azure Event Hubs access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-ai-data-pipeline -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-ai-data-pipeline -o table
```
