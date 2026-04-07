// MCP Plugin for Supply Chain Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "55-supply-chain-ai",
  version: "1.0.0",
  tools: [
    {
      name: "supply_chain_ai_search",
      description: "Search Supply Chain Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "supply_chain_ai_evaluate",
      description: "Run evaluation for Supply Chain Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
