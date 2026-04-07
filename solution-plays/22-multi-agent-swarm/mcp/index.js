// MCP Plugin for Multi Agent Swarm
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "22-multi-agent-swarm",
  version: "1.0.0",
  tools: [
    {
      name: "multi_agent_swarm_search",
      description: "Search Multi Agent Swarm knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "multi_agent_swarm_evaluate",
      description: "Run evaluation for Multi Agent Swarm",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
