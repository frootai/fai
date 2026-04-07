---
name: "deploy-88-visual-product-search"
description: "Deploy Visual Product Search."
---
# Deploy Visual Product Search
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-visual-product-search -f infra/main.bicep
## Step 3: Verify
