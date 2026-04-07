// MCP Plugin for Fai Meta Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "100-fai-meta-agent",
  version: "1.0.0",
  tools: [
    {
      name: "fai_meta_agent_search",
      description: "Search Fai Meta Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "fai_meta_agent_evaluate",
      description: "Run evaluation for Fai Meta Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
