const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(150, 160);
const expertiseMap = {
    "play-23-builder": [
        "- **Playwright MCP Integration**: Browser automation via Model Context Protocol, headless Chrome/Firefox/WebKit orchestration",
        "- **GPT-4o Vision Navigation**: Screenshot analysis for page understanding, element identification, form field detection, layout parsing",
        "- **Task Planning**: Multi-step web task decomposition, action sequencing, checkpoint recording, rollback on failure",
        "- **Form Automation**: Input field detection, dropdown selection, date pickers, file upload, multi-step form workflows",
        "- **Data Extraction**: Table scraping from rendered HTML, structured data output (JSON), screenshot-based OCR, PDF download",
        "- **Authentication Handling**: OAuth2 flow automation, SSO handling, session persistence, cookie management, credential vault",
        "- **Error Recovery**: Element not found retry, page crash recovery, navigation timeout handling, stale element refresh",
        "- **Domain Allowlist**: Security-enforced URL patterns, blocked domains, credential scope per domain, audit logging",
        "- **Container Apps Hosting**: Headless browser in container, resource limits (CPU/memory), auto-scaling, VNet for egress control",
        "- **Evaluation**: Task completion ≥90%, accuracy of extracted data ≥95%, avg task time <30s, error recovery success ≥80%",
    ],
    "play-23-reviewer": [
        "- **Task Review**: Multi-step plan logical, no unnecessary navigations, checkpoint coverage, rollback paths defined",
        "- **Vision Review**: Screenshot analysis accuracy, element identification reliable, no misclicks on wrong elements",
        "- **Security Review**: Domain allowlist enforced, credentials in vault only, no PII in screenshots stored, audit trail complete",
        "- **Error Handling Review**: Recovery logic tested, timeout values appropriate, retry limits set, graceful failure messages",
        "- **Authentication Review**: OAuth flow secure, session management correct, credential rotation supported, no token leakage",
        "- **Data Extraction Review**: Output schema validated, extracted data accurate, no truncation, encoding handled (UTF-8)",
        "- **Performance Review**: Page load waits appropriate, no unnecessary delays, parallel extraction where possible",
        "- **Container Review**: Resource limits set, no container escape risk, network egress restricted, health checks configured",
        "- **Test Review**: Representative websites tested, edge cases (SPA, iframes, shadow DOM), mobile viewport, slow network",
        "- **Compliance Review**: CFAA compliance (authorized access only), robots.txt respected, rate limiting for target sites",
    ],
    "play-23-tuner": [
        "- **Vision Config**: Screenshot resolution (1280x720 fast / 1920x1080 detailed), image quality (JPEG 80%), detail level (auto/high)",
        "- **Timeout Tuning**: Navigation 30s, element wait 10s, action execution 5s, total task timeout 120s, configurable per task type",
        "- **Retry Config**: Max retries per step (3), backoff between retries (1s, 2s, 4s), element re-detection on retry",
        "- **Domain Allowlist**: Regex patterns for allowed URLs, blocked domains list, credential mapping per domain pattern",
        "- **Extraction Config**: Output JSON schema per task type, table detection sensitivity, text extraction accuracy, image capture",
        "- **Resource Limits**: Container CPU (2 cores), memory (4GB), disk (10GB temp), concurrent browser tabs (3 max)",
        "- **A/B Testing**: Vision model versions, navigation strategies, extraction methods, retry policies, timeout values",
        "- **Cost Analysis**: Per-task cost (Container Apps compute + GPT-4o Vision tokens), task volume projection, optimization ROI",
        "- **Evaluation**: Completion ≥90%, extraction accuracy ≥95%, avg time <30s, error recovery ≥80%, cost per task <$0.10",
        "- **Production Readiness**: Target sites tested, allowlist configured, credentials secured, monitoring active, rate limits set",
    ],
    "play-dispatcher": [
        "- **Play Selection Engine**: User goal analysis → requirement matching → play recommendation with confidence scoring",
        "- **100-Play Catalog**: Indexed knowledge of all 100 solution plays, categories, services, complexity, cost estimates",
        "- **Intent Classification**: Natural language goal → category (RAG/agent/voice/security/infra/etc.) → top-3 play recommendations",
        "- **Configurator Integration**: 3-question wizard results → optimal play selection with justification",
        "- **Multi-Play Chaining**: Complex goals requiring multiple plays → dependency analysis → execution sequence → cost estimation",
        "- **Prerequisite Detection**: Play 02 (Landing Zone) required before infrastructure plays, dependency graph traversal",
        "- **Cost Estimation**: Per-play dev/prod monthly cost, combined estimate for multi-play deployments, budget-aware recommendations",
        "- **User Guide Routing**: Selected play → user guide link → DevKit init → TuneKit init → deployment workflow",
        "- **FAI Protocol Wiring**: fai-manifest.json context injection, primitive cross-referencing, WAF pillar alignment per play",
        "- **Evaluation**: Recommendation accuracy ≥90%, user satisfaction with suggestion ≥4.0, avg selection time <30s",
    ],
    "play-lifecycle": [
        "- **Play Initialization**: DevKit scaffold (19 .github files), TuneKit setup (config/*.json), SpecKit generation (play-spec.json)",
        "- **Development Phase**: Builder agent → code implementation, continuous integration, config-driven development",
        "- **Review Phase**: Reviewer agent → code quality, security, WAF compliance, config validation, architecture check",
        "- **Tuning Phase**: Tuner agent → config optimization, evaluation pipeline, A/B testing, production readiness",
        "- **Deployment Phase**: Bicep IaC → staging deploy → smoke test → evaluation → production deploy with approval gate",
        "- **Monitoring Phase**: Application Insights, custom AI metrics, SLO tracking, alert management, cost monitoring",
        "- **Iteration Phase**: User feedback → prompt tuning → config adjustment → re-evaluation → redeploy with canary",
        "- **Retirement Phase**: Deprecation notice, migration guide, data export, resource cleanup, documentation archive",
        "- **Version Management**: Semantic versioning, changelog (CHANGELOG.md), breaking change protocol, upgrade guides",
        "- **Cross-Play Dependencies**: Dependency graph, shared infrastructure (Play 02), shared primitives, version compatibility",
    ],
    "postgresql-expert": [
        "- **Azure Database for PostgreSQL**: Flexible Server, Burstable/GP/Memory-Optimized tiers, high availability (zone-redundant)",
        "- **pgvector Extension**: Vector similarity search (cosine/L2/inner product), HNSW/IVFFlat indexes, hybrid with full-text",
        "- **Performance Tuning**: EXPLAIN ANALYZE, pg_stat_statements, index optimization, connection pooling (PgBouncer), vacuum tuning",
        "- **Partitioning**: Range/list/hash partitioning, partition pruning, sub-partitioning, automated partition management",
        "- **Replication**: Streaming replication, logical replication, read replicas (up to 5), cross-region for DR, pglogical",
        "- **Security**: SSL/TLS enforcement, Entra ID authentication, row-level security, column encryption, audit extension (pgAudit)",
        "- **Extensions**: pgvector, PostGIS (geospatial), pg_trgm (fuzzy search), pg_cron (scheduling), postgres_fdw (federation)",
        "- **AI Integration**: Embedding storage in pgvector, RAG with hybrid search, change data capture for AI pipelines, JSONB for docs",
        "- **Backup & Recovery**: Automated backups (up to 35 days), point-in-time restore, geo-redundant backup, long-term retention",
        "- **Migration**: Azure Database Migration Service, pg_dump/pg_restore, online migration with minimal downtime, schema conversion",
    ],
    "power-bi-expert": [
        "- **Semantic Models**: Star schema design, DAX measures, calculated columns, relationships, RLS (row-level security)",
        "- **DAX Mastery**: CALCULATE, FILTER, ALL/ALLEXCEPT, time intelligence (DATEADD, SAMEPERIODLASTYEAR), iterators (SUMX/AVERAGEX)",
        "- **Dataflows**: Power Query M transformations, incremental refresh, linked/computed entities, Gen2 storage, Fabric integration",
        "- **AI Visuals**: Key influencers, decomposition tree, anomaly detection, Q&A visual, smart narrative, Copilot in Power BI",
        "- **Performance**: Aggregations, composite models, DirectQuery optimization, import mode tuning, Best Practice Analyzer",
        "- **Deployment Pipelines**: Dev→Test→Prod promotion, approval gates, differential refresh, automated testing",
        "- **Embedded Analytics**: Power BI Embedded (A/EM SKUs), JavaScript SDK, row-level security for tenants, custom visuals",
        "- **AI Metrics Dashboard**: Token usage visualization, model quality trends, cost analysis, SLO tracking, alert status",
        "- **Security**: Workspace roles, app permissions, sensitivity labels, conditional access, export controls, audit logging",
        "- **Fabric Integration**: Lakehouse, Warehouse, Real-Time Analytics, OneLake, cross-workload connectors, unified compute",
    ],
    "power-platform-expert": [
        "- **Power Automate**: Cloud flows (automated/instant/scheduled), desktop flows (RPA), business process flows, AI Builder actions",
        "- **Power Apps**: Canvas apps (pixel-perfect), model-driven apps (Dataverse), portals (external users), Copilot-assisted development",
        "- **Dataverse**: Table design, relationships, business rules, calculated/rollup columns, environment management, solutions",
        "- **AI Builder**: Document processing, text classification, prediction, object detection, GPT prompts, custom models",
        "- **Connectors**: Premium connectors (Office 365, SharePoint, Dynamics), custom connectors (OpenAPI), on-premises gateway",
        "- **ALM**: Solutions, environment strategy (dev/test/prod), deployment pipelines, version control, managed vs unmanaged",
        "- **Security**: DLP policies, roles (system admin/maker/user), environment security groups, conditional access, tenant isolation",
        "- **Governance**: CoE Starter Kit, usage analytics, maker onboarding, compliance monitoring, license management",
        "- **Integration**: Azure services (Functions, Logic Apps, Service Bus), Dataverse APIs, virtual tables, dual-write with D365",
        "- **AI Integration**: Copilot in Power Apps/Automate, AI Builder with Azure OpenAI, custom connectors for FrootAI MCP",
    ],
    "prd-writer": [
        "- **PRD Structure**: Problem statement, user personas, requirements (functional/non-functional), success metrics, timeline",
        "- **User Stories**: As a [persona], I want [capability], so that [benefit] — with acceptance criteria (Given/When/Then)",
        "- **Requirements Taxonomy**: Must-have (P0), should-have (P1), nice-to-have (P2), won't-have (P3) — MoSCoW prioritization",
        "- **AI-Specific PRDs**: Model selection rationale, evaluation criteria, guardrails specification, data requirements, cost projections",
        "- **Non-Functional Requirements**: Performance (latency SLOs), security (compliance), reliability (uptime), scalability (load projections)",
        "- **Technical Specifications**: Architecture decision records, API contracts (OpenAPI), data models, integration points, dependencies",
        "- **Success Metrics**: Quantifiable KPIs, measurement methodology, baseline, targets, timeframe, reporting cadence",
        "- **Risk Assessment**: Technical risks, business risks, mitigation strategies, contingency plans, risk owners",
        "- **Stakeholder Management**: RACI matrix, approval workflow, feedback cycles, change request process",
        "- **FrootAI Integration**: Solution play recommendation, DevKit/TuneKit alignment, WAF pillar mapping, FAI manifest reference",
    ],
    "product-manager": [
        "- **Product Strategy**: Vision → strategy → roadmap → backlog, OKR alignment, competitive positioning, market analysis",
        "- **Roadmap Management**: Quarterly themes, feature prioritization (RICE/WSJF), dependency mapping, resource allocation",
        "- **Stakeholder Communication**: Executive updates, sprint reviews, customer advisory boards, cross-team alignment, release notes",
        "- **User Research**: Interview framework, survey design, usability testing, analytics-driven insights, persona development",
        "- **Metrics-Driven**: North Star metric, leading/lagging indicators, funnel analysis, cohort analysis, experimentation framework",
        "- **AI Product Management**: Model quality as product metric, prompt as feature, evaluation as acceptance criteria, cost as constraint",
        "- **Go-to-Market**: Launch planning, documentation, enablement, pricing, adoption tracking, feedback loops",
        "- **Technical Fluency**: Architecture understanding, API literacy, infrastructure awareness, cost modeling, security requirements",
        "- **Agile Facilitation**: Sprint planning, backlog refinement, retrospectives, daily standups, release coordination",
        "- **FrootAI Context**: 100 solution plays as product portfolio, primitives as reusable components, FAI Protocol as platform strategy",
    ],
};
console.log("═══ Section 26 B16: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B16 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
