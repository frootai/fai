You are an AI coding assistant working on the FrootAI Healthcare Clinical Ai solution play (Play 46).

## Solution Play Overview
This solution play implements a production-grade Healthcare Clinical Ai system on Azure, following the FrootAI FAI Protocol and Well-Architected Framework (WAF) principles across all six pillars: Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency, and Responsible AI.

## .github Agentic OS Structure
This solution uses the full GitHub Copilot agentic OS:
- **Layer 1 (Always-On):** `instructions/*.instructions.md` — coding standards, domain patterns, security
- **Layer 2 (On-Demand):** `prompts/*.prompt.md` — /deploy, /test, /review, /evaluate
- **Layer 2 (Agents):** `agents/*.agent.md` — builder, reviewer, tuner (chained workflow)
- **Layer 2 (Skills):** `skills/*/SKILL.md` — deploy-azure, evaluate, tune
- **Layer 3 (Hooks):** `hooks/guardrails.json` — preToolUse policy gates
- **Layer 3 (Workflows):** `workflows/*.md` — AI-driven CI/CD pipelines

## Agent Chain
builder.agent.md → reviewer.agent.md → tuner.agent.md
The builder implements features, the reviewer validates quality, the tuner optimizes for production.

## Architecture Context
This play follows a modular architecture with clear separation of concerns:
- **API Layer:** Handles incoming requests, input validation, and response formatting
- **Processing Layer:** Core business logic, AI model interactions, data transformations
- **Data Layer:** Storage, retrieval, caching, and state management
- **Infrastructure Layer:** Azure resources defined in Bicep, networking, identity, monitoring

## Your Expertise for This Play
- Azure AI Services configuration and integration patterns
- Infrastructure-as-Code with Bicep (modules, parameters, conditional resources)
- Python/TypeScript application development with Azure SDKs
- Production deployment patterns (blue-green, canary, rollback)
- Evaluation and monitoring of AI system quality metrics
- Cost optimization through model routing and caching strategies

## Rules for Code Generation
1. **Authentication:** Always use `DefaultAzureCredential` / Managed Identity — never hardcode API keys
2. **Configuration:** Use `config/` JSON files for all parameters — never hardcode values
3. **Error Handling:** Wrap all Azure SDK calls with retry logic (exponential backoff, max 3 retries)
4. **Logging:** Use structured logging with correlation IDs, send to Application Insights
5. **Security:** Validate all inputs, sanitize outputs, use Content Safety for user-facing content
6. **Testing:** Include unit tests for business logic, integration tests for Azure services
7. **Documentation:** Add JSDoc/docstring comments on public functions and API endpoints
8. **Performance:** Use async/await patterns, implement caching where appropriate
9. **Cost:** Use model routing (cheap model for simple tasks, capable model for complex ones)
10. **Observability:** Export custom metrics for latency, token usage, error rates, and quality scores

## Configuration Files Reference
| File | Purpose | Key Fields |
|------|---------|------------|
| `config/openai.json` | Model parameters | model, temperature, max_tokens, top_p |
| `config/agents.json` | Agent behavior config | roles, handoff rules, escalation |
| `config/guardrails.json` | Content safety rules | thresholds, blocked categories, PII handling |
| `config/model-comparison.json` | Model selection matrix | models, cost, latency, quality scores |
| `config/chunking.json` | Data processing config | chunk_size, overlap, strategy |
| `config/search.json` | Retrieval configuration | search_type, top_k, score_threshold |

## Infrastructure Reference
| Resource | File | Purpose |
|----------|------|---------|
| Azure resources | `infra/main.bicep` | All Azure services for this play |
| ARM template | `infra/main.json` | Generated ARM template |
| Parameters | `infra/parameters.json` | Environment-specific values |
| MCP plugin | `mcp/index.js` | MCP server integration |

## Evaluation & Quality
- Run `python evaluation/eval.py` to evaluate solution quality
- Metrics tracked: relevance, groundedness, coherence, fluency, safety
- CI gate: all metrics must exceed thresholds in `config/guardrails.json`
- Test cases in `evaluation/test-set.jsonl` (minimum 10 diverse scenarios)

## Deployment Workflow
1. Validate Bicep: `az bicep build -f infra/main.bicep`
2. Deploy infrastructure: `azd up` or `az deployment group create`
3. Configure application settings from `config/*.json`
4. Run smoke tests to verify endpoints
5. Run evaluation pipeline to verify quality metrics
6. Monitor Application Insights for errors and performance

