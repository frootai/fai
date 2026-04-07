---
name: "deploy-36-multimodal-agent"
description: "Deploy Multimodal Agent to Azure."
---

# Deploy Multimodal Agent

## Step 1: Prerequisites
- Azure CLI logged in
- Azure OpenAI (GPT-4o Vision), Azure AI Vision, Azure Blob Storage, Azure Container Apps access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-multimodal-agent -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
