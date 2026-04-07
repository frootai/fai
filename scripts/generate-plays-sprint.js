#!/usr/bin/env node
/**
 * FrootAI — Solution Plays Sprint
 * 
 * 1. Enriches plays 21-23 to match Play 01 structure (config, infra, spec, evaluation, DevKit)
 * 2. Creates plays 24-30 (Tier 1 hot topics) with full structure
 * 
 * Reference structure (from Play 01):
 *   .github/agents/       — builder, reviewer, tuner agent.md files
 *   .github/instructions/  — play-specific + WAF instructions
 *   .github/prompts/       — deploy, evaluate, review, test prompts
 *   .github/skills/        — deploy, evaluate, tune skill folders
 *   .vscode/               — mcp.json, settings.json
 *   config/               — openai.json, guardrails.json
 *   evaluation/           — eval.py, test-set.jsonl
 *   infra/                — main.bicep, parameters.json
 *   spec/                 — play-spec.json
 *   fai-manifest.json, froot.json, README.md
 */

const fs = require('fs');
const path = require('path');

const PLAYS_DIR = path.join(__dirname, '..', 'solution-plays');

let created = 0;
let skipped = 0;

function writeIfNew(filePath, content) {
    if (fs.existsSync(filePath)) { skipped++; return; }
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content);
    created++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Play definitions
// ═══════════════════════════════════════════════════════════════════════════════

