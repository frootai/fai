// MCP Plugin for Conversation Memory Layer
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "25-conversation-memory-layer",
  version: "1.0.0",
  tools: [
    {
      name: "conversation_memory_layer_search",
      description: "Search Conversation Memory Layer knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "conversation_memory_layer_evaluate",
      description: "Run evaluation for Conversation Memory Layer",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
