// MCP Plugin for Ai Data Pipeline
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "27-ai-data-pipeline",
  version: "1.0.0",
  tools: [
    {
      name: "ai_data_pipeline_search",
      description: "Search Ai Data Pipeline knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_data_pipeline_evaluate",
      description: "Run evaluation for Ai Data Pipeline",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
