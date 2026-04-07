// MCP Plugin for Telecom Fraud Shield
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "92-telecom-fraud-shield",
  version: "1.0.0",
  tools: [
    {
      name: "telecom_fraud_shield_search",
      description: "Search Telecom Fraud Shield knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "telecom_fraud_shield_evaluate",
      description: "Run evaluation for Telecom Fraud Shield",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
