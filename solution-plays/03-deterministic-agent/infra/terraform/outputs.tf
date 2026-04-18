# ─── Deterministic Agent — Outputs ────────────────────────────────
# FrootAI Solution Play 03

output "openai_endpoint" {
  description = "Azure OpenAI service endpoint URL"
  value       = azurerm_cognitive_account.openai.endpoint
}

output "content_safety_endpoint" {
  description = "Azure Content Safety endpoint URL"
  value       = azurerm_cognitive_account.content_safety.endpoint
}

output "storage_account_name" {
  description = "Storage account name for conversation logs"
  value       = azurerm_storage_account.main.name
}

output "container_app_fqdn" {
  description = "FQDN of the Agent API container app"
  value       = azurerm_container_app.agent_api.ingress[0].fqdn
}

output "identity_client_id" {
  description = "Client ID of the user-assigned managed identity"
  value       = azurerm_user_assigned_identity.main.client_id
}

output "log_analytics_workspace_id" {
  description = "Log Analytics workspace resource ID"
  value       = azurerm_log_analytics_workspace.main.id
}

output "openai_deployment_name" {
  description = "Name of the deterministic GPT-4o deployment"
  value       = azurerm_cognitive_deployment.gpt4o_deterministic.name
}
