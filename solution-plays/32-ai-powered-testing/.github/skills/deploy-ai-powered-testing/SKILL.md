---
name: "deploy-32-ai-powered-testing"
description: "Deploy AI-Powered Testing to Azure."
---

# Deploy AI-Powered Testing

## Step 1: Prerequisites
- Azure CLI logged in
- Azure OpenAI, GitHub Actions, Azure Container Apps, Azure Monitor access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-ai-powered-testing -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
