---
name: "deploy-58-digital-twin-agent"
description: "Deploy Digital Twin Agent."
---
# Deploy Digital Twin Agent
## Step 1: Prerequisites
- Azure CLI, Azure IoT Hub access
## Step 2: Execute
az deployment group create -g rg-frootai-digital-twin-agent -f infra/main.bicep
## Step 3: Verify
