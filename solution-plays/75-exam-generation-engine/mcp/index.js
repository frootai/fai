// MCP Plugin for Exam Generation Engine
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "75-exam-generation-engine",
  version: "1.0.0",
  tools: [
    {
      name: "exam_generation_engine_search",
      description: "Search Exam Generation Engine knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "exam_generation_engine_evaluate",
      description: "Run evaluation for Exam Generation Engine",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
