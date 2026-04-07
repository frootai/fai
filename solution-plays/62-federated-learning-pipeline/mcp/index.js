// MCP Plugin for Federated Learning Pipeline
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "62-federated-learning-pipeline",
  version: "1.0.0",
  tools: [
    {
      name: "federated_learning_pipeline_search",
      description: "Search Federated Learning Pipeline knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "federated_learning_pipeline_evaluate",
      description: "Run evaluation for Federated Learning Pipeline",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