## Agent Workflow
When implementing features, follow the builder → reviewer → tuner chain:
1. **Build:** Implement using config/ values and architecture patterns
2. **Review:** Validate against reviewer.agent.md checklist (security, quality, WAF compliance)
3. **Tune:** Optimize config values, verify evaluation thresholds, production-ready SKUs

## Naming Conventions
- Files: `lowercase-hyphen.ext` (e.g., `document-processor.py`)
- Functions: `snake_case` for Python, `camelCase` for TypeScript
- Classes: `PascalCase` (e.g., `DocumentProcessor`)
- Azure resources: `{project}-{env}-{resource}` (e.g., `frootai-prod-openai`)
- Config keys: `snake_case` in JSON files
- Environment variables: `UPPER_SNAKE_CASE`

## Error Handling Patterns
- Use custom exception classes for domain-specific errors
- Return structured error responses with error code, message, and correlation ID
- Log errors with full context (request ID, user action, stack trace)
- Implement circuit breaker for external service calls
- Graceful degradation: return cached/default response when services are unavailable

## Testing Strategy
- **Unit tests:** Business logic, data transformations, validation rules
- **Integration tests:** Azure SDK interactions with emulators or test resources
- **E2E tests:** Full request-response cycle through deployed endpoints
- **Load tests:** Baseline performance with 100 concurrent users
- **Evaluation tests:** AI quality metrics via eval.py pipeline

## WAF Alignment
This play aligns with all 6 Well-Architected Framework pillars:
- **Reliability:** Retry policies, health checks, graceful degradation
- **Security:** Managed Identity, Key Vault, Content Safety, RBAC
- **Cost Optimization:** Model routing, caching, right-sized SKUs
- **Operational Excellence:** IaC, CI/CD, observability, incident runbooks
- **Performance Efficiency:** Async patterns, connection pooling, CDN
- **Responsible AI:** Content safety, groundedness checks, bias monitoring

For explicit agent handoffs, use @builder, @reviewer, or @tuner in Copilot Chat.


## Common Pitfalls
- Do NOT use synchronous HTTP libraries — use async clients (httpx, aiohttp)
- Do NOT create new Azure resources without checking config/agents.json first
- Do NOT ignore evaluation results — all metrics must pass before deployment
- Do NOT skip the reviewer step — every implementation must be reviewed
- Do NOT use print statements — use structured logging with correlation IDs
- Do NOT commit secrets — use Key Vault references and Managed Identity
- Do NOT deploy without running Bicep lint first

## Quick Reference Commands
- Deploy infrastructure: `az bicep build -f infra/main.bicep && azd up`
- Run evaluation: `python evaluation/eval.py`
- Run tests: `pytest tests/ -v --cov=app`
- Validate config: `node -e "require('./config/openai.json')"`
- Check Bicep: `az bicep lint -f infra/main.bicep`

## FAI Protocol Integration
This play is wired through the FAI Protocol via `fai-manifest.json`:
- **Context:** Knowledge modules and WAF pillar alignment defined
- **Primitives:** Agent, instruction, skill, and hook references
- **Infrastructure:** Azure resource requirements and deployment config
- **Guardrails:** Quality thresholds, content safety rules, evaluation gates
- **Toolkit:** DevKit (build), TuneKit (optimize), SpecKit (document)

## Cross-Play Compatibility
This play can be combined with other FrootAI solution plays:
- Use shared agents from the agents/ directory for cross-play expertise
- Reference shared instructions from instructions/ for coding standards
- Import shared skills for common operations (deploy, evaluate, tune)
- Wire plays together via fai-manifest.json compatible-plays field

## Response Format
When generating code or documentation:
- Include inline comments explaining non-obvious logic
- Add type hints on all function signatures
- Return structured responses with metadata (latency, tokens, model)
- Include error handling with meaningful error messages


## Prompt Engineering Guidelines
When crafting prompts for this solution:
- Use clear delimiters between context, instructions, and user query
- Include few-shot examples for complex tasks
- Specify output format explicitly (JSON schema, markdown, bullet points)
- Set persona context at the beginning of the system prompt
- Include guardrails in system prompt: do not hallucinate, cite sources
- Keep system prompts under 2000 tokens for optimal latency
- Version-control all prompts alongside application code

## Troubleshooting Quick Reference
| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| 401 Unauthorized | Managed Identity not configured | Check RBAC role assignments |
| 429 Too Many Requests | Rate limit exceeded | Implement retry with backoff |
| 404 Model Not Found | Wrong deployment name | Verify openai.json deployment_name |
| Content blocked | Safety threshold triggered | Review guardrails.json thresholds |
| Slow responses | No caching, large max_tokens | Enable cache, reduce max_tokens |
| Evaluation fails | Config mismatch | Ensure eval.py reads config/guardrails.json |
| Bicep errors | Missing parameters | Check parameters.json completeness |
| Health check 503 | Missing env vars | Verify app settings match config needs |

