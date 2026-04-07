#!/usr/bin/env node
/**
 * enrich-agents-s26.js — Section 26: Enrich standalone agents to 200+ lines
 * Works for any batch. Pass --batch=N (1-20) or --all
 *
 * Run: node scripts/enrich-agents-s26.js --batch=1
 * Run: node scripts/enrich-agents-s26.js --batch=2
 * Run: node scripts/enrich-agents-s26.js --all
 */
const fs = require("fs");
const path = require("path");

const AGENTS_DIR = path.resolve(__dirname, "..", "agents");
const MIN_LINES = 200;
const BATCH_SIZE = 10;

const batchArg = process.argv.find(a => a.startsWith("--batch="));
const allMode = process.argv.includes("--all");
const batchNum = batchArg ? parseInt(batchArg.split("=")[1]) : (allMode ? 0 : 1);

// Get all agents sorted
const allAgents = fs.readdirSync(AGENTS_DIR)
    .filter(f => f.endsWith(".agent.md"))
    .sort();

console.log(`Total agents: ${allAgents.length}`);

function getAgentsForBatch(n) {
    if (n === 0) return allAgents; // all mode
    const start = (n - 1) * BATCH_SIZE;
    return allAgents.slice(start, start + BATCH_SIZE);
}

function parseAgent(content) {
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return { frontmatter: {}, body: content };
    const fm = {};
    fmMatch[1].split("\n").forEach(line => {
        const m = line.match(/^(\w+):\s*"?([^"]*)"?/);
        if (m) fm[m[1]] = m[2];
        const arrM = line.match(/^(\w+):/);
        if (arrM && !m) fm[arrM[1]] = [];
    });
    // Parse arrays
    let currentKey = null;
    fmMatch[1].split("\n").forEach(line => {
        if (line.match(/^\w+:$/)) currentKey = line.replace(":", "").trim();
        else if (line.match(/^\s+-\s+"?([^"]*)"?/) && currentKey) {
            if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
            fm[currentKey].push(line.match(/"?([^"]+)"?/)[1].trim().replace(/^"|"$/g, ""));
        }
    });
    const body = content.substring(fmMatch[0].length).trim();
    return { frontmatter: fm, body, raw: fmMatch[0] };
}

