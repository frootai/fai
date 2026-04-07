---
name: "deploy-99-enterprise-ai-governance-hub"
description: "Deploy Enterprise Ai Governance Hub."
---
# Deploy Enterprise Ai Governance Hub
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-enterprise-ai-governance-hub -f infra/main.bicep
## Step 3: Verify
