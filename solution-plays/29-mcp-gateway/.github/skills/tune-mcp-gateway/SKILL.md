---
name: "tune-29-mcp-gateway"
description: "Tune MCP Gateway configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune MCP Gateway

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure API Management, Azure Container Apps, Azure Monitor, Azure Key Vault access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
