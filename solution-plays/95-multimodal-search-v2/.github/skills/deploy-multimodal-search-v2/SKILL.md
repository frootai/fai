---
name: "deploy-95-multimodal-search-v2"
description: "Deploy Multimodal Search V2."
---
# Deploy Multimodal Search V2
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-multimodal-search-v2 -f infra/main.bicep
## Step 3: Verify
