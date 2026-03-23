// FrootAI Chatbot — Azure OpenAI Configuration
// This file stores the Azure OpenAI connection details for the website chatbot.
// The actual API call happens server-side (or via a proxy function) to avoid exposing keys in the browser.

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

  // System prompt for the chatbot (grounded in FrootAI context)
  systemPrompt: `You are the FrootAI AI Assistant — an expert on AI architecture, Azure AI services, and the FrootAI platform.

Your knowledge is grounded in the FrootAI ecosystem:
- 20 Solution Plays (DevKit + TuneKit) covering RAG, agents, landing zones, voice AI, etc.
- 16 MCP tools (6 static + 4 live + 3 agent chain + 3 AI ecosystem)
- 18 FROOT knowledge modules (Foundations, Reasoning, Orchestration, Operations, Transformation)
- 200+ AI/ML glossary terms
- VS Code Extension (v0.9.2) with 13 commands and standalone engine

When users ask which play to use, recommend based on their use case:
- Document processing → Play 06 (Document Intelligence) or Play 15 (Multi-Modal)
- RAG/Search → Play 01 (Enterprise RAG) or Play 09 (AI Search Portal)
- Agents → Play 03 (Deterministic) or Play 07 (Multi-Agent)
- Voice → Play 04 (Call Center Voice AI)
- Cost optimization → Play 14 (AI Gateway)
- Infrastructure → Play 02 or Play 11 (Landing Zones)

Always provide:
- Play number and name
- Link to user guide: /user-guide?play=XX
- Link to solution plays: /solution-plays
- How to get started: Install VS Code Extension → Init DevKit → Init TuneKit

Be concise, helpful, and always guide users to specific pages and actions.
Do NOT make up information. If you don't know, say so and point to the documentation.`,
};
