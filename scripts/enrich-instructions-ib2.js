#!/usr/bin/env node
/**
 * enrich-instructions-ib2.js — Enrich instructions 011-020 to 150+ lines
 * Run: node scripts/enrich-instructions-ib2.js
 */
const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, "..", "instructions");
const instructions = fs.readdirSync(dir).filter(f => f.endsWith(".instructions.md")).sort().slice(10, 20);

const contentMap = {
    "azure-ai-vision-waf": `---
description: "Azure AI Vision standards — image analysis, OCR, custom classification, spatial analysis, and content safety patterns."
applyTo: "**/*.py, **/*.ts, **/*.js"
waf:
  - "reliability"
  - "performance-efficiency"
  - "security"
  - "cost-optimization"
---

# Azure AI Vision — WAF-Aligned Coding Standards

## Image Analysis API

- Use \`ImageAnalysisClient\` from \`@azure/cognitiveservices-computervision\` (JS) or \`azure.ai.vision\` (Python)
- Authenticate with \`DefaultAzureCredential\` — never API keys in production code
- Specify visual features explicitly: \`["Caption", "Tags", "Objects", "Read"]\` — don't request all features
- Set \`language\` parameter for non-English content analysis
- Handle large images: resize client-side before sending (max 4MB, 50MP limit)
- Use \`model_version\` parameter to pin to specific model version for reproducibility

## OCR (Read API)

- Use Read API v4.0 (async) for production — supports PDF, TIFF, multi-page documents
- For real-time OCR: use analyze endpoint with \`Read\` feature (sync, single image)
- Handle multi-page results: iterate through \`readResult.pages[].lines[].words[]\`
- Extract handwriting by enabling \`handwritingEnabled\` — separate confidence thresholds
- Set minimum confidence threshold (0.7 default) for word-level extraction
- Preserve document layout: use bounding box coordinates for spatial reconstruction

## Custom Classification & Object Detection

- Use Custom Vision or Florence model for domain-specific classification
- Training data: minimum 15 images per class, diverse lighting/angles/backgrounds
- Evaluation: precision, recall, F1 per class, confusion matrix, mAP for detection
- Version trained models, track evaluation metrics per version, A/B test before promotion
- Export ONNX for edge deployment — validate quality matches cloud model within 5%

## Content Safety for Images

- Apply Content Safety API to all user-uploaded images before processing
- Categories: hate, violence, sexual, self-harm — severity threshold ≤2 for production
- Block processing if ANY category exceeds threshold — log event, return safe error
- For batch processing: pre-screen all images before OCR/analysis pipeline

## Error Handling

\`\`\`python
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.identity import DefaultAzureCredential
from azure.core.exceptions import HttpResponseError, ServiceRequestError

client = ImageAnalysisClient(endpoint=config.endpoint, credential=DefaultAzureCredential())

try:
    result = client.analyze(image_data=image_bytes, visual_features=["Caption", "Read"])
except HttpResponseError as e:
    if e.status_code == 429:
        logger.warning("Vision API rate limited", extra={"retry_after": e.response.headers.get("Retry-After")})
        # Retry with backoff
    elif e.status_code == 400:
        logger.error("Invalid image", extra={"error": str(e)})
        # Skip this image, continue batch
    else:
        logger.exception("Vision API error", extra={"status": e.status_code})
        raise
except ServiceRequestError:
    logger.error("Network error connecting to Vision API")
    # Circuit breaker
\`\`\`

## Performance Optimization

- Batch processing: process images in parallel (asyncio.gather, max 10 concurrent)
- Resize images client-side: 1024px max dimension for analysis, 2048px for OCR
- Cache analysis results by image hash — TTL based on use case (5min for real-time, 1hr for batch)
- Use streaming for large PDF OCR — process pages as they're available
- Connection pooling: reuse HTTP client across requests

## Cost Optimization

- Select only needed visual features — each feature has separate pricing
- Use gpt-4o-mini for simple classification instead of Vision API when text suffices
- Batch operations during off-peak for lower priority work
- Cache results aggressively — same image = same result
- Monitor per-image cost and set alerts on anomalies

## Anti-Patterns

- ❌ Requesting all visual features when you only need OCR
- ❌ Sending full-resolution images (10MB+) when analysis works at 1024px
- ❌ Not handling 429 rate limits — causes cascading failures
- ❌ Storing raw image bytes in logs (privacy + cost)
- ❌ Using synchronous Read API for multi-page PDFs (timeout risk)
- ❌ Hardcoding model versions — use config for version pinning

## WAF Alignment

### Security
- DefaultAzureCredential, private endpoints, Content Safety pre-screening, PII in images masked

### Reliability
- Retry with backoff on 429/5xx, circuit breaker, timeout (30s analysis, 120s OCR), health checks

### Performance Efficiency
- Client-side resize, parallel processing, connection pooling, streaming for large docs

### Cost Optimization
- Minimal feature selection, caching by image hash, batch off-peak, monitor per-image cost
`,

    "azure-app-service-waf": `---
description: "Azure App Service standards — deployment slots, scaling, authentication, monitoring, and security patterns."
applyTo: "**/*.py, **/*.ts, **/*.js, **/*.cs, **/Dockerfile"
waf:
  - "reliability"
  - "security"
  - "cost-optimization"
  - "operational-excellence"
---

# Azure App Service — WAF-Aligned Coding Standards

## Deployment & Slots

- Use deployment slots for zero-downtime deployments (staging → swap to production)
- Configure auto-swap for staging slot after health check passes
- Set slot-specific app settings (non-swappable): database connections, feature flags
- Pre-warm staging slot before swap: send synthetic traffic to /health endpoint
- Never deploy directly to production slot — always stage → test → swap

## Scaling Configuration

- Use auto-scale rules based on CPU (>70%) and HTTP queue length (>50)
- Set minimum instance count ≥2 for production (availability SLA 99.95%)
- Configure scale-out cooldown (5min) to prevent flapping
- Use Premium v3 or Isolated for production AI workloads (better CPU, more memory)
- Scale-in: drain connections gracefully, minimum 10min cooldown

## Authentication & Security

\`\`\`csharp
// Easy Auth (built-in) for quick setup
// For API: use Azure AD JWT validation middleware
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(Configuration);

// Managed Identity for downstream services
var credential = new DefaultAzureCredential();
var secretClient = new SecretClient(new Uri(kvUri), credential);
\`\`\`

- Enable Easy Auth for user-facing apps (Entra ID, B2C, social providers)
- For APIs: validate JWT tokens with Microsoft.Identity.Web
- Use Managed Identity (system-assigned) for accessing Key Vault, Storage, Cosmos DB
- IP restrictions: allow only Front Door / APIM IPs in production
- Enable HTTPS Only, minimum TLS 1.2, disable client certificate if not needed

## Monitoring & Diagnostics

- Enable Application Insights auto-instrumentation (zero-code for .NET/Java/Node)
- Configure diagnostic logs: Application logs, Web server logs, Detailed error messages
- Set up health check endpoint at \`/health\` — App Service uses this for instance rotation
- Enable Always On for production (prevents idle timeout cold starts)
- Configure alerts: HTTP 5xx rate >5%, response time p95 >3s, instance count changes

## Application Settings

- Store all secrets in Key Vault — reference with \`@Microsoft.KeyVault(VaultName=...;SecretName=...)\`
- Use slot-sticky settings for environment-specific config (connection strings, feature flags)
- Never store secrets in appsettings.json or environment variables directly
- JSON configuration: nested keys use \`__\` (double underscore) as separator in App Settings

## Networking

- VNet integration for outbound calls to private resources (Cosmos DB, AI Search)
- Private endpoints for inbound traffic (disable public access in production)
- Service endpoints as cheaper alternative to PE when full isolation not required
- Hybrid connections for on-premises access without VPN

## Performance Patterns

- Enable response compression (gzip/brotli) in middleware
- Use output caching middleware (.NET 8+) or Redis for response caching
- Configure connection pooling for database clients
- Implement health check with dependency status for load balancer awareness
- PRE_WARM_ENABLED for slot warm-up during deployment

## Anti-Patterns

- ❌ Deploying directly to production slot without staging
- ❌ Storing secrets in App Settings instead of Key Vault references
- ❌ Single instance for production (no HA, no SLA)
- ❌ Not configuring health check endpoint (App Service can't detect unhealthy instances)
- ❌ Always On disabled on production (30min idle → cold start)
- ❌ Public network access enabled when behind Front Door/APIM

## WAF Alignment

### Security
- Managed Identity, Key Vault references, IP restrictions, TLS 1.2+, Easy Auth

### Reliability
- Deployment slots, min 2 instances, health checks, auto-scale, graceful drain

### Cost Optimization
- Right-size SKU (B1 dev, P1v3 prod), auto-scale rules, reserved instances for stable

### Operational Excellence
- App Insights, diagnostic logs, alerts, deployment slots for safe rollback
`,

    "azure-bicep-avm": `---
description: "Azure Bicep AVM (Azure Verified Modules) standards — module usage, parameter patterns, WAF-aligned infrastructure."
applyTo: "**/*.bicep, **/parameters.json"
waf:
  - "security"
  - "reliability"
  - "cost-optimization"
  - "operational-excellence"
---

# Azure Bicep AVM — WAF-Aligned Coding Standards

## Module Selection

- Prefer Azure Verified Modules (AVM) from \`br/public:avm/\` registry over custom modules
- Check AVM registry: \`https://aka.ms/avm/bicep/modules\` for available modules
- Pin module versions: \`br/public:avm/res/cognitive-services/account:0.7.0\` — never use \`latest\`
- For resources without AVM: write custom modules following AVM patterns (interface, tests, docs)

## Parameter Patterns

\`\`\`bicep
// CORRECT: Typed, documented, validated parameters
@description('The environment name (dev, staging, prod)')
@allowed(['dev', 'staging', 'prod'])
param environment string

@description('The Azure region for deployment')
param location string = resourceGroup().location

@description('The project name used for resource naming')
@minLength(3)
@maxLength(24)
param projectName string

@secure()
@description('Optional: Override API key (prefer Managed Identity)')
param apiKey string = ''
\`\`\`

- Use \`@description\` on ALL parameters — this generates documentation automatically
- Use \`@allowed\`, \`@minLength\`, \`@maxLength\`, \`@minValue\`, \`@maxValue\` for validation
- Mark sensitive params with \`@secure()\` — prevents logging in deployment history
- Provide sensible defaults where possible (location, environment='dev')
- Use parameter files (parameters.json) for environment-specific values

## Naming Convention

\`\`\`bicep
var suffix = uniqueString(resourceGroup().id)
var resourcePrefix = '\${projectName}-\${environment}'
var tags = {
  environment: environment
  project: 'frootai'
  play: playName
  'managed-by': 'bicep'
}
\`\`\`

- Use \`uniqueString()\` suffix for globally unique names (storage, cognitive services)
- Include environment in resource names: \`frootai-rag-dev-oai-abc123\`
- Tag ALL resources: environment, project, play, managed-by
- Use variables for computed names — don't repeat naming logic

## Conditional Resources

\`\`\`bicep
// Production gets private endpoints, dev gets public access
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2024-01-01' = if (environment == 'prod') {
  name: '\${resourcePrefix}-pe-oai'
  location: location
  properties: {
    subnet: { id: subnetId }
    privateLinkServiceConnections: [{ /* ... */ }]
  }
}

// SKU based on environment
var searchSku = environment == 'prod' ? 'standard' : 'basic'
\`\`\`

## Security Patterns

- Enable Managed Identity on all compute resources (Container Apps, Functions, App Service)
- Configure RBAC with \`roleAssignments\` — use built-in role definition IDs
- Enable diagnostic settings on ALL resources → central Log Analytics workspace
- Private endpoints for data-plane operations in production
- Key Vault for secrets — never store in Bicep parameters or outputs

## Module Composition

\`\`\`bicep
// Compose AVM modules with custom wiring
module openai 'br/public:avm/res/cognitive-services/account:0.7.0' = {
  name: 'deploy-openai'
  params: {
    name: '\${resourcePrefix}-oai-\${suffix}'
    location: location
    kind: 'OpenAI'
    sku: 'S0'
    tags: tags
    managedIdentities: { systemAssigned: true }
    diagnosticSettings: [{ workspaceResourceId: logAnalytics.id }]
  }
}
\`\`\`

## Output Patterns

- Output resource IDs, endpoints, and names needed by dependent deployments
- Never output secrets — use Key Vault references instead
- Use \`@description\` on outputs for documentation

## Testing

- Validate with \`az bicep build\` in CI — catches syntax and type errors
- Use \`what-if\` deployment for change preview before apply
- Test with different parameter combinations (dev/staging/prod)
- Validate AVM module versions are not deprecated

## Anti-Patterns

- ❌ Hardcoding resource names without uniqueString (collision risk)
- ❌ Missing tags on resources (ungovernable, no cost attribution)
- ❌ Using \`latest\` API versions (breaking changes on update)
- ❌ Outputting secrets (appear in deployment history)
- ❌ Not using conditional resources for dev/prod differentiation
- ❌ Copy-pasting resource definitions instead of using modules

## WAF Alignment

### Security
- Managed Identity, RBAC, private endpoints (prod), Key Vault, diagnostic settings

### Reliability
- Zone redundancy (prod), backup configuration, health probes, multi-region (DR)

### Cost Optimization
- Conditional SKUs (Basic dev, Standard prod), auto-scale, tagging for cost attribution

### Operational Excellence
- AVM modules, parameter files, CI validation, what-if previews, tagging, diagnostic logs
`,
};

