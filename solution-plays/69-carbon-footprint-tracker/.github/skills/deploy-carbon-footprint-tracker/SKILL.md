---
name: "deploy-69-carbon-footprint-tracker"
description: "Deploy Carbon Footprint Tracker."
---
# Deploy Carbon Footprint Tracker
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-carbon-footprint-tracker -f infra/main.bicep
## Step 3: Verify
