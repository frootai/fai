// MCP Plugin for Copilot Studio Advanced
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "40-copilot-studio-advanced",
  version: "1.0.0",
  tools: [
    {
      name: "copilot_studio_advanced_search",
      description: "Search Copilot Studio Advanced knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "copilot_studio_advanced_evaluate",
      description: "Run evaluation for Copilot Studio Advanced",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
