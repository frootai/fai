---
name: "deploy-51-autonomous-coding-agent"
description: "Deploy Autonomous Coding Agent."
---
# Deploy Autonomous Coding Agent
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-autonomous-coding-agent -f infra/main.bicep
## Step 3: Verify
