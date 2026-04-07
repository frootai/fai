// MCP Plugin for Semantic Search Engine
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "26-semantic-search-engine",
  version: "1.0.0",
  tools: [
    {
      name: "semantic_search_engine_search",
      description: "Search Semantic Search Engine knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "semantic_search_engine_evaluate",
      description: "Run evaluation for Semantic Search Engine",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
