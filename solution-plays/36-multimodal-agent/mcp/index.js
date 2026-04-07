// MCP Plugin for Multimodal Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "36-multimodal-agent",
  version: "1.0.0",
  tools: [
    {
      name: "multimodal_agent_search",
      description: "Search Multimodal Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "multimodal_agent_evaluate",
      description: "Run evaluation for Multimodal Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