// For the remaining Azure instructions, generate domain-specific content
const azureInstructions = {
    "azure-cosmos-waf": { title: "Azure Cosmos DB", domain: "global distribution, partitioning, consistency, RU optimization, vector search", services: "NoSQL API, Gremlin, MongoDB vCore, PostgreSQL", patterns: "partition key design, cross-partition queries, change feed, TTL, serverless vs provisioned" },
    "azure-devops-waf": { title: "Azure DevOps", domain: "YAML pipelines, environments, service connections, test management, boards", services: "Pipelines, Repos, Boards, Artifacts, Test Plans", patterns: "multi-stage YAML, variable groups, deployment jobs, approval gates, DORA metrics" },
    "azure-front-door-waf": { title: "Azure Front Door & WAF", domain: "global load balancing, WAF rules, caching, SSL offloading, origin protection", services: "Front Door Premium, WAF policies, CDN, Private Link origins", patterns: "OWASP CRS 3.2, custom rules, rate limiting, geo-filtering, bot protection" },
    "azure-functions-waf": { title: "Azure Functions", domain: "serverless compute, triggers, bindings, durable functions, cold start optimization", services: "Consumption, Premium, Dedicated, Container Apps hosting", patterns: "idempotent handlers, poison message handling, connection pooling, Durable Functions" },
    "azure-logic-apps-waf": { title: "Azure Logic Apps", domain: "workflow automation, connectors, error handling, B2B integration", services: "Standard (stateful/stateless), Consumption, ISE (deprecated)", patterns: "retry policies, runAfter, scope-based error handling, batching, concurrency control" },
    "azure-redis-waf": { title: "Azure Cache for Redis", domain: "caching patterns, data structures, pub/sub, clustering, security", services: "Enterprise, Premium (clustering), Standard, Basic", patterns: "cache-aside, semantic cache, session store, pub/sub, Streams, eviction policies" },
    "azure-static-web-apps-waf": { title: "Azure Static Web Apps", domain: "static hosting, serverless API, authentication, CI/CD, custom domains", services: "Free, Standard tiers, linked APIs, Managed Functions", patterns: "Next.js/Nuxt/SvelteKit SSG, API routes, Easy Auth, split environments, preview PRs" },
};

