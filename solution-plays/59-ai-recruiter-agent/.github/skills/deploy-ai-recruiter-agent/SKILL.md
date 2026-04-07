---
name: "deploy-59-ai-recruiter-agent"
description: "Deploy AI Recruiter Agent."
---
# Deploy AI Recruiter Agent
## Step 1: Prerequisites
- Azure CLI, Azure OpenAI access
## Step 2: Execute
az deployment group create -g rg-frootai-ai-recruiter-agent -f infra/main.bicep
## Step 3: Verify
