---
name: "evaluate-30-ai-security-hardening"
description: "Evaluate AI Security Hardening quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate AI Security Hardening

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure AI Content Safety, Azure OpenAI, Azure Container Apps, Azure Key Vault, Azure Monitor access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/30-ai-security-hardening/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
