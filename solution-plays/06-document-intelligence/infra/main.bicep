targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-06'

@description('Azure OpenAI model to deploy')
param openAiModelName string = 'gpt-4o'

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '06-document-intelligence'
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

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource documentsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'documents'
  properties: {
    publicAccess: 'None'
  }
}

resource processedContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'processed'
  properties: {
    publicAccess: 'None'
  }
}

resource docIntelligence 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: 'di-${projectName}-${suffix}'
  location: location
  tags: tags
  kind: 'FormRecognizer'
  sku: { name: 'S0' }
  identity: { type: 'SystemAssigned' }
  properties: {
    customSubDomainName: 'di-${projectName}-${suffix}'
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
  sku: {
    name: 'Standard'
    capacity: 10
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: openAiModelName
      version: '2024-08-06'
    }
  }
}

output openAiEndpoint string = openAi.properties.endpoint
output docIntelligenceEndpoint string = docIntelligence.properties.endpoint
output storageAccountName string = storageAccount.name