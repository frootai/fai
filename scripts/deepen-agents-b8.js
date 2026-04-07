const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(70, 80);
const expertiseMap = {
    "kubernetes-expert": [
        "- **AKS Management**: Node pool design (system/user/GPU), upgrade strategies, maintenance windows, cluster autoscaler, KEDA",
        "- **Workload Design**: Pod specs, resource requests/limits, QoS classes, priority classes, pod disruption budgets, affinity/anti-affinity",
        "- **Networking**: Ingress controllers (NGINX/Envoy), service mesh (Istio/Linkerd), network policies, Azure CNI overlay, internal LB",
        "- **Storage**: PV/PVC, storage classes, Azure Disk CSI, Azure Files CSI, ephemeral volumes, volume snapshots",
        "- **Security**: Pod security standards, workload identity, RBAC (cluster/namespace), network policies, secrets management (CSI driver)",
        "- **GPU Workloads**: NVIDIA device plugin, GPU node pools (NC/ND), MIG partitioning, GPU sharing, vLLM/TGI on Kubernetes",
        "- **Observability**: Prometheus + Grafana, Container Insights, custom metrics, HPA on custom metrics, distributed tracing",
        "- **GitOps**: ArgoCD/Flux, Helm chart management, Kustomize overlays, environment promotion, drift detection, rollback",
        "- **Scaling**: HPA (CPU/memory/custom), VPA, cluster autoscaler, KEDA event-driven scaling, node auto-provisioning",
        "- **Troubleshooting**: kubectl debug, ephemeral containers, log aggregation, event analysis, node/pod resource diagnosis",
    ],
    "landing-zone": [
        "- **Hub-Spoke Topology**: Central hub VNet, spoke peering, shared services (DNS/firewall/bastion), transit routing",
        "- **Identity Foundation**: Entra ID tenant, management groups, subscription vending, RBAC inheritance, PIM for admin access",
        "- **Network Security**: Azure Firewall Premium, NSG/ASG layering, DDoS Protection, private DNS zones, service endpoints vs PE",
        "- **Governance**: Azure Policy initiatives (CIS/NIST), compliance dashboards, remediation tasks, exemption management",
        "- **GPU Quota**: Regional GPU quota management, cross-subscription allocation, quota increase automation, capacity reservations",
        "- **Cost Management**: Budget alerts per subscription, cost allocation tags, advisor recommendations, savings plans, reservations",
        "- **Monitoring**: Central Log Analytics workspace, diagnostic settings enforcement, sentinel integration, network flow logs",
        "- **Disaster Recovery**: Multi-region architecture, failover automation, RPO/RTO targets, backup policies, geo-replication",
        "- **Compliance**: Regulatory compliance (SOC2/HIPAA/PCI), audit evidence automation, continuous compliance monitoring",
        "- **AI-Specific**: Cognitive Services private endpoints, OpenAI quota per subscription, GPU node pool reservations, model storage",
    ],
    "llm-landscape-expert": [
        "- **OpenAI Models**: GPT-4o (128K, multimodal), GPT-4.1 (1M context), GPT-4o-mini (fast/cheap), o1/o3 (reasoning), Codex",
        "- **Open Source Models**: Meta Llama 3.1 (8B/70B/405B), Mistral (7B/8x7B), Phi-4 (3.8B SLM), Qwen, DeepSeek, Gemma",
        "- **Azure AI Model Catalog**: Managed online endpoints, serverless API (pay-per-token), model benchmarking, A/B deployment",
        "- **Model Selection Framework**: Quality vs cost vs latency matrix, task-specific benchmarks, context window needs, multimodal reqs",
        "- **Evaluation Benchmarks**: MMLU, HumanEval, HellaSwag, MT-Bench, LMSYS Chatbot Arena, custom domain benchmarks",
        "- **Emerging Capabilities**: Tool use/function calling, vision (image understanding), audio (speech-to-text), code generation",
        "- **Quantization**: GPTQ, AWQ, GGUF, bitsandbytes — impact on quality/speed/memory, when to quantize vs full precision",
        "- **Serving Engines**: vLLM (PagedAttention), TGI (Hugging Face), Triton, ONNX Runtime, Azure AI Model Inference API",
        "- **Pricing Models**: Pay-per-token, PTU (Provisioned Throughput), reserved capacity, batch API discounts, global deployments",
        "- **Frontier Trends**: Mixture-of-experts, state-space models (Mamba), multi-agent reasoning, long-context (1M+), agentic AI",
    ],
    "markdown-expert": [
        "- **GitHub Flavored Markdown**: Tables, task lists, footnotes, alerts/callouts, Mermaid diagrams, math (LaTeX), autolinks",
        "- **Documentation Standards**: README structure, API docs, ADRs, changelog format, contributing guide, code of conduct",
        "- **Agent Markup**: .agent.md YAML frontmatter, .instructions.md with applyTo, SKILL.md step format, .prompt.md slash commands",
        "- **Diagram Generation**: Mermaid (flowchart/sequence/class/ER/gantt), PlantUML, D2, diagram-as-code in documentation",
        "- **Static Site Generators**: Docusaurus, MkDocs, VitePress, Astro — Markdown-first documentation sites with search and versioning",
        "- **Linting**: markdownlint rules, vale prose linting, consistent heading levels, link checking, spelling, writing style",
        "- **Templating**: Mustache/Handlebars in Markdown, variable substitution, conditional sections, include patterns",
        "- **Accessibility**: Alt text for images, heading hierarchy, table headers, link text (not 'click here'), language attributes",
        "- **Publishing**: GitHub Pages, Azure Static Web Apps, PDF generation (Pandoc), slide generation (Marp), ebook (mdbook)",
        "- **AI Documentation**: Prompt documentation, evaluation report format, model card template, dataset card, API reference from OpenAPI",
    ],
    "mcp-expert": [
        "- **MCP Protocol**: Model Context Protocol specification, JSON-RPC 2.0, stdio/SSE transport, tool/resource/prompt primitives",
        "- **Tool Design**: Tool definition schema (name/description/parameters), handler implementation, error response format, streaming",
        "- **Server Implementation**: Node.js (frootai-mcp), Python (frootai-mcp), C# (Semantic Kernel), Go, Kotlin — multi-language ecosystem",
        "- **Client Integration**: VS Code (.vscode/mcp.json), Claude Desktop, Cursor, Windsurf, GitHub Copilot, Azure AI Foundry",
        "- **Gateway Patterns**: MCP proxy (APIM), multi-server routing, rate limiting per tool, auth (OAuth2/API key), usage analytics",
        "- **FrootAI MCP**: 25 tools — search_knowledge, get_module, estimate_cost, compare_models, agent_build/review/tune, semantic_search_plays, list_primitives, get_play_detail",
        "- **Security**: Tool permission scoping, input validation, output sanitization, audit logging, credential management, sandboxing",
        "- **Testing**: Tool handler unit tests, protocol conformance tests, integration tests, performance benchmarks, chaos testing",
        "- **Deployment**: npm package, Docker container, AKS sidecar, Azure Container Apps, GitHub Codespaces devcontainer",
        "- **Ecosystem**: A2A (Agent-to-Agent), AG-UI (rendering), FAI Protocol (wiring) — MCP handles tool calling in the unified stack",
    ],
    "mentoring-agent": [
        "- **Learning Path Design**: Skill assessment → gap analysis → personalized curriculum → milestone tracking → certification",
        "- **Socratic Teaching**: Question-driven learning, guided discovery, hints before answers, scaffolded complexity, productive struggle",
        "- **Code Review Mentoring**: Constructive feedback patterns, explain why not just what, progressive difficulty, pairing suggestions",
        "- **Knowledge Assessment**: Adaptive questioning, Bloom's taxonomy levels, spaced repetition scheduling, mastery thresholds",
        "- **Career Development**: Technology skill mapping, industry trend guidance, portfolio building, interview preparation, soft skills",
        "- **AI Literacy**: Explaining LLM concepts, prompt engineering training, responsible AI awareness, tool selection guidance",
        "- **Feedback Patterns**: Sandwich method, specific + actionable, growth mindset language, celebrate progress, normalize mistakes",
        "- **FrootAI Onboarding**: Solution play walkthrough, DevKit/TuneKit/SpecKit orientation, agent chain understanding, MCP tool training",
        "- **Progress Tracking**: Skill matrix visualization, learning velocity, completion rates, engagement metrics, difficulty calibration",
        "- **Accessibility**: Multi-modal content delivery (text/audio/visual), pace adaptation, language simplification, cultural sensitivity",
    ],
    "mermaid-diagram-expert": [
        "- **Flowcharts**: Direction (TB/LR/BT/RL), node shapes, edge styles, subgraphs, click interactions, styling with classes",
        "- **Sequence Diagrams**: Participants, messages (sync/async), activation bars, loops, alt/opt/par fragments, notes",
        "- **Class Diagrams**: Classes, relationships (inheritance/composition/aggregation), multiplicity, methods, access modifiers",
        "- **Entity-Relationship**: Entities, relationships (one-to-many/many-to-many), attributes, primary/foreign keys, cardinality",
        "- **Architecture Diagrams**: C4 model (context/container/component/code), Azure service icons, deployment views, data flow",
        "- **Gantt Charts**: Tasks, milestones, dependencies, critical path, sections, date formatting, exclusions (weekends)",
        "- **State Diagrams**: States, transitions, guards, actions, composite states, fork/join, history states",
        "- **Git Graphs**: Branches, commits, merges, cherry-picks, tags — visualizing branching strategies",
        "- **AI Architecture Diagrams**: RAG pipeline flows, agent chain visualization, MCP tool topology, FAI Protocol wiring",
        "- **Integration**: GitHub Markdown rendering, Docusaurus, MkDocs, VS Code preview, Azure DevOps wiki, Notion, Confluence",
    ],
    "migration-expert": [
        "- **Cloud Migration**: Lift-and-shift, re-platform, re-architect, retire, retain — 6R framework for decision-making",
        "- **Azure Migrate**: Discovery, assessment, dependency mapping, cost estimation, migration waves, validation testing",
        "- **Database Migration**: Azure Database Migration Service, schema conversion, data migration, cutover planning, validation",
        "- **Containerization**: App Containerization tool, Dockerfile creation, AKS migration, registry setup, CI/CD adaptation",
        "- **AI Workload Migration**: Model format conversion (ONNX), endpoint migration, API compatibility, latency validation",
        "- **Data Migration**: Azure Data Box, AzCopy, Data Factory, incremental sync, validation checksums, zero-downtime patterns",
        "- **Identity Migration**: Entra ID integration, SSO migration, permission mapping, group synchronization, conditional access",
        "- **Network Migration**: VPN/ExpressRoute setup, DNS migration, traffic routing, hybrid connectivity, peering configuration",
        "- **Testing Strategy**: Parallel run, smoke tests, load tests, rollback plan, data validation, user acceptance testing",
        "- **Cutover Planning**: Go-live checklist, communication plan, war room setup, rollback triggers, post-migration monitoring",
    ],
    "ml-engineer": [
        "- **Azure Machine Learning**: Workspace management, compute targets, environments, datasets, experiments, model registry",
        "- **Training Pipelines**: Azure ML pipelines, component-based workflows, hyperparameter sweeps, distributed training (DeepSpeed/FSDP)",
        "- **Feature Engineering**: Feature store, online/offline features, embedding features, temporal features, feature monitoring",
        "- **Model Evaluation**: Classification/regression metrics, fairness assessment, explainability (SHAP/LIME), benchmark suites",
        "- **MLOps**: CI/CD for ML (Azure DevOps/GitHub Actions), model versioning, A/B deployment, monitoring, drift detection",
        "- **Responsible ML**: Fairness constraints, datasheets, model cards, bias testing, privacy (differential privacy), explainability",
        "- **LLM Fine-Tuning**: LoRA/QLoRA, Azure OpenAI fine-tuning, training data preparation, evaluation, deployment, cost analysis",
        "- **Vector Operations**: Embedding generation, vector index building, similarity search, hybrid retrieval, reranking pipelines",
        "- **Compute Optimization**: GPU selection (A100/H100), spot instances, auto-termination, cluster policies, cost tracking",
        "- **Monitoring**: Data drift detection, model performance degradation, prediction confidence tracking, retraining triggers",
    ],
    "mongodb-expert": [
        "- **Azure Cosmos DB MongoDB vCore**: Wire protocol compatibility, vector search (HNSW), aggregation pipeline, change streams",
        "- **Schema Design**: Document modeling, embedding vs referencing, denormalization patterns, bucket pattern, schema versioning",
        "- **Indexing**: Single-field, compound, multikey, text, geospatial, wildcard, vector (HNSW), TTL indexes, partial indexes",
        "- **Aggregation Pipeline**: $match, $group, $lookup, $unwind, $facet, $graphLookup, $merge, computed fields, optimizations",
        "- **Transactions**: Multi-document ACID transactions, session management, retry patterns, write concern, read concern levels",
        "- **Performance**: Explain plans, slow query log, connection pooling, read preference (primary/secondary), query optimization",
        "- **Security**: Authentication (SCRAM/x.509), RBAC, field-level encryption, audit logging, network access (VNet/private endpoint)",
        "- **High Availability**: Replica set configuration, auto-failover, read preference routing, zone-aware sharding",
        "- **AI Integration**: Vector search for RAG, embedding storage, document chunking, change stream for real-time AI pipelines",
        "- **Migration**: Atlas to Cosmos DB vCore, mongoose compatibility, driver configuration, query compatibility testing",
    ],
};
console.log("═══ Section 26 B8: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B8 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
