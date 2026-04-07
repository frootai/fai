const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(110, 120);
const expertiseMap = {
    "play-09-tuner": [
        "- **Search Weight Tuning**: hybrid_weight keyword (0.3-0.5) vs vector (0.5-0.7), RRF k parameter (60 default), A/B test with golden set",
        "- **Scoring Profile Tuning**: Freshness decay function, tag boost weights, magnitude scoring, field weight distribution",
        "- **Reranker Config**: Semantic reranker top_n (3-10), cross-encoder model selection, reranking latency budget (<200ms)",
        "- **Suggester Tuning**: Fuzzy distance (1-2), minimum coverage, source fields, completion vs suggestion mode",
        "- **Answer Generation**: temperature=0.2 for factual, max_tokens for answer length, citation format, confidence threshold",
        "- **Index Optimization**: Analyzer selection per language, synonym map maintenance, field attribute tuning (filterable/sortable/facetable)",
        "- **Performance Tuning**: Partition count for throughput, replica count for availability, search units for capacity, cache TTL",
        "- **Cost Analysis**: AI Search tier (Basic→S1→S2→S3), storage per GB, operations per second, answer generation token cost",
        "- **Evaluation Metrics**: NDCG@10 ≥0.75, MRR ≥0.60, search latency p95 <500ms, answer groundedness ≥0.85, CTR tracking",
        "- **Production Readiness**: Golden test set passes, load test passes, failover tested, monitoring configured, alerts set",
    ],
    "play-10-builder": [
        "- **Azure Content Safety**: Text analysis API (hate/violence/sexual/self-harm), image analysis, severity levels (0-6), custom blocklists",
        "- **APIM Gateway**: Content Safety as middleware policy, request/response inspection, severity-based routing, audit logging",
        "- **Custom Categories**: Industry-specific content rules (financial advice, medical claims), brand safety, competitor mentions",
        "- **Severity Routing**: Block (severity ≥4), human review (severity 2-3), pass (severity 0-1), configurable per category",
        "- **Multi-Modal**: Text + image moderation in same pipeline, video frame sampling, audio transcription → text analysis",
        "- **Human Review Queue**: Low-confidence items routed to reviewers, SLA tracking, appeal workflow, feedback loop to model",
        "- **Blocklist Management**: Custom term lists, regex patterns, multi-language support, dynamic updates via API",
        "- **Integration**: Pre-LLM input screening, post-LLM output filtering, real-time streaming moderation, batch analysis",
        "- **Metrics**: False positive rate (<5%), false negative rate (<1%), moderation latency (<100ms), human override rate",
        "- **Compliance**: COPPA, DSA (Digital Services Act), platform-specific rules (age-gating, regional restrictions)",
    ],
    "play-10-reviewer": [
        "- **Safety Coverage Review**: All 4 categories configured (hate/violence/sexual/self-harm), custom categories added for domain",
        "- **Severity Threshold Review**: Thresholds appropriate for audience, not too aggressive (false positives) or too lenient",
        "- **Blocklist Review**: Terms comprehensive, no false matches, regex patterns tested, multi-language coverage",
        "- **Pipeline Review**: Pre-LLM and post-LLM moderation both active, no bypass paths, error handling for safety API failures",
        "- **Human Review Review**: Queue configured, SLA set, appeal workflow works, reviewer training documented",
        "- **APIM Policy Review**: Content Safety policy correctly positioned in pipeline, latency impact acceptable, caching appropriate",
        "- **Security Review**: Content Safety API key in Key Vault, managed identity, audit logs enabled, no PII in moderation logs",
        "- **Performance Review**: Moderation latency <100ms, not bottleneck in request pipeline, async where possible",
        "- **Test Review**: Adversarial inputs tested, edge cases (borderline content, multi-language, encoded text), false positive tested",
        "- **Compliance Review**: Meets platform requirements (COPPA/DSA), regional rules configured, age-gating implemented",
    ],
    "play-10-tuner": [
        "- **Severity Threshold Tuning**: Per-category thresholds (hate=2, violence=3, sexual=2, self-harm=1), audience-appropriate levels",
        "- **Blocklist Optimization**: Term precision (no over-matching), coverage analysis, multi-language term expansion",
        "- **Custom Category Config**: Domain-specific rules, confidence thresholds, training data for custom classifiers",
        "- **Routing Optimization**: Block/review/pass distribution, human review capacity matching, escalation priority",
        "- **False Positive Reduction**: Threshold relaxation analysis, context-aware moderation, appeal data analysis",
        "- **Performance Tuning**: Batch vs real-time trade-off, caching for repeated content, async processing for non-blocking",
        "- **Cost Analysis**: Content Safety API calls per month, human review costs, infrastructure costs, total cost per moderation",
        "- **A/B Testing**: Threshold variants, custom category inclusion, blocklist coverage, routing strategy comparison",
        "- **Evaluation**: False positive rate <5%, false negative <1%, moderation latency <100ms, human override rate <10%",
        "- **Production Readiness**: All thresholds calibrated, blocklists complete, human review queue active, monitoring configured",
    ],
    "play-11-builder": [
        "- **Multi-Region Hub-Spoke**: Hub VNets per region, cross-region peering via Global VNet Peering, shared services replication",
        "- **Azure Firewall Premium**: TLS inspection, IDPS signatures, threat intelligence feeds, application rules, FQDN tags",
        "- **Policy-Driven Governance**: Azure Policy initiatives (200+ policies), automatic remediation, compliance dashboard, exemptions",
        "- **GPU Quota Orchestration**: Cross-subscription quota pooling, regional capacity tracking, quota increase automation",
        "- **Disaster Recovery**: Multi-region active-passive, Azure Site Recovery, geo-replicated storage, DNS failover (Traffic Manager)",
        "- **Network Security**: NSG flow logging, Network Watcher, DDoS Protection Standard, Azure Bastion for secure access",
        "- **Identity at Scale**: Entra ID tenant hardening, conditional access policies, PIM for admin, workload identity federation",
        "- **Cost Governance**: Budget hierarchy (MG→Sub→RG), cost allocation tags, advisor automation, savings plan analysis",
        "- **Compliance Frameworks**: CIS Azure Benchmark, NIST 800-53, PCI DSS, HIPAA — mapped to Azure Policy initiatives",
        "- **Automation**: Bicep modules library, subscription vending machine, landing zone accelerator, drift detection pipeline",
    ],
    "play-11-reviewer": [
        "- **Multi-Region Review**: Peering configured correctly, routing tables consistent, no asymmetric paths, failover tested",
        "- **Firewall Review**: Rules follow least-privilege, IDPS enabled, TLS inspection scope appropriate, logging to Log Analytics",
        "- **Policy Review**: Initiatives complete for compliance framework, no unnecessary exemptions, remediation tasks running",
        "- **GPU Review**: Quota allocation matches workload forecast, capacity reserved for production, spot configured for dev",
        "- **DR Review**: RPO/RTO targets met, failover tested, runbooks documented, data replication lag acceptable",
        "- **Network Security Review**: NSG rules minimal and explicit, flow logs analyzed, no orphan public IPs, DDoS configured",
        "- **Identity Review**: Conditional access complete, PIM configured for all admin roles, no standing access, MFA enforced",
        "- **Cost Review**: Budgets aligned with forecast, tag compliance >95%, no idle resources, reservation coverage optimal",
        "- **Compliance Review**: All required controls mapped, evidence collected, gaps documented with remediation timeline",
        "- **Automation Review**: Bicep modules tested, subscription vending works, drift detection catching changes, alerts configured",
    ],
    "play-11-tuner": [
        "- **Network Tuning**: VNet CIDR future-proofing (/16 per region), subnet sizing, peering bandwidth, UDR optimization",
        "- **Firewall Tuning**: Rule priority ordering (most-used first), IDPS signature selection, TLS inspection exclusions, log retention",
        "- **Policy Tuning**: Effect progression (audit → modify → deny), scope minimization, parameter tuning, change impact analysis",
        "- **GPU Tuning**: Per-workload GPU type (T4 inference, A100 training, H100 fine-tuning), reservation vs spot allocation",
        "- **DR Tuning**: RPO/RTO refinement, replication frequency, failover automation, recovery testing schedule (quarterly)",
        "- **Cost Tuning**: Reservation coverage (>80% stable), savings plan analysis, auto-shutdown dev (7pm-7am), storage tiering",
        "- **Compliance Tuning**: Policy exception review (quarterly), new control mapping, audit evidence automation improvement",
        "- **Identity Tuning**: Conditional access risk tuning, PIM activation policies, access review schedules, guest access policies",
        "- **Monitoring Tuning**: Log Analytics commitment tier, diagnostic category selection (reduce noise), alert threshold calibration",
        "- **Production Readiness**: All regions tested, failover exercised, compliance scan green, cost within budget, alerts active",
    ],
    "play-12-builder": [
        "- **AKS GPU Cluster**: NC/ND series node pools, NVIDIA device plugin, GPU operator, MIG partitioning for multi-tenant",
        "- **vLLM Serving**: PagedAttention for memory efficiency, continuous batching, multi-LoRA serving, OpenAI-compatible API",
        "- **Model Management**: ACR for container images, model weights in Azure Files/Blob, version tagging, A/B canary deployment",
        "- **Auto-Scaling**: HPA on GPU utilization + request queue depth, cluster autoscaler for node pools, KEDA for event-driven",
        "- **Networking**: Internal load balancer for private serving, Ingress controller (NGINX), network policies, VNet integration",
        "- **Health Probes**: Readiness (model loaded), liveness (inference working), startup (weight download complete), graceful drain",
        "- **Quantization**: GPTQ (4-bit), AWQ, bitsandbytes — quality vs memory vs speed tradeoff selection per model",
        "- **Monitoring**: Prometheus + Grafana for GPU metrics (utilization/temp/memory), inference latency, throughput, error rates",
        "- **Security**: Pod security standards, workload identity for ACR/KV, image scanning (Trivy), network policies, no root",
        "- **Cost**: Spot VMs for dev (70% savings), reserved instances for prod, right-size GPU (T4 for small models, A100 for 70B+)",
    ],
    "play-12-reviewer": [
        "- **Cluster Review**: Node pool configuration appropriate, GPU SKU matches model size, autoscaler limits set, taints/tolerations",
        "- **Model Serving Review**: vLLM config optimal, batch size appropriate, memory allocation efficient, API compatibility verified",
        "- **Scaling Review**: HPA thresholds tested, cluster autoscaler responsive, scale-up time acceptable, scale-down safe (drain)",
        "- **Security Review**: Pod security enforced, workload identity configured, no root containers, image scanning in CI",
        "- **Network Review**: Internal LB only (no public), network policies restrict traffic, VNet integrated, DNS resolves correctly",
        "- **Health Probe Review**: Startup accounts for model download time, readiness reflects actual inference capability, liveness appropriate",
        "- **Monitoring Review**: GPU metrics collected, dashboards useful, alerts configured (OOM, latency spike, error rate)",
        "- **Cost Review**: GPU utilization >70%, spot used for non-prod, reserved instances for stable prod, no idle nodes",
        "- **Performance Review**: Inference latency meets SLO, throughput sufficient for projected load, quantization quality acceptable",
        "- **DR Review**: Model weights backed up, cluster config in IaC, node pool recreation tested, traffic failover works",
    ],
    "play-12-tuner": [
        "- **GPU SKU Selection**: T4 (16GB, inference small), A10G (24GB, medium), A100 (80GB, large/training), H100 (80GB, fine-tuning)",
        "- **vLLM Tuning**: max_num_batched_tokens, gpu_memory_utilization (0.85-0.95), tensor_parallel_size, quantization selection",
        "- **Scaling Rules**: HPA target GPU utilization (70-85%), queue depth threshold, scale-up cooldown (60s), scale-down (300s)",
        "- **Quantization Decision**: FP16 (baseline), INT8 (2x throughput, ~1% quality loss), INT4 (4x, ~3% loss) — benchmark per model",
        "- **Batch Tuning**: Dynamic batching max_batch_size, max_waiting_time, continuous batching for streaming, padding optimization",
        "- **Node Pool Config**: Min/max nodes, node taints, spot vs regular mix, availability zones, upgrade strategy",
        "- **Cost Analysis**: GPU cost per hour, inference cost per 1K tokens, total monthly by model size, reserved vs on-demand break-even",
        "- **A/B Deployment**: Traffic splitting between model versions, quality comparison, latency comparison, rollback criteria",
        "- **Evaluation**: Inference latency p50/p95/p99, throughput (tokens/sec), GPU utilization, model quality (same as non-quantized)",
        "- **Production Readiness**: Load test passed, failover tested, monitoring active, cost within budget, rollback procedure verified",
    ],
};
console.log("═══ Section 26 B12: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B12 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
