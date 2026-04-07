// MCP Plugin for Ai Customer Support V2
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "54-ai-customer-support-v2",
  version: "1.0.0",
  tools: [
    {
      name: "ai_customer_support_v2_search",
      description: "Search Ai Customer Support V2 knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_customer_support_v2_evaluate",
      description: "Run evaluation for Ai Customer Support V2",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
