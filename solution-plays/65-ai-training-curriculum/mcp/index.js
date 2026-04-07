// MCP Plugin for Ai Training Curriculum
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "65-ai-training-curriculum",
  version: "1.0.0",
  tools: [
    {
      name: "ai_training_curriculum_search",
      description: "Search Ai Training Curriculum knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_training_curriculum_evaluate",
      description: "Run evaluation for Ai Training Curriculum",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
