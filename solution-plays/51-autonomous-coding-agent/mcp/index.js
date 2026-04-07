// MCP Plugin for Autonomous Coding Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "51-autonomous-coding-agent",
  version: "1.0.0",
  tools: [
    {
      name: "autonomous_coding_agent_search",
      description: "Search Autonomous Coding Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "autonomous_coding_agent_evaluate",
      description: "Run evaluation for Autonomous Coding Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
