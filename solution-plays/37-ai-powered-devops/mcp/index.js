// MCP Plugin for Ai Powered Devops
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "37-ai-powered-devops",
  version: "1.0.0",
  tools: [
    {
      name: "ai_powered_devops_search",
      description: "Search Ai Powered Devops knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_powered_devops_evaluate",
      description: "Run evaluation for Ai Powered Devops",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
