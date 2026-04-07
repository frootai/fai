// MCP Plugin for Network Optimization Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "90-network-optimization-agent",
  version: "1.0.0",
  tools: [
    {
      name: "network_optimization_agent_search",
      description: "Search Network Optimization Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "network_optimization_agent_evaluate",
      description: "Run evaluation for Network Optimization Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
