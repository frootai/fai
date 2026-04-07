const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(100, 110);
const expertiseMap = {
    "play-06-reviewer": [
        "- **OCR Quality Review**: Field extraction accuracy per document type, table detection completeness, handwriting recognition quality",
        "- **Schema Validation**: Extracted JSON matches expected schema, required fields present, data types correct, null handling",
        "- **PII Review**: PII detection coverage (email/phone/SSN/address), masking applied before storage, audit trail for PII access",
        "- **Pipeline Review**: Upload → OCR → classify → extract → validate → store chain, error handling at each stage, retry logic",
        "- **Confidence Review**: Per-field confidence thresholds appropriate, low-confidence routing to human review queue",
        "- **Performance Review**: Processing time per page (<30s), batch throughput, queue depth monitoring, auto-scaling triggers",
        "- **Security Review**: Managed identity for Doc Intelligence + Cosmos DB, encrypted storage, access control, private endpoints",
        "- **Config Review**: Extraction schemas, confidence thresholds, supported document types, output format settings",
        "- **Test Review**: Sample documents per type tested, edge cases (rotated/skewed/low-res), multi-page documents, empty pages",
        "- **Integration Review**: Cosmos DB partition key design, change feed consumers, downstream notification, API contract",
    ],
    "play-06-tuner": [
        "- **Extraction Tuning**: Custom model training data, field-level confidence thresholds (0.8-0.95), extraction prompt refinement",
        "- **Classification Tuning**: Document type taxonomy, classification confidence threshold, multi-label handling, unknown type routing",
        "- **OCR Settings**: Language hint, page segmentation mode, handwriting vs print detection, image preprocessing (deskew/denoise)",
        "- **Performance Tuning**: Batch size optimization, parallel page processing, pre-processing pipeline, caching for repeat docs",
        "- **Confidence Calibration**: Human review threshold (confidence < 0.85), auto-approve threshold (> 0.95), sampling for quality",
        "- **Output Format**: JSON schema evolution, backward compatibility, field naming conventions, nested object handling",
        "- **Cost Analysis**: Doc Intelligence per-page pricing, GPT-4o extraction cost, storage costs, human review cost per document",
        "- **A/B Testing**: Pre-built vs custom models, extraction prompt variants, confidence threshold comparison",
        "- **Evaluation**: Field accuracy ≥95%, table detection ≥90%, classification ≥98%, end-to-end processing ≤30s/page",
        "- **Production Readiness**: All document types tested, confidence calibrated, PII handling verified, monitoring active",
    ],
    "play-07-builder": [
        "- **Supervisor Pattern**: Central orchestrator agent routes tasks to specialist agents based on intent classification",
        "- **Agent Registry**: Dynamic agent discovery, capability matching, load-based selection, version management",
        "- **Shared State**: Cosmos DB for conversation context, Redis for fast session state, structured handoff protocol",
        "- **Dapr Integration**: Service invocation for agent-to-agent calls, pub/sub for async events, state store for context",
        "- **Tool Routing**: MCP tool delegation to specialist agents, tool result aggregation, conflict resolution",
        "- **Loop Prevention**: Max iteration limits (10), visited-state tracking, cycle detection, forced termination with summary",
        "- **Memory Management**: Short-term (Redis TTL), long-term (Cosmos DB), episodic (AI Search vectors), memory consolidation",
        "- **Error Handling**: Agent failure isolation, fallback to supervisor, partial result handling, compensation workflows",
        "- **Container Apps**: Each agent as separate container revision, independent scaling, shared VNet, service discovery",
        "- **Evaluation**: Task completion rate >90%, delegation accuracy >95%, avg iterations <5, cost per orchestration <$0.10",
    ],
    "play-07-reviewer": [
        "- **Orchestration Review**: Supervisor routing logic, agent selection criteria, task decomposition quality, result aggregation",
        "- **State Management Review**: Handoff protocol completeness, context preservation, no data loss between agents, TTL appropriate",
        "- **Loop Prevention Review**: Max iteration enforced, cycle detection works, termination produces useful summary",
        "- **Security Review**: Agent-to-agent auth (managed identity), no privilege escalation, tool permissions scoped per agent",
        "- **Dapr Review**: Service invocation configured, pub/sub topics defined, state store connection secure, retry policies set",
        "- **Performance Review**: Orchestration latency acceptable, parallel agent execution where possible, no unnecessary sequential waits",
        "- **Memory Review**: Memory tiers correctly configured, consolidation schedule appropriate, no unbounded growth",
        "- **Error Handling Review**: Agent failure isolated, fallback paths defined, partial results usable, compensation tested",
        "- **Test Review**: Multi-agent scenario tests, agent failure simulation, concurrent request handling, scale testing",
        "- **Cost Review**: Per-agent token budgets enforced, total orchestration budget, model selection per agent appropriate",
    ],
    "play-07-tuner": [
        "- **Supervisor Config**: Routing rules, agent capability matrix, intent-to-agent mapping, confidence threshold for delegation",
        "- **Agent Budgets**: Per-agent max_tokens, per-orchestration total budget, model selection per agent (mini for triage, 4o for reasoning)",
        "- **Loop Limits**: max_iterations=10 (tighten for simple tasks, loosen for research), timeout per iteration, cooldown between retries",
        "- **Memory Config**: Redis TTL (session: 30min, context: 24hr), Cosmos DB retention (30 days), vector memory refresh schedule",
        "- **Dapr Tuning**: Service invocation timeout, pub/sub delivery guarantees, state store consistency level, retry policy",
        "- **Handoff Protocol**: Context fields required for handoff, summary format, confidence propagation, escalation triggers",
        "- **Evaluation Metrics**: Task completion ≥90%, delegation accuracy ≥95%, avg iterations ≤5, cost per orchestration ≤$0.10",
        "- **A/B Testing**: Routing algorithm variants, agent count configurations, memory strategies, supervisor prompt variations",
        "- **Cost Analysis**: Total orchestration cost breakdown (supervisor + agents + memory + infra), optimization opportunities",
        "- **Production Readiness**: All multi-agent scenarios tested, loop prevention verified, cost budgets enforced, monitoring active",
    ],
    "play-08-builder": [
        "- **Copilot Studio Setup**: Declarative agent configuration, topic design (triggers/conditions/actions), knowledge grounding",
        "- **Knowledge Sources**: SharePoint sites, public websites, uploaded documents, Dataverse tables, custom APIs as knowledge",
        "- **Dataverse Integration**: Table design, virtual tables, business rules, privilege model, environment variables",
        "- **Power Platform Connectors**: 1000+ connectors, custom connectors (OpenAPI), connection references, DLP policies",
        "- **Guardrails**: System topic fallback, blocked topic list, content moderation, response length limits, no PII collection",
        "- **Multi-Turn Conversations**: Context carryover, slot filling, disambiguation, confirmation flows, session management",
        "- **Authentication**: Azure Entra ID SSO, Teams SSO, user identity pass-through, guest access policies",
        "- **Deployment**: Teams app manifest, admin publishing to org app catalog, environment management (dev/test/prod)",
        "- **Analytics**: Conversation analytics, topic performance, escalation rates, CSAT tracking, usage patterns",
        "- **Integration**: Power Automate flows for complex actions, adaptive cards for rich responses, external API calls",
    ],
    "play-08-reviewer": [
        "- **Topic Review**: Topic coverage for all intents, trigger phrase quality, no orphan topics, fallback topic configured",
        "- **Knowledge Review**: Knowledge sources up-to-date, relevance verified, no contradictory information, citation quality",
        "- **Security Review**: Authentication configured, DLP policies applied, PII not collected/stored, data residency compliance",
        "- **Guardrail Review**: Content moderation enabled, blocked topics configured, response length appropriate, no prompt leakage",
        "- **Conversation Flow Review**: Multi-turn works correctly, disambiguation clear, slot filling complete, dead-ends handled",
        "- **Integration Review**: Power Automate flows tested, connector permissions minimal, error handling in flows",
        "- **Deployment Review**: Teams manifest valid, admin consent documented, environment promotion process defined",
        "- **Analytics Review**: Key metrics tracked (resolution rate, CSAT, escalation), dashboards configured, alerts set",
        "- **Accessibility Review**: Screen reader compatible, keyboard navigation, language options, response readability",
        "- **User Testing**: Representative user group tested, feedback incorporated, edge cases covered, load testing done",
    ],
    "play-08-tuner": [
        "- **Topic Optimization**: Trigger phrase expansion (10+ per topic), confidence threshold tuning, topic ordering/priority",
        "- **Knowledge Tuning**: Source refresh schedule, relevance scoring, chunk size for grounding, citation format",
        "- **Response Quality**: Tone/voice calibration (formal/casual/brand), response length (concise/detailed), personality consistency",
        "- **Guardrail Tuning**: Blocked topic list review, content moderation sensitivity, fallback message quality",
        "- **Conversation Tuning**: Max turns before escalation, disambiguation strategy, confirmation needed vs assumed, timeout handling",
        "- **Performance Tuning**: Response latency, knowledge retrieval speed, connector call optimization",
        "- **Escalation Config**: Triggers (confidence < 0.5, sentiment negative, explicit request), handoff context, agent queue routing",
        "- **A/B Testing**: Greeting variations, response styles, topic routing, knowledge source comparison",
        "- **Evaluation**: Resolution rate ≥70%, CSAT ≥4.0, escalation rate <30%, avg conversation length, topic coverage ≥95%",
        "- **Production Readiness**: All topics tested, knowledge current, guardrails verified, Teams deployment approved, analytics active",
    ],
    "play-09-builder": [
        "- **Azure AI Search**: Index schema (keyword + vector fields), skillsets for enrichment, custom analyzers, semantic configuration",
        "- **Hybrid Search**: BM25 keyword + vector (HNSW) with configurable fusion weights (RRF), semantic reranker on top results",
        "- **Scoring Profiles**: Freshness boosting, tag boosting, magnitude boosting, function-based scoring, field weighting",
        "- **Answer Generation**: GPT-4o synthesizes answer from top-k results with citations, streaming response, confidence scoring",
        "- **Faceted Navigation**: Category facets, date range filters, tag filters, dynamic facet counts, drill-down patterns",
        "- **Auto-Suggest**: Suggesters for type-ahead, fuzzy matching, phonetic matching, synonym maps for query expansion",
        "- **Web UI**: React/Next.js search frontend, instant results, facet sidebar, result highlighting, pagination",
        "- **Document Ingestion**: Blob trigger → indexer → skillset → index pipeline, incremental indexing, change tracking",
        "- **Security**: Private endpoint for AI Search, managed identity, RBAC (Search Index Data Reader), API key rotation",
        "- **Evaluation**: Relevance (NDCG@10 ≥0.75), search latency p95 <500ms, answer quality (groundedness ≥0.85), CTR tracking",
    ],
    "play-09-reviewer": [
        "- **Index Review**: Schema completeness, field types appropriate, analyzers correct for languages, vector dimensions match",
        "- **Search Quality Review**: Relevance testing with golden set, hybrid weights balanced, reranker improving results",
        "- **Answer Review**: Citation accuracy, hallucination check, answer completeness, confidence threshold appropriate",
        "- **Performance Review**: Search latency <500ms p95, indexing throughput adequate, auto-scale configured",
        "- **Facet Review**: Facets meaningful for users, counts accurate, drill-down works correctly, no empty facets",
        "- **Security Review**: Private endpoint verified, RBAC configured, API keys rotated, no public exposure",
        "- **UI Review**: Search UX intuitive, results rendered correctly, highlighting useful, mobile responsive",
        "- **Ingestion Review**: Incremental indexing works, change tracking picks up updates/deletes, error handling for failed docs",
        "- **Test Review**: Relevance test suite, load testing, edge cases (empty query, special chars, very long query)",
        "- **Accessibility Review**: WCAG AA compliance, keyboard navigation, screen reader, focus management, ARIA labels",
    ],
};
console.log("═══ Section 26 B11: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B11 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
