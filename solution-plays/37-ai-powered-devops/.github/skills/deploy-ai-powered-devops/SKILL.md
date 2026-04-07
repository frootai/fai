---
name: "deploy-37-ai-powered-devops"
description: "Deploy AI-Powered DevOps to Azure."
---

# Deploy AI-Powered DevOps

## Step 1: Prerequisites
- Azure CLI logged in
- Azure OpenAI, Azure Monitor, Azure DevOps, GitHub Actions, Azure Container Apps access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-ai-powered-devops -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
