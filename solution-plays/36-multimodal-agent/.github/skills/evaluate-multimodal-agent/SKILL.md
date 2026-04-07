---
name: "evaluate-36-multimodal-agent"
description: "Evaluate Multimodal Agent quality."
---

# Evaluate Multimodal Agent

## Step 1: Prerequisites
- Azure CLI logged in
- Azure OpenAI (GPT-4o Vision), Azure AI Vision, Azure Blob Storage, Azure Container Apps access

## Step 2: Execute
```bash
node engine/index.js solution-plays/36-multimodal-agent/fai-manifest.json --eval
```

## Step 3: Verify
Confirm results meet thresholds.
