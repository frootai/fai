// MCP Plugin for Voice Ai Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "33-voice-ai-agent",
  version: "1.0.0",
  tools: [
    {
      name: "voice_ai_agent_search",
      description: "Search Voice Ai Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "voice_ai_agent_evaluate",
      description: "Run evaluation for Voice Ai Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
