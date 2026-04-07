---
name: "deploy-34-edge-ai-deployment"
description: "Deploy Edge AI Deployment to Azure."
---

# Deploy Edge AI Deployment

## Step 1: Prerequisites
- Azure CLI logged in
- Azure IoT Hub, Azure Container Instances, ONNX Runtime, Azure Monitor access

## Step 2: Execute
```bash
az deployment group create -g rg-frootai-edge-ai-deployment -f infra/main.bicep
```

## Step 3: Verify
Confirm results meet thresholds.
