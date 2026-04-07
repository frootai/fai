---
name: "tune-25-conversation-memory-layer"
description: "Tune Conversation Memory Layer configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune Conversation Memory Layer

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Cosmos DB, Azure AI Search, Azure Redis Cache access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
