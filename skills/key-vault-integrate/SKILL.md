---
name: "key-vault-integrate"
description: "Integrate Azure Key Vault for secret management with Managed Identity"
---

# Key Vault Integration for AI Applications

## Bicep Deployment — Key Vault with RBAC + Private Endpoint

Deploy Key Vault with RBAC authorization (not access policies) and a private endpoint for network isolation:

```bicep
@description('Key Vault for AI application secrets')
param location string = resourceGroup().location
param vaultName string
param subnetId string
param privateDnsZoneId string
param principalId string // App's managed identity

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: vaultName
  location: location
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true          // RBAC over access policies
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true            // Required for key rotation
    publicNetworkAccess: 'Disabled'
    networkAcls: { bypass: 'AzureServices', defaultAction: 'Deny' }
  }
}

// Grant app identity "Key Vault Secrets User" (read-only, least privilege)
resource secretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(kv.id, principalId, '4633458b-17de-408a-b874-0445c86b69e6')
  scope: kv
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '4633458b-17de-408a-b874-0445c86b69e6' // Key Vault Secrets User
    )
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}

resource privateEndpoint 'Microsoft.Network/privateEndpoints@2023-11-01' = {
  name: '${vaultName}-pe'
  location: location
  properties: {
    subnet: { id: subnetId }
    privateLinkServiceConnections: [
      {
        name: '${vaultName}-plsc'
        properties: {
          privateLinkServiceId: kv.id
          groupIds: ['vault']
        }
      }
    ]
  }
}

resource dnsGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-11-01' = {
  parent: privateEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      { name: 'vault', properties: { privateDnsZoneId: privateDnsZoneId } }
    ]
  }
}

output vaultUri string = kv.properties.vaultUri
```

## Storing Secrets — API Keys & Connection Strings

Seed secrets via Bicep (deployment-time) or CLI:

```bicep
resource openaiKey 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'azure-openai-api-key'
  properties: {
    value: openaiApiKey                    // From @secure() param or Key Vault reference
    contentType: 'text/plain'
    attributes: { enabled: true, exp: dateTimeToEpoch(dateTimeAdd(utcNow(), 'P90D')) }
  }
}

resource cosmosConn 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: kv
  name: 'cosmos-connection-string'
  properties: { value: cosmosAccount.listConnectionStrings().connectionStrings[0].connectionString }
}
```

## Python SDK — Retrieve Secrets with DefaultAzureCredential

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://kv-fai-prod.vault.azure.net/", credential=credential)

def get_secret(name: str) -> str:
    """Retrieve secret with built-in retry (azure-core handles transient errors)."""
    return client.get_secret(name).value

# Usage in AI app startup
OPENAI_API_KEY = get_secret("azure-openai-api-key")
COSMOS_CONN = get_secret("cosmos-connection-string")
AI_SEARCH_KEY = get_secret("ai-search-admin-key")
```

Cache secrets at startup — don't call Key Vault per-request. For long-running services, refresh on a timer or use `SecretClient.list_properties_of_secrets()` to detect version changes.

## Secret Rotation Automation

Create an Azure Function triggered by Event Grid when a secret nears expiry:

```python
import azure.functions as func
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from datetime import datetime, timedelta, timezone

def main(event: func.EventGridEvent):
    secret_name = event.get_json()["ObjectName"]
    vault_url = event.get_json()["VaultName"]

    client = SecretClient(vault_url=f"https://{vault_url}.vault.azure.net/", credential=DefaultAzureCredential())
    # Generate new key via the target service's API, then store new version
    new_value = rotate_via_service_api(secret_name)
    client.set_secret(secret_name, new_value,
        expires_on=datetime.now(timezone.utc) + timedelta(days=90),
        content_type="text/plain"
    )
```

Enable Key Vault events: `Microsoft.KeyVault.SecretNearExpiry` → Event Grid → Function App.

## Key Vault References in App Service & Container Apps

Eliminate secret sprawl — reference Key Vault directly in app settings:

```bicep
// App Service — Key Vault reference syntax
resource appSettings 'Microsoft.Web/sites/config@2023-12-01' = {
  parent: webApp
  name: 'appsettings'
  properties: {
    AZURE_OPENAI_API_KEY: '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=azure-openai-api-key)'
    COSMOS_CONNECTION:    '@Microsoft.KeyVault(VaultName=${kv.name};SecretName=cosmos-connection-string)'
  }
}

