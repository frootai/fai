// MCP Plugin for Ai Security Hardening
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "30-ai-security-hardening",
  version: "1.0.0",
  tools: [
    {
      name: "ai_security_hardening_search",
      description: "Search Ai Security Hardening knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "ai_security_hardening_evaluate",
      description: "Run evaluation for Ai Security Hardening",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
