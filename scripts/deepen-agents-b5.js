const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(40, 50);

const expertiseMap = {
    "compliance-expert": [
        "- **GDPR**: Data subject rights (access/erasure/portability), lawful basis, DPIA, data processing agreements, cross-border transfers",
        "- **HIPAA**: PHI identification, BAAs, minimum necessary rule, audit controls, breach notification (60-day window), de-identification",
        "- **SOC 2**: Trust Service Criteria (security/availability/processing integrity/confidentiality/privacy), Type I vs Type II, evidence collection",
        "- **EU AI Act**: Risk classification (minimal/limited/high/unacceptable), conformity assessment, transparency obligations, AI Office reporting",
        "- **NIST AI RMF**: Govern/Map/Measure/Manage functions, AI risk taxonomy, trustworthy AI characteristics, implementation tiers",
        "- **Azure Compliance**: Azure Policy for enforcement, Microsoft Purview for data governance, Defender for Cloud regulatory compliance",
        "- **Audit Trails**: Immutable logging, retention policies (7 years financial, 6 years HIPAA), tamper-evident storage, chain of custody",
        "- **Data Classification**: Public/internal/confidential/restricted tiers, auto-classification with AI, labeling enforcement, DLP policies",
        "- **Incident Response**: Breach notification timelines (72h GDPR, 60d HIPAA), incident severity classification, communication templates",
        "- **Evidence Collection**: Automated compliance evidence, continuous monitoring, gap analysis reports, remediation tracking dashboards",
    ],
    "content-safety-expert": [
        "- **Azure Content Safety API**: Text/image analysis, severity scoring (0-6), category classification (hate/violence/sexual/self-harm)",
        "- **Custom Categories**: Training custom blocklist categories, industry-specific content rules, brand safety policies, cultural sensitivity",
        "- **Prompt Shield**: Jailbreak detection, prompt injection defense (direct/indirect), system message protection, red team patterns",
        "- **Groundedness Detection**: Hallucination scoring, source attribution verification, factual consistency checking, citation validation",
        "- **PII Detection**: Personal data categories (email/phone/SSN/address), entity recognition, redaction strategies, data masking",
        "- **Multi-Modal Safety**: Image content analysis, text-in-image detection, video frame sampling, audio transcription screening",
        "- **Severity Routing**: Threshold-based routing (block/review/pass), human review queues, appeal workflows, escalation rules",
        "- **Cultural Context**: Region-specific moderation rules, language-aware filtering, hate speech in multiple languages, sarcasm detection",
        "- **Metrics & Reporting**: False positive/negative rates, moderation latency, human override rates, safety scorecards, trend analysis",
        "- **Integration Patterns**: Pre-LLM input screening, post-LLM output filtering, real-time streaming moderation, batch analysis",
    ],
    "copilot-ecosystem-expert": [
        "- **Microsoft 365 Copilot**: Declarative agents, API plugins (TypeSpec), Graph connectors, message extensions, Copilot Studio integration",
        "- **Copilot Studio**: Low-code agent builder, topic/trigger design, knowledge grounding (SharePoint/web), generative AI orchestration",
        "- **GitHub Copilot**: .agent.md files, .instructions.md, SKILL.md, hooks.json, copilot-instructions.md, MCP server integration",
        "- **Graph API**: User/mail/calendar/files/teams data access, delegated vs application permissions, batch requests, change notifications",
        "- **Adaptive Cards**: Universal actions, card templating, data binding, Teams-specific features, sequential workflows",
        "- **Authentication**: SSO with Entra ID, OAuth2/OIDC flows, token caching, multi-tenant app registration, B2C integration",
        "- **Power Platform**: Power Automate flows, Power Apps connectors, Dataverse tables, environment management, DLP policies",
        "- **Teams Extensions**: Message extensions (search/action), task modules, tabs, bots (Bot Framework), meeting extensions",
        "- **Deployment**: Teams app manifest, admin consent, app catalog publishing, Microsoft 365 admin center, governance controls",
        "- **FAI Integration**: FrootAI plays wired as Copilot plugins, MCP tools exposed via message extensions, DevKit for Copilot agents",
    ],
    "cost-gateway": [
        "- **Semantic Caching**: Redis-backed response cache, embedding similarity threshold (0.92-0.98), TTL management, cache invalidation",
        "- **Model Routing**: Complexity-based routing (gpt-4o for reasoning, mini for classification), cost/quality scoring, dynamic thresholds",
        "- **Token Budgets**: Per-user/team/project daily limits, real-time budget tracking, alert on 80% consumption, hard stop at 100%",
        "- **Rate Limiting**: Sliding window per subscription, burst allowance, retry-after headers, priority queuing for premium users",
        "- **Multi-Region LB**: Priority-based failover across Azure OpenAI regions, latency-aware routing, capacity-aware distribution",
        "- **Usage Analytics**: Real-time dashboards (tokens/cost/latency by model/user/team), FinOps reports, chargeback data exports",
        "- **Fallback Chains**: Model fallback (4o → mini → cached), region fallback, graceful degradation responses, circuit breaker",
        "- **APIM Policies**: Inbound token counting, outbound cost tagging, custom dimensions for analytics, JWT validation, IP filtering",
        "- **Cost Attribution**: Tag-based cost allocation, project/team/cost-center mapping, monthly billing reports, anomaly detection",
        "- **A/B Testing**: Traffic splitting between models/prompts, cost comparison, quality comparison, automated winner selection",
    ],
    "cost-optimizer": [
        "- **FinOps Framework**: Inform (visibility) → Optimize (right-size) → Operate (governance), maturity model assessment",
        "- **Azure Cost Management**: Budget alerts, cost analysis by resource/tag/service, anomaly detection, advisor recommendations",
        "- **AI-Specific Cost**: Token usage tracking per model, cost per query calculation, embedding vs completion cost split, caching ROI",
        "- **Right-Sizing**: SKU recommendations based on actual usage, dev vs prod tier optimization, auto-scaling tuning, idle detection",
        "- **Reserved Instances**: 1yr/3yr commitment analysis, savings calculator, coverage vs utilization, RI exchange/refund policies",
        "- **Spot/Low-Priority**: Spot VM for training workloads (70-90% savings), eviction handling, checkpoint/resume patterns",
        "- **Model Selection Economics**: gpt-4o ($2.50/1M input) vs gpt-4o-mini ($0.15/1M) vs gpt-4.1-nano ($0.10/1M) decision framework",
        "- **Caching Economics**: Cache hit ratio targets (>30%), Redis vs in-memory, semantic vs exact match, TTL optimization",
        "- **Monitoring**: Cost anomaly alerts, budget burn-rate tracking, forecasting, tag compliance enforcement, waste reports",
        "- **Governance**: Azure Policy for cost controls, tag requirements, allowed SKU lists, region restrictions, approval workflows",
    ],
    "csharp-expert": [
        "- **C# 12/.NET 9**: Primary constructors, collection expressions, inline arrays, interceptors, Native AOT, Blazor United",
        "- **ASP.NET Core**: Minimal APIs, endpoint routing, middleware pipeline, authentication/authorization, rate limiting middleware",
        "- **Azure SDK for .NET**: Azure.Identity, Azure.AI.OpenAI, Azure.Search.Documents, Azure.Messaging.ServiceBus, Azure.Storage.Blobs",
        "- **AI Integration**: Semantic Kernel SDK, Azure.AI.OpenAI streaming, function calling, structured output, embeddings, content safety",
        "- **Entity Framework Core**: Code-first migrations, split queries, compiled queries, owned entities, value converters, Cosmos DB provider",
        "- **Testing**: xUnit, NSubstitute/Moq, FluentAssertions, Testcontainers, WebApplicationFactory, Bogus for test data",
        "- **Performance**: Span<T>, ArrayPool, ValueTask, IAsyncEnumerable for streaming, System.Text.Json source generators",
        "- **Dependency Injection**: Built-in DI, keyed services, hosted services, IHttpClientFactory, options pattern",
        "- **Deployment**: Docker multi-stage builds, Container Apps, Azure Functions (.NET isolated), AKS, GitHub Actions with dotnet CLI",
        "- **Security**: Data protection API, anti-forgery tokens, CORS policies, certificate authentication, managed identity",
    ],
    "csharp-mcp-expert": [
        "- **MCP Protocol in C#**: MCP SDK for .NET, tool registration, parameter validation, stdio transport, SSE transport",
        "- **Semantic Kernel MCP**: SK MCP connector, tool auto-discovery, function calling pipeline, kernel plugin bridge",
        "- **Tool Implementation**: IToolHandler interface, async tool execution, streaming results, error handling, cancellation tokens",
        "- **Server Architecture**: Hosted service pattern, DI-based tool registry, middleware pipeline, health checks, configuration",
        "- **Client Integration**: MCP client in Copilot extensions, VS Code MCP config, Claude/Cursor integration, multi-server routing",
        "- **Testing**: Tool unit tests, integration tests with mock MCP client, end-to-end server tests, performance benchmarks",
        "- **Deployment**: Docker container for MCP server, Azure Container Apps, AKS sidecar, GitHub Codespaces dev container",
        "- **Security**: Tool permission scoping, input validation, output sanitization, rate limiting per tool, audit logging",
        "- **Azure Integration**: Key Vault for secrets, Application Insights for telemetry, Cosmos DB for state, Blob for artifacts",
        "- **FrootAI MCP**: frootai-mcp tool catalog, knowledge module search, play recommendation, cost estimation, architecture patterns",
    ],
    "data-engineer": [
        "- **Azure Data Factory**: Pipeline orchestration, data flows (mapping/wrangling), linked services, integration runtime, triggers",
        "- **Event-Driven Ingestion**: Event Hubs, Event Grid, Service Bus, IoT Hub — schema registry, dead-letter, exactly-once semantics",
        "- **Stream Processing**: Azure Stream Analytics (SQL), Spark Structured Streaming, Flink on HDInsight, windowing functions",
        "- **Data Lake**: ADLS Gen2, hierarchical namespace, ACLs, Delta Lake format, Apache Iceberg, partition strategies",
        "- **Data Quality**: Great Expectations, Deequ, custom validation rules, completeness/accuracy/consistency/timeliness scoring",
        "- **PII Management**: Presidio for PII detection, data masking, tokenization, pseudonymization, k-anonymity, differential privacy",
        "- **ETL Patterns**: ELT vs ETL, incremental loading, CDC (change data capture), SCD Type 1/2, merge/upsert operations",
        "- **AI Data Pipeline**: Document chunking for RAG, embedding generation, vector index building, training data preparation (JSONL)",
        "- **Orchestration**: Airflow on AKS, Data Factory pipelines, Prefect, dependency management, retry/alerting, data lineage",
        "- **Monitoring**: Pipeline run metrics, data freshness SLAs, schema drift detection, cost per pipeline, quality trend dashboards",
    ],
    "debug-expert": [
        "- **Systematic Debugging**: Binary search isolation, hypothesis-driven investigation, minimal reproduction, git bisect for regressions",
        "- **Application Insights**: Transaction search, end-to-end tracing, dependency map, failure analysis, smart detection insights",
        "- **Azure Service Debugging**: Resource health, activity log analysis, diagnostic settings, support ticket creation, known issues",
        "- **LLM Debugging**: Prompt regression detection, token limit investigation, content filter analysis, model version comparison",
        "- **Performance Profiling**: CPU/memory profiling (.NET/Node/Python), flame graphs, heap snapshots, slow query identification",
        "- **Network Debugging**: DNS resolution tracing, connectivity tests, NSG flow logs, packet capture, SSL/TLS handshake analysis",
        "- **Container Debugging**: kubectl logs/exec/describe, pod events, OOM scores, init container failures, readiness probe debugging",
        "- **Database Debugging**: Query execution plans, deadlock graphs, missing index analysis, partition key hot spots, RU consumption",
        "- **Log Analysis**: KQL queries for error patterns, correlation ID following, log level filtering, time-range isolation",
        "- **Incident Management**: Severity classification, timeline construction, root cause analysis, blameless post-mortems, runbook creation",
    ],
    "deterministic-expert": [
        "- **Zero-Temperature Inference**: temperature=0, seed pinning for reproducibility, response consistency verification across calls",
        "- **Structured Output**: JSON mode, function calling with strict schemas, Pydantic/Zod validation, output format enforcement",
        "- **Anti-Sycophancy**: Prompts that resist user pressure, contradiction detection, calibrated confidence, independent reasoning",
        "- **Confidence Scoring**: Calibrated probability estimation, threshold-based abstention (min 0.7), multi-evidence requirement",
        "- **Citation Grounding**: Source-attributed responses, document-paragraph level citations, citation verification pipeline",
        "- **Multi-Layer Guardrails**: Input validation → Content Safety → schema validation → confidence check → citation check → output filter",
        "- **Reproducibility**: Seed + temperature=0 + fixed prompt = identical output, regression test suites, golden response sets",
        "- **Verification Loops**: LLM output → validator → retry if invalid → max 3 attempts → abstain if all fail, structured error responses",
        "- **Testing**: Consistency tests (same input = same output 100 times), adversarial prompts, edge case coverage, regression suites",
        "- **Evaluation Metrics**: Consistency rate (>99%), faithfulness to sources (>0.95), abstention rate on unknowns, false confidence rate",
    ],
};

console.log("═══ Section 26 B5: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B5 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
