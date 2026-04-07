// MCP Plugin for Ai Red Teaming
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "41-ai-red-teaming",
  version: "1.0.0",
  tools: [
    {
      name: "ai_red_teaming_search",
      description: "Search Ai Red Teaming knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_red_teaming_evaluate",
      description: "Run evaluation for Ai Red Teaming",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
