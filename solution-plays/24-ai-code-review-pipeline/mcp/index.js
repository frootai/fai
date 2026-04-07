// MCP Plugin for Ai Code Review Pipeline
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "24-ai-code-review-pipeline",
  version: "1.0.0",
  tools: [
    {
      name: "ai_code_review_pipeline_search",
      description: "Search Ai Code Review Pipeline knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_code_review_pipeline_evaluate",
      description: "Run evaluation for Ai Code Review Pipeline",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
