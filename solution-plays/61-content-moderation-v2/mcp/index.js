// MCP Plugin for Content Moderation V2
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "61-content-moderation-v2",
  version: "1.0.0",
  tools: [
    {
      name: "content_moderation_v2_search",
      description: "Search Content Moderation V2 knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "content_moderation_v2_evaluate",
      description: "Run evaluation for Content Moderation V2",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
