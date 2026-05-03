# AGENTS.md — FrootAI Standalone Agents (Auto-Generated Catalog)

> **GENERATED FILE — DO NOT EDIT BY HAND.** Re-run `node scripts/generate-agents-md.js` to refresh.
> For the curated discovery surface (categories, related plays, marketing copy), see the [root AGENTS.md](../AGENTS.md).

**Total agents:** 238 (169 standalone domain experts + 69 solution-play agents)

## Index

| # | Agent | Name | Description |
|---|-------|------|-------------|
| 1 | [`fai-a2a-expert`](./fai-a2a-expert.agent.md) | FAI A2A Expert | Agent-to-Agent (A2A) protocol specialist — Google's agent interop standard, AgentCard discovery, task lifecycle, streaming artifacts, pus… |
| 2 | [`fai-accessibility-expert`](./fai-accessibility-expert.agent.md) | FAI Accessibility Expert | Accessibility specialist — WCAG 2.2 AA/AAA compliance, ARIA 1.2 patterns, screen reader optimization, keyboard navigation, focus manageme… |
| 3 | [`fai-adr-writer`](./fai-adr-writer.agent.md) | FAI ADR Writer | ADR writer — documents architecture decisions with MADR 3.0 template, context, alternatives, trade-off matrices, consequences, and WAF pi… |
| 4 | [`fai-ag-ui-expert`](./fai-ag-ui-expert.agent.md) | FAI AG-UI Expert | AG-UI protocol specialist — Agent-User Interaction standard, event-based rendering, streaming state updates, tool call lifecycle, and fro… |
| 5 | [`fai-agentic-retriever`](./fai-agentic-retriever.agent.md) | FAI Agentic Retriever | Agentic retrieval specialist — autonomous source selection, iterative refinement with relevance scoring, multi-hop reasoning, query decom… |
| 6 | [`fai-ai-agents-expert`](./fai-ai-agents-expert.agent.md) | FAI AI Agents Expert | AI agents expert — ReAct loops, tool orchestration, memory tiers, multi-agent topologies (supervisor/pipeline/debate/swarm), agent determ… |
| 7 | [`fai-ai-infra-expert`](./fai-ai-infra-expert.agent.md) | FAI AI Infra Expert | AI infrastructure expert — GPU compute sizing (A100/H100), VRAM estimation, model serving (vLLM/TensorRT-LLM/Triton), AKS node pool desig… |
| 8 | [`fai-angular-expert`](./fai-angular-expert.agent.md) | FAI Angular Expert | Angular 19+ specialist — signals-based reactivity, standalone components, SSR with hydration, zoneless change detection, control flow syn… |
| 9 | [`fai-api-gateway-designer`](./fai-api-gateway-designer.agent.md) | FAI API Gateway Designer | API gateway architect — Azure APIM patterns, rate limiting, token-based throttling, multi-region load balancing, backend circuit breakers… |
| 10 | [`fai-architect`](./fai-architect.agent.md) | FAI Architect | Senior cloud-native solution architect — Azure Well-Architected Framework alignment, AI system design, multi-service integration, cost mo… |
| 11 | [`fai-autogen-expert`](./fai-autogen-expert.agent.md) | FAI AutoGen Expert | Microsoft AutoGen multi-agent framework — ConversableAgent, GroupChat topologies, code execution sandboxing, nested chat orchestration, h… |
| 12 | [`fai-azure-ai-foundry-expert`](./fai-azure-ai-foundry-expert.agent.md) | FAI Azure AI Foundry Expert | Azure AI Foundry specialist — Hub/Project resource model, Model Catalog deployment, Prompt Flow orchestration, evaluation pipelines with … |
| 13 | [`fai-azure-ai-search-expert`](./fai-azure-ai-search-expert.agent.md) | FAI Azure AI Search Expert | Azure AI Search specialist — HNSW vector indexes, hybrid keyword+vector retrieval, semantic ranker, integrated vectorization pipelines, c… |
| 14 | [`fai-azure-aks-expert`](./fai-azure-aks-expert.agent.md) | FAI Azure AKS Expert | Azure Kubernetes Service specialist — GPU node pools (A100/H100), NVIDIA device plugin, model serving with vLLM/TGI/Triton, HPA/KEDA auto… |
| 15 | [`fai-azure-apim-expert`](./fai-azure-apim-expert.agent.md) | FAI Azure APIM Expert | Azure API Management specialist — AI Gateway patterns, semantic caching, token metering, multi-backend load balancing, circuit breaker, r… |
| 16 | [`fai-azure-cdn-expert`](./fai-azure-cdn-expert.agent.md) | FAI Azure CDN Expert | Azure Front Door & CDN specialist — global content delivery, WAF policies, caching rules, edge optimization, SSL/TLS management, and Priv… |
| 17 | [`fai-azure-container-apps-expert`](./fai-azure-container-apps-expert.agent.md) | FAI Azure Container Apps Expert | Azure Container Apps specialist — serverless containers, Dapr sidecars, KEDA autoscaling, GPU workload profiles, scale-to-zero, and AI ag… |
| 18 | [`fai-azure-cosmos-db-expert`](./fai-azure-cosmos-db-expert.agent.md) | FAI Azure Cosmos DB Expert | Azure Cosmos DB specialist — partition key design, DiskANN vector search, multi-region writes, RU optimization, change feed processing, a… |
| 19 | [`fai-azure-devops-expert`](./fai-azure-devops-expert.agent.md) | FAI Azure DevOps Expert | Azure DevOps specialist — YAML multi-stage pipelines, environment protection rules, artifact feeds, workload identity federation, and AI-… |
| 20 | [`fai-azure-event-hubs-expert`](./fai-azure-event-hubs-expert.agent.md) | FAI Azure Event Hubs Expert | Azure Event Hubs specialist — partitioned event streaming, Kafka compatibility, Schema Registry governance, real-time AI inference pipeli… |
| 21 | [`fai-azure-functions-expert`](./fai-azure-functions-expert.agent.md) | FAI Azure Functions Expert | Azure Functions specialist — event-driven AI processing, Durable Functions for long-running agent orchestration, timer triggers for batch… |
| 22 | [`fai-azure-identity-expert`](./fai-azure-identity-expert.agent.md) | FAI Azure Identity Expert | Azure identity and access management specialist — Entra ID, Managed Identity, DefaultAzureCredential, workload identity federation, RBAC,… |
| 23 | [`fai-azure-key-vault-expert`](./fai-azure-key-vault-expert.agent.md) | FAI Azure Key Vault Expert | Azure Key Vault specialist — secrets rotation, CMK encryption, certificate lifecycle, HSM-backed keys, Managed Identity integration, and … |
| 24 | [`fai-azure-logic-apps-expert`](./fai-azure-logic-apps-expert.agent.md) | FAI Azure Logic Apps Expert | Azure Logic Apps specialist — low-code workflow automation, 1400+ connectors, AI integration actions, Durable orchestration, B2B/EDI, and… |
| 25 | [`fai-azure-monitor-expert`](./fai-azure-monitor-expert.agent.md) | FAI Azure Monitor Expert | Azure Monitor specialist — Application Insights for AI distributed tracing, KQL for token analytics, custom dashboards for groundedness/c… |
| 26 | [`fai-azure-networking-expert`](./fai-azure-networking-expert.agent.md) | FAI Azure Networking Expert | Azure networking specialist — hub-spoke VNet design, Private Link for AI services, NSGs, Azure Firewall, DNS private zones, and zero-trus… |
| 27 | [`fai-azure-openai-expert`](./fai-azure-openai-expert.agent.md) | FAI Azure OpenAI Expert | Azure OpenAI specialist — model deployment types (PTU/PAYG/Global), content filtering, structured output, token optimization, multi-regio… |
| 28 | [`fai-azure-policy-expert`](./fai-azure-policy-expert.agent.md) | FAI Azure Policy Expert | Azure Policy specialist — built-in/custom policy definitions, AI governance initiatives, compliance scanning, remediation tasks, and poli… |
| 29 | [`fai-azure-service-bus-expert`](./fai-azure-service-bus-expert.agent.md) | FAI Azure Service Bus Expert | Azure Service Bus specialist — queues, topics/subscriptions, dead-letter handling, session-based ordered messaging, saga patterns, and ag… |
| 30 | [`fai-azure-sql-expert`](./fai-azure-sql-expert.agent.md) | FAI Azure SQL Expert | Azure SQL specialist — Hyperscale, serverless auto-pause, native vector search, geo-replication, intelligent performance tuning, and AI i… |
| 31 | [`fai-azure-storage-expert`](./fai-azure-storage-expert.agent.md) | FAI Azure Storage Expert | Azure Storage specialist — Blob lifecycle tiers, ADLS Gen2 for data lakes, private endpoints, managed identity auth, and document/model a… |
| 32 | [`fai-batch-processing-expert`](./fai-batch-processing-expert.agent.md) | FAI Batch Processing Expert | Batch processing specialist — Azure Batch pools, Global Batch API (50% cost savings), Durable Functions fan-out, large-scale document/emb… |
| 33 | [`fai-blazor-expert`](./fai-blazor-expert.agent.md) | FAI Blazor Expert | Blazor specialist — Server + WebAssembly + United (.NET 8+) render modes, streaming SSR, AI chat UI components, SignalR real-time, and Ra… |
| 34 | [`fai-browser-agent`](./fai-browser-agent.agent.md) | FAI Browser Agent | Browser automation agent — navigates websites, extracts data, and executes web workflows using Playwright MCP and vision analysis. Domain… |
| 35 | [`fai-bun-expert`](./fai-bun-expert.agent.md) | FAI Bun Expert | Bun runtime specialist — ultra-fast JavaScript/TypeScript, built-in bundler, native SQLite, test runner, and HTTP server patterns for AI … |
| 36 | [`fai-capacity-planner`](./fai-capacity-planner.agent.md) | FAI Capacity Planner | AI capacity planning specialist — GPU sizing, PTU allocation, token volume forecasting, cost modeling, scaling strategy, and FinOps for A… |
| 37 | [`fai-cicd-pipeline-expert`](./fai-cicd-pipeline-expert.agent.md) | FAI CI/CD Pipeline Expert | CI/CD pipeline specialist — GitHub Actions with OIDC, multi-stage deployments, AI quality gates (eval.py), security scanning, and DORA me… |
| 38 | [`fai-cloudflare-expert`](./fai-cloudflare-expert.agent.md) | FAI Cloudflare Expert | Cloudflare specialist — Workers AI for edge inference, Workers KV, D1 database, R2 storage, AI Gateway, and CDN optimization for AI appli… |
| 39 | [`fai-code-reviewer`](./fai-code-reviewer.agent.md) | FAI Code Reviewer | Code review specialist — SOLID principles, clean code, OWASP security checks, AI-specific prompt injection auditing, and performance anti… |
| 40 | [`fai-collective-debugger`](./fai-collective-debugger.agent.md) | FAI Collective Debugger | Multi-agent debugging specialist — systematic root cause analysis, stack trace interpretation, Azure diagnostics, LLM-specific issue debu… |
| 41 | [`fai-collective-implementer`](./fai-collective-implementer.agent.md) | FAI Collective Implementer | Multi-agent implementer — writes production code following TDD, implements features with Azure SDKs, generates Bicep infrastructure, and … |
| 42 | [`fai-collective-orchestrator`](./fai-collective-orchestrator.agent.md) | FAI Collective Orchestrator | Multi-agent orchestrator — routes tasks to specialist agents, manages turn limits, decomposes complex requests, synthesizes results, and … |
| 43 | [`fai-collective-researcher`](./fai-collective-researcher.agent.md) | FAI Collective Researcher | Multi-agent researcher — gathers information from knowledge bases, codebase search, documentation analysis, and web research to ground sp… |
| 44 | [`fai-collective-reviewer`](./fai-collective-reviewer.agent.md) | FAI Collective Reviewer | Multi-agent reviewer — security audit, OWASP LLM Top 10, WAF compliance, code quality, AI safety checks, and PR review with severity-clas… |
| 45 | [`fai-collective-tester`](./fai-collective-tester.agent.md) | FAI Collective Tester | Multi-agent tester — generates unit/integration/E2E tests, AI evaluation pipelines, mutation testing, and quality assurance for AI output… |
| 46 | [`fai-compliance-expert`](./fai-compliance-expert.agent.md) | FAI Compliance Expert | AI compliance specialist — EU AI Act risk classification, NIST AI RMF, GDPR data subject rights, HIPAA PHI handling, SOC 2 evidence colle… |
| 47 | [`fai-content-safety-expert`](./fai-content-safety-expert.agent.md) | FAI Content Safety Expert | Content safety specialist — Azure AI Content Safety API, 4 harm categories with severity scoring, Prompt Shields for jailbreak defense, g… |
| 48 | [`fai-copilot-ecosystem-expert`](./fai-copilot-ecosystem-expert.agent.md) | FAI Copilot Ecosystem Expert | Microsoft Copilot ecosystem expert — M365 Copilot declarative agents, Copilot Studio, GitHub Copilot agent mode, Graph connectors, Adapti… |
| 49 | [`fai-cost-gateway`](./fai-cost-gateway.agent.md) | FAI Cost Gateway | AI cost gateway specialist — APIM-based AI gateway with semantic caching, model routing by complexity, token budget enforcement, multi-re… |
| 50 | [`fai-cost-optimizer`](./fai-cost-optimizer.agent.md) | FAI Cost Optimizer | FinOps cost optimizer for AI workloads — model routing economics, semantic caching ROI, token budget design, PTU vs PAYG analysis, right-… |
| 51 | [`fai-crewai-expert`](./fai-crewai-expert.agent.md) | FAI CrewAI Expert | CrewAI multi-agent framework specialist — crew composition, role-based agents with backstory, task delegation with expected output, seque… |
| 52 | [`fai-csharp-expert`](./fai-csharp-expert.agent.md) | FAI C# Expert | C#/.NET specialist — modern C# 12+/.NET 9, Azure SDK integration, Semantic Kernel, async/await patterns, Polly resilience, minimal APIs, … |
| 53 | [`fai-csharp-mcp-expert`](./fai-csharp-mcp-expert.agent.md) | FAI C# MCP Expert | C# MCP server development specialist — ModelContextProtocol NuGet package, [McpServerTool] attributes, dependency injection, stdio/SSE tr… |
| 54 | [`fai-dapr-expert`](./fai-dapr-expert.agent.md) | FAI Dapr Expert | Dapr distributed application runtime specialist — service invocation, state management, pub/sub messaging, bindings, secrets management, … |
| 55 | [`fai-data-engineer`](./fai-data-engineer.agent.md) | FAI Data Engineer | Data engineering specialist for AI — RAG ingestion pipelines, document chunking, ETL/ELT patterns, PII detection with Presidio, data qual… |
| 56 | [`fai-datadog-expert`](./fai-datadog-expert.agent.md) | FAI Datadog Expert | Datadog observability specialist — monitor creation, APM trace correlation, dashboard design, metric queries, and AI workload monitoring … |
| 57 | [`fai-debug-expert`](./fai-debug-expert.agent.md) | FAI Debug Expert | Systematic debugging specialist — reproduce-isolate-fix methodology, binary search isolation, stack trace interpretation, Application Ins… |
| 58 | [`fai-deno-expert`](./fai-deno-expert.agent.md) | FAI Deno Expert | Deno runtime specialist — TypeScript-first with permissions model, Deno KV for edge state, Deno Deploy for serverless, secure-by-default … |
| 59 | [`fai-deterministic-expert`](./fai-deterministic-expert.agent.md) | FAI Deterministic Expert | Deterministic AI specialist — makes AI outputs reproducible, grounded, and auditable with temperature control, seed pinning, JSON schema … |
| 60 | [`fai-devops-expert`](./fai-devops-expert.agent.md) | FAI DevOps Expert | DevOps lifecycle specialist — GitHub Actions OIDC, Infrastructure as Code (Bicep/Terraform), deployment strategies (blue-green/canary), S… |
| 61 | [`fai-docker-expert`](./fai-docker-expert.agent.md) | FAI Docker Expert | Docker specialist — multi-stage builds, distroless images, GPU container support (CUDA/NVIDIA), ACR management, layer optimization, and c… |
| 62 | [`fai-dotnet-maui-expert`](./fai-dotnet-maui-expert.agent.md) | FAI .NET MAUI Expert | .NET MAUI cross-platform specialist — iOS, Android, Windows, macOS from single C# codebase, on-device AI inference (ONNX), MVVM architect… |
| 63 | [`fai-dspy-expert`](./fai-dspy-expert.agent.md) | FAI DSPy Expert | DSPy framework specialist — declarative LM programs, signature-based modules, optimizers (BootstrapFewShot, MIPRO), assertions, metric-dr… |
| 64 | [`fai-elasticsearch-expert`](./fai-elasticsearch-expert.agent.md) | FAI Elasticsearch Expert | Elasticsearch specialist — index design, BM25 + kNN hybrid search, vector fields with HNSW, ILM lifecycle, cluster management, and RAG in… |
| 65 | [`fai-embedding-expert`](./fai-embedding-expert.agent.md) | FAI Embedding Expert | Embedding specialist — text-embedding-3 model selection, Matryoshka dimension reduction, batch embedding pipelines, similarity metrics, c… |
| 66 | [`fai-epic-breakdown-expert`](./fai-epic-breakdown-expert.agent.md) | FAI Epic Breakdown Expert | Epic breakdown specialist — decomposes large AI features into INVEST user stories with acceptance criteria, sprint-sized tasks, dependenc… |
| 67 | [`fai-event-driven-expert`](./fai-event-driven-expert.agent.md) | FAI Event-Driven Expert | Event-driven architecture specialist — Azure Event Grid, Service Bus, Event Hubs selection, event sourcing, CQRS, saga orchestration, and… |
| 68 | [`fai-fine-tuning-expert`](./fai-fine-tuning-expert.agent.md) | FAI Fine-Tuning Expert | Fine-tuning and MLOps specialist — LoRA/QLoRA techniques, JSONL training data preparation, Azure OpenAI fine-tuning workflow, hyperparame… |
| 69 | [`fai-genai-foundations-expert`](./fai-genai-foundations-expert.agent.md) | FAI GenAI Foundations Expert | GenAI foundations expert — transformer architecture, tokenization, inference optimization (KV cache, speculative decoding), model taxonom… |
| 70 | [`fai-git-workflow-expert`](./fai-git-workflow-expert.agent.md) | FAI Git Workflow Expert | Git workflow specialist — trunk-based development, conventional commits, PR best practices, branch protection, merge strategies, CODEOWNE… |
| 71 | [`fai-github-actions-expert`](./fai-github-actions-expert.agent.md) | FAI GitHub Actions Expert | GitHub Actions specialist — OIDC federation to Azure, reusable workflows, matrix strategies, composite actions, caching, security hardeni… |
| 72 | [`fai-go-expert`](./fai-go-expert.agent.md) | FAI Go Expert | Go development specialist — idiomatic Go 1.22+, goroutines/channels concurrency, Azure SDK for Go, high-performance HTTP servers, error h… |
| 73 | [`fai-go-mcp-expert`](./fai-go-mcp-expert.agent.md) | FAI Go MCP Expert | Go MCP server specialist — mcp-go SDK, struct-based tool definitions, context-aware handlers, stdio transport, concurrent tool execution,… |
| 74 | [`fai-graphql-expert`](./fai-graphql-expert.agent.md) | FAI GraphQL Expert | GraphQL specialist — schema design, resolver patterns, DataLoader N+1 prevention, subscriptions for AI streaming, federation, query compl… |
| 75 | [`fai-graphrag-expert`](./fai-graphrag-expert.agent.md) | FAI GraphRAG Expert | GraphRAG specialist — entity extraction, relationship mapping, knowledge graph construction, community detection, graph-based retrieval w… |
| 76 | [`fai-grpc-expert`](./fai-grpc-expert.agent.md) | FAI gRPC Expert | gRPC specialist — Protocol Buffers schema design, unary/streaming RPCs, interceptors for auth and tracing, load balancing, health checkin… |
| 77 | [`fai-guidance-expert`](./fai-guidance-expert.agent.md) | FAI Guidance Expert | Microsoft Guidance specialist — constrained generation, token healing, regex patterns, guaranteed JSON/XML compliance, select/gen/each pr… |
| 78 | [`fai-htmx-expert`](./fai-htmx-expert.agent.md) | FAI htmx Expert | htmx specialist — HTML-over-the-wire, hx-get/hx-post/hx-swap, server-sent events for AI streaming, progressive enhancement, and minimal-J… |
| 79 | [`fai-i18n-expert`](./fai-i18n-expert.agent.md) | FAI i18n Expert | Internationalization specialist — multi-language AI responses, ICU message format, locale-aware formatting, Azure Translator integration,… |
| 80 | [`fai-incident-responder`](./fai-incident-responder.agent.md) | FAI Incident Responder | Incident response specialist — severity classification (P0-P4), triage protocols, automated runbooks, war room coordination, root cause a… |
| 81 | [`fai-java-expert`](./fai-java-expert.agent.md) | FAI Java Expert | Java/Spring Boot specialist — Java 21+ virtual threads, Spring Boot 3.3, Spring AI for LLM integration, reactive streams for SSE, Azure S… |
| 82 | [`fai-java-mcp-expert`](./fai-java-mcp-expert.agent.md) | FAI Java MCP Expert | Java MCP server specialist — MCP SDK for Java, Spring Boot auto-configuration, @Tool annotation, reactive streams, enterprise service pat… |
| 83 | [`fai-jira-expert`](./fai-jira-expert.agent.md) | FAI Jira Expert | Jira integration specialist — AI-powered ticket triage, sprint query automation, board management, release tracking, and project manageme… |
| 84 | [`fai-kotlin-expert`](./fai-kotlin-expert.agent.md) | FAI Kotlin Expert | Kotlin specialist — coroutines with structured concurrency, Ktor HTTP server, Flow for reactive AI streaming, Jetpack Compose UI, and Azu… |
| 85 | [`fai-kotlin-mcp-expert`](./fai-kotlin-mcp-expert.agent.md) | FAI Kotlin MCP Expert | Kotlin MCP server specialist — coroutine-based tool handlers, Ktor server transport, sealed class tool definitions, Flow-based streaming,… |
| 86 | [`fai-kubernetes-expert`](./fai-kubernetes-expert.agent.md) | FAI Kubernetes Expert | Kubernetes specialist — pod scheduling, GPU resource management, network policies, Helm charts, GitOps with Flux/ArgoCD, and production-g… |
| 87 | [`fai-landing-zone`](./fai-landing-zone.agent.md) | FAI Landing Zone | Azure AI Landing Zone architect — hub-spoke networking, private endpoints for all PaaS, managed identity, GPU quotas, governance policies… |
| 88 | [`fai-langchain-expert`](./fai-langchain-expert.agent.md) | FAI LangChain Expert | LangChain framework specialist — LCEL expression language, chains, agents with tool use, retrievers, memory, callbacks, LangSmith tracing… |
| 89 | [`fai-llamaindex-expert`](./fai-llamaindex-expert.agent.md) | FAI LlamaIndex Expert | LlamaIndex data framework specialist — document loaders, index types (VectorStore/Summary/Knowledge Graph), query engines, response synth… |
| 90 | [`fai-llm-landscape-expert`](./fai-llm-landscape-expert.agent.md) | FAI LLM Landscape Expert | LLM landscape expert — model families (GPT, Claude, Llama, Gemini, Phi), benchmarks (MMLU, HumanEval, MT-Bench), deployment types, quanti… |
| 91 | [`fai-markdown-expert`](./fai-markdown-expert.agent.md) | FAI Markdown Expert | Markdown specialist — CommonMark/GFM, agent markup (.agent.md/.instructions.md/SKILL.md), documentation standards (README/ADR/changelog),… |
| 92 | [`fai-mcp-expert`](./fai-mcp-expert.agent.md) | FAI MCP Expert | MCP protocol expert — Model Context Protocol specification, tool/resource/prompt primitives, stdio/SSE transports, server development pat… |
| 93 | [`fai-mentoring-agent`](./fai-mentoring-agent.agent.md) | FAI Mentoring Agent | Developer mentoring specialist — Socratic teaching, personalized learning paths, constructive code review feedback, skill gap analysis, a… |
| 94 | [`fai-mermaid-diagram-expert`](./fai-mermaid-diagram-expert.agent.md) | FAI Mermaid Diagram Expert | Mermaid diagram specialist — flowcharts, sequence diagrams, architecture diagrams, ER diagrams, state machines, and Gantt charts for AI s… |
| 95 | [`fai-migration-expert`](./fai-migration-expert.agent.md) | FAI Migration Expert | Migration specialist — legacy-to-cloud, .NET Framework upgrade, database migration, AI-native re-architecture, 6R framework, Azure Migrat… |
| 96 | [`fai-ml-engineer`](./fai-ml-engineer.agent.md) | FAI ML Engineer | ML engineering specialist — model training pipelines, LoRA/QLoRA fine-tuning, evaluation metrics, MLOps with Azure AI Foundry, model regi… |
| 97 | [`fai-mlflow-expert`](./fai-mlflow-expert.agent.md) | FAI MLflow Expert | MLflow specialist — experiment tracking, model registry, metric/artifact logging, Azure ML integration, deployment pipelines, and model l… |
| 98 | [`fai-mongodb-expert`](./fai-mongodb-expert.agent.md) | FAI MongoDB Expert | MongoDB specialist — document schema design, aggregation pipelines, Atlas Vector Search for RAG, Cosmos DB MongoDB vCore, change streams,… |
| 99 | [`fai-nats-expert`](./fai-nats-expert.agent.md) | FAI NATS Expert | NATS messaging specialist — JetStream for durable streams, key-value store, object store, request-reply, pub-sub, and lightweight event-d… |
| 100 | [`fai-neon-expert`](./fai-neon-expert.agent.md) | FAI Neon Expert | Neon serverless Postgres specialist — database branching, auto-scaling compute, pgvector for AI embeddings, connection pooling, and datab… |
| 101 | [`fai-openapi-expert`](./fai-openapi-expert.agent.md) | FAI OpenAPI Expert | OpenAPI specialist — API-first design, OpenAPI 3.1 spec authoring, code generation, validation middleware, and Copilot plugin API definit… |
| 102 | [`fai-opentelemetry-expert`](./fai-opentelemetry-expert.agent.md) | FAI OpenTelemetry Expert | OpenTelemetry specialist — distributed tracing, metrics, logs with OTLP protocol, auto-instrumentation, custom spans for AI pipelines, an… |
| 103 | [`fai-pagerduty-expert`](./fai-pagerduty-expert.agent.md) | FAI PagerDuty Expert | PagerDuty incident management specialist — alert routing, escalation policies, on-call scheduling, automated incident creation, and AI-sp… |
| 104 | [`fai-performance-profiler`](./fai-performance-profiler.agent.md) | FAI Performance Profiler | Performance profiling specialist — latency analysis (P50/P95/P99), token optimization, GPU utilization profiling, bottleneck identificati… |
| 105 | [`fai-php-expert`](./fai-php-expert.agent.md) | FAI PHP Expert | PHP 8.3+ specialist — modern PHP with attributes, typed properties, enums, fibers, Composer PSR standards, Laravel/Symfony patterns, and … |
| 106 | [`fai-php-mcp-expert`](./fai-php-mcp-expert.agent.md) | FAI PHP MCP Expert | PHP MCP server specialist — PHP 8.3+ attributes for tool registration, PSR standards, Composer dependency management, typed properties fo… |
| 107 | [`fai-play-01-builder`](./fai-play-01-builder.agent.md) | FAI Enterprise RAG Builder | Enterprise RAG builder — hybrid search pipeline (BM25+vector), Azure AI Search indexing, OpenAI chat completions with citations, chunking… |
| 108 | [`fai-play-01-reviewer`](./fai-play-01-reviewer.agent.md) | FAI Enterprise RAG Reviewer | Enterprise RAG reviewer — RAG quality audit, citation accuracy, search config validation, security compliance, OWASP LLM Top 10, and WAF … |
| 109 | [`fai-play-01-tuner`](./fai-play-01-tuner.agent.md) | FAI Enterprise RAG Tuner | Enterprise RAG tuner — config optimization for search quality, token costs, chunking parameters, evaluation thresholds, and model selecti… |
| 110 | [`fai-play-02-builder`](./fai-play-02-builder.agent.md) | FAI AI Landing Zone Builder | AI Landing Zone builder — hub-spoke networking, private endpoints, Azure Firewall, DNS architecture, identity foundation, and governance … |
| 111 | [`fai-play-02-reviewer`](./fai-play-02-reviewer.agent.md) | FAI AI Landing Zone Reviewer | AI Landing Zone reviewer — network security audit, private endpoint verification, identity compliance, Azure Policy enforcement, and Bice… |
| 112 | [`fai-play-02-tuner`](./fai-play-02-tuner.agent.md) | FAI AI Landing Zone Tuner | AI Landing Zone tuner — network sizing, firewall rule optimization, SKU right-sizing, cost analysis, DR configuration, and production rea… |
| 113 | [`fai-play-03-builder`](./fai-play-03-builder.agent.md) | FAI Deterministic Agent Builder | Deterministic Agent builder — zero-temperature architecture, seed pinning, structured JSON output, multi-layer guardrails, confidence sco… |
| 114 | [`fai-play-03-reviewer`](./fai-play-03-reviewer.agent.md) | FAI Deterministic Agent Reviewer | Deterministic Agent reviewer — reproducibility testing, guardrail completeness audit, anti-sycophancy verification, schema validation rev… |
| 115 | [`fai-play-03-tuner`](./fai-play-03-tuner.agent.md) | FAI Deterministic Agent Tuner | Deterministic Agent tuner — confidence threshold optimization, guardrail severity calibration, evaluation metric tuning, retry config, an… |
| 116 | [`fai-play-04-builder`](./fai-play-04-builder.agent.md) | FAI Call Center Voice AI Builder | Call Center Voice AI builder — STT→LLM→TTS streaming pipeline, Azure Communication Services, real-time transcription, intent classificati… |
| 117 | [`fai-play-04-reviewer`](./fai-play-04-reviewer.agent.md) | FAI Call Center Voice AI Reviewer | Call Center Voice AI reviewer — voice quality audit, pipeline latency review, PII redaction verification, TCPA compliance, and escalation… |
| 118 | [`fai-play-04-tuner`](./fai-play-04-tuner.agent.md) | FAI Call Center Voice AI Tuner | Call Center Voice AI tuner — speech config optimization, neural voice selection, latency tuning, escalation thresholds, cost-per-call ana… |
| 119 | [`fai-play-05-builder`](./fai-play-05-builder.agent.md) | FAI IT Ticket Resolution Builder | IT Ticket Resolution builder — event-driven classification pipeline, auto-resolution via knowledge base, ServiceNow/Jira integration, ski… |
| 120 | [`fai-play-05-reviewer`](./fai-play-05-reviewer.agent.md) | FAI IT Ticket Resolution Reviewer | IT Ticket Resolution reviewer — classification accuracy audit, auto-resolution quality, routing fairness, SLA compliance, ServiceNow inte… |
| 121 | [`fai-play-05-tuner`](./fai-play-05-tuner.agent.md) | FAI IT Ticket Resolution Tuner | IT Ticket Resolution tuner — classification prompt optimization, routing rules, auto-resolution thresholds, SLA configuration, and cost-p… |
| 122 | [`fai-play-06-builder`](./fai-play-06-builder.agent.md) | FAI Document Intelligence Builder | Document Intelligence builder — Azure AI Document Intelligence OCR, multi-format processing, GPT-4o field extraction, Cosmos DB storage, … |
| 123 | [`fai-play-06-reviewer`](./fai-play-06-reviewer.agent.md) | FAI Document Intelligence Reviewer | Document Intelligence reviewer — OCR accuracy audit, schema validation, PII handling review, pipeline error handling, and confidence thre… |
| 124 | [`fai-play-06-tuner`](./fai-play-06-tuner.agent.md) | FAI Document Intelligence Tuner | Document Intelligence tuner — OCR settings optimization, extraction confidence calibration, custom model training data, batch performance… |
| 125 | [`fai-play-07-builder`](./fai-play-07-builder.agent.md) | FAI Multi-Agent Service Builder | Multi-Agent Service builder — supervisor orchestration pattern, agent registry, shared state via Cosmos DB/Redis, Dapr integration, tool … |
| 126 | [`fai-play-07-reviewer`](./fai-play-07-reviewer.agent.md) | FAI Multi-Agent Service Reviewer | Multi-Agent Service reviewer — orchestration logic audit, state management review, loop prevention verification, agent security boundarie… |
| 127 | [`fai-play-07-tuner`](./fai-play-07-tuner.agent.md) | FAI Multi-Agent Service Tuner | Multi-Agent Service tuner — supervisor routing config, per-agent token budgets, loop limits, model selection per role, memory TTL, and or… |
| 128 | [`fai-play-08-builder`](./fai-play-08-builder.agent.md) | FAI Copilot Studio Bot Builder | Copilot Studio Bot builder — declarative agent setup, topic design, SharePoint/Dataverse knowledge grounding, Power Platform connectors, … |
| 129 | [`fai-play-08-reviewer`](./fai-play-08-reviewer.agent.md) | FAI Copilot Studio Bot Reviewer | Copilot Studio Bot reviewer — topic coverage audit, knowledge source validation, DLP compliance, guardrail verification, and conversation… |
| 130 | [`fai-play-08-tuner`](./fai-play-08-tuner.agent.md) | FAI Copilot Studio Bot Tuner | Copilot Studio Bot tuner — trigger phrase expansion, knowledge source optimization, response tone calibration, guardrail sensitivity, and… |
| 131 | [`fai-play-09-builder`](./fai-play-09-builder.agent.md) | FAI AI Search Portal Builder | AI Search Portal builder — Azure AI Search index design, hybrid search with scoring profiles, faceted navigation, answer generation with … |
| 132 | [`fai-play-09-reviewer`](./fai-play-09-reviewer.agent.md) | FAI AI Search Portal Reviewer | AI Search Portal reviewer — index schema audit, search relevance testing, answer citation accuracy, facet UX review, and performance benc… |
| 133 | [`fai-play-09-tuner`](./fai-play-09-tuner.agent.md) | FAI AI Search Portal Tuner | AI Search Portal tuner — hybrid weight optimization, scoring profile calibration, reranker config, suggester tuning, and answer generatio… |
| 134 | [`fai-play-10-builder`](./fai-play-10-builder.agent.md) | FAI Content Moderation Builder | Content Moderation builder — Azure Content Safety API integration, 4-category severity scoring, custom blocklists, APIM gateway middlewar… |
| 135 | [`fai-play-10-reviewer`](./fai-play-10-reviewer.agent.md) | FAI Content Moderation Reviewer | Content Moderation reviewer — safety coverage audit, severity threshold verification, blocklist completeness, bypass prevention, and huma… |
| 136 | [`fai-play-10-tuner`](./fai-play-10-tuner.agent.md) | FAI Content Moderation Tuner | Content Moderation tuner — per-category severity calibration, blocklist optimization, false positive reduction, routing distribution, and… |
| 137 | [`fai-play-11-builder`](./fai-play-11-builder.agent.md) | FAI AI Landing Zone Advanced Builder | AI Landing Zone Advanced builder — multi-region hub-spoke, Azure Firewall Premium with TLS/IDPS, policy-driven governance at scale, GPU q… |
| 138 | [`fai-play-11-reviewer`](./fai-play-11-reviewer.agent.md) | FAI AI Landing Zone Advanced Reviewer | AI Landing Zone Advanced reviewer — multi-region networking audit, firewall rule review, policy compliance verification, GPU quota valida… |
| 139 | [`fai-play-11-tuner`](./fai-play-11-tuner.agent.md) | FAI AI Landing Zone Advanced Tuner | AI Landing Zone Advanced tuner — multi-region network sizing, firewall rule optimization, policy effect progression, GPU type selection, … |
| 140 | [`fai-play-12-builder`](./fai-play-12-builder.agent.md) | FAI Model Serving AKS Builder | Model Serving AKS builder — GPU cluster design, vLLM/TGI serving engines, NVIDIA device plugin, HPA/KEDA autoscaling, model versioning, a… |
| 141 | [`fai-play-12-reviewer`](./fai-play-12-reviewer.agent.md) | FAI Model Serving AKS Reviewer | Model Serving AKS reviewer — GPU cluster audit, vLLM config validation, autoscaling verification, pod security review, and inference late… |
| 142 | [`fai-play-12-tuner`](./fai-play-12-tuner.agent.md) | FAI Model Serving AKS Tuner | Model Serving AKS tuner — GPU SKU selection, vLLM memory/batching optimization, quantization decisions, autoscaling thresholds, and infer… |
| 143 | [`fai-play-13-builder`](./fai-play-13-builder.agent.md) | FAI Fine-Tuning Workflow Builder | Fine-Tuning Workflow builder — Azure OpenAI fine-tuning, JSONL data preparation, LoRA/QLoRA techniques, MLflow experiment tracking, evalu… |
| 144 | [`fai-play-13-reviewer`](./fai-play-13-reviewer.agent.md) | FAI Fine-Tuning Workflow Reviewer | Fine-Tuning Workflow reviewer — training data quality audit, hyperparameter validation, evaluation methodology review, safety retesting, … |
| 145 | [`fai-play-13-tuner`](./fai-play-13-tuner.agent.md) | FAI Fine-Tuning Workflow Tuner | Fine-Tuning Workflow tuner — learning rate scheduling, LoRA rank/alpha optimization, epoch calibration, batch sizing, data quality filter… |
| 146 | [`fai-play-14-builder`](./fai-play-14-builder.agent.md) | FAI Cost-Optimized AI Gateway Builder | Cost-Optimized AI Gateway builder — APIM AI gateway, semantic caching with Redis, smart model routing by complexity, token budget enforce… |
| 147 | [`fai-play-14-reviewer`](./fai-play-14-reviewer.agent.md) | FAI Cost-Optimized AI Gateway Reviewer | Cost-Optimized AI Gateway reviewer — routing accuracy audit, cache quality verification, budget enforcement testing, security review, and… |
| 148 | [`fai-play-14-tuner`](./fai-play-14-tuner.agent.md) | FAI Cost-Optimized AI Gateway Tuner | Cost-Optimized AI Gateway tuner — semantic cache threshold calibration, routing complexity boundaries, token budget tiers, rate limits, a… |
| 149 | [`fai-play-15-builder`](./fai-play-15-builder.agent.md) | FAI Document Processing Builder | Document Processing builder — GPT-4o Vision multi-modal analysis, Azure Document Intelligence, table extraction, classification pipeline,… |
| 150 | [`fai-play-15-reviewer`](./fai-play-15-reviewer.agent.md) | FAI Document Processing Reviewer | Document Processing reviewer — multi-modal extraction accuracy audit, table parsing quality, PII masking verification, pipeline error han… |
| 151 | [`fai-play-15-tuner`](./fai-play-15-tuner.agent.md) | FAI Document Processing Tuner | Document Processing tuner — GPT-4o Vision resolution settings, extraction confidence calibration, table detection thresholds, chart parsi… |
| 152 | [`fai-play-16-builder`](./fai-play-16-builder.agent.md) | FAI Copilot Teams Extension Builder | Copilot Teams Extension builder — M365 Copilot declarative agent, Microsoft Graph API integration, Adaptive Cards, Entra ID SSO, and Team… |
| 153 | [`fai-play-16-reviewer`](./fai-play-16-reviewer.agent.md) | FAI Copilot Teams Extension Reviewer | Copilot Teams Extension reviewer — Graph permission audit, SSO flow testing, Adaptive Card rendering review, message extension validation… |
| 154 | [`fai-play-16-tuner`](./fai-play-16-tuner.agent.md) | FAI Copilot Teams Extension Tuner | Copilot Teams Extension tuner — Graph scope minimization, knowledge source config, response tone calibration, Adaptive Card optimization,… |
| 155 | [`fai-play-17-builder`](./fai-play-17-builder.agent.md) | FAI AI Observability Builder | AI Observability builder — Application Insights distributed tracing, KQL query library for AI metrics, Azure Workbooks dashboards, alerti… |
| 156 | [`fai-play-17-reviewer`](./fai-play-17-reviewer.agent.md) | FAI AI Observability Reviewer | AI Observability reviewer — telemetry coverage audit, KQL query accuracy, dashboard UX review, alert threshold calibration, and PII-in-lo… |
| 157 | [`fai-play-17-tuner`](./fai-play-17-tuner.agent.md) | FAI AI Observability Tuner | AI Observability tuner — Log Analytics commitment tier selection, sampling rate config, alert threshold calibration, dashboard refresh op… |
| 158 | [`fai-play-18-builder`](./fai-play-18-builder.agent.md) | FAI Prompt Optimization Builder | Prompt Optimization builder — prompt versioning with semantic versions, A/B testing framework, Azure Prompt Flow, template engine with va… |
| 159 | [`fai-play-18-reviewer`](./fai-play-18-reviewer.agent.md) | FAI Prompt Optimization Reviewer | Prompt Optimization reviewer — version management audit, A/B test methodology review, template injection safety, evaluation pipeline vali… |
| 160 | [`fai-play-18-tuner`](./fai-play-18-tuner.agent.md) | FAI Prompt Optimization Tuner | Prompt Optimization tuner — system message clarity, few-shot example selection, A/B test config, template variable defaults, and prompt c… |
| 161 | [`fai-play-19-builder`](./fai-play-19-builder.agent.md) | FAI Edge AI Builder | Edge AI builder — Phi-4 on-device inference, ONNX quantization (INT4/INT8), Azure IoT Hub fleet management, offline-first architecture, a… |
| 162 | [`fai-play-19-reviewer`](./fai-play-19-reviewer.agent.md) | FAI Edge AI Reviewer | Edge AI reviewer — quantized model quality audit, offline resilience testing, fleet rollout verification, cloud fallback review, and devi… |
| 163 | [`fai-play-19-tuner`](./fai-play-19-tuner.agent.md) | FAI Edge AI Tuner | Edge AI tuner — quantization level selection, on-device latency optimization, sync schedule config, cloud fallback thresholds, and per-de… |
| 164 | [`fai-play-20-builder`](./fai-play-20-builder.agent.md) | FAI Real-Time Analytics Builder | Real-Time Analytics builder — Event Hub partitioned ingestion, Stream Analytics windowing, LLM-powered anomaly explanation, multi-signal … |
| 165 | [`fai-play-20-reviewer`](./fai-play-20-reviewer.agent.md) | FAI Real-Time Analytics Reviewer | Real-Time Analytics reviewer — ingestion reliability audit, windowing correctness, anomaly detection accuracy, scoring logic review, and … |
| 166 | [`fai-play-20-tuner`](./fai-play-20-tuner.agent.md) | FAI Real-Time Analytics Tuner | Real-Time Analytics tuner — window size optimization, anomaly threshold calibration, baseline window selection, alert severity rules, and… |
| 167 | [`fai-play-21-builder`](./fai-play-21-builder.agent.md) | FAI Agentic RAG Builder | Agentic RAG builder — autonomous retrieval agent, multi-source fusion (Search+web+DB), iterative query refinement, citation pipeline, and… |
| 168 | [`fai-play-21-reviewer`](./fai-play-21-reviewer.agent.md) | FAI Agentic RAG Reviewer | Agentic RAG reviewer — retrieval autonomy audit, source selection review, iteration limit verification, citation accuracy check, and refl… |
| 169 | [`fai-play-21-tuner`](./fai-play-21-tuner.agent.md) | FAI Agentic RAG Tuner | Agentic RAG tuner — iteration depth config, source weight optimization, reflection threshold calibration, citation requirements, and per-… |
| 170 | [`fai-play-22-builder`](./fai-play-22-builder.agent.md) | FAI Swarm Orchestration Builder | Swarm Orchestration builder — mesh/star/hierarchical agent topologies, supervisor task decomposition, agent specialization, shared memory… |
| 171 | [`fai-play-22-reviewer`](./fai-play-22-reviewer.agent.md) | FAI Swarm Orchestration Reviewer | Swarm Orchestration reviewer — topology audit, supervisor logic review, agent specialization validation, shared memory consistency, and c… |
| 172 | [`fai-play-22-tuner`](./fai-play-22-tuner.agent.md) | FAI Swarm Orchestration Tuner | Swarm Orchestration tuner — topology selection, agent count optimization, consensus config, memory TTL calibration, and per-agent budget … |
| 173 | [`fai-play-23-builder`](./fai-play-23-builder.agent.md) | FAI Browser Agent Builder | Browser Agent builder — Playwright MCP integration, GPT-4o Vision page navigation, multi-step web task automation, form filling, data ext… |
| 174 | [`fai-play-23-reviewer`](./fai-play-23-reviewer.agent.md) | FAI Browser Agent Reviewer | Browser Agent reviewer — domain allowlist verification, vision accuracy testing, credential security audit, error recovery review, and ta… |
| 175 | [`fai-play-23-tuner`](./fai-play-23-tuner.agent.md) | FAI Browser Agent Tuner | Browser Agent tuner — screenshot resolution config, timeout calibration, retry strategy, domain allowlist management, and vision cost opt… |
| 176 | [`fai-play-dispatcher`](./fai-play-dispatcher.agent.md) | FAI Play Dispatcher | FAI play dispatcher — routes user requests to the correct solution play based on intent classification, understands all 101 plays and the… |
| 177 | [`fai-play-lifecycle`](./fai-play-lifecycle.agent.md) | FAI Play Lifecycle | FAI play lifecycle manager — handles play initialization (scaffold file structure), Bicep deployment, evaluation quality gates, and confi… |
| 178 | [`fai-postgresql-expert`](./fai-postgresql-expert.agent.md) | FAI PostgreSQL Expert | PostgreSQL specialist — pgvector for embedding storage, HNSW/IVFFlat indexes, query optimization with EXPLAIN ANALYZE, connection pooling… |
| 179 | [`fai-power-bi-expert`](./fai-power-bi-expert.agent.md) | FAI Power BI Expert | Power BI specialist — star schema data modeling, DAX formulas, report design, DirectQuery vs Import, AI-powered analytics with Azure Open… |
| 180 | [`fai-power-platform-expert`](./fai-power-platform-expert.agent.md) | FAI Power Platform Expert | Power Platform specialist — Power Apps (Canvas + Model-driven), Power Automate cloud flows, Dataverse, custom connectors, DLP policies, a… |
| 181 | [`fai-prd-writer`](./fai-prd-writer.agent.md) | FAI PRD Writer | PRD writer — produces structured Product Requirements Documents with user personas, success metrics, AI-specific requirements (quality th… |
| 182 | [`fai-product-manager`](./fai-product-manager.agent.md) | FAI Product Manager | AI product management specialist — requirements gathering, AI use case prioritization, evaluation metric design, go-to-market strategy, a… |
| 183 | [`fai-production-patterns-expert`](./fai-production-patterns-expert.agent.md) | FAI Production Patterns Expert | Production AI patterns expert — hosting selection (Container Apps/AKS/Functions), APIM gateway patterns, streaming SSE, retry/circuit-bre… |
| 184 | [`fai-prompt-engineer`](./fai-prompt-engineer.agent.md) | FAI Prompt Engineer | Prompt engineering specialist — system message design, few-shot patterns, chain-of-thought, structured output schemas, anti-hallucination… |
| 185 | [`fai-protobuf-expert`](./fai-protobuf-expert.agent.md) | FAI Protobuf Expert | Protocol Buffers specialist — proto3 schema design, backward compatible evolution, gRPC service definitions, code generation, and binary … |
| 186 | [`fai-python-expert`](./fai-python-expert.agent.md) | FAI Python Expert | Python development specialist — Python 3.12+, async/await patterns, Pydantic v2, FastAPI, pytest, type hints, Azure SDK, and production-g… |
| 187 | [`fai-python-mcp-expert`](./fai-python-mcp-expert.agent.md) | FAI Python MCP Expert | Python MCP server specialist — FastMCP framework, @mcp.tool() decorators, async handlers, Pydantic input models, uv deployment, and Azure… |
| 188 | [`fai-qwik-expert`](./fai-qwik-expert.agent.md) | FAI Qwik Expert | Qwik framework specialist — resumability (zero hydration), lazy loading, QwikCity routing, Island architecture, and instant-on AI-powered… |
| 189 | [`fai-rag-architect`](./fai-rag-architect.agent.md) | FAI RAG Architect | Enterprise RAG architecture specialist — designs end-to-end retrieval-augmented generation pipelines with Azure AI Search, OpenAI embeddi… |
| 190 | [`fai-rag-expert`](./fai-rag-expert.agent.md) | FAI RAG Expert | RAG expert — advanced retrieval patterns (agentic, graph, multi-modal RAG), chunking strategies, hybrid search, re-ranking, evaluation me… |
| 191 | [`fai-ray-expert`](./fai-ray-expert.agent.md) | FAI Ray Expert | Ray distributed computing specialist — Ray Serve for model serving, Ray Tune for hyperparameter optimization, Ray Data for preprocessing,… |
| 192 | [`fai-react-expert`](./fai-react-expert.agent.md) | FAI React Expert | React/Next.js specialist — React 19 Server Components, Suspense streaming for AI chat, App Router, Tailwind CSS, useActionState, and acce… |
| 193 | [`fai-red-team-expert`](./fai-red-team-expert.agent.md) | FAI Red Team Expert | AI red teaming specialist — prompt injection testing, jailbreak simulation, PyRIT automation, bias detection, adversarial dataset creatio… |
| 194 | [`fai-redis-expert`](./fai-redis-expert.agent.md) | FAI Redis Expert | Redis specialist — caching patterns (TTL, LRU), semantic cache for AI (embedding similarity), pub/sub messaging, Redis Streams, and sessi… |
| 195 | [`fai-refactoring-expert`](./fai-refactoring-expert.agent.md) | FAI Refactoring Expert | Code refactoring specialist — extract method, reduce cyclomatic complexity, improve testability, SOLID principles, design pattern applica… |
| 196 | [`fai-remix-expert`](./fai-remix-expert.agent.md) | FAI Remix Expert | Remix framework specialist — nested routing, loaders/actions, progressive enhancement, streaming SSR, error boundaries, and AI-integrated… |
| 197 | [`fai-responsible-ai-reviewer`](./fai-responsible-ai-reviewer.agent.md) | FAI Responsible AI Reviewer | Responsible AI specialist — bias detection, fairness metrics, transparency requirements, EU AI Act compliance, content safety, groundedne… |
| 198 | [`fai-ruby-expert`](./fai-ruby-expert.agent.md) | FAI Ruby Expert | Ruby 3.3+ specialist — pattern matching, Ractor concurrency, block DSL patterns, Rails 8, RuboCop standards, and AI API integration with … |
| 199 | [`fai-ruby-mcp-expert`](./fai-ruby-mcp-expert.agent.md) | FAI Ruby MCP Expert | Ruby MCP server specialist — mcp-rb gem, block DSL tool definitions, Rails integration, idiomatic Ruby patterns, and stdio transport for … |
| 200 | [`fai-rust-expert`](./fai-rust-expert.agent.md) | FAI Rust Expert | Rust specialist — ownership/borrowing, async with tokio, serde serialization, error handling with thiserror/anyhow, and high-performance … |
| 201 | [`fai-rust-mcp-expert`](./fai-rust-mcp-expert.agent.md) | FAI Rust MCP Expert | Rust MCP server specialist — rmcp SDK, tokio async handlers, proc macro tool registration, serde for schemas, and ultra-high-performance … |
| 202 | [`fai-salesforce-expert`](./fai-salesforce-expert.agent.md) | FAI Salesforce Expert | Salesforce specialist — Apex development, Lightning Web Components, Flow automation, Einstein AI, and enterprise CRM integration patterns… |
| 203 | [`fai-sap-expert`](./fai-sap-expert.agent.md) | FAI SAP Expert | SAP integration specialist — SAP BTP, OData APIs, BAPI/RFC connectors, procurement/inventory/order processing, and AI-enhanced enterprise… |
| 204 | [`fai-security-reviewer`](./fai-security-reviewer.agent.md) | FAI Security Reviewer | Security reviewer — audits code, infrastructure, and AI pipelines against OWASP Top 10, OWASP LLM Top 10, Azure security baselines, manag… |
| 205 | [`fai-semantic-kernel-expert`](./fai-semantic-kernel-expert.agent.md) | FAI Semantic Kernel Expert | Semantic Kernel specialist — plugins with function calling, KernelFilter middleware, memory/vector stores, agent group chat orchestration… |
| 206 | [`fai-seo-expert`](./fai-seo-expert.agent.md) | FAI SEO Expert | SEO specialist — structured data (JSON-LD), Core Web Vitals optimization, AI-generated content SEO, meta tags, sitemap generation, and se… |
| 207 | [`fai-servicenow-expert`](./fai-servicenow-expert.agent.md) | FAI ServiceNow Expert | ServiceNow ITSM integration specialist — incident/change/request management via REST API, CMDB queries, knowledge base search, AI-powered… |
| 208 | [`fai-slack-expert`](./fai-slack-expert.agent.md) | FAI Slack Expert | Slack integration specialist — Bot API, Block Kit UI, slash commands, interactive modals, AI-powered conversation summarization, thread-b… |
| 209 | [`fai-solid-expert`](./fai-solid-expert.agent.md) | FAI Solid Expert | SolidJS specialist — fine-grained reactivity with signals, stores, createResource for AI data fetching, SolidStart SSR, and high-performa… |
| 210 | [`fai-solutions-architect`](./fai-solutions-architect.agent.md) | FAI Solutions Architect | Cloud solutions architect — end-to-end AI solution design, Azure service selection, multi-service integration, cost estimation, WAF trade… |
| 211 | [`fai-specification-writer`](./fai-specification-writer.agent.md) | FAI Specification Writer | Specification writer — generates AI-ready technical specifications with requirements, evaluation criteria, WAF alignment, API contracts, … |
| 212 | [`fai-sql-server-expert`](./fai-sql-server-expert.agent.md) | FAI SQL Server Expert | SQL Server specialist — on-premises SQL Server, Always On Availability Groups, query optimization with EXPLAIN, and structured data integ… |
| 213 | [`fai-streaming-expert`](./fai-streaming-expert.agent.md) | FAI Streaming Expert | Real-time streaming specialist — SSE for LLM token delivery, WebSocket for bidirectional chat, ReadableStream API, backpressure handling,… |
| 214 | [`fai-supabase-expert`](./fai-supabase-expert.agent.md) | FAI Supabase Expert | Supabase specialist — pgvector for AI embeddings, real-time subscriptions, Edge Functions (Deno), Row Level Security, Storage for documen… |
| 215 | [`fai-svelte-expert`](./fai-svelte-expert.agent.md) | FAI Svelte Expert | Svelte 5 specialist — runes ($state, $derived, $effect), SvelteKit routing, server load functions, streaming SSR, and minimal-bundle AI c… |
| 216 | [`fai-swarm-supervisor`](./fai-swarm-supervisor.agent.md) | FAI Swarm Supervisor | Multi-agent swarm supervisor — routes tasks to specialist agents, manages turn limits and token budgets, handles agent coordination, conf… |
| 217 | [`fai-swift-expert`](./fai-swift-expert.agent.md) | FAI Swift Expert | Swift specialist — structured concurrency (async/await, TaskGroup, actors), SwiftUI, Codable, and Apple platform AI integration with on-d… |
| 218 | [`fai-swift-mcp-expert`](./fai-swift-mcp-expert.agent.md) | FAI Swift MCP Expert | Swift MCP server specialist — actors for concurrency, Codable for JSON Schema, async/await handlers, and Apple platform MCP tool developm… |
| 219 | [`fai-tdd-green`](./fai-tdd-green.agent.md) | FAI TDD Green | TDD Green phase specialist — writes the minimal implementation to make failing tests pass, no more and no less. Follows the Red-Green-Ref… |
| 220 | [`fai-tdd-red`](./fai-tdd-red.agent.md) | FAI TDD Red | TDD Red phase specialist — writes failing tests from requirements before any implementation. Covers happy path, error cases, edge cases, … |
| 221 | [`fai-tdd-refactor`](./fai-tdd-refactor.agent.md) | FAI TDD Refactor | TDD Refactor phase specialist — improves code quality while keeping ALL tests green. Applies extract method, reduce complexity, improve n… |
| 222 | [`fai-teams-expert`](./fai-teams-expert.agent.md) | FAI Teams Expert | Microsoft Teams integration specialist — Adaptive Cards, Bot Framework SDK, Graph API for channels/chats/meetings, AI-powered meeting sum… |
| 223 | [`fai-tech-debt-analyst`](./fai-tech-debt-analyst.agent.md) | FAI Tech Debt Analyst | Tech debt analyst — identifies, quantifies, and prioritizes technical debt with cost-of-delay analysis, remediation plans, and sprint all… |
| 224 | [`fai-technical-writer`](./fai-technical-writer.agent.md) | FAI Technical Writer | Technical documentation specialist — Diátaxis framework (tutorials/how-to/reference/explanation), API documentation, architecture docs, M… |
| 225 | [`fai-temporal-expert`](./fai-temporal-expert.agent.md) | FAI Temporal Expert | Temporal workflow orchestration specialist — durable execution, saga patterns, long-running AI workflows, activity retry policies, timeou… |
| 226 | [`fai-terraform-expert`](./fai-terraform-expert.agent.md) | FAI Terraform Expert | Terraform specialist — Azure provider, state management, module design, plan/apply workflow, drift detection, and multi-environment infra… |
| 227 | [`fai-test-generator`](./fai-test-generator.agent.md) | FAI Test Generator | Test generation specialist — creates unit, integration, and E2E tests across Python (pytest), TypeScript (vitest), C# (xUnit), with AI-sp… |
| 228 | [`fai-test-planner`](./fai-test-planner.agent.md) | FAI Test Planner | Test planning specialist — designs test strategy, identifies coverage gaps, prioritizes test types (unit/integration/E2E/AI eval), and cr… |
| 229 | [`fai-test-runner`](./fai-test-runner.agent.md) | FAI Test Runner | Test execution specialist — runs test suites, interprets results, identifies flaky tests, diagnoses failures, and reports coverage with a… |
| 230 | [`fai-turso-expert`](./fai-turso-expert.agent.md) | FAI Turso Expert | Turso specialist — libSQL (SQLite fork), edge replication, embedded vector search, multi-tenant databases, and low-latency AI data patterns. |
| 231 | [`fai-typescript-expert`](./fai-typescript-expert.agent.md) | FAI TypeScript Expert | TypeScript/Node.js specialist — strict mode, Zod validation, ESM modules, Vitest testing, Azure SDK integration, async patterns, and prod… |
| 232 | [`fai-typescript-mcp-expert`](./fai-typescript-mcp-expert.agent.md) | FAI TypeScript MCP Expert | TypeScript MCP server specialist — @modelcontextprotocol/sdk, McpServer class, Zod schema validation, async tool handlers, stdio/SSE tran… |
| 233 | [`fai-ux-designer`](./fai-ux-designer.agent.md) | FAI UX Designer | AI UX designer — conversation design patterns, chatbot interaction flows, AI disclosure/transparency, loading states for streaming, confi… |
| 234 | [`fai-vector-database-expert`](./fai-vector-database-expert.agent.md) | FAI Vector Database Expert | Vector database specialist — HNSW vs IVFFlat index selection, embedding storage with Qdrant/Pinecone/pgvector/Azure AI Search, similarity… |
| 235 | [`fai-vercel-expert`](./fai-vercel-expert.agent.md) | FAI Vercel Expert | Vercel specialist — AI SDK (streaming useChat/useCompletion), Edge Functions, Next.js deployment, KV/Blob/Postgres storage, and serverles… |
| 236 | [`fai-vue-expert`](./fai-vue-expert.agent.md) | FAI Vue Expert | Vue.js 3 specialist — Composition API with script setup, Pinia state management, Nuxt 3 SSR/SSG, reactive streaming for AI chat, and Type… |
| 237 | [`fai-wandb-expert`](./fai-wandb-expert.agent.md) | FAI W&B Expert | Weights & Biases specialist — experiment tracking, model versioning, hyperparameter sweeps, prompt tracing, evaluation dashboards, and LL… |
| 238 | [`fai-wasm-expert`](./fai-wasm-expert.agent.md) | FAI WASM Expert | WebAssembly specialist — WASI preview 2, Component Model, edge AI inference with Spin/Fermyon, Wasmtime runtime, and portable, sandboxed … |

## Detail

### `fai-a2a-expert`

**Name:** FAI A2A Expert  
**Description:** Agent-to-Agent (A2A) protocol specialist — Google's agent interop standard, AgentCard discovery, task lifecycle, streaming artifacts, push notifications, and multi-agent communication patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security, performance-efficiency  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration  
**File:** [`fai-a2a-expert.agent.md`](./fai-a2a-expert.agent.md)

### `fai-accessibility-expert`

**Name:** FAI Accessibility Expert  
**Description:** Accessibility specialist — WCAG 2.2 AA/AAA compliance, ARIA 1.2 patterns, screen reader optimization, keyboard navigation, focus management, and inclusive design for AI chatbots and dashboards.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, reliability  
**Plays:** 01-enterprise-rag, 09-ai-search-portal  
**File:** [`fai-accessibility-expert.agent.md`](./fai-accessibility-expert.agent.md)

### `fai-adr-writer`

**Name:** FAI ADR Writer  
**Description:** ADR writer — documents architecture decisions with MADR 3.0 template, context, alternatives, trade-off matrices, consequences, and WAF pillar impact analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**File:** [`fai-adr-writer.agent.md`](./fai-adr-writer.agent.md)

### `fai-ag-ui-expert`

**Name:** FAI AG-UI Expert  
**Description:** AG-UI protocol specialist — Agent-User Interaction standard, event-based rendering, streaming state updates, tool call lifecycle, and frontend integration for AI agent experiences.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 01-enterprise-rag, 09-ai-search-portal  
**File:** [`fai-ag-ui-expert.agent.md`](./fai-ag-ui-expert.agent.md)

### `fai-agentic-retriever`

**Name:** FAI Agentic Retriever  
**Description:** Agentic retrieval specialist — autonomous source selection, iterative refinement with relevance scoring, multi-hop reasoning, query decomposition, and grounded answer synthesis with inline citations.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency  
**Plays:** 21-agentic-rag, 01-enterprise-rag  
**File:** [`fai-agentic-retriever.agent.md`](./fai-agentic-retriever.agent.md)

### `fai-ai-agents-expert`

**Name:** FAI AI Agents Expert  
**Description:** AI agents expert — ReAct loops, tool orchestration, memory tiers, multi-agent topologies (supervisor/pipeline/debate/swarm), agent determinism, and production guardrails for autonomous AI systems.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security, responsible-ai  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration, 03-deterministic-agent  
**File:** [`fai-ai-agents-expert.agent.md`](./fai-ai-agents-expert.agent.md)

### `fai-ai-infra-expert`

**Name:** FAI AI Infra Expert  
**Description:** AI infrastructure expert — GPU compute sizing (A100/H100), VRAM estimation, model serving (vLLM/TensorRT-LLM/Triton), AKS node pool design, PTU vs PAYG cost modeling, and quantization strategies.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, cost-optimization, reliability  
**Plays:** 02-ai-landing-zone, 12-model-serving-aks  
**File:** [`fai-ai-infra-expert.agent.md`](./fai-ai-infra-expert.agent.md)

### `fai-angular-expert`

**Name:** FAI Angular Expert  
**Description:** Angular 19+ specialist — signals-based reactivity, standalone components, SSR with hydration, zoneless change detection, control flow syntax, and AI chat component patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 09-ai-search-portal  
**File:** [`fai-angular-expert.agent.md`](./fai-angular-expert.agent.md)

### `fai-api-gateway-designer`

**Name:** FAI API Gateway Designer  
**Description:** API gateway architect — Azure APIM patterns, rate limiting, token-based throttling, multi-region load balancing, backend circuit breakers, and cost-aware routing for LLM endpoints.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, reliability, performance-efficiency  
**Plays:** 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-api-gateway-designer.agent.md`](./fai-api-gateway-designer.agent.md)

### `fai-architect`

**Name:** FAI Architect  
**Description:** Senior cloud-native solution architect — Azure Well-Architected Framework alignment, AI system design, multi-service integration, cost modeling, trade-off analysis, and production readiness assessment.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, cost-optimization, performance-efficiency, operational-excellence, responsible-ai  
**Plays:** 01-enterprise-rag, 02-ai-landing-zone  
**File:** [`fai-architect.agent.md`](./fai-architect.agent.md)

### `fai-autogen-expert`

**Name:** FAI AutoGen Expert  
**Description:** Microsoft AutoGen multi-agent framework — ConversableAgent, GroupChat topologies, code execution sandboxing, nested chat orchestration, human-in-the-loop patterns, and AG2 migration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, responsible-ai, security  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration, 51-autonomous-coding  
**File:** [`fai-autogen-expert.agent.md`](./fai-autogen-expert.agent.md)

### `fai-azure-ai-foundry-expert`

**Name:** FAI Azure AI Foundry Expert  
**Description:** Azure AI Foundry specialist — Hub/Project resource model, Model Catalog deployment, Prompt Flow orchestration, evaluation pipelines with groundedness and safety metrics, fine-tuning workflows, and model lifecycle management across dev/staging/prod environments.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, security, cost-optimization, responsible-ai  
**Plays:** 01-enterprise-rag, 03-deterministic-agent, 07-multi-agent-service, 10-content-moderation, 13-fine-tuning-workflow, 25-ai-search-portal  
**File:** [`fai-azure-ai-foundry-expert.agent.md`](./fai-azure-ai-foundry-expert.agent.md)

### `fai-azure-ai-search-expert`

**Name:** FAI Azure AI Search Expert  
**Description:** Azure AI Search specialist — HNSW vector indexes, hybrid keyword+vector retrieval, semantic ranker, integrated vectorization pipelines, custom skillsets, scoring profiles, and RAG optimization for production search experiences.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability, cost-optimization, security  
**Plays:** 01-enterprise-rag, 09-ai-search-portal, 15-document-intelligence, 21-agentic-rag, 26-personalized-search, 52-hybrid-search  
**File:** [`fai-azure-ai-search-expert.agent.md`](./fai-azure-ai-search-expert.agent.md)

### `fai-azure-aks-expert`

**Name:** FAI Azure AKS Expert  
**Description:** Azure Kubernetes Service specialist — GPU node pools (A100/H100), NVIDIA device plugin, model serving with vLLM/TGI/Triton, HPA/KEDA autoscaling, and production AI inference workload patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability, cost-optimization, security  
**Plays:** 02-ai-landing-zone, 11-ai-landing-zone-advanced, 12-model-serving-aks  
**File:** [`fai-azure-aks-expert.agent.md`](./fai-azure-aks-expert.agent.md)

### `fai-azure-apim-expert`

**Name:** FAI Azure APIM Expert  
**Description:** Azure API Management specialist — AI Gateway patterns, semantic caching, token metering, multi-backend load balancing, circuit breaker, rate limiting, and FinOps for LLM API layers.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, reliability, performance-efficiency, security  
**Plays:** 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-azure-apim-expert.agent.md`](./fai-azure-apim-expert.agent.md)

