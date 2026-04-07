// MCP Plugin for Policy Impact Analyzer
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "85-policy-impact-analyzer",
  version: "1.0.0",
  tools: [
    {
      name: "policy_impact_analyzer_search",
      description: "Search Policy Impact Analyzer knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "policy_impact_analyzer_evaluate",
      description: "Run evaluation for Policy Impact Analyzer",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
