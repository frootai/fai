const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, "..", "agents");
const fixes = {
    "frootai-accessibility-expert.agent.md": [
        "- **WCAG 2.2 Compliance**: Level AA/AAA success criteria including 2.4.11 Focus Not Obscured, 2.4.13 Focus Appearance, 3.2.6 Consistent Help",
        "- **ARIA 1.2 Authoring**: Custom widget patterns — combobox, treegrid, dialog, feed, menu, toolbar, tabpanel, live regions",
        "- **Screen Reader Testing**: NVDA 2024.1+, JAWS 2024, VoiceOver (macOS 14+/iOS 17+), TalkBack (Android 14+) — cross-platform",
        "- **Keyboard Navigation**: Roving tabindex, arrow-key grids, skip links, focus trapping in modals, tab order management",
        "- **AI Interface Accessibility**: Chat UI for screen readers, streaming response announcements, confidence score vocalization",
        "- **Focus Management**: SPA route changes, dynamic content injection, dialog focus trap/restore, focus-visible polyfill",
    ],
    "frootai-adr-writer.agent.md": [
        "- **ADR Format**: Title, Status (proposed/accepted/deprecated/superseded), Context, Decision, Consequences, References",
        "- **Decision Documentation**: Architecture decisions, technology choices, pattern selection, trade-off analysis, risk assessment",
        "- **Version Control**: ADR numbering (NNNN-title.md), git-tracked, cross-references, superseding chain, deprecation workflow",
        "- **Stakeholder Communication**: Technical decisions in business language, impact analysis, alternative comparison tables",
        "- **AI-Specific ADRs**: Model selection rationale, prompt strategy, guardrail configuration, evaluation metric choices",
        "- **Template Library**: MADR format, Nygard format, custom templates, context-specific sections, automated generation",
    ],
    "frootai-agentic-retriever.agent.md": [
        "- **Autonomous Search**: Agent-controlled retrieval — decides when to search, which sources, how many iterations to refine",
    ],
    "frootai-ai-agents-expert.agent.md": [
        "- **Agent Architecture**: Supervisor-specialist, swarm topology, pipeline chains, debate patterns, consensus voting, escalation",
    ],
    "frootai-ai-infra-expert.agent.md": [
        "- **GPU Infrastructure**: A100/H100 provisioning, MIG partitioning, vLLM serving, NVIDIA device plugin, quota management",
    ],
    "frootai-angular-expert.agent.md": [
        "- **Angular 18+**: Signal-based reactivity, zoneless change detection, deferrable views, built-in control flow, hydration",
        "- **RxJS Mastery**: Observables, operators (map/filter/switchMap/combineLatest), error handling, memory leak prevention",
        "- **Component Design**: Standalone components, input/output signals, content projection, template-driven + reactive forms",
        "- **Testing**: Jasmine/Karma, Jest migration, Spectator, Cypress E2E, TestBed, ComponentFixture, async test utilities",
        "- **Azure Integration**: @azure/identity, HttpClient interceptors for auth, streaming SSE for AI responses, MSAL Angular",
        "- **Performance**: OnPush change detection, trackBy for ngFor, lazy loading routes, preloading strategies, bundle analysis",
    ],
    "frootai-api-gateway-designer.agent.md": [
        "- **Azure APIM**: Policy expressions, backend pools, products/subscriptions, developer portal, custom domains, certificates",
        "- **AI Gateway Patterns**: Semantic caching, model routing, token metering, rate limiting, cost attribution, circuit breaker",
        "- **Security**: OAuth2/OIDC validation, JWT policies, IP filtering, mutual TLS, subscription keys, custom CA certificates",
        "- **Load Balancing**: Priority-based multi-region failover, latency-aware routing, weighted distribution, health probes",
        "- **Analytics**: Application Insights integration, custom dimensions (model/tokens/cost), real-time dashboards, alerting",
        "- **Cost Management**: Token budget enforcement, per-user/team limits, chargeback reporting, anomaly detection, FinOps integration",
    ],
    "frootai-architect.agent.md": [
        "- **Azure Well-Architected**: 6 pillars assessment, trade-off analysis, design reviews, cost modeling, reliability scoring",
        "- **AI Architecture Patterns**: RAG, multi-agent, voice pipeline, document processing, edge AI, streaming, governance",
        "- **Decision Frameworks**: Build vs buy, cloud vs edge, model selection, data residency, compliance, cost-benefit analysis",
        "- **FAI Protocol Design**: fai-manifest.json, primitive composition, play wiring, guardrail specification, WAF alignment",
        "- **Capacity Planning**: GPU/TPM/RPM quotas, scaling strategy, cost projection, multi-region, disaster recovery",
        "- **C4 Modeling**: Context, Container, Component, Code diagrams — Mermaid/draw.io with Azure Architecture Center icons",
    ],
};

console.log("═══ Fixing B1 agents — adding domain expertise bullets ═══\n");
let fixed = 0;
for (const [file, extraBullets] of Object.entries(fixes)) {
    const fp = path.join(dir, file);
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, "utf8");
    const s = c.indexOf("## Core Expertise");
    const e = c.indexOf("\n## Your Approach");
    if (s < 0 || e < 0) continue;

    // Get existing expertise
    const existing = c.substring(s, e);
    const existingBullets = (existing.match(/^- /gm) || []).length;

    // Add extra bullets after existing ones
    const insertPoint = c.lastIndexOf("\n", e - 1);
    const before = c.substring(0, e);
    const after = c.substring(e);
    const enriched = before.trimEnd() + "\n" + extraBullets.join("\n") + "\n" + after;

    fs.writeFileSync(fp, enriched);
    const newBullets = (enriched.match(/## Core Expertise[\s\S]*?(?=## Your Approach)/)[0].match(/^- /gm) || []).length;
    fixed++;
    console.log(`  ✅ ${file}: ${existingBullets} → ${newBullets} bullets, ${enriched.split("\n").length} lines`);
}
console.log(`\nFixed: ${fixed} agents`);
