// MCP Plugin for Synthetic Data Factory
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "47-synthetic-data-factory",
  version: "1.0.0",
  tools: [
    {
      name: "synthetic_data_factory_search",
      description: "Search Synthetic Data Factory knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "synthetic_data_factory_evaluate",
      description: "Run evaluation for Synthetic Data Factory",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
