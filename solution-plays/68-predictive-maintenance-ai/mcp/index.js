// MCP Plugin for Predictive Maintenance Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "68-predictive-maintenance-ai",
  version: "1.0.0",
  tools: [
    {
      name: "predictive_maintenance_ai_search",
      description: "Search Predictive Maintenance Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "predictive_maintenance_ai_evaluate",
      description: "Run evaluation for Predictive Maintenance Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