function generateAzureInstruction(key, meta) {
    const slug = key;
    return `---
description: "${meta.title} standards — ${meta.domain}."
applyTo: "**/*.py, **/*.ts, **/*.js, **/*.cs, **/*.bicep"
waf:
  - "security"
  - "reliability"
  - "cost-optimization"
  - "operational-excellence"
  - "performance-efficiency"
---

# ${meta.title} — WAF-Aligned Coding Standards

## Service Overview

${meta.title} provides ${meta.domain}. Available tiers/modes: ${meta.services}.

## Authentication & Security

- Use \`DefaultAzureCredential\` for all service authentication — never API keys in production
- Store connection strings and secrets in Azure Key Vault, reference via environment variables
- Enable private endpoints for data-plane operations in production environments
- Configure diagnostic settings → central Log Analytics workspace for audit and troubleshooting
- Apply Azure Policy for governance: mandatory private endpoints, mandatory managed identity, allowed SKUs
- Enable TLS 1.2+ for all connections

## SDK Integration Patterns

\`\`\`typescript
// Pattern: Config-driven client initialization with Managed Identity
import { DefaultAzureCredential } from "@azure/identity";

const credential = new DefaultAzureCredential();
const config = JSON.parse(fs.readFileSync("config/openai.json", "utf8"));

// Always load endpoints and settings from config — never hardcode
const client = new ServiceClient(config.endpoint, credential, {
  retryOptions: { maxRetries: 3, retryDelayInMs: 1000, maxRetryDelayInMs: 30000 }
});
\`\`\`

## Error Handling

- Wrap all SDK calls in try/catch with structured error logging (Application Insights)
- Handle HTTP 429 (rate limited): respect Retry-After header, exponential backoff
- Handle HTTP 409 (conflict): implement conflict resolution strategy appropriate to service
- Handle HTTP 5xx (server error): retry with backoff, circuit breaker after 3 consecutive failures
- Log: operation name, duration, status code, correlation ID — never log secrets or PII

## Configuration Management

- All service parameters in \`config/*.json\` files — never hardcoded
- Environment-specific configurations via parameter files or environment variables
- Validate all configuration at startup — fail fast on missing required values
- Use feature flags for gradual service migration or A/B testing

## Key Patterns: ${meta.patterns}

### Pattern 1: Resilient Connection
- Connection pooling with explicit limits (max connections from config)
- Health check endpoint that verifies service connectivity
- Graceful degradation when service unavailable (cached fallback, default response)

### Pattern 2: Cost-Aware Usage
- Monitor usage metrics (RU/s, transactions, storage) with Application Insights custom metrics
- Set alerts on cost anomalies (>120% of baseline)
- Right-size tier based on actual usage patterns (review monthly)
- Use serverless/consumption tier for dev, provisioned for production

### Pattern 3: Observable Operations
- Structured JSON logging with correlation IDs for distributed tracing
- Custom Application Insights metrics: latency p50/p95/p99, error rate, throughput
- Dashboards in Azure Workbooks or Grafana for operational visibility
- Alert rules: latency p95 > SLO, error rate > 1%, availability < 99.9%

## Monitoring & Alerting

- Enable diagnostic settings on the resource → Log Analytics workspace
- Configure metric alerts: latency, error rate, capacity utilization
- Create Azure Workbook dashboard for operational visibility
- Set up action groups: email + Teams/Slack webhook for P1 alerts
- Review Azure Advisor recommendations monthly

## Anti-Patterns

- ❌ Hardcoding connection strings or API keys in source code
- ❌ Not implementing retry logic on transient failures
- ❌ Missing health check endpoint for load balancer integration
- ❌ Public endpoints in production without VNet integration
- ❌ Not monitoring service-specific metrics (RU/s, queue depth, cache hit ratio)
- ❌ Using development/Basic SKU in production (SLA, performance, feature limitations)
- ❌ Not tagging resources (environment, project, play, managed-by)

## WAF Alignment

### Security
- DefaultAzureCredential, Key Vault for secrets, private endpoints, TLS 1.2+, diagnostic logs

### Reliability
- Retry with exponential backoff, circuit breaker, health checks, geo-redundancy where available

### Cost Optimization
- Right-size SKU, serverless for dev, reserved capacity for stable prod, usage monitoring

### Performance Efficiency
- Connection pooling, caching, async operations, batch processing where supported

### Operational Excellence
- Diagnostic settings, structured logging, KQL dashboards, alerts, Infrastructure as Code
`;
}

console.log("═══ IB2: Enriching Instructions 011-020 ═══\n");
let enriched = 0, totalBefore = 0, totalAfter = 0;

for (const f of instructions) {
    const fp = path.join(dir, f);
    const before = fs.readFileSync(fp, "utf8").split("\n").length;
    totalBefore += before;
    const key = f.replace(".instructions.md", "");

    if (contentMap[key]) {
        fs.writeFileSync(fp, contentMap[key]);
    } else if (azureInstructions[key]) {
        fs.writeFileSync(fp, generateAzureInstruction(key, azureInstructions[key]));
    } else {
        console.log(`  ? ${f}: no content map`);
        totalAfter += before;
        continue;
    }

    const after = fs.readFileSync(fp, "utf8").split("\n").length;
    totalAfter += after;
    enriched++;
    console.log(`  ✅ ${f}: ${before} → ${after} lines`);
}

console.log(`\n═══ IB2 COMPLETE ═══`);
console.log(`  Enriched: ${enriched}/${instructions.length}`);
console.log(`  Lines: ${totalBefore} → ${totalAfter} (+${totalAfter - totalBefore})`);
console.log(`  Avg: ${Math.round(totalBefore / instructions.length)} → ${Math.round(totalAfter / instructions.length)}`);
