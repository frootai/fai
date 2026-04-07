---
name: "evaluate-24-ai-code-review-pipeline"
description: "Evaluate AI Code Review Pipeline quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds."
---

# Evaluate AI Code Review Pipeline

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, GitHub Actions, CodeQL, Azure DevOps access

## Step 2: Prepare test data
Check `evaluation/test-set.jsonl` has representative queries.

## Step 3: Execute
```bash
node engine/index.js solution-plays/24-ai-code-review-pipeline/fai-manifest.json --eval
```

## Step 4: Verify
All metrics should meet thresholds defined in fai-manifest.json guardrails.
