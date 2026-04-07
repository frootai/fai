// MCP Plugin for Building Energy Optimizer
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "83-building-energy-optimizer",
  version: "1.0.0",
  tools: [
    {
      name: "building_energy_optimizer_search",
      description: "Search Building Energy Optimizer knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "building_energy_optimizer_evaluate",
      description: "Run evaluation for Building Energy Optimizer",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
