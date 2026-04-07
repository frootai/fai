#!/usr/bin/env node
/** Instructions Sprint 2 — Per-play + per-WAF-pillar combos + additional frameworks */
const { writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const D = join(__dirname, '..', 'instructions');
let c = 0;
function mk(n,d,a,w,b) {
  const f=join(D,`${n}.instructions.md`);
  if(existsSync(f))return;
  const ww=w.length?`\nwaf:\n${w.map(v=>`  - "${v}"`).join('\n')}`:'';
  writeFileSync(f,`---\ndescription: "${d}"\napplyTo: "${a}"${ww}\n---\n\n# ${n.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')} — FrootAI Standards\n\n${b}\n`);
  c++;
}
const std=(l,r)=>`When working with ${l}, enforce these standards.\n\n## Rules\n${r.map(x=>`- ${x}`).join('\n')}`;

// ─── Per-Play Instructions (23 plays × 1 each) ───────
const plays = [
  ['01','enterprise-rag','**/*.py, **/*.bicep','RAG-specific patterns — chunking strategy, embedding batch, hybrid search, citation enforcement, hallucination prevention.'],
  ['02','ai-landing-zone','**/*.bicep, **/*.json','Landing zone patterns — hub-spoke VNet, private endpoints on ALL PaaS, Managed Identity, tag enforcement, GPU quota.'],
  ['03','deterministic-agent','**/*.py, **/*.ts','Deterministic AI patterns — temperature=0, structured output, grounding, citation, evaluation-driven reliability.'],
  ['04','call-center-voice-ai','**/*.py, **/*.ts','Voice AI patterns — Azure Speech SDK, real-time transcription, sentiment detection, turn-taking, noise handling.'],
  ['05','it-ticket-resolution','**/*.py, **/*.ts','IT ticket patterns — intent classification, knowledge base search, automated resolution, escalation rules.'],
  ['06','document-intelligence','**/*.py','Document processing patterns — AI Document Intelligence, table extraction, OCR confidence, structured output.'],
  ['07','multi-agent-service','**/*.py, **/*.ts','Multi-agent patterns — supervisor routing, turn limits, token budgets, cross-agent context passing.'],
  ['08','copilot-studio-bot','**/*.json','Copilot Studio patterns — topics, generative answers, knowledge sources, channel deployment, Dataverse integration.'],
  ['09','ai-search-portal','**/*.py, **/*.ts, **/*.bicep','Search portal patterns — faceted search, semantic ranker, result rendering, analytics, personalization.'],
  ['10','content-moderation','**/*.py, **/*.ts','Content moderation patterns — Azure Content Safety, 4 harm categories, threshold tuning, human review pipeline.'],
  ['11','ai-landing-zone-advanced','**/*.bicep','Advanced landing zone — multi-region, ExpressRoute, Azure Firewall, Policy as Code, Defender for Cloud.'],
  ['12','model-serving-aks','**/*.yaml, **/*.py','Model serving patterns — vLLM config, GPU scheduling, health probes, autoscaling, quantization selection.'],
  ['13','fine-tuning-workflow','**/*.py, **/*.jsonl','Fine-tuning patterns — JSONL data prep, LoRA config, eval metrics, A/B comparison, model versioning.'],
  ['14','cost-optimized-ai-gateway','**/*.xml, **/*.bicep','AI gateway patterns — APIM policies, semantic cache, token metering, multi-backend retry, budget enforcement.'],
  ['15','multi-modal-docproc','**/*.py','Multi-modal patterns — GPT-4o Vision, image+text pipelines, PDF rendering, chart interpretation.'],
  ['16','copilot-teams-extension','**/*.ts, **/*.json','Teams extension patterns — adaptive cards, message extensions, bot framework, Teams toolkit.'],
  ['17','ai-observability','**/*.py, **/*.ts, **/*.bicep','AI observability patterns — OpenTelemetry spans, token metrics, quality dashboards, alert thresholds.'],
  ['18','prompt-management','**/*.py, **/*.json','Prompt management patterns — version control, A/B testing, template variables, prompt libraries.'],
  ['19','edge-ai-phi4','**/*.py, **/*.onnx','Edge AI patterns — Phi-4 optimization, ONNX Runtime, quantization, batch size tuning, device constraints.'],
  ['20','anomaly-detection','**/*.py','Anomaly detection patterns — streaming analytics, statistical thresholds, ML models, alert routing.'],
  ['21','agentic-rag','**/*.py, **/*.ts','Agentic RAG patterns — retrieval decision loop, multi-source routing, query refinement, self-evaluation.'],
  ['22','multi-agent-swarm','**/*.py, **/*.ts','Swarm patterns — supervisor delegation, specialist budgets, turn management, result synthesis.'],
  ['23','browser-automation-agent','**/*.py, **/*.ts','Browser automation patterns — domain allowlist, no credential entry, screenshot analysis, action limits.'],
];
for (const [num, name, applyTo, desc] of plays) {
  mk(`play-${num}-${name}-patterns`, `Play ${num} patterns — ${desc}`, applyTo, ['reliability','security'], std(`Play ${num} (${name})`, desc.split(', ')));
}

// ─── WAF × Language combos (6 pillars × 4 languages beyond existing) ─
const wafInstructions = [
  ['security-python','Python security standards — input validation, secrets handling, dependency scanning, SQL injection prevention.','**/*.py',['security']],
  ['security-typescript','TypeScript security standards — XSS prevention, CSP headers, input sanitization, dependency audit.','**/*.ts, **/*.tsx',['security']],
  ['security-csharp','C# security standards — parameterized queries, output encoding, anti-forgery tokens, secure headers.','**/*.cs',['security']],
  ['security-bicep','Bicep security standards — @secure() parameters, private endpoints, Managed Identity, diagnostic settings.','**/*.bicep',['security']],
  ['reliability-python','Python reliability standards — retry with tenacity, circuit breakers, health checks, structured logging.','**/*.py',['reliability']],
  ['reliability-typescript','TypeScript reliability standards — AbortSignal timeout, retry patterns, health endpoints, error boundaries.','**/*.ts',['reliability']],
  ['reliability-csharp','C# reliability standards — Polly retry/circuit breaker, health checks, exception handling, resilience.','**/*.cs',['reliability']],
  ['cost-python','Python cost optimization — token budgets, model routing, caching, batch embedding, async for throughput.','**/*.py',['cost-optimization']],
  ['cost-typescript','TypeScript cost optimization — streaming responses, semantic cache, token metering, efficient serialization.','**/*.ts',['cost-optimization']],
  ['cost-bicep','Bicep cost optimization — consumption SKUs, auto-shutdown, tags for cost centers, budget resources.','**/*.bicep',['cost-optimization']],
  ['performance-python','Python performance — async/await, connection pooling, streaming, profiling with cProfile/py-spy.','**/*.py',['performance-efficiency']],
  ['performance-typescript','TypeScript performance — event loop, streaming SSE, connection pooling, memory profiling.','**/*.ts',['performance-efficiency']],
  ['opex-github-actions','GitHub Actions operational excellence — reusable workflows, matrix testing, artifact management.','**/.github/workflows/*.yml',['operational-excellence']],
  ['opex-monitoring','Monitoring standards — Application Insights, structured logging, custom metrics, alert thresholds.','**/*.py, **/*.ts, **/*.cs',['operational-excellence']],
  ['rai-content-safety','Responsible AI content safety — Azure Content Safety integration, filter thresholds, PII redaction.','**/*.py, **/*.ts',['responsible-ai']],
  ['rai-bias-testing','Responsible AI bias testing — disaggregated metrics, diverse evaluation datasets, fairness benchmarks.','**/*.py',['responsible-ai']],
];
for (const [name, desc, applyTo, waf] of wafInstructions) {
  mk(name, desc, applyTo, waf, std(name.split('-').join(' '), desc.split(' — ')[1].split(', ')));
}

// ─── Additional Framework Instructions ────────────────
const frameworks = [
  ['quarkus-waf','Quarkus standards — Java 21, CDI, reactive, native compilation patterns.','*',['performance-efficiency','reliability']],
  ['laravel-waf','Laravel standards — Eloquent, Blade, Artisan, queue workers, and security.','**/*.php',['reliability','security']],
  ['nuxt-waf','Nuxt 3 standards — Vue 3, SSR, auto-imports, and composable patterns.','**/*.vue, **/*.ts',['performance-efficiency','reliability']],
  ['electron-waf','Electron standards — IPC security, preload scripts, context isolation.','**/*.ts, **/*.js',['security','performance-efficiency']],
  ['winui3-waf','WinUI 3 standards — XAML, MVVM, Windows App SDK patterns.','**/*.xaml, **/*.cs',['reliability','performance-efficiency']],
  ['maui-waf','MAUI standards — cross-platform, MVVM, dependency injection, platform-specific.','**/*.xaml, **/*.cs',['reliability','performance-efficiency']],
  ['wpf-waf','WPF standards — MVVM, data binding, commands, styles, templates.','**/*.xaml, **/*.cs',['reliability']],
  ['graphql-waf','GraphQL standards — schema design, resolvers, DataLoader, error handling.','**/*.graphql, **/*.ts',['reliability','performance-efficiency']],
  ['grpc-waf','gRPC standards — protobuf design, streaming, error codes, health checking.','**/*.proto, **/*.cs, **/*.go',['performance-efficiency','reliability']],
  ['openapi-waf','OpenAPI standards — spec-first design, versioning, security schemes, examples.','**/*.yaml, **/*.json',['operational-excellence','reliability']],
  ['terraform-azure-waf','Terraform Azure standards — AVM modules, CALMS framework, modular design.','**/*.tf',['operational-excellence','security']],
  ['bicep-code-best-practices','Bicep code best practices — lowerCamelCase, @description, latest API, output naming.','**/*.bicep',['operational-excellence']],
  ['containerization-waf','Containerization standards — immutability, reproducible builds, health probes, 12-factor.','**/Dockerfile',['security','reliability']],
  ['a11y-waf','Accessibility standards — WCAG 2.1 AA, ARIA, keyboard navigation, screen reader testing.','**/*.tsx, **/*.html, **/*.vue',['responsible-ai']],
  ['localization-waf','Localization standards — i18n key management, RTL support, pluralization, date/number formatting.','**/*.ts, **/*.json',['responsible-ai','operational-excellence']],
];
for (const [name, desc, applyTo, waf] of frameworks) {
  mk(name, desc, applyTo, waf, std(name.replace('-waf',''), desc.split(' — ')[1]?.split(', ') || [desc]));
}

// ─── Power Platform Suite (remaining) ─────────────────
const pp = [
  ['power-apps-canvas-waf','Power Apps Canvas standards — delegation, collections, component libraries.','**/*.msapp',['performance-efficiency']],
  ['power-apps-model-driven-waf','Power Apps Model-driven standards — forms, views, business rules, Dataverse security.','**/*.xml',['reliability','security']],
  ['power-automate-waf','Power Automate flow standards — error handling, parallel branches, approvals, SLA tracking.','**/*.json',['reliability','operational-excellence']],
  ['power-pages-waf','Power Pages standards — Liquid templates, web forms, entity permissions, progressive profiles.','**/*.html, **/*.liquid',['security','performance-efficiency']],
  ['copilot-studio-waf','Copilot Studio standards — topic design, generative answers, knowledge sources, channel config.','**/*.json',['reliability','responsible-ai']],
  ['power-platform-connector-waf','Custom connector standards — OpenAPI definition, auth configuration, throttling, testing.','**/*.json, **/*.yaml',['security','reliability']],
];
for (const [name, desc, applyTo, waf] of pp) {
  mk(name, desc, applyTo, waf, std(name.replace('-waf',''), desc.split(' — ')[1]?.split(', ') || [desc]));
}

console.log(`Created: ${c} new instructions`);
