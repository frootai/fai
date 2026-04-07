// MCP Plugin for Knowledge Graph Rag
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "28-knowledge-graph-rag",
  version: "1.0.0",
  tools: [
    {
      name: "knowledge_graph_rag_search",
      description: "Search Knowledge Graph Rag knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "knowledge_graph_rag_evaluate",
      description: "Run evaluation for Knowledge Graph Rag",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
