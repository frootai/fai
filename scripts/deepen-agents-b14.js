const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(130, 140);
const expertiseMap = {
    "play-16-reviewer": [
        "- **Copilot Extension Review**: Declarative agent schema valid, TypeSpec API correct, message extension commands functional",
        "- **Graph API Review**: Permission scopes minimal (least privilege), batch requests optimized, error handling for throttling",
        "- **Adaptive Card Review**: Card templates render correctly in Teams, actions work, data binding complete, accessibility checked",
        "- **Authentication Review**: SSO flow tested, token caching working, consent prompt appropriate, guest access controlled",
        "- **Knowledge Review**: SharePoint sources relevant, Graph connector indexed, Dataverse entities accessible, freshness maintained",
        "- **Security Review**: Admin consent documented, DLP policies applied, no data leakage, tenant isolation, audit logging",
        "- **Performance Review**: Response time <3s, Graph API latency acceptable, Function cold start mitigated, caching configured",
        "- **Deployment Review**: Teams manifest valid, admin center publishing tested, environment promotion works, rollback procedure ready",
        "- **User Testing Review**: Representative user group tested, feedback incorporated, edge cases handled, accessibility (WCAG AA)",
        "- **Compliance Review**: Data residency requirements met, information barriers respected, eDiscovery compatible, retention policies",
    ],
    "play-16-tuner": [
        "- **Permission Tuning**: Minimize Graph scopes (User.Read → User.Read.All only if needed), delegated vs application context",
        "- **Response Quality**: Tone calibration (professional/casual/match-brand), length optimization, citation formatting for Teams",
        "- **Knowledge Config**: SharePoint site selection, refresh schedule, chunk size for grounding, relevance scoring threshold",
        "- **Adaptive Card Tuning**: Card complexity level, action button count, information density, mobile rendering optimization",
        "- **Conversation Tuning**: Max turns before summary, context window management, disambiguation triggers, escalation threshold",
        "- **Performance Tuning**: Function pre-warming, Graph API batching, response caching for common queries, Connection keep-alive",
        "- **A/B Testing**: Greeting variations, response styles, knowledge source comparison, card layout alternatives",
        "- **Cost Analysis**: Function execution cost, Graph API call volume, OpenAI token usage, total cost per conversation",
        "- **Evaluation**: Task completion ≥85%, user satisfaction (NPS > 30), response time <3s, Graph error rate <1%",
        "- **Production Readiness**: All permissions approved, knowledge sources verified, Teams manifest published, monitoring active",
    ],
    "play-17-builder": [
        "- **Application Insights**: Distributed tracing, dependency tracking, custom events/metrics, live metrics stream, availability tests",
        "- **Log Analytics Workspace**: Centralized log collection, KQL query library, data retention policies, workspace access RBAC",
        "- **KQL Query Library**: Token usage tracking, latency percentiles (p50/p95/p99), error rate trending, quality score aggregation",
        "- **Azure Workbooks**: Interactive dashboards, parameterized queries, cross-workspace visualization, export/scheduling",
        "- **Alert Rules**: Metric alerts (latency spike), log alerts (error patterns), smart detection (anomalies), action groups",
        "- **AI-Specific Metrics**: Groundedness scores over time, coherence trending, cost per query by model, token usage by team",
        "- **Custom Telemetry**: OpenTelemetry SDK, custom dimensions (play_id, model, user_team), correlation ID propagation",
        "- **SLO/SLI Tracking**: Availability (99.9%), latency p95 (<3s), error rate (<1%), quality score (>0.85), error budget burn rate",
        "- **Cost Monitoring**: Log Analytics ingestion cost tracking, commitment tier selection, data sampling for cost reduction",
        "- **Evaluation**: Dashboard load time <5s, alert latency <5min, KQL query performance, data freshness, coverage completeness",
    ],
    "play-17-reviewer": [
        "- **Telemetry Review**: All services sending data, correlation IDs propagated, custom dimensions populated, no PII in logs",
        "- **KQL Review**: Queries efficient (no full scans), results accurate, time ranges appropriate, parameterized for reuse",
        "- **Dashboard Review**: Workbooks informative, layout logical, filters work, refresh rate appropriate, accessible to stakeholders",
        "- **Alert Review**: Thresholds calibrated (no alert fatigue), action groups configured, escalation paths defined, tested",
        "- **SLO Review**: Targets realistic, measurement accurate, error budget tracking works, burn rate alerts configured",
        "- **Security Review**: Workspace RBAC configured, sensitive data excluded from logs, managed identity for data collection",
        "- **Performance Review**: Log Analytics query performance, ingestion latency, dashboard render time, alert processing delay",
        "- **Cost Review**: Ingestion volume within budget, commitment tier appropriate, data retention optimized, sampling configured",
        "- **Coverage Review**: All AI services instrumented, custom metrics for quality, user journey tracked, dependencies mapped",
        "- **Documentation Review**: KQL query library documented, dashboard guide, alert runbooks, SLO definitions published",
    ],
    "play-17-tuner": [
        "- **Log Analytics Tuning**: Commitment tier selection (100GB→500GB→1TB), data retention (30→90→180 days), archive for cold data",
        "- **Sampling Config**: Adaptive sampling rate (0.1→1.0), fixed sampling for high-volume endpoints, no sampling for errors",
        "- **Alert Threshold Tuning**: Latency p95 (3s→5s by endpoint), error rate (1%→5% by severity), quality score (0.85 minimum)",
        "- **Dashboard Optimization**: Refresh interval (5min for real-time, 1hr for trends), query time range defaults, cache settings",
        "- **KQL Optimization**: Materialize for repeated joins, summarize with bin for time series, project early to reduce data scan",
        "- **Custom Metric Tuning**: Dimension cardinality control, aggregation intervals, pre-aggregation for high-volume metrics",
        "- **SLO Tuning**: Target adjustment based on historical data, error budget window (30-day rolling), burn rate alert sensitivity",
        "- **Cost Optimization**: Diagnostic category selection (exclude verbose categories), ingestion transform rules, workspace purge",
        "- **A/B Testing**: Compare alert strategies, dashboard layouts, retention policies, sampling rates on quality of insights",
        "- **Production Readiness**: All metrics flowing, dashboards published, alerts tested, SLOs active, cost within budget",
    ],
    "play-18-builder": [
        "- **Prompt Versioning**: Semantic versioning (major.minor.patch), git-based storage, diff visualization, rollback capability",
        "- **A/B Testing Framework**: Traffic splitting (90/10 → 50/50), metric collection per variant, statistical significance calculator",
        "- **Azure Prompt Flow**: Visual editor, flow debugging, batch testing, deployment to managed endpoint, connection management",
        "- **Template Engine**: Variable injection ({user_name}, {context}), conditional sections, few-shot example management, includes",
        "- **Environment Promotion**: Dev → staging → prod pipeline, approval gates, automated quality checks, canary deployment",
        "- **Evaluation Pipeline**: Per-prompt quality scoring (groundedness/coherence/relevance), regression detection, human eval",
        "- **Few-Shot Management**: Example versioning, example selection strategy (random/similar/diverse), token budget for examples",
        "- **Chain-of-Thought Variants**: Standard CoT, zero-shot CoT, self-consistency, tree-of-thought — compare via A/B testing",
        "- **Cosmos DB Storage**: Prompt versions with metadata, evaluation results, A/B test configurations, usage analytics",
        "- **Evaluation**: Prompt quality score ≥0.85, A/B test statistical power >0.8, deployment success rate 100%, rollback time <1min",
    ],
    "play-18-reviewer": [
        "- **Version Review**: Semantic versioning followed, changelog maintained, breaking changes documented, backward compatibility",
        "- **A/B Test Review**: Traffic split configured correctly, metrics meaningful, sample size sufficient, bias controlled",
        "- **Template Review**: Variables documented, injection safe (no prompt injection via variables), conditional logic tested",
        "- **Pipeline Review**: Dev→staging→prod gates configured, approval process clear, automated checks pass, rollback tested",
        "- **Few-Shot Review**: Examples relevant and diverse, token budget respected, no PII in examples, examples versioned",
        "- **CoT Review**: Appropriate reasoning strategy selected, token overhead acceptable, quality improvement measured",
        "- **Security Review**: No secrets in prompt templates, PII handling in few-shots, access control on prompt storage",
        "- **Evaluation Review**: Quality metrics appropriate, regression baseline set, human eval protocol defined, sample size adequate",
        "- **Performance Review**: Prompt Flow latency, template rendering overhead, Cosmos DB query performance, deployment speed",
        "- **Documentation Review**: Prompt catalog maintained, decision log for major changes, A/B test results archived",
    ],
    "play-18-tuner": [
        "- **Prompt Optimization**: System message clarity, instruction specificity, output format enforcement, anti-hallucination clauses",
        "- **Few-Shot Tuning**: Example count (2-5), selection strategy, example ordering (best first), token budget allocation",
        "- **A/B Test Config**: Minimum sample size (100+ per variant), traffic split progression, metrics: quality + cost + latency",
        "- **Template Variables**: Default values, validation rules, type constraints, escaping for safety, documentation",
        "- **Environment Config**: Dev (experimental prompts allowed), staging (quality gate required), prod (approval + evaluation pass)",
        "- **CoT Selection**: Task complexity → reasoning strategy mapping, token budget per strategy, quality vs cost tradeoff",
        "- **Rollback Config**: One-click rollback, version pinning, canary detection (quality drop >5% → auto-rollback), alert on regression",
        "- **Cost Analysis**: Token usage per prompt version, few-shot token overhead, A/B test operational cost, storage costs",
        "- **Evaluation Thresholds**: Groundedness ≥0.85, coherence ≥0.80, regression tolerance <5%, A/B significance p<0.05",
        "- **Production Readiness**: Current prompt version evaluated, A/B baseline set, rollback tested, monitoring active, catalog updated",
    ],
    "play-19-builder": [
        "- **Phi-4 Deployment**: Phi-4-mini (3.8B) for on-device inference, ONNX Runtime for cross-platform, quantized (INT4/INT8)",
        "- **ONNX Quantization**: INT4 (smallest, ~3% quality loss), INT8 (balanced), FP16 (best quality), benchmarking per use case",
        "- **Azure IoT Hub**: Device registration, twin management, D2C/C2D messaging, OTA model updates, fleet management",
        "- **Offline Capability**: Local model inference when disconnected, request queuing, sync on reconnect, conflict resolution",
        "- **Cloud Fallback**: Quality/latency threshold → route to Azure OpenAI, seamless switch, user-transparent, metric comparison",
        "- **Edge Fleet Management**: Device groups, staged rollout (1%→10%→50%→100%), health monitoring, remote diagnostics",
        "- **Memory Optimization**: Model memory footprint (INT4: ~2GB, INT8: ~4GB, FP16: ~8GB), inference batch sizing, cache management",
        "- **Battery Optimization**: Inference scheduling (idle time), batch processing, sleep mode between requests, power profiling",
        "- **Security**: Encrypted model storage on device, device attestation, secure boot chain, certificate-based auth to IoT Hub",
        "- **Evaluation**: On-device latency <500ms, quality within 5% of cloud, battery impact <10%, sync reliability >99.9%",
    ],
    "play-19-reviewer": [
        "- **Model Quality Review**: Quantized model quality vs full precision, task-specific benchmarks, acceptable degradation threshold",
        "- **Offline Review**: Queue management, data persistence, sync conflict resolution, offline UX indication",
        "- **Fallback Review**: Cloud fallback triggers appropriate, transition seamless, no data loss, billing tracked for cloud usage",
        "- **Fleet Review**: Staged rollout configured, health checks defined, rollback on failure rate spike, monitoring per device group",
        "- **Security Review**: Device attestation enabled, model encrypted at rest, secure OTA channel, certificate rotation policy",
        "- **Performance Review**: Inference latency on target hardware, memory within limits, battery impact acceptable, startup time",
        "- **IoT Hub Review**: Device provisioning secure, twin schema defined, C2D message handling, telemetry ingestion configured",
        "- **Compatibility Review**: Target device list verified, OS versions supported, ONNX Runtime version compatible, hardware limits",
        "- **Test Review**: On-device testing (representative hardware), offline scenario testing, sync testing, battery drain measurement",
        "- **Cost Review**: Device-side compute vs cloud cost comparison, IoT Hub messaging costs, OTA bandwidth, fleet management overhead",
    ],
};
console.log("═══ Section 26 B14: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B14 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
