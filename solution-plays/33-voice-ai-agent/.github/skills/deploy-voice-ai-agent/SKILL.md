---
name: "deploy-33-voice-ai-agent"
description: "Deploy Voice AI Agent to Azure."
---

# Deploy Voice AI Agent

## Step 1: Prerequisites
- Azure CLI logged in
- Azure AI Speech, Azure OpenAI, Azure Communication Services, Azure Container Apps access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-voice-ai-agent -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
