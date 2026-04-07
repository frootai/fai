---
name: "evaluate-28-knowledge-graph-rag"
description: "Evaluate Knowledge Graph RAG quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate Knowledge Graph RAG

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Cosmos DB (Gremlin), Azure AI Search, Azure Container Apps access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/28-knowledge-graph-rag/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
