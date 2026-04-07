---
name: "tune-23-browser-automation-agent"
description: "Tune Browser Automation Agent configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune Browser Automation Agent

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure OpenAI, Azure Container Apps, Playwright MCP access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
