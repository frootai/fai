// MCP Plugin for Citizen Services Chatbot
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "84-citizen-services-chatbot",
  version: "1.0.0",
  tools: [
    {
      name: "citizen_services_chatbot_search",
      description: "Search Citizen Services Chatbot knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "citizen_services_chatbot_evaluate",
      description: "Run evaluation for Citizen Services Chatbot",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
