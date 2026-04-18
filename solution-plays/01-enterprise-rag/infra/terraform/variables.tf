# ─── Enterprise RAG Q&A — Input Variables ─────────────────────────
# FrootAI Solution Play 01

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "eastus2"
}

variable "environment" {
  description = "Environment: dev, staging, or prod"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "frootai-rag"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.project_name))
    error_message = "Project name must be lowercase alphanumeric with hyphens only."
  }
}

variable "resource_group_name" {
  description = "Name of the Azure resource group to deploy into"
  type        = string
}

variable "gpt4o_capacity" {
  description = "Token-per-minute capacity (in thousands) for GPT-4o deployment"
  type        = number
  default     = 30
}

variable "search_sku" {
  description = "SKU for Azure AI Search service"
  type        = string
  default     = "standard"

  validation {
    condition     = contains(["free", "basic", "standard", "standard2", "standard3"], var.search_sku)
    error_message = "Search SKU must be one of: free, basic, standard, standard2, standard3."
  }
}

variable "container_app_cpu" {
  description = "CPU cores allocated to the RAG API container"
  type        = number
  default     = 0.5
}

variable "container_app_memory" {
  description = "Memory allocated to the RAG API container (e.g. 1Gi)"
  type        = string
  default     = "1Gi"
}

variable "container_image" {
  description = "Container image for the RAG API"
  type        = string
  default     = "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest"
}

variable "log_retention_days" {
  description = "Log Analytics workspace retention in days"
  type        = number
  default     = 90

  validation {
    condition     = var.log_retention_days >= 30 && var.log_retention_days <= 730
    error_message = "Retention must be between 30 and 730 days."
  }
}

variable "max_replicas" {
  description = "Maximum number of container replicas for auto-scaling"
  type        = number
  default     = 10
}
