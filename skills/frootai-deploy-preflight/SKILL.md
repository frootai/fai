---
name: frootai-deploy-preflight
description: 'Validates Bicep templates, checks Azure resource availability, verifies quota, and runs what-if deployment before any Azure infrastructure changes. A safety gate for all FrootAI play deployments.'
---

# FrootAI Deploy Preflight

Run a comprehensive preflight check before deploying any FrootAI play infrastructure to Azure.

## Checks Performed

### 1. Bicep Validation
```bash
az bicep build -f infra/main.bicep
```
Verify template compiles without errors.

### 2. Parameter Validation
- All required parameters have values
- SKU names are valid
- Region is available for requested services
- Tags include: environment, project, costCenter, managedBy

### 3. Quota Check
- GPU quota (if AKS GPU nodes requested)
- Azure OpenAI TPM/RPM quota for the region
- AI Search replica/partition limits
- Cosmos DB throughput limits

### 4. What-If Deployment
```bash
az deployment group what-if \
  -g <resource-group> \
  -f infra/main.bicep \
  -p infra/parameters.json
```
Review planned changes before applying.

### 5. Cost Estimate
- Estimate monthly cost based on defined resources
- Compare against budget tags
- Flag if estimated cost exceeds budget by >20%

### 6. Security Check
- Private endpoints configured for all PaaS services?
- Managed Identity used (no API keys)?
- Diagnostic settings enabled?
- RBAC roles follow least privilege?

## Output

```
🚀 FrootAI Deploy Preflight — [play name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Bicep validation passed
✅ Parameters validated (12/12 fields)
⚠️  GPU quota: 4/8 vCPUs remaining in eastus
✅ What-if: 7 resources to create, 0 to modify, 0 to delete
✅ Estimated cost: $1,240/month (within budget)
✅ Security: all checks passed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULT: READY TO DEPLOY
```
