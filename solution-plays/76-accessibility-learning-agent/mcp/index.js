// MCP Plugin for Accessibility Learning Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "76-accessibility-learning-agent",
  version: "1.0.0",
  tools: [
    {
      name: "accessibility_learning_agent_search",
      description: "Search Accessibility Learning Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "accessibility_learning_agent_evaluate",
      description: "Run evaluation for Accessibility Learning Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
