// MCP Plugin for Edge Ai Deployment
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "34-edge-ai-deployment",
  version: "1.0.0",
  tools: [
    {
      name: "edge_ai_deployment_search",
      description: "Search Edge Ai Deployment knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "edge_ai_deployment_evaluate",
      description: "Run evaluation for Edge Ai Deployment",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
