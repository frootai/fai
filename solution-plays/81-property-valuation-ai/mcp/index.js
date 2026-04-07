// MCP Plugin for Property Valuation Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "81-property-valuation-ai",
  version: "1.0.0",
  tools: [
    {
      name: "property_valuation_ai_search",
      description: "Search Property Valuation Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "property_valuation_ai_evaluate",
      description: "Run evaluation for Property Valuation Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
