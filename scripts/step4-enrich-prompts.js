// Step 4: Enrich deploy/evaluate/review/test prompt files to 80+ lines
const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory()).sort();

function getName(f) { return f.replace(/^\d+-/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }
function getId(f) { return f.split("-")[0]; }

const deployTemplate = (f) => `---
mode: "agent"
description: "Deploy ${getName(f)} (Play ${getId(f)}) to Azure"
tools: ["terminal", "file"]
---

# Deploy ${getName(f)} to Azure

You are deploying the FrootAI ${getName(f)} solution play (Play ${getId(f)}) to Azure.

## Prerequisites Check
Before deploying, verify the following:
1. Azure CLI is installed and authenticated: \`az account show\`
2. Azure Developer CLI is installed: \`azd version\`
3. Bicep CLI is available: \`az bicep version\`
4. You have Contributor + User Access Administrator on the target subscription
5. The target resource group exists or you have permission to create it
6. All config files are valid JSON: verify with \`node -e "require('./config/openai.json')"\`

## Step 1: Validate Infrastructure
Lint and build the Bicep template to catch errors before deployment:
\`\`\`bash
az bicep lint -f infra/main.bicep
az bicep build -f infra/main.bicep
\`\`\`
Review the generated ARM template in \`infra/main.json\` for correctness.

## Step 2: Deploy Infrastructure
Deploy all Azure resources defined in the Bicep template:
\`\`\`bash
az deployment group create \\
  --resource-group rg-frootai-\${ENVIRONMENT} \\
  --template-file infra/main.bicep \\
  --parameters infra/parameters.json \\
  --parameters environment=\${ENVIRONMENT}
\`\`\`
Or use Azure Developer CLI for full-stack deployment:
\`\`\`bash
azd up --environment \${ENVIRONMENT}
\`\`\`

## Step 3: Configure Application
After infrastructure is deployed:
1. Set application configuration from \`config/*.json\` files
2. Configure Managed Identity role assignments (auto-done by Bicep if defined)
3. Upload any required seed data or knowledge bases
4. Set environment variables for the application runtime

## Step 4: Smoke Test
Run basic health checks to verify deployment:
\`\`\`bash
# Check API health endpoint
curl -s https://\${APP_URL}/health | jq .

# Verify Azure OpenAI connectivity
curl -s https://\${APP_URL}/api/test | jq .status

# Check all dependent services
curl -s https://\${APP_URL}/health/dependencies | jq .
\`\`\`

## Step 5: Run Evaluation
After deployment, run the evaluation pipeline to verify quality:
\`\`\`bash
python evaluation/eval.py --environment \${ENVIRONMENT}
\`\`\`
All metrics must pass thresholds defined in \`config/guardrails.json\`.

## Step 6: Monitor
After successful deployment:
1. Verify Application Insights is receiving telemetry
2. Check Log Analytics for error-free startup logs
3. Confirm alert rules are active (error rate, latency p99)
4. Verify auto-scale rules are configured (if applicable)

## Rollback Procedure
If deployment fails or quality checks don't pass:
\`\`\`bash
# Rollback to previous deployment
az deployment group create \\
  --resource-group rg-frootai-\${ENVIRONMENT} \\
  --template-file infra/main.bicep \\
  --parameters infra/parameters.json \\
  --parameters environment=\${ENVIRONMENT} \\
  --rollback-on-error
\`\`\`

## Post-Deployment Checklist
- [ ] Health endpoint returns 200
- [ ] All dependent services are healthy
- [ ] Evaluation metrics pass thresholds
- [ ] Application Insights receiving data
- [ ] Alert rules are active
- [ ] DNS/routing is configured correctly
- [ ] SSL certificate is valid
- [ ] CORS settings are correct for frontend origins
`;

const evaluateTemplate = (f) => `---
mode: "agent"
description: "Evaluate ${getName(f)} (Play ${getId(f)}) quality metrics"
tools: ["terminal", "file"]
---

# Evaluate ${getName(f)} Quality

You are evaluating the FrootAI ${getName(f)} solution play (Play ${getId(f)}).

## Prerequisites
1. Python 3.10+ with azure-ai-evaluation SDK installed
2. Azure credentials configured (DefaultAzureCredential)
3. Test dataset available at \`evaluation/test-set.jsonl\`
4. Config files loaded from \`config/\` directory

## Step 1: Prepare Test Dataset
Verify the test dataset has sufficient coverage:
\`\`\`bash
python -c "
import jsonlines
with jsonlines.open('evaluation/test-set.jsonl') as reader:
    cases = list(reader)
    print(f'Test cases: {len(cases)}')
    print(f'Categories: {set(c.get(\"category\", \"default\") for c in cases)}')
"
\`\`\`
Minimum: 10 diverse test cases covering normal, edge, and adversarial scenarios.

## Step 2: Run Evaluation Pipeline
Execute the evaluation script:
\`\`\`bash
python evaluation/eval.py --config config/guardrails.json --test-set evaluation/test-set.jsonl
\`\`\`

## Step 3: Metric Definitions
The evaluation measures these quality dimensions:

| Metric | Description | Threshold | Weight |
|--------|-------------|-----------|--------|
| **Relevance** | Response addresses the user's question | ≥ 0.80 | 25% |
| **Groundedness** | Response is grounded in provided context | ≥ 0.85 | 30% |
| **Coherence** | Response is logically consistent | ≥ 0.80 | 15% |
| **Fluency** | Response is grammatically correct | ≥ 0.85 | 10% |
| **Safety** | No harmful/inappropriate content | ≥ 0.95 | 15% |
| **Latency** | Response time p95 | ≤ 3000ms | 5% |

## Step 4: Interpret Results
After running evaluation:
1. Check overall weighted score (must be ≥ 0.80 for production)
2. Identify any individual metric below threshold
3. Review worst-performing test cases for patterns
4. Check safety score — must be 0.95+ (non-negotiable)

## Step 5: CI Gate Decision
Based on results, make a go/no-go decision:
- **PASS (all green):** All metrics above threshold → approve for deployment
- **WARN (yellow):** One metric within 5% of threshold → deploy with monitoring
- **FAIL (red):** Any metric below threshold → block deployment, fix issues

## Step 6: Generate Report
Create an evaluation report for stakeholders:
\`\`\`bash
python evaluation/eval.py --report html --output evaluation/report.html
\`\`\`

## Failure Remediation
If evaluation fails:
- **Low relevance:** Review retrieval pipeline, improve chunking, add missing knowledge
- **Low groundedness:** Tighten system prompt, add source citation requirement
- **Low coherence:** Reduce temperature, add output structure requirements
- **Low safety:** Enable Content Safety API, add content filtering rules
- **High latency:** Add caching, optimize retrieval, reduce max_tokens

## Re-evaluation
After fixes, re-run the full pipeline and compare results:
\`\`\`bash
python evaluation/eval.py --compare evaluation/previous-results.json
\`\`\`
`;

const reviewTemplate = (f) => `---
mode: "agent"
description: "Review ${getName(f)} (Play ${getId(f)}) code and architecture"
tools: ["terminal", "file"]
---

# Review ${getName(f)} Implementation

You are reviewing the FrootAI ${getName(f)} solution play (Play ${getId(f)}).

## Review Scope
Perform a comprehensive review covering architecture, security, quality, and WAF alignment.

## Step 1: Architecture Review
- [ ] Solution follows the documented architecture in README.md
- [ ] All Azure resources defined in infra/main.bicep match architecture
- [ ] Service dependencies are clearly documented
- [ ] Data flow follows expected patterns (no unexpected external calls)
- [ ] API contracts are well-defined and documented

## Step 2: Security Review (OWASP LLM Top 10)
- [ ] No hardcoded API keys, secrets, or connection strings in any file
- [ ] DefaultAzureCredential used for all Azure service auth
- [ ] Input validation on all user-facing endpoints
- [ ] Output sanitization before returning LLM responses to users
- [ ] Content Safety API integrated for user-facing content
- [ ] PII detection and handling implemented
- [ ] Rate limiting configured on API endpoints
- [ ] Private endpoints configured for Azure services (production)
- [ ] Key Vault used for all secret storage
- [ ] RBAC role assignments follow least-privilege principle

## Step 3: Code Quality Review
- [ ] Functions have type hints and docstrings
- [ ] Error handling covers all Azure SDK call failure modes
- [ ] Retry with exponential backoff on transient failures
- [ ] Logging uses structured format with correlation IDs
- [ ] No TODO/FIXME/HACK comments left in production code
- [ ] Config values loaded from config/*.json (not hardcoded)
- [ ] Tests exist for business logic (unit) and integrations (integration)

## Step 4: WAF Compliance Check
- [ ] **Reliability:** Health checks, retry policies, circuit breaker
- [ ] **Security:** Managed Identity, Key Vault, Content Safety, RBAC
- [ ] **Cost:** Model routing configured, caching enabled, SKUs right-sized
- [ ] **Ops Excellence:** IaC complete, CI/CD defined, monitoring configured
- [ ] **Performance:** Async patterns, connection pooling, caching
- [ ] **Responsible AI:** Content safety, groundedness checks, source attribution

## Step 5: Configuration Review
- [ ] config/openai.json has appropriate model and temperature settings
- [ ] config/guardrails.json has content safety thresholds defined
- [ ] config/agents.json defines agent behavior and handoff rules
- [ ] All JSON files parse without errors
- [ ] No conflicting configuration between files

## Step 6: Infrastructure Review
- [ ] Bicep compiles without errors: \`az bicep build -f infra/main.bicep\`
- [ ] All resources have proper tags (project, environment, owner)
- [ ] Managed Identity configured for service-to-service auth
- [ ] Diagnostic settings enabled for all resources
- [ ] Dev/prod environment separation via parameters

## Step 7: Generate Review Report
\`\`\`markdown
## Review Report — Play ${getId(f)}: ${getName(f)}
- Architecture: [PASS/FAIL]
- Security: [PASS/FAIL] — [N] issues found
- Code Quality: [PASS/FAIL] — [N] items
- WAF Compliance: [PASS/FAIL] — [N]/6 pillars met
- Configuration: [PASS/FAIL]
- Infrastructure: [PASS/FAIL]
- **Overall: [APPROVED / NEEDS CHANGES]**
\`\`\`

## Verdict
- **APPROVED:** All checks pass → hand off to @tuner
- **NEEDS CHANGES:** Issues found → return to @builder with specific fix list
`;

const testTemplate = (f) => `---
mode: "agent"
description: "Test ${getName(f)} (Play ${getId(f)}) implementation"
tools: ["terminal", "file"]
---

# Test ${getName(f)} Implementation

You are testing the FrootAI ${getName(f)} solution play (Play ${getId(f)}).

## Test Strategy
Execute a comprehensive test suite covering unit, integration, E2E, and load tests.

## Step 1: Unit Tests
Run unit tests for business logic and data transformations:
\`\`\`bash
pytest tests/unit/ -v --cov=app --cov-report=term-missing --cov-report=html
\`\`\`
**Coverage target:** ≥ 80% on business logic modules.

### What to Test
- Input validation and sanitization functions
- Data transformation and processing logic
- Configuration loading and validation
- Error handling and exception classification
- Output formatting and schema compliance

## Step 2: Integration Tests
Test Azure service integrations:
\`\`\`bash
pytest tests/integration/ -v --timeout=60
\`\`\`

### What to Test
- Azure OpenAI chat completion calls (with mock or test deployment)
- Azure AI Search indexing and querying
- Azure Key Vault secret retrieval
- Azure Storage blob operations
- Application Insights telemetry sending

## Step 3: End-to-End Tests
Run full request-response cycle tests:
\`\`\`bash
pytest tests/e2e/ -v --timeout=120
\`\`\`

### Scenarios to Cover
- Happy path: valid request → expected response with correct schema
- Authentication: invalid token → 401 response
- Validation: malformed input → 400 with error details
- Rate limiting: burst requests → 429 with Retry-After header
- Content safety: harmful input → blocked with safety reason
- Timeout: slow dependency → graceful timeout response

## Step 4: Load Tests
Establish performance baseline:
\`\`\`bash
# Using locust or k6
k6 run tests/load/scenario.js --vus 50 --duration 60s
\`\`\`

### Performance Targets
| Metric | Target | Measurement |
|--------|--------|-------------|
| Response time p50 | < 500ms | Median latency |
| Response time p95 | < 2000ms | 95th percentile |
| Response time p99 | < 5000ms | 99th percentile |
| Error rate | < 1% | 4xx + 5xx responses |
| Throughput | > 50 RPS | Requests per second |

## Step 5: Security Tests
- [ ] SQL/NoSQL injection: verify parameterized queries
- [ ] XSS: verify HTML encoding on LLM output displayed in UI
- [ ] Prompt injection: verify system prompt isolation
- [ ] Auth bypass: verify all endpoints require authentication
- [ ] Rate limit: verify limits are enforced per-user

## Step 6: Evaluate Test Results
\`\`\`bash
# Generate combined test report
pytest tests/ --junitxml=test-results.xml --html=test-report.html
\`\`\`

### Pass Criteria
- All unit tests pass (0 failures)
- All integration tests pass (0 failures)
- E2E tests: ≥ 95% pass rate
- Load test: all performance targets met
- Coverage: ≥ 80% on business logic

## Step 7: Test Data Management
- Test fixtures in \`tests/fixtures/\` directory
- Mock responses for Azure services in \`tests/mocks/\`
- Test environment config in \`tests/conftest.py\`
- Evaluation test set in \`evaluation/test-set.jsonl\`
- Never use production data in tests — use synthetic/anonymized data

## CI Integration
Tests run automatically on every PR:
1. Unit + integration tests on PR creation
2. E2E tests on PR approval (gated)
3. Load tests on merge to main (nightly)
4. Evaluation pipeline on deployment (CD gate)
`;

// Execute
let stats = { deploy: 0, evaluate: 0, review: 0, test: 0 };
for (const p of plays) {
    const prompts = {
        "deploy.prompt.md": deployTemplate(p),
        "evaluate.prompt.md": evaluateTemplate(p),
        "review.prompt.md": reviewTemplate(p),
        "test.prompt.md": testTemplate(p)
    };
    for (const [file, template] of Object.entries(prompts)) {
        const fp = path.join(dir, p, ".github/prompts", file);
        if (fs.existsSync(fp)) {
            const lines = fs.readFileSync(fp, "utf8").split("\n").length;
            if (lines < 80) {
                fs.writeFileSync(fp, template);
                stats[file.split(".")[0]]++;
            }
        }
    }
}

// Verify
for (const file of ["deploy.prompt.md", "evaluate.prompt.md", "review.prompt.md", "test.prompt.md"]) {
    const lines = plays.map(p => {
        const fp = path.join(dir, p, ".github/prompts", file);
        return fs.existsSync(fp) ? fs.readFileSync(fp, "utf8").split("\n").length : 0;
    }).filter(l => l > 0);
    const min = Math.min(...lines), avg = Math.round(lines.reduce((a, b) => a + b, 0) / lines.length);
    console.log(`${file}: fixed=${stats[file.split(".")[0]]}, min=${min}, avg=${avg}, under80=${lines.filter(l => l < 80).length}`);
}
