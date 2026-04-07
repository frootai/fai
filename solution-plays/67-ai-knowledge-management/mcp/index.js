// MCP Plugin for Ai Knowledge Management
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "67-ai-knowledge-management",
  version: "1.0.0",
  tools: [
    {
      name: "ai_knowledge_management_search",
      description: "Search Ai Knowledge Management knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_knowledge_management_evaluate",
      description: "Run evaluation for Ai Knowledge Management",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
