# ─── Cost-Optimized AI Gateway — Terraform Providers ─────────────
# FrootAI Solution Play 14
# Equivalent to: infra/main.bicep (provider/backend section)

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Uncomment and configure for remote state
  # backend "azurerm" {
  #   resource_group_name  = "rg-frootai-tfstate"
  #   storage_account_name = "stfrootaitfstate"
  #   container_name       = "tfstate"
  #   key                  = "play-14-cost-optimized-ai-gateway.tfstate"
  # }
}

provider "azurerm" {
  features {
    cognitive_account {
      purge_soft_delete_on_destroy = false
    }
    key_vault {
      purge_soft_delete_on_destroy    = false
      recover_soft_deleted_key_vaults = true
    }
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}

provider "random" {}
