// MCP Plugin for Ai Powered Testing
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "32-ai-powered-testing",
  version: "1.0.0",
  tools: [
    {
      name: "ai_powered_testing_search",
      description: "Search Ai Powered Testing knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_powered_testing_evaluate",
      description: "Run evaluation for Ai Powered Testing",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
