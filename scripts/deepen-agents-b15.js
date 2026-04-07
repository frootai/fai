const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(140, 150);
const expertiseMap = {
    "play-19-tuner": [
        "- **Quantization Selection**: INT4 (2GB, fastest, ~3% quality drop), INT8 (4GB, balanced, ~1%), FP16 (8GB, best, baseline)",
        "- **Latency Tuning**: On-device target <500ms, batch inference for non-interactive, pre-load model to memory on boot",
        "- **Sync Schedule**: Hourly (real-time critical), daily (standard), weekly (stable models), manual (controlled environments)",
        "- **Fallback Threshold**: Latency >1s OR quality score <0.7 → route to cloud, configurable per device group",
        "- **Memory Config**: max_memory_mb based on device class (512MB mobile, 2GB tablet, 4GB edge server), swap disabled",
        "- **Battery Optimization**: Inference only on charging (optional), batch idle-time processing, power-aware scheduling",
        "- **Fleet Rollout**: 1% canary → 10% early adopters → 50% staged → 100% GA, health check gate between stages",
        "- **Model Cache**: Cache size (1-3 models), LRU eviction, pre-download next version in background, integrity verification",
        "- **Telemetry Config**: Inference count, latency distribution, fallback rate, error rate, sync health — interval configurable",
        "- **Production Readiness**: Target hardware benchmarked, offline tested (72hr), sync verified, battery profiled, fleet healthy",
    ],
    "play-20-builder": [
        "- **Event Hub Ingestion**: Partitioned streaming (32-128 partitions), schema registry (Avro), auto-inflate throughput units",
        "- **Stream Analytics**: Windowing functions (tumbling/hopping/sliding/session), anomaly detection (SpikeAndDip/AnomalyDetection)",
        "- **LLM Enrichment**: GPT-4o-mini for event classification, anomaly explanation, correlation analysis, alert summarization",
        "- **Scoring Pipeline**: Statistical (z-score/IQR) → ML (isolation forest) → LLM (context explanation), multi-signal fusion",
        "- **Alert Engine**: Severity classification (P1-P4), routing rules (PagerDuty/Slack/email), deduplication, suppression rules",
        "- **Baseline Learning**: Rolling baseline (24hr-168hr window), seasonal adjustment, trend removal, adaptive thresholds",
        "- **Real-Time Dashboard**: SignalR for live updates, Grafana/Azure Workbook, drill-down from alert to raw events",
        "- **Cosmos DB Storage**: Time-series partitioning, TTL for event data, anomaly archive, aggregation materialized views",
        "- **Functions Processing**: Event Hub trigger (batch mode), parallel processing, checkpoint management, dead-letter handling",
        "- **Evaluation**: Detection precision ≥95%, recall ≥90%, alert latency <30s, false positive rate <5%, dashboard latency <2s",
    ],
    "play-20-reviewer": [
        "- **Ingestion Review**: Partition count matches throughput needs, schema validation active, no data loss, ordering preserved",
        "- **Analytics Review**: Windowing correct for use case, anomaly detection algorithms appropriate, output schema validated",
        "- **Scoring Review**: Multi-signal fusion logic sound, thresholds calibrated, false positive/negative rates acceptable",
        "- **Alert Review**: Severity mapping correct, routing rules tested, dedup working, suppression prevents alert storms",
        "- **Baseline Review**: Learning window sufficient, seasonal patterns captured, not overfitting to recent anomalies",
        "- **Security Review**: Event Hub managed identity, encrypted at rest/transit, private endpoints, no sensitive data in alerts",
        "- **Performance Review**: End-to-end latency <30s, processing throughput matches ingestion, no consumer lag buildup",
        "- **Dashboard Review**: Real-time updates working, drill-down functional, filters useful, accessible to on-call team",
        "- **Error Handling Review**: Dead-letter queue configured, poison event handling, retry policies appropriate, monitoring alerts",
        "- **Test Review**: Anomaly injection tested, load test at peak, historical replay, baseline convergence verified",
    ],
    "play-20-tuner": [
        "- **Window Size**: 1min (real-time fraud), 5min (IoT), 15min (traffic), 1hr (business metrics) — match to detection speed need",
        "- **Anomaly Threshold**: z-score 2.0 (sensitive), 2.5 (balanced), 3.0 (conservative), adjust by false positive tolerance",
        "- **Baseline Window**: 24hr (fast adaptation), 72hr (stable), 168hr (seasonal capture), seasonal_period for weekly patterns",
        "- **Alert Severity Rules**: P1 (z>4.0, multiple signals), P2 (z>3.0), P3 (z>2.5, single signal), P4 (z>2.0, informational)",
        "- **LLM Enrichment Config**: temperature=0.1 (factual), max_tokens=200 (concise alerts), model=gpt-4o-mini (cost-effective)",
        "- **Dedup Config**: Time window (5min), key fields (source+type+severity), suppression cooldown per alert rule",
        "- **Dashboard Refresh**: Live (SignalR for active incidents), 30s (monitoring), 5min (trending), 1hr (historical analysis)",
        "- **Cost Analysis**: Event Hub throughput units, Stream Analytics SU, Functions executions, Cosmos DB RU, LLM token usage",
        "- **A/B Testing**: Threshold variants, windowing strategies, scoring algorithms, alert routing paths — measure precision+recall",
        "- **Production Readiness**: Baseline converged, thresholds calibrated, alerts tested, dashboard published, on-call configured",
    ],
    "play-21-builder": [
        "- **Autonomous Retrieval**: Agent decides WHEN to search, WHICH sources to query, HOW MANY iterations to refine results",
        "- **Multi-Source Fusion**: AI Search + web + database + API — source selection based on query type, result merging strategy",
        "- **Iterative Refinement**: Query decomposition, sub-question generation, result evaluation, re-query if insufficient quality",
        "- **Citation Pipeline**: Per-paragraph source attribution, citation confidence scoring, multi-source synthesis with provenance",
        "- **Self-Reflection**: Agent evaluates own answer quality, identifies gaps, determines if another retrieval round is needed",
        "- **Query Decomposition**: Complex question → sub-questions, parallel retrieval, result aggregation, answer synthesis",
        "- **Source Ranking**: Relevance scoring per source, freshness weighting, authority assessment, diversity requirement",
        "- **Tool Calling**: MCP tool integration for structured data, API queries, database lookups, calculator, code execution",
        "- **Container Apps**: Stateful agent with Cosmos DB conversation store, health checks, auto-scaling, VNet isolation",
        "- **Evaluation**: Answer quality ≥0.90 groundedness, citation accuracy ≥95%, avg iterations <3, cost per answer <$0.05",
    ],
    "play-21-reviewer": [
        "- **Autonomy Review**: Agent search decisions appropriate, not over-retrieving (cost) or under-retrieving (quality)",
        "- **Source Review**: All configured sources accessible, selection logic sound, no bias toward specific sources",
        "- **Iteration Review**: Max iterations enforced, convergence criteria defined, no infinite loops, diminishing returns detected",
        "- **Citation Review**: Attribution accurate, no fabricated citations, multi-source synthesis correctly attributed",
        "- **Reflection Review**: Self-evaluation criteria meaningful, gap detection works, improvement measurable across iterations",
        "- **Tool Review**: MCP tools correctly configured, parameter validation, result handling, error recovery",
        "- **Security Review**: Source access authenticated, no credential leakage, PII handled in retrieved content, private endpoints",
        "- **Performance Review**: Per-iteration latency acceptable, total answer time within SLO, concurrent requests handled",
        "- **Cost Review**: Per-answer cost tracked, iteration efficiency (quality gain per iteration), caching for repeated sub-queries",
        "- **Test Review**: Complex multi-hop questions tested, adversarial queries, source failure scenarios, iteration timeout",
    ],
    "play-21-tuner": [
        "- **Iteration Depth**: max_iterations 1 (simple Q&A), 3 (standard), 5 (research), configurable per query complexity",
        "- **Source Weights**: AI Search 0.6, web 0.2, database 0.2 (default), adjustable per domain, freshness boost for web",
        "- **Reflection Threshold**: quality_score <0.7 → re-retrieve, <0.5 → decompose differently, ≥0.85 → accept and respond",
        "- **Citation Config**: min_citations=1, max_citations=5, citation_format (inline/footnote), confidence_display enabled",
        "- **Query Decomposition**: max_sub_questions=4, parallel_execution=true, synthesis_strategy (merge/compare/hierarchical)",
        "- **Tool Budget**: max_tool_calls_per_answer=10, per-tool timeout=5s, total budget per answer ≤$0.05",
        "- **Caching**: Sub-query result cache TTL=5min, embedding cache for repeated docs, source metadata cache=1hr",
        "- **A/B Testing**: Iteration depth variants, source weight distributions, reflection thresholds, citation formats",
        "- **Evaluation**: Groundedness ≥0.90, citation accuracy ≥95%, iterations ≤3 avg, cost ≤$0.05/answer, latency p95 <10s",
        "- **Production Readiness**: All sources validated, iteration limits tested, cost budget enforced, monitoring active, cache warm",
    ],
    "play-22-builder": [
        "- **Swarm Architecture**: Mesh/star/hierarchical topology selection, agent registry, capability-based routing, dynamic scaling",
        "- **Supervisor Agent**: Task decomposition, agent assignment, progress monitoring, result aggregation, conflict resolution",
        "- **Agent Specialization**: Domain-specific agents (researcher, coder, analyst, writer), tool allocation per specialization",
        "- **Shared Memory**: Cosmos DB for persistent state, Redis for fast session, Service Bus for async messaging, vector memory (AI Search)",
        "- **Conflict Resolution**: Voting (majority wins), weighted expertise, supervisor override, consensus through debate",
        "- **Loop Detection**: Visited-state tracking, cycle detection, max iterations (10), forced convergence with summary",
        "- **Service Bus Messaging**: Agent-to-agent queues, topic-based pub/sub, session-based ordering, dead-letter for failures",
        "- **Container Apps**: Agent-per-container, independent scaling, shared VNet, Dapr for service discovery, health probes",
        "- **Cost Control**: Per-agent token budget, per-swarm total budget, model selection per agent, early termination on budget",
        "- **Evaluation**: Task completion ≥90%, quality consensus ≥85%, avg agents used ≤4, cost per swarm ≤$0.20, latency <30s",
    ],
    "play-22-reviewer": [
        "- **Topology Review**: Architecture matches task complexity, no over-provisioning of agents, scaling rules appropriate",
        "- **Supervisor Review**: Task decomposition quality, assignment logic sound, monitoring covers all agents, aggregation correct",
        "- **Specialization Review**: Agent capabilities well-defined, no overlap causing confusion, tool allocation appropriate",
        "- **Memory Review**: State management consistent, no data races, TTL appropriate, memory doesn't grow unbounded",
        "- **Conflict Review**: Resolution strategy appropriate for domain, voting mechanism fair, supervisor override documented",
        "- **Loop Review**: Detection working, max iterations enforced, forced summary is useful, no infinite cost scenarios",
        "- **Messaging Review**: Queue configuration correct, dead-letter handling, session ordering where needed, throughput sufficient",
        "- **Security Review**: Agent-to-agent auth, no privilege escalation, token budgets enforced, audit trail for decisions",
        "- **Cost Review**: Total swarm cost tracked, per-agent breakdown, budget enforcement working, early termination tested",
        "- **Test Review**: Multi-agent scenarios, agent failure, concurrent swarms, consensus accuracy, scale testing",
    ],
    "play-22-tuner": [
        "- **Topology Selection**: Star (simple, supervisor bottleneck), mesh (flexible, complex), hierarchical (scalable, layered control)",
        "- **Agent Count**: 2-3 (focused tasks), 4-6 (research/analysis), 7+ (complex multi-domain), budget-constrained upper limit",
        "- **Consensus Config**: Majority vote (fast), weighted expertise (quality), full consensus (critical decisions), timeout fallback",
        "- **Memory TTL**: Redis session: 30min, Cosmos DB conversation: 24hr, vector memory: 7 days, archive: 30 days",
        "- **Budget Allocation**: Per-agent: mini=500 tokens, standard=2000, lead=5000, total swarm cap from config",
        "- **Messaging Config**: Queue prefetch=10, session lock=60s, dead-letter max_delivery=3, message TTL=1hr",
        "- **Scaling Rules**: Min agents=2 (always), max per Container Apps revision, scale trigger=queue depth>10",
        "- **A/B Testing**: Topology variants, agent count configurations, consensus strategies, memory modes, budget allocations",
        "- **Evaluation**: Completion ≥90%, consensus quality ≥85%, agents ≤4 avg, cost ≤$0.20, latency <30s, no infinite loops",
        "- **Production Readiness**: All topologies tested, budget enforcement verified, loop detection confirmed, monitoring active",
    ],
};
console.log("═══ Section 26 B15: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B15 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
