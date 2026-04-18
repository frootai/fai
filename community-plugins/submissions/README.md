# Ecosystem Submissions

Ready-to-submit entries for external registries, marketplaces, and curated lists.

## Registry Entries

| Registry | File | Status | Effort |
|----------|------|--------|--------|
| [Smithery.ai](https://smithery.ai) | `smithery-registry.json` | ✅ Ready | Submit JSON via dashboard |
| [Glama.ai](https://glama.ai) | `glama-listing.md` | ✅ Ready | Submit via PR |
| [mcp.run](https://mcp.run) | `mcp-run-entry.json` | ✅ Ready | Submit via dashboard |
| [awesome-mcp](https://github.com/punkpeye/awesome-mcp-servers) | `awesome-mcp-pr.md` | ✅ Ready | Submit PR to README |
| [awesome-ai-agents](https://github.com/e2b-dev/awesome-ai-agents) | `awesome-ai-agents-pr.md` | ✅ Ready | Submit PR to README |
| GitHub Actions Marketplace | `../action.yml` (root) | ✅ Exists | Create release to publish |

## Submission Instructions

### Smithery.ai
1. Go to https://smithery.ai/register
2. Upload `smithery-registry.json`
3. Verify server endpoint works: `npx frootai-mcp@latest`

### Glama.ai
1. Go to https://glama.ai/submit
2. Copy content from `glama-listing.md`
3. Submit and wait for review

### mcp.run (Anthropic)
1. Go to https://mcp.run/submit
2. Upload `mcp-run-entry.json`
3. Verify MCP protocol compliance

### awesome-mcp-servers
1. Fork https://github.com/punkpeye/awesome-mcp-servers
2. Add entry from `awesome-mcp-pr.md` to README.md
3. Submit PR with title: "Add FrootAI MCP Server"

### awesome-ai-agents
1. Fork https://github.com/e2b-dev/awesome-ai-agents
2. Add entry from `awesome-ai-agents-pr.md`
3. Submit PR

### GitHub Actions Marketplace
1. Create a new release on the `frootai/frootai` repo
2. The `action.yml` at root is already configured
3. Marketplace listing auto-publishes on release
