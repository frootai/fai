#!/usr/bin/env node
/**
 * FrootAI — Solution Plays Sprint 2 (Plays 31-40)
 * Tier 1 remaining — completes the first 40 plays.
 */

const fs = require('fs');
const path = require('path');

const PLAYS_DIR = path.join(__dirname, '..', 'solution-plays');
let created = 0, skipped = 0;

function writeIfNew(fp, content) {
  if (fs.existsSync(fp)) { skipped++; return; }
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fp, content);
  created++;
}

const plays = [
  { num: '31', slug: 'low-code-ai-builder', title: 'Low-Code AI Builder', model: 'gpt-4o', pattern: 'low-code-builder', services: ['Azure OpenAI', 'Azure Container Apps', 'Azure Cosmos DB', 'Azure Static Web Apps'], waf: ['security', 'reliability', 'cost-optimization', 'operational-excellence'], knowledge: ['O2-Agent-Coding', 'F1-GenAI-Foundations', 'T3-Production-Patterns'], desc: 'Visual agent workflow builder — drag-and-drop AI pipeline design, template library, one-click deployment, and evaluation dashboard. Build production AI without writing code.' },
  { num: '32', slug: 'ai-powered-testing', title: 'AI-Powered Testing', model: 'gpt-4o', pattern: 'ai-testing', services: ['Azure OpenAI', 'GitHub Actions', 'Azure Container Apps', 'Azure Monitor'], waf: ['security', 'reliability', 'operational-excellence', 'performance-efficiency'], knowledge: ['O2-Agent-Coding', 'T3-Production-Patterns', 'F4-GitHub-Agentic-OS'], desc: 'Autonomous test generation — unit, integration, E2E, and property-based tests created by AI. Polyglot support, mutation testing, coverage analysis, and CI/CD integration.' },
  { num: '33', slug: 'voice-ai-agent', title: 'Voice AI Agent', model: 'gpt-4o', pattern: 'voice-agent', services: ['Azure AI Speech', 'Azure OpenAI', 'Azure Communication Services', 'Azure Container Apps'], waf: ['security', 'reliability', 'cost-optimization', 'responsible-ai'], knowledge: ['F1-GenAI-Foundations', 'R2-RAG-Architecture', 'T2-Responsible-AI'], desc: 'Real-time voice-driven AI agent — speech-to-text, intent recognition, conversational AI, and text-to-speech. Build voice bots for customer service, IVR, and accessibility.' },
  { num: '34', slug: 'edge-ai-deployment', title: 'Edge AI Deployment', model: 'gpt-4o-mini', pattern: 'edge-deployment', services: ['Azure IoT Hub', 'Azure Container Instances', 'ONNX Runtime', 'Azure Monitor'], waf: ['security', 'reliability', 'cost-optimization', 'performance-efficiency'], knowledge: ['F2-LLM-Selection', 'T1-Fine-Tuning-MLOps', 'T3-Production-Patterns'], desc: 'Deploy AI models to edge devices — ONNX quantization, model compression, offline inference, IoT Hub sync, and fleet management for on-premise and disconnected environments.' },
  { num: '35', slug: 'ai-compliance-engine', title: 'AI Compliance Engine', model: 'gpt-4o', pattern: 'compliance-engine', services: ['Azure OpenAI', 'Azure Policy', 'Azure Key Vault', 'Azure Monitor', 'Azure Cosmos DB'], waf: ['security', 'reliability', 'responsible-ai', 'operational-excellence'], knowledge: ['T2-Responsible-AI', 'T3-Production-Patterns', 'R3-Deterministic-AI'], desc: 'Automated regulatory compliance — GDPR data mapping, HIPAA audit trails, SOC 2 evidence collection, EU AI Act risk assessment, and continuous compliance monitoring with AI.' },
  { num: '36', slug: 'multimodal-agent', title: 'Multimodal Agent', model: 'gpt-4o', pattern: 'multimodal', services: ['Azure OpenAI (GPT-4o Vision)', 'Azure AI Vision', 'Azure Blob Storage', 'Azure Container Apps'], waf: ['security', 'reliability', 'cost-optimization', 'responsible-ai'], knowledge: ['F1-GenAI-Foundations', 'O2-Agent-Coding', 'R2-RAG-Architecture'], desc: 'Vision + text + code agent — analyze images, screenshots, diagrams, and documents alongside natural language. Build AI that sees, reads, and acts across modalities.' },
  { num: '37', slug: 'ai-powered-devops', title: 'AI-Powered DevOps', model: 'gpt-4o', pattern: 'ai-devops', services: ['Azure OpenAI', 'Azure Monitor', 'Azure DevOps', 'GitHub Actions', 'Azure Container Apps'], waf: ['security', 'reliability', 'operational-excellence', 'cost-optimization'], knowledge: ['T3-Production-Patterns', 'O2-Agent-Coding', 'F4-GitHub-Agentic-OS'], desc: 'AI-assisted SRE and DevOps — intelligent incident triage, automated runbook execution, deployment risk scoring, GitOps with AI review, and predictive scaling.' },
  { num: '38', slug: 'document-understanding-v2', title: 'Document Understanding v2', model: 'gpt-4o', pattern: 'doc-understanding-v2', services: ['Azure AI Document Intelligence', 'Azure OpenAI', 'Azure Blob Storage', 'Azure Cosmos DB'], waf: ['security', 'reliability', 'responsible-ai', 'performance-efficiency'], knowledge: ['F1-GenAI-Foundations', 'R2-RAG-Architecture', 'T3-Production-Patterns'], desc: 'Advanced document processing — multi-page PDF understanding, table extraction with relationships, handwriting recognition, cross-document entity linking, and structured output generation.' },
  { num: '39', slug: 'ai-meeting-assistant', title: 'AI Meeting Assistant', model: 'gpt-4o', pattern: 'meeting-assistant', services: ['Azure AI Speech', 'Azure OpenAI', 'Microsoft Graph', 'Azure Container Apps'], waf: ['security', 'reliability', 'responsible-ai', 'cost-optimization'], knowledge: ['F1-GenAI-Foundations', 'O2-Agent-Coding', 'T2-Responsible-AI'], desc: 'Intelligent meeting companion — real-time transcription, speaker diarization, action item extraction, decision tracking, follow-up scheduling, and meeting summary generation.' },
  { num: '40', slug: 'copilot-studio-advanced', title: 'Copilot Studio Advanced', model: 'gpt-4o', pattern: 'copilot-studio-adv', services: ['Microsoft Copilot Studio', 'Azure OpenAI', 'Dataverse', 'Microsoft Graph', 'Power Platform'], waf: ['security', 'reliability', 'operational-excellence', 'responsible-ai'], knowledge: ['F4-GitHub-Agentic-OS', 'O6-Copilot-Extend', 'O3-MCP-Tools-Functions'], desc: 'Enterprise Copilot extensions — declarative agents with TypeSpec, API plugins, adaptive cards, multi-turn conversations, enterprise SSO, and M365 data integration via Graph API.' },
];

