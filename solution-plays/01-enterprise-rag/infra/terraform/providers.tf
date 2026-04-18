# ─── Enterprise RAG Q&A — Terraform Providers ────────────────────
# FrootAI Solution Play 01
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
  #   key                  = "play-01-enterprise-rag.tfstate"
  # }
}

provider "azurerm" {
  features {
    cognitive_account {
      purge_soft_delete_on_destroy = false
    }
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
  }
}

provider "random" {}
