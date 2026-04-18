# ─── Enterprise RAG Q&A — Outputs ─────────────────────────────────
# FrootAI Solution Play 01

output "openai_endpoint" {
  description = "Azure OpenAI service endpoint URL"
  value       = azurerm_cognitive_account.openai.endpoint
}

output "search_endpoint" {
  description = "Azure AI Search service endpoint URL"
  value       = "https://${azurerm_search_service.main.name}.search.windows.net"
}

output "storage_account_name" {
  description = "Storage account name for document storage"
  value       = azurerm_storage_account.main.name
}

output "container_app_fqdn" {
  description = "FQDN of the RAG API container app"
  value       = azurerm_container_app.rag_api.ingress[0].fqdn
}

output "identity_client_id" {
  description = "Client ID of the user-assigned managed identity"
  value       = azurerm_user_assigned_identity.main.client_id
}

output "log_analytics_workspace_id" {
  description = "Log Analytics workspace resource ID"
  value       = azurerm_log_analytics_workspace.main.id
}
