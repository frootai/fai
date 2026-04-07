// MCP Plugin for Creative Ai Studio
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "49-creative-ai-studio",
  version: "1.0.0",
  tools: [
    {
      name: "creative_ai_studio_search",
      description: "Search Creative Ai Studio knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "creative_ai_studio_evaluate",
      description: "Run evaluation for Creative Ai Studio",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
