// MCP Plugin for Ai Translation Engine
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "57-ai-translation-engine",
  version: "1.0.0",
  tools: [
    {
      name: "ai_translation_engine_search",
      description: "Search Ai Translation Engine knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_translation_engine_evaluate",
      description: "Run evaluation for Ai Translation Engine",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
