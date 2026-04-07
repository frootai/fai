---
name: "deploy-22-multi-agent-swarm"
description: "Deploy Multi-Agent Swarm infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy Multi-Agent Swarm

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Container Apps, Azure Service Bus, Azure Cosmos DB access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-multi-agent-swarm -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-multi-agent-swarm -o table
```