### `fai-azure-cdn-expert`

**Name:** FAI Azure CDN Expert  
**Description:** Azure Front Door & CDN specialist — global content delivery, WAF policies, caching rules, edge optimization, SSL/TLS management, and Private Link origins for AI application frontends.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, security, reliability  
**Plays:** 01-enterprise-rag, 09-ai-search-portal  
**File:** [`fai-azure-cdn-expert.agent.md`](./fai-azure-cdn-expert.agent.md)

### `fai-azure-container-apps-expert`

**Name:** FAI Azure Container Apps Expert  
**Description:** Azure Container Apps specialist — serverless containers, Dapr sidecars, KEDA autoscaling, GPU workload profiles, scale-to-zero, and AI agent hosting patterns with blue/green deployments.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, reliability, operational-excellence  
**Plays:** 05-it-ticket-resolution, 07-multi-agent-service, 29-mcp-server  
**File:** [`fai-azure-container-apps-expert.agent.md`](./fai-azure-container-apps-expert.agent.md)

### `fai-azure-cosmos-db-expert`

**Name:** FAI Azure Cosmos DB Expert  
**Description:** Azure Cosmos DB specialist — partition key design, DiskANN vector search, multi-region writes, RU optimization, change feed processing, and conversation/session storage for AI agents.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability, cost-optimization, security  
**Plays:** 01-enterprise-rag, 05-it-ticket-resolution, 21-agentic-rag, 28-knowledge-graph  
**File:** [`fai-azure-cosmos-db-expert.agent.md`](./fai-azure-cosmos-db-expert.agent.md)

