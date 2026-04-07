// MCP Plugin for Low Code Ai Builder
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "31-low-code-ai-builder",
  version: "1.0.0",
  tools: [
    {
      name: "low_code_ai_builder_search",
      description: "Search Low Code Ai Builder knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "low_code_ai_builder_evaluate",
      description: "Run evaluation for Low Code Ai Builder",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
