// MCP Plugin for Ai Model Governance
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "48-ai-model-governance",
  version: "1.0.0",
  tools: [
    {
      name: "ai_model_governance_search",
      description: "Search Ai Model Governance knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_model_governance_evaluate",
      description: "Run evaluation for Ai Model Governance",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
