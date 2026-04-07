---
name: "deploy-39-ai-meeting-assistant"
description: "Deploy AI Meeting Assistant to Azure."
---

# Deploy AI Meeting Assistant

## Step 1: Prerequisites
- Azure CLI logged in
- Azure AI Speech, Azure OpenAI, Microsoft Graph, Azure Container Apps access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-ai-meeting-assistant -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