### `fai-azure-devops-expert`

**Name:** FAI Azure DevOps Expert  
**Description:** Azure DevOps specialist — YAML multi-stage pipelines, environment protection rules, artifact feeds, workload identity federation, and AI-specific deployment quality gates.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, reliability, security  
**Plays:** 37-devops-agent, 32-test-automation  
**File:** [`fai-azure-devops-expert.agent.md`](./fai-azure-devops-expert.agent.md)

### `fai-azure-event-hubs-expert`

**Name:** FAI Azure Event Hubs Expert  
**Description:** Azure Event Hubs specialist — partitioned event streaming, Kafka compatibility, Schema Registry governance, real-time AI inference pipelines, and high-throughput data ingestion.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability, cost-optimization  
**Plays:** 20-real-time-analytics, 63-fraud-detection, 50-financial-risk  
**File:** [`fai-azure-event-hubs-expert.agent.md`](./fai-azure-event-hubs-expert.agent.md)

### `fai-azure-functions-expert`

**Name:** FAI Azure Functions Expert  
**Description:** Azure Functions specialist — event-driven AI processing, Durable Functions for long-running agent orchestration, timer triggers for batch inference, and cold start optimization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, reliability, operational-excellence  
**Plays:** 01-enterprise-rag, 05-it-ticket-resolution, 06-document-intelligence, 10-content-moderation  
**File:** [`fai-azure-functions-expert.agent.md`](./fai-azure-functions-expert.agent.md)

