---
name: "deploy-38-document-understanding-v2"
description: "Deploy Document Understanding v2 to Azure."
---

# Deploy Document Understanding v2

## Step 1: Prerequisites
- Azure CLI logged in
- Azure AI Document Intelligence, Azure OpenAI, Azure Blob Storage, Azure Cosmos DB access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-document-understanding-v2 -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
