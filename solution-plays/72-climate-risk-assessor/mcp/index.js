// MCP Plugin for Climate Risk Assessor
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "72-climate-risk-assessor",
  version: "1.0.0",
  tools: [
    {
      name: "climate_risk_assessor_search",
      description: "Search Climate Risk Assessor knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "climate_risk_assessor_evaluate",
      description: "Run evaluation for Climate Risk Assessor",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
