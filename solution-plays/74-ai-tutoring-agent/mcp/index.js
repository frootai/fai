// MCP Plugin for Ai Tutoring Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "74-ai-tutoring-agent",
  version: "1.0.0",
  tools: [
    {
      name: "ai_tutoring_agent_search",
      description: "Search Ai Tutoring Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_tutoring_agent_evaluate",
      description: "Run evaluation for Ai Tutoring Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
