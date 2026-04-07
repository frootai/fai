// MCP Plugin for Multimodal Search V2
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "95-multimodal-search-v2",
  version: "1.0.0",
  tools: [
    {
      name: "multimodal_search_v2_search",
      description: "Search Multimodal Search V2 knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "multimodal_search_v2_evaluate",
      description: "Run evaluation for Multimodal Search V2",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