const plays = [
    // --- Existing plays to enrich ---
    { num: '21', slug: 'agentic-rag', title: 'Agentic RAG', desc: 'Autonomous RAG where the AI agent controls retrieval — decides when to search, which sources to query, iterates on results, and synthesizes across multiple knowledge bases with citations.', model: 'gpt-4o', pattern: 'agentic-rag', services: ['Azure OpenAI', 'Azure AI Search', 'Azure Container Apps', 'Azure Key Vault'], waf: ['security', 'reliability', 'cost-optimization', 'operational-excellence', 'responsible-ai'], knowledge: ['R2-RAG-Architecture', 'O2-Agent-Coding', 'O3-MCP-Tools-Functions', 'F1-GenAI-Foundations'] },
    { num: '22', slug: 'multi-agent-swarm', title: 'Multi-Agent Swarm', desc: 'Distributed agent teams with supervisor patterns, tool delegation, shared memory, and conflict resolution for complex multi-step tasks.', model: 'gpt-4o', pattern: 'multi-agent', services: ['Azure OpenAI', 'Azure Container Apps', 'Azure Service Bus', 'Azure Cosmos DB'], waf: ['security', 'reliability', 'cost-optimization', 'operational-excellence', 'performance-efficiency'], knowledge: ['O2-Agent-Coding', 'O1-Semantic-Kernel', 'T3-Production-Patterns', 'F4-GitHub-Agentic-OS'] },
    { num: '23', slug: 'browser-automation-agent', title: 'Browser Automation Agent', desc: 'AI-driven web task execution using Playwright MCP and GPT-4o Vision — navigate websites, extract data, fill forms, and automate multi-step web workflows.', model: 'gpt-4o', pattern: 'browser-agent', services: ['Azure OpenAI', 'Azure Container Apps', 'Playwright MCP'], waf: ['security', 'reliability', 'cost-optimization', 'responsible-ai'], knowledge: ['O3-MCP-Tools-Functions', 'O2-Agent-Coding', 'F4-GitHub-Agentic-OS'] },
    // --- New plays 24-30 ---
    { num: '24', slug: 'ai-code-review-pipeline', title: 'AI Code Review Pipeline', desc: 'Automated PR review with CodeQL integration, OWASP scanning, architecture validation, and AI-generated improvement suggestions with inline comments.', model: 'gpt-4o', pattern: 'code-review', services: ['Azure OpenAI', 'GitHub Actions', 'CodeQL', 'Azure DevOps'], waf: ['security', 'reliability', 'operational-excellence', 'responsible-ai'], knowledge: ['O2-Agent-Coding', 'T3-Production-Patterns', 'F4-GitHub-Agentic-OS'] },
    { num: '25', slug: 'conversation-memory-layer', title: 'Conversation Memory Layer', desc: 'Persistent agent memory with short-term, long-term, and episodic memory stores — enabling agents to remember context across sessions, learn from interactions, and personalize responses.', model: 'gpt-4o', pattern: 'memory-layer', services: ['Azure OpenAI', 'Azure Cosmos DB', 'Azure AI Search', 'Azure Redis Cache'], waf: ['security', 'reliability', 'performance-efficiency', 'cost-optimization', 'responsible-ai'], knowledge: ['R2-RAG-Architecture', 'O2-Agent-Coding', 'O1-Semantic-Kernel', 'F1-GenAI-Foundations'] },
    { num: '26', slug: 'semantic-search-engine', title: 'Semantic Search Engine', desc: 'Full-text, vector, and hybrid search with reranking, query expansion, personalization, and answer generation — a complete search experience powered by Azure AI Search and LLMs.', model: 'gpt-4o', pattern: 'search-engine', services: ['Azure AI Search', 'Azure OpenAI', 'Azure Blob Storage', 'Azure Container Apps'], waf: ['security', 'reliability', 'performance-efficiency', 'cost-optimization'], knowledge: ['R2-RAG-Architecture', 'F1-GenAI-Foundations', 'T3-Production-Patterns'] },
    { num: '27', slug: 'ai-data-pipeline', title: 'AI Data Pipeline', desc: 'ETL with LLM augmentation — ingest, transform, classify, and enrich data using AI models. Schema detection, PII redaction, quality scoring, and lakehouse integration.', model: 'gpt-4o-mini', pattern: 'data-pipeline', services: ['Azure OpenAI', 'Azure Data Factory', 'Azure Blob Storage', 'Azure Cosmos DB', 'Azure Event Hubs'], waf: ['security', 'reliability', 'cost-optimization', 'operational-excellence', 'responsible-ai'], knowledge: ['T1-Fine-Tuning-MLOps', 'T3-Production-Patterns', 'R2-RAG-Architecture'] },
    { num: '28', slug: 'knowledge-graph-rag', title: 'Knowledge Graph RAG', desc: 'Graph-enhanced retrieval using knowledge graphs, entity extraction, and relationship mapping. Combines Azure Cosmos DB Gremlin with vector search for contextual, explainable answers.', model: 'gpt-4o', pattern: 'graph-rag', services: ['Azure OpenAI', 'Azure Cosmos DB (Gremlin)', 'Azure AI Search', 'Azure Container Apps'], waf: ['security', 'reliability', 'performance-efficiency', 'cost-optimization', 'responsible-ai'], knowledge: ['R2-RAG-Architecture', 'F1-GenAI-Foundations', 'O2-Agent-Coding', 'R3-Deterministic-AI'] },
    { num: '29', slug: 'mcp-gateway', title: 'MCP Gateway', desc: 'Centralized MCP server management — proxy, load balance, and govern multiple MCP servers with authentication, rate limiting, usage analytics, and tool discovery.', model: 'gpt-4o-mini', pattern: 'mcp-gateway', services: ['Azure API Management', 'Azure Container Apps', 'Azure Monitor', 'Azure Key Vault'], waf: ['security', 'reliability', 'cost-optimization', 'operational-excellence', 'performance-efficiency'], knowledge: ['O3-MCP-Tools-Functions', 'F4-GitHub-Agentic-OS', 'T3-Production-Patterns'] },
    { num: '30', slug: 'ai-security-hardening', title: 'AI Security Hardening', desc: 'LLM security platform — prompt injection detection, jailbreak defense, content safety enforcement, red teaming automation, and OWASP LLM Top 10 compliance scanning.', model: 'gpt-4o', pattern: 'security-hardening', services: ['Azure AI Content Safety', 'Azure OpenAI', 'Azure Container Apps', 'Azure Key Vault', 'Azure Monitor'], waf: ['security', 'reliability', 'responsible-ai', 'operational-excellence'], knowledge: ['T2-Responsible-AI', 'R3-Deterministic-AI', 'T3-Production-Patterns', 'F1-GenAI-Foundations'] }
];

// ═══════════════════════════════════════════════════════════════════════════════
// Generate files per play
// ═══════════════════════════════════════════════════════════════════════════════

