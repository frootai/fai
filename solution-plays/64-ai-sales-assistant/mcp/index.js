// MCP Plugin for Ai Sales Assistant
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "64-ai-sales-assistant",
  version: "1.0.0",
  tools: [
    {
      name: "ai_sales_assistant_search",
      description: "Search Ai Sales Assistant knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_sales_assistant_evaluate",
      description: "Run evaluation for Ai Sales Assistant",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
