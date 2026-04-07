// MCP Plugin for Foundry Local On Device
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "44-foundry-local-on-device",
  version: "1.0.0",
  tools: [
    {
      name: "foundry_local_on_device_search",
      description: "Search Foundry Local On Device knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "foundry_local_on_device_evaluate",
      description: "Run evaluation for Foundry Local On Device",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
