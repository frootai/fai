// MCP Plugin for Agentic Rag
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "21-agentic-rag",
  version: "1.0.0",
  tools: [
    {
      name: "agentic_rag_search",
      description: "Search Agentic Rag knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "agentic_rag_evaluate",
      description: "Run evaluation for Agentic Rag",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
