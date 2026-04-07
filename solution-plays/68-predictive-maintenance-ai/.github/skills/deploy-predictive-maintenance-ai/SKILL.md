---
name: "deploy-68-predictive-maintenance-ai"
description: "Deploy Predictive Maintenance AI."
---
# Deploy Predictive Maintenance AI
## Step 1: Prerequisites
- Azure CLI, Azure IoT Hub access
## Step 2: Execute
az deployment group create -g rg-frootai-predictive-maintenance-ai -f infra/main.bicep
## Step 3: Verify
