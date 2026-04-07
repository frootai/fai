#!/bin/bash
# Deploy Enterprise RAG to Azure
# Skill: deploy-azure

set -euo pipefail

RG_NAME="${AZURE_RG:-rg-enterprise-rag}"
LOCATION="${AZURE_LOCATION:-eastus2}"
TEMPLATE="../../infra/main.bicep"
PARAMS="../../infra/parameters.json"

echo "🔍 Validating Bicep template..."
az bicep build --file "$TEMPLATE"

echo "📦 Creating resource group: $RG_NAME in $LOCATION..."
az group create --name "$RG_NAME" --location "$LOCATION" --output none

echo "🚀 Deploying infrastructure..."
az deployment group create \
  --resource-group "$RG_NAME" \
  --template-file "$TEMPLATE" \
  --parameters "$PARAMS" \
  --output table

echo "✅ Deployment complete."
echo "🔗 Verify resources: az resource list --resource-group $RG_NAME --output table"

# Post-deployment verification
echo "Running post-deployment checks..."
HEALTH_URL="${APP_URL:-http://localhost:8080}/health"
RETRIES=5
for i in $(seq 1 $RETRIES); do
  STATUS=$(curl -sf -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
  if [ "$STATUS" = "200" ]; then
    echo "Health check passed (attempt $i)"
    break
  fi
  echo "Health check failed (attempt $i/$RETRIES, status=$STATUS), retrying in 10s..."
  sleep 10
done
if [ "$STATUS" != "200" ]; then
  echo "ERROR: Health check failed after $RETRIES attempts"
  exit 1
fi
echo "Deployment complete and verified."
