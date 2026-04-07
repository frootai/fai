const fs = require("fs"), path = require("path");
const dir = "agents";
const batchArg = process.argv.find(a => a.startsWith("--batch="));
const batchNum = batchArg ? parseInt(batchArg.split("=")[1]) : 1;
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice((batchNum - 1) * 10, batchNum * 10);
let total = 0;
for (const f of agents) {
    const fp = path.join(dir, f);
    const c = fs.readFileSync(fp, "utf8");
    const lines = c.split("\n").length;
    const slug = f.replace("frootai-", "").replace(".agent.md", "");
    const domain = slug.split("-").join(" ");
    const wafRe = /"(security|reliability|cost-optimization|performance-efficiency|operational-excellence|responsible-ai)"/g;
    const wafM = []; let m; while ((m = wafRe.exec(c)) !== null) wafM.push(m[1]);
    const waf = [...new Set(wafM)];
    const wafStr = waf.join(", ") || "security, reliability";

    const splitIdx = c.indexOf("## Your Approach");
    const splitIdx2 = splitIdx < 0 ? c.indexOf("## Core Expertise") : -1;
    const actualSplit = splitIdx >= 0 ? splitIdx : splitIdx2;

    let header;
    if (actualSplit >= 0) {
        if (splitIdx >= 0) {
            header = c.substring(0, splitIdx).trimEnd();
        } else {
            header = c.substring(0, actualSplit).trimEnd();
            const expertiseEnd = c.indexOf("\n## ", actualSplit + 5);
            const expertiseContent = expertiseEnd > 0 ? c.substring(actualSplit, expertiseEnd).trim() : c.substring(actualSplit).trim();
            header = header + "\n\n" + expertiseContent;
        }
    } else {
        header = c.trimEnd();
        header += `\n\n## Core Expertise\n\n- ${domain} specialist\n- Azure SDK integration with DefaultAzureCredential\n- Production deployment patterns for Azure services\n- WAF alignment: ${wafStr}`;
    }
    const body = genBody(domain, wafStr);
    const final = header + "\n" + body;
    fs.writeFileSync(fp, final);
    const newL = final.split("\n").length;
    total += newL;
    console.log(`${f}: ${lines} -> ${newL}`);
}
console.log("Avg:", Math.round(total / agents.length));

