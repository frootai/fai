---
name: "deploy-24-ai-code-review-pipeline"
description: "Deploy AI Code Review Pipeline infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy AI Code Review Pipeline

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, GitHub Actions, CodeQL, Azure DevOps access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-ai-code-review-pipeline -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-ai-code-review-pipeline -o table
```
