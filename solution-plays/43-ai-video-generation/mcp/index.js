// MCP Plugin for Ai Video Generation
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "43-ai-video-generation",
  version: "1.0.0",
  tools: [
    {
      name: "ai_video_generation_search",
      description: "Search Ai Video Generation knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_video_generation_evaluate",
      description: "Run evaluation for Ai Video Generation",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
