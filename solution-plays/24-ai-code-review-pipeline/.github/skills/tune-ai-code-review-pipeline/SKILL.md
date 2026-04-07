---
name: "tune-24-ai-code-review-pipeline"
description: "Tune AI Code Review Pipeline configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune AI Code Review Pipeline

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, GitHub Actions, CodeQL, Azure DevOps access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