### `fai-azure-identity-expert`

**Name:** FAI Azure Identity Expert  
**Description:** Azure identity and access management specialist — Entra ID, Managed Identity, DefaultAzureCredential, workload identity federation, RBAC, Conditional Access, and zero-trust architecture for AI services.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, operational-excellence  
**Plays:** 02-ai-landing-zone, 11-ai-landing-zone-advanced, 30-security-hardening  
**File:** [`fai-azure-identity-expert.agent.md`](./fai-azure-identity-expert.agent.md)

### `fai-azure-key-vault-expert`

**Name:** FAI Azure Key Vault Expert  
**Description:** Azure Key Vault specialist — secrets rotation, CMK encryption, certificate lifecycle, HSM-backed keys, Managed Identity integration, and zero-secret deployment patterns for AI workloads.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, operational-excellence  
**Plays:** 02-ai-landing-zone, 11-ai-landing-zone-advanced, 30-security-hardening  
**File:** [`fai-azure-key-vault-expert.agent.md`](./fai-azure-key-vault-expert.agent.md)

### `fai-azure-logic-apps-expert`

**Name:** FAI Azure Logic Apps Expert  
**Description:** Azure Logic Apps specialist — low-code workflow automation, 1400+ connectors, AI integration actions, Durable orchestration, B2B/EDI, and enterprise integration patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, reliability, cost-optimization  
**Plays:** 05-it-ticket-resolution, 06-document-intelligence, 08-copilot-studio-bot  
**File:** [`fai-azure-logic-apps-expert.agent.md`](./fai-azure-logic-apps-expert.agent.md)

### `fai-azure-monitor-expert`

