// MCP Plugin for Fraud Detection Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "63-fraud-detection-agent",
  version: "1.0.0",
  tools: [
    {
      name: "fraud_detection_agent_search",
      description: "Search Fraud Detection Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "fraud_detection_agent_evaluate",
      description: "Run evaluation for Fraud Detection Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
