---
name: "deploy-30-ai-security-hardening"
description: "Deploy AI Security Hardening infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check."
---

# Deploy AI Security Hardening

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure AI Content Safety, Azure OpenAI, Azure Container Apps, Azure Key Vault, Azure Monitor access

## Step 2: Validate Bicep
```bash
az bicep build -f infra/main.bicep
```

## Step 3: Execute
```bash
az deployment group create -g rg-frootai-ai-security-hardening -f infra/main.bicep -p infra/parameters.json
```

## Step 4: Verify
```bash
az resource list -g rg-frootai-ai-security-hardening -o table
```
