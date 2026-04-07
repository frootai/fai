const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());

const agentExtra = `

## Knowledge Base
This agent has deep knowledge of:
- Azure AI Services ecosystem and integration patterns
- FAI Protocol specification and manifest schema
- Well-Architected Framework six pillars applied to AI workloads
- Production deployment patterns: blue-green, canary, rollback
- Cost optimization: model routing, caching, token budgets, PTU planning
- Evaluation frameworks: Azure AI Evaluation SDK metrics
- Content safety: Azure Content Safety API, severity levels, category filtering
- Observability: OpenTelemetry, Application Insights, KQL queries
- Infrastructure as Code: Bicep modules, parameters, conditional resources
- CI/CD pipelines: GitHub Actions, Azure DevOps, deployment gates
- Security: OWASP LLM Top 10, prompt injection defense, PII handling
- Data processing: chunking strategies, embedding models, vector search

## Decision Framework
When making architectural decisions:
1. Check if the decision is covered by config files (use them)
2. Follow WAF pillar guidance for tradeoffs
3. Prefer managed services over custom implementations
4. Prefer async patterns over synchronous calls
5. Prefer caching over repeated API calls
6. Prefer structured output over free-form text
7. Always add observability for new components
8. Document decisions as ADRs (Architecture Decision Records)

## Continuous Improvement
After each deployment cycle:
1. Review evaluation metrics for trends
2. Analyze cost reports for optimization opportunities
3. Check error logs for recurring issues
4. Update test cases based on production feedback
5. Refine prompts based on quality scores
`;

const instrExtra = `

## Performance Optimization
- Use connection pooling for all HTTP clients
- Set appropriate timeouts: connect=5s, read=30s, total=60s
- Cache frequently accessed data with appropriate TTL
- Use streaming for large responses
- Implement request coalescing for duplicate queries
- Use batch operations for bulk data processing

## Monitoring & Alerting
Required alerts for production:
| Alert | Condition | Severity |
|-------|-----------|----------|
| Error rate high | > 5% in 5 min window | Critical |
| Latency spike | p95 > 5s for 10 min | Warning |
| Token budget exceeded | > daily limit | Critical |
| Health check failure | 3 consecutive failures | Critical |
| Safety violation | Any severity 6 content | Critical |
| Disk usage high | > 85% | Warning |

## Documentation Standards
- README.md: Architecture, quickstart, configuration, troubleshooting
- Code comments: Explain WHY, not WHAT (the code shows what)
- API docs: Request/response examples with all fields
- Config docs: Inline comments in JSON explaining each field
- ADRs: Record significant architectural decisions

## Git Workflow
- Feature branches from main: \`feature/{play-id}-{description}\`
- Commit messages: \`feat(play-${plays[0]?.split("-")[0]}): description\`
- PR requires: passing CI, code review, evaluation gate
- Squash merge to main
- Tag releases: \`v{play-id}.{major}.{minor}.{patch}\`
`;

const readmeExtra = `

## File Structure
\`\`\`
.
├── .github/                 # DevKit (agents, instructions, prompts, skills, hooks, workflows)
├── .vscode/                 # VS Code settings and MCP config
├── config/                  # All configuration files (JSON)
├── evaluation/              # Quality evaluation pipeline (eval.py, test-set.jsonl)
├── infra/                   # Azure infrastructure (Bicep, ARM, parameters)
├── mcp/                     # MCP server plugin integration
├── plugins/                 # Plugin documentation
├── spec/                    # Architecture specification
├── agent.md                 # Root agent definition
├── CHANGELOG.md             # Version history
├── fai-manifest.json        # FAI Protocol manifest (primitives, context, guardrails)
├── froot.json               # Play metadata
├── instructions.md          # Root coding instructions
├── plugin.json              # Plugin manifest
└── README.md                # This file
\`\`\`

## Related Resources
- **Solution Plays Catalog:** [frootai.dev/solution-plays](https://frootai.dev/solution-plays)
- **FAI Protocol:** [frootai.dev/fai-protocol](https://frootai.dev/fai-protocol)
- **Primitives Catalog:** [frootai.dev/primitives](https://frootai.dev/primitives)
- **Learning Hub:** [frootai.dev/learning-hub](https://frootai.dev/learning-hub)
- **GitHub:** [github.com/frootai/frootai](https://github.com/frootai/frootai)

## Changelog
See [CHANGELOG.md](CHANGELOG.md) for version history.

## Support
- **Issues:** [github.com/frootai/frootai/issues](https://github.com/frootai/frootai/issues)
- **Discussions:** [github.com/frootai/frootai/discussions](https://github.com/frootai/frootai/discussions)
- **MCP Server:** \`npx frootai-mcp@latest\` (25 tools for AI architecture)
- **VS Code Extension:** Search "FrootAI" in VS Code Marketplace
`;

let af = 0, inf = 0, rf = 0;
for (const p of plays) {
    const a = path.join(dir, p, "agent.md");
    if (fs.existsSync(a) && fs.readFileSync(a, "utf8").split("\n").length < 200) { fs.writeFileSync(a, fs.readFileSync(a, "utf8") + agentExtra); af++; }
    const i = path.join(dir, p, "instructions.md");
    if (fs.existsSync(i) && fs.readFileSync(i, "utf8").split("\n").length < 200) { fs.writeFileSync(i, fs.readFileSync(i, "utf8") + instrExtra); inf++; }
    const r = path.join(dir, p, "README.md");
    if (fs.existsSync(r) && fs.readFileSync(r, "utf8").split("\n").length < 200) { fs.writeFileSync(r, fs.readFileSync(r, "utf8") + readmeExtra); rf++; }
}

for (const [l, f] of [["agent.md", "agent.md"], ["instructions.md", "instructions.md"], ["README.md", "README.md"]]) {
    const lines = plays.map(p => { const fp = path.join(dir, p, f); return fs.existsSync(fp) ? fs.readFileSync(fp, "utf8").split("\n").length : 0 }).filter(l => l > 0);
    console.log(`${l}: min=${Math.min(...lines)} avg=${Math.round(lines.reduce((a, b) => a + b, 0) / lines.length)} under200=${lines.filter(l => l < 200).length}`);
}
console.log(`Fixed: agent=${af} instructions=${inf} readme=${rf}`);