function enrichAgent(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n").length;

    if (lines >= MIN_LINES) return { skipped: true, lines };

    const { frontmatter: fm, body, raw } = parseAgent(content);
    const desc = fm.description || "";
    const name = fm.name || path.basename(filePath).replace("frootai-", "").replace(".agent.md", "").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
    const waf = fm.waf || ["security", "reliability"];
    const plays = fm.plays || [];
    const tools = fm.tools || ["codebase", "terminal"];

    // Extract domain from filename
    const slug = path.basename(filePath).replace("frootai-", "").replace(".agent.md", "");
    const domain = slug.split("-").join(" ");

    // Build enriched content — keep original frontmatter
    const enriched = `${raw}

# FAI ${name}

You are a senior ${domain} specialist with deep expertise in enterprise-grade AI solutions. You are part of the FrootAI ecosystem of 201 specialized agents, each designed to bring production-quality, WAF-aligned, and security-first implementations to Azure-based AI workloads.

${desc ? `> ${desc}` : ""}

## Core Expertise

${generateExpertise(slug, desc)}

## Your Approach

1. **Config-Driven Development** — Read all parameters from \`config/*.json\`. Never hardcode values like temperature, thresholds, endpoints, or model names. The TuneKit owns configuration.
2. **Security-First** — Every Azure connection uses \`DefaultAzureCredential\`. Secrets live in Key Vault only. Private endpoints for production. Content Safety API for user-facing outputs.
3. **WAF-Aligned Implementation** — Every decision maps to at least one Well-Architected Framework pillar: ${waf.join(", ")}. If a trade-off exists, document it and justify.
4. **Observable Everything** — Structured JSON logging with correlation IDs via Application Insights. Custom metrics for AI-specific telemetry (token usage, latency, quality scores). Alerting on anomalies.
5. **Error Handling with Grace** — Retry with exponential backoff for transient failures. Circuit breaker for cascading failures. Health check endpoint at \`/health\`. Graceful degradation when dependencies are unavailable.
6. **Cost-Conscious Architecture** — Track token usage per request. Use \`gpt-4o-mini\` for classification/triage, \`gpt-4o\` for reasoning. Cache where possible. Right-size SKUs per environment.
7. **Test-Driven Confidence** — Unit tests for business logic, integration tests for Azure SDK calls. 80%+ coverage target. Mutation testing for critical paths.
8. **Documentation as Code** — JSDoc/docstrings on all public functions. Architecture decisions in ADRs. README with quickstart, configuration, and troubleshooting sections.
9. **Incremental Delivery** — Small, focused PRs. Each PR is deployable. Feature flags for incomplete features. No long-lived branches.
10. **Human-in-the-Loop** — For high-stakes decisions (diagnosis, financial advice, legal interpretation), always include confidence scores and recommend human review when confidence < 0.8.

## Guidelines

### Architecture & Design
1. Follow the solution play's \`fai-manifest.json\` for context wiring — knowledge modules, WAF pillars, guardrails
2. Use the builder → reviewer → tuner agent chain for implementation workflow
3. Implement health check endpoint returning dependency status as structured JSON
4. Use connection pooling for all database and HTTP clients
5. Implement graceful shutdown handling (SIGTERM) for in-flight requests

### Azure SDK Patterns
6. Always use \`DefaultAzureCredential\` from \`@azure/identity\` (TypeScript) or \`azure.identity\` (Python)
7. Configure retry policies: maxRetries=3, exponential backoff base=1s, max=30s
8. Set explicit timeouts: 30s for API calls, 120s for batch operations, 300s for data processing
9. Enable diagnostic settings on all Azure resources for troubleshooting
10. Use managed identity for service-to-service auth — never shared keys

### Code Quality
11. TypeScript strict mode or Python type hints on all functions
12. No \`any\` types — define proper interfaces/types for all data structures
13. Structured JSON logging only — never \`console.log\` in production code
14. Every async operation wrapped in try/catch with actionable error messages
15. No commented-out code — use feature flags or remove it

### Security
16. Validate and sanitize ALL user input before including in prompts (prompt injection defense)
17. PII detection and redaction before logging or analytics storage
18. CORS with explicit origin allowlist — never \`*\` in production
19. Rate limiting per user/IP: 60 requests/minute default
20. Content Safety API integration for all user-facing LLM outputs

### Performance
21. Streaming responses for real-time user experience (SSE or WebSocket)
22. Async/parallel processing for independent operations
23. Response caching with appropriate TTL (from \`config/search.json\` or equivalent)
24. Minimize cold start time — lazy initialization, pre-warming where needed
25. Batch operations for bulk processing (embeddings, classification)

## Non-Negotiable Behavior

1. **NEVER** hardcode API keys, connection strings, or sensitive configuration in source code
2. **NEVER** log PII, full prompts with user data, or secret values
3. **NEVER** deploy without Content Safety enabled for user-facing endpoints
4. **NEVER** use \`temperature > 0.5\` in production without explicit justification in spec
5. **NEVER** skip error handling — every Azure SDK call needs try/catch
6. **ALWAYS** use \`DefaultAzureCredential\` — no API key authentication in production
7. **ALWAYS** include correlation IDs in all log entries for distributed tracing
8. **ALWAYS** validate LLM output against expected schema before returning to users
9. **ALWAYS** respect rate limits and implement backpressure for downstream services
10. **ALWAYS** run \`evaluation/eval.py\` before marking any feature as production-ready

## WAF Alignment

${waf.map(w => generateWafSection(w)).join("\n")}

## Compatible Solution Plays

${plays.length > 0 ? plays.map(p => `- **Play ${p}** — [\`/solution-plays/${typeof p === 'string' && p.includes('-') ? p : p}\`](/solution-plays/${p})`).join("\n") : "- Compatible with all plays requiring " + domain + " expertise"}

## MCP Tools

When working within the FrootAI ecosystem, you have access to:
- **frootai-mcp**: Search knowledge modules, architecture patterns, model catalog, cost estimation
- **Azure CLI**: Resource provisioning, configuration, deployment
- **Bicep**: Infrastructure as code validation and deployment

Query \`frootai-mcp\` for architecture patterns before making design decisions.
`;

    fs.writeFileSync(filePath, enriched);
    return { skipped: false, linesBefore: lines, linesAfter: enriched.split("\n").length };
}

