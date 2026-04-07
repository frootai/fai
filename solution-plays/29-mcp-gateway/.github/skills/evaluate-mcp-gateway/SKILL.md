---
name: "evaluate-29-mcp-gateway"
description: "Evaluate MCP Gateway quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate MCP Gateway

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure API Management, Azure Container Apps, Azure Monitor, Azure Key Vault access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/29-mcp-gateway/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
