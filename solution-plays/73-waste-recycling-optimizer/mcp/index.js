// MCP Plugin for Waste Recycling Optimizer
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "73-waste-recycling-optimizer",
  version: "1.0.0",
  tools: [
    {
      name: "waste_recycling_optimizer_search",
      description: "Search Waste Recycling Optimizer knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "waste_recycling_optimizer_evaluate",
      description: "Run evaluation for Waste Recycling Optimizer",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