for (const p of plays) {
  const dir = path.join(PLAYS_DIR, `${p.num}-${p.slug}`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // config/openai.json
  writeIfNew(path.join(dir, 'config', 'openai.json'), JSON.stringify({ model: p.model, api_version: '2024-12-01-preview', temperature: 0.1, top_p: 0.9, max_tokens: 1000, frequency_penalty: 0, presence_penalty: 0, seed: 42 }, null, 2) + '\n');

  // config/guardrails.json
  writeIfNew(path.join(dir, 'config', 'guardrails.json'), JSON.stringify({ content_safety: { enabled: true, categories: ['hate','self_harm','sexual','violence'], severity_threshold: 2, action: 'block' }, pii_detection: { enabled: true, categories: ['email','phone','ssn','credit_card'], action: 'redact' }, prompt_injection: { enabled: true, action: 'block' }, business_rules: { max_response_tokens: 1000, require_citations: true, min_confidence_to_answer: 0.7 } }, null, 2) + '\n');

  // spec/play-spec.json
  writeIfNew(path.join(dir, 'spec', 'play-spec.json'), JSON.stringify({ name: `${p.num}-${p.slug}`, version: '1.0.0', play: `${p.num}-${p.slug}`, description: p.desc, scale: 'dev', architecture: { pattern: p.pattern, data_flow: 'See README.md' }, config: { openai: 'config/openai.json', guardrails: 'config/guardrails.json' }, evaluation: { metrics: ['groundedness','relevance','coherence','fluency','safety'], thresholds: { groundedness: 4, relevance: 4, safety: 5 } }, waf_alignment: p.waf.reduce((a,w) => { a[w]='See README.md'; return a; }, {}) }, null, 2) + '\n');

  // evaluation/test-set.jsonl
  writeIfNew(path.join(dir, 'evaluation', 'test-set.jsonl'), `{"query": "What does this play do?", "expected": "${p.title} — ${p.desc.substring(0,80)}..."}\n{"query": "What Azure services are used?", "expected": "${p.services.join(', ')}"}\n{"query": "Which WAF pillars are covered?", "expected": "${p.waf.join(', ')}"}\n`);

  // infra/main.bicep
  writeIfNew(path.join(dir, 'infra', 'main.bicep'), `targetScope = 'resourceGroup'\n\n// ${p.title} — Azure Infrastructure\nparam location string = resourceGroup().location\n@allowed(['dev','staging','prod'])\nparam environment string = 'dev'\nparam projectName string = 'frootai-${p.slug}'\n@secure()\nparam openaiApiKey string = ''\nvar suffix = uniqueString(resourceGroup().id)\nvar tags = { environment: environment, project: 'frootai', play: '${p.num}-${p.slug}' }\n\nresource openai 'Microsoft.CognitiveServices/accounts@2024-10-01' = {\n  name: '\${projectName}-oai-\${suffix}'\n  location: location\n  kind: 'OpenAI'\n  sku: { name: 'S0' }\n  tags: tags\n  properties: { publicNetworkAccess: environment == 'prod' ? 'Disabled' : 'Enabled', customSubDomainName: '\${projectName}-oai-\${suffix}' }\n}\n\nresource caEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {\n  name: '\${projectName}-env-\${suffix}'\n  location: location\n  tags: tags\n  properties: { zoneRedundant: environment == 'prod' }\n}\n\noutput openaiEndpoint string = openai.properties.endpoint\noutput caEnvId string = caEnv.id\n`);

  // infra/parameters.json
  writeIfNew(path.join(dir, 'infra', 'parameters.json'), JSON.stringify({ '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#', contentVersion: '1.0.0.0', parameters: { location: { value: 'eastus2' }, environment: { value: 'dev' }, projectName: { value: `frootai-${p.slug}` } } }, null, 2) + '\n');

  // .github/agents (builder, reviewer, tuner)
  for (const role of ['builder','reviewer','tuner']) {
    const desc = role === 'builder' ? `Builds ${p.title} — implements ${p.pattern} using ${p.services[0]}.` : role === 'reviewer' ? `Reviews ${p.title} — checks WAF compliance and code quality.` : `Tunes ${p.title} — optimizes model parameters, guardrails, and cost.`;
    writeIfNew(path.join(dir, '.github', 'agents', `${role}.agent.md`), `---\ndescription: "${desc}"\n---\n\n# ${p.title} ${role[0].toUpperCase()+role.slice(1)}\n\nYou are the ${role} for **${p.title}**.\n\n## Context\n- Play: ${p.num}-${p.slug}\n- Pattern: ${p.pattern}\n- Services: ${p.services.join(', ')}\n- WAF: ${p.waf.join(', ')}\n\n## Knowledge\n${p.knowledge.map(k=>'- '+k).join('\n')}\n`);
  }

  // .github/instructions
  writeIfNew(path.join(dir, '.github', 'instructions', `${p.slug}-patterns.instructions.md`), `---\ndescription: "Coding patterns for ${p.title} — ${p.pattern} architecture, WAF-aligned."\napplyTo: "solution-plays/${p.num}-${p.slug}/**"\n---\n\n# ${p.title} Patterns\n\n## Architecture\n- Pattern: ${p.pattern}\n- Model: ${p.model}\n- Services: ${p.services.join(', ')}\n\n## Security\n- Use Managed Identity (DefaultAzureCredential)\n- Store secrets in Key Vault\n- Enable content safety\n\n## Reliability\n- Retry with exponential backoff\n- Set timeouts: 30s LLM, 10s search\n- Health check at /health\n\n## Cost\n- Set max_tokens on all LLM calls\n- Cache where possible\n- Monitor token usage\n`);

  // .github/prompts
  for (const pr of ['deploy','evaluate','review','test']) {
    const txt = pr === 'deploy' ? `Deploy ${p.title} to Azure.` : pr === 'evaluate' ? `Evaluate ${p.title} quality gates.` : pr === 'review' ? `Review ${p.title} WAF compliance.` : `Generate tests for ${p.title}.`;
    writeIfNew(path.join(dir, '.github', 'prompts', `${pr}.prompt.md`), `---\ndescription: "${pr[0].toUpperCase()+pr.slice(1)} ${p.title}"\n---\n\n${txt}\n\n## Context\n- Play: ${p.num}-${p.slug}\n- Model: ${p.model}\n- Services: ${p.services.join(', ')}\n`);
  }

  // .github/skills
  for (const sk of ['deploy','evaluate','tune']) {
    const skDesc = sk === 'deploy' ? `Deploy ${p.title} to Azure.` : sk === 'evaluate' ? `Evaluate ${p.title} quality.` : `Tune ${p.title} config.`;
    writeIfNew(path.join(dir, '.github', 'skills', `${sk}-${p.slug}`, 'SKILL.md'), `---\nname: "${sk}-${p.num}-${p.slug}"\ndescription: "${skDesc}"\n---\n\n# ${sk[0].toUpperCase()+sk.slice(1)} ${p.title}\n\n## Step 1: Prerequisites\n- Azure CLI logged in\n- ${p.services.join(', ')} access\n\n## Step 2: Execute\n${sk === 'deploy' ? '```bash\naz deployment group create -g rg-frootai-'+p.slug+' -f infra/main.bicep\n```' : sk === 'evaluate' ? '```bash\nnode engine/index.js solution-plays/'+p.num+'-'+p.slug+'/fai-manifest.json --eval\n```' : 'Adjust config/openai.json and config/guardrails.json.'}\n\n## Step 3: Verify\nConfirm results meet thresholds.\n`);
  }

  // .vscode
  writeIfNew(path.join(dir, '.vscode', 'mcp.json'), JSON.stringify({ servers: { frootai: { type: 'stdio', command: 'npx', args: ['frootai-mcp@latest'] } } }, null, 2) + '\n');
  writeIfNew(path.join(dir, '.vscode', 'settings.json'), JSON.stringify({ 'files.associations': { '*.agent.md': 'markdown', '*.instructions.md': 'markdown', '*.prompt.md': 'markdown' } }, null, 2) + '\n');

  // fai-manifest.json
  writeIfNew(path.join(dir, 'fai-manifest.json'), JSON.stringify({ play: `${p.num}-${p.slug}`, version: '1.0.0', context: { knowledge: p.knowledge, waf: p.waf, scope: `${p.slug}-solution` }, primitives: { agents: ['./.github/agents/builder.agent.md','./.github/agents/reviewer.agent.md','./.github/agents/tuner.agent.md'], instructions: [`./.github/instructions/${p.slug}-patterns.instructions.md`], skills: [`./.github/skills/deploy-${p.slug}/`,`./.github/skills/evaluate-${p.slug}/`,`./.github/skills/tune-${p.slug}/`], hooks: ['../../hooks/frootai-secrets-scanner/','../../hooks/frootai-tool-guardian/','../../hooks/frootai-governance-audit/'], guardrails: { groundedness: 0.85, coherence: 0.80, relevance: 0.80, safety: 0, costPerQuery: 0.05 } }, infrastructure: { bicep: './infra/main.bicep', parameters: './infra/parameters.json' }, toolkit: { devkit: '.github/', tunekit: 'config/', speckit: 'spec/' } }, null, 2) + '\n');

  // froot.json
  writeIfNew(path.join(dir, 'froot.json'), JSON.stringify({ name: `${p.num}-${p.slug}`, version: '1.0.0', framework: 'frootai', title: p.title, description: p.desc, complexity: 'Medium', tags: p.waf, status: 'Active', kits: { devkit: { path: '.github/', includes: ['agents','instructions','prompts','skills'] }, tunekit: { path: 'config/', files: ['openai.json','guardrails.json'] }, speckit: { path: 'spec/', files: ['play-spec.json'] } } }, null, 2) + '\n');

  // README.md
  const rdm = path.join(dir, 'README.md');
  if (!fs.existsSync(rdm) || fs.readFileSync(rdm,'utf8').length < 200) {
    fs.writeFileSync(rdm, `# Play ${p.num}: ${p.title}\n\n> ${p.desc}\n\n## Architecture\n| Component | Technology |\n|-----------|------------|\n${p.services.map(s=>`| ${s} | Production-grade |`).join('\n')}\n\n## WAF Alignment\n| Pillar | Implementation |\n|--------|---------------|\n${p.waf.map(w=>`| ${w} | See .github/instructions/ |`).join('\n')}\n\n## Quick Start\n\`\`\`bash\naz deployment group create -g rg-frootai-${p.slug} -f infra/main.bicep -p infra/parameters.json\nnode engine/index.js solution-plays/${p.num}-${p.slug}/fai-manifest.json --status\nnode engine/index.js solution-plays/${p.num}-${p.slug}/fai-manifest.json --eval\n\`\`\`\n\n## Knowledge: ${p.knowledge.join(', ')}\n`);
    created++;
  } else { skipped++; }
}

const total = fs.readdirSync(PLAYS_DIR).filter(f => /^\d{2}-/.test(f) && fs.statSync(path.join(PLAYS_DIR,f)).isDirectory()).length;
console.log(`\nCreated: ${created} files | Skipped: ${skipped} | TOTAL PLAYS: ${total}\n`);
