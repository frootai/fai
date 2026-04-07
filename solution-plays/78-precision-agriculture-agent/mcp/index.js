// MCP Plugin for Precision Agriculture Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "78-precision-agriculture-agent",
  version: "1.0.0",
  tools: [
    {
      name: "precision_agriculture_agent_search",
      description: "Search Precision Agriculture Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "precision_agriculture_agent_evaluate",
      description: "Run evaluation for Precision Agriculture Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
