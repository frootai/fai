// MCP Plugin for Continual Learning Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "93-continual-learning-agent",
  version: "1.0.0",
  tools: [
    {
      name: "continual_learning_agent_search",
      description: "Search Continual Learning Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "continual_learning_agent_evaluate",
      description: "Run evaluation for Continual Learning Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
