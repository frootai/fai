// MCP Plugin for Research Paper Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "77-research-paper-ai",
  version: "1.0.0",
  tools: [
    {
      name: "research_paper_ai_search",
      description: "Search Research Paper Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "research_paper_ai_evaluate",
      description: "Run evaluation for Research Paper Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
