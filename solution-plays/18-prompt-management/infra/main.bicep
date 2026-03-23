targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-18'

@description('Azure OpenAI model to deploy')
param openAiModelName string = 'gpt-4o'

@description('App Service Plan SKU')
param appServiceSku string = 'B1'

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '18-prompt-management'
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

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos-${projectName}-${suffix}'
  location: location
  tags: tags
  kind: 'GlobalDocumentDB'
  identity: { type: 'SystemAssigned' }
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [{ locationName: location, failoverPriority: 0 }]
    capabilities: [{ name: 'EnableServerless' }]
    consistencyPolicy: { defaultConsistencyLevel: 'Session' }
  }
}

resource cosmosDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2023-04-15' = {
  parent: cosmosDb
  name: 'prompt-db'
  properties: { resource: { id: 'prompt-db' } }
}

resource promptsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDatabase
  name: 'prompts'
  properties: {
    resource: {
      id: 'prompts'
      partitionKey: { paths: ['/promptId'], kind: 'Hash' }
      indexingPolicy: { automatic: true, indexingMode: 'consistent' }
    }
  }
}

resource versionsContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDatabase
  name: 'versions'
  properties: {
    resource: {
      id: 'versions'
      partitionKey: { paths: ['/promptId'], kind: 'Hash' }
    }
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
        { name: 'COSMOS_ENDPOINT', value: cosmosDb.properties.documentEndpoint }
        { name: 'COSMOS_DATABASE', value: 'prompt-db' }
      ]
    }
  }
}

output openAiEndpoint string = openAi.properties.endpoint
output cosmosEndpoint string = cosmosDb.properties.documentEndpoint
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'