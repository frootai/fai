const fs = require("fs"), path = require("path");
const dir = "agents";
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort().slice(90, 100);
const expertiseMap = {
    "play-03-builder": [
        "- **Zero-Temperature Architecture**: temperature=0 with seed pinning for 100% reproducible responses across identical inputs",
        "- **Structured JSON Output**: JSON mode with strict schema validation, Pydantic/Zod models, type-safe response handling",
        "- **Anti-Sycophancy Prompts**: System instructions that resist user pressure, independent reasoning, contradiction detection",
        "- **Confidence Scoring**: Calibrated probability estimation (0-1), multi-evidence requirement, threshold-based abstention (≥0.7)",
        "- **Multi-Layer Guardrails**: Input validation → Content Safety → schema check → confidence gate → citation check → output filter",
        "- **Verification Loops**: LLM output → validator → retry (max 3) → abstain on all failures, structured error responses",
        "- **Container Apps Deployment**: Managed identity, health endpoints, auto-scaling on request count, VNet integration",
        "- **Content Safety Integration**: Azure Content Safety API for all outputs, severity threshold=2, custom blocklists",
        "- **Evaluation Suite**: Consistency rate >99%, faithfulness >0.95, abstention on unknowns, false confidence rate <1%",
        "- **Bicep IaC**: Container Apps + OpenAI (S0) + Content Safety + Key Vault — conditional dev/prod SKUs",
    ],
    "play-03-reviewer": [
        "- **Determinism Verification**: Same input → same output testing (100 repetitions), seed consistency, temperature=0 enforcement",
        "- **Schema Validation Review**: JSON schemas match API contract, Pydantic/Zod models cover all fields, error types defined",
        "- **Guardrail Completeness**: All 6 layers present (input→safety→schema→confidence→citation→output), no bypass paths",
        "- **Anti-Sycophancy Testing**: Adversarial prompts that try to override agent, user pressure resistance, contradiction handling",
        "- **Confidence Calibration**: Score distribution analysis, threshold appropriateness, false positive/negative rates",
        "- **Security Audit**: Managed identity verified, Content Safety enabled, no hardcoded keys, PII redaction in logs",
        "- **Test Coverage**: Consistency tests, adversarial tests, edge cases, schema validation tests, evaluation pipeline passes",
        "- **Config Validation**: temperature=0, seed set, max_tokens bounded, guardrails complete, confidence threshold ≥ 0.7",
        "- **Performance Review**: Response latency <3s p95, structured output parsing overhead minimal, retry impact acceptable",
        "- **WAF Compliance**: Security (MI+KV+CS), reliability (retry+health+determinism), responsible-ai (guardrails+abstention)",
    ],
    "play-03-tuner": [
        "- **Temperature Validation**: Must be exactly 0 for production — any deviation breaks determinism guarantee",
        "- **Seed Configuration**: Fixed integer seed, consistent across environments, documented in config/openai.json",
        "- **Confidence Threshold Tuning**: 0.7 default, adjust based on domain risk (0.8 for medical, 0.9 for legal, 0.6 for general)",
        "- **Schema Strictness**: JSON mode enabled, strict schema validation, no additional properties allowed, explicit null handling",
        "- **Guardrail Threshold Tuning**: Content Safety severity (1-4), PII categories, custom blocklist terms, business rule limits",
        "- **Retry Configuration**: Max 3 attempts, exponential backoff, abstain after all failures, structured error response",
        "- **Evaluation Metrics**: Consistency ≥99%, faithfulness ≥0.95, safety 0 failures, abstention rate 5-15% (too low = overconfident)",
        "- **A/B Testing**: Compare guardrail configurations, measure false positive rates, optimize for precision vs recall balance",
        "- **Cost Analysis**: Token usage with structured output overhead, retry cost impact, caching for identical inputs",
        "- **Production Readiness**: All determinism tests pass, eval pipeline green, Bicep compiles, no secrets, monitoring configured",
    ],
    "play-04-builder": [
        "- **Voice Pipeline**: STT (Azure AI Speech) → LLM (GPT-4o) → TTS (Neural Voice) — real-time streaming architecture",
        "- **Azure Communication Services**: Call control, DTMF handling, call recording consent, SIP integration, WebSocket media",
        "- **Speech-to-Text**: Real-time recognition, language auto-detection, custom speech models, word-level timestamps, diarization",
        "- **Text-to-Speech**: Neural voice selection, SSML markup, speaking rate/pitch control, custom neural voice (CNV)",
        "- **Intent Recognition**: LLM-based intent classification, slot filling, multi-turn context, disambiguation, fallback handling",
        "- **Call Routing**: Skill-based routing, priority queuing, agent transfer, IVR menu, hold music, callback scheduling",
        "- **PII Redaction**: Real-time transcript PII masking, recording redaction, call metadata anonymization",
        "- **Escalation Triggers**: Sentiment detection, keyword triggers, customer request, timeout, repeated failure",
        "- **Latency Optimization**: Streaming STT+TTS, pre-computed responses, connection pre-warming, edge processing",
        "- **Evaluation**: Call resolution rate, CSAT score, average handle time, first call resolution, escalation rate",
    ],
    "play-04-reviewer": [
        "- **Voice Quality Review**: Audio clarity, speech recognition accuracy, TTS naturalness, latency between turns",
        "- **Pipeline Review**: STT→LLM→TTS chain integrity, error handling at each stage, fallback mechanisms",
        "- **Security Review**: Call recording consent flow, PII redaction verification, encryption at rest/in transit",
        "- **Intent Review**: Classification accuracy, slot filling completeness, disambiguation quality, fallback appropriateness",
        "- **Escalation Review**: Trigger sensitivity (not too aggressive/passive), handoff to human agent smooth, context preservation",
        "- **Compliance Review**: TCPA compliance, call recording laws (two-party consent), data retention policies",
        "- **Performance Review**: End-to-end latency <500ms, STT accuracy >95%, TTS naturalness MOS >4.0",
        "- **Config Review**: Speech language/speed correct, voice selection appropriate, timeout values reasonable",
        "- **Test Review**: Call flow testing, edge cases (background noise, accent, silence), load testing, failover testing",
        "- **Accessibility Review**: Hearing-impaired alternatives, speech rate adjustment, language options, DTMF fallback",
    ],
    "play-04-tuner": [
        "- **Speech Config**: Language (en-US/multi), recognition mode (conversation/dictation), profanity filter, silence timeout",
        "- **Voice Selection**: Neural voice gender/age/style, SSML prosody tuning, speaking rate (0.8-1.2x), emphasis patterns",
        "- **LLM Config**: temperature=0.2 (enough personality for voice, still reliable), max_tokens for response length, response style",
        "- **Latency Tuning**: Pre-warming connections, chunked TTS streaming, STT partial results, concurrent processing",
        "- **Intent Threshold**: Classification confidence (0.7 for clear intent, 0.5 for disambiguation, <0.5 for fallback)",
        "- **Escalation Tuning**: Sentiment threshold (-0.3), keyword list, max retries before escalation (3), timeout (60s)",
        "- **Quality Metrics**: CSAT target (4.2+), resolution rate target (80%+), average handle time, first call resolution rate",
        "- **Cost Analysis**: Per-call cost (Speech + OpenAI + Communication Services), call volume projection, cost per resolution",
        "- **A/B Testing**: Voice persona comparison, response style (formal/casual), greeting variations, hold music preferences",
        "- **Production Readiness**: Voice quality verified, escalation tested, compliance confirmed, load test passed, monitoring active",
    ],
    "play-05-builder": [
        "- **Event-Driven Architecture**: Service Bus queue trigger → Logic Apps/Functions → classification → routing → resolution/escalation",
        "- **Ticket Classification**: GPT-4o-mini for multi-label classification (category/priority/complexity), confidence scoring",
        "- **Auto-Resolution**: Knowledge base matching via AI Search, template response generation, confidence-gated auto-reply",
        "- **ServiceNow MCP**: Ticket create/update/search via MCP connector, incident/change/problem workflow integration",
        "- **Routing Engine**: Skill-based routing (expertise matching), priority queuing (P1-P4), load balancing across teams",
        "- **Escalation Pipeline**: Confidence < threshold → human queue, SLA tracking, auto-escalation on timeout, manager notification",
        "- **SLA Monitoring**: Response time tracking (15min/1hr/4hr by priority), breach alerts, dashboard, trend analysis",
        "- **Cost Optimization**: GPT-4o-mini for classification ($0.15/1M), auto-resolution reduces ticket volume by 30-50%",
        "- **Integration**: Email/Teams/Slack inbound, ServiceNow/Jira outbound, webhook notifications, API for custom integrations",
        "- **Evaluation**: Classification accuracy >90%, auto-resolution rate >30%, CSAT >4.0, SLA compliance >95%",
    ],
    "play-05-reviewer": [
        "- **Classification Review**: Multi-label accuracy, confusion matrix analysis, edge case handling, confidence calibration",
        "- **Auto-Resolution Review**: Response quality, citation accuracy, confidence threshold appropriateness, false positive rate",
        "- **Routing Review**: Skill mapping completeness, priority assignment accuracy, load distribution fairness",
        "- **SLA Review**: Timer configuration, escalation rules, breach handling, notification chain completeness",
        "- **Integration Review**: ServiceNow connector permissions, webhook payload format, error handling, retry policies",
        "- **Security Review**: PII in tickets handled, access control, audit trail, managed identity for service connections",
        "- **Performance Review**: Classification latency <2s, queue processing throughput, end-to-end resolution time",
        "- **Config Review**: Classification prompts, routing rules, SLA thresholds, escalation criteria documented and appropriate",
        "- **Test Review**: Happy path + edge cases tested, load test for queue spike handling, failover tested",
        "- **Cost Review**: GPT-4o-mini usage appropriate, auto-resolution reduces human workload, ROI positive",
    ],
    "play-05-tuner": [
        "- **Classification Tuning**: Prompt optimization, few-shot examples (10+), category taxonomy refinement, confidence calibration",
        "- **Routing Rules**: Skill matrix update, priority weights, team capacity, business hours, on-call routing",
        "- **Auto-Resolution Config**: Confidence threshold (0.85 for auto-reply), knowledge base coverage, response template quality",
        "- **SLA Configuration**: P1=15min/P2=1hr/P3=4hr/P4=24hr response, breach actions, notification chains",
        "- **Escalation Tuning**: Timeout values per priority, max auto-retry count, manager notification threshold",
        "- **Model Selection**: GPT-4o-mini for classification (cost), GPT-4o for complex resolution (quality), embedding for KB search",
        "- **Cost Optimization**: Batch classification where possible, cache frequent ticket types, template reuse",
        "- **A/B Testing**: Auto-resolution templates, classification prompt variants, routing algorithm comparison",
        "- **Evaluation Pipeline**: Classification accuracy ≥90%, auto-resolution CSAT ≥4.0, SLA compliance ≥95%",
        "- **Production Readiness**: All configs validated, ServiceNow connection tested, SLA timers verified, monitoring active",
    ],
    "play-06-builder": [
        "- **Document Intelligence**: Azure AI Document Intelligence for OCR, pre-built models (invoice/receipt/ID), custom models",
        "- **Multi-Format Processing**: PDF, DOCX, XLSX, images (JPEG/PNG/TIFF), scanned documents, handwriting, multi-page",
        "- **GPT-4o Extraction**: Structured field extraction from OCR results, table parsing, relationship inference, entity linking",
        "- **Cosmos DB Storage**: Normalized JSON storage, partition by document type, TTL for temporary, change feed for downstream",
        "- **Processing Pipeline**: Upload → OCR → classification → extraction → validation → storage → notifications",
        "- **PII Handling**: PII detection in extracted text, masking/redaction, compliant storage, audit logging",
        "- **Batch Processing**: Queue-based for bulk upload, parallel processing, progress tracking, error handling, retry",
        "- **Confidence Scoring**: Per-field confidence from Doc Intelligence, LLM extraction confidence, human review queue for low-confidence",
        "- **Output Formats**: Structured JSON, CSV export, PDF annotation, searchable PDF, database records, API response",
        "- **Evaluation**: Field extraction accuracy >95%, table detection >90%, classification accuracy >98%, processing time <30s/page",
    ],
};
console.log("═══ Section 26 B10: Domain-Specific Core Expertise ═══\n");
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
console.log(`\n═══ B10 COMPLETE: min=${Math.min(...fl)} max=${Math.max(...fl)} avg=${Math.round(fl.reduce((a, b) => a + b, 0) / fl.length)} ═══`);
