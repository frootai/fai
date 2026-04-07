const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(170, 180);
const expertiseMap = {
    "responsible-ai-reviewer": [
        "- **Fairness Assessment**: Demographic parity, equalized odds, calibration across groups, intersectional analysis, disparate impact",
        "- **Bias Detection**: Training data bias audit, output bias measurement, group fairness metrics, individual fairness, counterfactual",
        "- **Transparency**: Model cards, datasheets for datasets, decision explanations (SHAP/LIME), confidence display, limitation disclosure",
        "- **EU AI Act Compliance**: Risk classification (minimal→unacceptable), conformity assessment, technical documentation, human oversight",
        "- **Content Safety Review**: Azure Content Safety coverage, severity calibration, cultural sensitivity, multi-language testing",
        "- **Human Oversight**: Human-in-the-loop requirements, override mechanisms, escalation paths, decision audit trails",
        "- **Privacy Review**: PII detection coverage, data minimization, purpose limitation, consent management, GDPR Article 22 (automated decisions)",
        "- **Accountability**: Incident response for AI failures, responsibility assignment, remediation tracking, lessons learned process",
        "- **Red Team Integration**: Safety evaluation campaign review, vulnerability remediation tracking, regression prevention",
        "- **Reporting**: Responsible AI scorecard (fairness/transparency/safety/privacy/accountability), trend tracking, board-ready reports",
    ],
    "ruby-expert": [
        "- **Ruby 3.3+**: YJIT enabled by default, Prism parser, M:N thread scheduler, improved GC, pattern matching, data classes",
        "- **Rails 7.2+**: Strict loading by default, async queries, Turbo 8 (morphing), Solid Queue/Cache/Cable, Kamal for deployment",
        "- **API Development**: Rails API mode, ActiveModel::Serializers/Blueprinter, Grape API, JWT auth (devise-jwt), rate limiting (rack-attack)",
        "- **Testing**: RSpec, FactoryBot, VCR for HTTP mocking, Capybara for system tests, SimpleCov, parallel_tests, CI with GitHub Actions",
        "- **Performance**: YJIT optimizations, fragment caching, Russian doll caching, Sidekiq for background jobs, connection pool tuning",
        "- **Azure Integration**: Azure SDK for Ruby (limited), REST API wrappers, Managed Identity via REST, Key Vault secrets via REST",
        "- **AI Integration**: ruby-openai gem, streaming responses, LangChain.rb, embeddings, Faraday for HTTP with retry middleware",
        "- **Security**: Brakeman for SAST, bundler-audit, strong parameters, CSRF protection, SQL injection prevention, CSP headers",
        "- **Deployment**: Kamal (Docker-based), Heroku, Azure App Service (container), GitHub Actions CI, Dockerfile with multi-stage",
        "- **Database**: ActiveRecord, PostgreSQL with pgvector, Redis for caching/Sidekiq, database migrations, N+1 detection (Bullet)",
    ],
    "ruby-mcp-expert": [
        "- **MCP in Ruby**: Model Context Protocol server implementation, tool handler modules, JSON-RPC over stdio, Ractor for concurrency",
        "- **Tool Design**: Method-based tool handlers, parameter validation (dry-validation), structured responses, error handling",
        "- **Gem Architecture**: Bundler gem structure, semantic versioning, RubyGems publishing, dependency management",
        "- **Server Implementation**: EventMachine or Async for I/O, tool registry, middleware chain, logging, health checks",
        "- **Client Integration**: Ruby MCP client, tool discovery, VS Code/Claude/Cursor configuration, process management",
        "- **Azure Integration**: REST API clients for Azure services, Managed Identity token acquisition, Key Vault via REST",
        "- **Testing**: RSpec for tool handlers, VCR for external API mocking, integration tests, SimpleCov for coverage",
        "- **Deployment**: Docker container (ruby:3.3-slim), Container Apps, systemd service, Kamal deployment",
        "- **Performance**: Ractor-based parallelism, connection pooling (Faraday), batch tool execution, response caching",
        "- **FrootAI Integration**: frootai-mcp tool catalog, knowledge search, play recommendation, cost estimation via Ruby client",
    ],
    "rust-expert": [
        "- **Rust 2024 Edition**: Async traits, return position impl Trait, let chains, improved error messages, cargo script",
        "- **Web Frameworks**: Axum (Tokio-based), Actix-web, Rocket, Warp — async HTTP servers with type-safe routing, middleware",
        "- **Async Programming**: Tokio runtime, async/await, mpsc channels, select!, JoinSet, graceful shutdown, structured concurrency",
        "- **WASM**: Rust → WebAssembly compilation, wasm-bindgen, wasm-pack, browser and server-side WASM, edge computing targets",
        "- **MCP Integration**: Rust MCP SDK, zero-copy JSON parsing (serde), async tool handlers, high-throughput stdio transport",
        "- **Performance**: Zero-cost abstractions, no GC, SIMD (packed_simd), rayon for data parallelism, benchmarking (criterion.rs)",
        "- **Safety**: Borrow checker, lifetimes, ownership model, unsafe audit, clippy linting, cargo deny for dependency audit",
        "- **Testing**: #[test], proptest (property-based), mockall, tokio::test, integration tests, fuzzing (cargo-fuzz/AFL)",
        "- **AI Integration**: OpenAI via reqwest, streaming with async-stream, ONNX Runtime bindings, embeddings via REST API",
        "- **Deployment**: Static binary (musl), Docker scratch image (2MB), Azure Container Apps, Lambda (custom runtime), cross-compilation",
    ],
    "rust-mcp-expert": [
        "- **MCP in Rust**: High-performance MCP server, serde for zero-copy JSON, tokio async runtime, stdio/SSE transport",
        "- **Tool Design**: Trait-based tool handlers, derive macros for parameter schemas, async fn handlers, Result<T, E> errors",
        "- **Performance**: Zero-allocation parsing, connection pooling (reqwest), batch tool execution, sub-millisecond tool dispatch",
        "- **Server Architecture**: Tokio-based async server, tower middleware, tracing for observability, graceful shutdown, health checks",
        "- **Client Integration**: Rust MCP client, tool discovery, compile-time schema validation, multi-server multiplexing",
        "- **Azure Integration**: reqwest for Azure REST APIs, azure_identity crate, Key Vault, Application Insights (OpenTelemetry)",
        "- **Testing**: tokio::test, mock tool handlers, property-based testing (proptest), fuzz testing, benchmarks (criterion)",
        "- **Deployment**: Static binary in scratch Docker (2-5MB), Container Apps, AKS sidecar, systemd service, cross-compile ARM64",
        "- **Safety**: No unsafe in tool handlers, dependency audit (cargo deny), RUSTSEC advisory check, memory safety guarantees",
        "- **FrootAI Integration**: frootai-mcp tool catalog via REST, high-throughput knowledge search, batch play recommendation",
    ],
    "salesforce-expert": [
        "- **Salesforce Integration**: REST/SOAP API, Bulk API 2.0, Streaming API (Platform Events), Composite API, Connected Apps",
        "- **MCP Connector**: Salesforce MCP tools (search/create/update), OAuth2 JWT bearer flow, field mapping, error handling",
        "- **Data Sync**: Bidirectional sync with Azure (Event Grid/Functions), CDC (Change Data Capture), ETL with Data Factory",
        "- **AI + Salesforce**: Einstein GPT integration, custom LLM via Azure OpenAI, lead scoring with AI, case classification",
        "- **Apex Development**: Triggers, batch Apex, queueable, REST callouts, governor limits, test classes (75%+ coverage)",
        "- **Lightning Web Components**: Component architecture, wire service, imperative Apex, events, SLDS, accessibility",
        "- **Security**: OAuth2 flows, IP restrictions, field-level security, sharing rules, encryption (Shield), compliance (SOC2/HIPAA)",
        "- **Flow Automation**: Screen flows, record-triggered flows, subflows, invocable actions, flow orchestration",
        "- **Integration Patterns**: Outbound messages, platform events, Heroku Connect, MuleSoft, custom middleware via Azure Functions",
        "- **FrootAI Plays**: Play 54 (Customer Support), Play 59 (Recruiter), Play 64 (Sales Assistant) — Salesforce as data source",
    ],
    "security-reviewer": [
        "- **OWASP LLM Top 10**: Prompt injection (direct/indirect), insecure output, model DoS, supply chain, sensitive info, overreliance",
        "- **Azure Security**: Managed identity audit, Key Vault usage, private endpoint verification, NSG rules, diagnostic logging",
        "- **Secret Scanning**: Regex patterns (25+) for API keys, connection strings, tokens, certificates, passwords in code/config",
        "- **Dependency Audit**: npm audit, pip audit, cargo deny, NuGet vulnerabilities, SBOM generation, license compliance",
        "- **Container Security**: Dockerfile best practices (non-root, read-only, no SUID), image scanning (Trivy), runtime security",
        "- **Network Security**: VNet isolation, private endpoints, NSG/ASG, firewall rules, DDoS protection, TLS enforcement",
        "- **Identity Security**: RBAC review, PIM compliance, conditional access, service principal audit, workload identity verification",
        "- **Data Security**: Encryption at rest/in transit, PII handling, data classification, retention policies, cross-border compliance",
        "- **Compliance**: CIS Azure Benchmark, NIST 800-53, PCI DSS, HIPAA, SOC2 — control mapping and evidence collection",
        "- **Incident Response**: Vulnerability severity (CVSS), remediation SLAs (P0: 24hr, P1: 72hr, P2: 7d), tracking and verification",
    ],
    "semantic-kernel-expert": [
        "- **SK Core**: Kernel builder, plugins (native + OpenAI), prompt templates, function calling, streaming, memory connectors",
        "- **AI Connectors**: Azure OpenAI, OpenAI, Hugging Face, Ollama, Google AI — unified ITextGenerationService abstraction",
        "- **Plugins**: Native C#/Python functions as SK plugins, OpenAI function calling, tool use, auto-invocation, parameter mapping",
        "- **Planners**: Handlebars planner, stepwise planner, function calling planner — automatic multi-step task decomposition",
        "- **Memory**: Volatile, Azure AI Search, Cosmos DB, Qdrant, PostgreSQL (pgvector) — IMemoryStore abstraction, embedding storage",
        "- **Agents**: SK Agent framework, ChatCompletionAgent, OpenAIAssistantAgent, AgentGroupChat for multi-agent orchestration",
        "- **Process Framework**: SK.Process for workflow orchestration, steps, events, state management, human-in-the-loop",
        "- **MCP Integration**: SK MCP connector for tool bridging, MCP tools as SK functions, bidirectional interop",
        "- **Python SDK**: Semantic Kernel for Python, async plugins, Pydantic models, streaming, Azure integration",
        "- **FrootAI Integration**: SK as orchestration layer in solution plays, FAI Protocol primitives as SK plugins, MCP bridge",
    ],
    "seo-expert": [
        "- **Technical SEO**: Core Web Vitals (LCP/INP/CLS), structured data (JSON-LD), XML sitemap, robots.txt, canonical tags",
        "- **Next.js SEO**: Metadata API, generateMetadata, Open Graph, JSON-LD, sitemap.ts, robots.ts, ISR for content freshness",
        "- **Performance**: Image optimization (next/image), font loading (next/font), script loading, lazy loading, prefetching",
        "- **Content Strategy**: Keyword research, content clustering, internal linking, content freshness signals, E-E-A-T alignment",
        "- **Schema Markup**: Organization, SoftwareApplication, FAQPage, HowTo, Article, BreadcrumbList, Product — for AI ecosystem pages",
        "- **Accessibility + SEO**: Alt text, heading hierarchy, semantic HTML, ARIA landmarks, mobile-first, page speed",
        "- **Analytics**: Google Search Console, GA4 integration, Core Web Vitals monitoring, ranking tracking, click-through optimization",
        "- **AI SEO**: llms.txt for LLM crawlers, AI overview optimization, conversational search targeting, knowledge panel eligibility",
        "- **Internationalization**: hreflang tags, locale-based routing, translated metadata, multi-language sitemaps, geo-targeting",
        "- **FrootAI Site SEO**: frootai.dev pages (100 play pages, 15 learning pages, primitives), search index for AI discovery",
    ],
    "solutions-architect": [
        "- **Azure Architecture**: Well-Architected Framework (6 pillars), reference architectures, service selection, cost modeling",
        "- **AI Architecture Patterns**: RAG, multi-agent, voice pipeline, document processing, edge AI, streaming, governance hub",
        "- **Decision Frameworks**: Build vs buy, cloud vs edge, model selection, data residency, compliance requirements, cost-benefit",
        "- **Diagram Standards**: C4 model (context→container→component→code), Mermaid/draw.io, Azure Architecture Center icons",
        "- **Capacity Planning**: Throughput modeling, latency budgets, scaling strategy, GPU requirements, cost projections",
        "- **Integration Design**: Event-driven (Event Hubs/Service Bus), API-first (APIM), MCP for AI tools, A2A for agent delegation",
        "- **Security Architecture**: Zero trust, defense in depth, network segmentation, identity-first, data classification, encryption",
        "- **Reliability Engineering**: SLO/SLI definition, error budgets, disaster recovery, multi-region, data replication, chaos testing",
        "- **Cost Architecture**: FinOps principles, reserved instances, model routing economics, caching ROI, right-sizing automation",
        "- **FAI Protocol**: fai-manifest.json as architecture declaration, primitive composition, play wiring, guardrail specification",
    ],
};
console.log("═══ Section 26 B18: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B18 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
