targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-09'

@description('Azure OpenAI model to deploy')
param openAiModelName string = 'gpt-4o'

@description('App Service Plan SKU')
param appServiceSku string = 'B1'

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '09-ai-search-portal'
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'log-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: take('st${replace(projectName, '-', '')}${suffix}', 24)
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: {
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
  }
}

resource aiSearch 'Microsoft.Search/searchServices@2023-11-01' = {
  name: 'srch-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: { name: 'standard' }
  identity: { type: 'SystemAssigned' }
  properties: {
    replicaCount: 1
    partitionCount: 1
    hostingMode: 'default'
    semanticSearch: 'standard'
    publicNetworkAccess: 'enabled'
  }
}

resource openAi 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'oai-${projectName}-${suffix}'
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: { name: 'S0' }
  identity: { type: 'SystemAssigned' }
  properties: {
    customSubDomainName: 'oai-${projectName}-${suffix}'
    publicNetworkAccess: 'Enabled'
  }
}

resource openAiDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: openAi
  name: openAiModelName
  sku: { name: 'Standard', capacity: 10 }
  properties: {
    model: { format: 'OpenAI', name: openAiModelName, version: '2024-08-06' }
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'asp-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: { name: appServiceSku }
  kind: 'linux'
  properties: { reserved: true }
}

resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'app-${projectName}-${suffix}'
  location: location
  tags: tags
  kind: 'app,linux'
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'PYTHON|3.11'
      alwaysOn: true
      ftpsState: 'Disabled'
      appSettings: [
        { name: 'AZURE_OPENAI_ENDPOINT', value: openAi.properties.endpoint }
        { name: 'AZURE_SEARCH_ENDPOINT', value: 'https://${aiSearch.name}.search.windows.net' }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: '' }
      ]
    }
  }
}

output openAiEndpoint string = openAi.properties.endpoint
output searchEndpoint string = 'https://${aiSearch.name}.search.windows.net'
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'