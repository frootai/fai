# FrootAI — Plugins

> Themed bundles of agents, instructions, skills, and hooks that ship as installable packages via the FAI Marketplace.

## Plugin Structure

Every plugin follows this standard folder layout:

```
plugins/
  my-plugin/
    plugin.json           # Required — plugin metadata (schema-validated)
    README.md             # Recommended — installation + usage docs
```

## plugin.json Schema

```json
{
  "name": "my-plugin",
  "description": "What this plugin provides",
  "version": "1.0.0",
  "author": { "name": "Author Name", "url": "https://..." },
  "repository": "https://github.com/...",
  "license": "MIT",
  "keywords": ["tag1", "tag2"],
  "agents": ["../../agents/my-agent.agent.md"],
  "instructions": ["../../instructions/my-instruction.instructions.md"],
  "skills": ["../../skills/my-skill/"],
  "hooks": ["../../hooks/my-hook/"],
  "plays": ["01-enterprise-rag"]
}
```

**Required fields:** `name`, `description`, `version`, `author.name`, `license`

**Naming rule:** `name` in plugin.json MUST match the folder name (kebab-case).

## Available Plugins (77)

### Solution Play Plugins (23)

Each FrootAI solution play ships as an installable plugin with builder/reviewer/tuner agents, play-specific patterns, deploy/evaluate/tune skills, and security hooks.

| Plugin | Items | Play | Description |
|--------|-------|------|-------------|
| `enterprise-rag` | 7 | 01 | Production RAG with Azure AI Search, evaluation, hooks |
| `ai-landing-zone` | 17 | 02 | Hub-spoke networking, RBAC, policy, Bicep IaC |
| `deterministic-agent` | 16 | 03 | FSM routing, guardrails, reproducible conversations |
| `call-center-voice-ai` | 16 | 04 | Speech-to-text, sentiment, AI agent coaching |
| `it-ticket-resolution` | 17 | 05 | Incident classification, KB search, Semantic Kernel |
| `document-intelligence` | 15 | 06 | OCR, form extraction, Azure AI Document Intelligence |
| `multi-agent-service` | 18 | 07 | Agent teams, supervisor patterns, shared memory |
| `copilot-studio-bot` | 17 | 08 | Copilot Studio, Teams, Dataverse, SSO |
| `ai-search-portal` | 16 | 09 | Vector + hybrid search, semantic ranking |
| `content-moderation` | 18 | 10 | Content Safety, blocklists, human-in-the-loop |
| `ai-landing-zone-advanced` | 20 | 11 | Multi-region, private endpoints, compliance |
| `model-serving-aks` | 20 | 12 | GPU inference, KEDA autoscaling, canary deploys |
| `fine-tuning-workflow` | 17 | 13 | Dataset prep, training, evaluation, model registry |
| `cost-optimized-ai-gateway` | 20 | 14 | Model routing, token budgets, caching, APIM |
| `multi-modal-docproc` | 16 | 15 | OCR + vision + speech multi-modal pipelines |
| `copilot-teams-extension` | 15 | 16 | Declarative agents, API plugins, M365 |
| `ai-observability` | 17 | 17 | Tracing, token dashboards, OpenTelemetry |
| `prompt-management` | 18 | 18 | Prompt versioning, A/B testing, Semantic Kernel |
| `edge-ai-phi4` | 16 | 19 | Phi-4 edge deployment, ONNX, quantization |
| `anomaly-detection` | 16 | 20 | Time-series anomaly, event-driven alerting |
| `agentic-rag` | 5 | 21 | Autonomous retrieval, multi-source synthesis |
| `multi-agent-swarm` | 5 | 22 | Distributed teams with supervisor pattern |
| `browser-automation` | 4 | 23 | Playwright MCP + vision web navigation |

### MCP Language Plugins (10)

Per-language MCP server development toolkits with expert agents, coding standards, and scaffold skills.

| Plugin | Items | Languages |
|--------|-------|-----------|
| `csharp-mcp-development` | 9 | C#, .NET, ASP.NET Core |
| `go-mcp-development` | 9 | Go, gRPC |
| `java-mcp-development` | 9 | Java, Spring Boot, Reactor |
| `kotlin-mcp-development` | 9 | Kotlin, Ktor, Coroutines |
| `php-mcp-development` | 9 | PHP, Laravel, Swoole |
| `python-mcp-development` | 9 | Python, FastMCP, asyncio |
| `ruby-mcp-development` | 9 | Ruby, Rails, Rack |
| `rust-mcp-development` | 9 | Rust, Tokio, RMCP |
| `swift-mcp-development` | 9 | Swift, Vapor, SwiftUI |
| `typescript-mcp-development` | 9 | TypeScript, Node.js, Zod |

### Azure Specialized Plugins (8)

Deep Azure service domain bundles with expert agents, WAF instructions, and infrastructure skills.

| Plugin | Items | Focus |
|--------|-------|-------|
| `azure-ai-services` | 19 | OpenAI, AI Search, Document Intel, Language, Speech, Vision |
| `azure-infrastructure` | 19 | Landing zones, networking, policy, RBAC, Bicep |
| `azure-data-services` | 18 | Cosmos DB, SQL, Storage, Data Explorer, Redis |
| `azure-serverless` | 11 | Functions, Logic Apps, Event Grid, Durable Functions |
| `azure-monitoring` | 11 | App Insights, Log Analytics, KQL, dashboards |
| `azure-identity-security` | 23 | Managed Identity, Key Vault, RBAC, zero-trust |
| `azure-messaging` | 11 | Service Bus, Event Hubs, Event Grid, CQRS |
| `azure-containers` | 15 | AKS, Container Apps, ACR, Docker, KEDA |

