targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-19'

@description('IoT Hub SKU')
param iotHubSku string = 'S1'

@description('Container Registry SKU')
param acrSku string = 'Standard'

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '19-edge-ai-phi4'
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

resource modelsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'onnx-models'
  properties: { publicAccess: 'None' }
}

resource edgeModulesContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'edge-modules'
  properties: { publicAccess: 'None' }
}

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: take('acr${replace(projectName, '-', '')}${suffix}', 50)
  location: location
  tags: tags
  sku: { name: acrSku }
  identity: { type: 'SystemAssigned' }
  properties: {
    adminUserEnabled: false
    publicNetworkAccess: 'Enabled'
  }
}

resource iotHub 'Microsoft.Devices/IotHubs@2023-06-30' = {
  name: 'iot-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: {
    name: iotHubSku
    capacity: 1
  }
  identity: { type: 'SystemAssigned' }
  properties: {
    routing: {
      endpoints: {
        storageContainers: [
          {
            name: 'model-telemetry'
            containerName: 'edge-modules'
            connectionString: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=${az.environment().suffixes.storage};AccountKey=${storageAccount.listKeys().keys[0].value}'
            fileNameFormat: '{iothub}/{partition}/{YYYY}/{MM}/{DD}/{HH}/{mm}'
            encoding: 'JSON'
          }
        ]
      }
      routes: [
        {
          name: 'telemetry-to-storage'
          source: 'DeviceMessages'
          condition: 'true'
          endpointNames: ['model-telemetry']
          isEnabled: true
        }
      ]
    }
    features: 'None'
  }
}

resource iotDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'iot-diagnostics'
  scope: iotHub
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

output iotHubHostName string = iotHub.properties.hostName
output acrLoginServer string = acr.properties.loginServer
output storageAccountName string = storageAccount.name