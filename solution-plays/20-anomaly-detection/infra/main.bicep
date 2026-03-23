targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-20'

@description('Azure OpenAI model to deploy')
param openAiModelName string = 'gpt-4o'

@description('Event Hub SKU')
param eventHubSku string = 'Standard'

@description('Stream Analytics streaming units')
param streamingUnits int = 3

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '20-anomaly-detection'
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

resource eventHubNamespace 'Microsoft.EventHub/namespaces@2022-10-01-preview' = {
  name: 'evhns-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: {
    name: eventHubSku
    tier: eventHubSku
    capacity: 1
  }
  identity: { type: 'SystemAssigned' }
  properties: {
    isAutoInflateEnabled: true
    maximumThroughputUnits: 10
  }
}

resource eventHub 'Microsoft.EventHub/namespaces/eventhubs@2022-10-01-preview' = {
  parent: eventHubNamespace
  name: 'telemetry-stream'
  properties: {
    messageRetentionInDays: 3
    partitionCount: 4
  }
}

resource consumerGroup 'Microsoft.EventHub/namespaces/eventhubs/consumergroups@2022-10-01-preview' = {
  parent: eventHub
  name: 'anomaly-processor'
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
  name: 'anomaly-db'
  properties: { resource: { id: 'anomaly-db' } }
}

resource anomaliesContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2023-04-15' = {
  parent: cosmosDatabase
  name: 'anomalies'
  properties: {
    resource: {
      id: 'anomalies'
      partitionKey: { paths: ['/sourceId'], kind: 'Hash' }
      defaultTtl: 2592000
      indexingPolicy: { automatic: true, indexingMode: 'consistent' }
    }
  }
}

resource streamAnalytics 'Microsoft.StreamAnalytics/streamingjobs@2021-10-01-preview' = {
  name: 'asa-${projectName}-${suffix}'
  location: location
  tags: tags
  identity: { type: 'SystemAssigned' }
  properties: {
    sku: { name: 'Standard' }
    outputErrorPolicy: 'Stop'
    eventsOutOfOrderPolicy: 'Adjust'
    eventsOutOfOrderMaxDelayInSeconds: 5
    eventsLateArrivalMaxDelayInSeconds: 16
    transformation: {
      name: 'anomaly-transform'
      properties: {
        query: 'SELECT System.Timestamp() AS WindowEnd, COUNT(*) AS EventCount, AVG(CAST(value AS float)) AS AvgValue FROM [telemetry-input] TIMESTAMP BY EventEnqueuedUtcTime GROUP BY TumblingWindow(minute, 5)'
        streamingUnits: streamingUnits
      }
    }
  }
}

resource asaDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'asa-diagnostics'
  scope: streamAnalytics
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

output eventHubNamespaceFqdn string = '${eventHubNamespace.name}.servicebus.windows.net'
output openAiEndpoint string = openAi.properties.endpoint
output cosmosEndpoint string = cosmosDb.properties.documentEndpoint
output streamAnalyticsJobName string = streamAnalytics.name