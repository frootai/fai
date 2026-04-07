---
name: "deploy-23-browser-automation-agent"
description: "Deploy Browser Automation Agent infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy Browser Automation Agent

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Container Apps, Playwright MCP access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-browser-automation-agent -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-browser-automation-agent -o table
```
