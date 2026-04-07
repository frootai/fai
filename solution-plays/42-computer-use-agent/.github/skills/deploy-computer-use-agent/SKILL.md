---
name: "deploy-42-computer-use-agent"
description: "Deploy Computer Use Autonomous Agent."
---
# Deploy Computer Use Autonomous Agent
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-computer-use-agent -f infra/main.bicep
## Step 3: Verify
Check results.