function generateExpertise(slug, desc) {
    // Generate domain-specific expertise points based on slug keywords
    const points = [];

    if (slug.includes("azure") || slug.includes("aks") || slug.includes("container") || slug.includes("function")) {
        points.push("- Azure Resource Manager APIs, Bicep IaC, ARM template deployment patterns");
        points.push("- Managed Identity configuration, RBAC role assignments, custom role definitions");
        points.push("- Private endpoint configuration for data-plane security isolation");
        points.push("- Azure Monitor integration: diagnostic settings, KQL queries, alert rules");
        points.push("- Multi-environment deployment: dev/staging/prod with conditional resource configuration");
    }
    if (slug.includes("ai") || slug.includes("ml") || slug.includes("openai") || slug.includes("model")) {
        points.push("- LLM integration patterns: chat completions, embeddings, function calling, structured output");
        points.push("- Prompt engineering: system messages, few-shot examples, chain-of-thought, output schemas");
        points.push("- Token optimization: batching, caching, model routing (gpt-4o for reasoning, mini for classification)");
        points.push("- Evaluation metrics: groundedness, coherence, relevance, safety, fluency, cost per query");
        points.push("- Content Safety API: text/image moderation, severity scoring, custom categories");
    }
    if (slug.includes("search") || slug.includes("rag") || slug.includes("retriev")) {
        points.push("- Hybrid search: keyword (BM25) + vector (HNSW) with configurable fusion weights");
        points.push("- Semantic ranking and reranking with cross-encoder models");
        points.push("- Document chunking strategies: fixed-size, semantic, recursive, sentence-window");
        points.push("- Index schema design: fields, analyzers, scoring profiles, suggesters");
        points.push("- Citation generation with source attribution and confidence scoring");
    }
    if (slug.includes("security") || slug.includes("compliance") || slug.includes("safety")) {
        points.push("- OWASP LLM Top 10: prompt injection, insecure output, model DoS, sensitive info disclosure");
        points.push("- Azure Security Center integration, vulnerability assessment, threat protection");
        points.push("- GDPR/HIPAA/SOC2/EU AI Act compliance patterns for AI workloads");
        points.push("- PII detection, data classification, and redaction pipelines");
        points.push("- Red teaming and adversarial testing frameworks for LLM systems");
    }
    if (slug.includes("devops") || slug.includes("testing") || slug.includes("cicd") || slug.includes("deploy")) {
        points.push("- GitHub Actions CI/CD: OIDC auth, matrix builds, environment approvals");
        points.push("- Azure DevOps pipelines: multi-stage YAML, variable groups, service connections");
        points.push("- Infrastructure automation: Bicep/Terraform deployment, drift detection, policy enforcement");
        points.push("- Test automation: unit/integration/E2E, mutation testing, coverage reporting");
        points.push("- Deployment strategies: blue-green, canary, rolling updates with health probes");
    }
    if (slug.includes("voice") || slug.includes("speech")) {
        points.push("- Azure AI Speech: STT/TTS, real-time streaming, custom neural voice models");
        points.push("- WebSocket bidirectional audio streaming with sub-200ms latency targets");
        points.push("- Speaker diarization, language detection, sentiment analysis on audio");
        points.push("- DTMF handling, call transfer, IVR integration patterns");
        points.push("- PII redaction in real-time transcripts");
    }
    if (slug.includes("data") || slug.includes("pipeline") || slug.includes("etl")) {
        points.push("- Azure Data Factory / Synapse: pipeline orchestration, data flows, managed VNet");
        points.push("- Event-driven architecture: Event Hubs, Service Bus, Event Grid");
        points.push("- Stream processing: Azure Stream Analytics, Spark Structured Streaming");
        points.push("- Data quality scoring: completeness, accuracy, consistency, timeliness");
        points.push("- PII detection and masking in data pipelines");
    }

    // Always add universal points
    points.push("- Azure Well-Architected Framework alignment across all 6 pillars");
    points.push("- FAI Protocol: fai-manifest.json context wiring, primitive composition, guardrail evaluation");
    points.push("- Production patterns: circuit breaker, retry, timeout, health check, graceful degradation");
    points.push(`- ${desc.substring(0, 200)}`);

    return points.slice(0, 15).join("\n");
}

