// MCP Plugin for Carbon Footprint Tracker
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "69-carbon-footprint-tracker",
  version: "1.0.0",
  tools: [
    {
      name: "carbon_footprint_tracker_search",
      description: "Search Carbon Footprint Tracker knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "carbon_footprint_tracker_evaluate",
      description: "Run evaluation for Carbon Footprint Tracker",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
