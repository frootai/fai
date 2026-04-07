// MCP Plugin for Digital Twin Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "58-digital-twin-agent",
  version: "1.0.0",
  tools: [
    {
      name: "digital_twin_agent_search",
      description: "Search Digital Twin Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "digital_twin_agent_evaluate",
      description: "Run evaluation for Digital Twin Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
