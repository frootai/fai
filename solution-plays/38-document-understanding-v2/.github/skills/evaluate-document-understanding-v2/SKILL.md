---
name: "evaluate-38-document-understanding-v2"
description: "Evaluate Document Understanding v2 quality."
---

# Evaluate Document Understanding v2

## Step 1: Prerequisites
- Azure CLI logged in
- Azure AI Document Intelligence, Azure OpenAI, Azure Blob Storage, Azure Cosmos DB access

## Step 2: Execute
```bash
node engine/index.js solution-plays/38-document-understanding-v2/fai-manifest.json --eval
```

## Step 3: Verify
Confirm results meet thresholds.
