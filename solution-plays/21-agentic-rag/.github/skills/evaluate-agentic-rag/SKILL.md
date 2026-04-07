---
name: "evaluate-21-agentic-rag"
description: "Evaluate Agentic RAG quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate Agentic RAG

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure AI Search, Azure Container Apps, Azure Key Vault access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/21-agentic-rag/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
