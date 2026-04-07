// MCP Plugin for Financial Risk Intelligence
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "50-financial-risk-intelligence",
  version: "1.0.0",
  tools: [
    {
      name: "financial_risk_intelligence_search",
      description: "Search Financial Risk Intelligence knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "financial_risk_intelligence_evaluate",
      description: "Run evaluation for Financial Risk Intelligence",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
