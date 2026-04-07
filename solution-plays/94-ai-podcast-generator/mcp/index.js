// MCP Plugin for Ai Podcast Generator
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "94-ai-podcast-generator",
  version: "1.0.0",
  tools: [
    {
      name: "ai_podcast_generator_search",
      description: "Search Ai Podcast Generator knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_podcast_generator_evaluate",
      description: "Run evaluation for Ai Podcast Generator",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
