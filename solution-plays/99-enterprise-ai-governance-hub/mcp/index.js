// MCP Plugin for Enterprise Ai Governance Hub
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "99-enterprise-ai-governance-hub",
  version: "1.0.0",
  tools: [
    {
      name: "enterprise_ai_governance_hub_search",
      description: "Search Enterprise Ai Governance Hub knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "enterprise_ai_governance_hub_evaluate",
      description: "Run evaluation for Enterprise Ai Governance Hub",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
