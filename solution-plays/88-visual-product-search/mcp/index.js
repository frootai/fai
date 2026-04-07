// MCP Plugin for Visual Product Search
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "88-visual-product-search",
  version: "1.0.0",
  tools: [
    {
      name: "visual_product_search_search",
      description: "Search Visual Product Search knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "visual_product_search_evaluate",
      description: "Run evaluation for Visual Product Search",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
