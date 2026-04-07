---
name: "deploy-75-exam-generation-engine"
description: "Deploy Exam Generation Engine."
---
# Deploy Exam Generation Engine
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
az deployment group create -g rg-frootai-exam-generation-engine -f infra/main.bicep
## Step 3: Verify
