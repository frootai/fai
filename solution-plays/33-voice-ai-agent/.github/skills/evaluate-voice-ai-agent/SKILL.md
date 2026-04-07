---
name: "evaluate-33-voice-ai-agent"
description: "Evaluate Voice AI Agent quality."
---

# Evaluate Voice AI Agent

## Step 1: Prerequisites
- Azure CLI logged in
- Azure AI Speech, Azure OpenAI, Azure Communication Services, Azure Container Apps access

## Step 2: Execute
```bash
node engine/index.js solution-plays/33-voice-ai-agent/fai-manifest.json --eval
```

## Step 3: Verify
Confirm results meet thresholds.
