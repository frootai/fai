---
name: "tune-30-ai-security-hardening"
description: "Tune AI Security Hardening configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds."
---

# Tune AI Security Hardening

## Step 1: Prerequisites
- Azure CLI logged in (`az account show`)
- Resource group created
- Azure AI Content Safety, Azure OpenAI, Azure Container Apps, Azure Key Vault, Azure Monitor access

## Step 2: Review current config
Review `config/openai.json` and `config/guardrails.json` for current settings.

## Step 3: Execute
Adjust parameters based on evaluation results and cost targets.

## Step 4: Verify
Re-run evaluation to confirm score improvements.
