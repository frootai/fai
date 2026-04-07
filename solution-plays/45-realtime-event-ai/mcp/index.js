// MCP Plugin for Realtime Event Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "45-realtime-event-ai",
  version: "1.0.0",
  tools: [
    {
      name: "realtime_event_ai_search",
      description: "Search Realtime Event Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "realtime_event_ai_evaluate",
      description: "Run evaluation for Realtime Event Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