**Name:** FAI Azure Monitor Expert  
**Description:** Azure Monitor specialist — Application Insights for AI distributed tracing, KQL for token analytics, custom dashboards for groundedness/coherence metrics, cost alerting, and AI-specific observability patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, cost-optimization, reliability  
**Plays:** 17-ai-observability, 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-azure-monitor-expert.agent.md`](./fai-azure-monitor-expert.agent.md)

### `fai-azure-networking-expert`

**Name:** FAI Azure Networking Expert  
**Description:** Azure networking specialist — hub-spoke VNet design, Private Link for AI services, NSGs, Azure Firewall, DNS private zones, and zero-trust network architecture.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 02-ai-landing-zone, 11-ai-landing-zone-advanced  
**File:** [`fai-azure-networking-expert.agent.md`](./fai-azure-networking-expert.agent.md)

### `fai-azure-openai-expert`

**Name:** FAI Azure OpenAI Expert  
**Description:** Azure OpenAI specialist — model deployment types (PTU/PAYG/Global), content filtering, structured output, token optimization, multi-region load balancing, and production inference patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency, security, responsible-ai  
**Plays:** 01-enterprise-rag, 03-deterministic-agent, 14-cost-optimized-ai-gateway  
**File:** [`fai-azure-openai-expert.agent.md`](./fai-azure-openai-expert.agent.md)

### `fai-azure-policy-expert`

**Name:** FAI Azure Policy Expert  
**Description:** Azure Policy specialist — built-in/custom policy definitions, AI governance initiatives, compliance scanning, remediation tasks, and policy-as-code deployment patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, operational-excellence  
**Plays:** 02-ai-landing-zone, 11-ai-landing-zone-advanced, 30-security-hardening  
**File:** [`fai-azure-policy-expert.agent.md`](./fai-azure-policy-expert.agent.md)

### `fai-azure-service-bus-expert`

**Name:** FAI Azure Service Bus Expert  
**Description:** Azure Service Bus specialist — queues, topics/subscriptions, dead-letter handling, session-based ordered messaging, saga patterns, and agent-to-agent communication for AI workflows.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, performance-efficiency, security  
**Plays:** 05-it-ticket-resolution, 07-multi-agent-service, 22-swarm-orchestration  
**File:** [`fai-azure-service-bus-expert.agent.md`](./fai-azure-service-bus-expert.agent.md)

### `fai-azure-sql-expert`

**Name:** FAI Azure SQL Expert  
**Description:** Azure SQL specialist — Hyperscale, serverless auto-pause, native vector search, geo-replication, intelligent performance tuning, and AI integration patterns with embeddings storage.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability, cost-optimization, security  
**Plays:** 01-enterprise-rag, 05-it-ticket-resolution  
**File:** [`fai-azure-sql-expert.agent.md`](./fai-azure-sql-expert.agent.md)

### `fai-azure-storage-expert`

**Name:** FAI Azure Storage Expert  
**Description:** Azure Storage specialist — Blob lifecycle tiers, ADLS Gen2 for data lakes, private endpoints, managed identity auth, and document/model artifact storage for AI pipelines.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, cost-optimization, reliability  
**Plays:** 01-enterprise-rag, 02-ai-landing-zone, 06-document-intelligence  
**File:** [`fai-azure-storage-expert.agent.md`](./fai-azure-storage-expert.agent.md)

### `fai-batch-processing-expert`

**Name:** FAI Batch Processing Expert  
**Description:** Batch processing specialist — Azure Batch pools, Global Batch API (50% cost savings), Durable Functions fan-out, large-scale document/embedding pipelines, and async LLM inference patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, reliability, performance-efficiency  
**Plays:** 06-document-intelligence, 13-fine-tuning-workflow, 15-document-processing  
**File:** [`fai-batch-processing-expert.agent.md`](./fai-batch-processing-expert.agent.md)

### `fai-blazor-expert`

**Name:** FAI Blazor Expert  
**Description:** Blazor specialist — Server + WebAssembly + United (.NET 8+) render modes, streaming SSR, AI chat UI components, SignalR real-time, and Razor component architecture.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, security  
**Plays:** 01-enterprise-rag, 09-ai-search-portal  
**File:** [`fai-blazor-expert.agent.md`](./fai-blazor-expert.agent.md)

### `fai-browser-agent`

**Name:** FAI Browser Agent  
**Description:** Browser automation agent — navigates websites, extracts data, and executes web workflows using Playwright MCP and vision analysis. Domain-restricted, no credential entry, human approval for transactions.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, responsible-ai  
**Plays:** 23-browser-automation-agent  
**File:** [`fai-browser-agent.agent.md`](./fai-browser-agent.agent.md)

### `fai-bun-expert`

**Name:** FAI Bun Expert  
**Description:** Bun runtime specialist — ultra-fast JavaScript/TypeScript, built-in bundler, native SQLite, test runner, and HTTP server patterns for AI APIs and MCP servers.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, operational-excellence  
**Plays:** 29-mcp-server  
**File:** [`fai-bun-expert.agent.md`](./fai-bun-expert.agent.md)

### `fai-capacity-planner`

**Name:** FAI Capacity Planner  
**Description:** AI capacity planning specialist — GPU sizing, PTU allocation, token volume forecasting, cost modeling, scaling strategy, and FinOps for Azure AI workloads.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency, reliability  
**Plays:** 02-ai-landing-zone, 12-model-serving-aks, 14-cost-optimized-ai-gateway  
**File:** [`fai-capacity-planner.agent.md`](./fai-capacity-planner.agent.md)

### `fai-cicd-pipeline-expert`

**Name:** FAI CI/CD Pipeline Expert  
**Description:** CI/CD pipeline specialist — GitHub Actions with OIDC, multi-stage deployments, AI quality gates (eval.py), security scanning, and DORA metrics for AI application delivery.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, reliability, security  
**Plays:** 37-devops-agent, 32-test-automation  
**File:** [`fai-cicd-pipeline-expert.agent.md`](./fai-cicd-pipeline-expert.agent.md)

### `fai-cloudflare-expert`

**Name:** FAI Cloudflare Expert  
**Description:** Cloudflare specialist — Workers AI for edge inference, Workers KV, D1 database, R2 storage, AI Gateway, and CDN optimization for AI application delivery.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 19-edge-ai  
**File:** [`fai-cloudflare-expert.agent.md`](./fai-cloudflare-expert.agent.md)

### `fai-code-reviewer`

**Name:** FAI Code Reviewer  
**Description:** Code review specialist — SOLID principles, clean code, OWASP security checks, AI-specific prompt injection auditing, and performance anti-pattern detection across TypeScript, Python, C#, and Bicep.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security, operational-excellence  
**Plays:** 24-code-review, 32-test-automation  
**File:** [`fai-code-reviewer.agent.md`](./fai-code-reviewer.agent.md)

### `fai-collective-debugger`

**Name:** FAI Collective Debugger  
**Description:** Multi-agent debugging specialist — systematic root cause analysis, stack trace interpretation, Azure diagnostics, LLM-specific issue debugging, and performance profiling for AI pipelines.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration  
**File:** [`fai-collective-debugger.agent.md`](./fai-collective-debugger.agent.md)

### `fai-collective-implementer`

**Name:** FAI Collective Implementer  
**Description:** Multi-agent implementer — writes production code following TDD, implements features with Azure SDKs, generates Bicep infrastructure, and creates solution play components.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency, security  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration  
**File:** [`fai-collective-implementer.agent.md`](./fai-collective-implementer.agent.md)

### `fai-collective-orchestrator`

**Name:** FAI Collective Orchestrator  
**Description:** Multi-agent orchestrator — routes tasks to specialist agents, manages turn limits, decomposes complex requests, synthesizes results, and ensures quality gates across the FAI Collective.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, cost-optimization, operational-excellence  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration  
**File:** [`fai-collective-orchestrator.agent.md`](./fai-collective-orchestrator.agent.md)

### `fai-collective-researcher`

**Name:** FAI Collective Researcher  
**Description:** Multi-agent researcher — gathers information from knowledge bases, codebase search, documentation analysis, and web research to ground specialist agents with verified facts.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, responsible-ai  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration, 21-agentic-rag  
**File:** [`fai-collective-researcher.agent.md`](./fai-collective-researcher.agent.md)

### `fai-collective-reviewer`

**Name:** FAI Collective Reviewer  
**Description:** Multi-agent reviewer — security audit, OWASP LLM Top 10, WAF compliance, code quality, AI safety checks, and PR review with severity-classified feedback.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai, reliability  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration, 24-code-review  
**File:** [`fai-collective-reviewer.agent.md`](./fai-collective-reviewer.agent.md)

### `fai-collective-tester`

**Name:** FAI Collective Tester  
**Description:** Multi-agent tester — generates unit/integration/E2E tests, AI evaluation pipelines, mutation testing, and quality assurance for AI outputs with deterministic seed-based testing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration, 32-test-automation  
**File:** [`fai-collective-tester.agent.md`](./fai-collective-tester.agent.md)

### `fai-compliance-expert`

**Name:** FAI Compliance Expert  
**Description:** AI compliance specialist — EU AI Act risk classification, NIST AI RMF, GDPR data subject rights, HIPAA PHI handling, SOC 2 evidence collection, and Azure compliance tooling.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** responsible-ai, security, operational-excellence  
**Plays:** 35-compliance-automation, 70-eu-ai-act, 99-governance-framework  
**File:** [`fai-compliance-expert.agent.md`](./fai-compliance-expert.agent.md)

### `fai-content-safety-expert`

**Name:** FAI Content Safety Expert  
**Description:** Content safety specialist — Azure AI Content Safety API, 4 harm categories with severity scoring, Prompt Shields for jailbreak defense, groundedness detection, PII redaction, and moderation pipeline design.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** responsible-ai, security  
**Plays:** 10-content-moderation, 30-security-hardening, 60-responsible-ai  
**File:** [`fai-content-safety-expert.agent.md`](./fai-content-safety-expert.agent.md)

### `fai-copilot-ecosystem-expert`

**Name:** FAI Copilot Ecosystem Expert  
**Description:** Microsoft Copilot ecosystem expert — M365 Copilot declarative agents, Copilot Studio, GitHub Copilot agent mode, Graph connectors, Adaptive Cards, and cross-platform agent extensibility.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, security  
**Plays:** 08-copilot-studio-bot, 16-copilot-teams-extension, 40-declarative-agent  
**File:** [`fai-copilot-ecosystem-expert.agent.md`](./fai-copilot-ecosystem-expert.agent.md)

### `fai-cost-gateway`

**Name:** FAI Cost Gateway  
**Description:** AI cost gateway specialist — APIM-based AI gateway with semantic caching, model routing by complexity, token budget enforcement, multi-region PTU load balancing, and FinOps telemetry.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency, reliability  
**Plays:** 14-cost-optimized-ai-gateway  
**File:** [`fai-cost-gateway.agent.md`](./fai-cost-gateway.agent.md)

### `fai-cost-optimizer`

**Name:** FAI Cost Optimizer  
**Description:** FinOps cost optimizer for AI workloads — model routing economics, semantic caching ROI, token budget design, PTU vs PAYG analysis, right-sizing recommendations, and Azure cost attribution.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 14-cost-optimized-ai-gateway, 52-finops  
**File:** [`fai-cost-optimizer.agent.md`](./fai-cost-optimizer.agent.md)

### `fai-crewai-expert`

**Name:** FAI CrewAI Expert  
**Description:** CrewAI multi-agent framework specialist — crew composition, role-based agents with backstory, task delegation with expected output, sequential/hierarchical processes, and custom tool integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration  
**File:** [`fai-crewai-expert.agent.md`](./fai-crewai-expert.agent.md)

### `fai-csharp-expert`

**Name:** FAI C# Expert  
**Description:** C#/.NET specialist — modern C# 12+/.NET 9, Azure SDK integration, Semantic Kernel, async/await patterns, Polly resilience, minimal APIs, and AI-native application development.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 01-enterprise-rag, 03-deterministic-agent  
**File:** [`fai-csharp-expert.agent.md`](./fai-csharp-expert.agent.md)

### `fai-csharp-mcp-expert`

**Name:** FAI C# MCP Expert  
**Description:** C# MCP server development specialist — ModelContextProtocol NuGet package, [McpServerTool] attributes, dependency injection, stdio/SSE transport, and Azure-integrated MCP tool development.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 29-mcp-server  
**File:** [`fai-csharp-mcp-expert.agent.md`](./fai-csharp-mcp-expert.agent.md)

### `fai-dapr-expert`

**Name:** FAI Dapr Expert  
**Description:** Dapr distributed application runtime specialist — service invocation, state management, pub/sub messaging, bindings, secrets management, and sidecar-based AI microservice patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence, security  
**Plays:** 05-it-ticket-resolution, 07-multi-agent-service  
**File:** [`fai-dapr-expert.agent.md`](./fai-dapr-expert.agent.md)

### `fai-data-engineer`

**Name:** FAI Data Engineer  
**Description:** Data engineering specialist for AI — RAG ingestion pipelines, document chunking, ETL/ELT patterns, PII detection with Presidio, data quality scoring, and Azure Data Factory orchestration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, operational-excellence, performance-efficiency  
**Plays:** 01-enterprise-rag, 06-document-intelligence, 13-fine-tuning-workflow  
**File:** [`fai-data-engineer.agent.md`](./fai-data-engineer.agent.md)

### `fai-datadog-expert`

**Name:** FAI Datadog Expert  
**Description:** Datadog observability specialist — monitor creation, APM trace correlation, dashboard design, metric queries, and AI workload monitoring with custom metrics for token usage and model latency.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, reliability  
**Plays:** 17-ai-observability  
**File:** [`fai-datadog-expert.agent.md`](./fai-datadog-expert.agent.md)

### `fai-debug-expert`

**Name:** FAI Debug Expert  
**Description:** Systematic debugging specialist — reproduce-isolate-fix methodology, binary search isolation, stack trace interpretation, Application Insights transaction tracing, and LLM-specific issue diagnosis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 37-devops-agent  
**File:** [`fai-debug-expert.agent.md`](./fai-debug-expert.agent.md)

### `fai-deno-expert`

**Name:** FAI Deno Expert  
**Description:** Deno runtime specialist — TypeScript-first with permissions model, Deno KV for edge state, Deno Deploy for serverless, secure-by-default AI service development.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, performance-efficiency  
**Plays:** 29-mcp-server  
**File:** [`fai-deno-expert.agent.md`](./fai-deno-expert.agent.md)

### `fai-deterministic-expert`

**Name:** FAI Deterministic Expert  
**Description:** Deterministic AI specialist — makes AI outputs reproducible, grounded, and auditable with temperature control, seed pinning, JSON schema output, RAG grounding, citation enforcement, and multi-layer hallucination defense.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, responsible-ai, security  
**Plays:** 03-deterministic-agent  
**File:** [`fai-deterministic-expert.agent.md`](./fai-deterministic-expert.agent.md)

### `fai-devops-expert`

**Name:** FAI DevOps Expert  
**Description:** DevOps lifecycle specialist — GitHub Actions OIDC, Infrastructure as Code (Bicep/Terraform), deployment strategies (blue-green/canary), SRE practices, DORA metrics, and incident management for AI systems.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, reliability, security  
**Plays:** 37-devops-agent, 02-ai-landing-zone  
**File:** [`fai-devops-expert.agent.md`](./fai-devops-expert.agent.md)

### `fai-docker-expert`

**Name:** FAI Docker Expert  
**Description:** Docker specialist — multi-stage builds, distroless images, GPU container support (CUDA/NVIDIA), ACR management, layer optimization, and container patterns for AI model serving.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, security  
**Plays:** 12-model-serving-aks, 29-mcp-server  
**File:** [`fai-docker-expert.agent.md`](./fai-docker-expert.agent.md)

### `fai-dotnet-maui-expert`

**Name:** FAI .NET MAUI Expert  
**Description:** .NET MAUI cross-platform specialist — iOS, Android, Windows, macOS from single C# codebase, on-device AI inference (ONNX), MVVM architecture, and mobile-first AI application patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 34-mobile-ai, 44-edge-inference  
**File:** [`fai-dotnet-maui-expert.agent.md`](./fai-dotnet-maui-expert.agent.md)

### `fai-dspy-expert`

**Name:** FAI DSPy Expert  
**Description:** DSPy framework specialist — declarative LM programs, signature-based modules, optimizers (BootstrapFewShot, MIPRO), assertions, metric-driven prompt optimization, and compiled prompt pipelines.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization, reliability  
**Plays:** 18-prompt-optimization, 03-deterministic-agent  
**File:** [`fai-dspy-expert.agent.md`](./fai-dspy-expert.agent.md)

### `fai-elasticsearch-expert`

**Name:** FAI Elasticsearch Expert  
**Description:** Elasticsearch specialist — index design, BM25 + kNN hybrid search, vector fields with HNSW, ILM lifecycle, cluster management, and RAG integration patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability, security  
**Plays:** 01-enterprise-rag, 26-personalized-search  
**File:** [`fai-elasticsearch-expert.agent.md`](./fai-elasticsearch-expert.agent.md)

### `fai-embedding-expert`

**Name:** FAI Embedding Expert  
**Description:** Embedding specialist — text-embedding-3 model selection, Matryoshka dimension reduction, batch embedding pipelines, similarity metrics, chunking strategies, and vector database integration for RAG.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 01-enterprise-rag, 21-agentic-rag  
**File:** [`fai-embedding-expert.agent.md`](./fai-embedding-expert.agent.md)

### `fai-epic-breakdown-expert`

**Name:** FAI Epic Breakdown Expert  
**Description:** Epic breakdown specialist — decomposes large AI features into INVEST user stories with acceptance criteria, sprint-sized tasks, dependency mapping, and WSJF prioritization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**Plays:** 37-devops-agent  
**File:** [`fai-epic-breakdown-expert.agent.md`](./fai-epic-breakdown-expert.agent.md)

### `fai-event-driven-expert`

**Name:** FAI Event-Driven Expert  
**Description:** Event-driven architecture specialist — Azure Event Grid, Service Bus, Event Hubs selection, event sourcing, CQRS, saga orchestration, and exactly-once processing patterns for AI pipelines.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, performance-efficiency, cost-optimization  
**Plays:** 01-enterprise-rag, 07-multi-agent-service  
**File:** [`fai-event-driven-expert.agent.md`](./fai-event-driven-expert.agent.md)

### `fai-fine-tuning-expert`

**Name:** FAI Fine-Tuning Expert  
**Description:** Fine-tuning and MLOps specialist — LoRA/QLoRA techniques, JSONL training data preparation, Azure OpenAI fine-tuning workflow, hyperparameter tuning, evaluation-driven iteration, and model versioning.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, operational-excellence, responsible-ai  
**Plays:** 13-fine-tuning-workflow  
**File:** [`fai-fine-tuning-expert.agent.md`](./fai-fine-tuning-expert.agent.md)

### `fai-genai-foundations-expert`

**Name:** FAI GenAI Foundations Expert  
**Description:** GenAI foundations expert — transformer architecture, tokenization, inference optimization (KV cache, speculative decoding), model taxonomy, prompt engineering theory, and evaluation benchmarks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 01-enterprise-rag, 03-deterministic-agent  
**File:** [`fai-genai-foundations-expert.agent.md`](./fai-genai-foundations-expert.agent.md)

### `fai-git-workflow-expert`

**Name:** FAI Git Workflow Expert  
**Description:** Git workflow specialist — trunk-based development, conventional commits, PR best practices, branch protection, merge strategies, CODEOWNERS, and Git hooks for AI project collaboration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**Plays:** 37-devops-agent  
**File:** [`fai-git-workflow-expert.agent.md`](./fai-git-workflow-expert.agent.md)

### `fai-github-actions-expert`

**Name:** FAI GitHub Actions Expert  
**Description:** GitHub Actions specialist — OIDC federation to Azure, reusable workflows, matrix strategies, composite actions, caching, security hardening, and AI-specific CI/CD patterns (eval.py gates, prompt regression).  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, security  
**Plays:** 37-devops-agent, 32-test-automation  
**File:** [`fai-github-actions-expert.agent.md`](./fai-github-actions-expert.agent.md)

### `fai-go-expert`

**Name:** FAI Go Expert  
**Description:** Go development specialist — idiomatic Go 1.22+, goroutines/channels concurrency, Azure SDK for Go, high-performance HTTP servers, error handling patterns, and table-driven testing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability, security  
**Plays:** 29-mcp-server, 12-model-serving-aks  
**File:** [`fai-go-expert.agent.md`](./fai-go-expert.agent.md)

### `fai-go-mcp-expert`

**Name:** FAI Go MCP Expert  
**Description:** Go MCP server specialist — mcp-go SDK, struct-based tool definitions, context-aware handlers, stdio transport, concurrent tool execution, and Azure service integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 29-mcp-server  
**File:** [`fai-go-mcp-expert.agent.md`](./fai-go-mcp-expert.agent.md)

### `fai-graphql-expert`

**Name:** FAI GraphQL Expert  
**Description:** GraphQL specialist — schema design, resolver patterns, DataLoader N+1 prevention, subscriptions for AI streaming, federation, query complexity limits, and code generation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability, security  
**Plays:** 01-enterprise-rag  
**File:** [`fai-graphql-expert.agent.md`](./fai-graphql-expert.agent.md)

### `fai-graphrag-expert`

**Name:** FAI GraphRAG Expert  
**Description:** GraphRAG specialist — entity extraction, relationship mapping, knowledge graph construction, community detection, graph-based retrieval with Cosmos DB Gremlin/Neo4j, and hybrid graph+vector search.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 28-knowledge-graph, 21-agentic-rag  
**File:** [`fai-graphrag-expert.agent.md`](./fai-graphrag-expert.agent.md)

### `fai-grpc-expert`

**Name:** FAI gRPC Expert  
**Description:** gRPC specialist — Protocol Buffers schema design, unary/streaming RPCs, interceptors for auth and tracing, load balancing, health checking, and high-performance AI microservice communication.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 07-multi-agent-service, 12-model-serving-aks  
**File:** [`fai-grpc-expert.agent.md`](./fai-grpc-expert.agent.md)

### `fai-guidance-expert`

**Name:** FAI Guidance Expert  
**Description:** Microsoft Guidance specialist — constrained generation, token healing, regex patterns, guaranteed JSON/XML compliance, select/gen/each primitives, and grammar-enforced structured output.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency  
**Plays:** 03-deterministic-agent  
**File:** [`fai-guidance-expert.agent.md`](./fai-guidance-expert.agent.md)

### `fai-htmx-expert`

**Name:** FAI htmx Expert  
**Description:** htmx specialist — HTML-over-the-wire, hx-get/hx-post/hx-swap, server-sent events for AI streaming, progressive enhancement, and minimal-JavaScript AI chat interfaces.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 09-ai-search-portal  
**File:** [`fai-htmx-expert.agent.md`](./fai-htmx-expert.agent.md)

### `fai-i18n-expert`

**Name:** FAI i18n Expert  
**Description:** Internationalization specialist — multi-language AI responses, ICU message format, locale-aware formatting, Azure Translator integration, RTL support, and translation workflow design.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, operational-excellence  
**Plays:** 57-translation  
**File:** [`fai-i18n-expert.agent.md`](./fai-i18n-expert.agent.md)

### `fai-incident-responder`

**Name:** FAI Incident Responder  
**Description:** Incident response specialist — severity classification (P0-P4), triage protocols, automated runbooks, war room coordination, root cause analysis, blameless post-mortems, and AI-specific incident patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, operational-excellence  
**Plays:** 37-devops-agent  
**File:** [`fai-incident-responder.agent.md`](./fai-incident-responder.agent.md)

### `fai-java-expert`

**Name:** FAI Java Expert  
**Description:** Java/Spring Boot specialist — Java 21+ virtual threads, Spring Boot 3.3, Spring AI for LLM integration, reactive streams for SSE, Azure SDK, and enterprise-grade AI application patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security, operational-excellence  
**Plays:** 01-enterprise-rag, 05-it-ticket-resolution  
**File:** [`fai-java-expert.agent.md`](./fai-java-expert.agent.md)

### `fai-java-mcp-expert`

**Name:** FAI Java MCP Expert  
**Description:** Java MCP server specialist — MCP SDK for Java, Spring Boot auto-configuration, @Tool annotation, reactive streams, enterprise service patterns, and Azure integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security  
**Plays:** 29-mcp-server  
**File:** [`fai-java-mcp-expert.agent.md`](./fai-java-mcp-expert.agent.md)

### `fai-jira-expert`

**Name:** FAI Jira Expert  
**Description:** Jira integration specialist — AI-powered ticket triage, sprint query automation, board management, release tracking, and project management workflow design.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**Plays:** 05-it-ticket-resolution, 51-autonomous-coding  
**File:** [`fai-jira-expert.agent.md`](./fai-jira-expert.agent.md)

### `fai-kotlin-expert`

**Name:** FAI Kotlin Expert  
**Description:** Kotlin specialist — coroutines with structured concurrency, Ktor HTTP server, Flow for reactive AI streaming, Jetpack Compose UI, and Azure SDK suspend-friendly patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 34-mobile-ai  
**File:** [`fai-kotlin-expert.agent.md`](./fai-kotlin-expert.agent.md)

### `fai-kotlin-mcp-expert`

**Name:** FAI Kotlin MCP Expert  
**Description:** Kotlin MCP server specialist — coroutine-based tool handlers, Ktor server transport, sealed class tool definitions, Flow-based streaming, and Azure suspend-friendly integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 29-mcp-server  
**File:** [`fai-kotlin-mcp-expert.agent.md`](./fai-kotlin-mcp-expert.agent.md)

### `fai-kubernetes-expert`

**Name:** FAI Kubernetes Expert  
**Description:** Kubernetes specialist — pod scheduling, GPU resource management, network policies, Helm charts, GitOps with Flux/ArgoCD, and production-grade AI workload orchestration on AKS.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency, security  
**Plays:** 12-model-serving-aks, 02-ai-landing-zone  
**File:** [`fai-kubernetes-expert.agent.md`](./fai-kubernetes-expert.agent.md)

### `fai-landing-zone`

**Name:** FAI Landing Zone  
**Description:** Azure AI Landing Zone architect — hub-spoke networking, private endpoints for all PaaS, managed identity, GPU quotas, governance policies, and Bicep-based enterprise AI infrastructure.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, reliability, operational-excellence  
**Plays:** 02-ai-landing-zone, 11-ai-landing-zone-advanced  
**File:** [`fai-landing-zone.agent.md`](./fai-landing-zone.agent.md)

### `fai-langchain-expert`

**Name:** FAI LangChain Expert  
**Description:** LangChain framework specialist — LCEL expression language, chains, agents with tool use, retrievers, memory, callbacks, LangSmith tracing, and production RAG pipeline patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 01-enterprise-rag, 21-agentic-rag  
**File:** [`fai-langchain-expert.agent.md`](./fai-langchain-expert.agent.md)

### `fai-llamaindex-expert`

**Name:** FAI LlamaIndex Expert  
**Description:** LlamaIndex data framework specialist — document loaders, index types (VectorStore/Summary/Knowledge Graph), query engines, response synthesizers, and agent tool integration for RAG.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 01-enterprise-rag, 28-knowledge-graph  
**File:** [`fai-llamaindex-expert.agent.md`](./fai-llamaindex-expert.agent.md)

### `fai-llm-landscape-expert`

**Name:** FAI LLM Landscape Expert  
**Description:** LLM landscape expert — model families (GPT, Claude, Llama, Gemini, Phi), benchmarks (MMLU, HumanEval, MT-Bench), deployment types, quantization, and model selection frameworks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-llm-landscape-expert.agent.md`](./fai-llm-landscape-expert.agent.md)

