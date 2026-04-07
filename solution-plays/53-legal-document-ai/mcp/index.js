// MCP Plugin for Legal Document Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "53-legal-document-ai",
  version: "1.0.0",
  tools: [
    {
      name: "legal_document_ai_search",
      description: "Search Legal Document Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "legal_document_ai_evaluate",
      description: "Run evaluation for Legal Document Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
