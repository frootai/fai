---
name: "deploy-96-realtime-voice-agent-v2"
description: "Deploy Realtime Voice Agent V2."
---
# Deploy Realtime Voice Agent V2
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-realtime-voice-agent-v2 -f infra/main.bicep
## Step 3: Verify
