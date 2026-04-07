---
name: "tune-22-multi-agent-swarm"
description: "Tune Multi-Agent Swarm configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune Multi-Agent Swarm

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Container Apps, Azure Service Bus, Azure Cosmos DB access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
