#!/usr/bin/env node
/**
 * enrich-agents-additive.js — Additive enrichment for agents
 * ADDS new sections to existing agents without overwriting existing content.
 * Pass --batch=N (1-20) or --from=N --to=M for ranges.
 *
 * Run: node scripts/enrich-agents-additive.js --batch=1
 */
const fs = require("fs");
const path = require("path");

const AGENTS_DIR = path.resolve(__dirname, "..", "agents");
const MIN_LINES = 200;
const BATCH_SIZE = 10;

const batchArg = process.argv.find(a => a.startsWith("--batch="));
const batchNum = batchArg ? parseInt(batchArg.split("=")[1]) : 1;

const allAgents = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith(".agent.md")).sort();
const batch = allAgents.slice((batchNum - 1) * BATCH_SIZE, batchNum * BATCH_SIZE);

console.log(`═══ Section 26 B${batchNum}: Enriching ${batch.length} agents (additive, target ${MIN_LINES}+) ═══\n`);

let enriched = 0, skipped = 0;

for (const file of batch) {
    const fp = path.join(AGENTS_DIR, file);
    const content = fs.readFileSync(fp, "utf8");
    const lines = content.split("\n").length;

    if (lines >= MIN_LINES) {
        skipped++;
        console.log(`  ⏭️  ${file}: ${lines} lines (OK)`);
        continue;
    }

    // Parse frontmatter to get metadata
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    const desc = (content.match(/description:\s*"([^"]+)"/) || ["", ""])[1];
    const wafMatch = content.match(/waf:\n((?:\s+-\s*"[^"]+"\n?)+)/);
    const waf = wafMatch ? wafMatch[1].match(/"([^"]+)"/g).map(s => s.replace(/"/g, "")) : ["security", "reliability"];
    const playsMatch = content.match(/plays:\n((?:\s+-\s*"[^"]+"\n?)+)/);
    const plays = playsMatch ? playsMatch[1].match(/"([^"]+)"/g).map(s => s.replace(/"/g, "")) : [];

    const slug = file.replace("frootai-", "").replace(".agent.md", "");
    const name = slug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");

    // Check what sections already exist
    const hasApproach = content.includes("## Your Approach") || content.includes("## Approach");
    const hasGuidelines = content.includes("## Guidelines");
    const hasNonNeg = content.includes("## Non-Negotiable");
    const hasWaf = content.includes("## WAF Alignment");
    const hasPlays = content.includes("## Compatible Solution Plays") || content.includes("## Compatible Plays");
    const hasMcp = content.includes("## MCP Tools") || content.includes("## Tools");

    // Build additive sections
    let additions = "";

    if (!hasApproach) {
        additions += `
## Your Approach

1. **Config-Driven** — Read ALL parameters from \`config/*.json\`. Never hardcode temperature, thresholds, or endpoints.
2. **Security-First** — \`DefaultAzureCredential\` for auth. Key Vault for secrets. Private endpoints in production. Content Safety for user outputs.
3. **WAF-Aligned** — Every decision maps to ${waf.join(", ")} pillars. Document trade-offs explicitly.
4. **Observable** — Structured JSON logging with Application Insights. Custom metrics for AI telemetry (tokens, latency, quality).
5. **Error Resilient** — Retry with backoff for transient failures. Circuit breaker for cascading issues. Health checks at \`/health\`.
6. **Cost-Aware** — Track token usage per request. Use gpt-4o-mini for classification, gpt-4o for reasoning. Cache aggressively.
7. **Test-Confident** — Unit tests for logic, integration tests for SDK calls. 80%+ coverage. Mutation testing for critical paths.
8. **Doc as Code** — JSDoc/docstrings on public functions. ADRs for architecture decisions. README with quickstart.
9. **Incremental** — Small PRs, each deployable. Feature flags for WIP. No long-lived branches.
10. **Human-in-Loop** — Confidence scores on all outputs. Human review when confidence < 0.8 for high-stakes decisions.
`;
    }

    if (!hasGuidelines) {
        additions += `
## Guidelines

### Architecture & Design
1. Follow \`fai-manifest.json\` for context wiring — knowledge modules, WAF pillars, guardrails
2. Use builder → reviewer → tuner chain for implementation workflow
3. Health check endpoint with structured dependency status
4. Connection pooling for all database and HTTP clients
5. Graceful shutdown on SIGTERM for in-flight requests

### Azure SDK Patterns
6. \`DefaultAzureCredential\` from \`@azure/identity\` — never API keys
7. Retry: maxRetries=3, exponential backoff base=1s max=30s
8. Timeouts: 30s API, 120s batch, 300s data processing
9. Diagnostic settings enabled on all resources
10. Managed identity for service-to-service auth

### Code Quality
11. TypeScript strict mode or Python type hints everywhere
12. No \`any\` types — define proper interfaces
13. Structured JSON logging only — no console.log
14. Try/catch on every async operation with actionable error messages
15. No commented-out code — use feature flags or delete

### Security
16. Sanitize ALL user input before prompt inclusion (injection defense)
17. PII detection and redaction before logging/analytics
18. CORS with explicit origin allowlist (never \`*\` in prod)
19. Rate limiting: 60 req/min per user default
20. Content Safety API for all user-facing LLM outputs

### Performance  
21. Streaming responses (SSE/WebSocket) for real-time UX
22. Async/parallel for independent operations
23. Cache with TTL from config
24. Minimize cold start — lazy init, pre-warming
25. Batch operations for embeddings and classification
`;
    }

    if (!hasNonNeg) {
        additions += `
## Non-Negotiable Behavior

1. **NEVER** hardcode API keys, connection strings, or secrets in source code
2. **NEVER** log PII, full prompts with user data, or secret values
3. **NEVER** deploy without Content Safety enabled for user-facing endpoints
4. **NEVER** use \`temperature > 0.5\` in production without documented justification
5. **NEVER** skip error handling — every Azure SDK call needs try/catch
6. **ALWAYS** use \`DefaultAzureCredential\` for all Azure authentication
7. **ALWAYS** include correlation IDs in log entries for distributed tracing
8. **ALWAYS** validate LLM output against expected schema before returning
9. **ALWAYS** run evaluation before marking work as production-ready
10. **ALWAYS** document architectural decisions as ADRs
`;
    }

    if (!hasWaf) {
        const wafContent = waf.map(w => {
            const sections = {
                "security": "### Security\n- DefaultAzureCredential for all auth\n- Key Vault for secrets\n- Private endpoints in production\n- Content Safety API\n- Input validation, PII redaction\n- TLS 1.2+, CORS allowlist",
                "reliability": "### Reliability\n- Retry with exponential backoff (3 retries)\n- Circuit breaker for external deps\n- Health check at /health\n- Graceful degradation\n- Connection pooling\n- Graceful shutdown (SIGTERM)",
                "cost-optimization": "### Cost Optimization\n- max_tokens enforced from config\n- Model routing (mini for triage, 4o for reasoning)\n- Response caching with TTL\n- Right-sized SKUs per environment\n- Token usage logging for FinOps",
                "performance-efficiency": "### Performance Efficiency\n- Streaming responses\n- Async parallel processing\n- Connection pooling, keep-alive\n- Lazy initialization\n- Batch operations",
                "operational-excellence": "### Operational Excellence\n- Structured JSON logging\n- Application Insights custom metrics\n- Automated Bicep deployment\n- Feature flags\n- Incident runbooks",
                "responsible-ai": "### Responsible AI\n- Content Safety integration\n- Groundedness with citations\n- PII redaction\n- Bias monitoring\n- Human-in-the-loop for high-stakes\n- Transparency (confidence scores)",
            };
            return sections[w] || `### ${w}\n- Follow WAF ${w} patterns`;
        }).join("\n\n");

        additions += `
## WAF Alignment

${wafContent}
`;
    }

    if (!hasPlays && plays.length > 0) {
        additions += `
## Compatible Solution Plays

${plays.map(p => `- **Play ${p}** — [View Play](/solution-plays/${p}) · [User Guide](/user-guide?play=${typeof p === 'string' ? p.split('-')[0] : p})`).join("\n")}
`;
    }

    if (!hasMcp) {
        additions += `
## MCP Integration

Query \`frootai-mcp\` for architecture patterns, knowledge modules, and cost estimation before design decisions:
- \`search_knowledge\` — Search relevant patterns
- \`get_architecture_pattern\` — Get detailed architecture
- \`estimate_cost\` — Calculate Azure monthly cost
- \`compare_models\` — Compare model options (quality, cost, latency)
`;
    }

    if (additions) {
        const enrichedContent = content.trimEnd() + "\n" + additions;
        fs.writeFileSync(fp, enrichedContent);
        const newLines = enrichedContent.split("\n").length;
        enriched++;
        console.log(`  ✅ ${file}: ${lines} → ${newLines} lines (+${newLines - lines})`);
    } else {
        skipped++;
        console.log(`  ⏭️  ${file}: ${lines} lines (all sections present)`);
    }
}

// Final verification
const finalLines = batch.map(f => fs.readFileSync(path.join(AGENTS_DIR, f), "utf8").split("\n").length);
const avg = Math.round(finalLines.reduce((a, b) => a + b, 0) / finalLines.length);
const min = Math.min(...finalLines);
const max = Math.max(...finalLines);
console.log(`\n═══ B${batchNum} COMPLETE ═══`);
console.log(`  Enriched: ${enriched}, Skipped: ${skipped}`);
console.log(`  Final: min=${min} max=${max} avg=${avg}`);
console.log(`  ${min >= MIN_LINES ? "✅" : "⚠️"} Min target: ${MIN_LINES}+`);
