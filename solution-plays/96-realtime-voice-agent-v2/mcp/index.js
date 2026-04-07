// MCP Plugin for Realtime Voice Agent V2
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "96-realtime-voice-agent-v2",
  version: "1.0.0",
  tools: [
    {
      name: "realtime_voice_agent_v2_search",
      description: "Search Realtime Voice Agent V2 knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "realtime_voice_agent_v2_evaluate",
      description: "Run evaluation for Realtime Voice Agent V2",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
