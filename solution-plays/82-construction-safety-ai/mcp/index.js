// MCP Plugin for Construction Safety Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "82-construction-safety-ai",
  version: "1.0.0",
  tools: [
    {
      name: "construction_safety_ai_search",
      description: "Search Construction Safety Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "construction_safety_ai_evaluate",
      description: "Run evaluation for Construction Safety Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
