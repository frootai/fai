// MCP Plugin for Smart Energy Grid Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "71-smart-energy-grid-ai",
  version: "1.0.0",
  tools: [
    {
      name: "smart_energy_grid_ai_search",
      description: "Search Smart Energy Grid Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "smart_energy_grid_ai_evaluate",
      description: "Run evaluation for Smart Energy Grid Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
