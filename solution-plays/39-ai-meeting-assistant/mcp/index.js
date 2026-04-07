// MCP Plugin for Ai Meeting Assistant
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "39-ai-meeting-assistant",
  version: "1.0.0",
  tools: [
    {
      name: "ai_meeting_assistant_search",
      description: "Search Ai Meeting Assistant knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_meeting_assistant_evaluate",
      description: "Run evaluation for Ai Meeting Assistant",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
