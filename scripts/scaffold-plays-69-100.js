#!/usr/bin/env node
/**
 * scaffold-plays-69-100.js
 * Generates the full .github DevKit, config, infra, evaluation, spec, and froot.json
 * for solution plays 69-100 (32 plays that only have fai-manifest.json + README.md).
 *
 * Run: node scripts/scaffold-plays-69-100.js
 */
const fs = require("fs");
const path = require("path");

const PLAYS_DIR = path.resolve(__dirname, "..", "solution-plays");

// Read each play's fai-manifest.json to extract metadata
function readManifest(playDir) {
    const mp = path.join(playDir, "fai-manifest.json");
    if (!fs.existsSync(mp)) return null;
    return JSON.parse(fs.readFileSync(mp, "utf8"));
}

// Friendly name from slug: "69-carbon-footprint-tracker" → "Carbon Footprint Tracker"
function friendlyName(slug) {
    return slug.replace(/^\d+-/, "").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

// Short slug without number: "69-carbon-footprint-tracker" → "carbon-footprint-tracker"
function shortSlug(slug) {
    return slug.replace(/^\d+-/, "");
}

// Extract services from manifest context or README
function getServices(manifest, readmePath) {
    // Try to pull from README
    if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, "utf8");
        // Look for "Azure ..." or "Services:" lines
        const svcMatch = readme.match(/(?:Services|Infrastructure|Azure)[:\s]*([^\n]+)/i);
        if (svcMatch) return svcMatch[1].trim();
    }
    // Fallback from WAF pillars
    return "Azure OpenAI, Azure Functions, Azure Cosmos DB, Azure Monitor";
}

