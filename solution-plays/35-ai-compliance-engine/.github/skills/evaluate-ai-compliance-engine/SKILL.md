---
name: "evaluate-35-ai-compliance-engine"
description: "Evaluate AI Compliance Engine quality."
---

# Evaluate AI Compliance Engine

## Step 1: Prerequisites
- Azure CLI logged in
- Azure OpenAI, Azure Policy, Azure Key Vault, Azure Monitor, Azure Cosmos DB access

## Step 2: Execute
```bash
node engine/index.js solution-plays/35-ai-compliance-engine/fai-manifest.json --eval
```

## Step 3: Verify
Confirm results meet thresholds.
