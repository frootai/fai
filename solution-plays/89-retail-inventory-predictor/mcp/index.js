// MCP Plugin for Retail Inventory Predictor
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "89-retail-inventory-predictor",
  version: "1.0.0",
  tools: [
    {
      name: "retail_inventory_predictor_search",
      description: "Search Retail Inventory Predictor knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "retail_inventory_predictor_evaluate",
      description: "Run evaluation for Retail Inventory Predictor",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
