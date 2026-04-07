---
name: "deploy-35-ai-compliance-engine"
description: "Deploy AI Compliance Engine to Azure."
---

# Deploy AI Compliance Engine

## Step 1: Prerequisites
- Azure CLI logged in
- Azure OpenAI, Azure Policy, Azure Key Vault, Azure Monitor, Azure Cosmos DB access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-ai-compliance-engine -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
