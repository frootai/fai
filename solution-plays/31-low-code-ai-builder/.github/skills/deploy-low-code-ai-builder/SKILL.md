---
name: "deploy-31-low-code-ai-builder"
description: "Deploy Low-Code AI Builder to Azure."
---

# Deploy Low-Code AI Builder

## Step 1: Prerequisites
- Azure CLI logged in
- Azure OpenAI, Azure Container Apps, Azure Cosmos DB, Azure Static Web Apps access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-low-code-ai-builder -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
