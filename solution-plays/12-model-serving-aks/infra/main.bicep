targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-12'

@description('Azure OpenAI model to deploy')
param openAiModelName string = 'gpt-4o'

@description('System node pool VM size')
param systemNodeVmSize string = 'Standard_D4s_v5'

@description('GPU node pool VM size')
param gpuNodeVmSize string = 'Standard_NC6s_v3'

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '12-model-serving-aks'
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

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: take('acr${replace(projectName, '-', '')}${suffix}', 50)
  location: location
  tags: tags
  sku: { name: 'Standard' }
  identity: { type: 'SystemAssigned' }
  properties: {
    adminUserEnabled: false
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

resource aks 'Microsoft.ContainerService/managedClusters@2024-01-01' = {
  name: 'aks-${projectName}-${suffix}'
  location: location
  tags: tags
  identity: { type: 'SystemAssigned' }
  properties: {
    dnsPrefix: 'aks-${projectName}'
    enableRBAC: true
    agentPoolProfiles: [
      {
        name: 'system'
        count: 2
        vmSize: systemNodeVmSize
        mode: 'System'
        osType: 'Linux'
        osSKU: 'Ubuntu'
        type: 'VirtualMachineScaleSets'
        enableAutoScaling: true
        minCount: 2
        maxCount: 5
      }
      {
        name: 'gpu'
        count: 1
        vmSize: gpuNodeVmSize
        mode: 'User'
        osType: 'Linux'
        osSKU: 'Ubuntu'
        type: 'VirtualMachineScaleSets'
        enableAutoScaling: true
        minCount: 0
        maxCount: 3
        nodeLabels: { 'gpu': 'true' }
        nodeTaints: [ 'nvidia.com/gpu=true:NoSchedule' ]
      }
    ]
    addonProfiles: {
      omsagent: {
        enabled: true
        config: { logAnalyticsWorkspaceResourceID: logAnalytics.id }
      }
    }
    networkProfile: {
      networkPlugin: 'azure'
      loadBalancerSku: 'standard'
    }
  }
}

output aksClusterName string = aks.name
output acrLoginServer string = acr.properties.loginServer
output openAiEndpoint string = openAi.properties.endpoint