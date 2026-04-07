// MCP Plugin for Computer Use Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "42-computer-use-agent",
  version: "1.0.0",
  tools: [
    {
      name: "computer_use_agent_search",
      description: "Search Computer Use Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "computer_use_agent_evaluate",
      description: "Run evaluation for Computer Use Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
