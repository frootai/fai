// MCP Plugin for Responsible Ai Dashboard
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "60-responsible-ai-dashboard",
  version: "1.0.0",
  tools: [
    {
      name: "responsible_ai_dashboard_search",
      description: "Search Responsible Ai Dashboard knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "responsible_ai_dashboard_evaluate",
      description: "Run evaluation for Responsible Ai Dashboard",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
