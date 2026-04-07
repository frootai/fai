---
name: "deploy-21-agentic-rag"
description: "Deploy Agentic RAG infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy Agentic RAG

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure AI Search, Azure Container Apps, Azure Key Vault access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-agentic-rag -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-agentic-rag -o table
```
