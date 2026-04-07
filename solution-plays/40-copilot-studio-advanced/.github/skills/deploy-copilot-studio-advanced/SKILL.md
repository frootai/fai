---
name: "deploy-40-copilot-studio-advanced"
description: "Deploy Copilot Studio Advanced to Azure."
---

# Deploy Copilot Studio Advanced

## Step 1: Prerequisites
- Azure CLI logged in
- Microsoft Copilot Studio, Azure OpenAI, Dataverse, Microsoft Graph, Power Platform access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-copilot-studio-advanced -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
