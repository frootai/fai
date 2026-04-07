#!/usr/bin/env node
/**
 * FrootAI Content Scaling Sprint — Batch 2
 * Per-play agents (23 plays × 3 = 69) + additional specialists
 */

const { writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const AGENTS_DIR = join(__dirname, '..', 'agents');
let created = 0;

function mk(name, desc, waf, plays, body) {
  const f = join(AGENTS_DIR, `${name}.agent.md`);
  if (existsSync(f)) { return; }
  const w = waf.map(v => `  - "${v}"`).join('\n');
  const p = plays.length ? `\nplays:\n${plays.map(v => `  - "${v}"`).join('\n')}` : '';
  writeFileSync(f, `---\ndescription: "${desc}"\nname: "${name.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')}"\nwaf:\n${w}${p}\n---\n\n# ${name.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')}\n\n${body}\n`);
  created++;
}

// ─── Per-Play Builder Agents (23 plays) ───────────────
const plays = [
  ['01','enterprise-rag','Enterprise RAG pipeline builder — Azure AI Search, OpenAI, embeddings, evaluation'],
  ['02','ai-landing-zone','AI Landing Zone builder — hub-spoke networking, private endpoints, governance'],
  ['03','deterministic-agent','Deterministic AI builder — grounding, structured output, evaluation-driven reliability'],
  ['04','call-center-voice-ai','Voice AI builder — Azure Speech, call center analytics, real-time transcription'],
  ['05','it-ticket-resolution','IT ticket resolution builder — classification, routing, automated resolution'],
  ['06','document-intelligence','Document processing builder — OCR, table extraction, PDF to structured data'],
  ['07','multi-agent-service','Multi-agent service builder — orchestration, Dapr, agent collaboration'],
  ['08','copilot-studio-bot','Copilot Studio builder — topics, generative answers, Teams deployment'],
  ['09','ai-search-portal','AI Search portal builder — semantic search, knowledge discovery, faceted navigation'],
  ['10','content-moderation','Content moderation builder — safety filters, policy enforcement, human review'],
  ['11','ai-landing-zone-advanced','Advanced landing zone builder — multi-region, hub-spoke, enterprise governance'],
  ['12','model-serving-aks','Model serving builder — AKS GPU nodes, vLLM, autoscaling, quantization'],
  ['13','fine-tuning-workflow','Fine-tuning builder — LoRA/QLoRA, data prep, evaluation, Azure AI Foundry'],
  ['14','cost-optimized-ai-gateway','AI gateway builder — APIM, semantic cache, model routing, token metering'],
  ['15','multi-modal-docproc','Multi-modal doc processor — images + text, vision models, PDF extraction'],
  ['16','copilot-teams-extension','Teams extension builder — message extensions, adaptive cards, Copilot plugins'],
  ['17','ai-observability','AI observability builder — OpenTelemetry, token tracking, quality dashboards'],
  ['18','prompt-management','Prompt management builder — versioning, A/B testing, prompt libraries'],
  ['19','edge-ai-phi4','Edge AI builder — Phi-4, ONNX Runtime, on-device inference, quantization'],
  ['20','anomaly-detection','Anomaly detection builder — streaming analytics, real-time alerting, ML models'],
  ['21','agentic-rag','Agentic RAG builder — autonomous retrieval, multi-source synthesis, self-evaluation'],
  ['22','multi-agent-swarm','Multi-agent swarm builder — supervisor pattern, distributed collaboration'],
  ['23','browser-automation-agent','Browser automation builder — Playwright MCP, vision navigation, web tasks'],
];

for (const [num, name, desc] of plays) {
  mk(`frootai-play-${num}-builder`, `Play ${num} builder — ${desc}`, ['reliability','security','operational-excellence'], [`${num}-${name}`],
    `You are the builder agent for FrootAI Solution Play ${num}: ${name}.\n\n## Role\nImplement the solution following WAF pillars, using config values from TuneKit and patterns from DevKit.`);
  mk(`frootai-play-${num}-reviewer`, `Play ${num} reviewer — code quality, security audit, WAF compliance for ${name}`, ['security','responsible-ai'], [`${num}-${name}`],
    `You are the reviewer agent for Play ${num}: ${name}.\n\n## Role\nReview code for security vulnerabilities, WAF alignment, and quality standards.`);
  mk(`frootai-play-${num}-tuner`, `Play ${num} tuner — config optimization, evaluation thresholds, cost tuning for ${name}`, ['cost-optimization','performance-efficiency'], [`${num}-${name}`],
    `You are the tuner agent for Play ${num}: ${name}.\n\n## Role\nOptimize config/openai.json, guardrails.json, and evaluation thresholds for production readiness.`);
}

// ─── Additional Specialists Not Yet Covered ───────────
const extras = [
  ['frootai-dotnet-maui-expert','Cross-platform .NET MAUI specialist — iOS, Android, Windows, macOS from a single C# codebase.',['performance-efficiency','reliability']],
  ['frootai-blazor-expert','Blazor specialist — Server + WASM components, Razor syntax, SignalR real-time.',['performance-efficiency','security']],
  ['frootai-vue-expert','Vue.js 3 specialist — Composition API, Pinia state, Nuxt SSR patterns.',['performance-efficiency','reliability']],
  ['frootai-angular-expert','Angular specialist — signals, standalone components, RxJS, dependency injection.',['reliability','performance-efficiency']],
  ['frootai-svelte-expert','Svelte 5 specialist — runes, SvelteKit, TypeScript integration, minimal bundle size.',['performance-efficiency','reliability']],
  ['frootai-elasticsearch-expert','Elasticsearch specialist — search optimization, observability, APM integration.',['performance-efficiency','reliability']],
  ['frootai-mongodb-expert','MongoDB specialist — schema design, aggregation pipelines, Atlas Vector Search.',['performance-efficiency','reliability']],
  ['frootai-redis-expert','Redis specialist — caching patterns, semantic cache for AI, pub/sub, streams.',['performance-efficiency','cost-optimization']],
  ['frootai-graphql-expert','GraphQL specialist — schema design, resolvers, DataLoader, federation.',['performance-efficiency','reliability']],
  ['frootai-openapi-expert','OpenAPI specialist — spec design, code generation, API-first development.',['operational-excellence','reliability']],
  ['frootai-accessibility-expert','Accessibility specialist — WCAG 2.1 AA, screen readers, keyboard navigation, AI interface a11y.',['responsible-ai','reliability']],
  ['frootai-i18n-expert','Internationalization specialist — multi-language AI, locale-aware formatting, translation workflows.',['responsible-ai','operational-excellence']],
  ['frootai-seo-expert','SEO and AI search optimization — structured data, Core Web Vitals, AI-generated content SEO.',['performance-efficiency','operational-excellence']],
  ['frootai-incident-responder','Incident response specialist — triage, root cause analysis, communication, post-mortem for AI system failures.',['reliability','operational-excellence']],
  ['frootai-capacity-planner','AI capacity planning specialist — GPU sizing, token volume forecasting, PTU allocation, cost modeling.',['cost-optimization','performance-efficiency']],
  ['frootai-compliance-expert','AI compliance specialist — EU AI Act, NIST AI RMF, ISO 42001, GDPR, risk assessment for AI systems.',['responsible-ai','security']],
  ['frootai-migration-expert','Migration specialist — legacy to AI-native, .NET Framework upgrade, database migration, cloud lift-and-shift.',['operational-excellence','reliability']],
  ['frootai-performance-profiler','Performance profiling specialist — latency analysis, token optimization, GPU utilization, bottleneck identification.',['performance-efficiency','cost-optimization']],
  ['frootai-api-gateway-designer','API gateway architect — rate limiting, versioning, throttling, backend routing for AI endpoints.',['reliability','security','cost-optimization']],
  ['frootai-event-driven-expert','Event-driven architecture specialist — Azure Event Grid, Service Bus, Event Hubs for AI pipeline triggers.',['reliability','performance-efficiency']],
  ['frootai-streaming-expert','Real-time streaming specialist — SSE for LLM output, WebSocket, Azure Event Hubs, stream processing for AI.',['performance-efficiency','reliability']],
  ['frootai-batch-processing-expert','Batch processing specialist — Azure Batch, async inference, Global Batch API (50% discount), large-scale document processing.',['cost-optimization','reliability']],
  ['frootai-vector-database-expert','Vector database specialist — HNSW, IVF, embedding storage, Qdrant, Pinecone, pgvector, Azure AI Search vector.',['performance-efficiency','reliability']],
  ['frootai-embedding-expert','Embedding specialist — text-embedding-3-large/small, Matryoshka embeddings, dimension selection, batch embedding pipelines.',['cost-optimization','performance-efficiency']],
  ['frootai-content-safety-expert','Content safety specialist — Azure AI Content Safety, 4 harm categories, Prompt Shields, protected material detection.',['responsible-ai','security']],
  ['frootai-red-team-expert','AI red teaming specialist — prompt injection, jailbreaks, adversarial testing, PyRIT automation, bias detection.',['security','responsible-ai']],
];

for (const [name, desc, waf] of extras) {
  mk(name, desc, waf, [],
    `You are a FrootAI specialist.\n\n## Core Expertise\n${desc}\n\n## WAF Alignment\n${waf.map(w=>`- **${w}**`).join('\n')}`);
}

console.log(`Created: ${created} new agents`);
console.log(`Check total: Get-ChildItem agents/*.agent.md | Measure-Object`);
