// MCP Plugin for Agent Evaluation Platform
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "98-agent-evaluation-platform",
  version: "1.0.0",
  tools: [
    {
      name: "agent_evaluation_platform_search",
      description: "Search Agent Evaluation Platform knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "agent_evaluation_platform_evaluate",
      description: "Run evaluation for Agent Evaluation Platform",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
