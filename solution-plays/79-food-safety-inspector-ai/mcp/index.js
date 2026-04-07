// MCP Plugin for Food Safety Inspector Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "79-food-safety-inspector-ai",
  version: "1.0.0",
  tools: [
    {
      name: "food_safety_inspector_ai_search",
      description: "Search Food Safety Inspector Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "food_safety_inspector_ai_evaluate",
      description: "Run evaluation for Food Safety Inspector Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
