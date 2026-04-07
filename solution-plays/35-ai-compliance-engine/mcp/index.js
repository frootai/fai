// MCP Plugin for Ai Compliance Engine
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "35-ai-compliance-engine",
  version: "1.0.0",
  tools: [
    {
      name: "ai_compliance_engine_search",
      description: "Search Ai Compliance Engine knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_compliance_engine_evaluate",
      description: "Run evaluation for Ai Compliance Engine",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
