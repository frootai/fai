const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(60, 70);
const expertiseMap = {
    "github-actions-expert": [
        "- **OIDC Federation**: Workload identity for Azure (no secrets), token permissions, subject claims, environment-scoped credentials",
        "- **Reusable Workflows**: Workflow_call triggers, input/output/secret passing, caller/callee patterns, versioning with tags",
        "- **Matrix Strategy**: Dynamic matrix generation, include/exclude, fail-fast control, max-parallel, OS/version combinations",
        "- **Caching**: actions/cache for node_modules/pip/nuget, cache keys with hashFiles, restore-keys fallback, cache size limits",
        "- **Composite Actions**: Multi-step reusable actions, input/output, shell selection, marketplace publishing, versioning",
        "- **Security**: GITHUB_TOKEN permissions (least-privilege), secret scanning, Dependabot, CODEOWNERS, branch protection rules",
        "- **AI-Specific Workflows**: Model evaluation gates, prompt regression tests, Bicep validation, config/*.json validation, eval.py CI",
        "- **Environments**: Deployment protection rules, required reviewers, wait timer, deployment branches, environment secrets",
        "- **Concurrency**: Concurrency groups, cancel-in-progress, queue behavior, job-level vs workflow-level",
        "- **Artifacts & Outputs**: Upload/download artifacts, job outputs, step outputs, GITHUB_OUTPUT, summary annotations",
    ],
    "go-expert": [
        "- **Go 1.22+**: Range-over-func iterators, enhanced HTTP routing, profile-guided optimization, trace improvements",
        "- **Concurrency**: Goroutines, channels, select, sync.WaitGroup, errgroup, context cancellation, rate limiting patterns",
        "- **Web Frameworks**: Standard library net/http, Chi router, Gin, Echo — selection criteria for AI API backends",
        "- **Azure SDK for Go**: azidentity.DefaultAzureCredential, azopenai client, azstorage, azservicebus, retry policies",
        "- **Error Handling**: Error wrapping (fmt.Errorf %w), sentinel errors, custom error types, errors.Is/As, panic recovery",
        "- **Testing**: Table-driven tests, testify assertions, httptest for API testing, gomock for interfaces, benchmarks, fuzzing",
        "- **Performance**: pprof CPU/memory profiling, escape analysis, zero-allocation optimizations, sync.Pool, buffer reuse",
        "- **CLI Tools**: Cobra commands, Viper config, structured logging (slog/zerolog), flag parsing, shell completion",
        "- **Containers**: Minimal Docker images (scratch/distroless), static binary compilation, CGO_ENABLED=0, multi-arch builds",
        "- **AI Integration**: OpenAI Go SDK, streaming response handling, embedding generation, gRPC for model serving",
    ],
    "go-mcp-expert": [
        "- **MCP in Go**: Model Context Protocol server implementation, tool registration, stdio transport, JSON-RPC handling",
        "- **Tool Design**: Tool definition with JSON Schema parameters, handler functions, result formatting, error responses",
        "- **Concurrency**: Goroutine-per-tool execution, context cancellation, timeout management, concurrent tool calls",
        "- **Server Architecture**: Dependency injection, middleware pattern, logging/tracing, health checks, graceful shutdown",
        "- **Client Integration**: Go MCP client for tool discovery, VS Code/Claude/Cursor configuration, multi-server support",
        "- **Azure Integration**: DefaultAzureCredential in Go, Key Vault secrets, Application Insights, Cosmos DB operations",
        "- **Testing**: Tool handler unit tests, MCP protocol conformance tests, integration tests, benchmark for throughput",
        "- **Deployment**: Static binary in Docker scratch, Container Apps, AKS sidecar, GitHub Codespaces, systemd service",
        "- **Performance**: Zero-allocation JSON parsing, connection pooling, batch tool execution, response streaming",
        "- **FrootAI Integration**: frootai-mcp tool catalog access, knowledge search, play recommendation, cost estimation",
    ],
    "graphql-expert": [
        "- **Schema Design**: Type system (Object/Input/Enum/Union/Interface), schema-first vs code-first, naming conventions",
        "- **Resolvers**: Field resolvers, dataloader pattern (N+1 prevention), batching, caching, authorization per field",
        "- **Subscriptions**: WebSocket (graphql-ws), Server-Sent Events, real-time updates for AI streaming, pub/sub integration",
        "- **Performance**: Query complexity analysis, depth limiting, field-level cost analysis, persisted queries, APQ",
        "- **Security**: Query depth/complexity limits, field-level authorization, input validation, rate limiting, introspection control",
        "- **Federation**: Apollo Federation v2, subgraph design, entity resolution, @key/@requires/@provides, gateway composition",
        "- **Code Generation**: GraphQL Code Generator (TypeScript), genqlient (Go), schema validation, type safety end-to-end",
        "- **Testing**: Schema validation tests, resolver unit tests, integration tests, snapshot testing, mock resolvers",
        "- **AI Integration**: GraphQL API for AI agents, streaming mutations for LLM responses, knowledge graph queries, RAG endpoints",
        "- **Azure Deployment**: Azure API Management GraphQL policies, App Service/Container Apps hosting, Application Insights tracing",
    ],
    "i18n-expert": [
        "- **ICU Message Format**: Plural rules, select, number/date/time formatting, nested messages, gender-neutral patterns",
        "- **React Intl**: FormatMessage, FormattedDate, useIntl hook, message extraction, AST compilation, lazy loading locale data",
        "- **Next.js i18n**: Sub-path routing, middleware locale detection, server components, static generation per locale",
        "- **AI Translation**: Azure OpenAI for contextual translation, domain glossaries, translation memory integration, quality scoring",
        "- **Azure Translator**: 100+ languages, document translation, custom translator training, glossary enforcement, batch API",
        "- **RTL Support**: Right-to-left layout (Arabic/Hebrew), bidirectional text, CSS logical properties, component mirroring",
        "- **Accessibility**: Screen reader language tags, ARIA labels per locale, date/number localization, accessible forms",
        "- **Testing**: Pseudo-localization, string expansion testing, RTL visual regression, locale-specific unit tests",
        "- **Workflow**: Translation management (Crowdin/Lokalise), CI extraction, translator hand-off, review process, quality gates",
        "- **Content Strategy**: Locale-aware content, cultural adaptation, legal/regulatory per region, date/currency/unit formatting",
    ],
    "incident-responder": [
        "- **Severity Classification**: P0 (critical/revenue impact) → P4 (cosmetic), escalation matrices, on-call rotation",
        "- **Triage Protocol**: Impact assessment, blast radius determination, customer impact, communication templates, war room setup",
        "- **Automated Runbooks**: Azure Automation, Logic Apps, Functions-based runbooks, self-healing patterns, pre-approved remediation",
        "- **Communication**: Status page updates (StatusPage.io/Azure), stakeholder notifications, Slack/Teams war rooms, bridge calls",
        "- **Root Cause Analysis**: 5 Whys, Fishbone/Ishikawa, fault tree analysis, timeline reconstruction, contributing factors",
        "- **Azure Diagnostics**: Resource Health, Activity Log, KQL queries, Application Insights failures, Network Watcher, Support API",
        "- **AI-Specific Incidents**: Model quality degradation, token limit exhaustion, content safety false positives, latency spikes",
        "- **Post-Mortem**: Blameless culture, contributing factors, timeline, action items with owners/dates, lessons learned, prevention",
        "- **Metrics**: MTTD (detect), MTTA (acknowledge), MTTR (resolve), incident frequency, recurrence rate, customer impact hours",
        "- **Tooling**: PagerDuty/Opsgenie, Azure Monitor alerts, Grafana On-Call, Jira incident workflow, retrospective templates",
    ],
    "java-expert": [
        "- **Java 21+ LTS**: Virtual threads (Project Loom), pattern matching, sealed classes, records, text blocks, switch expressions",
        "- **Spring Boot 3.3**: GraalVM native image, virtual threads support, observability (Micrometer), Spring AI for LLM integration",
        "- **Azure SDK for Java**: azure-identity, azure-ai-openai, azure-search-documents, azure-messaging-servicebus, retry configuration",
        "- **Spring AI**: ChatClient, embedding models, vector stores, RAG advisors, function calling, output parsers, chat memory",
        "- **Reactive Programming**: Project Reactor (Mono/Flux), R2DBC for reactive DB, WebFlux, SSE streaming for AI responses",
        "- **Testing**: JUnit 5, Mockito, Testcontainers, Spring MockMvc, WireMock, ArchUnit for architecture tests",
        "- **Performance**: JVM tuning (ZGC/Shenandoah), JFR profiling, GraalVM AOT, virtual thread pool configuration, connection pools",
        "- **Build Tools**: Maven/Gradle, multi-module projects, dependency management, BOM imports, reproducible builds",
        "- **Security**: Spring Security, OAuth2 Resource Server, JWT validation, method security, CORS, CSRF protection",
        "- **Deployment**: Docker Jib/Buildpacks, Container Apps, AKS, GitHub Actions with Maven/Gradle, Azure App Service",
    ],
    "java-mcp-expert": [
        "- **MCP in Java**: MCP SDK for Java, tool handler interfaces, JSON-RPC over stdio, server lifecycle management",
        "- **Spring MCP**: Spring Boot auto-configuration, tool bean registration, DI-based tool resolution, actuator health checks",
        "- **Tool Implementation**: @Tool annotation, parameter validation (Jakarta Bean Validation), async execution, streaming results",
        "- **Server Architecture**: Spring Boot application, embedded server, middleware chain, exception handlers, request/response logging",
        "- **Client Integration**: Java MCP client, tool discovery, VS Code/Claude/Cursor configuration, multi-server routing",
        "- **Azure Integration**: DefaultAzureCredential (Java), Key Vault SecretClient, openai-java streaming, Cosmos DB operations",
        "- **Testing**: MockMvc for MCP endpoints, tool handler unit tests, integration tests with embedded server, Testcontainers",
        "- **Deployment**: Spring Boot Docker (Jib/Buildpacks), Container Apps, AKS sidecar, GraalVM native for fast startup",
        "- **Observability**: Micrometer metrics for tool calls, distributed tracing (OpenTelemetry), structured logging (Logback/Log4j2)",
        "- **FrootAI Integration**: frootai-mcp tool catalog, knowledge module search, play recommendation, architecture patterns",
    ],
    "kotlin-expert": [
        "- **Kotlin 2.0+**: K2 compiler, context receivers, value classes, sealed interfaces, multiplatform (KMP) for shared logic",
        "- **Coroutines**: Structured concurrency, Flow for reactive streams, StateFlow/SharedFlow, supervisorScope, exception handling",
        "- **Ktor**: Async HTTP server/client, content negotiation, authentication, WebSockets, SSE for AI streaming",
        "- **Spring Boot + Kotlin**: Coroutine support, DSL configurations, extension functions, data classes for DTOs, WebFlux",
        "- **Azure SDK**: azure-identity-kotlin, OpenAI Kotlin SDK, coroutine-friendly clients, suspend functions for Azure operations",
        "- **Jetpack Compose**: Declarative UI, state management, navigation, Material 3, accessibility, preview annotations",
        "- **Testing**: Kotest (BDD/property-based), MockK, Turbine for Flow testing, Compose test rules, coroutine test dispatchers",
        "- **Multiplatform**: KMP for Android/iOS/JVM/JS, expect/actual declarations, shared business logic, platform-specific implementations",
        "- **Build**: Gradle Kotlin DSL, version catalogs, convention plugins, multi-module projects, composite builds",
        "- **AI Integration**: Kotlin OpenAI SDK, coroutine-based streaming, sealed class for LLM response types, Flow for token streaming",
    ],
    "kotlin-mcp-expert": [
        "- **MCP in Kotlin**: Kotlin MCP SDK, coroutine-based tool handlers, Flow-based streaming, JSON-RPC over stdio",
        "- **Tool Design**: Sealed class tool definitions, @Serializable parameters, suspend function handlers, Result type for errors",
        "- **Coroutine Integration**: Structured concurrency for parallel tools, timeout/cancellation, supervisorScope for isolation",
        "- **Ktor MCP Server**: Embedded server, routing DSL, authentication, WebSocket transport, health endpoints",
        "- **Client Integration**: Kotlin MCP client, tool discovery, IntelliJ/VS Code configuration, multi-server support",
        "- **Azure Integration**: azure-identity DefaultAzureCredential, suspend-friendly Azure SDK wrappers, Key Vault, App Insights",
        "- **Testing**: Kotest for tool handlers, MockK for dependencies, Turbine for Flow testing, integration test framework",
        "- **Deployment**: GraalVM native image for fast startup, Docker container, Container Apps, AKS sidecar pattern",
        "- **Serialization**: kotlinx.serialization for JSON, schema generation from data classes, versioning, backward compatibility",
        "- **FrootAI Integration**: frootai-mcp tool catalog, knowledge search with coroutines, play recommendation, cost estimation",
    ],
};
console.log("═══ Section 26 B7: Domain-Specific Core Expertise ═══\n");
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
    enriched++;
    console.log(`  ✅ ${f}: ${lines} → ${out.split("\n").length}`);
}
const fl = agents.map(f => fs.readFileSync(path.join(dir, f), "utf8").split("\n").length);
console.log(`\n═══ B7 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
