# ─── Enterprise RAG Q&A — Azure Infrastructure ───────────────────
# FrootAI Solution Play 01
# Equivalent to: infra/main.bicep
# Deploy: terraform init && terraform plan -var-file=terraform.tfvars

# ─── DATA SOURCES ─────────────────────────────────────────────────

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

# ─── LOCALS ───────────────────────────────────────────────────────

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

locals {
  suffix = random_string.suffix.result
  tags = {
    environment = var.environment
    project     = "frootai"
    play        = "01-enterprise-rag"
    managedBy   = "terraform"
  }
}

# ─── MANAGED IDENTITY ────────────────────────────────────────────

resource "azurerm_user_assigned_identity" "main" {
  name                = "${var.project_name}-id-${local.suffix}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  tags                = local.tags
}

# ─── AZURE OPENAI ─────────────────────────────────────────────────

resource "azurerm_cognitive_account" "openai" {
  name                  = "${var.project_name}-oai-${local.suffix}"
  resource_group_name   = data.azurerm_resource_group.main.name
  location              = var.location
  kind                  = "OpenAI"
  sku_name              = "S0"
  custom_subdomain_name = "${var.project_name}-oai-${local.suffix}"
  public_network_access_enabled = true
  tags = local.tags

  identity {
    type = "SystemAssigned"
  }

  lifecycle {
    ignore_changes = [tags["createdDate"]]
  }
}

resource "azurerm_cognitive_deployment" "gpt4o" {
  name                 = "gpt-4o"
  cognitive_account_id = azurerm_cognitive_account.openai.id

  model {
    format  = "OpenAI"
    name    = "gpt-4o"
    version = "2024-08-06"
  }

  sku {
    name     = "Standard"
    capacity = var.gpt4o_capacity
  }
}

# ─── AZURE AI SEARCH ──────────────────────────────────────────────

resource "azurerm_search_service" "main" {
  name                = "${var.project_name}-srch-${local.suffix}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  sku                 = var.search_sku
  replica_count       = 1
  partition_count     = 1
  semantic_search_sku = "standard"
  tags                = local.tags

  lifecycle {
    ignore_changes = [tags["createdDate"]]
  }
}

# ─── STORAGE ACCOUNT (documents) ─────────────────────────────────

resource "azurerm_storage_account" "main" {
  name                     = replace("${var.project_name}st${local.suffix}", "-", "")
  resource_group_name      = data.azurerm_resource_group.main.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  min_tls_version          = "TLS1_2"
  allow_nested_items_to_be_public = false
  https_traffic_only_enabled      = true
  tags = local.tags

  lifecycle {
    ignore_changes = [tags["createdDate"]]
  }
}

resource "azurerm_storage_container" "documents" {
  name                  = "documents"
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = "private"
}

# ─── LOG ANALYTICS WORKSPACE ─────────────────────────────────────

resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.project_name}-law-${local.suffix}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.location
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_days
  tags                = local.tags
}

# ─── CONTAINER APPS ENVIRONMENT & APP ─────────────────────────────

resource "azurerm_container_app_environment" "main" {
  name                       = "${var.project_name}-cae-${local.suffix}"
  resource_group_name        = data.azurerm_resource_group.main.name
  location                   = var.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  tags                       = local.tags
}

resource "azurerm_container_app" "rag_api" {
  name                         = "${var.project_name}-api-${local.suffix}"
  resource_group_name          = data.azurerm_resource_group.main.name
  container_app_environment_id = azurerm_container_app_environment.main.id
  revision_mode                = "Single"
  tags                         = local.tags

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }

  ingress {
    external_enabled = true
    target_port      = 8000
    transport        = "http"

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = 0
    max_replicas = var.max_replicas

    container {
      name   = "rag-api"
      image  = var.container_image
      cpu    = var.container_app_cpu
      memory = var.container_app_memory

      env {
        name  = "AZURE_OPENAI_ENDPOINT"
        value = azurerm_cognitive_account.openai.endpoint
      }
      env {
        name  = "AZURE_SEARCH_ENDPOINT"
        value = "https://${azurerm_search_service.main.name}.search.windows.net"
      }
      env {
        name  = "AZURE_STORAGE_ACCOUNT"
        value = azurerm_storage_account.main.name
      }
      env {
        name  = "AZURE_CLIENT_ID"
        value = azurerm_user_assigned_identity.main.client_id
      }
    }
  }
}
