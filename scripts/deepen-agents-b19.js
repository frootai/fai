const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(180, 190);
const expertiseMap = {
    "specification-writer": [
        "- **OpenAPI 3.1**: REST API specification, JSON Schema 2020-12, webhooks, examples, security schemes, server definitions",
        "- **TypeSpec**: Microsoft's API description language, decorators, namespaces, models, operations, Azure service generation",
        "- **AsyncAPI**: Event-driven API spec, channels, messages, schemas, protocol bindings (AMQP/MQTT/Kafka/WebSocket)",
        "- **Architecture Specs**: C4 model documentation, ADRs (Architecture Decision Records), system context, component diagrams",
        "- **Database Schemas**: Entity-relationship diagrams, DDL generation, migration scripts, versioning, cross-reference documentation",
        "- **FAI Protocol Specs**: fai-manifest.json schema, fai-context.json, play-spec.json, primitive schemas (agent/skill/hook/plugin)",
        "- **Data Contracts**: Input/output schemas, versioning strategy, backward compatibility, breaking change detection, validation rules",
        "- **Testing Specs**: Test plan documents, acceptance criteria, test case templates, coverage requirements, edge case catalogs",
        "- **Compliance Specs**: Regulatory requirement mapping, control specifications, audit evidence templates, gap analysis format",
        "- **Documentation Standards**: RFC-style specifications, IETF format, semantic versioning spec, changelog format (Keep a Changelog)",
    ],
    "sql-server-expert": [
        "- **Azure SQL**: Managed Instance, Elastic Pool, Hyperscale, Serverless, SQL Edge — deployment model selection criteria",
        "- **Performance Tuning**: Query Store analysis, Intelligent Query Processing (IQP), automatic tuning, missing index DMVs",
        "- **Security**: TDE, Always Encrypted (column-level), Dynamic Data Masking, Row-Level Security, Entra ID auth, auditing",
        "- **High Availability**: Always On AG, auto-failover groups, geo-replication, zone-redundant, read scale-out, backup SLAs",
        "- **T-SQL Mastery**: Window functions, CTEs, MERGE, CROSS APPLY, JSON functions, temporal tables, graph queries",
        "- **Vector Search**: Native vector support (preview), DiskANN index, similarity functions, hybrid with full-text, AI integration",
        "- **Integration**: Linked servers, PolyBase, external tables, Azure Synapse link, change tracking, Service Broker",
        "- **Monitoring**: DMVs (sys.dm_exec_*), extended events, Query Performance Insight, SQL Analytics, wait statistics",
        "- **AI Integration**: Natural language to SQL, stored procedure generation, query optimization suggestions, data classification",
        "- **Migration**: DMA assessment, SSDT schema compare, sqlpackage, dacpac/bacpac, online migration with minimal downtime",
    ],
    "streaming-expert": [
        "- **Server-Sent Events (SSE)**: EventSource API, retry mechanism, last-event-id, custom event types, connection management",
        "- **WebSocket**: Bidirectional real-time, connection upgrade, ping/pong keepalive, binary frames, sub-protocols, scaling",
        "- **Azure SignalR Service**: Managed WebSocket, serverless mode, upstream webhooks, hub/group/user targeting, connection management",
        "- **LLM Streaming**: Token-by-token delivery, SSE for chat completions, delta content parsing, finish_reason handling, buffering",
        "- **Event Hubs Streaming**: Partitioned ingestion, consumer groups, checkpointing, Event Processor Host, Kafka compatibility",
        "- **Stream Analytics**: SQL-based processing, tumbling/hopping/sliding/session windows, temporal joins, anomaly detection",
        "- **gRPC Streaming**: Server/client/bidirectional streaming, protobuf, HTTP/2 multiplexing, flow control, deadlines",
        "- **Backpressure**: Rate limiting, buffering strategies, drop policies, flow control, consumer lag monitoring, alerting",
        "- **Scaling**: Horizontal scaling (partitions), connection pooling, sticky sessions, load balancing for stateful connections",
        "- **Error Handling**: Reconnection strategies (exponential backoff), partial message handling, idempotent consumers, dead letters",
    ],
    "svelte-expert": [
        "- **Svelte 5+**: Runes ($state, $derived, $effect), snippets, fine-grained reactivity, compiler optimizations, no virtual DOM",
        "- **SvelteKit**: File-based routing, server-side rendering, form actions, load functions, hooks, adapter selection, streaming",
        "- **State Management**: $state for local, stores for global ($writable/$readable), context API, URL-based state, persistent state",
        "- **AI UI Components**: Chat interface with streaming, markdown rendering, code highlighting, typing indicators, message threading",
        "- **Performance**: Compile-time optimization, minimal runtime, lazy loading, prefetching, image optimization, font loading",
        "- **Testing**: Vitest, Svelte Testing Library, Playwright for E2E, component unit tests, snapshot testing, accessibility testing",
        "- **Accessibility**: ARIA attributes, keyboard navigation, focus management, screen reader testing, reduced motion, color contrast",
        "- **Forms**: Progressive enhancement, form actions (SvelteKit), validation (Zod/Superforms), optimistic updates, file uploads",
        "- **Deployment**: Vercel adapter, Node adapter, static adapter, Cloudflare Workers, Azure Static Web Apps, Docker",
        "- **Integration**: REST/GraphQL clients, WebSocket/SSE for real-time, authentication (Auth.js), CMS integration, i18n",
    ],
    "swarm-supervisor": [
        "- **Multi-Agent Orchestration**: Task decomposition, agent selection based on capability matrix, parallel/sequential execution",
        "- **Topology Management**: Star (central supervisor), mesh (peer-to-peer), hierarchical (sub-supervisors), hybrid selection",
        "- **Agent Registry**: Dynamic discovery, capability matching, version management, health status, load balancing",
        "- **Task Routing**: Intent classification → capability matching → agent assignment, priority queuing, affinity rules",
        "- **Consensus Protocols**: Majority voting, weighted expertise, debate rounds, supervisor override, escalation to human",
        "- **State Coordination**: Shared blackboard (Cosmos DB), session state (Redis), handoff protocol, context propagation",
        "- **Loop Prevention**: Visited-state tracking, iteration counters (max=10), cycle detection, forced termination with summary",
        "- **Cost Management**: Per-agent token budgets, total swarm budget, model selection per agent, early termination on budget",
        "- **Error Recovery**: Agent failure isolation, fallback agents, partial result collection, compensation workflows, retry policies",
        "- **Metrics**: Task completion rate, delegation accuracy, consensus quality, avg iterations, cost per orchestration, latency",
    ],
    "swift-expert": [
        "- **Swift 5.10+/6.0**: Strict concurrency (Sendable, actor isolation), typed throws, ownership (~Copyable), macros, RegexBuilder",
        "- **SwiftUI**: Declarative UI, @Observable macro, NavigationStack, sheet/fullScreenCover, animations, accessibility modifiers",
        "- **Concurrency**: Structured concurrency (async let, TaskGroup), actors, sendable types, MainActor, async sequences",
        "- **Networking**: URLSession async/await, Combine publishers, Alamofire, WebSocket (URLSessionWebSocketTask), SSE client",
        "- **AI Integration**: OpenAI Swift SDK, streaming responses, on-device CoreML, ONNX Runtime for iOS, Vision framework",
        "- **Testing**: XCTest, Swift Testing framework (vNext), XCUITest, snapshot testing (PointFree), mock protocols, async test support",
        "- **Architecture**: MVVM with SwiftUI, TCA (The Composable Architecture), coordinator pattern, dependency injection (Factory)",
        "- **Security**: Keychain Services, CryptoKit, certificate pinning, biometric auth (LocalAuthentication), App Transport Security",
        "- **Deployment**: Xcode Cloud, GitHub Actions (macOS runner), TestFlight distribution, App Store Connect, code signing automation",
        "- **Cross-Platform**: Swift on server (Vapor), Swift for Android (experimental), Swift WASM, multiplatform shared logic",
    ],
    "swift-mcp-expert": [
        "- **MCP in Swift**: Model Context Protocol server, async/await tool handlers, Codable for parameter schemas, stdio transport",
        "- **Tool Design**: Protocol-based tool definitions, Codable parameters, async handlers, Result type errors, streaming results",
        "- **Concurrency**: Structured concurrency for parallel tools, actor-based state, TaskGroup for batch execution, cancellation",
        "- **Server Architecture**: Swift async server, ArgumentParser for CLI, ServiceLifecycle for graceful shutdown, health checks",
        "- **Client Integration**: Swift MCP client, tool discovery, Xcode integration, multi-server support, JSON-RPC handling",
        "- **Azure Integration**: Azure SDK for Swift (REST wrappers), Keychain for secrets, URLSession for API calls, App Insights",
        "- **Testing**: Swift Testing for tool handlers, mock protocols, async test support, integration test framework",
        "- **Deployment**: Docker (swift:5.10-slim), macOS daemon (launchd), Linux server, Container Apps, Xcode Cloud",
        "- **Serialization**: Codable for JSON, custom CodingKeys, schema generation from Swift types, versioning, backward compatibility",
        "- **FrootAI Integration**: frootai-mcp tool catalog, knowledge search, play recommendation, cost estimation via Swift client",
    ],
    "tdd-green": [
        "- **Minimal Implementation**: Write the simplest code that makes the failing test pass — no more, no less. YAGNI strictly enforced.",
        "- **Test-First Discipline**: Never write production code without a failing test. Red test → green minimal → refactor. No shortcuts.",
        "- **Implementation Strategies**: Return constant → use variable → use computation. Triangulation to drive generic solutions.",
        "- **Hard-Coded to Generalized**: Start with hard-coded return values, add more tests to force generalization, evolve incrementally.",
        "- **Edge Cases**: Each test adds one new case. Green implementation handles that case. Accumulate behavior test by test.",
        "- **Error Handling**: TDD error paths — test for exceptions, validation failures, null inputs, boundary conditions explicitly.",
        "- **Integration Points**: When green requires external services, use test doubles (mocks/stubs/fakes) to keep tests isolated.",
        "- **AI-Specific Green**: LLM response handling (stream parsing, JSON validation, confidence scoring) driven by test cases.",
        "- **Refactor Signal**: When implementation feels 'forced' or 'ugly' — that's fine for green. Cleanup happens in refactor phase.",
        "- **Handoff**: Green passes all tests → hand to @tdd-refactor for cleanup. Never skip to refactor without all tests green.",
    ],
    "tdd-red": [
        "- **Test-First Writing**: Write a failing test BEFORE any implementation. The test must fail for the right reason (not compile error).",
        "- **Behavior Specification**: Each test describes ONE behavior. Use descriptive names: 'should_return_grounded_answer_when_context_available'",
        "- **Arrange-Act-Assert**: Clear setup (arrange), single action (act), specific assertion (assert). No multiple actions per test.",
        "- **Test Isolation**: Each test independent — no shared mutable state, no test order dependency, no file system side effects.",
        "- **Edge Case First**: Start with happy path, then: null inputs, empty collections, boundary values, error conditions, concurrent access.",
        "- **AI-Specific Tests**: LLM output validation, confidence scoring, citation checking, content safety, streaming token parsing.",
        "- **Test Doubles**: Decide mock/stub/fake strategy upfront. Mock for behavior verification, stub for state, fake for complex deps.",
        "- **Naming Convention**: test_[unit]_[scenario]_[expected] or describe/it BDD style. Consistent across project.",
        "- **Coverage Strategy**: Not line coverage — behavior coverage. What scenarios are tested? What's the risk of untested code?",
        "- **Handoff**: Failing test written and committed → hand to @tdd-green for minimal implementation. Red stays red until green acts.",
    ],
    "tdd-refactor": [
        "- **Safe Refactoring**: All tests green before AND after refactoring. If any test breaks, revert immediately. Atomic changes.",
        "- **Code Smell Detection**: Long methods (>20 lines), duplication, complex conditionals, deep nesting, primitive obsession.",
        "- **Extract Patterns**: Extract method, extract class, introduce parameter object, replace conditional with strategy/polymorphism.",
        "- **Name Improvement**: Rename for clarity — methods describe behavior, variables describe content, classes describe responsibility.",
        "- **DRY Without Premature Abstraction**: Remove duplication only when pattern is clear (3+ occurrences). Keep it obvious.",
        "- **Performance Refactoring**: Only when measured — profiling data first, then targeted optimization. No premature optimization.",
        "- **Architecture Refactoring**: Introduce interfaces, dependency injection, separate concerns. Keep changes small and incremental.",
        "- **AI-Specific Refactoring**: Extract prompt templates to config, parameterize thresholds, decouple LLM client from business logic.",
        "- **Test Refactoring**: Clean up test helpers, reduce setup duplication, improve assertion messages, organize test suites.",
        "- **Handoff**: Refactoring complete, all tests green → ready for next @tdd-red cycle. Document refactoring decisions in ADR if significant.",
    ],
};
console.log("═══ Section 26 B19: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B19 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
