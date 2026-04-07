// MCP Plugin for Semantic Code Search
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "56-semantic-code-search",
  version: "1.0.0",
  tools: [
    {
      name: "semantic_code_search_search",
      description: "Search Semantic Code Search knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "semantic_code_search_evaluate",
      description: "Run evaluation for Semantic Code Search",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
