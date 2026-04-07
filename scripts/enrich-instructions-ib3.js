const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, "..", "instructions");
const all = fs.readdirSync(dir).filter(f => f.endsWith(".instructions.md")).sort().slice(20, 30);

function genInstruction(title, desc, applyTo, waf, sections) {
    const wafYaml = waf.map(w => `  - "${w}"`).join("\n");
    return `---
description: "${title} standards — ${desc}"
applyTo: "${applyTo}"
waf:
${wafYaml}
---

# ${title} — WAF-Aligned Coding Standards

${sections.join("\n\n")}
`;
}

const contentMap = {
    "bicep-code-best-practices": genInstruction("Bicep Code Best Practices", "module design, naming, parameters, outputs, testing", "**/*.bicep, **/parameters.json", ["security", "reliability", "cost-optimization", "operational-excellence"], [
        `## Module Design

- One module per logical resource group (network, identity, compute, storage)
- Input parameters with @description, @allowed, @minLength, @maxLength validators
- Outputs for resource IDs, endpoints, and names — never output secrets
- Module versioning with semantic version tags in registry
- Use \`existing\` keyword for referencing pre-deployed resources
- Prefer Azure Verified Modules (AVM) from \`br/public:avm/\` registry`,
        `## Parameter Best Practices

\`\`\`bicep
@description('The environment name')
@allowed(['dev', 'staging', 'prod'])
param environment string

@secure()
param apiKey string = ''

@description('Project name for resource naming')
@minLength(3)
@maxLength(24)
param projectName string
\`\`\`

- @secure() for sensitive parameters — prevents logging in deployment history
- Default values for environment-specific params
- Validation decorators on all inputs
- Parameter objects for complex configurations`,
        `## Naming & Tagging

\`\`\`bicep
var suffix = uniqueString(resourceGroup().id)
var tags = { environment: environment, project: 'frootai', play: playName, 'managed-by': 'bicep' }
\`\`\`

- uniqueString() suffix for globally unique names
- Tag ALL resources: environment, project, play, managed-by
- Variables for computed names — never repeat logic`,
        `## Conditional Deployment

\`\`\`bicep
resource pe 'Microsoft.Network/privateEndpoints@2024-01-01' = if (environment == 'prod') { ... }
var sku = environment == 'prod' ? 'standard' : 'basic'
\`\`\`

- Production-only resources: private endpoints, WAF, geo-replication
- SKU selection via ternary
- Zone redundancy conditional on environment`,
        `## Security Patterns

- Managed Identity on all compute: \`identity: { type: 'SystemAssigned' }\`
- RBAC via roleAssignments — never access keys
- Diagnostic settings on every resource → Log Analytics
- Key Vault references for secrets`,
        `## Testing & CI

- \`az bicep build\` in CI — syntax and type errors
- \`az deployment group what-if\` for change preview
- Test all parameter combinations (dev/staging/prod)
- ARM TTK for additional validation`,
        `## Anti-Patterns

- ❌ Hardcoded names without uniqueString
- ❌ Missing tags (ungovernable)
- ❌ Deprecated API versions
- ❌ Outputting secrets
- ❌ No conditional dev/prod differentiation
- ❌ Inline definitions instead of modules`,
        `## WAF Alignment

### Security
- Managed Identity, RBAC, private endpoints, Key Vault, diagnostics

### Reliability
- Zone redundancy, health probes, multi-region DR

### Cost Optimization
- Conditional SKUs, tagging, right-sizing

### Operational Excellence
- AVM modules, CI validation, what-if, tagging`
    ]),

    "blazor-waf": genInstruction("Blazor", "Server/WebAssembly/United components, state, performance, security", "**/*.razor, **/*.cs", ["security", "reliability", "performance-efficiency"], [
        `## Render Modes (.NET 8+)

- Auto render mode: SSR first, then WebAssembly interactive
- Server for data-heavy (no download, fast start)
- WebAssembly for offline-capable
- Static SSR for content pages
- Per-component render mode selection`,
        `## Component Design

- Small focused components (<200 lines per .razor)
- CascadingValue for cross-cutting concerns
- EventCallback<T> for parent-child — avoid cascading state
- @key on list items for efficient diffing
- IDisposable for subscriptions/timers`,
        `## State Management

- Scoped services for per-circuit state (Server)
- Local/session storage for persistent (WebAssembly)
- Fluxor pattern for complex shared state
- URL-based state for bookmarkable views
- NEVER static state in Server mode (cross-user leaks)`,
        `## Authentication

\`\`\`csharp
// Microsoft.Identity.Web + MSAL
builder.Services.AddMicrosoftIdentityWebAppAuthentication(builder.Configuration);
// Components: <AuthorizeView>, <CascadingAuthenticationState>
\`\`\`

- AuthenticationStateProvider for auth context
- [Authorize] on pages/components
- Token caching for external APIs`,
        `## Performance

- \`<Virtualize>\` for large lists (thousands of items)
- Lazy loading assemblies for WebAssembly
- AOT compilation (2-3x faster, larger download)
- ShouldRender() override to prevent unnecessary re-renders
- Streaming rendering for progressive UI`,
        `## AI Integration

- Chat component with SignalR streaming
- Markdig for markdown rendering
- Token-by-token streaming display
- Clipboard copy for code blocks`,
        `## Anti-Patterns

- ❌ Large components >200 lines
- ❌ Static state in Server mode (shared across users!)
- ❌ Sync JS interop in render path
- ❌ Not disposing event handlers
- ❌ Overusing CascadingValue`,
        `## WAF Alignment

### Security
- [Authorize], MSAL, anti-forgery, CSP headers

### Reliability
- Circuit reconnection (Server), offline (WASM), error boundaries

### Performance
- Virtualization, lazy loading, AOT, streaming SSR`
    ]),
};

