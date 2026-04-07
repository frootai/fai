---
name: "evaluate-26-semantic-search-engine"
description: "Evaluate Semantic Search Engine quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate Semantic Search Engine

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure AI Search, Azure OpenAI, Azure Blob Storage, Azure Container Apps access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/26-semantic-search-engine/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
