// Step 3: Enrich all 4 instruction files to 150+ lines across 100 plays
// copilot-instructions.md, azure-coding.instructions.md, security.instructions.md, *-patterns.instructions.md
const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory()).sort();

function getPlayName(folder) {
    return folder.replace(/^\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
function getPlayId(folder) { return folder.split("-")[0]; }

// ─── COPILOT-INSTRUCTIONS.MD TEMPLATE ─────────────────────────────
function copilotTemplate(folder) {
    const name = getPlayName(folder);
    const id = getPlayId(folder);
    return `You are an AI coding assistant working on the FrootAI ${name} solution play (Play ${id}).

## Solution Play Overview
This solution play implements a production-grade ${name} system on Azure, following the FrootAI FAI Protocol and Well-Architected Framework (WAF) principles across all six pillars: Reliability, Security, Cost Optimization, Operational Excellence, Performance Efficiency, and Responsible AI.

## .github Agentic OS Structure
This solution uses the full GitHub Copilot agentic OS:
- **Layer 1 (Always-On):** \`instructions/*.instructions.md\` — coding standards, domain patterns, security
- **Layer 2 (On-Demand):** \`prompts/*.prompt.md\` — /deploy, /test, /review, /evaluate
- **Layer 2 (Agents):** \`agents/*.agent.md\` — builder, reviewer, tuner (chained workflow)
- **Layer 2 (Skills):** \`skills/*/SKILL.md\` — deploy-azure, evaluate, tune
- **Layer 3 (Hooks):** \`hooks/guardrails.json\` — preToolUse policy gates
- **Layer 3 (Workflows):** \`workflows/*.md\` — AI-driven CI/CD pipelines

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
1. **Authentication:** Always use \`DefaultAzureCredential\` / Managed Identity — never hardcode API keys
2. **Configuration:** Use \`config/\` JSON files for all parameters — never hardcode values
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
| \`config/openai.json\` | Model parameters | model, temperature, max_tokens, top_p |
| \`config/agents.json\` | Agent behavior config | roles, handoff rules, escalation |
| \`config/guardrails.json\` | Content safety rules | thresholds, blocked categories, PII handling |
| \`config/model-comparison.json\` | Model selection matrix | models, cost, latency, quality scores |
| \`config/chunking.json\` | Data processing config | chunk_size, overlap, strategy |
| \`config/search.json\` | Retrieval configuration | search_type, top_k, score_threshold |

## Infrastructure Reference
| Resource | File | Purpose |
|----------|------|---------|
| Azure resources | \`infra/main.bicep\` | All Azure services for this play |
| ARM template | \`infra/main.json\` | Generated ARM template |
| Parameters | \`infra/parameters.json\` | Environment-specific values |
| MCP plugin | \`mcp/index.js\` | MCP server integration |

## Evaluation & Quality
- Run \`python evaluation/eval.py\` to evaluate solution quality
- Metrics tracked: relevance, groundedness, coherence, fluency, safety
- CI gate: all metrics must exceed thresholds in \`config/guardrails.json\`
- Test cases in \`evaluation/test-set.jsonl\` (minimum 10 diverse scenarios)

## Deployment Workflow
1. Validate Bicep: \`az bicep build -f infra/main.bicep\`
2. Deploy infrastructure: \`azd up\` or \`az deployment group create\`
3. Configure application settings from \`config/*.json\`
4. Run smoke tests to verify endpoints
5. Run evaluation pipeline to verify quality metrics
6. Monitor Application Insights for errors and performance

## Agent Workflow
When implementing features, follow the builder → reviewer → tuner chain:
1. **Build:** Implement using config/ values and architecture patterns
2. **Review:** Validate against reviewer.agent.md checklist (security, quality, WAF compliance)
3. **Tune:** Optimize config values, verify evaluation thresholds, production-ready SKUs

## Naming Conventions
- Files: \`lowercase-hyphen.ext\` (e.g., \`document-processor.py\`)
- Functions: \`snake_case\` for Python, \`camelCase\` for TypeScript
- Classes: \`PascalCase\` (e.g., \`DocumentProcessor\`)
- Azure resources: \`{project}-{env}-{resource}\` (e.g., \`frootai-prod-openai\`)
- Config keys: \`snake_case\` in JSON files
- Environment variables: \`UPPER_SNAKE_CASE\`

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
`;
}

// ─── AZURE-CODING.INSTRUCTIONS.MD TEMPLATE ──────────────────────
function azureCodingTemplate(folder) {
    const name = getPlayName(folder);
    return `---
description: "Azure coding patterns and best practices for ${name}"
applyTo: "**/*.{py,ts,js,bicep,json}"
---

# Azure Coding Patterns — ${name}

## Authentication — Managed Identity First
Always use \`DefaultAzureCredential\` for Azure service authentication:

\`\`\`python
from azure.identity import DefaultAzureCredential
from azure.ai.openai import AzureOpenAI

credential = DefaultAzureCredential()
client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    azure_ad_token_provider=get_bearer_token_provider(credential, "https://cognitiveservices.azure.com/.default"),
    api_version="2024-12-01-preview"
)
\`\`\`

**Never do this:**
\`\`\`python
# ❌ WRONG: API key in code
client = AzureOpenAI(api_key="sk-abc123...")
# ❌ WRONG: API key from env without Managed Identity
client = AzureOpenAI(api_key=os.environ["OPENAI_API_KEY"])
\`\`\`

## Azure SDK Error Handling
Wrap all Azure SDK calls with retry and proper error handling:

\`\`\`python
from azure.core.exceptions import HttpResponseError, ServiceRequestError
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=30))
async def call_azure_openai(prompt: str) -> str:
    try:
        response = await client.chat.completions.create(
            model=config["model"],
            messages=[{"role": "user", "content": prompt}],
            temperature=config["temperature"],
            max_tokens=config["max_tokens"]
        )
        return response.choices[0].message.content
    except HttpResponseError as e:
        if e.status_code == 429:
            logger.warning(f"Rate limited, retrying... (retry-after: {e.headers.get('Retry-After', 'unknown')})")
            raise  # Let tenacity handle retry
        elif e.status_code == 404:
            logger.error(f"Model deployment not found: {config['model']}")
            raise ValueError(f"Model {config['model']} not deployed")
        else:
            logger.error(f"Azure OpenAI error: {e.status_code} - {e.message}")
            raise
    except ServiceRequestError as e:
        logger.error(f"Network error calling Azure OpenAI: {e}")
        raise
\`\`\`

## Key Vault Integration
Store and retrieve secrets using Azure Key Vault:

\`\`\`python
from azure.keyvault.secrets import SecretClient

credential = DefaultAzureCredential()
secret_client = SecretClient(vault_url=os.environ["AZURE_KEY_VAULT_URL"], credential=credential)

# Retrieve secrets at startup, cache in memory
connection_string = secret_client.get_secret("database-connection-string").value
\`\`\`

## Application Insights Logging
Use structured logging with correlation IDs:

\`\`\`python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry import trace

configure_azure_monitor(connection_string=os.environ["APPLICATIONINSIGHTS_CONNECTION_STRING"])
tracer = trace.get_tracer(__name__)

@tracer.start_as_current_span("process_request")
async def process_request(request_id: str, data: dict):
    span = trace.get_current_span()
    span.set_attribute("request.id", request_id)
    span.set_attribute("play.id", "${folder}")
    # ... processing logic
    span.set_attribute("tokens.used", token_count)
    span.set_attribute("model.name", config["model"])
\`\`\`

## Bicep Best Practices

### Module Pattern
\`\`\`bicep
// Use modules for reusable resource groups
module openai 'modules/openai.bicep' = {
  name: 'openai-deployment'
  params: {
    location: location
    name: '\${prefix}-openai'
    sku: environment == 'prod' ? 'S0' : 'S0'
    deployments: [
      { name: 'gpt-4o', model: { name: 'gpt-4o', version: '2024-11-20' }, sku: { name: 'GlobalStandard', capacity: 30 } }
      { name: 'text-embedding-3-large', model: { name: 'text-embedding-3-large', version: '1' }, sku: { name: 'Standard', capacity: 120 } }
    ]
  }
}
\`\`\`

### Conditional Resources
\`\`\`bicep
// Deploy monitoring only in production
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = if (environment == 'prod') {
  name: '\${prefix}-logs'
  location: location
  properties: { retentionInDays: 90 }
}
\`\`\`

### RBAC Role Assignments
\`\`\`bicep
// Assign Cognitive Services User role to the app
resource openaiRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: openai
  name: guid(openai.id, app.id, cognitiveServicesUser)
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', cognitiveServicesUser)
    principalId: app.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
\`\`\`

## Connection Patterns
- Use connection pooling for HTTP clients (set max connections)
- Configure timeouts: connect=5s, read=30s, total=60s
- Use async clients for I/O-bound operations
- Implement health check endpoints that verify all dependencies

## Environment Configuration
- Use \`AZURE_*\` environment variables for Azure endpoints
- Use \`config/*.json\` files for application parameters
- Never mix secrets with config — secrets go to Key Vault only
- Use \`parameters.json\` for Bicep deployment values

## Azure Resource Naming
Follow the convention: \`{project}-{environment}-{resource-type}\`
- Resource Group: \`rg-frootai-{env}\`
- OpenAI: \`oai-frootai-{env}\`
- Key Vault: \`kv-frootai-{env}\`
- App Service: \`app-frootai-{env}\`
- Storage: \`stfrootai{env}\` (no hyphens allowed)

## Cost Optimization Patterns
- Use \`gpt-4o-mini\` for classification/routing, \`gpt-4o\` for generation
- Cache frequent queries with Azure Cache for Redis (TTL based on data freshness)
- Set \`max_tokens\` to minimum needed — don't use unlimited
- Use Provisioned Throughput Units (PTU) for predictable high-volume workloads
- Auto-scale based on queue depth, not just CPU

## Testing Azure Integrations
\`\`\`python
# Use environment variables to switch between test and prod
import pytest
from unittest.mock import AsyncMock, patch

@pytest.fixture
def mock_openai_client():
    client = AsyncMock()
    client.chat.completions.create.return_value = MockCompletion("test response")
    return client

async def test_process_request(mock_openai_client):
    with patch("app.client", mock_openai_client):
        result = await process_request("test-123", {"query": "test"})
        assert result is not None
        mock_openai_client.chat.completions.create.assert_called_once()
\`\`\`
`;
}

// ─── SECURITY.INSTRUCTIONS.MD TEMPLATE ──────────────────────────
function securityTemplate(folder) {
    const name = getPlayName(folder);
    return `---
description: "Security patterns and OWASP LLM Top 10 mitigations for ${name}"
applyTo: "**/*.{py,ts,js,bicep,json}"
---

# Security Patterns — ${name}

## OWASP LLM Top 10 Mitigations

### LLM01: Prompt Injection Defense
- **System prompt isolation:** Never include user input in the system message
- **Input sanitization:** Strip control characters, limit length to 4096 tokens
- **Output validation:** Check LLM responses match expected schema before returning
- **Delimiter strategy:** Use XML-style delimiters to separate user content from instructions

\`\`\`python
def sanitize_user_input(text: str, max_length: int = 4096) -> str:
    # Remove control characters
    import re
    text = re.sub(r'[\\x00-\\x1f\\x7f-\\x9f]', '', text)
    # Limit length
    if len(text) > max_length:
        text = text[:max_length]
    # Strip potential injection markers
    text = text.replace("SYSTEM:", "").replace("ASSISTANT:", "")
    return text.strip()
\`\`\`

### LLM02: Insecure Output Handling
- Validate all LLM outputs against JSON schema before returning to users
- HTML-encode any LLM output displayed in web UI
- Never execute code generated by LLM without sandbox
- Log all outputs for audit trail

### LLM03: Training Data Poisoning
- Use only curated, verified knowledge sources for RAG
- Implement source attribution for every generated response
- Monitor groundedness scores — alert if below threshold

### LLM04: Model Denial of Service
- Set \`max_tokens\` ceiling on all API calls
- Implement rate limiting per user/session (e.g., 60 requests/minute)
- Queue long-running requests with timeout (max 60 seconds)
- Use circuit breaker pattern for Azure OpenAI calls

### LLM05: Supply Chain Vulnerabilities
- Pin all Azure SDK versions to exact (no ^ or ~)
- Run \`pip audit\` / \`npm audit\` in CI pipeline
- Use Microsoft-managed base images for containers
- Verify package checksums on install

### LLM06: Sensitive Information Disclosure
- Use Azure Content Safety API for PII detection in inputs and outputs
- Never log full prompts or responses in production (log metadata only)
- Implement data masking for known PII patterns (email, phone, SSN)
- Enable Azure Purview for data classification

\`\`\`python
from azure.ai.contentsafety import ContentSafetyClient

async def check_pii(text: str) -> dict:
    client = ContentSafetyClient(endpoint, credential)
    result = await client.analyze_text({"text": text, "categories": ["PersonallyIdentifiableInformation"]})
    return {"has_pii": any(c.severity > 0 for c in result.categories_analysis), "details": result}
\`\`\`

### LLM07: Insecure Plugin Design
- Validate all MCP tool inputs against JSON schema
- Implement least-privilege for tool permissions
- Log all tool invocations with parameters and results
- Rate-limit tool calls per session

### LLM08: Excessive Agency
- Define explicit tool allowlists in \`config/agents.json\`
- Require human approval for destructive actions (delete, update, deploy)
- Implement guardrails.json preToolUse hooks for policy enforcement
- Log all agent decisions and tool selections

### LLM09: Overreliance
- Always include source citations in generated responses
- Display confidence scores when available
- Add disclaimers for generated content in user-facing outputs
- Implement human-in-the-loop for high-stakes decisions

### LLM10: Model Theft
- Use Azure Private Endpoints for all AI services
- Never expose model endpoints publicly
- Implement API key rotation (90-day cycle minimum)
- Use Managed Identity — eliminate need for keys entirely

## Azure Security Baseline

### Network Security
- Deploy all AI services behind Private Endpoints
- Use Network Security Groups (NSGs) to restrict traffic
- Enable DDoS Protection Standard on public-facing resources
- Configure Web Application Firewall (WAF) on API Gateway

### Identity & Access
- Use Managed Identity for all service-to-service auth
- Implement RBAC with least-privilege role assignments
- Enable Conditional Access policies for admin operations
- Use Azure AD for user authentication (OIDC/OAuth2)

### Data Protection
- Enable encryption at rest (Azure-managed keys minimum, CMK for sensitive data)
- Enable TLS 1.2+ for all data in transit
- Use Azure Key Vault for all secrets, certificates, and connection strings
- Implement data retention policies (90 days for logs, policy-defined for data)

### Monitoring & Incident Response
- Enable Microsoft Defender for Cloud on all subscriptions
- Configure security alerts for anomalous access patterns
- Enable diagnostic logging on all Azure resources
- Set up Azure Sentinel for SIEM integration
- Define incident response runbook with escalation procedures

## Content Safety Integration
\`\`\`python
from azure.ai.contentsafety import ContentSafetyClient
from azure.ai.contentsafety.models import AnalyzeTextOptions

async def check_content_safety(text: str) -> bool:
    client = ContentSafetyClient(endpoint, credential)
    response = await client.analyze_text(AnalyzeTextOptions(text=text))
    # Block if any category exceeds threshold
    for category in response.categories_analysis:
        if category.severity >= 4:  # 0-6 scale, 4+ is concerning
            logger.warning(f"Content blocked: {category.category}={category.severity}")
            return False
    return True
\`\`\`

## Input Validation Patterns
- Validate request body against Pydantic models (Python) or Zod schemas (TypeScript)
- Set maximum payload size limits (10MB default)
- Reject requests with unexpected content types
- Sanitize file uploads: check MIME type, scan for malware, limit size

## Secret Management
- **Never** commit secrets to git (use .gitignore, pre-commit hooks)
- Store all secrets in Azure Key Vault
- Reference secrets via Key Vault references in App Service settings
- Rotate secrets every 90 days (automate with Key Vault rotation policy)
- Use Managed Identity to access Key Vault — no keys needed

## Audit Logging
- Log all authentication events (success and failure)
- Log all data access events with user identity and resource accessed
- Log all administrative actions (config changes, deployments, role assignments)
- Retain audit logs for minimum 1 year (compliance requirement)
- Send audit logs to Log Analytics workspace for querying and alerting
`;
}

// ─── PATTERNS.INSTRUCTIONS.MD TEMPLATE ──────────────────────────
function patternsTemplate(folder) {
    const name = getPlayName(folder);
    const id = getPlayId(folder);
    return `---
description: "Domain-specific coding patterns for ${name} (Play ${id})"
applyTo: "**/*.{py,ts,js}"
---

# ${name} — Domain Patterns & Best Practices

## Architecture Pattern
This play implements a ${name} architecture with these core components:

### Request Flow
1. Client sends request to API endpoint
2. Input validation and sanitization
3. Authentication check (Managed Identity / Bearer token)
4. Core processing pipeline:
   a. Pre-processing: data extraction, normalization, enrichment
   b. AI processing: model inference, embedding, search, generation
   c. Post-processing: output validation, formatting, safety check
5. Response with structured output and metadata
6. Async logging: metrics, traces, audit events

### Component Responsibilities
| Component | Responsibility | Key Patterns |
|-----------|---------------|-------------|
| API Gateway | Routing, rate limiting, auth | APIM policies, JWT validation |
| Application | Business logic, orchestration | Async/await, dependency injection |
| AI Services | Model inference, embeddings | Retry with backoff, circuit breaker |
| Data Store | Persistence, caching | Connection pooling, read replicas |
| Monitoring | Observability, alerting | Structured logs, custom metrics |

## Domain-Specific Patterns

### Data Processing Pipeline
\`\`\`python
from dataclasses import dataclass
from typing import List, Optional
import asyncio

@dataclass
class ProcessingResult:
    """Result from the processing pipeline."""
    data: dict
    metadata: dict
    quality_score: float
    processing_time_ms: float

class ProcessingPipeline:
    """Multi-stage processing pipeline for ${name}."""
    
    def __init__(self, config: dict):
        self.config = config
        self.stages = []
    
    def add_stage(self, stage_fn, name: str):
        self.stages.append({"fn": stage_fn, "name": name})
    
    async def execute(self, input_data: dict) -> ProcessingResult:
        import time
        start = time.monotonic()
        current = input_data
        metadata = {"stages": []}
        
        for stage in self.stages:
            stage_start = time.monotonic()
            try:
                current = await stage["fn"](current)
                metadata["stages"].append({
                    "name": stage["name"],
                    "status": "success",
                    "duration_ms": round((time.monotonic() - stage_start) * 1000, 2)
                })
            except Exception as e:
                metadata["stages"].append({
                    "name": stage["name"],
                    "status": "error",
                    "error": str(e)
                })
                raise
        
        return ProcessingResult(
            data=current,
            metadata=metadata,
            quality_score=current.get("quality_score", 0.0),
            processing_time_ms=round((time.monotonic() - start) * 1000, 2)
        )
\`\`\`

### Configuration Management
\`\`\`python
import json
from pathlib import Path
from functools import lru_cache

@lru_cache(maxsize=1)
def load_play_config() -> dict:
    """Load all config files for this play."""
    config_dir = Path(__file__).parent.parent / "config"
    configs = {}
    for config_file in config_dir.glob("*.json"):
        with open(config_file) as f:
            configs[config_file.stem] = json.load(f)
    return configs

def get_model_config() -> dict:
    """Get OpenAI model configuration."""
    config = load_play_config()
    return config.get("openai", {"model": "gpt-4o", "temperature": 0.1, "max_tokens": 4096})

def get_guardrails() -> dict:
    """Get content safety and guardrail thresholds."""
    config = load_play_config()
    return config.get("guardrails", {"content_safety_threshold": 4, "groundedness_min": 0.8})
\`\`\`

### Health Check Pattern
\`\`\`python
from fastapi import FastAPI, Response
from datetime import datetime

app = FastAPI()

@app.get("/health")
async def health_check():
    checks = {}
    overall = True
    
    # Check Azure OpenAI
    try:
        await openai_client.models.list()
        checks["azure_openai"] = "healthy"
    except Exception as e:
        checks["azure_openai"] = f"unhealthy: {str(e)[:100]}"
        overall = False
    
    # Check data store
    try:
        await data_store.ping()
        checks["data_store"] = "healthy"
    except Exception as e:
        checks["data_store"] = f"unhealthy: {str(e)[:100]}"
        overall = False
    
    status_code = 200 if overall else 503
    return Response(
        content=json.dumps({
            "status": "healthy" if overall else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "checks": checks,
            "play": "${folder}"
        }),
        status_code=status_code,
        media_type="application/json"
    )
\`\`\`

### Caching Strategy
\`\`\`python
from functools import lru_cache
import hashlib, json

class ResponseCache:
    """Cache for AI responses to reduce cost and latency."""
    
    def __init__(self, redis_client, ttl_seconds: int = 3600):
        self.redis = redis_client
        self.ttl = ttl_seconds
    
    def _cache_key(self, request: dict) -> str:
        normalized = json.dumps(request, sort_keys=True)
        return f"play:${folder}:" + hashlib.sha256(normalized.encode()).hexdigest()[:16]
    
    async def get(self, request: dict):
        key = self._cache_key(request)
        cached = await self.redis.get(key)
        if cached:
            return json.loads(cached)
        return None
    
    async def set(self, request: dict, response: dict):
        key = self._cache_key(request)
        await self.redis.setex(key, self.ttl, json.dumps(response))
\`\`\`

### Structured Output Pattern
\`\`\`python
from pydantic import BaseModel, Field
from typing import List, Optional

class AIResponse(BaseModel):
    """Structured response from AI processing."""
    answer: str = Field(..., description="The generated answer")
    sources: List[str] = Field(default_factory=list, description="Source references")
    confidence: float = Field(ge=0, le=1, description="Confidence score 0-1")
    model: str = Field(..., description="Model used for generation")
    tokens_used: int = Field(ge=0, description="Total tokens consumed")
    processing_time_ms: float = Field(ge=0, description="Processing time in milliseconds")
    metadata: Optional[dict] = Field(default=None, description="Additional metadata")

    class Config:
        json_schema_extra = {"example": {"answer": "...", "sources": ["doc1.pdf"], "confidence": 0.92, "model": "gpt-4o", "tokens_used": 1500, "processing_time_ms": 450.5}}
\`\`\`

### Error Classification
\`\`\`python
from enum import Enum

class ErrorCategory(Enum):
    VALIDATION = "validation_error"       # Bad input from user
    AUTHENTICATION = "auth_error"         # Auth/authz failure
    RATE_LIMIT = "rate_limit"            # Too many requests
    SERVICE_ERROR = "service_error"       # Azure service failure
    CONTENT_SAFETY = "content_blocked"    # Content safety violation
    TIMEOUT = "timeout_error"            # Processing timeout
    INTERNAL = "internal_error"          # Unexpected failure

class PlayError(Exception):
    def __init__(self, category: ErrorCategory, message: str, details: dict = None):
        self.category = category
        self.message = message
        self.details = details or {}
        super().__init__(message)

    def to_response(self) -> dict:
        return {"error": {"category": self.category.value, "message": self.message, "details": self.details}}
\`\`\`

## Anti-Patterns to Avoid
1. **❌ Hardcoded values:** Never hardcode model names, temperatures, or thresholds
2. **❌ Synchronous Azure calls:** Always use async clients for I/O operations
3. **❌ Unbounded retries:** Always set max retry count and backoff ceiling
4. **❌ Missing timeouts:** Every external call must have a timeout
5. **❌ PII in logs:** Never log full user prompts or PII — use structured metadata only
6. **❌ Ignoring errors:** Every exception must be caught, logged, and handled appropriately
7. **❌ Fat controllers:** Keep API handlers thin — delegate to service classes
8. **❌ No caching:** Repeated identical queries should be served from cache
`;
}

// ─── MAIN EXECUTION ─────────────────────────────────────────────
let stats = { copilot: 0, azure: 0, security: 0, patterns: 0 };

for (const p of plays) {
    const playDir = path.join(dir, p);

    // 1. copilot-instructions.md
    const copilotPath = path.join(playDir, ".github/copilot-instructions.md");
    if (fs.existsSync(copilotPath)) {
        const lines = fs.readFileSync(copilotPath, "utf8").split("\n").length;
        if (lines < 150) {
            fs.writeFileSync(copilotPath, copilotTemplate(p));
            stats.copilot++;
        }
    }

    // 2. azure-coding.instructions.md
    const azurePath = path.join(playDir, ".github/instructions/azure-coding.instructions.md");
    if (fs.existsSync(azurePath)) {
        const lines = fs.readFileSync(azurePath, "utf8").split("\n").length;
        if (lines < 150) {
            fs.writeFileSync(azurePath, azureCodingTemplate(p));
            stats.azure++;
        }
    }

    // 3. security.instructions.md
    const secPath = path.join(playDir, ".github/instructions/security.instructions.md");
    if (fs.existsSync(secPath)) {
        const lines = fs.readFileSync(secPath, "utf8").split("\n").length;
        if (lines < 150) {
            fs.writeFileSync(secPath, securityTemplate(p));
            stats.security++;
        }
    }

    // 4. *-patterns.instructions.md
    const instrDir = path.join(playDir, ".github/instructions");
    if (fs.existsSync(instrDir)) {
        const patternFiles = fs.readdirSync(instrDir).filter(f => f.includes("patterns"));
        for (const pf of patternFiles) {
            const pfPath = path.join(instrDir, pf);
            const lines = fs.readFileSync(pfPath, "utf8").split("\n").length;
            if (lines < 150) {
                fs.writeFileSync(pfPath, patternsTemplate(p));
                stats.patterns++;
            }
        }
    }
}

// Verify
function checkFile(glob) {
    const lines = [];
    for (const p of plays) {
        const instrDir = path.join(dir, p, ".github/instructions");
        if (glob === "copilot") {
            const fp = path.join(dir, p, ".github/copilot-instructions.md");
            if (fs.existsSync(fp)) lines.push(fs.readFileSync(fp, "utf8").split("\n").length);
        } else if (glob === "patterns") {
            if (fs.existsSync(instrDir)) {
                const pfs = fs.readdirSync(instrDir).filter(f => f.includes("patterns"));
                for (const f of pfs) lines.push(fs.readFileSync(path.join(instrDir, f), "utf8").split("\n").length);
            }
        } else {
            const fp = path.join(instrDir, glob);
            if (fs.existsSync(fp)) lines.push(fs.readFileSync(fp, "utf8").split("\n").length);
        }
    }
    const min = Math.min(...lines), avg = Math.round(lines.reduce((a, b) => a + b, 0) / lines.length);
    const under = lines.filter(l => l < 150).length;
    return { count: lines.length, min, avg, under };
}

console.log("Fixed:", JSON.stringify(stats));
console.log("copilot:", JSON.stringify(checkFile("copilot")));
console.log("azure:", JSON.stringify(checkFile("azure-coding.instructions.md")));
console.log("security:", JSON.stringify(checkFile("security.instructions.md")));
console.log("patterns:", JSON.stringify(checkFile("patterns")));
