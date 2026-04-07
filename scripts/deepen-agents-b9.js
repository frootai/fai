const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(80, 90);
const expertiseMap = {
    "openapi-expert": [
        "- **OpenAPI 3.1**: JSON Schema 2020-12 alignment, webhooks, pathItems, $ref with $id anchors, discriminator patterns",
        "- **API Design**: Resource naming, versioning (URL/header/query), pagination (cursor/offset), filtering, sorting, field selection",
        "- **Code Generation**: openapi-generator (TypeScript/Python/C#/Go), Kiota (Microsoft), server stubs, client SDKs, model types",
        "- **Validation**: Spectral linting rules, custom rulesets, breaking change detection, contract testing, schema validation",
        "- **Documentation**: Swagger UI, Redoc, Scalar, interactive try-it, example generation, markdown descriptions",
        "- **Security Schemes**: OAuth2 flows, API key, Bearer JWT, mutual TLS, OpenID Connect discovery, scope management",
        "- **APIM Integration**: Azure API Management import, policy generation from spec, developer portal, subscription management",
        "- **AI API Patterns**: Chat completions endpoint spec, streaming SSE, function calling schema, embedding endpoint, health check",
        "- **Testing**: Contract testing (Pact/Prism), mock servers, example-based testing, fuzzing, response validation",
        "- **Governance**: API catalog, lifecycle management (draft→published→deprecated→retired), versioning policy, review workflow",
    ],
    "performance-profiler": [
        "- **Application Profiling**: CPU flame graphs, memory allocation tracking, GC pressure analysis, async gap identification",
        "- **Node.js Profiling**: V8 profiler, clinic.js (Doctor/Flame/Bubbleprof), heap snapshots, event loop lag, async hooks",
        "- **Python Profiling**: cProfile, py-spy (sampling), memory_profiler, line_profiler, asyncio task tracing",
        "- **.NET Profiling**: dotnet-trace, dotnet-counters, Event Pipe, PerfView, BenchmarkDotNet, JIT inlining analysis",
        "- **Load Testing**: k6 (JavaScript), Locust (Python), Artillery, JMeter — scenario design, ramp patterns, SLO validation",
        "- **AI-Specific Perf**: LLM latency breakdown (TTFT/TPS), embedding throughput, cache hit ratio, token generation speed",
        "- **Database Profiling**: Slow query analysis, index usage stats, connection pool metrics, lock contention, partition hot spots",
        "- **Network Profiling**: Latency waterfall, DNS resolution time, TLS handshake, connection reuse, payload size optimization",
        "- **Azure Monitor**: Application Insights performance blade, KQL for latency analysis, custom metrics, smart detection",
        "- **Continuous Profiling**: Production profiling (Pyroscope/Datadog), baseline comparison, regression detection, alerting on p99",
    ],
    "php-expert": [
        "- **PHP 8.3+**: Typed class constants, readonly classes, disjunctive normal form types, fibers, enums, named arguments",
        "- **Laravel 11**: Slim skeleton, per-second rate limiting, health endpoint, Reverb (WebSocket), Prompts, Octane (Swoole)",
        "- **API Development**: Laravel API resources, Sanctum/Passport auth, rate limiting, versioning, OpenAPI generation",
        "- **Testing**: PHPUnit, Pest, Laravel Dusk (browser), factory patterns, database assertions, mocking, parallel testing",
        "- **Performance**: OPcache, JIT compilation, Octane (long-running), query optimization, N+1 detection (Laravel Debugbar)",
        "- **Azure Integration**: Azure SDK for PHP, Blob Storage, Service Bus, App Service deployment, managed identity (env vars)",
        "- **Security**: CSRF protection, SQL injection prevention (Eloquent), XSS escaping, CORS, rate limiting, input validation",
        "- **AI Integration**: OpenAI PHP SDK, streaming responses, Laravel queues for async AI processing, cache for embeddings",
        "- **Deployment**: Docker (php-fpm + nginx), Azure App Service, Container Apps, GitHub Actions with Composer, PHPStan CI",
        "- **Architecture**: Domain-driven design, repository pattern, service layer, event sourcing, CQRS with Laravel events",
    ],
    "php-mcp-expert": [
        "- **MCP in PHP**: Model Context Protocol server implementation, tool handler classes, JSON-RPC over stdio, process management",
        "- **Tool Design**: Tool class with schema definition, parameter validation, typed return values, error response formatting",
        "- **Framework Integration**: Laravel service provider for MCP, Symfony bundle, standalone PHP implementation",
        "- **Server Architecture**: ReactPHP for async I/O, tool registry, middleware pipeline, logging, health checks",
        "- **Client Integration**: PHP MCP client, tool discovery, VS Code/Claude configuration, process lifecycle management",
        "- **Azure Integration**: Azure SDK for PHP, Key Vault via REST API, Application Insights custom events, Blob Storage",
        "- **Testing**: PHPUnit for tool handlers, integration tests with mock stdio, Pest for BDD-style, coverage reporting",
        "- **Deployment**: Docker container (php-cli), Supervisor for process management, Container Apps, systemd service",
        "- **Performance**: OpCache for compiled tools, persistent connections, batch tool execution, response streaming",
        "- **FrootAI Integration**: frootai-mcp tool catalog access, knowledge search, play recommendations, cost estimation",
    ],
    "play-01-builder": [
        "- **Enterprise RAG Architecture**: Hybrid search (BM25 + vector), semantic reranking, document chunking (512 tokens, 10% overlap)",
        "- **Azure AI Search**: Index schema design, skillsets for enrichment, custom analyzers, scoring profiles, synonym maps",
        "- **Azure OpenAI Integration**: Chat completions with citations, embedding generation (text-embedding-3-large), streaming responses",
        "- **Container Apps API**: FastAPI/Express backend, managed identity auth, health endpoints, auto-scaling, VNet integration",
        "- **Document Processing**: PDF/DOCX ingestion, chunking strategies (semantic/recursive/fixed), metadata extraction, PII redaction",
        "- **Citation Pipeline**: Source attribution, paragraph-level citations, confidence scoring, multi-source synthesis, answer grounding",
        "- **Config-Driven**: temperature=0.1, top_k=5, chunk_size=512, hybrid_weight=0.6, relevance_threshold=0.78 from config/*.json",
        "- **Evaluation**: Groundedness (>0.95), relevance (>0.85), coherence (>0.90), safety (0 failures), cost per query (<$0.01)",
        "- **Security**: Private endpoints for AI Search + OpenAI, managed identity, Content Safety API, PII redaction in logs",
        "- **Bicep IaC**: AI Search (S1), OpenAI (S0), Container Apps environment, Blob Storage, Key Vault — all with tagging",
    ],
    "play-01-reviewer": [
        "- **RAG Quality Review**: Citation accuracy check, answer grounding verification, hallucination detection, completeness scoring",
        "- **Search Configuration**: Hybrid weight validation, top-k appropriateness, relevance threshold tuning, index field coverage",
        "- **Security Audit**: Private endpoint verification, managed identity check, Content Safety enabled, no hardcoded keys",
        "- **Code Quality**: Python type hints, error handling on all Azure SDK calls, structured logging, test coverage (>80%)",
        "- **Config Validation**: temperature ≤ 0.3, chunk_size matches index, relevance_threshold > 0.65, guardrails complete",
        "- **Infrastructure Review**: Bicep compiles, correct SKUs for environment, monitoring configured, tags present",
        "- **Performance Review**: Streaming enabled, connection pooling, caching strategy, latency under SLO (<5s p95)",
        "- **WAF Compliance**: Security (MI+KV+PE), reliability (retry+health), cost (max_tokens+cache), performance (stream+async)",
        "- **Test Review**: Unit tests for retrieval logic, integration tests for API, evaluation pipeline passes all thresholds",
        "- **Documentation Review**: README complete, API documented, config files commented, architecture diagram present",
    ],
    "play-01-tuner": [
        "- **OpenAI Config Tuning**: temperature (0.1→0.3 range), top_p (0.85-0.95), max_tokens (800-1500), seed for reproducibility",
        "- **Search Config Tuning**: hybrid_weight (0.4-0.7), top_k (3-10), relevance_threshold (0.65-0.85), reranker (semantic/cross-encoder)",
        "- **Chunking Optimization**: chunk_size (256-1024 tokens), overlap (5-15%), strategy (semantic vs recursive vs fixed-size)",
        "- **Guardrail Validation**: content_safety enabled, PII detection on, min_confidence ≥ 0.7, require_citations = true",
        "- **Evaluation Pipeline**: Run eval.py, check groundedness ≥ 0.95, relevance ≥ 0.85, coherence ≥ 0.90, safety = 0 failures",
        "- **Cost Analysis**: Token usage per query, cache hit ratio, embedding costs, total cost per query target (<$0.01)",
        "- **A/B Testing**: 90/10 traffic split, compare quality metrics, minimum 100 queries per variant, promote if all metrics hold",
        "- **Model Selection**: gpt-4o for synthesis (quality), gpt-4o-mini for classification (cost), text-embedding-3-large for vectors",
        "- **Infrastructure Tuning**: AI Search SKU (Basic→S1→S2), Container Apps scaling rules, Redis cache TTL, Blob lifecycle",
        "- **Production Readiness**: All configs validated, eval passes, Bicep compiles, no secrets in code, monitoring configured",
    ],
    "play-02-builder": [
        "- **Hub-Spoke Network**: Central hub VNet with Firewall/Bastion, spoke VNet per workload, peering with gateway transit",
        "- **Private Endpoints**: PE for Cognitive Services, AI Search, Storage, Cosmos DB — DNS integration with Private DNS Zones",
        "- **Identity Foundation**: System-assigned managed identity per service, user-assigned MI for cross-service, RBAC assignments",
        "- **Azure Firewall**: Premium SKU with TLS inspection, IDPS, application rules, network rules, FQDN tags for Azure services",
        "- **DNS Architecture**: Azure Private DNS zones, conditional forwarding, split-brain DNS, DNS Private Resolver for hybrid",
        "- **GPU Quota**: Regional quota allocation, subscription-level limits, quota increase requests, capacity reservation for prod",
        "- **Governance**: Azure Policy initiatives for AI compliance, required tags, allowed SKUs, mandatory PE, mandatory MI",
        "- **Monitoring**: Central Log Analytics workspace, diagnostic settings for all resources, NSG flow logs, Azure Sentinel",
        "- **Bicep Modules**: Modular templates (network.bicep, identity.bicep, governance.bicep), parameter files per environment",
        "- **Cost Management**: Budget alerts, resource locks on shared infra, advisor recommendations, reserved instances for stable",
    ],
    "play-02-reviewer": [
        "- **Network Review**: Address space planning (no overlap), peering configured, NSG rules appropriate, firewall rules minimal",
        "- **Identity Review**: Managed identity on all services, RBAC assignments follow least-privilege, no standing admin access",
        "- **DNS Review**: Private DNS zones linked, conditional forwarding correct, no public DNS leakage, split-brain works",
        "- **Policy Review**: Required policies applied (PE, MI, tagging), no exemptions without justification, compliance dashboard clean",
        "- **Security Review**: No public endpoints in production, Firewall Premium features enabled, DDoS protection, encryption at rest",
        "- **Monitoring Review**: All resources sending diagnostics, Log Analytics retention appropriate, alerts configured for critical events",
        "- **Bicep Review**: Templates compile, modular structure, conditional dev/prod, parameters documented, outputs useful",
        "- **Cost Review**: SKUs appropriate for environment, no over-provisioned resources, budget alerts set, advisor recommendations",
        "- **Documentation Review**: Architecture diagram, decision log for design choices, runbook for common operations",
        "- **Compliance Review**: Meets regulatory requirements for intended workloads (HIPAA/SOC2/PCI), evidence documented",
    ],
    "play-02-tuner": [
        "- **Network Tuning**: VNet CIDR sizing (future growth), subnet delegation, NSG rules tightened, UDR for forced tunneling",
        "- **Firewall Tuning**: Rule optimization (most-used first), IDPS signature selection, TLS inspection scope, log retention",
        "- **Identity Tuning**: Role assignment cleanup, PIM activation policies, conditional access rules, session lifetime",
        "- **Policy Tuning**: Effect severity (audit → deny), exclusion scope minimization, remediation task configuration",
        "- **GPU Quota Tuning**: Right-size per workload (A100 for training, T4 for inference), spot vs reserved allocation",
        "- **Cost Tuning**: Reserved instances for stable workloads, auto-shutdown for dev, right-size firewall SKU, storage tiering",
        "- **Monitoring Tuning**: Log Analytics commitment tier selection, diagnostic categories (minimize noise), alert threshold calibration",
        "- **Performance Tuning**: VNet peering bandwidth, DNS resolution latency, firewall throughput, private endpoint DNS TTL",
        "- **DR Tuning**: RPO/RTO targets, geo-replication config, failover automation, backup frequency, recovery testing schedule",
        "- **Production Readiness**: All recommendations from reviewer addressed, compliance scan clean, load test passed, DR tested",
    ],
};
console.log("═══ Section 26 B9: Domain-Specific Core Expertise ═══\n");
let enriched = 0;
for (const f of agents) {
    const fp = path.join(dir, f); const c = fs.readFileSync(fp, "utf8"); const lines = c.split("\n").length;
    const slug = f.replace("frootai-", "").replace(".agent.md", "");
    const expertise = expertiseMap[slug];
    if (!expertise) { console.log(`  ? ${f}: no domain map`); continue; }
    const s = c.indexOf("## Core Expertise"), e = c.indexOf("\n## Your Approach");
    if (s < 0 || e < 0) { console.log(`  ? ${f}: missing sections`); continue; }
    const out = c.substring(0, s) + "## Core Expertise\n\n" + expertise.join("\n") + "\n" + c.substring(e + 1);
    fs.writeFileSync(fp, out); enriched++;
    console.log(`  ✅ ${f}: ${lines} → ${out.split("\n").length}`);
}
const fl = agents.map(f => fs.readFileSync(path.join(dir, f), "utf8").split("\n").length);
console.log(`\n═══ B9 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
