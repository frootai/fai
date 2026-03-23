targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-17'

@description('Log retention in days')
param retentionDays int = 90

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '17-ai-observability'
}

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'log-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: retentionDays
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'ai-${projectName}-${suffix}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
    RetentionInDays: retentionDays
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
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

resource diagnosticsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'diagnostics'
  properties: { publicAccess: 'None' }
}

resource metricsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'metrics-archive'
  properties: { publicAccess: 'None' }
}

resource dashboard 'Microsoft.Portal/dashboards@2020-09-01-preview' = {
  name: 'dash-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    lenses: [
      {
        order: 0
        parts: [
          {
            position: { x: 0, y: 0, colSpan: 6, rowSpan: 4 }
            metadata: {
              type: 'Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart'
              inputs: [
                { name: 'resourceTypeMode', value: 'workspace' }
                { name: 'ComponentId', value: logAnalytics.id }
              ]
            }
          }
          {
            position: { x: 6, y: 0, colSpan: 6, rowSpan: 4 }
            metadata: {
              type: 'Extension/AppInsightsExtension/PartType/MetricsExplorerBladePinnedPart'
              inputs: [
                { name: 'ComponentId', value: appInsights.id }
              ]
            }
          }
        ]
      }
    ]
  }
}

output logAnalyticsWorkspaceId string = logAnalytics.properties.customerId
output appInsightsConnectionString string = appInsights.properties.ConnectionString
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output storageAccountName string = storageAccount.name