function scaffold(playDir) {
    const slug = path.basename(playDir);
    const num = slug.match(/^(\d+)/)[1];
    const name = friendlyName(slug);
    const short = shortSlug(slug);
    const manifest = readManifest(playDir);
    if (!manifest) { console.log(`  SKIP ${slug} — no fai-manifest.json`); return 0; }

    const waf = (manifest.context && manifest.context.waf) || ["security", "reliability"];
    const knowledge = (manifest.context && manifest.context.knowledge) || ["F1-GenAI-Foundations"];
    const scope = (manifest.context && manifest.context.scope) || `${short}-solution`;
    const guardrails = (manifest.primitives && manifest.primitives.guardrails) || {};
    const readmePath = path.join(playDir, "README.md");
    const services = getServices(manifest, readmePath);

    let created = 0;
    function writeIfMissing(relPath, content) {
        const full = path.join(playDir, relPath);
        if (fs.existsSync(full)) return;
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, content);
        created++;
    }

    // ─── .github/agents ───
    for (const role of ["builder", "reviewer", "tuner"]) {
        const verb = role === "builder" ? "Builds" : role === "reviewer" ? "Reviews" : "Tunes";
        writeIfMissing(`.github/agents/${role}.agent.md`,
            `---
description: "${verb} ${name}."
---
# ${name} ${role.charAt(0).toUpperCase() + role.slice(1)}
You are the ${role} for **${name}**.
## Context
- Play: ${slug}
- Services: ${services}
- WAF: ${waf.join(", ")}
## Knowledge
${knowledge.map(k => `- ${k}`).join("\n")}
`);
    }

    // ─── .github/instructions ───
    writeIfMissing(`.github/instructions/${short}-patterns.instructions.md`,
        `---
description: "Coding patterns for ${name}."
applyTo: "solution-plays/${slug}/**"
---
# ${name} Patterns
- Pattern: ${short}
- Model: gpt-4o-mini
- Services: ${services}
## Security
- DefaultAzureCredential, Key Vault, content safety
## Reliability
- Retry with backoff, timeouts, health checks
## Cost
- max_tokens, caching, right-sized SKUs
`);

    // ─── .github/prompts ───
    for (const action of ["deploy", "evaluate", "review", "test"]) {
        writeIfMissing(`.github/prompts/${action}.prompt.md`,
            `---
description: "${action.charAt(0).toUpperCase() + action.slice(1)} ${name}"
---
${action.charAt(0).toUpperCase() + action.slice(1)} ${name}.
- Play: ${slug}
- Model: gpt-4o-mini
`);
    }

    // ─── .github/skills ───
    for (const skill of ["deploy", "evaluate", "tune"]) {
        const skillDir = `${skill}-${short}`;
        const verb = skill === "deploy" ? "Deploy" : skill === "evaluate" ? "Evaluate" : "Tune";
        const body = skill === "deploy"
            ? `az deployment group create -g rg-frootai-${short} -f infra/main.bicep`
            : skill === "evaluate"
                ? `node engine/index.js solution-plays/${slug}/fai-manifest.json --eval`
                : `Adjust config/openai.json.`;
        writeIfMissing(`.github/skills/${skillDir}/SKILL.md`,
            `---
name: "${skill}-${num}-${short}"
description: "${verb} ${name}."
---
# ${verb} ${name}
## Step 1: Prerequisites
- Azure CLI, required Azure service access
## Step 2: Execute
${body}
## Step 3: Verify
`);
    }

    // ─── .vscode ───
    writeIfMissing(`.vscode/mcp.json`, JSON.stringify({
        servers: { frootai: { type: "stdio", command: "npx", args: ["frootai-mcp@latest"] } }
    }, null, 2));

    writeIfMissing(`.vscode/settings.json`, JSON.stringify({
        "files.associations": {
            "*.agent.md": "markdown",
            "*.instructions.md": "markdown",
            "*.prompt.md": "markdown"
        }
    }, null, 2));

    // ─── config ───
    writeIfMissing(`config/openai.json`, JSON.stringify({
        model: "gpt-4o-mini",
        api_version: "2024-12-01-preview",
        temperature: 0.1,
        top_p: 0.9,
        max_tokens: 1000,
        seed: 42
    }, null, 2));

    writeIfMissing(`config/guardrails.json`, JSON.stringify({
        content_safety: { enabled: true, categories: ["hate", "self_harm", "sexual", "violence"], severity_threshold: 2, action: "block" },
        pii_detection: { enabled: true, categories: ["email", "phone", "ssn", "credit_card"], action: "redact" },
        prompt_injection: { enabled: true, action: "block" },
        business_rules: { max_response_tokens: 1000, require_citations: true, min_confidence_to_answer: 0.7 }
    }, null, 2));

    // ─── evaluation ───
    const readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";
    const descMatch = readme.match(/^#[^\n]*\n+([^\n]+)/);
    const desc = descMatch ? descMatch[1].trim().substring(0, 100) : name;
    writeIfMissing(`evaluation/test-set.jsonl`,
        `{"query":"What does this play do?","expected":"${name} — ${desc}"}
{"query":"Azure services?","expected":"${services}"}
`);

    // ─── infra ───
    writeIfMissing(`infra/main.bicep`,
        `targetScope = 'resourceGroup'
param location string = resourceGroup().location
@allowed(['dev','staging','prod'])
param environment string = 'dev'
param projectName string = 'frootai-${short}'
@secure()
param openaiApiKey string = ''
var suffix = uniqueString(resourceGroup().id)
var tags = { environment: environment, project: 'frootai', play: '${slug}' }
resource openai 'Microsoft.CognitiveServices/accounts@2024-10-01' = { name: '\${projectName}-oai-\${suffix}', location: location, kind: 'OpenAI', sku: { name: 'S0' }, tags: tags, properties: { publicNetworkAccess: environment == 'prod' ? 'Disabled' : 'Enabled', customSubDomainName: '\${projectName}-oai-\${suffix}' } }
resource caEnv 'Microsoft.App/managedEnvironments@2024-03-01' = { name: '\${projectName}-env-\${suffix}', location: location, tags: tags, properties: { zoneRedundant: environment == 'prod' } }
output openaiEndpoint string = openai.properties.endpoint
`);

    writeIfMissing(`infra/parameters.json`, JSON.stringify({
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
        contentVersion: "1.0.0.0",
        parameters: {
            location: { value: "eastus2" },
            environment: { value: "dev" },
            projectName: { value: `frootai-${short}` }
        }
    }, null, 2));

    // ─── spec ───
    writeIfMissing(`spec/play-spec.json`, JSON.stringify({
        name: slug,
        version: "1.0.0",
        description: desc,
        scale: "dev",
        architecture: { pattern: short },
        evaluation: {
            metrics: ["groundedness", "relevance", "coherence", "safety"],
            thresholds: { groundedness: 4, relevance: 4, safety: 5 }
        },
        waf_alignment: Object.fromEntries(waf.map(w => [w, "See README"]))
    }, null, 2));

    // ─── froot.json ───
    writeIfMissing(`froot.json`, JSON.stringify({
        name: slug,
        version: "1.0.0",
        framework: "frootai",
        title: name,
        description: desc,
        complexity: guardrails.groundedness >= 0.9 ? "Very High" : guardrails.groundedness >= 0.85 ? "High" : "Medium",
        tags: waf,
        status: "Active",
        kits: {
            devkit: { path: ".github/", includes: ["agents", "instructions", "prompts", "skills"] },
            tunekit: { path: "config/", files: ["openai.json", "guardrails.json"] },
            speckit: { path: "spec/", files: ["play-spec.json"] }
        }
    }, null, 2));

    return created;
}

// ─── MAIN ───
console.log("═══ Scaffolding plays 69-100 ═══\n");

let totalCreated = 0;
let playsProcessed = 0;

const dirs = fs.readdirSync(PLAYS_DIR)
    .filter(d => {
        const m = d.match(/^(\d+)-/);
        return m && parseInt(m[1]) >= 69 && parseInt(m[1]) <= 100;
    })
    .sort();

for (const dir of dirs) {
    const playPath = path.join(PLAYS_DIR, dir);
    if (!fs.statSync(playPath).isDirectory()) continue;

    const fileCount = fs.readdirSync(playPath, { recursive: true }).length;
    const created = scaffold(playPath);
    totalCreated += created;
    playsProcessed++;
    console.log(`  ✅ ${dir} — ${created} files created`);
}

console.log(`\n═══ COMPLETE ═══`);
console.log(`  Plays processed: ${playsProcessed}`);
console.log(`  Files created: ${totalCreated}`);
console.log(`  Expected ~20 files per play × ${playsProcessed} plays = ~${playsProcessed * 20}`);
