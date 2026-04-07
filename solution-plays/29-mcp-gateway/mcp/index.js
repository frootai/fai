// MCP Plugin for Mcp Gateway
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "29-mcp-gateway",
  version: "1.0.0",
  tools: [
    {
      name: "mcp_gateway_search",
      description: "Search Mcp Gateway knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "mcp_gateway_evaluate",
      description: "Run evaluation for Mcp Gateway",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
