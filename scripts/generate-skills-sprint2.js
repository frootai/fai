#!/usr/bin/env node
/** Skills Sprint 2 — Per-play skills + additional to cross 280 */
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');
const D = join(__dirname, '..', 'skills');
let c = 0;
function mk(n, d) {
    const dir = join(D, n), f = join(dir, 'SKILL.md');
    if (existsSync(f)) return;
    mkdirSync(dir, { recursive: true });
    writeFileSync(f, `---\nname: ${n}\ndescription: '${d}'\n---\n\n# ${n.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')}\n\n${d}\n`);
    c++;
}

// Per-play deploy skills (23)
const plays = ['01-enterprise-rag', '02-ai-landing-zone', '03-deterministic-agent', '04-call-center-voice-ai', '05-it-ticket-resolution', '06-document-intelligence', '07-multi-agent-service', '08-copilot-studio-bot', '09-ai-search-portal', '10-content-moderation', '11-ai-landing-zone-advanced', '12-model-serving-aks', '13-fine-tuning-workflow', '14-cost-optimized-ai-gateway', '15-multi-modal-docproc', '16-copilot-teams-extension', '17-ai-observability', '18-prompt-management', '19-edge-ai-phi4', '20-anomaly-detection', '21-agentic-rag', '22-multi-agent-swarm', '23-browser-automation-agent'];
for (const p of plays) {
    mk(`frootai-deploy-${p}`, `Deploys Play ${p} to Azure with Bicep validation, what-if check, and post-deploy health verification.`);
    mk(`frootai-evaluate-${p}`, `Runs quality evaluation for Play ${p} against fai-manifest.json guardrails — groundedness, coherence, safety.`);
    mk(`frootai-tune-${p}`, `Tunes configuration for Play ${p} — model selection, token budgets, guardrail thresholds, cost optimization.`);
}

// Additional Build skills
mk('frootai-build-docker-image', 'Builds optimized Docker images with multi-stage, non-root, and AI model weight caching.');
mk('frootai-build-kubernetes-manifest', 'Generates Kubernetes manifests with GPU scheduling, health probes, and autoscaling.');
mk('frootai-build-github-workflow', 'Creates GitHub Actions workflows with matrix testing, SHA-pinned actions, and quality gates.');
mk('frootai-build-terraform-module', 'Creates Terraform modules with variables, outputs, examples, and testing configuration.');
mk('frootai-build-bicep-module', 'Creates Bicep modules with AVM patterns, parameters, outputs, and deployment tests.');
mk('frootai-build-unit-test', 'Generates unit tests for any language — detects framework and applies appropriate patterns.');
mk('frootai-build-integration-test', 'Generates integration tests with real service connections, test containers, and cleanup.');
mk('frootai-build-test-harness', 'Creates test infrastructure with fixtures, factories, mocks, and test data generators.');

console.log(`Created: ${c} new skills`);
