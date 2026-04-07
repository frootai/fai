---
name: "deploy-29-mcp-gateway"
description: "Deploy MCP Gateway infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy MCP Gateway

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure API Management, Azure Container Apps, Azure Monitor, Azure Key Vault access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-mcp-gateway -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-mcp-gateway -o table
```
