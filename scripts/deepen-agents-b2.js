const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(10, 20);

// Domain-specific expertise expansions for B2 agents
const expertiseMap = {
    "azure-aks-expert": [
        "- **GPU Node Pools**: NC/ND/NV series selection, A100 80GB vs H100 allocation, MIG partitioning for multi-tenant inference, spot instances for training",
        "- **NVIDIA Device Plugin**: GPU operator deployment, time-slicing configuration, MPS for concurrent inference, DCGM monitoring",
        "- **Model Serving Engines**: vLLM (PagedAttention, continuous batching), TGI (Hugging Face), Triton Inference Server, TorchServe comparison",
        "- **Autoscaling**: HPA on GPU utilization + request queue depth, cluster autoscaler with GPU node pools, KEDA scalers for event-driven",
        "- **Networking**: Ingress controller (NGINX/Envoy), internal load balancer for private serving, network policies, service mesh (Istio/Linkerd)",
        "- **Storage**: Persistent volumes for model cache, Azure Files CSI for shared weights, ephemeral for scratch, NVMe for fast loading",
        "- **Security**: Pod security standards, workload identity, Key Vault CSI driver, network policies, private cluster, Azure Policy for AKS",
        "- **Observability**: Prometheus + Grafana for GPU metrics, Azure Monitor Container Insights, custom metrics for inference latency/throughput",
        "- **CI/CD**: Helm charts for model deployments, Flux/ArgoCD GitOps, canary with Flagger, rollback on latency regression",
        "- **Cost**: Spot VMs for dev/training (70% savings), reserved instances for prod inference, right-size GPU SKU based on model size",
    ],
    "azure-apim-expert": [
        "- **AI Gateway Patterns**: Semantic caching with Redis, smart model routing (complexity-based), token budget enforcement per subscription",
        "- **Policy Expressions**: Inbound/outbound/on-error policies, C# expressions, JWT validation, rate limiting with sliding window",
        "- **Backend Pools**: Load balancing across multi-region OpenAI deployments, priority-based failover, circuit breaker per backend",
        "- **Security**: OAuth2/OIDC validation, subscription keys, IP filtering, mutual TLS, custom CA certificates",
        "- **Developer Portal**: Custom branding, interactive API testing, SDK generation, product/subscription management",
        "- **Observability**: Application Insights integration, custom dimensions for AI metrics (tokens, model, latency), real-time analytics",
        "- **Versioning**: URL path/header/query versioning, revision management, deprecation workflow, API lifecycle",
        "- **Cost Management**: Consumption vs dedicated tiers, self-hosted gateway for hybrid, usage analytics for chargeback",
        "- **Caching**: Internal cache, external Redis, response caching policies, cache-by-header for personalization, semantic similarity cache",
        "- **Multi-tenant**: Products and subscriptions per team, quota enforcement, usage reporting per consumer",
    ],
    "azure-cdn-expert": [
        "- **Azure Front Door**: Global load balancing, SSL offloading, WAF integration, custom domains, private link origins",
        "- **Caching Strategies**: Query string caching, cache-control headers, purge APIs, pre-warming, edge-side includes",
        "- **WAF Rules**: OWASP Core Rule Set 3.2, custom rules for AI endpoints, rate limiting, geo-filtering, bot protection",
        "- **Edge Optimization**: Compression (Brotli/gzip), image optimization, HTTP/2 and HTTP/3, early hints, connection coalescing",
        "- **Routing Rules**: URL rewrite, redirect, header manipulation, path-based routing to different origins",
        "- **SSL/TLS**: Managed certificates, custom certificates, TLS 1.3, HSTS, certificate pinning, OCSP stapling",
        "- **Analytics**: Real-time metrics, access logs to Log Analytics, custom dashboards, latency by POP, cache hit ratio",
        "- **Private Link**: Secure origin connections, private endpoint for storage/app service, no public IP on origin",
        "- **Performance**: Origin shield for cache fill optimization, TCP optimization, DNS-level load balancing, anycast routing",
        "- **Multi-region**: Active-active with health probes, failover priority, latency-based routing, session affinity",
    ],
    "azure-container-apps-expert": [
        "- **Serverless Containers**: Consumption workload profile, dedicated GPU profiles, scale-to-zero, event-driven scaling with KEDA",
        "- **Dapr Integration**: Service invocation, pub/sub messaging, state store, secrets management, bindings for Azure services",
        "- **Networking**: VNet integration, internal/external ingress, custom domains, TLS termination, traffic splitting for blue/green",
        "- **Scaling Rules**: HTTP concurrent requests, Azure Queue length, Kafka topic lag, custom metrics, KEDA scalers",
        "- **Revisions**: Multi-revision mode, traffic splitting (canary), revision labels, rollback, A/B testing",
        "- **Jobs**: Scheduled jobs (cron), event-triggered jobs, manual jobs, replica management, timeout configuration",
        "- **Security**: Managed identity (system/user-assigned), Key Vault references, IP restrictions, auth middleware (Easy Auth)",
        "- **Observability**: Built-in log streaming, Azure Monitor integration, Dapr tracing with Zipkin/Application Insights",
        "- **Storage**: Azure Files mount, ephemeral storage, init containers for model download, volume mounts",
        "- **AI Workloads**: GPU workload profiles (T4/A100), dedicated compute for inference, sidecar pattern for MCP servers",
    ],
    "azure-cosmos-db-expert": [
        "- **API Selection**: NoSQL (document) for flexible schemas, Gremlin for knowledge graphs, MongoDB vCore for lift-and-shift, PostgreSQL for relational",
        "- **Partitioning**: Logical partition key design, cross-partition queries, hierarchical partitioning, hot partition detection",
        "- **Consistency Levels**: Strong, bounded staleness, session, consistent prefix, eventual — trade-offs for AI workloads",
        "- **RU Optimization**: Point reads vs queries, indexing policies, composite indexes, spatial indexes, TTL for auto-cleanup",
        "- **Serverless vs Provisioned**: Serverless for dev/bursty (pay-per-RU), provisioned autoscale for prod (predictable cost)",
        "- **Change Feed**: Real-time event processing, materialized views, event sourcing, sync to AI Search index",
        "- **Global Distribution**: Multi-region writes, automatic failover, conflict resolution policies, latency-based routing",
        "- **Vector Search**: DiskANN vector index, hybrid search (vector + filter), embeddings for RAG, similarity scoring",
        "- **Security**: Always encrypted, customer-managed keys, VNet integration, private endpoints, RBAC (data-plane), audit logs",
        "- **Monitoring**: RU consumption per partition, latency percentiles, throttled requests, diagnostic logs, Azure Monitor alerts",
    ],
    "azure-devops-expert": [
        "- **YAML Pipelines**: Multi-stage (build→test→deploy), matrix strategies, template references, conditional stages, approvals",
        "- **Service Connections**: Azure Resource Manager (workload identity federation), GitHub, Docker registry, npm/NuGet feeds",
        "- **Variable Groups**: Secrets from Key Vault, environment-scoped variables, library groups, pipeline decorators",
        "- **Environments**: Approval gates, exclusive lock, resource health checks, deployment history, rollback via redeployment",
        "- **Artifacts**: Universal packages, npm/NuGet/pip feeds, container images, build artifacts, release management",
        "- **Test Management**: Test plans, automated test execution, code coverage reporting, flaky test detection, test impact analysis",
        "- **Boards**: Agile/Scrum/CMMI process templates, sprint planning, burndown charts, work item linking to commits/PRs",
        "- **Repos**: Git branching policies, PR reviewers, build validation, merge strategies (squash/rebase/merge), branch protection",
        "- **Security**: Project-level permissions, area path security, pipeline permissions, audit log, compliance dashboards",
        "- **Integration**: GitHub integration, Slack/Teams notifications, webhooks, service hooks, REST API for automation",
    ],
    "azure-event-hubs-expert": [
        "- **Partitioned Streaming**: Partition key design, throughput units vs processing units, auto-inflate, Kafka protocol support",
        "- **Consumer Groups**: Independent consumption, checkpointing with blob storage, event position management, consumer lag monitoring",
        "- **Schema Registry**: Avro/JSON schema validation, schema evolution (forward/backward compatibility), producer/consumer SDK integration",
        "- **Capture**: Auto-capture to Blob Storage/Data Lake in Avro/Parquet, time/size windows, partition-level capture",
        "- **Event Processing**: Azure Stream Analytics (SQL), Functions trigger (batch mode), Spark Structured Streaming, custom processor",
        "- **Security**: SAS tokens, managed identity auth, private endpoints, IP filtering, customer-managed encryption keys",
        "- **Geo-DR**: Active-passive failover, alias-based connection strings, metadata sync, RPO considerations",
        "- **Performance**: Batching (size/count/time), AMQP 1.0 for high throughput, compression, connection pooling, prefetch",
        "- **Monitoring**: Incoming/outgoing messages, throttled requests, active connections, consumer lag, diagnostic logs",
        "- **AI Patterns**: Real-time inference pipeline (events → LLM → results), anomaly detection, sentiment streaming, fraud scoring",
    ],
    "azure-functions-expert": [
        "- **Hosting Plans**: Consumption (scale-to-zero), Premium (pre-warmed, VNet), Dedicated (App Service plan), Container Apps hosting",
        "- **Triggers**: HTTP, Timer, Queue, Blob, Event Hub, Event Grid, Cosmos DB change feed, Service Bus, Kafka, Dapr",
        "- **Bindings**: Input/output bindings for Azure services, custom bindings, Durable Functions orchestration, Entity functions",
        "- **Durable Functions**: Fan-out/fan-in, function chaining, human interaction, monitoring, eternal orchestrations, sub-orchestrations",
        "- **Cold Start**: Pre-warming (Premium), keep-alive pings, dependency injection optimization, assembly trimming, ready instances",
        "- **Security**: Managed identity, Key Vault references, authentication/authorization middleware, function-level authorization keys",
        "- **Networking**: VNet integration (Premium/Dedicated), private endpoints, hybrid connections, NAT gateway for outbound",
        "- **Monitoring**: Application Insights integration, live metrics, distributed tracing, custom telemetry, log streaming",
        "- **AI Integration**: OpenAI SDK with streaming, AI Search vector operations, document processing pipeline, batch embeddings",
        "- **Best Practices**: Stateless design, idempotency, poison message handling, retry policies, single responsibility per function",
    ],
    "azure-identity-expert": [
        "- **Managed Identity**: System-assigned vs user-assigned, federated identity for GitHub/K8s, cross-tenant access, token caching",
        "- **RBAC**: Built-in roles vs custom roles, scope hierarchy (management group→subscription→RG→resource), deny assignments",
        "- **Entra ID**: App registrations, service principals, multi-tenant apps, B2C for customer identity, Conditional Access policies",
        "- **DefaultAzureCredential**: Credential chain order, environment variables, managed identity, Azure CLI, VS Code, interactive",
        "- **Workload Identity**: OIDC for GitHub Actions, AKS pod identity, Container Apps managed identity, federated credentials",
        "- **Privileged Identity Management**: Just-in-time access, approval workflows, access reviews, time-bound role assignments",
        "- **Key Vault Integration**: Certificate management, secret rotation, HSM-backed keys, access policies vs RBAC, private endpoints",
        "- **Zero Trust**: Verify explicitly, least privilege, assume breach, continuous access evaluation, device compliance",
        "- **Monitoring**: Sign-in logs, audit logs, risky users/sign-ins, identity protection, diagnostic settings to Log Analytics",
        "- **AI-Specific**: Cognitive Services RBAC (Cognitive Services OpenAI User), AI Search data reader/contributor, model deployment permissions",
    ],
    "azure-key-vault-expert": [
        "- **Secret Management**: Secret versions, expiration dates, rotation policies, automatic rotation with Event Grid, soft-delete",
        "- **Certificate Management**: Self-signed, CA-integrated (DigiCert/GlobalSign), auto-renewal, PFX/PEM export, Key Vault Certificates",
        "- **Key Management**: RSA/EC keys, HSM-backed (Premium SKU), key rotation, wrap/unwrap for envelope encryption, sign/verify",
        "- **Access Control**: RBAC (recommended) vs access policies, Key Vault Administrator/Secrets Officer/Crypto Officer roles",
        "- **Networking**: Private endpoints, service endpoints, firewall rules, trusted Azure services bypass, VNet integration",
        "- **Integration**: App Service/Functions Key Vault references (@Microsoft.KeyVault), AKS CSI driver, Container Apps secrets",
        "- **Backup & Recovery**: Soft-delete (90 days default), purge protection, backup/restore individual secrets/keys/certs",
        "- **Monitoring**: Diagnostic settings, access audit logs, Azure Monitor alerts on secret access, Azure Policy for compliance",
        "- **Best Practices**: Separate vaults per environment, least-privilege access, never cache secrets long-term, use managed identity",
        "- **AI-Specific**: Store OpenAI API keys, connection strings for Cosmos/Search, certificate for managed identity, encryption keys for PII data",
    ],
};

