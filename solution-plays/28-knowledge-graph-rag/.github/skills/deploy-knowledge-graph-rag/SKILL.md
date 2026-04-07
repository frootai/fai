---
name: "deploy-28-knowledge-graph-rag"
description: "Deploy Knowledge Graph RAG infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy Knowledge Graph RAG

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Cosmos DB (Gremlin), Azure AI Search, Azure Container Apps access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-knowledge-graph-rag -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-knowledge-graph-rag -o table
```
