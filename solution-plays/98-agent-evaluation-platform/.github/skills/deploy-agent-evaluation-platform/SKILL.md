---
name: "deploy-98-agent-evaluation-platform"
description: "Deploy Agent Evaluation Platform."
---
# Deploy Agent Evaluation Platform
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-agent-evaluation-platform -f infra/main.bicep
## Step 3: Verify
