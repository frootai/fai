# ─── Cost-Optimized AI Gateway — Outputs ─────────────────────────
# FrootAI Solution Play 14

output "openai_endpoint" {
  description = "Azure OpenAI service endpoint URL"
  value       = azurerm_cognitive_account.openai.endpoint
}

output "openai_principal_id" {
  description = "Azure OpenAI system-assigned managed identity principal ID (for RBAC)"
  value       = azurerm_cognitive_account.openai.identity[0].principal_id
}

output "key_vault_uri" {
  description = "Azure Key Vault URI for secret management"
  value       = azurerm_key_vault.main.vault_uri
}

output "app_insights_connection_string" {
  description = "Application Insights connection string for telemetry"
  value       = azurerm_application_insights.main.connection_string
  sensitive   = true
}

output "app_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "storage_account_name" {
  description = "Storage account name for data and artifacts"
  value       = azurerm_storage_account.main.name
}

output "log_analytics_workspace_id" {
  description = "Log Analytics workspace resource ID"
  value       = azurerm_log_analytics_workspace.main.id
}

output "gpt4o_deployment_name" {
  description = "Name of the GPT-4o model deployment"
  value       = azurerm_cognitive_deployment.gpt4o.name
}

output "embedding_deployment_name" {
  description = "Name of the text-embedding-3-large model deployment"
  value       = azurerm_cognitive_deployment.embedding.name
}

output "is_production" {
  description = "Whether this deployment is in production mode"
  value       = local.is_production
}
