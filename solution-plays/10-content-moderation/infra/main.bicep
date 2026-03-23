targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-10'

@description('Azure OpenAI model to deploy')
param openAiModelName string = 'gpt-4o'

@description('APIM publisher email')
param publisherEmail string = 'admin@frootai.com'

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '10-content-moderation'
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

resource contentSafety 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'cs-${projectName}-${suffix}'
  location: location
  tags: tags
  kind: 'ContentSafety'
  sku: { name: 'S0' }
  identity: { type: 'SystemAssigned' }
  properties: {
    customSubDomainName: 'cs-${projectName}-${suffix}'
    publicNetworkAccess: 'Enabled'
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

resource apim 'Microsoft.ApiManagement/service@2023-05-01-preview' = {
  name: 'apim-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: {
    name: 'Consumption'
    capacity: 0
  }
  identity: { type: 'SystemAssigned' }
  properties: {
    publisherEmail: publisherEmail
    publisherName: 'FrootAI Content Moderation'
  }
}

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'apim-diagnostics'
  scope: apim
  properties: {
    workspaceId: logAnalytics.id
    logs: [
      { categoryGroup: 'allLogs', enabled: true }
    ]
    metrics: [
      { category: 'AllMetrics', enabled: true }
    ]
  }
}

output openAiEndpoint string = openAi.properties.endpoint
output contentSafetyEndpoint string = contentSafety.properties.endpoint
output apimGatewayUrl string = apim.properties.gatewayUrl