# ─── Cost-Optimized AI Gateway — Input Variables ─────────────────
# FrootAI Solution Play 14

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

variable "prefix" {
  description = "Resource name prefix"
  type        = string
  default     = "cost-optimiz"

  validation {
    condition     = can(regex("^[a-z0-9-]+$", var.prefix))
    error_message = "Prefix must be lowercase alphanumeric with hyphens only."
  }
}

variable "resource_group_name" {
  description = "Name of the Azure resource group to deploy into"
  type        = string
}

# ─── AZURE OPENAI ─────────────────────────────────────────────────

variable "gpt4o_capacity" {
  description = "Token-per-minute capacity (in thousands) for GPT-4o deployment"
  type        = number
  default     = 10
}

variable "gpt4o_capacity_prod" {
  description = "Token-per-minute capacity for GPT-4o in production"
  type        = number
  default     = 30
}

variable "embedding_capacity" {
  description = "Token-per-minute capacity (in thousands) for embedding deployment"
  type        = number
  default     = 30
}

variable "embedding_capacity_prod" {
  description = "Token-per-minute capacity for embeddings in production"
  type        = number
  default     = 120
}

# ─── KEY VAULT ────────────────────────────────────────────────────

variable "soft_delete_retention_days_prod" {
  description = "Key Vault soft-delete retention in days for production"
  type        = number
  default     = 90
}

variable "soft_delete_retention_days_dev" {
  description = "Key Vault soft-delete retention in days for dev/staging"
  type        = number
  default     = 7
}

# ─── OBSERVABILITY ────────────────────────────────────────────────

variable "log_retention_days_prod" {
  description = "Log Analytics retention in days for production"
  type        = number
  default     = 90

  validation {
    condition     = var.log_retention_days_prod >= 30 && var.log_retention_days_prod <= 730
    error_message = "Retention must be between 30 and 730 days."
  }
}

variable "log_retention_days_dev" {
  description = "Log Analytics retention in days for dev/staging"
  type        = number
  default     = 30

  validation {
    condition     = var.log_retention_days_dev >= 30 && var.log_retention_days_dev <= 730
    error_message = "Retention must be between 30 and 730 days."
  }
}

# ─── RBAC ─────────────────────────────────────────────────────────

variable "rbac_principal_id" {
  description = "Principal ID (object ID) of the identity to assign RBAC roles to. Leave empty to skip RBAC assignments."
  type        = string
  default     = ""
}

variable "rbac_principal_type" {
  description = "The type of the principal for RBAC assignments"
  type        = string
  default     = "ServicePrincipal"

  validation {
    condition     = contains(["User", "Group", "ServicePrincipal"], var.rbac_principal_type)
    error_message = "Principal type must be one of: User, Group, ServicePrincipal."
  }
}