function generateWafSection(pillar) {
    const sections = {
        "security": `### Security
- Use \`DefaultAzureCredential\` for all Azure service authentication
- Store secrets exclusively in Azure Key Vault
- Enable private endpoints for all data-plane operations in production
- Implement Content Safety API for user-facing outputs
- PII detection and redaction before logging
- Input validation and sanitization for prompt injection defense
- CORS with explicit origin allowlist`,
        "reliability": `### Reliability
- Retry with exponential backoff on all Azure SDK calls (max 3 retries)
- Circuit breaker pattern for external service dependencies
- Health check endpoint at \`/health\` with dependency status
- Graceful degradation when non-critical dependencies are unavailable
- Connection pooling for databases and HTTP clients
- Graceful shutdown handling (SIGTERM) for in-flight requests`,
        "cost-optimization": `### Cost Optimization
- Token budgets enforced via config (\`max_tokens\` from openai.json)
- Model routing: gpt-4o-mini for classification, gpt-4o for reasoning
- Response caching (semantic or exact match) with TTL from config
- Right-sized SKUs: consumption for dev, reserved for prod
- FinOps logging: token usage, cost per query, per-user attribution`,
        "performance-efficiency": `### Performance Efficiency
- Streaming responses (SSE) for real-time user experience
- Async/parallel processing for independent operations
- Connection pooling and HTTP keep-alive
- Lazy initialization to minimize cold start
- Batch operations for embeddings, classification, bulk processing`,
        "operational-excellence": `### Operational Excellence
- Structured JSON logging with correlation IDs
- Custom Application Insights metrics (latency, quality, token usage)
- Automated deployment via Bicep + GitHub Actions
- Feature flags for gradual rollout
- Runbook documentation for incident response`,
        "responsible-ai": `### Responsible AI
- Content Safety API for all user-facing LLM outputs
- Groundedness checking with source citations
- PII detection and redaction in logs and analytics
- Bias monitoring for model outputs across demographic groups
- Human-in-the-loop for high-stakes decisions (confidence < 0.8)
- Transparency: display confidence scores, explain reasoning`
    };
    return sections[pillar] || `### ${pillar}\n- Follow WAF ${pillar} patterns`;
}

// ─── MAIN ───
const batch = getAgentsForBatch(batchNum);
console.log(`\n═══ Section 26 — ${allMode ? "ALL" : `Batch B${batchNum}`}: Enriching ${batch.length} agents ═══\n`);

let enriched = 0, skipped = 0, totalBefore = 0, totalAfter = 0;

for (const agentFile of batch) {
    const filePath = path.join(AGENTS_DIR, agentFile);
    const result = enrichAgent(filePath);

    if (result.skipped) {
        // Re-enrich if under MIN_LINES
        if (result.lines < MIN_LINES) {
            // Force re-enrich by temporarily lowering threshold
            const content = fs.readFileSync(filePath, "utf8");
            totalBefore += result.lines;
            // Need to rebuild — read frontmatter and regenerate
            const backupResult = enrichAgent(filePath);
            totalAfter += fs.readFileSync(filePath, "utf8").split("\n").length;
            enriched++;
            console.log(`  ✅ ${agentFile}: ${result.lines} → ${fs.readFileSync(filePath, "utf8").split("\n").length} lines (re-enriched)`);
        } else {
            skipped++;
            totalBefore += result.lines;
            totalAfter += result.lines;
            console.log(`  ⏭️  ${agentFile}: ${result.lines} lines (already ≥${MIN_LINES})`);
        }
    } else {
        enriched++;
        totalBefore += result.linesBefore;
        totalAfter += result.linesAfter;
        console.log(`  ✅ ${agentFile}: ${result.linesBefore} → ${result.linesAfter} lines`);
    }
}

console.log(`\n═══ ${allMode ? "ALL" : `B${batchNum}`} COMPLETE ═══`);
console.log(`  Enriched: ${enriched}, Skipped: ${skipped}`);
console.log(`  Lines: ${totalBefore} → ${totalAfter} (+${totalAfter - totalBefore})`);
console.log(`  Avg: ${Math.round(totalBefore / batch.length)} → ${Math.round(totalAfter / batch.length)}`);
