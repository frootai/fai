---
name: "deploy-87-dynamic-pricing-engine"
description: "Deploy Dynamic Pricing Engine."
---
# Deploy Dynamic Pricing Engine
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-dynamic-pricing-engine -f infra/main.bicep
## Step 3: Verify
