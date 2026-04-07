const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(120, 130);
const expertiseMap = {
    "play-13-builder": [
        "- **Azure OpenAI Fine-Tuning**: GPT-4o-mini fine-tuning, training file upload (JSONL), hyperparameter selection, job monitoring",
        "- **Data Preparation**: JSONL format (system/user/assistant), data quality validation, deduplication, PII scrubbing, train/val split",
        "- **LoRA/QLoRA**: Low-rank adaptation for parameter-efficient tuning, adapter merging, QLoRA 4-bit for reduced GPU memory",
        "- **MLflow Tracking**: Experiment logging, metric comparison, model registry, artifact storage, deployment pipeline integration",
        "- **GPU Compute**: NC/ND VM selection, A100 80GB for 70B models, spot instances for training (70% savings), checkpoint/resume",
        "- **Evaluation Pipeline**: Perplexity, BLEU, ROUGE, custom domain metrics, human eval comparison, A/B vs base model",
        "- **Hyperparameter Search**: Grid/random/Bayesian optimization, learning rate (1e-5 to 5e-4), epochs (1-5), batch size, warmup steps",
        "- **Model Registry**: Version tagging, approval gates (dev→staging→prod), model card generation, lineage tracking",
        "- **Deployment**: Fine-tuned model deployment on Azure OpenAI, custom endpoint, A/B canary split, rollback on quality regression",
        "- **Safety Alignment**: Post-fine-tune safety evaluation, red team testing, alignment preservation verification, content safety check",
    ],
    "play-13-reviewer": [
        "- **Data Quality Review**: Training data diversity, no PII/sensitive content, format compliance, sufficient examples (100+ minimum)",
        "- **Hyperparameter Review**: Learning rate appropriate, epochs not overfitting, batch size fits GPU memory, warmup sufficient",
        "- **Evaluation Review**: Metrics meaningful for domain, base model comparison fair, human eval included, statistical significance",
        "- **Safety Review**: Fine-tuned model tested for harmful outputs, alignment preserved, content safety passes, red team results clean",
        "- **MLflow Review**: Experiments properly logged, metrics tracked, model registered with version, artifacts stored, reproducible",
        "- **Compute Review**: GPU SKU appropriate for model size, spot instances for non-prod, cost within budget, checkpoint configured",
        "- **Deployment Review**: Canary deployment configured, rollback procedure tested, monitoring active, quality gate before full rollout",
        "- **Security Review**: Training data encrypted, model weights secured, access control on endpoints, audit logging enabled",
        "- **Documentation Review**: Model card complete, training data description, known limitations documented, usage guidelines clear",
        "- **Cost Review**: Training cost justified vs quality improvement, ongoing inference cost, fine-tune vs few-shot comparison",
    ],
    "play-13-tuner": [
        "- **Learning Rate**: Start 2e-5, adjust based on loss curve (diverging → lower, flat → higher), cosine/linear schedule",
        "- **Epochs**: 1-3 for large datasets, 3-5 for small, monitor val loss for overfitting, early stopping patience=2",
        "- **LoRA Rank**: 8 (minimal), 16 (balanced), 32-64 (max quality), alpha = 2x rank, target modules (q_proj, v_proj, k_proj, o_proj)",
        "- **Batch Size**: Max that fits GPU memory, gradient accumulation for effective batch size, 4-16 typical range",
        "- **Data Quality**: Remove duplicates (>90% similarity), balance categories, augment minority classes, validate format",
        "- **Evaluation Thresholds**: Perplexity improvement >10%, domain metric improvement >5%, no safety regression, human preference >60%",
        "- **A/B Testing**: Deploy fine-tuned alongside base, 10% traffic to fine-tuned, compare quality/cost/latency, promote after 500+ samples",
        "- **Cost Optimization**: Smaller LoRA rank for cost-sensitive, fewer epochs with good data, INT8 quantization post-training",
        "- **When NOT to Fine-Tune**: If few-shot achieves 90%+ of target quality, if training data <100 examples, if rapid iteration needed",
        "- **Production Readiness**: Val loss converged, safety eval pass, A/B shows improvement, model card complete, rollback tested",
    ],
    "play-14-builder": [
        "- **APIM AI Gateway**: Azure API Management as central proxy for all Azure OpenAI calls, policy-based routing and metering",
        "- **Semantic Caching**: Redis-backed cache, embedding-based similarity (threshold 0.95), TTL management, cache invalidation API",
        "- **Smart Model Routing**: Complexity classifier → gpt-4o for reasoning, gpt-4o-mini for simple, gpt-4.1-nano for classification",
        "- **Token Budget Enforcement**: Per-user/team daily limits, real-time tracking, 80% warning, hard stop at 100%, admin override",
        "- **Multi-Region Load Balancing**: Priority-based across Azure OpenAI regions, latency-aware routing, capacity-aware distribution",
        "- **Usage Analytics**: Real-time dashboard (tokens/cost/latency by model/user), FinOps reports, chargeback CSV exports",
        "- **Fallback Chain**: gpt-4o → gpt-4o-mini → cached response → graceful error, per-request timeout, circuit breaker per backend",
        "- **Rate Limiting**: Sliding window per subscription key, burst allowance, retry-after header, priority queue for premium users",
        "- **Cost Attribution**: Request tagging (team/project/cost-center), monthly billing aggregation, anomaly detection, budget alerts",
        "- **Evaluation**: Cache hit ratio >30%, cost reduction >40% vs direct, p95 latency <2s, availability 99.95%, token budget compliance",
    ],
    "play-14-reviewer": [
        "- **Routing Review**: Complexity classifier accuracy, model assignment appropriate, no quality degradation for routed-down requests",
        "- **Cache Review**: Similarity threshold appropriate (no false hits), TTL reasonable, invalidation works, cache size bounded",
        "- **Budget Review**: Per-user limits configured, admin override works, warning notifications functional, no budget bypass",
        "- **Security Review**: APIM policies secure, no credential leakage in logs, managed identity for backend pools, JWT validation",
        "- **Failover Review**: Multi-region failover tested, circuit breaker thresholds appropriate, fallback chain complete",
        "- **Performance Review**: Gateway latency overhead <50ms, cache lookup <10ms, routing decision <20ms, no bottleneck",
        "- **Analytics Review**: Dashboard accurate, cost attribution correct, FinOps reports match actual billing, anomaly detection works",
        "- **Rate Limiting Review**: Limits appropriate per tier, burst allowance reasonable, retry-after header correct, no abuse possible",
        "- **Cost Review**: Gateway cost vs savings analysis positive ROI, infrastructure cost reasonable, cache storage bounded",
        "- **Test Review**: Load test with mixed traffic, failover simulation, cache hit/miss scenarios, budget exhaustion handling",
    ],
    "play-14-tuner": [
        "- **Cache Threshold**: Semantic similarity 0.92-0.98 (lower = more hits but risk stale, higher = fewer hits but accurate)",
        "- **Cache TTL**: 5min for dynamic, 1hr for reference, 24hr for static, per-endpoint configuration, manual invalidation API",
        "- **Routing Thresholds**: Complexity score <0.3 → nano, 0.3-0.7 → mini, >0.7 → gpt-4o, adjust based on quality feedback",
        "- **Token Budgets**: Dev: 100K/day, standard: 500K/day, premium: 2M/day, admin: unlimited, configurable per subscription",
        "- **Rate Limits**: Free: 10 RPM, standard: 60 RPM, premium: 300 RPM, burst: 2x for 10s, sliding window 60s",
        "- **Failover Priority**: East US 2 (primary) → West US 3 (secondary) → Sweden Central (tertiary), health check interval 30s",
        "- **Cost Targets**: 40% cost reduction vs direct, cache hit ratio >30%, average $/1K tokens reduced by model routing",
        "- **A/B Testing**: Compare routing strategies (static vs dynamic), cache thresholds, budget configurations, measure quality+cost",
        "- **Evaluation**: Cache hit ratio, cost savings %, p95 latency, token budget compliance rate, routing accuracy, availability",
        "- **Production Readiness**: All regions healthy, cache warm, budgets configured, analytics flowing, alerts active, runbook ready",
    ],
    "play-15-builder": [
        "- **GPT-4o Vision**: Multi-modal document analysis (text + images + tables + charts), image-to-structured-data extraction",
        "- **Azure Document Intelligence**: Pre-built models (invoice/receipt/ID/health), Layout API for tables, custom classification",
        "- **Processing Pipeline**: Upload → classify → OCR/Vision → extract → validate → enrich → store, parallel page processing",
        "- **Table Extraction**: Document Intelligence table detection, GPT-4o for complex tables (merged cells, nested), JSON output",
        "- **Chart/Diagram Analysis**: GPT-4o Vision for pie/bar/line charts, flow diagrams, architecture diagrams → structured data",
        "- **Batch Processing**: Queue-based (Service Bus), parallel workers, progress tracking, retry on failure, dead-letter handling",
        "- **PII Handling**: Auto-detection (Presidio), masking before storage, compliant processing, audit trail, retention policies",
        "- **Output Formats**: Structured JSON, CSV export, searchable PDF, database records, AI Search index update, webhook notification",
        "- **Cosmos DB Storage**: Partition by document type, TTL for temporary, change feed for downstream, cross-partition queries",
        "- **Evaluation**: Field accuracy ≥95%, table accuracy ≥90%, chart accuracy ≥85%, processing <30s/page, PII detection ≥99%",
    ],
    "play-15-reviewer": [
        "- **Multi-Modal Review**: Vision analysis quality, text+image combination accuracy, chart interpretation correctness",
        "- **Extraction Review**: Field-level accuracy per document type, table parsing completeness, entity linking quality",
        "- **Pipeline Review**: Classify→extract→validate chain integrity, error handling at each stage, retry logic appropriate",
        "- **PII Review**: Detection coverage complete, masking applied before storage, audit trail functional, retention policy configured",
        "- **Performance Review**: Processing time per page, batch throughput, queue depth monitoring, worker scaling appropriate",
        "- **Security Review**: Managed identity, encrypted storage, access control, private endpoints, no PII in logs",
        "- **Output Review**: JSON schema validation, CSV format correct, searchable PDF quality, index updates timely",
        "- **Batch Review**: Queue configuration, dead-letter handling, progress reporting, failure notification, retry policy",
        "- **Test Review**: Sample documents per type (10+), edge cases (rotated/skewed/low-res/multi-page), chart with no data",
        "- **Cost Review**: Doc Intelligence per-page cost, GPT-4o Vision token usage, storage costs, total cost per document",
    ],
    "play-15-tuner": [
        "- **Vision Config**: Image resolution (low=fast/high=accurate), detail level (auto/low/high), max images per request (10)",
        "- **Extraction Tuning**: Per-field confidence thresholds, custom model training data, template matching vs LLM extraction",
        "- **Table Config**: Detection confidence threshold, merged cell handling strategy, header row detection, column type inference",
        "- **Chart Config**: Chart type detection accuracy, data point extraction precision, legend interpretation, axis label reading",
        "- **Batch Tuning**: Worker count, queue prefetch, parallel pages per document, timeout per page, retry backoff",
        "- **PII Tuning**: Entity categories (expand/restrict), confidence threshold for masking, custom entity patterns",
        "- **Output Tuning**: JSON schema versioning, CSV delimiter/encoding, PDF quality settings, index field mapping",
        "- **Cost Optimization**: Low-res vision for classification, high-res only for extraction, batch API for bulk, cache repeated docs",
        "- **Evaluation**: Vision accuracy ≥90%, table ≥90%, chart ≥85%, field extraction ≥95%, processing ≤30s/page, PII ≥99%",
        "- **Production Readiness**: All document types tested, batch pipeline stable, PII handling verified, monitoring active, cost within budget",
    ],
    "play-16-builder": [
        "- **M365 Copilot Extension**: Declarative agent with TypeSpec API definition, message extension for Teams, Graph plugin",
        "- **Microsoft Graph API**: User profile, mail search, calendar events, files (OneDrive/SharePoint), Teams channels, batch requests",
        "- **Adaptive Cards**: Universal actions, data binding, templating engine, Teams-specific features, sequential workflows",
        "- **Authentication**: Entra ID SSO, OAuth2 on-behalf-of flow, delegated permissions, admin consent, token caching (MSAL)",
        "- **Knowledge Grounding**: SharePoint sites as knowledge source, Graph connector for custom data, Dataverse entities",
        "- **Azure Functions Backend**: HTTP trigger for API, managed identity for Graph, Key Vault for secrets, Application Insights",
        "- **Teams App Manifest**: App definition, bot registration, message extension commands, tab configuration, permissions scope",
        "- **Multi-Turn Conversations**: Context preservation, slot filling, disambiguation, task completion confirmation, session state",
        "- **Deployment**: Teams admin center publishing, org-wide app catalog, environment management (dev/test/prod), governance",
        "- **Evaluation**: User satisfaction (NPS), task completion rate ≥85%, response time <3s, Graph API error rate <1%",
    ],
};
console.log("═══ Section 26 B13: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B13 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
