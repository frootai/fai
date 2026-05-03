targetScope = 'resourceGroup'

// 
// Enterprise RAG Q&A  Azure Infrastructure
// Deploy: az deployment group create -f main.bicep -p parameters.json
// 

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment: dev, staging, or prod')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-rag'

var suffix = uniqueString(resourceGroup().id)
var tags = { environment: environment, project: 'frootai', play: '01-enterprise-rag' }

//  Managed Identity 
resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${projectName}-id-${suffix}'
  location: location
  tags: tags
}

//  Azure OpenAI 
resource openai 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: '${projectName}-oai-${suffix}'
  location: location
  kind: 'OpenAI'
  tags: tags
  sku: { name: 'S0' }
  identity: { type: 'SystemAssigned' }
  properties: {
    customSubDomainName: '${projectName}-oai-${suffix}'
    publicNetworkAccess: 'Enabled'
  }
}

resource gpt4oDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openai
  name: 'gpt-4o'
  sku: { name: 'Standard', capacity: 30 }
  properties: {
    model: { format: 'OpenAI', name: 'gpt-4o', version: '2024-08-06' }
  }
}

//  Azure AI Search 
resource search 'Microsoft.Search/searchServices@2024-06-01-preview' = {
  name: '${projectName}-srch-${suffix}'
  location: location
  tags: tags
  sku: { name: 'standard' }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    semanticSearch: 'standard'
    publicNetworkAccess: 'enabled'
  }
}

//  Storage Account (documents) 
resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: replace('${projectName}st${suffix}', '-', '')
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource documentsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'documents'
}

//  Container Apps Environment & App 
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${projectName}-law-${suffix}'
  location: location
  tags: tags
  properties: { sku: { name: 'PerGB2018' }, retentionInDays: 90 }
}

resource containerEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${projectName}-cae-${suffix}'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${projectName}-api-${suffix}'
  location: location
  tags: tags
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: { external: true, targetPort: 8000, transport: 'http' }
    }
    template: {
      containers: [
        {
          name: 'rag-api'
          image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: [
            { name: 'AZURE_OPENAI_ENDPOINT', value: openai.properties.endpoint }
            { name: 'AZURE_SEARCH_ENDPOINT', value: 'https://${search.name}.search.windows.net' }
            { name: 'AZURE_STORAGE_ACCOUNT', value: storage.name }
            { name: 'AZURE_CLIENT_ID', value: identity.properties.clientId }
          ]
        }
      ]
      scale: { minReplicas: 0, maxReplicas: 10 }
    }
  }
}

//  Outputs 
output openaiEndpoint string = openai.properties.endpoint
output searchEndpoint string = 'https://${search.name}.search.windows.net'
output storageAccountName string = storage.name
output containerAppFqdn string = containerApp.properties.configuration.ingress.fqdn
output identityClientId string = identity.properties.clientId