console.log("═══ Section 26 B2: Deepening Core Expertise ═══\n");

let enriched = 0;
for (const f of agents) {
    const fp = path.join(dir, f);
    const c = fs.readFileSync(fp, "utf8");
    const lines = c.split("\n").length;
    const slug = f.replace("frootai-", "").replace(".agent.md", "");

    const expertise = expertiseMap[slug];
    if (!expertise) { console.log(`  ? ${f}: ${lines} (no domain expansion)`); continue; }

    // Find and replace Core Expertise section
    const startIdx = c.indexOf("## Core Expertise");
    const endIdx = c.indexOf("\n## Your Approach");
    if (startIdx < 0 || endIdx < 0) { console.log(`  ? ${f}: ${lines} (no Core Expertise section)`); continue; }

    const newExpertise = "## Core Expertise\n\n" + expertise.join("\n") + "\n";
    const enrichedContent = c.substring(0, startIdx) + newExpertise + c.substring(endIdx + 1);

    fs.writeFileSync(fp, enrichedContent);
    const newLines = enrichedContent.split("\n").length;
    enriched++;
    console.log(`  ✅ ${f}: ${lines} → ${newLines} (+${newLines - lines})`);
}

// Final stats
const finalLines = agents.map(f => fs.readFileSync(path.join(dir, f), "utf8").split("\n").length);
const avg = Math.round(finalLines.reduce((a, b) => a + b, 0) / finalLines.length);
const min = Math.min(...finalLines);
const max = Math.max(...finalLines);
console.log(`\n═══ B2 COMPLETE ═══`);
console.log(`  Enriched: ${enriched}/10`);
console.log(`  Final: min=${min} max=${max} avg=${avg}`);
