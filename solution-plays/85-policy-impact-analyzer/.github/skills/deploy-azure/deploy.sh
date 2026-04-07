#!/bin/bash
# Deploy Policy Impact Analyzer to Azure
# Usage: ./deploy.sh [dev|staging|prod]

set -euo pipefail

ENVIRONMENT=${1:-dev}
RESOURCE_GROUP="rg-frootai-policy-impact-analyzer-${ENVIRONMENT}"
LOCATION="eastus2"
PLAY="85-policy-impact-analyzer"

echo "═══ Deploying Policy Impact Analyzer ═══"
echo "Environment: ${ENVIRONMENT}"
echo "Resource Group: ${RESOURCE_GROUP}"

# Step 1: Validate Bicep template
echo "→ Step 1: Validating Bicep..."
az bicep build --file infra/main.bicep
echo "  ✓ Bicep valid"

# Step 2: Create resource group if needed
echo "→ Step 2: Ensuring resource group..."
az group create --name "${RESOURCE_GROUP}" --location "${LOCATION}" --tags environment="${ENVIRONMENT}" project=frootai play="${PLAY}"
echo "  ✓ Resource group ready"

# Step 3: Deploy infrastructure
echo "→ Step 3: Deploying infrastructure..."
az deployment group create \
  --resource-group "${RESOURCE_GROUP}" \
  --template-file infra/main.bicep \
  --parameters infra/parameters.json \
  --parameters environment="${ENVIRONMENT}" \
  --name "deploy-${PLAY}-$(date +%Y%m%d%H%M)"
echo "  ✓ Infrastructure deployed"

# Step 4: Verify deployment
echo "→ Step 4: Verifying deployment..."
az deployment group show \
  --resource-group "${RESOURCE_GROUP}" \
  --name "deploy-${PLAY}-*" \
  --query "properties.provisioningState" -o tsv
echo "  ✓ Deployment verified"

echo "═══ Policy Impact Analyzer deployed successfully ═══"
