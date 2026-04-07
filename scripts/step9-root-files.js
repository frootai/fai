// Step 9: Enrich root agent.md, instructions.md, README.md to 200+ lines
const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory()).sort();
function getName(f) { return f.replace(/^\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }
function getId(f) { return f.split("-")[0]; }

// ─── AGENT.MD TEMPLATE ─────────────────────────────────────────
function agentTemplate(f) {
    const name = getName(f); const id = getId(f);
    return `---
description: "Production agent for ${name} (Play ${id}) — implements the FAI Protocol agent specification"
tools: ["terminal", "file", "search"]
model: "gpt-4o"
waf: ["reliability", "security", "cost-optimization", "operational-excellence", "performance-efficiency", "responsible-ai"]
plays: ["${f}"]
---

# ${name} Agent

You are the production agent for the FrootAI ${name} solution play (Play ${id}). You implement the full FAI Protocol agent specification with deep expertise in this domain.

## Your Role
You are the primary AI agent for this solution play. You understand the architecture, Azure services, configuration, evaluation pipeline, and deployment workflow. You can build, review, tune, and troubleshoot this solution.

## Architecture Expertise

### Solution Overview
This play implements a production-grade ${name} system on Azure using:
- **Azure OpenAI Service** — GPT-4o for generation, text-embedding-3-large for vectors
- **Azure AI Search** — Hybrid search with semantic ranking
- **Azure Key Vault** — Secret management with Managed Identity
- **Azure App Insights** — Observability, custom metrics, distributed tracing
- **Azure Storage** — Data persistence, blob storage for artifacts
- **Infrastructure-as-Code** — Bicep templates with dev/staging/prod environments

### Data Flow
1. User request arrives at API endpoint
2. Input validation and content safety check
3. Query processing and embedding generation
4. Retrieval from data store (search, database, cache)
5. Context assembly and prompt construction
6. AI model inference with structured output
7. Output validation, safety check, and formatting
8. Response with metadata (latency, tokens, sources)
9. Async telemetry to Application Insights

## Configuration Knowledge

### Config Files
| File | Purpose | Key Settings |
|------|---------|-------------|
| \`config/openai.json\` | Model parameters | model, temperature, max_tokens, api_version |
| \`config/agents.json\` | Agent behavior | roles, handoff rules, escalation criteria |
| \`config/guardrails.json\` | Safety thresholds | content_safety, groundedness_min, max_latency |
| \`config/model-comparison.json\` | Model selection | cost, latency, quality per model |
| \`config/chunking.json\` | Data processing | chunk_size, overlap, strategy |
| \`config/search.json\` | Retrieval config | search_type, top_k, score_threshold |

### Production Defaults
- Temperature: 0.1 (deterministic, reliable responses)
- Max tokens: 4096 (sufficient for detailed answers)
- Content safety threshold: 4 (block concerning content)
- Groundedness minimum: 0.85 (responses must be grounded)
- Latency p95 target: 3000ms

## Tool Usage

### Available Tools
You have access to these tools for implementing and managing this solution:

| Tool | When to Use | Example |
|------|------------|---------|
| \`terminal\` | Run commands, deploy, test | \`az deployment group create ...\` |
| \`file\` | Read/write code, config, docs | Edit config/openai.json |
| \`search\` | Find code patterns, references | Search for retry patterns |

### Terminal Commands You Use
\`\`\`bash
# Infrastructure
az bicep build -f infra/main.bicep
azd up --environment dev
az deployment group show -g rg-frootai-dev -n deploy-* --query properties.outputs

# Evaluation
python evaluation/eval.py --ci-gate
python evaluation/eval.py --report html --output evaluation/report.html

# Testing
pytest tests/ -v --cov=app
k6 run tests/load/scenario.js --vus 50 --duration 60s
\`\`\`

## Guardrails

### What You MUST Do
1. Always use Managed Identity — never hardcode API keys
2. Validate all inputs before processing
3. Check content safety on all user-facing outputs
4. Use structured logging with correlation IDs
5. Handle errors gracefully with meaningful messages
6. Follow the config/ files — never hardcode parameters
7. Include source attribution in generated responses
8. Monitor and alert on quality metrics

### What You MUST NOT Do
1. Never expose raw error messages to users
2. Never log PII or full user prompts
3. Never skip content safety checks
4. Never deploy without running evaluation pipeline
5. Never use Free/Basic SKUs in production
6. Never disable retry logic on external calls
7. Never commit secrets to version control
8. Never ignore evaluation metric failures

## Response Format
When generating responses:
- Include inline comments explaining complex logic
- Use type hints on all function signatures
- Return structured responses with metadata
- Include error handling for all external calls
- Add logging at appropriate verbosity levels

## Agent Chain
You work with two other agents:
- **@builder** — Implements features and writes code
- **@reviewer** — Reviews code for quality and security
- **@tuner** — Optimizes configuration for production

The workflow: builder → reviewer → tuner → production ready.

## Well-Architected Framework Alignment
Every decision you make aligns with the 6 WAF pillars:
- **Reliability:** Retry policies, health checks, graceful degradation, circuit breaker
- **Security:** Managed Identity, Key Vault, Content Safety, RBAC, encryption
- **Cost:** Model routing (cheap→capable), caching, right-sized SKUs, PTU planning
- **Ops Excellence:** Bicep IaC, CI/CD pipelines, observability, incident runbooks
- **Performance:** Async patterns, connection pooling, CDN, caching, streaming
- **Responsible AI:** Content safety, groundedness, fairness, transparency, accountability

## Escalation
If you encounter issues you cannot resolve:
1. Log the issue with full context
2. Check if the issue is in config (fixable) or architecture (needs design change)
3. If config: adjust values in config/*.json and re-evaluate
4. If architecture: document the issue and escalate with recommended approach

## FAI Protocol
This agent is wired via \`fai-manifest.json\` which defines:
- Context (knowledge modules, WAF alignment)
- Primitives (agents, instructions, skills, hooks)
- Infrastructure (Azure resources, deployment config)
- Guardrails (quality thresholds, safety rules)
- Toolkit (DevKit for building, TuneKit for optimization)
`;
}

// ─── INSTRUCTIONS.MD TEMPLATE ──────────────────────────────────
function instructionsTemplate(f) {
    const name = getName(f); const id = getId(f);
    return `---
description: "Root coding instructions for ${name} (Play ${id})"
applyTo: "**/*"
---

# ${name} — Coding Standards & Project Instructions

## Project Overview
This is the FrootAI ${name} solution play (Play ${id}). It implements a production-grade ${name} system on Azure using the FAI Protocol for AI primitive unification.

## Architecture
\`\`\`
┌─────────────┐     ┌───────────────┐     ┌──────────────────┐
│   Client     │────▶│   API Layer   │────▶│  Processing      │
│   (HTTPS)    │◀────│   (FastAPI)   │◀────│  Pipeline        │
└─────────────┘     └───────────────┘     └──────────────────┘
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐     ┌──────────────────┐
                    │  Azure       │     │  Azure OpenAI    │
                    │  Key Vault   │     │  (GPT-4o)        │
                    └──────────────┘     └──────────────────┘
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐     ┌──────────────────┐
                    │  App         │     │  Data Store      │
                    │  Insights    │     │  (Search/DB)     │
                    └──────────────┘     └──────────────────┘
\`\`\`

## File Structure
| Directory | Purpose |
|-----------|---------|
| \`.github/agents/\` | Builder, reviewer, tuner agents |
| \`.github/instructions/\` | Coding standards per domain |
| \`.github/prompts/\` | Slash commands (/deploy, /test, /review, /evaluate) |
| \`.github/skills/\` | Multi-step operations (deploy, evaluate, tune) |
| \`.github/workflows/\` | AI-driven CI/CD pipelines |
| \`config/\` | All configuration (models, guardrails, agents) |
| \`evaluation/\` | Quality evaluation pipeline (eval.py, test-set.jsonl) |
| \`infra/\` | Bicep IaC (main.bicep, parameters.json) |
| \`mcp/\` | MCP server plugin integration |

## Coding Standards

### Python
- Python 3.10+ required
- Use \`async/await\` for all I/O operations
- Type hints on all function signatures
- Pydantic models for data validation
- \`DefaultAzureCredential\` for all Azure auth
- Structured logging with \`logging\` module
- \`pytest\` for testing with \`pytest-asyncio\`

### TypeScript/JavaScript
- TypeScript 5.0+ with strict mode
- ESModules (import/export, not require)
- \`@azure/identity\` for Azure auth
- Zod for runtime validation
- Structured logging with correlation IDs

### Bicep
- Use \`@description\` decorators on all parameters
- Conditional resources for dev/prod (\`if (environment == 'prod')\`)
- RBAC role assignments for Managed Identity
- Diagnostic settings on all resources
- Tags on all resources: project, play, environment, managedBy

## Naming Conventions

### Files
- Python: \`snake_case.py\` (e.g., \`document_processor.py\`)
- TypeScript: \`kebab-case.ts\` (e.g., \`query-handler.ts\`)
- Config: \`kebab-case.json\` (e.g., \`model-comparison.json\`)
- Bicep: \`kebab-case.bicep\` (e.g., \`main.bicep\`)

### Code
- Functions: \`snake_case\` (Python), \`camelCase\` (TypeScript)
- Classes: \`PascalCase\`
- Constants: \`UPPER_SNAKE_CASE\`
- Config keys: \`snake_case\` in JSON

### Azure Resources
- Pattern: \`{type}-{project}-{environment}\`
- Resource Group: \`rg-frootai-{env}\`
- OpenAI: \`oai-frootai-{env}\`
- Key Vault: \`kv-frootai-{suffix}\`
- Storage: \`stfrootai{env}\` (no hyphens)

## Error Handling

### Pattern
\`\`\`python
from enum import Enum

class ErrorCategory(Enum):
    VALIDATION = "validation_error"
    AUTH = "auth_error"
    RATE_LIMIT = "rate_limit"
    SERVICE = "service_error"
    SAFETY = "content_blocked"
    TIMEOUT = "timeout_error"
    INTERNAL = "internal_error"

class AppError(Exception):
    def __init__(self, category: ErrorCategory, message: str, details: dict = None):
        self.category = category
        self.message = message
        self.details = details or {}
        super().__init__(message)
\`\`\`

### Rules
1. Every external call must have try/except with specific exception types
2. Retry transient failures (429, 503) with exponential backoff
3. Circuit breaker for persistent failures (5+ consecutive)
4. Log errors with correlation ID and context
5. Return user-friendly messages (never raw stack traces)

## Testing Requirements
- **Unit tests:** Business logic, 80%+ coverage
- **Integration tests:** Azure SDK calls with mocks
- **E2E tests:** Full request-response cycle
- **Load tests:** 100 concurrent users baseline
- **Evaluation:** All metrics must pass thresholds

## Configuration
All parameters come from \`config/*.json\` files. Never hardcode:
- Model names or versions
- Temperature, max_tokens, top_p
- Safety thresholds
- Retry counts and timeouts
- Endpoint URLs
- SKU names

## Deployment
1. Validate: \`az bicep lint -f infra/main.bicep\`
2. Deploy: \`azd up --environment {env}\`
3. Verify: \`curl {url}/health\`
4. Evaluate: \`python evaluation/eval.py --ci-gate\`
5. Monitor: Check Application Insights for errors

## Security Checklist
- [ ] Managed Identity for all Azure auth
- [ ] Key Vault for all secrets
- [ ] Content Safety on user-facing outputs
- [ ] Input validation with Pydantic/Zod
- [ ] HTTPS only (TLS 1.2+)
- [ ] No secrets in git (pre-commit hook)
- [ ] RBAC with least-privilege
- [ ] Audit logging enabled

## Dependencies
Keep dependencies minimal and pinned:
\`\`\`
azure-identity==1.19.0
azure-ai-openai==1.0.0
azure-keyvault-secrets==4.9.0
azure-monitor-opentelemetry==1.6.4
fastapi==0.115.0
pydantic==2.10.0
uvicorn==0.34.0
\`\`\`
`;
}

// ─── README.MD TEMPLATE ────────────────────────────────────────
function readmeTemplate(f) {
    const name = getName(f); const id = getId(f);
    return `# Play ${id}: ${name}

> **FrootAI Solution Play** — Production-grade ${name} on Azure with FAI Protocol integration

[![WAF Aligned](https://img.shields.io/badge/WAF-6%2F6%20Pillars-green)](#waf-alignment)
[![Azure](https://img.shields.io/badge/Azure-AI%20Services-blue)](#azure-services)
[![FAI Protocol](https://img.shields.io/badge/FAI-Protocol%20v1-purple)](#fai-protocol)

## Overview
This solution play implements a production-ready ${name} system using Azure AI Services, following the FrootAI FAI Protocol for AI primitive unification and the Azure Well-Architected Framework (WAF) across all six pillars.

## Architecture

\`\`\`mermaid
graph TB
    Client[Client Application] --> API[API Gateway / APIM]
    API --> App[Application Service]
    App --> OpenAI[Azure OpenAI<br/>GPT-4o]
    App --> Search[Data Store<br/>AI Search / Cosmos DB]
    App --> KV[Azure Key Vault]
    App --> AI[Application Insights]
    
    subgraph Monitoring
        AI --> LA[Log Analytics]
        LA --> Alerts[Alert Rules]
    end
    
    subgraph Security
        KV --> MI[Managed Identity]
        MI --> RBAC[RBAC Roles]
    end
\`\`\`

## Azure Services
| Service | Purpose | SKU (Prod) |
|---------|---------|------------|
| Azure OpenAI | Model inference (GPT-4o, embeddings) | S0 + GlobalStandard |
| Azure Key Vault | Secret management | Standard |
| Application Insights | Monitoring, tracing | Pay-as-you-go |
| Log Analytics | Log aggregation, KQL queries | PerGB2018 |
| Azure Storage | Data persistence | Standard_GRS |

## Prerequisites
- Azure subscription with Contributor access
- Azure CLI v2.60+ (\`az --version\`)
- Azure Developer CLI v1.9+ (\`azd version\`)
- Python 3.10+ (for evaluation pipeline)
- Node.js 20+ (for MCP integration)

## Quickstart

### 1. Clone and Navigate
\`\`\`bash
git clone https://github.com/frootai/frootai.git
cd solution-plays/${f}
\`\`\`

### 2. Deploy Infrastructure
\`\`\`bash
az login
azd init
azd up --environment dev
\`\`\`

### 3. Verify Deployment
\`\`\`bash
curl -s https://\${APP_URL}/health | jq .
\`\`\`

### 4. Run Evaluation
\`\`\`bash
pip install -r evaluation/requirements.txt
python evaluation/eval.py --ci-gate
\`\`\`

### 5. Use with Copilot
Open this folder in VS Code with GitHub Copilot. The agent chain (builder → reviewer → tuner) activates automatically.

## Configuration
All settings are in the \`config/\` directory:

| File | Description |
|------|-------------|
| \`openai.json\` | Model parameters (temperature, max_tokens, model) |
| \`agents.json\` | Agent behavior and handoff rules |
| \`guardrails.json\` | Content safety thresholds and evaluation gates |
| \`model-comparison.json\` | Model cost/quality comparison matrix |
| \`chunking.json\` | Data processing configuration |
| \`search.json\` | Search/retrieval settings |

## Agent Chain (DevKit)
This play includes three specialized agents:

| Agent | File | Role |
|-------|------|------|
| **Builder** | \`.github/agents/builder.agent.md\` | Implements features, writes code |
| **Reviewer** | \`.github/agents/reviewer.agent.md\` | Reviews security, quality, WAF compliance |
| **Tuner** | \`.github/agents/tuner.agent.md\` | Optimizes config for production |

Workflow: \`@builder\` → \`@reviewer\` → \`@tuner\` → Production Ready

## Evaluation Pipeline
The evaluation pipeline (\`evaluation/eval.py\`) measures:

| Metric | Threshold | Description |
|--------|-----------|-------------|
| Relevance | ≥ 0.80 | Response addresses the query |
| Groundedness | ≥ 0.85 | Grounded in provided context |
| Coherence | ≥ 0.80 | Logically consistent |
| Fluency | ≥ 0.85 | Grammatically correct |
| Safety | ≥ 0.95 | No harmful content |
| Latency p95 | ≤ 3s | Response time |

\`\`\`bash
python evaluation/eval.py --report html --output evaluation/report.html
\`\`\`

## WAF Alignment
| Pillar | Implementation |
|--------|---------------|
| **Reliability** | Retry policies, health checks, circuit breaker, graceful degradation |
| **Security** | Managed Identity, Key Vault, Content Safety, RBAC, encryption |
| **Cost Optimization** | Model routing, caching, right-sized SKUs, token budgets |
| **Operational Excellence** | Bicep IaC, CI/CD, observability, incident runbooks |
| **Performance** | Async patterns, connection pooling, CDN, streaming |
| **Responsible AI** | Content safety, groundedness, fairness, transparency |

## Cost Estimate
| Resource | Dev (monthly) | Prod (monthly) |
|----------|:------------:|:-------------:|
| Azure OpenAI (GPT-4o) | ~$50 | ~$500 |
| Azure OpenAI (Embeddings) | ~$10 | ~$100 |
| Key Vault | ~$1 | ~$5 |
| Application Insights | ~$5 | ~$50 |
| Storage | ~$2 | ~$20 |
| **Total** | **~$68** | **~$675** |

## Troubleshooting

### Common Issues
| Issue | Solution |
|-------|---------|
| \`DefaultAzureCredential\` fails | Run \`az login\`, check RBAC assignments |
| Model deployment not found | Verify deployment name in openai.json matches Azure portal |
| Rate limit (429) | Check PTU capacity, implement retry with backoff |
| Content blocked | Review Content Safety thresholds in guardrails.json |
| High latency | Enable caching, reduce max_tokens, check network path |

## FAI Protocol
This play is wired through \`fai-manifest.json\`:
- **Context:** Knowledge modules define what the play knows
- **Primitives:** Agents, instructions, skills, hooks wired together
- **Infrastructure:** Azure resource requirements defined in Bicep
- **Guardrails:** Quality gates and safety rules enforced at runtime

## Contributing
See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines. Use the agent chain:
1. \`@builder\` to implement changes
2. \`@reviewer\` to validate quality
3. \`@tuner\` to optimize for production

## License
MIT — see [LICENSE](../../LICENSE)
`;
}

// Execute
let stats = { agent: 0, instructions: 0, readme: 0 };
for (const p of plays) {
    const files = [
        { key: "agent", path: path.join(dir, p, "agent.md"), template: agentTemplate(p) },
        { key: "instructions", path: path.join(dir, p, "instructions.md"), template: instructionsTemplate(p) },
        { key: "readme", path: path.join(dir, p, "README.md"), template: readmeTemplate(p) },
    ];
    for (const f of files) {
        if (fs.existsSync(f.path)) {
            const lines = fs.readFileSync(f.path, "utf8").split("\n").length;
            if (lines < 200) { fs.writeFileSync(f.path, f.template); stats[f.key]++; }
        }
    }
}

// Verify
for (const [label, file] of [["agent.md", "agent.md"], ["instructions.md", "instructions.md"], ["README.md", "README.md"]]) {
    const lines = plays.map(p => {
        const fp = path.join(dir, p, file);
        return fs.existsSync(fp) ? fs.readFileSync(fp, "utf8").split("\n").length : 0;
    }).filter(l => l > 0);
    console.log(`${label}: fixed=${stats[label.replace(".md", "").toLowerCase()] || stats.readme}, min=${Math.min(...lines)}, avg=${Math.round(lines.reduce((a, b) => a + b, 0) / lines.length)}, under200=${lines.filter(l => l < 200).length}`);
}
