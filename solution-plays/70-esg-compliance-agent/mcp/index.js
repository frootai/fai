// MCP Plugin for Esg Compliance Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "70-esg-compliance-agent",
  version: "1.0.0",
  tools: [
    {
      name: "esg_compliance_agent_search",
      description: "Search Esg Compliance Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "esg_compliance_agent_evaluate",
      description: "Run evaluation for Esg Compliance Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
