// MCP Plugin for Dynamic Pricing Engine
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "87-dynamic-pricing-engine",
  version: "1.0.0",
  tools: [
    {
      name: "dynamic_pricing_engine_search",
      description: "Search Dynamic Pricing Engine knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "dynamic_pricing_engine_evaluate",
      description: "Run evaluation for Dynamic Pricing Engine",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
