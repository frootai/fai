---
name: "deploy-80-biodiversity-monitor"
description: "Deploy Biodiversity Monitor."
---
# Deploy Biodiversity Monitor
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-biodiversity-monitor -f infra/main.bicep
## Step 3: Verify
