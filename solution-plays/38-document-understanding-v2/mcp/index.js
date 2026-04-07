// MCP Plugin for Document Understanding V2
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "38-document-understanding-v2",
  version: "1.0.0",
  tools: [
    {
      name: "document_understanding_v2_search",
      description: "Search Document Understanding V2 knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "document_understanding_v2_evaluate",
      description: "Run evaluation for Document Understanding V2",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
