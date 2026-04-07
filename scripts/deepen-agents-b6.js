const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(50, 60);

const expertiseMap = {
    "devops-expert": [
        "- **GitHub Actions**: OIDC federation to Azure, reusable workflows, composite actions, matrix strategy, concurrency groups, caching",
        "- **Azure DevOps**: YAML multi-stage pipelines, service connections (workload identity), variable groups, deployment jobs, gates",
        "- **Infrastructure as Code**: Bicep modules, Terraform providers, Pulumi (TypeScript), drift detection, state management, blast radius",
        "- **Container Orchestration**: AKS operations, Helm chart management, Flux/ArgoCD GitOps, image scanning (Trivy), registry management",
        "- **Incident Management**: PagerDuty/Opsgenie integration, severity classification (P0-P4), runbook automation, blameless post-mortems",
        "- **DORA Metrics**: Deployment frequency, lead time for changes, MTTR, change failure rate — measurement and improvement strategies",
        "- **GitOps**: Repository structure, environment promotion (dev→staging→prod), PR-based deployments, configuration management",
        "- **Monitoring**: Azure Monitor, Grafana dashboards, Prometheus metrics, SLO/SLI definition, error budget tracking, alert fatigue reduction",
        "- **Security Pipeline**: SAST (CodeQL), DAST (OWASP ZAP), SCA (dependency audit), container scanning, SBOM generation, signing",
        "- **Release Engineering**: Semantic versioning, changelog generation, release branching, hotfix workflows, feature flags (LaunchDarkly/App Config)",
    ],
    "docker-expert": [
        "- **Multi-Stage Builds**: Builder pattern, distroless base images, minimized attack surface, layer caching optimization, BuildKit features",
        "- **Image Security**: Non-root user, read-only filesystem, no SUID binaries, Trivy scanning, Snyk container, image signing (cosign)",
        "- **Compose & Orchestration**: Docker Compose for local dev, volume mounts, network isolation, health checks, GPU passthrough (NVIDIA)",
        "- **Registry Management**: Azure Container Registry (ACR), geo-replication, immutable tags, vulnerability scanning, retention policies",
        "- **Performance**: Layer optimization (most-changed last), .dockerignore, cache mounts, BuildKit parallel stages, slim base images",
        "- **AI Workloads**: CUDA base images, NVIDIA container toolkit, model weights as build args, ONNX runtime containers, multi-arch (ARM64)",
        "- **Networking**: Bridge/host/overlay networks, DNS resolution, port mapping, container-to-container communication, service discovery",
        "- **Storage**: Named volumes, bind mounts, tmpfs for ephemeral data, volume drivers, backup strategies, persistent data patterns",
        "- **CI/CD Integration**: GitHub Actions docker/build-push-action, ACR build tasks, Azure Pipelines container jobs, caching strategies",
        "- **Dev Containers**: .devcontainer configuration, VS Code Remote Containers, GitHub Codespaces, features, post-create commands",
    ],
    "dotnet-maui-expert": [
        "- **.NET MAUI Architecture**: Multi-platform (iOS/Android/Windows/macOS), single project, platform-specific code, dependency injection",
        "- **UI Design**: XAML layouts, data binding, MVVM pattern, Shell navigation, custom renderers, platform-specific styling",
        "- **AI Integration**: On-device inference (ONNX Runtime Mobile), Azure OpenAI SDK for mobile, offline-first with cloud sync",
        "- **Native APIs**: Camera, GPS, biometrics, notifications, Bluetooth, NFC, file system access via platform abstractions",
        "- **Performance**: AOT compilation, trimming, startup optimization, memory management, image caching, lazy loading",
        "- **Testing**: xUnit + device runners, Appium for UI automation, screenshot testing, mock services, test clouds (App Center)",
        "- **Security**: Secure storage, certificate pinning, biometric auth, MSAL authentication, data protection, code obfuscation",
        "- **Deployment**: App Store/Play Store publishing, enterprise distribution, CI/CD with GitHub Actions, versioning, code signing",
        "- **Connectivity**: REST/gRPC APIs, SignalR for real-time, offline-first with SQLite, sync frameworks, background tasks",
        "- **Hybrid**: Blazor Hybrid (web + native), WebView integration, JavaScript interop, shared UI logic between web and mobile",
    ],
    "elasticsearch-expert": [
        "- **Index Design**: Mappings (keyword vs text), analyzers (standard/custom), tokenizers, multi-field mapping, dynamic templates",
        "- **Search Queries**: Bool queries, function_score, multi_match, nested/parent-child, aggregations, highlighting, suggestors",
        "- **Vector Search**: Dense vector fields, kNN search, HNSW algorithm, hybrid search (BM25 + kNN), approximate vs exact",
        "- **Cluster Management**: Shard allocation, replica configuration, node roles (master/data/ingest), cluster health, rolling upgrades",
        "- **Performance**: Index lifecycle management (ILM), snapshot/restore, shard sizing (10-50GB), query optimization, caching",
        "- **AI Integration**: Embedding storage and search, semantic search patterns, RAG with Elasticsearch, ML inference pipelines",
        "- **Security**: TLS encryption, RBAC, field-level security, audit logging, API key management, SAML/OIDC integration",
        "- **Observability**: Kibana dashboards, index monitoring, slow log analysis, search profiler, cluster stats, alerting",
        "- **Azure Deployment**: Elastic Cloud on Azure, self-managed on AKS, Azure Private Link, backup to Blob Storage",
        "- **Migration**: Azure AI Search migration path, index mapping conversion, query syntax translation, performance benchmarking",
    ],
    "embedding-expert": [
        "- **Azure OpenAI Embeddings**: text-embedding-3-large (3072 dim), text-embedding-3-small (1536 dim), batch API (16 per call)",
        "- **Dimensionality**: Full vs reduced dimensions (matryoshka), dimension selection for cost/quality tradeoff, PCA alternatives",
        "- **Chunking for Embeddings**: Sentence-window, recursive character, semantic chunking, overlap strategies, metadata preservation",
        "- **Vector Databases**: Azure AI Search (HNSW), Cosmos DB (DiskANN), Elasticsearch, Qdrant, Pinecone — selection criteria",
        "- **Similarity Metrics**: Cosine similarity, dot product, Euclidean distance, max inner product — when to use which",
        "- **Hybrid Search**: BM25 keyword + vector fusion, Reciprocal Rank Fusion (RRF), weighted combination, reranking",
        "- **Fine-Tuning Embeddings**: Matryoshka training, domain adaptation, contrastive learning, synthetic training data generation",
        "- **Performance**: Batch embedding generation, parallel processing, caching (memoization), incremental indexing, update strategies",
        "- **Evaluation**: Recall@k, MRR, NDCG, embedding quality benchmarks (MTEB), A/B testing different models, human evaluation",
        "- **Cost Optimization**: Model selection (3-large vs 3-small), dimension reduction, batch size optimization, caching for repeated docs",
    ],
    "epic-breakdown-expert": [
        "- **Story Mapping**: User journey decomposition, epic → feature → story → task hierarchy, value stream mapping, MVP identification",
        "- **INVEST Criteria**: Independent, Negotiable, Valuable, Estimable, Small, Testable — applied to every user story",
        "- **AI-Specific Epics**: RAG pipeline setup, model evaluation, guardrail configuration, deployment pipeline, monitoring setup",
        "- **Estimation**: Story points (Fibonacci), T-shirt sizing, three-point estimation, historical velocity, Monte Carlo simulation",
        "- **Prioritization**: MoSCoW method, WSJF (Weighted Shortest Job First), RICE scoring, impact/effort matrix, dependency mapping",
        "- **Sprint Planning**: Capacity-based planning, velocity forecasting, sprint goal definition, stretch items, acceptance criteria",
        "- **Technical Debt Tracking**: Debt classification (deliberate/inadvertent), debt backlog, payoff sprints, quality metrics impact",
        "- **Acceptance Criteria**: Given/When/Then format, measurable outcomes, edge cases, non-functional requirements, done definition",
        "- **Dependency Management**: Cross-team dependencies, integration points, API contracts, critical path analysis, risk mitigation",
        "- **Reporting**: Burndown/burnup charts, cumulative flow, cycle time, lead time, velocity trends, sprint retrospective actions",
    ],
    "event-driven-expert": [
        "- **Azure Event Hubs**: Partitioned streaming, consumer groups, checkpointing, capture to ADLS, Kafka protocol compatibility",
        "- **Azure Service Bus**: Queues with sessions, topics with filters, dead-letter processing, scheduled messages, duplicate detection",
        "- **Azure Event Grid**: System topics, custom topics, event filtering, CloudEvents schema, webhook/Function/Queue destinations",
        "- **Patterns**: Event sourcing, CQRS, saga/choreography, competing consumers, publish-subscribe, claim check for large payloads",
        "- **Schema Management**: Schema registry (Avro/JSON), schema evolution (forward/backward compatibility), contract-first design",
        "- **Exactly-Once Semantics**: Idempotent consumers, deduplication, transactional outbox, Debezium CDC, at-least-once processing",
        "- **Error Handling**: Dead-letter queues, poison message routing, retry policies (exponential backoff), compensation actions",
        "- **AI Event Patterns**: Real-time LLM inference on event streams, embedding on ingest, anomaly scoring pipeline, sentiment streaming",
        "- **Monitoring**: Event throughput, consumer lag, partition distribution, dead-letter depth, Azure Monitor + custom KQL dashboards",
        "- **Testing**: Event producer/consumer unit tests, integration tests with Testcontainers, chaos testing, load testing event pipelines",
    ],
    "fine-tuning-expert": [
        "- **Azure OpenAI Fine-Tuning**: GPT-4o-mini fine-tuning, training file format (JSONL), hyperparameter selection, evaluation, deployment",
        "- **LoRA/QLoRA**: Low-rank adaptation, quantization-aware training, adapter merging, multi-LoRA serving, adapter composition",
        "- **Data Preparation**: Training data quality assessment, deduplication, PII removal, format validation, train/val/test splitting",
        "- **Hyperparameter Tuning**: Learning rate (1e-5 to 5e-4), epochs (1-5), batch size, warmup steps, weight decay, LoRA rank (8-64)",
        "- **Evaluation Metrics**: Perplexity, BLEU, ROUGE, custom domain metrics, human evaluation, A/B testing against base model",
        "- **MLflow Integration**: Experiment tracking, model registry, metric logging, artifact management, model versioning, deployment",
        "- **Compute Management**: GPU selection (A100/H100), spot instances for training, checkpoint/resume, distributed training (DeepSpeed)",
        "- **Safety in Fine-Tuning**: Avoiding catastrophic forgetting, safety alignment preservation, red team evaluation post fine-tune",
        "- **Deployment**: Model deployment on Azure OpenAI, AKS with vLLM, A/B canary release, rollback on quality regression",
        "- **Cost**: Training cost estimation, token pricing, compute vs quality tradeoff, when NOT to fine-tune (few-shot may suffice)",
    ],
    "genai-foundations-expert": [
        "- **Transformer Architecture**: Attention mechanism (self/cross/multi-head), positional encoding, layer normalization, FFN blocks",
        "- **Model Types**: Decoder-only (GPT), encoder-only (BERT), encoder-decoder (T5), mixture-of-experts (Mixtral), state-space (Mamba)",
        "- **Tokenization**: BPE, SentencePiece, tiktoken, token counting, context window management, prompt compression techniques",
        "- **Inference Optimization**: KV cache, speculative decoding, continuous batching, PagedAttention (vLLM), quantization (GPTQ/AWQ)",
        "- **Prompt Engineering**: System messages, few-shot learning, chain-of-thought, ReAct, structured output, meta-prompting",
        "- **Evaluation**: MMLU, HumanEval, HellaSwag, MT-Bench, custom benchmarks, human eval, LLM-as-judge, Chatbot Arena Elo",
        "- **Safety & Alignment**: RLHF, DPO, constitutional AI, red teaming, content safety, jailbreak defense, output filtering",
        "- **Azure AI Model Catalog**: OpenAI models, Meta Llama, Mistral, Phi-4, Cohere — comparison by quality/cost/latency/context",
        "- **Scaling Laws**: Compute-optimal training (Chinchilla), data quality vs quantity, diminishing returns, small vs large model tradeoff",
        "- **Emerging Patterns**: Tool use/function calling, multi-modal (vision+text), agent frameworks, reasoning chains (o1/o3), long context",
    ],
    "git-workflow-expert": [
        "- **Branching Strategies**: Trunk-based development, GitHub Flow, GitFlow, release branching — when to use which for AI projects",
        "- **Conventional Commits**: fix/feat/chore/docs/refactor/test/perf prefixes, scope, breaking changes, automated changelog generation",
        "- **PR Best Practices**: Small focused PRs (<400 lines), descriptive titles, linked issues, review checklist, draft PRs for WIP",
        "- **Code Review**: Review etiquette, blocking vs advisory comments, LGTM criteria, requesting changes, re-review workflow",
        "- **Merge Strategies**: Squash merge (clean history), rebase (linear), merge commit (preserves context), fast-forward only",
        "- **Branch Protection**: Required reviews, status checks, signed commits, linear history, dismissal on push, CODEOWNERS",
        "- **Git Hooks**: Pre-commit (linting/formatting), commit-msg (conventional commits), pre-push (tests), husky + lint-staged",
        "- **Monorepo Management**: Nx/Turborepo workspace, affected analysis, selective CI, package publishing, dependency graph",
        "- **Release Management**: Semantic versioning, release branches, hotfix workflow, tag-based deployment, release-please automation",
        "- **AI Project Git**: Large model files (Git LFS), config versioning, prompt versioning, evaluation result tracking, data versioning (DVC)",
    ],
};

console.log("═══ Section 26 B6: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B6 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
