// MCP Plugin for Ai Recruiter Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "59-ai-recruiter-agent",
  version: "1.0.0",
  tools: [
    {
      name: "ai_recruiter_agent_search",
      description: "Search Ai Recruiter Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_recruiter_agent_evaluate",
      description: "Run evaluation for Ai Recruiter Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
