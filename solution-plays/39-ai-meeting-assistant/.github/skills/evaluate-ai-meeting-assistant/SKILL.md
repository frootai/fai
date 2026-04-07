---
name: "evaluate-39-ai-meeting-assistant"
description: "Evaluate AI Meeting Assistant quality."
---

# Evaluate AI Meeting Assistant

## Step 1: Prerequisites
- Azure CLI logged in
- Azure AI Speech, Azure OpenAI, Microsoft Graph, Azure Container Apps access

## Step 2: Execute
```bash
node engine/index.js solution-plays/39-ai-meeting-assistant/fai-manifest.json --eval
```

## Step 3: Verify
Confirm results meet thresholds.
