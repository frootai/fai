---
name: "evaluate-23-browser-automation-agent"
description: "Evaluate Browser Automation Agent quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate Browser Automation Agent

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Container Apps, Playwright MCP access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/23-browser-automation-agent/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
