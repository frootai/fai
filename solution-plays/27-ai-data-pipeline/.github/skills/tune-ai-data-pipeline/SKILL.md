---
name: "tune-27-ai-data-pipeline"
description: "Tune AI Data Pipeline configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune AI Data Pipeline

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Data Factory, Azure Blob Storage, Azure Cosmos DB, Azure Event Hubs access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