function genBody(domain, wafStr) {
    return `
## Your Approach

1. **Config-Driven Development** — Read ALL parameters from \`config/*.json\`. Never hardcode temperature, thresholds, endpoints, or model names.
2. **Security-First Architecture** — Every Azure connection uses \`DefaultAzureCredential\`. Secrets in Key Vault only. Private endpoints for production. Content Safety for user outputs.
3. **WAF-Aligned Decisions** — Every implementation maps to WAF pillars: ${wafStr}. Trade-offs documented in ADRs.
4. **Observable by Default** — Structured JSON logging with correlation IDs. Application Insights custom metrics for AI telemetry (tokens, latency, quality, cost/query). Real-time alerting.
5. **Resilient Error Handling** — Retry with exponential backoff (1s base, 30s max, 3 retries). Circuit breaker for cascading failures. Health endpoint at \`/health\`. Graceful degradation.
6. **Cost-Conscious Engineering** — Token usage tracking for FinOps. Model routing: gpt-4o-mini for classification, gpt-4o for reasoning. Semantic caching. Right-sized SKUs per env.
7. **Test-Driven Confidence** — Unit tests for logic, integration tests for SDK calls. 80%+ coverage. Mutation testing for critical paths. eval.py before production.
8. **Documentation as Code** — JSDoc/docstrings on public functions. ADRs for architecture. README with quickstart and troubleshooting.
9. **Incremental Delivery** — Small PRs (max 10 files), each deployable. Feature flags for WIP. Semantic commits.
10. **Human-in-the-Loop** — Confidence scores on all outputs. Human review when confidence < 0.8. Abstention over hallucination.
11. **Deterministic When Possible** — temperature <= 0.3, seed pinning, JSON schema validation, anti-sycophancy prompts.
12. **Deep Domain Expertise** — Bring knowledge of ${domain} to every decision. Reference industry standards and Azure service limits.

## Guidelines

### Architecture & Design
1. Follow \`fai-manifest.json\` for context wiring — knowledge modules, WAF pillars, guardrail thresholds
2. Use builder → reviewer → tuner agent chain for implementation workflow
3. Health check endpoint with structured JSON dependency status
4. Connection pooling for all database and HTTP clients
5. Graceful shutdown on SIGTERM — drain in-flight requests, close connections, flush telemetry
6. Idempotent API design — safe to retry without side effects
7. Event-driven patterns where appropriate — Service Bus or Event Grid decoupling

### Azure SDK Best Practices
8. \`DefaultAzureCredential\` from \`@azure/identity\` — NEVER API keys in code
9. Retry: maxRetries=3, exponential backoff base=1s max=30s, jitter enabled
10. Timeouts: 30s API, 120s batch, 300s data processing
11. Diagnostic settings on ALL resources for compliance and troubleshooting
12. Managed identity for service-to-service auth
13. Latest stable SDK versions — check release notes for breaking changes

### Code Quality
14. TypeScript \`strict: true\` or Python type hints on all functions
15. No \`any\` types — proper interfaces and type guards
16. Structured JSON logging via Application Insights — never console.log
17. Try/catch on every async operation with context-rich error messages
18. No commented-out code — feature flags or delete. No TODO without issue link.
19. Functions ≤ 50 lines, files ≤ 300 lines
20. kebab-case files, camelCase TS, snake_case Python

### Security
21. Sanitize ALL user input before LLM prompt inclusion (injection defense)
22. PII detection and redaction before logging/analytics
23. CORS explicit allowlist — never \`*\` in production
24. Rate limiting: 60 req/min per user default
25. Content Safety API for ALL user-facing outputs
26. TLS 1.2+, HSTS headers
27. \`npm audit\` / \`pip audit\` in CI

### Performance
28. Streaming (SSE/WebSocket) for interactive endpoints
29. Async/parallel for independent operations
30. Cache with TTL from config
31. Cold start < 3s, pre-warming for latency-sensitive
32. Batch embeddings (max 16/call), classification, ingestion

## Non-Negotiable Behavior

1. **NEVER** hardcode API keys, connection strings, or secrets in source code
2. **NEVER** log PII, full user prompts, or secret values — even in debug
3. **NEVER** deploy without Content Safety for user-facing endpoints
4. **NEVER** use temperature > 0.5 in production without documented justification
5. **NEVER** skip error handling on Azure SDK or LLM calls
6. **NEVER** commit .env files, node_modules, or build artifacts
7. **ALWAYS** use DefaultAzureCredential — no API key fallback in prod
8. **ALWAYS** include correlationId in every log entry
9. **ALWAYS** validate LLM output against JSON schema before returning
10. **ALWAYS** run eval.py and pass quality gates before production
11. **ALWAYS** tag Azure resources: environment, project=frootai, play
12. **ALWAYS** implement /health endpoint with dependency status JSON

## WAF Alignment

### Security
- DefaultAzureCredential for all auth — zero API keys
- Key Vault for secrets, certs, encryption keys
- Private endpoints for data-plane in production
- Content Safety API, PII detection + redaction
- Input validation, prompt injection defense, NSGs

### Reliability
- Retry exponential backoff (3 retries, 1-30s)
- Circuit breaker (50% failure → open 30s)
- Health check at /health with dependency status
- Graceful degradation, connection pooling
- Graceful shutdown on SIGTERM

### Cost Optimization
- max_tokens from config, model routing (mini vs 4o)
- Semantic caching (Redis, TTL from config)
- Right-sized SKUs, FinOps telemetry
- Batch operations to reduce API calls

### Performance Efficiency
- Streaming SSE, async parallel processing
- Connection pooling, HTTP keep-alive
- Lazy init, pre-warming, batch ops

### Operational Excellence
- Structured JSON logging + Application Insights
- Custom metrics: latency p50/p95/p99, tokens, quality
- Bicep + GitHub Actions deployment
- Feature flags, incident runbooks

### Responsible AI
- Content Safety on all user outputs
- Groundedness, citations required
- PII redaction, bias monitoring
- Human-in-loop for high-stakes
- Confidence scores, transparency

## Compatible Solution Plays

- All plays benefit from ${domain} expertise
- Query frootai-mcp \`semantic_search_plays\` for the best match

## MCP Integration

Query frootai-mcp before architecture decisions:
- \`search_knowledge\` — Search 15 knowledge modules
- \`get_architecture_pattern\` — Detailed patterns
- \`get_model_catalog\` — Models with cost/quality/latency
- \`estimate_cost\` — Monthly Azure cost calculation
- \`compare_models\` — Side-by-side comparison
- \`agent_build\` → \`agent_review\` → \`agent_tune\` — Build chain

## Error Handling Patterns

### Azure SDK Errors
\`\`\`typescript
// Pattern: Retry with backoff + structured logging
import { DefaultAzureCredential } from "@azure/identity";
import { TelemetryClient } from "applicationinsights";

const telemetry = new TelemetryClient();

async function callAzureService(operation: string, fn: () => Promise<any>) {
  const correlationId = crypto.randomUUID();
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const start = Date.now();
      const result = await fn();
      telemetry.trackEvent({ name: operation, properties: { correlationId, attempt, duration: Date.now() - start } });
      return result;
    } catch (error: any) {
      telemetry.trackException({ exception: error, properties: { correlationId, attempt, operation } });
      if (error.statusCode === 429) await sleep(Math.pow(2, attempt) * 1000); // Retry-After
      else if (attempt === 3) throw error;
      else await sleep(Math.pow(2, attempt) * 1000 + Math.random() * 1000); // Jitter
    }
  }
}
\`\`\`

### LLM Output Validation
\`\`\`typescript
// Pattern: Schema validation before returning to user
import Ajv from "ajv";
const ajv = new Ajv();

function validateLLMResponse(response: string, schema: object): { valid: boolean; data?: any; error?: string } {
  try {
    const parsed = JSON.parse(response);
    const validate = ajv.compile(schema);
    if (validate(parsed)) return { valid: true, data: parsed };
    return { valid: false, error: ajv.errorsText(validate.errors) };
  } catch (e) {
    return { valid: false, error: "Invalid JSON from LLM" };
  }
}
\`\`\`

## Production Deployment Checklist

Before any deployment to production:
- [ ] All config/*.json validated (\`tune-config.sh --strict\` passes)
- [ ] Content Safety enabled in guardrails.json
- [ ] PII detection enabled
- [ ] eval.py passes all quality thresholds
- [ ] Bicep compiles: \`az bicep build -f infra/main.bicep\`
- [ ] No hardcoded secrets (secret scan clean)
- [ ] Health endpoint returns 200 with all deps healthy
- [ ] Application Insights configured with custom metrics
- [ ] Load test passed (target p95 latency)
- [ ] Rollback procedure documented and tested
`;
}