// Container Apps — secrets from Key Vault
resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  properties: {
    configuration: {
      secrets: [
        { name: 'openai-key', keyVaultUrl: '${kv.properties.vaultUri}secrets/azure-openai-api-key', identity: managedIdentity.id }
      ]
    }
    template: {
      containers: [{
        env: [
          { name: 'AZURE_OPENAI_API_KEY', secretRef: 'openai-key' }
        ]
      }]
    }
  }
}
```

The platform resolves secrets at deploy/restart — no SDK needed in app code for these values.

## Environment Variable Mapping Convention

Standard env var names for FAI solution plays:

| Secret Name in Key Vault | Env Var | Used By |
|--------------------------|---------|---------|
| `azure-openai-api-key` | `AZURE_OPENAI_API_KEY` | LLM calls |
| `azure-openai-endpoint` | `AZURE_OPENAI_ENDPOINT` | LLM calls |
| `ai-search-admin-key` | `AZURE_AI_SEARCH_KEY` | RAG indexing |
| `cosmos-connection-string` | `COSMOS_CONNECTION_STRING` | State store |
| `app-insights-connection` | `APPLICATIONINSIGHTS_CONNECTION_STRING` | Telemetry |

## RBAC vs Access Policies

Always use RBAC (`enableRbacAuthorization: true`). Access policies are legacy.

| Aspect | RBAC | Access Policies |
|--------|------|----------------|
| Granularity | Per-secret possible via scope | All-or-nothing per vault |
| Auditability | Azure AD audit log | Limited |
| Limit | 2000 role assignments/subscription | 1024 policies/vault |
| Conditional access | Supported | Not supported |
| Cross-tenant | Supported | Not supported |

Key RBAC roles: **Key Vault Secrets User** (read), **Key Vault Secrets Officer** (read/write/delete), **Key Vault Administrator** (full control including purge).

## Monitoring Secret Access

```bicep
resource kvDiag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'kv-audit'
  scope: kv
  properties: {
    workspaceId: logAnalyticsWorkspace.id
    logs: [
      { categoryGroup: 'audit', enabled: true, retentionPolicy: { enabled: true, days: 90 } }
    ]
    metrics: [
      { category: 'AllMetrics', enabled: true }
    ]
  }
}
```

KQL query to detect unusual access patterns:

```kql
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.KEYVAULT"
| where OperationName in ("SecretGet", "SecretList", "SecretSet")
| summarize AccessCount=count() by CallerIPAddress, Identity=identity_claim_upn_s, bin(TimeGenerated, 1h)
| where AccessCount > 50
```

## Backup & Restore

```python
# Backup all secrets (store encrypted blobs in secure storage)
for prop in client.list_properties_of_secrets():
    backup = client.backup_secret(prop.name)
    blob_client.upload_blob(f"kv-backup/{prop.name}.bak", backup, overwrite=True)

# Restore a secret to a new vault
restore_client = SecretClient(vault_url="https://kv-fai-dr.vault.azure.net/", credential=credential)
backup_blob = blob_client.download_blob(f"kv-backup/{name}.bak").readall()
restore_client.restore_secret_backup(backup_blob)
```

Backup is vault-scoped — restore must target the same Azure geography and subscription.

## Integration with config/*.json

Reference Key Vault URIs in play configuration so TuneKit resolves secrets at runtime:

```jsonc
// config/openai.json
{
  "model": "gpt-4o",
  "api_key": "@keyvault(azure-openai-api-key)",
  "endpoint": "@keyvault(azure-openai-endpoint)",
  "temperature": 0.3,
  "max_tokens": 4096
}
```

Resolution helper in Python:

```python
import re, os
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

_KV_PATTERN = re.compile(r"@keyvault\(([^)]+)\)")
_client = None

def resolve_config(config: dict, vault_url: str = None) -> dict:
    """Replace @keyvault(name) references with actual secret values."""
    global _client
    vault_url = vault_url or os.environ["AZURE_KEYVAULT_URL"]
    if _client is None:
        _client = SecretClient(vault_url=vault_url, credential=DefaultAzureCredential())
    resolved = {}
    for k, v in config.items():
        if isinstance(v, str) and (m := _KV_PATTERN.match(v)):
            resolved[k] = _client.get_secret(m.group(1)).value
        else:
            resolved[k] = v
    return resolved
```

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `SecretNotFound` | Secret disabled/deleted | Check `az keyvault secret show --vault-name X --name Y` |
| `ForbiddenByPolicy` | Network ACL blocking | Add caller IP or use private endpoint |
| `AccessDenied` | Missing RBAC role | Assign Key Vault Secrets User to the identity |
| Key Vault ref blank in App Service | Identity not assigned | Enable system-assigned MI + grant RBAC |
| High latency on secret reads | Per-request Key Vault calls | Cache secrets at startup, refresh on timer |
