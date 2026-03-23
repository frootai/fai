targetScope = 'resourceGroup'

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-11'

@description('VNet address prefix')
param vnetAddressPrefix string = '10.0.0.0/16'

@description('Tenant ID for Key Vault access')
param tenantId string = subscription().tenantId

var suffix = uniqueString(resourceGroup().id)
var tags = {
  environment: environment
  project: 'frootai'
  play: '11-ai-landing-zone-advanced'
}
var subnets = [
  { name: 'snet-ai', addressPrefix: '10.0.1.0/24' }
  { name: 'snet-data', addressPrefix: '10.0.2.0/24' }
  { name: 'snet-app', addressPrefix: '10.0.3.0/24' }
  { name: 'AzureFirewallSubnet', addressPrefix: '10.0.4.0/24' }
]

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'log-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 90
  }
}

resource nsg 'Microsoft.Network/networkSecurityGroups@2023-09-01' = {
  name: 'nsg-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    securityRules: [
      {
        name: 'DenyAllInbound'
        properties: {
          priority: 4096
          direction: 'Inbound'
          access: 'Deny'
          protocol: '*'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          sourcePortRange: '*'
          destinationPortRange: '*'
        }
      }
    ]
  }
}

resource vnet 'Microsoft.Network/virtualNetworks@2023-09-01' = {
  name: 'vnet-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    addressSpace: { addressPrefixes: [vnetAddressPrefix] }
    subnets: [for subnet in subnets: {
      name: subnet.name
      properties: {
        addressPrefix: subnet.addressPrefix
        networkSecurityGroup: subnet.name != 'AzureFirewallSubnet' ? { id: nsg.id } : null
      }
    }]
  }
}

resource natGatewayPip 'Microsoft.Network/publicIPAddresses@2023-09-01' = {
  name: 'pip-nat-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: { name: 'Standard' }
  properties: { publicIPAllocationMethod: 'Static' }
}

resource natGateway 'Microsoft.Network/natGateways@2023-09-01' = {
  name: 'nat-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: { name: 'Standard' }
  properties: {
    publicIpAddresses: [{ id: natGatewayPip.id }]
    idleTimeoutInMinutes: 10
  }
}

resource firewallPip 'Microsoft.Network/publicIPAddresses@2023-09-01' = {
  name: 'pip-fw-${projectName}-${suffix}'
  location: location
  tags: tags
  sku: { name: 'Standard' }
  properties: { publicIPAllocationMethod: 'Static' }
}

resource firewall 'Microsoft.Network/azureFirewalls@2023-09-01' = {
  name: 'fw-${projectName}-${suffix}'
  location: location
  tags: tags
  properties: {
    sku: { name: 'AZFW_VNet', tier: 'Standard' }
    ipConfigurations: [{
      name: 'fw-ipconfig'
      properties: {
        publicIPAddress: { id: firewallPip.id }
        subnet: { id: vnet.properties.subnets[3].id }
      }
    }]
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: take('kv-${projectName}-${suffix}', 24)
  location: location
  tags: tags
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    networkAcls: { defaultAction: 'Deny', bypass: 'AzureServices' }
  }
}

resource dnsZoneOpenAi 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.openai.azure.com'
  location: 'global'
  tags: tags
}

resource dnsZoneSearch 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.search.windows.net'
  location: 'global'
  tags: tags
}

resource dnsZoneVault 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.vaultcore.azure.net'
  location: 'global'
  tags: tags
}

resource dnsLinkOpenAi 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: dnsZoneOpenAi
  name: 'link-openai'
  location: 'global'
  properties: { virtualNetwork: { id: vnet.id }, registrationEnabled: false }
}

resource dnsLinkSearch 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: dnsZoneSearch
  name: 'link-search'
  location: 'global'
  properties: { virtualNetwork: { id: vnet.id }, registrationEnabled: false }
}

resource dnsLinkVault 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: dnsZoneVault
  name: 'link-vault'
  location: 'global'
  properties: { virtualNetwork: { id: vnet.id }, registrationEnabled: false }
}

output vnetId string = vnet.id
output keyVaultUri string = keyVault.properties.vaultUri
output firewallPrivateIp string = firewall.properties.ipConfigurations[0].properties.privateIPAddress