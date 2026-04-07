// MCP Plugin for Ai Infrastructure Optimizer
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "66-ai-infrastructure-optimizer",
  version: "1.0.0",
  tools: [
    {
      name: "ai_infrastructure_optimizer_search",
      description: "Search Ai Infrastructure Optimizer knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_infrastructure_optimizer_evaluate",
      description: "Run evaluation for Ai Infrastructure Optimizer",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
