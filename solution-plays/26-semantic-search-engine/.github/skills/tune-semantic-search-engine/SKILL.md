---
name: "tune-26-semantic-search-engine"
description: "Tune Semantic Search Engine configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune Semantic Search Engine

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure AI Search, Azure OpenAI, Azure Blob Storage, Azure Container Apps access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
