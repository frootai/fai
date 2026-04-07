// MCP Plugin for Browser Automation Agent
// Registers play-specific tools with the FrootAI MCP server

module.exports = {
  name: "23-browser-automation-agent",
  version: "1.0.0",
  tools: [
    {
      name: "browser_automation_agent_search",
      description: "Search Browser Automation Agent knowledge base",
      parameters: { query: { type: "string", required: true } }
    },
    {
      name: "browser_automation_agent_evaluate",
      description: "Run evaluation for Browser Automation Agent",
      parameters: { test_set: { type: "string", default: "evaluation/test-set.jsonl" } }
    }
  ]
};
