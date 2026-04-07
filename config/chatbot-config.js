// FrootAI Chatbot — Azure OpenAI Configuration
// This file stores the Azure OpenAI connection details for the website chatbot.
// The actual API call happens server-side (or via a proxy function) to avoid exposing keys in the browser.

const { AGENT_FAI_SYSTEM_PROMPT } = require("./agent-fai-prompt");

module.exports = {
  // Azure AI Services resource (rg-dev)
  resourceName: "cs-openai-varcvenlme53e",
  endpoint: "https://cs-openai-varcvenlme53e.cognitiveservices.azure.com/",
  deploymentName: "gpt-4.1",
  modelName: "gpt-4.1",
  modelVersion: "2025-04-14",
  apiVersion: "2024-10-21",
  resourceGroup: "rg-dev",
  subscriptionId: "37ffd444-46e0-41dd-9e4b-f12857262095",

  // Grounding context file (feed as system message)
  groundingContextPath: "/grounding-context.md",

  // Architecture:
  // Option A: Azure Functions proxy (recommended for production)
  //   - Deploy a simple Azure Function that calls Azure OpenAI
  //   - The function uses DefaultAzureCredential (managed identity)
  //   - The website calls the function URL (no keys in browser)
  //
  // Option B: Direct API call (for development/demo only)
  //   - Set AZURE_OPENAI_KEY environment variable
  //   - Call endpoint directly from browser (NOT recommended for production)
  //
  // Option C: Azure Static Web Apps built-in API (if hosted on SWA)
  //   - Use /api/ route to proxy to Azure OpenAI
  //   - Auto-managed auth, no key exposure

  // System prompt for the chatbot — imported from shared agent-fai-prompt.js
  systemPrompt: AGENT_FAI_SYSTEM_PROMPT,
};
