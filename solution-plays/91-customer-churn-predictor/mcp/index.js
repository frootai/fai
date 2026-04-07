// MCP Plugin for Customer Churn Predictor
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "91-customer-churn-predictor",
  version: "1.0.0",
  tools: [
    {
      name: "customer_churn_predictor_search",
      description: "Search Customer Churn Predictor knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "customer_churn_predictor_evaluate",
      description: "Run evaluation for Customer Churn Predictor",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