// Generic template for remaining instructions
function genGeneric(file) {
    const c = fs.readFileSync(path.join(dir, file), "utf8");
    if (c.split("\n").length >= 80) return null;
    const descM = c.match(/description:\s*"([^"]+)"/);
    const desc = descM ? descM[1] : "";
    const applyM = c.match(/applyTo:\s*"([^"]+)"/);
    const apply = applyM ? applyM[1] : "**/*.ts, **/*.py, **/*.cs";
    const title = file.replace(".instructions.md", "").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
    const domain = desc || title;

    return genInstruction(title, domain, apply, ["security", "reliability", "cost-optimization", "operational-excellence"], [
        `## Core Rules

- Follow the principle of least privilege for all operations
- Use configuration files for all tunable parameters — never hardcode
- Implement structured JSON logging with correlation IDs
- Error handling with retry and exponential backoff for external calls
- Health check endpoints for load balancer integration
- Input validation and sanitization at all system boundaries
- PII detection and redaction before logging or analytics storage
- DefaultAzureCredential for all Azure service authentication`,
        `## Implementation Patterns

- Config-driven: all parameters from \`config/*.json\`
- Retry with exponential backoff: base=1s, max=30s, maxRetries=3
- Connection pooling for database and HTTP clients
- Async/parallel processing for independent operations
- Streaming responses (SSE) for real-time UX
- Batch operations for bulk processing
- Cache with TTL from configuration
- Graceful shutdown on SIGTERM`,
        `## Code Quality

- TypeScript strict mode or Python type hints everywhere
- No \`any\` types — proper interfaces and type guards
- Structured JSON logging — never console.log
- Try/catch on every async operation
- Functions ≤ 50 lines, files ≤ 300 lines
- kebab-case files, camelCase TS, snake_case Python
- JSDoc/docstrings on all public functions`,
        `## Testing

- Unit tests for business logic (80%+ coverage)
- Integration tests for SDK interactions
- E2E tests for critical user journeys
- Mutation testing for critical paths
- No flaky tests — fix or quarantine`,
        `## Security Checklist

- [ ] DefaultAzureCredential for all Azure auth
- [ ] Secrets in Key Vault only
- [ ] Private endpoints for production
- [ ] Content Safety for user-facing outputs
- [ ] Input validation and sanitization
- [ ] PII detection and redaction
- [ ] CORS explicit allowlist
- [ ] TLS 1.2+ enforced
- [ ] Dependency audit in CI`,
        `## Anti-Patterns

- ❌ Hardcoded API keys or connection strings
- ❌ console.log instead of structured logging
- ❌ Missing error handling on async operations
- ❌ Public endpoints in production without auth
- ❌ Unbounded queries without pagination
- ❌ Not implementing health check endpoint
- ❌ Logging PII or secrets`,
        `## WAF Alignment

### Security
- Managed Identity, Key Vault, private endpoints, Content Safety

### Reliability
- Retry with backoff, circuit breaker, health checks, graceful degradation

### Cost Optimization
- Right-sized resources, caching, batch operations, token budgets

### Operational Excellence
- Structured logging, App Insights, CI/CD, feature flags, alerts`
    ]);
}

console.log("═══ IB3: Enriching Instructions 021-030 ═══\n");
let enriched = 0, totalBefore = 0, totalAfter = 0;
for (const f of all) {
    const fp = path.join(dir, f);
    const before = fs.readFileSync(fp, "utf8").split("\n").length;
    totalBefore += before;
    const key = f.replace(".instructions.md", "");
    let content = contentMap[key];
    if (!content) {
        content = genGeneric(f);
        if (!content) { totalAfter += before; console.log(`  ⏭️  ${f}: ${before} (already OK)`); continue; }
    }
    fs.writeFileSync(fp, content);
    const after = fs.readFileSync(fp, "utf8").split("\n").length;
    totalAfter += after;
    enriched++;
    console.log(`  ✅ ${f}: ${before} → ${after}`);
}
console.log(`\n═══ IB3 COMPLETE: enriched=${enriched} avg=${Math.round(totalAfter / all.length)} ═══`);
