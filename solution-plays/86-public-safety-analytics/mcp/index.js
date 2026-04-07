// MCP Plugin for Public Safety Analytics
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "86-public-safety-analytics",
  version: "1.0.0",
  tools: [
    {
      name: "public_safety_analytics_search",
      description: "Search Public Safety Analytics knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "public_safety_analytics_evaluate",
      description: "Run evaluation for Public Safety Analytics",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
