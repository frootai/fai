---
name: "evaluate-27-ai-data-pipeline"
description: "Evaluate AI Data Pipeline quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate AI Data Pipeline

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Data Factory, Azure Blob Storage, Azure Cosmos DB, Azure Event Hubs access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/27-ai-data-pipeline/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