### `fai-markdown-expert`

**Name:** FAI Markdown Expert  
**Description:** Markdown specialist — CommonMark/GFM, agent markup (.agent.md/.instructions.md/SKILL.md), documentation standards (README/ADR/changelog), accessibility, and content structure.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**File:** [`fai-markdown-expert.agent.md`](./fai-markdown-expert.agent.md)

### `fai-mcp-expert`

**Name:** FAI MCP Expert  
**Description:** MCP protocol expert — Model Context Protocol specification, tool/resource/prompt primitives, stdio/SSE transports, server development patterns, and MCP ecosystem integration across VS Code, Claude, and Cursor.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 29-mcp-server  
**File:** [`fai-mcp-expert.agent.md`](./fai-mcp-expert.agent.md)

### `fai-mentoring-agent`

**Name:** FAI Mentoring Agent  
**Description:** Developer mentoring specialist — Socratic teaching, personalized learning paths, constructive code review feedback, skill gap analysis, and progressive complexity scaffolding.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, operational-excellence  
**Plays:** 01-enterprise-rag, 03-deterministic-agent  
**File:** [`fai-mentoring-agent.agent.md`](./fai-mentoring-agent.agent.md)

### `fai-mermaid-diagram-expert`

**Name:** FAI Mermaid Diagram Expert  
**Description:** Mermaid diagram specialist — flowcharts, sequence diagrams, architecture diagrams, ER diagrams, state machines, and Gantt charts for AI system documentation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**Plays:** 07-multi-agent-service, 02-ai-landing-zone  
**File:** [`fai-mermaid-diagram-expert.agent.md`](./fai-mermaid-diagram-expert.agent.md)

### `fai-migration-expert`

**Name:** FAI Migration Expert  
**Description:** Migration specialist — legacy-to-cloud, .NET Framework upgrade, database migration, AI-native re-architecture, 6R framework, Azure Migrate, and incremental migration patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, reliability  
**Plays:** 02-ai-landing-zone  
**File:** [`fai-migration-expert.agent.md`](./fai-migration-expert.agent.md)

### `fai-ml-engineer`

**Name:** FAI ML Engineer  
**Description:** ML engineering specialist — model training pipelines, LoRA/QLoRA fine-tuning, evaluation metrics, MLOps with Azure AI Foundry, model registry, and serving optimization for production AI.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency, operational-excellence  
**Plays:** 13-fine-tuning-workflow, 48-model-governance  
**File:** [`fai-ml-engineer.agent.md`](./fai-ml-engineer.agent.md)

### `fai-mlflow-expert`

**Name:** FAI MLflow Expert  
**Description:** MLflow specialist — experiment tracking, model registry, metric/artifact logging, Azure ML integration, deployment pipelines, and model lifecycle management.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, reliability  
**Plays:** 13-fine-tuning-workflow, 48-model-governance  
**File:** [`fai-mlflow-expert.agent.md`](./fai-mlflow-expert.agent.md)

### `fai-mongodb-expert`

**Name:** FAI MongoDB Expert  
**Description:** MongoDB specialist — document schema design, aggregation pipelines, Atlas Vector Search for RAG, Cosmos DB MongoDB vCore, change streams, and AI application data patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 01-enterprise-rag  
**File:** [`fai-mongodb-expert.agent.md`](./fai-mongodb-expert.agent.md)

### `fai-nats-expert`

**Name:** FAI NATS Expert  
**Description:** NATS messaging specialist — JetStream for durable streams, key-value store, object store, request-reply, pub-sub, and lightweight event-driven AI microservice communication.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency  
**Plays:** 07-multi-agent-service  
**File:** [`fai-nats-expert.agent.md`](./fai-nats-expert.agent.md)

### `fai-neon-expert`

**Name:** FAI Neon Expert  
**Description:** Neon serverless Postgres specialist — database branching, auto-scaling compute, pgvector for AI embeddings, connection pooling, and database-per-branch development workflows.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 01-enterprise-rag  
**File:** [`fai-neon-expert.agent.md`](./fai-neon-expert.agent.md)

### `fai-openapi-expert`

**Name:** FAI OpenAPI Expert  
**Description:** OpenAPI specialist — API-first design, OpenAPI 3.1 spec authoring, code generation, validation middleware, and Copilot plugin API definition for AI applications.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, reliability  
**Plays:** 08-copilot-studio-bot, 40-declarative-agent  
**File:** [`fai-openapi-expert.agent.md`](./fai-openapi-expert.agent.md)

### `fai-opentelemetry-expert`

**Name:** FAI OpenTelemetry Expert  
**Description:** OpenTelemetry specialist — distributed tracing, metrics, logs with OTLP protocol, auto-instrumentation, custom spans for AI pipelines, and Azure Monitor exporter integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, performance-efficiency  
**Plays:** 17-ai-observability  
**File:** [`fai-opentelemetry-expert.agent.md`](./fai-opentelemetry-expert.agent.md)

### `fai-pagerduty-expert`

**Name:** FAI PagerDuty Expert  
**Description:** PagerDuty incident management specialist — alert routing, escalation policies, on-call scheduling, automated incident creation, and AI-specific runbook integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 37-devops-agent  
**File:** [`fai-pagerduty-expert.agent.md`](./fai-pagerduty-expert.agent.md)

### `fai-performance-profiler`

