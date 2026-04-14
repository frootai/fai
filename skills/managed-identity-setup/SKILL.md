---
name: managed-identity-setup
description: "Set up Managed Identity with RBAC role assignments for Azure services"
---

# Managed Identity Setup

Configure passwordless authentication for Azure AI applications using Managed Identity, eliminating API keys from code, config, and pipelines.

## User-Assigned vs System-Assigned

| Factor | System-Assigned | User-Assigned |
|--------|----------------|---------------|
| Lifecycle | Tied to resource — deleted when resource is deleted | Independent — survives resource recreation |
| Sharing | One identity per resource | One identity across multiple resources |
| IaC redeployment | New identity + re-grant roles on every destroy/recreate | Stable identity — roles persist across redeployments |
| Best for | Single-resource dev/test | Production AI apps, shared RBAC across App Service + Functions + AKS |

**Decision:** Use **user-assigned** for AI apps. Azure OpenAI, AI Search, and Storage role assignments are expensive to re-grant — a stable identity avoids permission gaps during redeployments.

## Bicep: Create Identity + Role Assignments

```bicep
// identity.bicep — User-assigned Managed Identity with AI RBAC roles
param location string = resourceGroup().location
param identityName string = 'id-fai-app'

// Pre-existing resources passed by resource ID
param openAiAccountId string
param searchServiceId string
param storageAccountId string

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

// --- RBAC Role Assignments ---
// Role definition IDs: https://learn.microsoft.com/azure/role-based-access-control/built-in-roles

// Cognitive Services OpenAI User — call chat/completions & embeddings
resource openAiRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openAiAccountId, identity.id, '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd')
  scope: resourceId('Microsoft.CognitiveServices/accounts', split(openAiAccountId, '/')[8])
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd' // Cognitive Services OpenAI User
    )
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Search Index Data Reader — query AI Search indexes
resource searchRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(searchServiceId, identity.id, '1407120a-92aa-4202-b7e9-c0e197c71c8f')
  scope: resourceId('Microsoft.Search/searchServices', split(searchServiceId, '/')[8])
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '1407120a-92aa-4202-b7e9-c0e197c71c8f' // Search Index Data Reader
    )
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Storage Blob Data Reader — read documents from blob for indexing/RAG
resource storageRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAccountId, identity.id, '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1')
  scope: resourceId('Microsoft.Storage/storageAccounts', split(storageAccountId, '/')[8])
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '2a2b9908-6ea1-4ae2-8e65-a410df84e7d1' // Storage Blob Data Reader
    )
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

output identityId string = identity.id
output principalId string = identity.properties.principalId
output clientId string = identity.properties.clientId
```

## Common RBAC Roles for AI Apps

| Role | GUID | Use Case |
|------|------|----------|
| Cognitive Services OpenAI User | `5e0bd9bd-7b93-4f28-af87-19fc36ad61bd` | Call chat/completions, embeddings |
| Cognitive Services OpenAI Contributor | `a001fd3d-188f-4b5d-821b-7da978bf7442` | Deploy models, manage fine-tunes |
| Search Index Data Reader | `1407120a-92aa-4202-b7e9-c0e197c71c8f` | Query search indexes |
| Search Index Data Contributor | `8bbe5a00-799e-43f5-93ac-243d3dce84a7` | Push documents into indexes |
| Storage Blob Data Reader | `2a2b9908-6ea1-4ae2-8e65-a410df84e7d1` | Read blobs (RAG source docs) |
| Storage Blob Data Contributor | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` | Write blobs (upload docs) |
| Key Vault Secrets User | `4633458b-17de-408a-b874-0445c86b69e6` | Read secrets at runtime |

## DefaultAzureCredential — Python

```python
from azure.identity import DefaultAzureCredential, ManagedIdentityCredential
from openai import AzureOpenAI

# Production: chains ManagedIdentity → AzureCLI → environment variables
credential = DefaultAzureCredential(
    managed_identity_client_id="<USER_ASSIGNED_CLIENT_ID>"  # pin to user-assigned
)

client = AzureOpenAI(
    azure_endpoint="https://my-openai.openai.azure.com",
    azure_ad_token_provider=lambda: credential.get_token(
        "https://cognitiveservices.azure.com/.default"
    ).token,
    api_version="2024-10-21",
)
```

For AI Search with identity auth:
```python
from azure.search.documents import SearchClient

