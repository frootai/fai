---
name: "evaluate-34-edge-ai-deployment"
description: "Evaluate Edge AI Deployment quality."
---

# Evaluate Edge AI Deployment

## Step 1: Prerequisites
- Azure CLI logged in
- Azure IoT Hub, Azure Container Instances, ONNX Runtime, Azure Monitor access

## Step 2: Execute
```bash
node engine/index.js solution-plays/34-edge-ai-deployment/fai-manifest.json --eval
```

## Step 3: Verify
Confirm results meet thresholds.