**Name:** FAI Performance Profiler  
**Description:** Performance profiling specialist — latency analysis (P50/P95/P99), token optimization, GPU utilization profiling, bottleneck identification, cold start analysis, and AI pipeline performance tuning.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-performance-profiler.agent.md`](./fai-performance-profiler.agent.md)

### `fai-php-expert`

**Name:** FAI PHP Expert  
**Description:** PHP 8.3+ specialist — modern PHP with attributes, typed properties, enums, fibers, Composer PSR standards, Laravel/Symfony patterns, and PHP-based AI API integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability  
**Plays:** 01-enterprise-rag  
**File:** [`fai-php-expert.agent.md`](./fai-php-expert.agent.md)

### `fai-php-mcp-expert`

**Name:** FAI PHP MCP Expert  
**Description:** PHP MCP server specialist — PHP 8.3+ attributes for tool registration, PSR standards, Composer dependency management, typed properties for JSON Schema, and stdio transport.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security  
**Plays:** 29-mcp-server  
**File:** [`fai-php-mcp-expert.agent.md`](./fai-php-mcp-expert.agent.md)

### `fai-play-01-builder`

**Name:** FAI Enterprise RAG Builder  
**Description:** Enterprise RAG builder — hybrid search pipeline (BM25+vector), Azure AI Search indexing, OpenAI chat completions with citations, chunking strategies, and evaluation-driven quality gates.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 01-enterprise-rag  
**File:** [`fai-play-01-builder.agent.md`](./fai-play-01-builder.agent.md)

### `fai-play-01-reviewer`

**Name:** FAI Enterprise RAG Reviewer  
**Description:** Enterprise RAG reviewer — RAG quality audit, citation accuracy, search config validation, security compliance, OWASP LLM Top 10, and WAF pillar alignment checks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, responsible-ai  
**Plays:** 01-enterprise-rag  
**File:** [`fai-play-01-reviewer.agent.md`](./fai-play-01-reviewer.agent.md)

### `fai-play-01-tuner`

**Name:** FAI Enterprise RAG Tuner  
**Description:** Enterprise RAG tuner — config optimization for search quality, token costs, chunking parameters, evaluation thresholds, and model selection economics.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 01-enterprise-rag  
**File:** [`fai-play-01-tuner.agent.md`](./fai-play-01-tuner.agent.md)

### `fai-play-02-builder`

**Name:** FAI AI Landing Zone Builder  
**Description:** AI Landing Zone builder — hub-spoke networking, private endpoints, Azure Firewall, DNS architecture, identity foundation, and governance baseline for enterprise AI workloads.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 02-ai-landing-zone  
**File:** [`fai-play-02-builder.agent.md`](./fai-play-02-builder.agent.md)

### `fai-play-02-reviewer`

**Name:** FAI AI Landing Zone Reviewer  
**Description:** AI Landing Zone reviewer — network security audit, private endpoint verification, identity compliance, Azure Policy enforcement, and Bicep infrastructure review.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, responsible-ai  
**Plays:** 02-ai-landing-zone  
**File:** [`fai-play-02-reviewer.agent.md`](./fai-play-02-reviewer.agent.md)

### `fai-play-02-tuner`

**Name:** FAI AI Landing Zone Tuner  
**Description:** AI Landing Zone tuner — network sizing, firewall rule optimization, SKU right-sizing, cost analysis, DR configuration, and production readiness verification.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 02-ai-landing-zone  
**File:** [`fai-play-02-tuner.agent.md`](./fai-play-02-tuner.agent.md)

### `fai-play-03-builder`

**Name:** FAI Deterministic Agent Builder  
**Description:** Deterministic Agent builder — zero-temperature architecture, seed pinning, structured JSON output, multi-layer guardrails, confidence scoring, and anti-hallucination defense.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 03-deterministic-agent  
**File:** [`fai-play-03-builder.agent.md`](./fai-play-03-builder.agent.md)

### `fai-play-03-reviewer`

**Name:** FAI Deterministic Agent Reviewer  
**Description:** Deterministic Agent reviewer — reproducibility testing, guardrail completeness audit, anti-sycophancy verification, schema validation review, and confidence calibration checks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 03-deterministic-agent  
**File:** [`fai-play-03-reviewer.agent.md`](./fai-play-03-reviewer.agent.md)

### `fai-play-03-tuner`

**Name:** FAI Deterministic Agent Tuner  
**Description:** Deterministic Agent tuner — confidence threshold optimization, guardrail severity calibration, evaluation metric tuning, retry config, and A/B testing for determinism quality.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 03-deterministic-agent  
**File:** [`fai-play-03-tuner.agent.md`](./fai-play-03-tuner.agent.md)

### `fai-play-04-builder`

**Name:** FAI Call Center Voice AI Builder  
**Description:** Call Center Voice AI builder — STT→LLM→TTS streaming pipeline, Azure Communication Services, real-time transcription, intent classification, PII redaction, and escalation triggers.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 04-call-center-voice-ai  
**File:** [`fai-play-04-builder.agent.md`](./fai-play-04-builder.agent.md)

### `fai-play-04-reviewer`

**Name:** FAI Call Center Voice AI Reviewer  
**Description:** Call Center Voice AI reviewer — voice quality audit, pipeline latency review, PII redaction verification, TCPA compliance, and escalation trigger testing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 04-call-center-voice-ai  
**File:** [`fai-play-04-reviewer.agent.md`](./fai-play-04-reviewer.agent.md)

### `fai-play-04-tuner`

**Name:** FAI Call Center Voice AI Tuner  
**Description:** Call Center Voice AI tuner — speech config optimization, neural voice selection, latency tuning, escalation thresholds, cost-per-call analysis, and CSAT metric targeting.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 04-call-center-voice-ai  
**File:** [`fai-play-04-tuner.agent.md`](./fai-play-04-tuner.agent.md)

### `fai-play-05-builder`

**Name:** FAI IT Ticket Resolution Builder  
**Description:** IT Ticket Resolution builder — event-driven classification pipeline, auto-resolution via knowledge base, ServiceNow/Jira integration, skill-based routing, and SLA monitoring.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 05-it-ticket-resolution  
**File:** [`fai-play-05-builder.agent.md`](./fai-play-05-builder.agent.md)

### `fai-play-05-reviewer`

**Name:** FAI IT Ticket Resolution Reviewer  
**Description:** IT Ticket Resolution reviewer — classification accuracy audit, auto-resolution quality, routing fairness, SLA compliance, ServiceNow integration security, and PII handling review.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 05-it-ticket-resolution  
**File:** [`fai-play-05-reviewer.agent.md`](./fai-play-05-reviewer.agent.md)

### `fai-play-05-tuner`

**Name:** FAI IT Ticket Resolution Tuner  
**Description:** IT Ticket Resolution tuner — classification prompt optimization, routing rules, auto-resolution thresholds, SLA configuration, and cost-per-ticket analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 05-it-ticket-resolution  
**File:** [`fai-play-05-tuner.agent.md`](./fai-play-05-tuner.agent.md)

### `fai-play-06-builder`

**Name:** FAI Document Intelligence Builder  
**Description:** Document Intelligence builder — Azure AI Document Intelligence OCR, multi-format processing, GPT-4o field extraction, Cosmos DB storage, and validation pipeline.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 06-document-intelligence  
**File:** [`fai-play-06-builder.agent.md`](./fai-play-06-builder.agent.md)

### `fai-play-06-reviewer`

**Name:** FAI Document Intelligence Reviewer  
**Description:** Document Intelligence reviewer — OCR accuracy audit, schema validation, PII handling review, pipeline error handling, and confidence threshold verification.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 06-document-intelligence  
**File:** [`fai-play-06-reviewer.agent.md`](./fai-play-06-reviewer.agent.md)

### `fai-play-06-tuner`

**Name:** FAI Document Intelligence Tuner  
**Description:** Document Intelligence tuner — OCR settings optimization, extraction confidence calibration, custom model training data, batch performance, and cost-per-document analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 06-document-intelligence  
**File:** [`fai-play-06-tuner.agent.md`](./fai-play-06-tuner.agent.md)

### `fai-play-07-builder`

**Name:** FAI Multi-Agent Service Builder  
**Description:** Multi-Agent Service builder — supervisor orchestration pattern, agent registry, shared state via Cosmos DB/Redis, Dapr integration, tool routing, and loop prevention.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 07-multi-agent-service  
**File:** [`fai-play-07-builder.agent.md`](./fai-play-07-builder.agent.md)

### `fai-play-07-reviewer`

**Name:** FAI Multi-Agent Service Reviewer  
**Description:** Multi-Agent Service reviewer — orchestration logic audit, state management review, loop prevention verification, agent security boundaries, and Dapr configuration checks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 07-multi-agent-service  
**File:** [`fai-play-07-reviewer.agent.md`](./fai-play-07-reviewer.agent.md)

### `fai-play-07-tuner`

**Name:** FAI Multi-Agent Service Tuner  
**Description:** Multi-Agent Service tuner — supervisor routing config, per-agent token budgets, loop limits, model selection per role, memory TTL, and orchestration cost analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 07-multi-agent-service  
**File:** [`fai-play-07-tuner.agent.md`](./fai-play-07-tuner.agent.md)

### `fai-play-08-builder`

**Name:** FAI Copilot Studio Bot Builder  
**Description:** Copilot Studio Bot builder — declarative agent setup, topic design, SharePoint/Dataverse knowledge grounding, Power Platform connectors, and conversation guardrails.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security, operational-excellence  
**Plays:** 08-copilot-studio-bot  
**File:** [`fai-play-08-builder.agent.md`](./fai-play-08-builder.agent.md)

### `fai-play-08-reviewer`

**Name:** FAI Copilot Studio Bot Reviewer  
**Description:** Copilot Studio Bot reviewer — topic coverage audit, knowledge source validation, DLP compliance, guardrail verification, and conversation flow testing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 08-copilot-studio-bot  
**File:** [`fai-play-08-reviewer.agent.md`](./fai-play-08-reviewer.agent.md)

### `fai-play-08-tuner`

**Name:** FAI Copilot Studio Bot Tuner  
**Description:** Copilot Studio Bot tuner — trigger phrase expansion, knowledge source optimization, response tone calibration, guardrail sensitivity, and conversation flow tuning.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 08-copilot-studio-bot  
**File:** [`fai-play-08-tuner.agent.md`](./fai-play-08-tuner.agent.md)

### `fai-play-09-builder`

**Name:** FAI AI Search Portal Builder  
**Description:** AI Search Portal builder — Azure AI Search index design, hybrid search with scoring profiles, faceted navigation, answer generation with citations, and auto-suggest.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability, security  
**Plays:** 09-ai-search-portal  
**File:** [`fai-play-09-builder.agent.md`](./fai-play-09-builder.agent.md)

### `fai-play-09-reviewer`

**Name:** FAI AI Search Portal Reviewer  
**Description:** AI Search Portal reviewer — index schema audit, search relevance testing, answer citation accuracy, facet UX review, and performance benchmarking.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 09-ai-search-portal  
**File:** [`fai-play-09-reviewer.agent.md`](./fai-play-09-reviewer.agent.md)

### `fai-play-09-tuner`

**Name:** FAI AI Search Portal Tuner  
**Description:** AI Search Portal tuner — hybrid weight optimization, scoring profile calibration, reranker config, suggester tuning, and answer generation quality.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 09-ai-search-portal  
**File:** [`fai-play-09-tuner.agent.md`](./fai-play-09-tuner.agent.md)

### `fai-play-10-builder`

**Name:** FAI Content Moderation Builder  
**Description:** Content Moderation builder — Azure Content Safety API integration, 4-category severity scoring, custom blocklists, APIM gateway middleware, and severity-based routing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** responsible-ai, security  
**Plays:** 10-content-moderation  
**File:** [`fai-play-10-builder.agent.md`](./fai-play-10-builder.agent.md)

### `fai-play-10-reviewer`

**Name:** FAI Content Moderation Reviewer  
**Description:** Content Moderation reviewer — safety coverage audit, severity threshold verification, blocklist completeness, bypass prevention, and human review workflow testing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, security  
**Plays:** 10-content-moderation  
**File:** [`fai-play-10-reviewer.agent.md`](./fai-play-10-reviewer.agent.md)

### `fai-play-10-tuner`

**Name:** FAI Content Moderation Tuner  
**Description:** Content Moderation tuner — per-category severity calibration, blocklist optimization, false positive reduction, routing distribution, and moderation cost analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, cost-optimization  
**Plays:** 10-content-moderation  
**File:** [`fai-play-10-tuner.agent.md`](./fai-play-10-tuner.agent.md)

### `fai-play-11-builder`

**Name:** FAI AI Landing Zone Advanced Builder  
**Description:** AI Landing Zone Advanced builder — multi-region hub-spoke, Azure Firewall Premium with TLS/IDPS, policy-driven governance at scale, GPU quota orchestration, and disaster recovery automation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security, operational-excellence  
**Plays:** 11-ai-landing-zone-advanced  
**File:** [`fai-play-11-builder.agent.md`](./fai-play-11-builder.agent.md)

### `fai-play-11-reviewer`

**Name:** FAI AI Landing Zone Advanced Reviewer  
**Description:** AI Landing Zone Advanced reviewer — multi-region networking audit, firewall rule review, policy compliance verification, GPU quota validation, and DR testing review.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability  
**Plays:** 11-ai-landing-zone-advanced  
**File:** [`fai-play-11-reviewer.agent.md`](./fai-play-11-reviewer.agent.md)

### `fai-play-11-tuner`

**Name:** FAI AI Landing Zone Advanced Tuner  
**Description:** AI Landing Zone Advanced tuner — multi-region network sizing, firewall rule optimization, policy effect progression, GPU type selection, and DR cost optimization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 11-ai-landing-zone-advanced  
**File:** [`fai-play-11-tuner.agent.md`](./fai-play-11-tuner.agent.md)

### `fai-play-12-builder`

**Name:** FAI Model Serving AKS Builder  
**Description:** Model Serving AKS builder — GPU cluster design, vLLM/TGI serving engines, NVIDIA device plugin, HPA/KEDA autoscaling, model versioning, and canary deployments.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability, cost-optimization  
**Plays:** 12-model-serving-aks  
**File:** [`fai-play-12-builder.agent.md`](./fai-play-12-builder.agent.md)

### `fai-play-12-reviewer`

**Name:** FAI Model Serving AKS Reviewer  
**Description:** Model Serving AKS reviewer — GPU cluster audit, vLLM config validation, autoscaling verification, pod security review, and inference latency benchmarking.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability  
**Plays:** 12-model-serving-aks  
**File:** [`fai-play-12-reviewer.agent.md`](./fai-play-12-reviewer.agent.md)

### `fai-play-12-tuner`

**Name:** FAI Model Serving AKS Tuner  
**Description:** Model Serving AKS tuner — GPU SKU selection, vLLM memory/batching optimization, quantization decisions, autoscaling thresholds, and inference cost analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 12-model-serving-aks  
**File:** [`fai-play-12-tuner.agent.md`](./fai-play-12-tuner.agent.md)

### `fai-play-13-builder`

**Name:** FAI Fine-Tuning Workflow Builder  
**Description:** Fine-Tuning Workflow builder — Azure OpenAI fine-tuning, JSONL data preparation, LoRA/QLoRA techniques, MLflow experiment tracking, evaluation-driven iteration, and A/B deployment.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, cost-optimization, responsible-ai  
**Plays:** 13-fine-tuning-workflow  
**File:** [`fai-play-13-builder.agent.md`](./fai-play-13-builder.agent.md)

### `fai-play-13-reviewer`

**Name:** FAI Fine-Tuning Workflow Reviewer  
**Description:** Fine-Tuning Workflow reviewer — training data quality audit, hyperparameter validation, evaluation methodology review, safety retesting, and alignment preservation checks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, security  
**Plays:** 13-fine-tuning-workflow  
**File:** [`fai-play-13-reviewer.agent.md`](./fai-play-13-reviewer.agent.md)

### `fai-play-13-tuner`

**Name:** FAI Fine-Tuning Workflow Tuner  
**Description:** Fine-Tuning Workflow tuner — learning rate scheduling, LoRA rank/alpha optimization, epoch calibration, batch sizing, data quality filtering, and training cost analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 13-fine-tuning-workflow  
**File:** [`fai-play-13-tuner.agent.md`](./fai-play-13-tuner.agent.md)

### `fai-play-14-builder`

**Name:** FAI Cost-Optimized AI Gateway Builder  
**Description:** Cost-Optimized AI Gateway builder — APIM AI gateway, semantic caching with Redis, smart model routing by complexity, token budget enforcement, and multi-region load balancing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** cost-optimization, performance-efficiency, reliability  
**Plays:** 14-cost-optimized-ai-gateway  
**File:** [`fai-play-14-builder.agent.md`](./fai-play-14-builder.agent.md)

### `fai-play-14-reviewer`

**Name:** FAI Cost-Optimized AI Gateway Reviewer  
**Description:** Cost-Optimized AI Gateway reviewer — routing accuracy audit, cache quality verification, budget enforcement testing, security review, and cost savings validation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, cost-optimization  
**Plays:** 14-cost-optimized-ai-gateway  
**File:** [`fai-play-14-reviewer.agent.md`](./fai-play-14-reviewer.agent.md)

### `fai-play-14-tuner`

**Name:** FAI Cost-Optimized AI Gateway Tuner  
**Description:** Cost-Optimized AI Gateway tuner — semantic cache threshold calibration, routing complexity boundaries, token budget tiers, rate limits, and cost optimization analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 14-cost-optimized-ai-gateway  
**File:** [`fai-play-14-tuner.agent.md`](./fai-play-14-tuner.agent.md)

### `fai-play-15-builder`

**Name:** FAI Document Processing Builder  
**Description:** Document Processing builder — GPT-4o Vision multi-modal analysis, Azure Document Intelligence, table extraction, classification pipeline, and PII-aware storage.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, security  
**Plays:** 15-document-processing  
**File:** [`fai-play-15-builder.agent.md`](./fai-play-15-builder.agent.md)

### `fai-play-15-reviewer`

**Name:** FAI Document Processing Reviewer  
**Description:** Document Processing reviewer — multi-modal extraction accuracy audit, table parsing quality, PII masking verification, pipeline error handling, and classification accuracy review.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 15-document-processing  
**File:** [`fai-play-15-reviewer.agent.md`](./fai-play-15-reviewer.agent.md)

### `fai-play-15-tuner`

**Name:** FAI Document Processing Tuner  
**Description:** Document Processing tuner — GPT-4o Vision resolution settings, extraction confidence calibration, table detection thresholds, chart parsing config, and batch performance optimization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 15-document-processing  
**File:** [`fai-play-15-tuner.agent.md`](./fai-play-15-tuner.agent.md)

### `fai-play-16-builder`

**Name:** FAI Copilot Teams Extension Builder  
**Description:** Copilot Teams Extension builder — M365 Copilot declarative agent, Microsoft Graph API integration, Adaptive Cards, Entra ID SSO, and Teams message extension development.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, operational-excellence  
**Plays:** 16-copilot-teams-extension  
**File:** [`fai-play-16-builder.agent.md`](./fai-play-16-builder.agent.md)

### `fai-play-16-reviewer`

**Name:** FAI Copilot Teams Extension Reviewer  
**Description:** Copilot Teams Extension reviewer — Graph permission audit, SSO flow testing, Adaptive Card rendering review, message extension validation, and Teams policy compliance.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 16-copilot-teams-extension  
**File:** [`fai-play-16-reviewer.agent.md`](./fai-play-16-reviewer.agent.md)

### `fai-play-16-tuner`

**Name:** FAI Copilot Teams Extension Tuner  
**Description:** Copilot Teams Extension tuner — Graph scope minimization, knowledge source config, response tone calibration, Adaptive Card optimization, and permission tuning.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, performance-efficiency  
**Plays:** 16-copilot-teams-extension  
**File:** [`fai-play-16-tuner.agent.md`](./fai-play-16-tuner.agent.md)

### `fai-play-17-builder`

**Name:** FAI AI Observability Builder  
**Description:** AI Observability builder — Application Insights distributed tracing, KQL query library for AI metrics, Azure Workbooks dashboards, alerting rules, and FinOps telemetry.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, cost-optimization, reliability  
**Plays:** 17-ai-observability  
**File:** [`fai-play-17-builder.agent.md`](./fai-play-17-builder.agent.md)

### `fai-play-17-reviewer`

**Name:** FAI AI Observability Reviewer  
**Description:** AI Observability reviewer — telemetry coverage audit, KQL query accuracy, dashboard UX review, alert threshold calibration, and PII-in-logs verification.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, security  
**Plays:** 17-ai-observability  
**File:** [`fai-play-17-reviewer.agent.md`](./fai-play-17-reviewer.agent.md)

### `fai-play-17-tuner`

**Name:** FAI AI Observability Tuner  
**Description:** AI Observability tuner — Log Analytics commitment tier selection, sampling rate config, alert threshold calibration, dashboard refresh optimization, and retention policy tuning.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, operational-excellence  
**Plays:** 17-ai-observability  
**File:** [`fai-play-17-tuner.agent.md`](./fai-play-17-tuner.agent.md)

### `fai-play-18-builder`

**Name:** FAI Prompt Optimization Builder  
**Description:** Prompt Optimization builder — prompt versioning with semantic versions, A/B testing framework, Azure Prompt Flow, template engine with variable injection, and evaluation-driven iteration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization, reliability  
**Plays:** 18-prompt-optimization  
**File:** [`fai-play-18-builder.agent.md`](./fai-play-18-builder.agent.md)

### `fai-play-18-reviewer`

**Name:** FAI Prompt Optimization Reviewer  
**Description:** Prompt Optimization reviewer — version management audit, A/B test methodology review, template injection safety, evaluation pipeline validation, and prompt quality assessment.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 18-prompt-optimization  
**File:** [`fai-play-18-reviewer.agent.md`](./fai-play-18-reviewer.agent.md)

### `fai-play-18-tuner`

**Name:** FAI Prompt Optimization Tuner  
**Description:** Prompt Optimization tuner — system message clarity, few-shot example selection, A/B test config, template variable defaults, and prompt cost-quality trade-off analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 18-prompt-optimization  
**File:** [`fai-play-18-tuner.agent.md`](./fai-play-18-tuner.agent.md)

### `fai-play-19-builder`

**Name:** FAI Edge AI Builder  
**Description:** Edge AI builder — Phi-4 on-device inference, ONNX quantization (INT4/INT8), Azure IoT Hub fleet management, offline-first architecture, and cloud fallback patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, performance-efficiency, cost-optimization  
**Plays:** 19-edge-ai  
**File:** [`fai-play-19-builder.agent.md`](./fai-play-19-builder.agent.md)

### `fai-play-19-reviewer`

**Name:** FAI Edge AI Reviewer  
**Description:** Edge AI reviewer — quantized model quality audit, offline resilience testing, fleet rollout verification, cloud fallback review, and device security checks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security  
**Plays:** 19-edge-ai  
**File:** [`fai-play-19-reviewer.agent.md`](./fai-play-19-reviewer.agent.md)

### `fai-play-19-tuner`

**Name:** FAI Edge AI Tuner  
**Description:** Edge AI tuner — quantization level selection, on-device latency optimization, sync schedule config, cloud fallback thresholds, and per-device cost analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 19-edge-ai  
**File:** [`fai-play-19-tuner.agent.md`](./fai-play-19-tuner.agent.md)

### `fai-play-20-builder`

**Name:** FAI Real-Time Analytics Builder  
**Description:** Real-Time Analytics builder — Event Hub partitioned ingestion, Stream Analytics windowing, LLM-powered anomaly explanation, multi-signal scoring, and live dashboards.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** performance-efficiency, reliability  
**Plays:** 20-real-time-analytics  
**File:** [`fai-play-20-builder.agent.md`](./fai-play-20-builder.agent.md)

### `fai-play-20-reviewer`

**Name:** FAI Real-Time Analytics Reviewer  
**Description:** Real-Time Analytics reviewer — ingestion reliability audit, windowing correctness, anomaly detection accuracy, scoring logic review, and alert quality verification.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security  
**Plays:** 20-real-time-analytics  
**File:** [`fai-play-20-reviewer.agent.md`](./fai-play-20-reviewer.agent.md)

### `fai-play-20-tuner`

**Name:** FAI Real-Time Analytics Tuner  
**Description:** Real-Time Analytics tuner — window size optimization, anomaly threshold calibration, baseline window selection, alert severity rules, and streaming cost analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 20-real-time-analytics  
**File:** [`fai-play-20-tuner.agent.md`](./fai-play-20-tuner.agent.md)

### `fai-play-21-builder`

**Name:** FAI Agentic RAG Builder  
**Description:** Agentic RAG builder — autonomous retrieval agent, multi-source fusion (Search+web+DB), iterative query refinement, citation pipeline, and reflection-based quality gates.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, performance-efficiency  
**Plays:** 21-agentic-rag  
**File:** [`fai-play-21-builder.agent.md`](./fai-play-21-builder.agent.md)

### `fai-play-21-reviewer`

**Name:** FAI Agentic RAG Reviewer  
**Description:** Agentic RAG reviewer — retrieval autonomy audit, source selection review, iteration limit verification, citation accuracy check, and reflection quality assessment.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, responsible-ai  
**Plays:** 21-agentic-rag  
**File:** [`fai-play-21-reviewer.agent.md`](./fai-play-21-reviewer.agent.md)

### `fai-play-21-tuner`

**Name:** FAI Agentic RAG Tuner  
**Description:** Agentic RAG tuner — iteration depth config, source weight optimization, reflection threshold calibration, citation requirements, and per-query cost analysis.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 21-agentic-rag  
**File:** [`fai-play-21-tuner.agent.md`](./fai-play-21-tuner.agent.md)

### `fai-play-22-builder`

**Name:** FAI Swarm Orchestration Builder  
**Description:** Swarm Orchestration builder — mesh/star/hierarchical agent topologies, supervisor task decomposition, agent specialization, shared memory via Cosmos DB, and conflict resolution.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, performance-efficiency, security  
**Plays:** 22-swarm-orchestration  
**File:** [`fai-play-22-builder.agent.md`](./fai-play-22-builder.agent.md)

### `fai-play-22-reviewer`

**Name:** FAI Swarm Orchestration Reviewer  
**Description:** Swarm Orchestration reviewer — topology audit, supervisor logic review, agent specialization validation, shared memory consistency, and conflict resolution testing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security  
**Plays:** 22-swarm-orchestration  
**File:** [`fai-play-22-reviewer.agent.md`](./fai-play-22-reviewer.agent.md)

### `fai-play-22-tuner`

**Name:** FAI Swarm Orchestration Tuner  
**Description:** Swarm Orchestration tuner — topology selection, agent count optimization, consensus config, memory TTL calibration, and per-agent budget allocation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 22-swarm-orchestration  
**File:** [`fai-play-22-tuner.agent.md`](./fai-play-22-tuner.agent.md)

### `fai-play-23-builder`

**Name:** FAI Browser Agent Builder  
**Description:** Browser Agent builder — Playwright MCP integration, GPT-4o Vision page navigation, multi-step web task automation, form filling, data extraction, and domain-restricted browsing.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability  
**Plays:** 23-browser-agent  
**File:** [`fai-play-23-builder.agent.md`](./fai-play-23-builder.agent.md)

### `fai-play-23-reviewer`

**Name:** FAI Browser Agent Reviewer  
**Description:** Browser Agent reviewer — domain allowlist verification, vision accuracy testing, credential security audit, error recovery review, and task completion validation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 23-browser-agent  
**File:** [`fai-play-23-reviewer.agent.md`](./fai-play-23-reviewer.agent.md)

### `fai-play-23-tuner`

**Name:** FAI Browser Agent Tuner  
**Description:** Browser Agent tuner — screenshot resolution config, timeout calibration, retry strategy, domain allowlist management, and vision cost optimization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, performance-efficiency  
**Plays:** 23-browser-agent  
**File:** [`fai-play-23-tuner.agent.md`](./fai-play-23-tuner.agent.md)

### `fai-play-dispatcher`

**Name:** FAI Play Dispatcher  
**Description:** FAI play dispatcher — routes user requests to the correct solution play based on intent classification, understands all 101 plays and their domains, delegates to specialist agents.  
**Model:** gpt-4o-mini, gpt-4o  
**Tools:** codebase, terminal  
**WAF:** cost-optimization, operational-excellence  
**Plays:** 01-enterprise-rag, 07-multi-agent-service  
**File:** [`fai-play-dispatcher.agent.md`](./fai-play-dispatcher.agent.md)

### `fai-play-lifecycle`

**Name:** FAI Play Lifecycle  
**Description:** FAI play lifecycle manager — handles play initialization (scaffold file structure), Bicep deployment, evaluation quality gates, and config tuning for any of the 101 solution plays.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** operational-excellence, reliability, cost-optimization  
**File:** [`fai-play-lifecycle.agent.md`](./fai-play-lifecycle.agent.md)

### `fai-postgresql-expert`

**Name:** FAI PostgreSQL Expert  
**Description:** PostgreSQL specialist — pgvector for embedding storage, HNSW/IVFFlat indexes, query optimization with EXPLAIN ANALYZE, connection pooling (PgBouncer), partitioning, and RAG vector store patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 01-enterprise-rag  
**File:** [`fai-postgresql-expert.agent.md`](./fai-postgresql-expert.agent.md)

### `fai-power-bi-expert`

**Name:** FAI Power BI Expert  
**Description:** Power BI specialist — star schema data modeling, DAX formulas, report design, DirectQuery vs Import, AI-powered analytics with Azure OpenAI integration, and performance optimization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 20-real-time-analytics  
**File:** [`fai-power-bi-expert.agent.md`](./fai-power-bi-expert.agent.md)

### `fai-power-platform-expert`

**Name:** FAI Power Platform Expert  
**Description:** Power Platform specialist — Power Apps (Canvas + Model-driven), Power Automate cloud flows, Dataverse, custom connectors, DLP policies, and Copilot Studio integration.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, cost-optimization  
**Plays:** 08-copilot-studio-bot, 16-copilot-teams-extension  
**File:** [`fai-power-platform-expert.agent.md`](./fai-power-platform-expert.agent.md)

### `fai-prd-writer`

**Name:** FAI PRD Writer  
**Description:** PRD writer — produces structured Product Requirements Documents with user personas, success metrics, AI-specific requirements (quality thresholds, safety), constraints, and acceptance criteria.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, responsible-ai  
**Plays:** 01-enterprise-rag, 03-deterministic-agent  
**File:** [`fai-prd-writer.agent.md`](./fai-prd-writer.agent.md)

### `fai-product-manager`

**Name:** FAI Product Manager  
**Description:** AI product management specialist — requirements gathering, AI use case prioritization, evaluation metric design, go-to-market strategy, and responsible AI impact assessment.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, cost-optimization, operational-excellence  
**Plays:** 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-product-manager.agent.md`](./fai-product-manager.agent.md)

### `fai-production-patterns-expert`

