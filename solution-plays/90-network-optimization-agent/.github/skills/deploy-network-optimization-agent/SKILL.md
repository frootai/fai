---
name: "deploy-90-network-optimization-agent"
description: "Deploy Network Optimization Agent."
---
# Deploy Network Optimization Agent
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-network-optimization-agent -f infra/main.bicep
## Step 3: Verify
