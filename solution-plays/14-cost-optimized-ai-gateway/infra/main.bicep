targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-14'

@description('Azure OpenAI model to deploy')
param openAiModelName string = 'gpt-4o'

@description('APIM publisher email')
param publisherEmail string = 'admin@frootai.com'

@description('Redis Cache SKU')
param redisSku string = 'Basic'

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '14-cost-optimized-ai-gateway'
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
  sku: { name: 'Standard', capacity: 20 }
  properties: {
    model: { format: 'OpenAI', name: openAiModelName, version: '2024-08-06' }
  }
}

resource redisCache 'Microsoft.Cache/redis@2023-08-01' = {
  name: 'redis-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    sku: {
      name: redisSku
      family: 'C'
      capacity: 0
    }
    enableNonSslPort: false
    minimumTlsVersion: '1.2'
    redisConfiguration: {
      'maxmemory-policy': 'allkeys-lru'
    }
  }
}

resource apim 'Microsoft.ApiManagement/service@2023-05-01-preview' = {
  name: 'apim-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: {
    name: 'StandardV2'
    capacity: 1
  }
  identity: { type: 'SystemAssigned' }
  properties: {
    publisherEmail: publisherEmail
    publisherName: 'FrootAI AI Gateway'
  }
}

resource apimDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
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

resource apimNamedValueRedis 'Microsoft.ApiManagement/service/namedValues@2023-05-01-preview' = {
  parent: apim
  name: 'redis-connection'
  properties: {
    displayName: 'redis-connection'
    secret: true
    value: '${redisCache.properties.hostName}:${redisCache.properties.sslPort},ssl=True,abortConnect=False'
  }
}

output openAiEndpoint string = openAi.properties.endpoint
output apimGatewayUrl string = apim.properties.gatewayUrl
output redisHostName string = redisCache.properties.hostName