const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(20, 30);

const expertiseMap = {
    "azure-logic-apps-expert": [
        "- **Workflow Design**: Standard vs Consumption SKU, stateful vs stateless workflows, long-running orchestrations, compensation patterns",
        "- **Connectors**: 400+ managed connectors, custom connectors (OpenAPI), on-premises data gateway, ISE connectors",
        "- **AI Integration**: Azure OpenAI connector, Document Intelligence actions, AI Search queries, Prompt Flow integration",
        "- **Error Handling**: Retry policies (fixed/exponential/none), runAfter configuration, scope-based try/catch, terminate action",
        "- **Security**: Managed identity for connector auth, IP restrictions, access key rotation, VNet integration (Standard SKU)",
        "- **Monitoring**: Run history, trigger history, diagnostic settings, Log Analytics integration, Azure Monitor alerts",
        "- **B2B**: EDI (X12/EDIFACT), AS2 messaging, partner management, integration accounts, schema/map management",
        "- **Event-Driven**: Event Grid triggers, Service Bus triggers, HTTP webhooks, recurrence triggers, sliding window",
        "- **Performance**: Batching, debatch (split-on), chunking for large payloads, concurrency control, throughput optimization",
        "- **DevOps**: ARM/Bicep deployment, GitHub Actions CI/CD, parameterization, environment-specific configs, testing workflows",
    ],
    "azure-monitor-expert": [
        "- **Application Insights**: Distributed tracing, dependency tracking, custom events/metrics, live metrics stream, availability tests",
        "- **Log Analytics**: KQL query language, workspace design (centralized vs per-team), data retention policies, ingestion pricing optimization",
        "- **KQL Mastery**: Summarize, render, join, mv-expand, parse, project, extend, bag_unpack for JSON, time-series analysis",
        "- **Alerts**: Metric alerts, log alerts, activity log alerts, smart detection, action groups (email/SMS/webhook/ITSM/Logic App)",
        "- **Workbooks**: Interactive dashboards, parameterized queries, Azure Resource Graph integration, cross-workspace queries",
        "- **AI-Specific Metrics**: Token usage per model, groundedness/coherence/relevance scores, prompt latency p50/p95/p99, cost per query",
        "- **Diagnostic Settings**: Resource-level log categories, destination (Log Analytics/Storage/Event Hub), Azure Policy for enforcement",
        "- **Autoscale**: Metric-based rules, schedule-based rules, predictive autoscale, cooldown periods, flapping prevention",
        "- **Network Watcher**: NSG flow logs, connection monitor, packet capture, VPN diagnostics, topology visualization",
        "- **Cost Management**: Commitment tiers for Log Analytics, data sampling, ingestion filters, archive tier for cold data",
    ],
    "azure-networking-expert": [
        "- **VNet Design**: Hub-spoke topology, VNet peering (global/regional), address space planning (RFC 1918), subnet delegation",
        "- **Private Endpoints**: Data-plane isolation for AI services, DNS configuration (Azure Private DNS zones), approval workflow",
        "- **NSG/ASG**: Network Security Groups, Application Security Groups, service tags, augmented security rules, flow logging",
        "- **Load Balancing**: Azure Load Balancer (L4), Application Gateway (L7/WAF), Front Door (global), Traffic Manager (DNS)",
        "- **Firewall**: Azure Firewall Premium (TLS inspection, IDPS), firewall policies, DNAT/SNAT rules, threat intelligence feeds",
        "- **DNS**: Azure Private DNS, conditional forwarding, split-brain DNS, DNS Private Resolver, custom DNS servers",
        "- **VPN/ExpressRoute**: Site-to-site VPN, point-to-site, ExpressRoute circuits, Global Reach, FastPath, redundancy patterns",
        "- **NAT Gateway**: Outbound connectivity, SNAT port exhaustion prevention, idle timeout, zone-resilient deployment",
        "- **DDoS Protection**: Standard vs Network Protection, custom policies, rapid response, telemetry and alerting",
        "- **Network Monitoring**: Connection Monitor, NSG flow logs, Traffic Analytics, VNet flow logs, Network Watcher diagnostics",
    ],
    "azure-openai-expert": [
        "- **Model Deployment**: GPT-4o, GPT-4.1, GPT-4o-mini, o1, o3, Phi-4 — deployment types (Standard/Provisioned/Global)",
        "- **Chat Completions**: System/user/assistant roles, function calling, structured output (JSON mode), streaming, seed for reproducibility",
        "- **Embeddings**: text-embedding-3-large (3072 dim), batch embedding (16 per call), dimensionality reduction, similarity search",
        "- **Content Safety**: Built-in content filtering, custom blocklists, severity levels (0-6 scale), jailbreak detection, PII detection",
        "- **Prompt Engineering**: System message design, few-shot examples, chain-of-thought, output schemas, anti-sycophancy, grounding",
        "- **Token Management**: Tokenizer (tiktoken), max_tokens, token counting, context window optimization, prompt compression",
        "- **Rate Limits**: TPM (tokens per minute), RPM (requests per minute), PTU (provisioned throughput units), quota management",
        "- **Multi-Region**: Load balancing across deployments, priority-based failover, latency-based routing via APIM, global Standard",
        "- **Fine-Tuning**: Azure OpenAI fine-tuning (GPT-4o-mini), training file format (JSONL), hyperparameters, evaluation, deployment",
        "- **Security**: Managed identity auth, private endpoints, customer-managed keys, data residency, RBAC (Cognitive Services OpenAI User)",
    ],
    "azure-policy-expert": [
        "- **Policy Definitions**: Built-in vs custom, policy effects (Deny/Audit/Modify/DeployIfNotExists/Append), policy parameters",
        "- **Initiatives**: Policy sets for compliance standards (CIS/NIST/PCI), custom initiatives, assignment scope (MG/Sub/RG)",
        "- **Compliance**: Compliance dashboard, non-compliant resource remediation, exemptions (waiver/mitigated), regulatory compliance",
        "- **AI Governance**: Require managed identity on Cognitive Services, enforce private endpoints, mandate content safety, tag enforcement",
        "- **Remediation**: Auto-remediation tasks, managed identity for DeployIfNotExists/Modify, remediation scope, re-evaluation triggers",
        "- **Assignment**: Scope hierarchy (management group → subscription → resource group), exclusions, enforcement mode (Default/DoNotEnforce)",
        "- **Custom Policies**: Policy rule authoring (if/then), field expressions, alias discovery, policy functions, cross-resource group",
        "- **Monitoring**: Policy compliance events, activity log integration, Azure Monitor alerts on non-compliance, Log Analytics export",
        "- **DevOps Integration**: Policy as code (Bicep/ARM), GitHub Actions for policy deployment, policy evaluation in CI/CD",
        "- **Best Practices**: Least-privilege effects, test in audit mode first, use initiatives over individual policies, parameterize for reuse",
    ],
    "azure-service-bus-expert": [
        "- **Queues**: FIFO delivery, dead-letter queue, duplicate detection, sessions for ordered processing, scheduled messages",
        "- **Topics/Subscriptions**: Publish-subscribe, correlation/SQL/boolean filters, forwarding, auto-delete on idle",
        "- **Premium Features**: VNet integration, private endpoints, customer-managed encryption, geo-disaster recovery, large messages (100MB)",
        "- **Messaging Patterns**: Request-reply, competing consumers, saga/choreography, event sourcing, CQRS with change feed",
        "- **Sessions**: Ordered processing, session state, session-based routing, multi-instance consumer with session lock",
        "- **Security**: SAS tokens, managed identity, private endpoints, IP filtering, customer-managed encryption keys",
        "- **Performance**: Batching (send/receive), prefetch, partitioned entities, message pump pattern, connection pooling",
        "- **Monitoring**: Active message count, dead-letter count, queue depth, scheduled messages, diagnostic logs, Azure Monitor",
        "- **AI Integration**: Agent-to-agent messaging, task queue for async processing, event-driven LLM pipeline, priority queuing",
        "- **DevOps**: ARM/Bicep templates, entity management, topic/subscription provisioning, integration testing patterns",
    ],
    "azure-sql-expert": [
        "- **Deployment Options**: Single DB, Elastic Pool, Managed Instance, Hyperscale, Serverless, Azure SQL Edge",
        "- **Performance Tuning**: Query Store, Intelligent Query Processing, automatic tuning, missing index recommendations, Query Performance Insight",
        "- **Security**: TDE (Transparent Data Encryption), Always Encrypted, dynamic data masking, row-level security, audit logging, Entra auth",
        "- **High Availability**: Locally redundant (99.99%), zone redundant (99.995%), geo-replication, auto-failover groups, read replicas",
        "- **Scaling**: DTU vs vCore model, serverless auto-pause, Hyperscale (100TB+), read scale-out, elastic pools for multi-tenant",
        "- **Vector Search**: Native vector support (preview), DiskANN index, cosine/euclidean similarity, hybrid search with full-text",
        "- **AI Integration**: Azure OpenAI function calling with SQL, natural language to SQL, embeddings storage, RAG with SQL data",
        "- **Monitoring**: SQL Analytics, Intelligent Insights, extended events, DMVs, wait statistics, Azure Monitor integration",
        "- **Connectivity**: Private endpoints, VNet service endpoints, connection policies (Redirect/Proxy/Default), TLS 1.2+",
        "- **DevOps**: DACPAC deployment, sqlpackage, SSDT, schema compare, migration scripts, CI/CD with GitHub Actions",
    ],
    "azure-storage-expert": [
        "- **Blob Storage**: Hot/Cool/Cold/Archive tiers, lifecycle management, immutable blob storage, point-in-time restore, versioning",
        "- **Data Lake Storage Gen2**: Hierarchical namespace, ABFS driver, ACLs, Azure Synapse integration, Spark/Databricks access",
        "- **File Shares**: SMB/NFS protocols, premium files (SSD), standard files (HDD), Azure File Sync, private endpoints",
        "- **Queue Storage**: Message queuing for decoupled architectures, visibility timeout, dequeue count, poison message handling",
        "- **Table Storage**: NoSQL key-value store, OData queries, batch operations, Azure Cosmos DB Table API migration path",
        "- **Security**: Shared Access Signatures (SAS), managed identity, encryption at rest (Microsoft/customer-managed keys), private endpoints",
        "- **Performance**: Block blob upload (parallel, stage/commit), page blobs for VM disks, append blobs for logs, CDN integration",
        "- **Replication**: LRS, ZRS, GRS, GZRS, RA-GRS, RA-GZRS — choose based on durability/availability/cost requirements",
        "- **AI Integration**: Document storage for RAG pipelines, embedding storage, model artifact storage, training data management",
        "- **Monitoring**: Storage Analytics, Azure Monitor metrics, diagnostic logs, capacity planning, transaction metrics",
    ],
    "batch-processing-expert": [
        "- **Azure Batch**: Pool management, job scheduling, task dependencies, auto-scaling formulas, low-priority VMs for cost savings",
        "- **Data Factory**: Pipeline orchestration, data flows (Spark), mapping flows, copy activity optimization, self-hosted IR",
        "- **Spark Processing**: Azure Synapse Spark, Databricks, PySpark/Scala, DataFrame optimization, partition strategies",
        "- **AI Batch Patterns**: Batch embedding generation (16 per call), bulk document processing, parallel LLM inference, result aggregation",
        "- **Queue-Based**: Service Bus/Event Hubs for work distribution, competing consumers, dead-letter for failures, retry policies",
        "- **Orchestration**: Durable Functions fan-out/fan-in, Step Functions alternative, checkpointing, resumable workflows",
        "- **Cost Optimization**: Spot VMs (90% savings), reserved instances, consumption-based pricing, auto-pause for idle workloads",
        "- **Monitoring**: Job completion tracking, task failure rates, pool utilization, cost per batch run, SLA compliance",
        "- **Data Quality**: Schema validation, completeness checks, deduplication, PII scanning, quality scoring per batch",
        "- **Error Handling**: Retry policies (fixed/exponential), poison message routing, partial failure handling, compensation logic",
    ],
    "blazor-expert": [
        "- **Blazor Server**: SignalR connection, server-side rendering, state management, circuit lifetime, reconnection handling",
        "- **Blazor WebAssembly**: Client-side execution, AOT compilation, lazy loading assemblies, PWA support, offline capability",
        "- **Blazor United (.NET 8+)**: Auto render mode, streaming SSR, enhanced navigation, static SSR + interactivity per component",
        "- **AI Integration**: Chat UI components, streaming response rendering, markdown display, real-time token visualization",
        "- **State Management**: Cascading values, Fluxor/Redux pattern, DI-scoped services, persistent component state, URL-based state",
        "- **Authentication**: Microsoft Identity Platform, MSAL, Entra ID B2C, cookie/JWT auth, authorization policies, role-based",
        "- **Performance**: Virtualization for large lists, lazy loading, AOT compilation, trimming, ahead-of-time interop, render optimization",
        "- **Component Library**: MudBlazor, Radzen, Syncfusion, Telerik — selection criteria, custom component development",
        "- **Testing**: bUnit for component testing, Playwright for E2E, mock JS interop, integration testing with WebApplicationFactory",
        "- **Deployment**: Azure Static Web Apps (WASM), App Service (Server), Container Apps, CI/CD with dotnet publish",
    ],
};

console.log("═══ Section 26 B3: Domain-Specific Core Expertise ═══\n");

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
    if (startIdx < 0 || endIdx < 0) { console.log(`  ? ${f}: no Core Expertise section`); continue; }

    const newExpertise = "## Core Expertise\n\n" + expertise.join("\n") + "\n";
    const enrichedContent = c.substring(0, startIdx) + newExpertise + c.substring(endIdx + 1);
    fs.writeFileSync(fp, enrichedContent);
    const newLines = enrichedContent.split("\n").length;
    enriched++;
    console.log(`  ✅ ${f}: ${lines} → ${newLines} (+${newLines - lines})`);
}

const finalLines = agents.map(f => fs.readFileSync(path.join(dir, f), "utf8").split("\n").length);
console.log(`\n═══ B3 COMPLETE: min=${Math.min(...finalLines)} max=${Math.max(...finalLines)} avg=${Math.round(finalLines.reduce((a, b) => a + b, 0) / finalLines.length)} ═══`);