**Name:** FAI Production Patterns Expert  
**Description:** Production AI patterns expert — hosting selection (Container Apps/AKS/Functions), APIM gateway patterns, streaming SSE, retry/circuit-breaker, health checks, and multi-region deployment for production AI workloads.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, performance-efficiency, cost-optimization, operational-excellence  
**Plays:** 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-production-patterns-expert.agent.md`](./fai-production-patterns-expert.agent.md)

### `fai-prompt-engineer`

**Name:** FAI Prompt Engineer  
**Description:** Prompt engineering specialist — system message design, few-shot patterns, chain-of-thought, structured output schemas, anti-hallucination techniques, and evaluation-driven prompt optimization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, responsible-ai, cost-optimization  
**Plays:** 18-prompt-optimization, 03-deterministic-agent  
**File:** [`fai-prompt-engineer.agent.md`](./fai-prompt-engineer.agent.md)

### `fai-protobuf-expert`

**Name:** FAI Protobuf Expert  
**Description:** Protocol Buffers specialist — proto3 schema design, backward compatible evolution, gRPC service definitions, code generation, and binary serialization for high-performance AI APIs.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, operational-excellence  
**Plays:** 07-multi-agent-service, 12-model-serving-aks  
**File:** [`fai-protobuf-expert.agent.md`](./fai-protobuf-expert.agent.md)

### `fai-python-expert`

**Name:** FAI Python Expert  
**Description:** Python development specialist — Python 3.12+, async/await patterns, Pydantic v2, FastAPI, pytest, type hints, Azure SDK, and production-grade AI application patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 01-enterprise-rag, 03-deterministic-agent  
**File:** [`fai-python-expert.agent.md`](./fai-python-expert.agent.md)

### `fai-python-mcp-expert`

**Name:** FAI Python MCP Expert  
**Description:** Python MCP server specialist — FastMCP framework, @mcp.tool() decorators, async handlers, Pydantic input models, uv deployment, and Azure service integration for AI tools.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 29-mcp-server, 01-enterprise-rag  
**File:** [`fai-python-mcp-expert.agent.md`](./fai-python-mcp-expert.agent.md)

### `fai-qwik-expert`

**Name:** FAI Qwik Expert  
**Description:** Qwik framework specialist — resumability (zero hydration), lazy loading, QwikCity routing, Island architecture, and instant-on AI-powered web applications.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 09-ai-search-portal  
**File:** [`fai-qwik-expert.agent.md`](./fai-qwik-expert.agent.md)

### `fai-rag-architect`

**Name:** FAI RAG Architect  
**Description:** Enterprise RAG architecture specialist — designs end-to-end retrieval-augmented generation pipelines with Azure AI Search, OpenAI embeddings, chunking strategies, grounding, citation, evaluation, and production deployment.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** security, reliability, cost-optimization, performance-efficiency  
**Plays:** 01-enterprise-rag, 21-agentic-rag  
**File:** [`fai-rag-architect.agent.md`](./fai-rag-architect.agent.md)

### `fai-rag-expert`

**Name:** FAI RAG Expert  
**Description:** RAG expert — advanced retrieval patterns (agentic, graph, multi-modal RAG), chunking strategies, hybrid search, re-ranking, evaluation metrics, and production RAG optimization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency, cost-optimization  
**Plays:** 01-enterprise-rag, 21-agentic-rag, 28-knowledge-graph  
**File:** [`fai-rag-expert.agent.md`](./fai-rag-expert.agent.md)

### `fai-ray-expert`

**Name:** FAI Ray Expert  
**Description:** Ray distributed computing specialist — Ray Serve for model serving, Ray Tune for hyperparameter optimization, Ray Data for preprocessing, and distributed training/inference at scale.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 12-model-serving-aks, 13-fine-tuning-workflow  
**File:** [`fai-ray-expert.agent.md`](./fai-ray-expert.agent.md)

### `fai-react-expert`

**Name:** FAI React Expert  
**Description:** React/Next.js specialist — React 19 Server Components, Suspense streaming for AI chat, App Router, Tailwind CSS, useActionState, and accessibility-first patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, security, responsible-ai  
**Plays:** 01-enterprise-rag, 09-ai-search-portal  
**File:** [`fai-react-expert.agent.md`](./fai-react-expert.agent.md)

### `fai-red-team-expert`

**Name:** FAI Red Team Expert  
**Description:** AI red teaming specialist — prompt injection testing, jailbreak simulation, PyRIT automation, bias detection, adversarial dataset creation, and OWASP LLM Top 10 validation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 41-red-team, 30-security-hardening  
**File:** [`fai-red-team-expert.agent.md`](./fai-red-team-expert.agent.md)

### `fai-redis-expert`

**Name:** FAI Redis Expert  
**Description:** Redis specialist — caching patterns (TTL, LRU), semantic cache for AI (embedding similarity), pub/sub messaging, Redis Streams, and session storage for chat applications.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 01-enterprise-rag, 14-cost-optimized-ai-gateway  
**File:** [`fai-redis-expert.agent.md`](./fai-redis-expert.agent.md)

### `fai-refactoring-expert`

**Name:** FAI Refactoring Expert  
**Description:** Code refactoring specialist — extract method, reduce cyclomatic complexity, improve testability, SOLID principles, design pattern application, and safe behavior-preserving transformations.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency  
**Plays:** 24-code-review, 32-test-automation  
**File:** [`fai-refactoring-expert.agent.md`](./fai-refactoring-expert.agent.md)

### `fai-remix-expert`

**Name:** FAI Remix Expert  
**Description:** Remix framework specialist — nested routing, loaders/actions, progressive enhancement, streaming SSR, error boundaries, and AI-integrated full-stack patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 09-ai-search-portal  
**File:** [`fai-remix-expert.agent.md`](./fai-remix-expert.agent.md)

### `fai-responsible-ai-reviewer`

**Name:** FAI Responsible AI Reviewer  
**Description:** Responsible AI specialist — bias detection, fairness metrics, transparency requirements, EU AI Act compliance, content safety, groundedness evaluation, and AI governance frameworks.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, security  
**Plays:** 60-responsible-ai, 10-content-moderation, 70-eu-ai-act  
**File:** [`fai-responsible-ai-reviewer.agent.md`](./fai-responsible-ai-reviewer.agent.md)

### `fai-ruby-expert`

**Name:** FAI Ruby Expert  
**Description:** Ruby 3.3+ specialist — pattern matching, Ractor concurrency, block DSL patterns, Rails 8, RuboCop standards, and AI API integration with httprb and ActiveJob.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 01-enterprise-rag  
**File:** [`fai-ruby-expert.agent.md`](./fai-ruby-expert.agent.md)

### `fai-ruby-mcp-expert`

**Name:** FAI Ruby MCP Expert  
**Description:** Ruby MCP server specialist — mcp-rb gem, block DSL tool definitions, Rails integration, idiomatic Ruby patterns, and stdio transport for AI tool development.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability  
**Plays:** 29-mcp-server  
**File:** [`fai-ruby-mcp-expert.agent.md`](./fai-ruby-mcp-expert.agent.md)

### `fai-rust-expert`

**Name:** FAI Rust Expert  
**Description:** Rust specialist — ownership/borrowing, async with tokio, serde serialization, error handling with thiserror/anyhow, and high-performance AI infrastructure (inference proxies, MCP servers).  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, performance-efficiency, reliability  
**Plays:** 12-model-serving-aks, 29-mcp-server  
**File:** [`fai-rust-expert.agent.md`](./fai-rust-expert.agent.md)

### `fai-rust-mcp-expert`

**Name:** FAI Rust MCP Expert  
**Description:** Rust MCP server specialist — rmcp SDK, tokio async handlers, proc macro tool registration, serde for schemas, and ultra-high-performance MCP tool serving.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, security  
**Plays:** 29-mcp-server  
**File:** [`fai-rust-mcp-expert.agent.md`](./fai-rust-mcp-expert.agent.md)

### `fai-salesforce-expert`

**Name:** FAI Salesforce Expert  
**Description:** Salesforce specialist — Apex development, Lightning Web Components, Flow automation, Einstein AI, and enterprise CRM integration patterns with Azure OpenAI.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security  
**Plays:** 55-crm-ai  
**File:** [`fai-salesforce-expert.agent.md`](./fai-salesforce-expert.agent.md)

### `fai-sap-expert`

**Name:** FAI SAP Expert  
**Description:** SAP integration specialist — SAP BTP, OData APIs, BAPI/RFC connectors, procurement/inventory/order processing, and AI-enhanced enterprise resource planning.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security, operational-excellence  
**Plays:** 55-crm-ai, 89-supply-chain  
**File:** [`fai-sap-expert.agent.md`](./fai-sap-expert.agent.md)

### `fai-security-reviewer`

**Name:** FAI Security Reviewer  
**Description:** Security reviewer — audits code, infrastructure, and AI pipelines against OWASP Top 10, OWASP LLM Top 10, Azure security baselines, managed identity compliance, network isolation, and secrets management.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, responsible-ai  
**Plays:** 30-security-hardening, 41-red-team  
**File:** [`fai-security-reviewer.agent.md`](./fai-security-reviewer.agent.md)

### `fai-semantic-kernel-expert`

**Name:** FAI Semantic Kernel Expert  
**Description:** Semantic Kernel specialist — plugins with function calling, KernelFilter middleware, memory/vector stores, agent group chat orchestration, and RAG pipeline patterns in C#/Python.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 01-enterprise-rag, 07-multi-agent-service  
**File:** [`fai-semantic-kernel-expert.agent.md`](./fai-semantic-kernel-expert.agent.md)

### `fai-seo-expert`

**Name:** FAI SEO Expert  
**Description:** SEO specialist — structured data (JSON-LD), Core Web Vitals optimization, AI-generated content SEO, meta tags, sitemap generation, and search engine visibility for AI-powered applications.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, operational-excellence  
**Plays:** 09-ai-search-portal  
**File:** [`fai-seo-expert.agent.md`](./fai-seo-expert.agent.md)

### `fai-servicenow-expert`

**Name:** FAI ServiceNow Expert  
**Description:** ServiceNow ITSM integration specialist — incident/change/request management via REST API, CMDB queries, knowledge base search, AI-powered ticket triage, and service catalog automation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security, operational-excellence  
**Plays:** 05-it-ticket-resolution, 54-itsm-automation  
**File:** [`fai-servicenow-expert.agent.md`](./fai-servicenow-expert.agent.md)

### `fai-slack-expert`

**Name:** FAI Slack Expert  
**Description:** Slack integration specialist — Bot API, Block Kit UI, slash commands, interactive modals, AI-powered conversation summarization, thread-based notifications, and incident war room automation.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, reliability  
**Plays:** 37-devops-agent, 05-it-ticket-resolution  
**File:** [`fai-slack-expert.agent.md`](./fai-slack-expert.agent.md)

### `fai-solid-expert`

**Name:** FAI Solid Expert  
**Description:** SolidJS specialist — fine-grained reactivity with signals, stores, createResource for AI data fetching, SolidStart SSR, and high-performance UI patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 09-ai-search-portal  
**File:** [`fai-solid-expert.agent.md`](./fai-solid-expert.agent.md)

### `fai-solutions-architect`

**Name:** FAI Solutions Architect  
**Description:** Cloud solutions architect — end-to-end AI solution design, Azure service selection, multi-service integration, cost estimation, WAF trade-off analysis, and architecture decision records.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal, azure  
**WAF:** reliability, cost-optimization, performance-efficiency, security  
**Plays:** 01-enterprise-rag, 02-ai-landing-zone  
**File:** [`fai-solutions-architect.agent.md`](./fai-solutions-architect.agent.md)

### `fai-specification-writer`

**Name:** FAI Specification Writer  
**Description:** Specification writer — generates AI-ready technical specifications with requirements, evaluation criteria, WAF alignment, API contracts, data models, and acceptance criteria.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**Plays:** 01-enterprise-rag, 03-deterministic-agent  
**File:** [`fai-specification-writer.agent.md`](./fai-specification-writer.agent.md)

### `fai-sql-server-expert`

**Name:** FAI SQL Server Expert  
**Description:** SQL Server specialist — on-premises SQL Server, Always On Availability Groups, query optimization with EXPLAIN, and structured data integration for AI pipelines (distinct from Azure SQL).  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency  
**Plays:** 05-it-ticket-resolution  
**File:** [`fai-sql-server-expert.agent.md`](./fai-sql-server-expert.agent.md)

### `fai-streaming-expert`

**Name:** FAI Streaming Expert  
**Description:** Real-time streaming specialist — SSE for LLM token delivery, WebSocket for bidirectional chat, ReadableStream API, backpressure handling, and Azure Event Hubs stream processing for AI pipelines.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 01-enterprise-rag, 04-call-center-voice-ai  
**File:** [`fai-streaming-expert.agent.md`](./fai-streaming-expert.agent.md)

### `fai-supabase-expert`

**Name:** FAI Supabase Expert  
**Description:** Supabase specialist — pgvector for AI embeddings, real-time subscriptions, Edge Functions (Deno), Row Level Security, Storage for documents, and Auth for user management in AI applications.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, security  
**Plays:** 01-enterprise-rag  
**File:** [`fai-supabase-expert.agent.md`](./fai-supabase-expert.agent.md)

### `fai-svelte-expert`

**Name:** FAI Svelte Expert  
**Description:** Svelte 5 specialist — runes ($state, $derived, $effect), SvelteKit routing, server load functions, streaming SSR, and minimal-bundle AI chat interfaces.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 09-ai-search-portal  
**File:** [`fai-svelte-expert.agent.md`](./fai-svelte-expert.agent.md)

### `fai-swarm-supervisor`

**Name:** FAI Swarm Supervisor  
**Description:** Multi-agent swarm supervisor — routes tasks to specialist agents, manages turn limits and token budgets, handles agent coordination, conflict resolution, and synthesizes multi-perspective results.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, cost-optimization  
**Plays:** 07-multi-agent-service, 22-swarm-orchestration  
**File:** [`fai-swarm-supervisor.agent.md`](./fai-swarm-supervisor.agent.md)

### `fai-swift-expert`

**Name:** FAI Swift Expert  
**Description:** Swift specialist — structured concurrency (async/await, TaskGroup, actors), SwiftUI, Codable, and Apple platform AI integration with on-device Core ML and cloud Azure OpenAI.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 34-mobile-ai, 44-edge-inference  
**File:** [`fai-swift-expert.agent.md`](./fai-swift-expert.agent.md)

### `fai-swift-mcp-expert`

**Name:** FAI Swift MCP Expert  
**Description:** Swift MCP server specialist — actors for concurrency, Codable for JSON Schema, async/await handlers, and Apple platform MCP tool development.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency  
**Plays:** 29-mcp-server  
**File:** [`fai-swift-mcp-expert.agent.md`](./fai-swift-mcp-expert.agent.md)

### `fai-tdd-green`

**Name:** FAI TDD Green  
**Description:** TDD Green phase specialist — writes the minimal implementation to make failing tests pass, no more and no less. Follows the Red-Green-Refactor cycle.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability  
**File:** [`fai-tdd-green.agent.md`](./fai-tdd-green.agent.md)

### `fai-tdd-red`

**Name:** FAI TDD Red  
**Description:** TDD Red phase specialist — writes failing tests from requirements before any implementation. Covers happy path, error cases, edge cases, and AI-specific test scenarios.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability  
**File:** [`fai-tdd-red.agent.md`](./fai-tdd-red.agent.md)

### `fai-tdd-refactor`

**Name:** FAI TDD Refactor  
**Description:** TDD Refactor phase specialist — improves code quality while keeping ALL tests green. Applies extract method, reduce complexity, improve naming, and design pattern introduction.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, performance-efficiency  
**File:** [`fai-tdd-refactor.agent.md`](./fai-tdd-refactor.agent.md)

### `fai-teams-expert`

**Name:** FAI Teams Expert  
**Description:** Microsoft Teams integration specialist — Adaptive Cards, Bot Framework SDK, Graph API for channels/chats/meetings, AI-powered meeting summarization, and action item extraction.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, security  
**Plays:** 08-copilot-studio-bot, 16-copilot-teams-extension  
**File:** [`fai-teams-expert.agent.md`](./fai-teams-expert.agent.md)

### `fai-tech-debt-analyst`

**Name:** FAI Tech Debt Analyst  
**Description:** Tech debt analyst — identifies, quantifies, and prioritizes technical debt with cost-of-delay analysis, remediation plans, and sprint allocation recommendations.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, reliability  
**Plays:** 24-code-review, 32-test-automation  
**File:** [`fai-tech-debt-analyst.agent.md`](./fai-tech-debt-analyst.agent.md)

### `fai-technical-writer`

**Name:** FAI Technical Writer  
**Description:** Technical documentation specialist — Diátaxis framework (tutorials/how-to/reference/explanation), API documentation, architecture docs, Mermaid diagrams, and README standards for AI systems.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence  
**Plays:** 01-enterprise-rag  
**File:** [`fai-technical-writer.agent.md`](./fai-technical-writer.agent.md)

### `fai-temporal-expert`

**Name:** FAI Temporal Expert  
**Description:** Temporal workflow orchestration specialist — durable execution, saga patterns, long-running AI workflows, activity retry policies, timeouts, and distributed task scheduling.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 07-multi-agent-service, 06-document-intelligence  
**File:** [`fai-temporal-expert.agent.md`](./fai-temporal-expert.agent.md)

### `fai-terraform-expert`

**Name:** FAI Terraform Expert  
**Description:** Terraform specialist — Azure provider, state management, module design, plan/apply workflow, drift detection, and multi-environment infrastructure deployment.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, reliability, security  
**Plays:** 02-ai-landing-zone  
**File:** [`fai-terraform-expert.agent.md`](./fai-terraform-expert.agent.md)

### `fai-test-generator`

**Name:** FAI Test Generator  
**Description:** Test generation specialist — creates unit, integration, and E2E tests across Python (pytest), TypeScript (vitest), C# (xUnit), with AI-specific test patterns (groundedness, safety, streaming).  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability  
**Plays:** 32-test-automation  
**File:** [`fai-test-generator.agent.md`](./fai-test-generator.agent.md)

### `fai-test-planner`

**Name:** FAI Test Planner  
**Description:** Test planning specialist — designs test strategy, identifies coverage gaps, prioritizes test types (unit/integration/E2E/AI eval), and creates test plans with risk-based prioritization.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 32-test-automation  
**File:** [`fai-test-planner.agent.md`](./fai-test-planner.agent.md)

### `fai-test-runner`

**Name:** FAI Test Runner  
**Description:** Test execution specialist — runs test suites, interprets results, identifies flaky tests, diagnoses failures, and reports coverage with actionable recommendations.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** reliability, operational-excellence  
**Plays:** 32-test-automation  
**File:** [`fai-test-runner.agent.md`](./fai-test-runner.agent.md)

### `fai-turso-expert`

**Name:** FAI Turso Expert  
**Description:** Turso specialist — libSQL (SQLite fork), edge replication, embedded vector search, multi-tenant databases, and low-latency AI data patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, cost-optimization  
**Plays:** 01-enterprise-rag  
**File:** [`fai-turso-expert.agent.md`](./fai-turso-expert.agent.md)

### `fai-typescript-expert`

**Name:** FAI TypeScript Expert  
**Description:** TypeScript/Node.js specialist — strict mode, Zod validation, ESM modules, Vitest testing, Azure SDK integration, async patterns, and production-ready AI application development.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 01-enterprise-rag, 29-mcp-server  
**File:** [`fai-typescript-expert.agent.md`](./fai-typescript-expert.agent.md)

### `fai-typescript-mcp-expert`

**Name:** FAI TypeScript MCP Expert  
**Description:** TypeScript MCP server specialist — @modelcontextprotocol/sdk, McpServer class, Zod schema validation, async tool handlers, stdio/SSE transport, and npm distribution.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** security, reliability, performance-efficiency  
**Plays:** 29-mcp-server, 01-enterprise-rag  
**File:** [`fai-typescript-mcp-expert.agent.md`](./fai-typescript-mcp-expert.agent.md)

### `fai-ux-designer`

**Name:** FAI UX Designer  
**Description:** AI UX designer — conversation design patterns, chatbot interaction flows, AI disclosure/transparency, loading states for streaming, confidence display, and accessibility for AI interfaces.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** responsible-ai, performance-efficiency  
**Plays:** 01-enterprise-rag, 09-ai-search-portal  
**File:** [`fai-ux-designer.agent.md`](./fai-ux-designer.agent.md)

### `fai-vector-database-expert`

**Name:** FAI Vector Database Expert  
**Description:** Vector database specialist — HNSW vs IVFFlat index selection, embedding storage with Qdrant/Pinecone/pgvector/Azure AI Search, similarity metrics, and performance tuning for RAG retrieval.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 01-enterprise-rag, 21-agentic-rag  
**File:** [`fai-vector-database-expert.agent.md`](./fai-vector-database-expert.agent.md)

### `fai-vercel-expert`

**Name:** FAI Vercel Expert  
**Description:** Vercel specialist — AI SDK (streaming useChat/useCompletion), Edge Functions, Next.js deployment, KV/Blob/Postgres storage, and serverless AI application patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, operational-excellence  
**Plays:** 01-enterprise-rag, 09-ai-search-portal  
**File:** [`fai-vercel-expert.agent.md`](./fai-vercel-expert.agent.md)

### `fai-vue-expert`

**Name:** FAI Vue Expert  
**Description:** Vue.js 3 specialist — Composition API with script setup, Pinia state management, Nuxt 3 SSR/SSG, reactive streaming for AI chat, and TypeScript-first component patterns.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, reliability  
**Plays:** 09-ai-search-portal  
**File:** [`fai-vue-expert.agent.md`](./fai-vue-expert.agent.md)

### `fai-wandb-expert`

**Name:** FAI W&B Expert  
**Description:** Weights & Biases specialist — experiment tracking, model versioning, hyperparameter sweeps, prompt tracing, evaluation dashboards, and LLM fine-tuning monitoring.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** operational-excellence, performance-efficiency  
**Plays:** 13-fine-tuning-workflow, 18-prompt-optimization  
**File:** [`fai-wandb-expert.agent.md`](./fai-wandb-expert.agent.md)

### `fai-wasm-expert`

**Name:** FAI WASM Expert  
**Description:** WebAssembly specialist — WASI preview 2, Component Model, edge AI inference with Spin/Fermyon, Wasmtime runtime, and portable, sandboxed AI model execution.  
**Model:** gpt-4o, gpt-4o-mini  
**Tools:** codebase, terminal  
**WAF:** performance-efficiency, security  
**Plays:** 19-edge-ai, 44-edge-inference  
**File:** [`fai-wasm-expert.agent.md`](./fai-wasm-expert.agent.md)

---
*Generated 2026-05-02 from `agents/` via `scripts/generate-agents-md.js`.*
