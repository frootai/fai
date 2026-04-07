const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(160, 170);
const expertiseMap = {
    "production-patterns-expert": [
        "- **Circuit Breaker**: Closed→Open→Half-Open states, failure threshold (50%), cooldown (30s), fallback responses, Polly/.NET",
        "- **Retry with Backoff**: Exponential base=1s max=30s, jitter for thundering herd, idempotency for safe retries, max attempts=3",
        "- **Rate Limiting**: Token bucket, sliding window, fixed window — per-user/per-IP/per-subscription, 429 with Retry-After header",
        "- **Caching Strategy**: Response cache (Redis), semantic cache (embedding similarity), query cache, TTL management, invalidation",
        "- **Health Checks**: /health endpoint, dependency status, deep vs shallow, readiness vs liveness, startup probes, degraded state",
        "- **Load Balancing**: Round-robin, least-connections, latency-based, priority failover, weighted distribution, health-aware routing",
        "- **Graceful Degradation**: Feature flags for partial functionality, cached fallbacks, reduced quality mode, circuit-broken responses",
        "- **Bulkhead Isolation**: Thread pool isolation, connection pool limits, queue depth limits, per-tenant resource partitioning",
        "- **Observability**: Structured logging, distributed tracing (W3C trace context), custom metrics, correlation ID propagation",
        "- **Cost Patterns**: Token metering, model routing (quality vs cost), batch processing, caching ROI, right-sizing automation",
    ],
    "prompt-engineer": [
        "- **System Message Design**: Role definition, constraints, output format, examples, anti-hallucination clauses, grounding context",
        "- **Few-Shot Learning**: Example selection (random/similar/diverse), example ordering, optimal count (2-5), token budget allocation",
        "- **Chain-of-Thought**: Standard CoT, zero-shot CoT ('think step by step'), self-consistency, tree-of-thought, meta-CoT",
        "- **Structured Output**: JSON mode, function calling schemas, Pydantic/Zod validation, output parsers, retry on invalid format",
        "- **Prompt Versioning**: Semantic versioning, A/B testing, rollback, environment promotion, changelog, evaluation per version",
        "- **Anti-Hallucination**: Grounding instructions, citation requirements, confidence scoring, abstention clauses, source attribution",
        "- **Evaluation**: Groundedness, coherence, relevance, fluency, safety, cost per prompt, latency impact, human preference",
        "- **Token Optimization**: Prompt compression, context window management, essential vs nice-to-have context, tiktoken counting",
        "- **Multi-Turn**: Context carryover, conversation summarization, memory injection, system message updates, session management",
        "- **Azure Prompt Flow**: Visual editor, flow debugging, batch testing, variant management, deployment to managed endpoint",
    ],
    "python-expert": [
        "- **Python 3.12+**: F-string improvements, type parameter syntax, per-interpreter GIL, perf improvements, deprecated removals",
        "- **FastAPI**: Async endpoints, Pydantic v2 models, dependency injection, middleware, OpenAPI generation, streaming responses",
        "- **Azure SDK for Python**: azure-identity, azure-ai-openai (streaming), azure-search-documents, azure-cosmos, azure-servicebus",
        "- **AI Integration**: OpenAI SDK, LangChain, Semantic Kernel for Python, embeddings, function calling, structured output",
        "- **Async Programming**: asyncio, aiohttp, httpx async, connection pooling, task groups (3.11+), structured concurrency",
        "- **Testing**: pytest, pytest-asyncio, unittest.mock, httpx responders, Testcontainers, coverage.py, hypothesis (property-based)",
        "- **Type Safety**: Type hints everywhere, Pydantic for validation, mypy strict mode, TypedDict, Protocol, overload",
        "- **Performance**: asyncio for I/O, multiprocessing for CPU, caching (functools.lru_cache, Redis), profiling (cProfile, py-spy)",
        "- **Packaging**: pyproject.toml, hatch/poetry, virtual environments, pip-compile for deterministic deps, Docker multi-stage",
        "- **Security**: bandit for SAST, input validation (Pydantic), secrets management (Key Vault), no eval/exec, SQL parameterization",
    ],
    "python-mcp-expert": [
        "- **MCP in Python**: frootai-mcp Python package, tool handler decorators, stdio transport, JSON-RPC handling, uvicorn serving",
        "- **Tool Design**: @tool decorator, Pydantic models for parameters, async handlers, streaming results, error response formatting",
        "- **FastAPI Integration**: MCP endpoints as FastAPI routes, dependency injection for Azure clients, middleware for auth/logging",
        "- **Server Architecture**: Async Python (asyncio), tool registry, middleware chain, health checks, graceful shutdown",
        "- **Client Integration**: Python MCP client, tool discovery, Claude/Cursor/VS Code configuration, multi-server routing",
        "- **Azure SDK Integration**: DefaultAzureCredential async, OpenAI async streaming, AI Search async, Cosmos DB async, Key Vault",
        "- **Testing**: pytest-asyncio for tool handlers, mock MCP client, integration tests, performance benchmarks, coverage >80%",
        "- **Deployment**: Docker (python:3.12-slim), pip install in Dockerfile, Container Apps, AKS sidecar, PyPI publishing",
        "- **Performance**: async everywhere, connection pooling (httpx), batch tool execution, response streaming, caching",
        "- **FrootAI Tools**: 25 Python MCP tools — search_knowledge, get_module, estimate_cost, compare_models, semantic_search_plays",
    ],
    "rag-architect": [
        "- **Retrieval Strategies**: Sparse (BM25), dense (vector), hybrid (RRF fusion), multi-stage (retrieve→rerank→generate)",
        "- **Chunking Mastery**: Fixed-size, recursive character, semantic (embedding-based), sentence-window, parent-child, table-aware",
        "- **Vector Indexes**: HNSW (AI Search/Cosmos DB), IVFFlat (PostgreSQL), DiskANN (Cosmos DB), approximate vs exact search",
        "- **Reranking**: Cross-encoder reranking, semantic reranker (AI Search), Cohere Rerank, BGE Reranker, score calibration",
        "- **Citation Pipeline**: Source attribution, paragraph-level citations, multi-source synthesis, confidence-weighted aggregation",
        "- **Evaluation**: Faithfulness/groundedness, answer relevance, context precision/recall, citation accuracy, Ragas framework",
        "- **Query Processing**: Query expansion, HyDE (hypothetical document embeddings), query decomposition, multi-hop retrieval",
        "- **Knowledge Management**: Freshness detection, stale content flagging, gap analysis, auto-ingestion pipeline, deduplication",
        "- **Cost Optimization**: Embedding caching, chunk-level caching, reranker token optimization, model selection per stage",
        "- **Azure AI Search**: Skillsets, custom analyzers, scoring profiles, synonym maps, security trimming, cross-field search",
    ],
    "rag-expert": [
        "- **End-to-End RAG**: Document ingestion → chunking → embedding → indexing → retrieval → reranking → generation → citation",
        "- **Azure AI Search RAG**: Push API, pull indexers (Blob/SQL/Cosmos), skillsets (key phrase, NER, OCR), custom skills",
        "- **Hybrid Search**: BM25 keyword + HNSW vector, RRF (Reciprocal Rank Fusion), configurable weights, semantic configuration",
        "- **Embedding Strategy**: text-embedding-3-large (3072d) vs 3-small (1536d), dimension reduction, batch generation, caching",
        "- **Answer Generation**: GPT-4o with retrieved context, citation injection, confidence scoring, streaming, structured JSON output",
        "- **Document Processing**: PDF (Doc Intelligence), DOCX (Apache POI), HTML (BeautifulSoup), Markdown, tables, images (Vision)",
        "- **Quality Metrics**: Groundedness (>0.85), relevance (>0.80), faithfulness, context utilization, answer completeness",
        "- **Advanced Patterns**: Agentic RAG, knowledge graph RAG, corrective RAG, self-RAG, RAG fusion, FLARE",
        "- **Production Concerns**: Index freshness, stale detection, incremental indexing, change tracking, disaster recovery",
        "- **Cost Optimization**: Embedding cache, chunk cache, model routing (mini for simple Q&A, 4o for synthesis), index tier selection",
    ],
    "react-expert": [
        "- **React 19**: Server Components, Actions, useOptimistic, useFormStatus, use() hook, asset loading, metadata API",
        "- **Next.js 15+**: App Router, Server Actions, parallel routes, intercepting routes, streaming SSR, partial pre-rendering",
        "- **State Management**: React Context + useReducer, Zustand, Jotai, TanStack Query for server state, URL state (nuqs)",
        "- **Component Design**: Compound components, render props, HOC, custom hooks, forwardRef, React.memo, composition over inheritance",
        "- **Performance**: React.lazy + Suspense, code splitting, virtualization (TanStack Virtual), useMemo/useCallback, React Profiler",
        "- **Testing**: Vitest, React Testing Library, Playwright for E2E, MSW for API mocking, Storybook for component dev",
        "- **AI UI Components**: Chat interface (streaming tokens), markdown renderer, code block with syntax highlighting, typing indicator",
        "- **Styling**: Tailwind CSS 4, CSS Modules, styled-components, Radix UI primitives, shadcn/ui, responsive design",
        "- **Forms**: React Hook Form + Zod validation, server actions, optimistic updates, error handling, accessibility (ARIA)",
        "- **Deployment**: Vercel, Azure Static Web Apps, Container Apps (SSR), GitHub Actions CI, preview environments per PR",
    ],
    "red-team-expert": [
        "- **Prompt Injection Attacks**: Direct injection (in user input), indirect injection (in retrieved content), system prompt extraction",
        "- **Jailbreak Techniques**: DAN (Do Anything Now), role-playing bypasses, encoding tricks (base64/ROT13), multi-turn manipulation",
        "- **Azure AI Red Teaming**: Foundry attack simulation, systematic campaign management, safety scorecard generation, regression tracking",
        "- **OWASP LLM Top 10**: Attack vectors for each category, detection methods, mitigation strategies, testing procedures",
        "- **EU AI Act Testing**: High-risk AI system evaluation, conformity assessment preparation, documentation requirements",
        "- **Content Safety Evasion**: Obfuscation techniques, homoglyph attacks, whitespace injection, context manipulation, multi-modal bypass",
        "- **Multi-Turn Attacks**: Gradual trust building, context poisoning, instruction smuggling, persona manipulation over conversations",
        "- **Automated Campaigns**: Attack template libraries, success rate tracking, vulnerability categorization, regression suite",
        "- **Remediation Guidance**: Per-vulnerability fix recommendations, guardrail configuration, prompt hardening, defense-in-depth",
        "- **Reporting**: Safety scorecard (pass/fail per category), vulnerability severity (critical/high/medium/low), trend analysis",
    ],
    "redis-expert": [
        "- **Azure Cache for Redis**: Enterprise (Redis Enterprise), Premium (clustering), Standard, Basic — tier selection criteria",
        "- **Caching Patterns**: Cache-aside, read-through, write-through, write-behind, cache invalidation strategies, TTL management",
        "- **AI Caching**: Semantic response cache (embedding similarity), session state for conversations, embedding cache, result cache",
        "- **Data Structures**: Strings, Hashes, Lists, Sets, Sorted Sets, Streams, HyperLogLog, Bitmaps — use case mapping",
        "- **Clustering**: Redis Cluster (horizontal scaling), sharding strategies, cross-slot operations, hash tags, rebalancing",
        "- **Pub/Sub**: Channel-based messaging, pattern subscriptions, Streams consumer groups for reliable messaging",
        "- **Performance**: Pipelining, connection pooling, memory optimization, eviction policies (LRU/LFU/volatile), maxmemory config",
        "- **High Availability**: Active geo-replication (Enterprise), zone redundancy, automatic failover, data persistence (RDB/AOF)",
        "- **Security**: TLS encryption, Entra ID authentication, private endpoints, firewall rules, access keys rotation",
        "- **Monitoring**: INFO command, Redis CLI, Azure Monitor metrics, slow log analysis, memory fragmentation, connected clients",
    ],
    "refactoring-expert": [
        "- **Code Smells**: Long methods (>50 lines), god classes, feature envy, primitive obsession, shotgun surgery, duplicate code",
        "- **Refactoring Patterns**: Extract method/class, move method, replace conditional with polymorphism, introduce parameter object",
        "- **Architecture Refactoring**: Monolith to microservices, layered to clean architecture, repository pattern, CQRS introduction",
        "- **Safe Refactoring**: Characterization tests first, small incremental changes, feature flags, parallel implementations, A/B testing",
        "- **AI Code Refactoring**: Prompt optimization, config extraction, hardcoded values to config files, inline to composable functions",
        "- **Technical Debt**: Debt inventory, severity classification, effort estimation, payoff calculation, sprint allocation strategy",
        "- **Migration Patterns**: Strangler fig, branch by abstraction, parallel run, feature toggles, anti-corruption layer",
        "- **Performance Refactoring**: N+1 elimination, connection pooling, caching introduction, async conversion, batch operations",
        "- **Testing During Refactor**: Pre-refactor snapshot tests, mutation testing, regression suite, contract testing for APIs",
        "- **Tooling**: IDE refactoring tools, ESLint/Ruff auto-fix, codemods (jscodeshift/libcst), AST-based transformations",
    ],
};
console.log("═══ Section 26 B17: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B17 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
