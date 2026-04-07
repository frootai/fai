// MCP Plugin for Healthcare Clinical Ai
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "46-healthcare-clinical-ai",
  version: "1.0.0",
  tools: [
    {
      name: "healthcare_clinical_ai_search",
      description: "Search Healthcare Clinical Ai knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "healthcare_clinical_ai_evaluate",
      description: "Run evaluation for Healthcare Clinical Ai",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
