// MCP Plugin for Biodiversity Monitor
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "80-biodiversity-monitor",
  version: "1.0.0",
  tools: [
    {
      name: "biodiversity_monitor_search",
      description: "Search Biodiversity Monitor knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "biodiversity_monitor_evaluate",
      description: "Run evaluation for Biodiversity Monitor",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