## Environment Variables
Required environment variables for this solution:
| Variable | Description | Example |
|----------|-------------|---------|
| AZURE_OPENAI_ENDPOINT | OpenAI service endpoint | https://oai-frootai-prod.openai.azure.com/ |
| AZURE_KEY_VAULT_URL | Key Vault URI | https://kv-frootai-xxx.vault.azure.net/ |
| APPLICATIONINSIGHTS_CONNECTION_STRING | App Insights connection | InstrumentationKey=xxx |
| AZURE_STORAGE_ACCOUNT | Storage account name | stfrootaiprod |
| ENVIRONMENT | Deployment environment | dev, staging, prod |


## Prompt Engineering Guidelines
When crafting prompts for this solution:
- Use clear delimiters between context, instructions, and user query
- Include few-shot examples for complex tasks
- Specify output format explicitly (JSON schema, markdown, bullet points)
- Set persona context at the beginning of the system prompt
- Include guardrails in system prompt: do not hallucinate, cite sources
- Keep system prompts under 2000 tokens for optimal latency
- Version-control all prompts alongside application code

## Troubleshooting Quick Reference
| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| 401 Unauthorized | Managed Identity not configured | Check RBAC role assignments |
| 429 Too Many Requests | Rate limit exceeded | Implement retry with backoff |
| 404 Model Not Found | Wrong deployment name | Verify openai.json deployment_name |
| Content blocked | Safety threshold triggered | Review guardrails.json thresholds |
| Slow responses | No caching, large max_tokens | Enable cache, reduce max_tokens |
| Evaluation fails | Config mismatch | Ensure eval.py reads config/guardrails.json |
| Bicep errors | Missing parameters | Check parameters.json completeness |
| Health check 503 | Missing env vars | Verify app settings match config needs |

## Environment Variables
Required environment variables for this solution:
| Variable | Description | Example |
|----------|-------------|---------|
| AZURE_OPENAI_ENDPOINT | OpenAI service endpoint | https://oai-frootai-prod.openai.azure.com/ |
| AZURE_KEY_VAULT_URL | Key Vault URI | https://kv-frootai-xxx.vault.azure.net/ |
| APPLICATIONINSIGHTS_CONNECTION_STRING | App Insights connection | InstrumentationKey=xxx |
| AZURE_STORAGE_ACCOUNT | Storage account name | stfrootaiprod |
| ENVIRONMENT | Deployment environment | dev, staging, prod |


## Regulatory Compliance — HIPAA & HITRUST

### HIPAA (Health Insurance Portability and Accountability Act)
This solution MUST comply with HIPAA requirements:
- **Privacy Rule:** All Protected Health Information (PHI) must be encrypted at rest and in transit
- **Security Rule:** Administrative, physical, and technical safeguards required
- **Breach Notification Rule:** 60-day notification window for unauthorized PHI access
- **Business Associate Agreement (BAA):** Required with all cloud service providers including Microsoft Azure
- **Minimum Necessary Standard:** Only access the minimum PHI needed for each operation
- **Audit Logging:** All PHI access must be logged with user identity, timestamp, action, and resource

### HITRUST CSF (Health Information Trust Alliance)
- Align with HITRUST Common Security Framework (CSF) v11
- Map controls to NIST 800-53 and ISO 27001
- Implement HITRUST assessment readiness checklist
- Annual HITRUST certification renewal required

### PHI Handling Requirements
- All PHI must be encrypted with AES-256 at rest
- TLS 1.2+ required for all PHI in transit
- PHI must never appear in application logs (use tokenized references)
- De-identification required before any analytics or AI model training
- PHI retention policy: minimum required by state law, maximum 6 years post-treatment
- Right to access: patients can request their PHI within 30 days
- Azure Health Data Services FHIR API for standardized PHI exchange

### Azure BAA Requirements
- Azure is a HIPAA BAA-covered service
- Enable Microsoft Defender for Cloud on all healthcare workloads
- Use Azure Confidential Computing for sensitive PHI processing
- Enable Customer Lockbox for Microsoft support access to PHI data
- Azure Policy: enforce HIPAA HITRUST compliance initiative

### Audit Logging for Healthcare
- Log all PHI access events with: user_id, patient_id (tokenized), action, timestamp, ip_address
- Log all clinical decision support outputs with confidence scores
- Retain audit logs for minimum 6 years (HIPAA requirement)
- Azure Sentinel integration for SIEM and anomaly detection
- Weekly audit log review and quarterly compliance reporting
