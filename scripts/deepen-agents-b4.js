const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(30, 40);

const expertiseMap = {
    "browser-agent": [
        "- **Playwright MCP**: Browser automation via Model Context Protocol, headless Chrome/Firefox/WebKit, multi-tab orchestration",
        "- **GPT-4o Vision**: Screenshot analysis for page understanding, element identification, layout comprehension, OCR on rendered pages",
        "- **Navigation**: URL-based routing, link clicking, form filling, dropdown selection, file upload, cookie/session management",
        "- **Data Extraction**: Table scraping, structured data from rendered HTML, PDF download, screenshot capture, content comparison",
        "- **Authentication**: OAuth2 flows, SSO handling, MFA bypass for test accounts, session token management, cookie persistence",
        "- **Anti-Detection**: Human-like delays, viewport randomization, user agent rotation, stealth mode, captcha handling strategies",
        "- **Error Recovery**: Element not found retry, navigation timeout handling, stale element refresh, page crash recovery",
        "- **Task Planning**: Multi-step task decomposition, action verification via screenshots, rollback on failure, progress checkpointing",
        "- **Security**: Domain allowlist enforcement, credential vault for test accounts, PII scrubbing from screenshots, sandboxed execution",
        "- **Performance**: Parallel page processing, resource blocking (images/fonts), request interception, response caching",
    ],
    "capacity-planner": [
        "- **Azure SKU Sizing**: Cognitive Services quotas (TPM/RPM), AKS node pool sizing (CPU/GPU/memory), Cosmos DB RU estimation",
        "- **Load Modeling**: Request rate projection, token consumption modeling, peak vs sustained load, burst capacity planning",
        "- **GPU Planning**: A100 vs H100 selection, MIG partitioning, vRAM requirements per model size (7B/13B/70B), inference throughput",
        "- **Cost Forecasting**: Monthly Azure spend estimation, dev vs prod cost ratios, reserved instance savings, spot VM economics",
        "- **Scaling Strategy**: Horizontal vs vertical scaling decisions, auto-scale rules, warm pool sizing, cold start mitigation",
        "- **Network Capacity**: Bandwidth requirements per service, cross-region latency budgets, private endpoint throughput limits",
        "- **Storage Planning**: Blob storage growth projection, Cosmos DB partition sizing, AI Search index capacity, log retention costs",
        "- **Quota Management**: Azure subscription limits, regional capacity constraints, quota increase requests, multi-subscription strategy",
        "- **Performance Targets**: P50/P95/P99 latency SLOs, throughput requirements, availability targets (99.9%/99.95%/99.99%)",
        "- **FinOps Integration**: Cost allocation tags, team/project chargeback, budget alerts, optimization recommendations",
    ],
    "cicd-pipeline-expert": [
        "- **GitHub Actions**: OIDC auth to Azure, matrix builds, reusable workflows, composite actions, environment approvals, concurrency",
        "- **Azure DevOps Pipelines**: YAML multi-stage, service connections, variable groups from Key Vault, deployment jobs, gates",
        "- **AI-Specific CI**: Prompt regression testing, model quality gates (groundedness/coherence), config validation, Bicep linting",
        "- **Security Scanning**: CodeQL for code, Trivy for containers, npm/pip audit for dependencies, secret scanning, SBOM generation",
        "- **Deployment Strategies**: Blue-green, canary (traffic splitting), rolling updates, feature flags, rollback automation",
        "- **Infrastructure CI**: Bicep what-if, Terraform plan, policy compliance check, cost estimation in PR, drift detection",
        "- **Testing Pipeline**: Unit → integration → E2E → performance → security, parallel execution, test impact analysis",
        "- **Artifact Management**: Container registry (ACR), npm/NuGet feeds, Helm chart repo, model artifact versioning",
        "- **Observability**: Pipeline telemetry, DORA metrics (lead time/deployment frequency/MTTR/change failure rate), dashboards",
        "- **Release Management**: Semantic versioning, changelog generation, release notes, tag-based deployment, hotfix workflow",
    ],
    "code-reviewer": [
        "- **Static Analysis**: ESLint/Prettier (TS), Ruff/Black (Python), SonarQube quality gates, cyclomatic complexity limits",
        "- **Security Review**: OWASP Top 10 check, hardcoded secrets detection, dependency vulnerability audit, SQL injection patterns",
        "- **AI Code Review**: Prompt injection vulnerabilities, LLM output validation, token limit enforcement, PII exposure in logs",
        "- **Architecture Review**: SOLID principles, separation of concerns, dependency injection, clean architecture layers",
        "- **Azure Best Practices**: Managed identity usage, Key Vault references, private endpoint config, diagnostic settings",
        "- **Performance Review**: N+1 queries, missing indexes, unbounded loops, memory leaks, connection pool exhaustion",
        "- **Error Handling**: Try/catch coverage, retry policies, circuit breaker patterns, graceful degradation, health checks",
        "- **Testing Review**: Test coverage (80%+ target), test quality (not just assertions), edge cases, mocking strategy",
        "- **Config Review**: config/*.json values appropriate for environment, no hardcoded values, secrets not in config",
        "- **PR Standards**: Conventional commits, PR description template, linked issues, breaking change documentation",
    ],
    "collective-debugger": [
        "- **Root Cause Analysis**: Systematic elimination, binary search debugging, log correlation, distributed tracing analysis",
        "- **Azure Diagnostics**: Application Insights dependency failures, KQL queries for error patterns, resource health checks",
        "- **LLM-Specific Issues**: Token limit exceeded, content filter triggers, rate limiting, model version mismatch, prompt regression",
        "- **Network Debugging**: DNS resolution, private endpoint connectivity, NSG rules blocking, SSL/TLS certificate issues",
        "- **Performance Profiling**: CPU/memory profiling, slow query identification, cold start analysis, bottleneck detection",
        "- **Container Debugging**: Pod crash loops, OOM kills, image pull failures, readiness/liveness probe failures, resource limits",
        "- **Data Issues**: Schema mismatch, encoding problems, PII in unexpected fields, partition key hot spots, consistency issues",
        "- **Integration Failures**: API version mismatch, auth token expiry, SDK breaking changes, service outage detection",
        "- **Reproduction**: Minimal test case creation, environment isolation, deterministic reproduction with seed/temperature=0",
        "- **Post-Mortem**: Incident timeline, contributing factors, remediation actions, prevention measures, runbook updates",
    ],
    "collective-implementer": [
        "- **Feature Development**: Requirements → design → implement → test → review lifecycle, acceptance criteria validation",
        "- **Azure SDK Integration**: Latest SDK versions, async patterns, streaming response handling, error mapping",
        "- **AI Feature Patterns**: Chat completions with streaming, RAG pipeline implementation, agent tool calling, batch embeddings",
        "- **API Design**: REST with OpenAPI spec, GraphQL schema-first, gRPC for internal services, versioning strategy",
        "- **Database Integration**: Cosmos DB with partition key design, SQL with Entity Framework/Prisma, Redis for caching",
        "- **Event-Driven**: Service Bus/Event Hubs integration, event handlers, idempotent consumers, dead-letter processing",
        "- **State Management**: Stateless API design, session storage (Redis), conversation history (Cosmos DB), file uploads (Blob)",
        "- **Configuration**: Environment-based config loading, Key Vault integration, feature flags, hot-reload capability",
        "- **Observability**: Structured logging, custom metrics, health endpoint, distributed tracing, error tracking",
        "- **Documentation**: API documentation (OpenAPI), code comments for complex logic, README updates, ADR creation",
    ],
    "collective-orchestrator": [
        "- **Multi-Agent Coordination**: Supervisor pattern, task decomposition, agent selection, result aggregation, conflict resolution",
        "- **Workflow Design**: Sequential chains, parallel fan-out/fan-in, conditional branching, loop with termination, human-in-the-loop",
        "- **State Management**: Shared context via Cosmos DB, Redis for fast state, conversation threading, memory consolidation",
        "- **Tool Routing**: MCP tool selection based on task type, tool result validation, fallback tools, tool composition",
        "- **Error Handling**: Agent failure recovery, timeout management, partial result handling, compensation workflows",
        "- **Cost Control**: Per-agent token budgets, total orchestration budget, model selection per task complexity, early termination",
        "- **Observability**: Orchestration trace visualization, per-agent latency/token metrics, decision audit trail, bottleneck detection",
        "- **Scaling**: Parallel agent execution, queue-based work distribution, back-pressure management, resource pooling",
        "- **Testing**: Orchestration integration tests, agent mock/stub, scenario-based testing, chaos testing for resilience",
        "- **Patterns**: Supervisor-worker, debate (multi-agent consensus), assembly line, map-reduce, blackboard architecture",
    ],
    "collective-researcher": [
        "- **Knowledge Discovery**: Multi-source search (AI Search, web, databases), relevance ranking, deduplication, source credibility scoring",
        "- **RAG Pipeline**: Query decomposition, multi-hop retrieval, cross-document synthesis, citation tracking, answer grounding",
        "- **Web Research**: Structured web search, content extraction, fact verification, bias detection, temporal relevance filtering",
        "- **Document Analysis**: PDF/DOCX parsing, table extraction, image analysis, cross-reference linking, summary generation",
        "- **Academic Research**: Literature review patterns, citation network analysis, methodology evaluation, gap identification",
        "- **Competitive Intelligence**: Market analysis, feature comparison, trend detection, SWOT synthesis, opportunity identification",
        "- **Data Synthesis**: Multi-source integration, conflict resolution, confidence scoring, provenance tracking, structured output",
        "- **Verification**: Fact-checking against authoritative sources, cross-validation, hallucination detection, claim confidence scoring",
        "- **Output Quality**: Structured reports, executive summaries, detailed analysis, source bibliography, confidence intervals",
        "- **Ethics**: Source attribution, bias disclosure, limitations acknowledgment, research integrity, reproducibility",
    ],
    "collective-reviewer": [
        "- **Code Review**: Architecture compliance, security audit, performance analysis, test coverage, coding standards enforcement",
        "- **AI Output Review**: Groundedness verification, citation accuracy, response completeness, bias detection, safety check",
        "- **Config Review**: Production readiness of config/*.json, guardrails completeness, model selection appropriateness",
        "- **Infrastructure Review**: Bicep template validation, SKU appropriateness, network security, monitoring configuration",
        "- **Security Review**: OWASP LLM Top 10, secret scanning, dependency audit, access control, encryption at rest/in transit",
        "- **WAF Compliance**: Per-pillar review (security/reliability/cost/performance/ops-excellence/responsible-ai), gap identification",
        "- **Documentation Review**: README completeness, API docs accuracy, ADR quality, inline comment relevance",
        "- **Test Review**: Test quality assessment, coverage gaps, edge case identification, integration test completeness",
        "- **PR Process**: Blocking vs advisory comments, severity classification (critical/warning/info), actionable recommendations",
        "- **Review Report**: Structured verdict (APPROVED/CHANGES_NEEDED/BLOCKED), score per category, specific file:line references",
    ],
    "collective-tester": [
        "- **Unit Testing**: Business logic isolation, mock/stub strategies, assertion best practices, parameterized tests, fixtures",
        "- **Integration Testing**: Azure SDK mocking (nock/responses), database integration, API contract testing, auth flow testing",
        "- **E2E Testing**: Playwright for web UI, API test suites (Postman/Hurl), user journey validation, cross-browser testing",
        "- **AI-Specific Testing**: Prompt regression testing, output quality scoring, content safety validation, hallucination detection",
        "- **Performance Testing**: Load testing (k6/Locust), latency benchmarking, throughput measurement, resource utilization profiling",
        "- **Security Testing**: OWASP ZAP scanning, dependency audit, prompt injection testing, PII leakage detection, auth bypass",
        "- **Mutation Testing**: Stryker (TS), mutmut (Python), mutation score tracking, surviving mutants as test gaps",
        "- **Test Data**: Synthetic data generation, deterministic seeds, PII-free test data, edge case datasets, golden test sets",
        "- **CI Integration**: Test execution in pipelines, parallel test runs, flaky test detection, test impact analysis",
        "- **Coverage**: Line/branch/function coverage, coverage thresholds in CI (80%+), coverage trend tracking, gap analysis",
    ],
};

console.log("═══ Section 26 B4: Domain-Specific Core Expertise ═══\n");
let enriched = 0;
for (const f of agents) {
    const fp = path.join(dir, f);
    const c = fs.readFileSync(fp, "utf8");
    const lines = c.split("\n").length;
    const slug = f.replace("frootai-", "").replace(".agent.md", "");
    const expertise = expertiseMap[slug];
    if (!expertise) { console.log(`  ? ${f}: no domain map`); continue; }
    const startIdx = c.indexOf("## Core Expertise");
    const endIdx = c.indexOf("\n## Your Approach");
    if (startIdx < 0 || endIdx < 0) { console.log(`  ? ${f}: missing sections`); continue; }
    const newExp = "## Core Expertise\n\n" + expertise.join("\n") + "\n";
    const out = c.substring(0, startIdx) + newExp + c.substring(endIdx + 1);
    fs.writeFileSync(fp, out);
    const nl = out.split("\n").length;
    enriched++;
    console.log(`  ✅ ${f}: ${lines} → ${nl} (+${nl - lines})`);
}
const fl = agents.map(f => fs.readFileSync(path.join(dir, f), "utf8").split("\n").length);
console.log(`\n═══ B4 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
