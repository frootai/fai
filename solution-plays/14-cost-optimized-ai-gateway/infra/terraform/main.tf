# ─── Cost-Optimized AI Gateway — Azure Infrastructure ────────────
# FrootAI Solution Play 14
# Equivalent to: infra/main.bicep
# Deploy: terraform init && terraform plan -var-file=terraform.tfvars

# ─── DATA SOURCES ─────────────────────────────────────────────────

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

data "azurerm_client_config" "current" {}

# ─── LOCALS ───────────────────────────────────────────────────────

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

locals {
  suffix          = random_string.suffix.result
  resource_prefix = "${var.prefix}-${var.environment}"
  is_production   = var.environment == "prod"

  tags = {
    project     = "frootai"
    play        = "14"
    playName    = "Cost Optimized Ai Gateway"
    environment = var.environment
    managedBy   = "terraform"
  }

  # Environment-aware configuration
  log_retention       = local.is_production ? var.log_retention_days_prod : var.log_retention_days_dev
  gpt4o_capacity      = local.is_production ? var.gpt4o_capacity_prod : var.gpt4o_capacity
  embedding_capacity  = local.is_production ? var.embedding_capacity_prod : var.embedding_capacity
  storage_replication = local.is_production ? "GRS" : "LRS"
  network_default     = local.is_production ? "Deny" : "Allow"
  soft_delete_days    = local.is_production ? var.soft_delete_retention_days_prod : var.soft_delete_retention_days_dev

  # Well-known Azure built-in role definition IDs
  role_cognitive_services_openai_user = "a97b65f3-24c7-4388-baec-2e87135dc908"
  role_key_vault_secrets_user         = "4633458b-17de-408a-b874-0445c86b69e6"
  role_storage_blob_data_reader       = "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1"

  assign_rbac = var.rbac_principal_id != ""
}

# ─── LOG ANALYTICS WORKSPACE ─────────────────────────────────────

resource "azurerm_log_analytics_workspace" "main" {
  name                = "${local.resource_prefix}-logs"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  sku                 = "PerGB2018"
  retention_in_days   = local.log_retention
  tags                = local.tags

  lifecycle {
    ignore_changes = [tags["createdDate"]]
  }
}

# ─── APPLICATION INSIGHTS ────────────────────────────────────────

resource "azurerm_application_insights" "main" {
  name                = "${local.resource_prefix}-insights"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"
  retention_in_days   = local.log_retention
  tags                = local.tags
}

# ─── KEY VAULT ────────────────────────────────────────────────────

resource "azurerm_key_vault" "main" {
  name                       = "kv-${var.prefix}-${local.suffix}"
  resource_group_name        = data.azurerm_resource_group.main.name
  location                   = var.location
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  enable_rbac_authorization  = true
  soft_delete_retention_days = local.soft_delete_days
  purge_protection_enabled   = local.is_production
  tags                       = local.tags

  network_acls {
    default_action = local.network_default
    bypass         = "AzureServices"
  }

  lifecycle {
    ignore_changes = [tags["createdDate"]]
  }
}

# ─── AZURE OPENAI ─────────────────────────────────────────────────

resource "azurerm_cognitive_account" "openai" {
  name                  = "${local.resource_prefix}-openai"
  resource_group_name   = data.azurerm_resource_group.main.name
  location              = var.location
  kind                  = "OpenAI"
  sku_name              = "S0"
  custom_subdomain_name = "${var.prefix}-${local.suffix}"
  tags                  = local.tags

  public_network_access_enabled = !local.is_production

  network_acls {
    default_action = local.network_default
  }

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [tags["createdDate"]]
  }
}

# ─── OPENAI MODEL DEPLOYMENTS ────────────────────────────────────

resource "azurerm_cognitive_deployment" "gpt4o" {
  name                 = "gpt-4o"
  cognitive_account_id = azurerm_cognitive_account.openai.id

  model {
    format  = "OpenAI"
    name    = "gpt-4o"
    version = "2024-11-20"
  }

  sku {
    name     = "GlobalStandard"
    capacity = local.gpt4o_capacity
  }
}

resource "azurerm_cognitive_deployment" "embedding" {
  name                 = "text-embedding-3-large"
  cognitive_account_id = azurerm_cognitive_account.openai.id

  model {
    format  = "OpenAI"
    name    = "text-embedding-3-large"
    version = "1"
  }

  sku {
    name     = "Standard"
    capacity = local.embedding_capacity
  }

  depends_on = [azurerm_cognitive_deployment.gpt4o]
}

# ─── STORAGE ACCOUNT ─────────────────────────────────────────────

resource "azurerm_storage_account" "main" {
  name                     = "st${replace(var.prefix, "-", "")}${local.suffix}"
  resource_group_name      = data.azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = local.storage_replication
  account_kind             = "StorageV2"
  min_tls_version          = "TLS1_2"
  https_traffic_only_enabled      = true
  allow_nested_items_to_be_public = false
  tags = local.tags

  network_rules {
    default_action = local.network_default
    bypass         = ["AzureServices"]
  }

  lifecycle {
    ignore_changes = [tags["createdDate"]]
  }
}

# ─── DIAGNOSTIC SETTINGS ─────────────────────────────────────────

resource "azurerm_monitor_diagnostic_setting" "openai" {
  name                       = "openai-diagnostics"
  target_resource_id         = azurerm_cognitive_account.openai.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category_group = "allLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

resource "azurerm_monitor_diagnostic_setting" "key_vault" {
  name                       = "kv-diagnostics"
  target_resource_id         = azurerm_key_vault.main.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category_group = "allLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = true
  }
}

# ─── RBAC ROLE ASSIGNMENTS ───────────────────────────────────────
# Conditional: only created when rbac_principal_id is provided

resource "azurerm_role_assignment" "cognitive_services_openai_user" {
  count                = local.assign_rbac ? 1 : 0
  scope                = azurerm_cognitive_account.openai.id
  role_definition_name = "Cognitive Services OpenAI User"
  principal_id         = var.rbac_principal_id
  principal_type       = var.rbac_principal_type
}

resource "azurerm_role_assignment" "key_vault_secrets_user" {
  count                = local.assign_rbac ? 1 : 0
  scope                = azurerm_key_vault.main.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = var.rbac_principal_id
  principal_type       = var.rbac_principal_type
}

resource "azurerm_role_assignment" "storage_blob_data_reader" {
  count                = local.assign_rbac ? 1 : 0
  scope                = azurerm_storage_account.main.id
  role_definition_name = "Storage Blob Data Reader"
  principal_id         = var.rbac_principal_id
  principal_type       = var.rbac_principal_type
}