for (const p of plays) {
    const dir = path.join(PLAYS_DIR, `${p.num}-${p.slug}`);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // --- config/openai.json ---
    writeIfNew(path.join(dir, 'config', 'openai.json'), JSON.stringify({
        model: p.model,
        api_version: '2024-12-01-preview',
        temperature: 0.1,
        top_p: 0.9,
        max_tokens: 1000,
        frequency_penalty: 0,
        presence_penalty: 0,
        seed: 42
    }, null, 2) + '\n');

    // --- config/guardrails.json ---
    writeIfNew(path.join(dir, 'config', 'guardrails.json'), JSON.stringify({
        content_safety: { enabled: true, categories: ['hate', 'self_harm', 'sexual', 'violence'], severity_threshold: 2, action: 'block' },
        pii_detection: { enabled: true, categories: ['email', 'phone', 'ssn', 'credit_card'], action: 'redact' },
        prompt_injection: { enabled: true, action: 'block' },
        business_rules: { max_response_tokens: 1000, require_citations: true, min_confidence_to_answer: 0.7 }
    }, null, 2) + '\n');

    // --- spec/play-spec.json ---
    writeIfNew(path.join(dir, 'spec', 'play-spec.json'), JSON.stringify({
        name: `${p.num}-${p.slug}`,
        version: '1.0.0',
        play: `${p.num}-${p.slug}`,
        description: p.desc,
        scale: 'dev',
        architecture: { pattern: p.pattern, data_flow: 'See README.md for architecture diagram' },
        config: { openai: 'config/openai.json', guardrails: 'config/guardrails.json' },
        evaluation: { metrics: ['groundedness', 'relevance', 'coherence', 'fluency', 'safety'], thresholds: { groundedness: 4, relevance: 4, safety: 5 } },
        waf_alignment: p.waf.reduce((acc, w) => { acc[w] = 'See README.md'; return acc; }, {})
    }, null, 2) + '\n');

    // --- evaluation/test-set.jsonl ---
    writeIfNew(path.join(dir, 'evaluation', 'test-set.jsonl'),
        `{"query": "What does this play do?", "expected": "${p.title} — ${p.desc.substring(0, 80)}..."}\n` +
        `{"query": "What Azure services are used?", "expected": "${p.services.join(', ')}"}\n` +
        `{"query": "Which WAF pillars are covered?", "expected": "${p.waf.join(', ')}"}\n`
    );

    // --- infra/main.bicep ---
    writeIfNew(path.join(dir, 'infra', 'main.bicep'),
        `targetScope = 'resourceGroup'

//
// ${p.title} — Azure Infrastructure
// Deploy: az deployment group create -f main.bicep -p parameters.json
//

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Environment: dev, staging, or prod')
@allowed(['dev', 'staging', 'prod'])
param environment string = 'dev'

@description('Project name used for resource naming')
param projectName string = 'frootai-${p.slug}'

@secure()
@description('Azure OpenAI API key (use Key Vault in production)')
param openaiApiKey string = ''

var suffix = uniqueString(resourceGroup().id)
var tags = { environment: environment, project: 'frootai', play: '${p.num}-${p.slug}' }

// Azure OpenAI
resource openai 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: '\${projectName}-oai-\${suffix}'
  location: location
  kind: 'OpenAI'
  sku: { name: environment == 'prod' ? 'S0' : 'S0' }
  tags: tags
  properties: {
    publicNetworkAccess: environment == 'prod' ? 'Disabled' : 'Enabled'
    customSubDomainName: '\${projectName}-oai-\${suffix}'
  }
}

// Container Apps Environment
resource caEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '\${projectName}-env-\${suffix}'
  location: location
  tags: tags
  properties: {
    zoneRedundant: environment == 'prod'
  }
}

output openaiEndpoint string = openai.properties.endpoint
output caEnvId string = caEnv.id
`);

    // --- infra/parameters.json ---
    writeIfNew(path.join(dir, 'infra', 'parameters.json'), JSON.stringify({
        '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#',
        contentVersion: '1.0.0.0',
        parameters: {
            location: { value: 'eastus2' },
            environment: { value: 'dev' },
            projectName: { value: `frootai-${p.slug}` }
        }
    }, null, 2) + '\n');

    // --- .github/agents/ (builder, reviewer, tuner) ---
    for (const role of ['builder', 'reviewer', 'tuner']) {
        const agentDesc = role === 'builder'
            ? `Builds ${p.title} solution — implements the ${p.pattern} pattern using ${p.services[0]} and ${p.services[1]}.`
            : role === 'reviewer'
                ? `Reviews ${p.title} implementation — checks WAF compliance, security, performance, and code quality.`
                : `Tunes ${p.title} configuration — optimizes model parameters, guardrails, cost, and evaluation thresholds.`;
        writeIfNew(path.join(dir, '.github', 'agents', `${role}.agent.md`),
            `---
description: "${agentDesc}"
---

# ${p.title} ${role.charAt(0).toUpperCase() + role.slice(1)}

You are the ${role} for the **${p.title}** solution play.

## Context
- Play: ${p.num}-${p.slug}
- Pattern: ${p.pattern}
- Services: ${p.services.join(', ')}
- WAF Pillars: ${p.waf.join(', ')}

## Knowledge Modules
${p.knowledge.map(k => `- ${k}`).join('\n')}

## Rules
${role === 'builder' ? `1. Follow the architecture pattern defined in spec/play-spec.json
2. Use ${p.model} with config/openai.json settings
3. Apply guardrails from config/guardrails.json
4. Reference FROOT knowledge modules for best practices
5. Create infrastructure using infra/main.bicep patterns` :
                role === 'reviewer' ? `1. Check all ${p.waf.length} WAF pillars are addressed
2. Verify secrets use @secure() and Key Vault
3. Validate error handling and retry patterns
4. Check evaluation thresholds are set correctly
5. Ensure content safety is enabled` :
                    `1. Optimize ${p.model} parameters for this use case
2. Adjust guardrails thresholds based on evaluation results
3. Right-size Azure resource SKUs for the target environment
4. Optimize token budgets and caching strategies
5. Run evaluation pipeline and track score trends`}
`);
    }

    // --- .github/instructions/ ---
    writeIfNew(path.join(dir, '.github', 'instructions', `${p.slug}-patterns.instructions.md`),
        `---
description: "Coding patterns for ${p.title} — ${p.pattern} architecture, ${p.services[0]} integration, and WAF-aligned best practices."
applyTo: "solution-plays/${p.num}-${p.slug}/**"
---

# ${p.title} Patterns

## Architecture
- Pattern: ${p.pattern}
- Model: ${p.model}
- Services: ${p.services.join(', ')}

## Security
- Use Managed Identity for Azure service auth (DefaultAzureCredential)
- Store secrets in Azure Key Vault, never hardcode
- Enable content safety with severity threshold ≤2
- Validate all user input at API boundaries

## Reliability
- Retry with exponential backoff on all Azure SDK calls
- Set explicit timeouts: 30s for LLM calls, 10s for search
- Implement health check endpoint at /health
- Handle partial failures gracefully

## Cost Optimization
- Set max_tokens=${p.model === 'gpt-4o-mini' ? '500' : '1000'} on all LLM calls
- Cache embeddings and search results where possible
- Use ${p.model} — right-sized for this use case
- Monitor token usage via Azure Monitor

## Operational Excellence
- Structured JSON logging with correlation IDs
- Diagnostic settings on all Azure resources
- CI/CD pipeline with evaluation gates
`);

    // --- .github/prompts/ ---
    for (const prompt of ['deploy', 'evaluate', 'review', 'test']) {
        const promptContent = prompt === 'deploy'
            ? `Deploy ${p.title} to Azure using Bicep. Validate templates first, run what-if, then deploy to the target resource group.`
            : prompt === 'evaluate'
                ? `Run the evaluation pipeline for ${p.title}. Execute test-set.jsonl queries, measure groundedness/coherence/safety, and report against guardrail thresholds.`
                : prompt === 'review'
                    ? `Review the ${p.title} implementation. Check WAF alignment across ${p.waf.join(', ')}. Verify secrets handling, error patterns, and evaluation thresholds.`
                    : `Generate test cases for ${p.title}. Cover happy paths, edge cases, error handling, and adversarial inputs (prompt injection, out-of-scope queries).`;
        writeIfNew(path.join(dir, '.github', 'prompts', `${prompt}.prompt.md`),
            `---
description: "${prompt.charAt(0).toUpperCase() + prompt.slice(1)} ${p.title}"
---

${promptContent}

## Context
- Play: ${p.num}-${p.slug}
- Pattern: ${p.pattern}
- Model: ${p.model}
- Services: ${p.services.join(', ')}
`);
    }

    // --- .github/skills/ (deploy, evaluate, tune folders) ---
    for (const skill of ['deploy', 'evaluate', 'tune']) {
        const skillDir = path.join(dir, '.github', 'skills', `${skill}-${p.slug}`);
        const skillDesc = skill === 'deploy'
            ? `Deploy ${p.title} infrastructure to Azure — Bicep validation, what-if preview, deployment, and post-deploy health check.`
            : skill === 'evaluate'
                ? `Evaluate ${p.title} quality — run test-set.jsonl, measure groundedness/coherence/safety, compare against guardrail thresholds.`
                : `Tune ${p.title} configuration — optimize model parameters, guardrails, SKU sizing, and evaluation thresholds.`;
        writeIfNew(path.join(skillDir, 'SKILL.md'),
            `---
name: "${skill}-${p.num}-${p.slug}"
description: "${skillDesc}"
---

# ${skill.charAt(0).toUpperCase() + skill.slice(1)} ${p.title}

## Step 1: Prerequisites
- Azure CLI logged in (\`az account show\`)
- Resource group created
- ${p.services.join(', ')} access

## Step 2: ${skill === 'deploy' ? 'Validate Bicep' : skill === 'evaluate' ? 'Prepare test data' : 'Review current config'}
${skill === 'deploy' ? '```bash\naz bicep build -f infra/main.bicep\n```' :
                skill === 'evaluate' ? 'Check `evaluation/test-set.jsonl` has representative queries.' :
                    'Review `config/openai.json` and `config/guardrails.json` for current settings.'}

## Step 3: Execute
${skill === 'deploy' ? '```bash\naz deployment group create -g rg-frootai-' + p.slug + ' -f infra/main.bicep -p infra/parameters.json\n```' :
                skill === 'evaluate' ? '```bash\nnode engine/index.js solution-plays/' + p.num + '-' + p.slug + '/fai-manifest.json --eval\n```' :
                    'Adjust parameters based on evaluation results and cost targets.'}

## Step 4: Verify
${skill === 'deploy' ? '```bash\naz resource list -g rg-frootai-' + p.slug + ' -o table\n```' :
                skill === 'evaluate' ? 'All metrics should meet thresholds defined in fai-manifest.json guardrails.' :
                    'Re-run evaluation to confirm score improvements.'}
`);
    }

    // --- .vscode/mcp.json ---
    writeIfNew(path.join(dir, '.vscode', 'mcp.json'), JSON.stringify({
        servers: { frootai: { type: 'stdio', command: 'npx', args: ['frootai-mcp@latest'] } }
    }, null, 2) + '\n');

    // --- .vscode/settings.json ---
    writeIfNew(path.join(dir, '.vscode', 'settings.json'), JSON.stringify({
        'files.associations': { '*.agent.md': 'markdown', '*.instructions.md': 'markdown', '*.prompt.md': 'markdown' }
    }, null, 2) + '\n');

    // --- froot.json (enrich if empty) ---
    const frootPath = path.join(dir, 'froot.json');
    if (fs.existsSync(frootPath)) {
        const existing = JSON.parse(fs.readFileSync(frootPath, 'utf8'));
        if (!existing.kits) {
            // Enrich existing froot.json
            existing.kits = {
                devkit: { path: '.github/', includes: ['agents', 'instructions', 'prompts', 'skills'] },
                tunekit: { path: 'config/', files: ['openai.json', 'guardrails.json'] },
                speckit: { path: 'spec/', files: ['play-spec.json'] }
            };
            existing.title = p.title;
            existing.description = p.desc;
            existing.complexity = 'Medium';
            existing.tags = p.waf;
            existing.status = 'Active';
            fs.writeFileSync(frootPath, JSON.stringify(existing, null, 2) + '\n');
            created++;
        } else { skipped++; }
    } else {
        writeIfNew(frootPath, JSON.stringify({
            name: `${p.num}-${p.slug}`,
            version: '1.0.0',
            framework: 'frootai',
            title: p.title,
            description: p.desc,
            complexity: 'Medium',
            tags: p.waf,
            status: 'Active',
            kits: {
                devkit: { path: '.github/', includes: ['agents', 'instructions', 'prompts', 'skills'] },
                tunekit: { path: 'config/', files: ['openai.json', 'guardrails.json'] },
                speckit: { path: 'spec/', files: ['play-spec.json'] }
            }
        }, null, 2) + '\n');
    }

    // --- fai-manifest.json (create if missing) ---
    writeIfNew(path.join(dir, 'fai-manifest.json'), JSON.stringify({
        play: `${p.num}-${p.slug}`,
        version: '1.0.0',
        context: {
            knowledge: p.knowledge,
            waf: p.waf,
            scope: `${p.slug}-solution`
        },
        primitives: {
            agents: [`./.github/agents/builder.agent.md`, `./.github/agents/reviewer.agent.md`, `./.github/agents/tuner.agent.md`],
            instructions: [`./.github/instructions/${p.slug}-patterns.instructions.md`],
            skills: [`./.github/skills/deploy-${p.slug}/`, `./.github/skills/evaluate-${p.slug}/`, `./.github/skills/tune-${p.slug}/`],
            hooks: ['../../hooks/frootai-secrets-scanner/', '../../hooks/frootai-tool-guardian/', '../../hooks/frootai-governance-audit/'],
            guardrails: {
                groundedness: { threshold: 0.85, action: 'warn' },
                coherence: { threshold: 0.80, action: 'warn' },
                safety: { threshold: 0.95, action: 'block' },
                cost_per_request: { threshold: 0.05, action: 'warn' }
            }
        },
        infrastructure: { bicep: './infra/main.bicep', parameters: './infra/parameters.json' },
        toolkit: { devkit: '.github/', tunekit: 'config/', speckit: 'spec/' }
    }, null, 2) + '\n');

    // --- README.md (create if minimal) ---
    const readmePath = path.join(dir, 'README.md');
    const existingReadme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : '';
    if (existingReadme.length < 500) {
        fs.writeFileSync(readmePath,
            `# Play ${p.num}: ${p.title}

> ${p.desc}

## Architecture

| Component | Technology |
|-----------|-----------|
${p.services.map(s => `| ${s} | Production-grade |`).join('\n')}

## WAF Alignment

| Pillar | Implementation |
|--------|---------------|
${p.waf.map(w => `| ${w} | See .github/instructions/${p.slug}-patterns.instructions.md |`).join('\n')}

## Quick Start

\`\`\`bash
# 1. Deploy infrastructure
az deployment group create -g rg-frootai-${p.slug} -f infra/main.bicep -p infra/parameters.json

# 2. Run FAI Engine
node engine/index.js solution-plays/${p.num}-${p.slug}/fai-manifest.json --status

# 3. Evaluate
node engine/index.js solution-plays/${p.num}-${p.slug}/fai-manifest.json --eval
\`\`\`

## DevKit (\.github/)

| Primitive | Count | Purpose |
|-----------|-------|---------|
| Agents | 3 | builder, reviewer, tuner |
| Instructions | 1 | ${p.slug} coding patterns |
| Prompts | 4 | deploy, evaluate, review, test |
| Skills | 3 | deploy, evaluate, tune |

## TuneKit (config/)

| File | Purpose |
|------|---------|
| \`openai.json\` | Model parameters (${p.model}, temp=0.1, max_tokens=1000) |
| \`guardrails.json\` | Content safety, PII detection, prompt injection, business rules |

## SpecKit (spec/)

| File | Purpose |
|------|---------|
| \`play-spec.json\` | Architecture, evaluation metrics, WAF alignment |

## Evaluation

Test dataset: \`evaluation/test-set.jsonl\`

| Metric | Threshold | Action |
|--------|-----------|--------|
| Groundedness | ≥ 0.85 | warn |
| Coherence | ≥ 0.80 | warn |
| Safety | ≥ 0.95 | block |
| Cost/request | ≤ $0.05 | warn |

## Knowledge Modules

${p.knowledge.map(k => `- **${k}**`).join('\n')}
`);
        created++;
    } else { skipped++; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════════════════════

const totalPlays = fs.readdirSync(PLAYS_DIR).filter(f =>
    fs.statSync(path.join(PLAYS_DIR, f)).isDirectory() && /^\d{2}-/.test(f)
).length;

console.log(`\n${'═'.repeat(55)}`);
console.log(`  FrootAI Solution Plays Sprint — COMPLETE`);
console.log(`${'═'.repeat(55)}`);
console.log(`  Created: ${created} new files`);
console.log(`  Skipped: ${skipped} (already exist)`);
console.log(`  TOTAL PLAYS: ${totalPlays}`);
console.log(`  Plays enriched: 21, 22, 23`);
console.log(`  Plays created: 24, 25, 26, 27, 28, 29, 30`);
console.log(`${'═'.repeat(55)}\n`);
