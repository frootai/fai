// MCP Plugin for Ai Api Gateway V2
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "52-ai-api-gateway-v2",
  version: "1.0.0",
  tools: [
    {
      name: "ai_api_gateway_v2_search",
      description: "Search Ai Api Gateway V2 knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_api_gateway_v2_evaluate",
      description: "Run evaluation for Ai Api Gateway V2",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