### Language & Framework Plugins (8)

Full-stack development bundles with expert agents, WAF instructions, and framework scaffolding skills.

| Plugin | Items | Stack |
|--------|-------|-------|
| `csharp-dotnet-development` | 17 | ASP.NET Core, Blazor, MAUI, EF Core |
| `java-development` | 13 | Spring Boot, Quarkus, JUnit, Maven |
| `python-fullstack` | 15 | FastAPI, Django, Flask, Pydantic, pytest |
| `typescript-fullstack` | 17 | Next.js, React, NestJS, Prisma, Zod |
| `go-development` | 8 | Go services, gRPC, cloud-native |
| `rust-development` | 7 | Tokio, WASM, systems programming |
| `frontend-web-development` | 22 | React, Vue, Svelte, Angular, Tailwind |
| `mobile-development` | 12 | Swift, Kotlin, MAUI, Flutter/Dart |

### AI & ML Plugins (6)

| Plugin | Items | Focus |
|--------|-------|-------|
| `ai-evaluation-suite` | 14 | Groundedness, coherence, safety scoring |
| `prompt-engineering` | 17 | CoT, few-shot, templates, optimization |
| `responsible-ai` | 16 | Content safety, bias, fairness, EU AI Act |
| `fine-tuning-mlops` | 14 | Dataset curation, training, MLflow |
| `llm-observability` | 12 | LLM tracing, token counts, cost attribution |
| `content-safety-toolkit` | 11 | Blocklists, prompt injection, jailbreak defense |

### Architecture & Planning Plugins (4)

| Plugin | Items | Focus |
|--------|-------|-------|
| `project-planning` | 16 | PRDs, epic breakdown, spikes, roadmaps |
| `architecture-patterns` | 16 | DDD, CQRS, microservices, C4 diagrams |
| `technical-documentation` | 20 | API docs, READMEs, Mermaid, PlantUML |
| `design-system` | 23 | UI components, tokens, themes, accessibility |

### DevOps & Infrastructure Plugins (5)

| Plugin | Items | Focus |
|--------|-------|-------|
| `cicd-automation` | 13 | GitHub Actions, Azure DevOps, release |
| `kubernetes-orchestration` | 8 | Helm, KEDA, Dapr, GPU scheduling |
| `terraform-iac` | 10 | Modules, state, drift detection |
| `docker-containerization` | 11 | Multi-stage, distroless, security scanning |
| `incident-response` | 10 | On-call triage, KQL, runbooks, SRE |

### Testing & Quality Plugins (3)

| Plugin | Items | Focus |
|--------|-------|-------|
| `testing-automation` | 2 | Unit, integration, E2E, TDD |
| `security-hardening` | 22 | OWASP, secrets, supply chain, threat modeling |
| `code-quality` | 17 | Code review, refactoring, dead code, tech debt |

### Meta & Discovery Plugins (3)

| Plugin | Items | Focus |
|--------|-------|-------|
| `frootai-essentials` | 14 | Essential WAF agents, OWASP, hooks, skills |
| `frootai-discovery` | 13 | Explore and recommend primitives |
| `fai-protocol-starter` | 12 | Scaffold fai-manifest.json + fai-context.json |
| `context-engineering` | 14 | Memory banks, knowledge wiring, contextual RAG |

### Community & Integration Plugins (3)

| Plugin | Items | Focus |
|--------|-------|-------|
| `salesforce-integration` | 6 | Apex, LWC, SOQL, CRM workflows |
| `oracle-migration` | 13 | Oracle-to-PostgreSQL, schema conversion |
| `power-bi-analytics` | 10 | DAX, data modeling, report design |

### Legacy Plugins (2)

| Plugin | Items | Focus |
|--------|-------|-------|
| `database-management` | 0 | PostgreSQL, SQL Server, Cosmos DB (stub) |
| `devops-oncall` | 0 | Incident triage, Azure diagnostics (stub) |
| `power-platform` | 0 | Power Apps, Power BI, Copilot Studio (stub) |

## External Plugins

Remote plugins from other GitHub repos are referenced in `external.json`:

```json
{
  "plugins": [
    {
      "name": "azure-copilot-plugins",
      "source": {
        "source": "github",
        "repo": "microsoft/azure-copilot-plugins",
        "path": ".github/plugins/azure"
      },
      "version": "1.0.0",
      "author": { "name": "Microsoft" }
    }
  ]
}
```

## Marketplace

All plugins are registered in `marketplace.json` (auto-generated):

```bash
npm run generate:marketplace    # Scan plugins/ → generate marketplace.json
```

## Validation

```bash
npm run validate:primitives     # Validates all plugin.json files
```

## Creating a New Plugin

```bash
# 1. Create folder
mkdir plugins/my-new-plugin

# 2. Create plugin.json with required fields
# 3. Reference existing primitives (agents, instructions, skills, hooks)
# 4. Regenerate marketplace
npm run generate:marketplace

# 5. Validate
npm run validate:primitives
```
