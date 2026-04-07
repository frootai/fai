// MCP Plugin for Ai Data Marketplace
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "97-ai-data-marketplace",
  version: "1.0.0",
  tools: [
    {
      name: "ai_data_marketplace_search",
      description: "Search Ai Data Marketplace knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_data_marketplace_evaluate",
      description: "Run evaluation for Ai Data Marketplace",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