search = SearchClient(
    endpoint="https://my-search.search.windows.net",
    index_name="documents",
    credential=credential,
)
results = search.search("deployment architecture", top=5)
```

## DefaultAzureCredential — TypeScript

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { AzureOpenAI } from "openai";

const credential = new DefaultAzureCredential({
  managedIdentityClientId: process.env.AZURE_CLIENT_ID, // user-assigned
});

const client = new AzureOpenAI({
  azureADTokenProvider: () =>
    credential.getToken("https://cognitiveservices.azure.com/.default")
      .then((t) => t!.token),
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  apiVersion: "2024-10-21",
});
```

## Local Development — Azure CLI Fallback

`DefaultAzureCredential` automatically falls back to Azure CLI when no Managed Identity is available:

```bash
az login                                    # interactive login
az account set -s <SUBSCRIPTION_ID>         # select subscription
# Grant yourself the same roles as the managed identity:
az role assignment create \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --role "Cognitive Services OpenAI User" \
  --scope /subscriptions/<SUB>/resourceGroups/<RG>/providers/Microsoft.CognitiveServices/accounts/<ACCOUNT>
```

No code changes needed — the same `DefaultAzureCredential` works locally via CLI and in production via Managed Identity.

## Workload Identity for AKS

For pods running on AKS, bind the user-assigned identity via federated credential:

```bicep
// Federated credential for AKS Workload Identity
resource fedCred 'Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials@2023-01-31' = {
  parent: identity
  name: 'aks-fai-app'
  properties: {
    issuer: aksCluster.properties.oidcIssuerUrl
    subject: 'system:serviceaccount:fai:fai-app-sa'  // namespace:serviceaccount
    audiences: ['api://AzureADTokenExchange']
  }
}
```

Annotate the Kubernetes ServiceAccount:
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: fai-app-sa
  namespace: fai
  annotations:
    azure.workload.identity/client-id: "<USER_ASSIGNED_CLIENT_ID>"
  labels:
    azure.workload.identity/use: "true"
```

## Federated Credentials for GitHub Actions

Deploy from CI/CD without storing secrets — use OIDC federation:

```bicep
resource ghFedCred 'Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials@2023-01-31' = {
  parent: identity
  name: 'github-deploy'
  properties: {
    issuer: 'https://token.actions.githubusercontent.com'
    subject: 'repo:myorg/myrepo:ref:refs/heads/main'
    audiences: ['api://AzureADTokenExchange']
  }
}
```

In your workflow:
```yaml
- uses: azure/login@v2
  with:
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
```

## Migrating from API Keys to Managed Identity

1. **Deploy identity + roles** using the Bicep above (takes ~2 min for propagation)
2. **Update app code** — replace `api_key=` with `azure_ad_token_provider=` (Python) or `azureADTokenProvider` (TypeScript)
3. **Remove key env vars** — delete `AZURE_OPENAI_API_KEY`, `AZURE_SEARCH_API_KEY` from App Service / Container Apps config
4. **Disable key access** on the Azure OpenAI resource:
   ```bash
   az cognitiveservices account update -n my-openai -g my-rg \
     --custom-domain my-openai --disable-local-auth true
   ```
5. **Verify** — test all endpoints, confirm no `401 Unauthorized` responses
6. **Rotate and revoke** old API keys from Key Vault / environment

## Troubleshooting Auth Failures

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ManagedIdentityCredential authentication unavailable` | Identity not assigned to resource | Assign identity in Bicep `identity: { type: 'UserAssigned', userAssignedIdentities: { '${identity.id}': {} } }` |
| `AADSTS700016: Application not found` | Wrong `managed_identity_client_id` | Verify client ID matches the user-assigned identity |
| `403 Forbidden` on OpenAI calls | Missing RBAC role or propagation delay | Check role assignment exists; wait 5-10 min for propagation |
| `ClientAuthenticationError` locally | Not logged in via Azure CLI | Run `az login` and `az account set -s <sub>` |
| Token works but search returns 0 results | Role assigned at wrong scope | Assign `Search Index Data Reader` at the search service level, not resource group |
| `AuthorizationFailed` in Bicep deployment | Deployer lacks `Microsoft.Authorization/roleAssignments/write` | Grant deployer `User Access Administrator` or `Owner` on the resource group |
