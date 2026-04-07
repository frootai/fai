const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory()).sort();

// Phase A: 21 files that should now exist in plays 21-100
const phaseAFiles = [
    ".github/copilot-instructions.md",
    ".github/hooks/guardrails.json",
    ".github/instructions/azure-coding.instructions.md",
    ".github/instructions/security.instructions.md",
    ".github/skills/deploy-azure/deploy.sh",
    ".github/skills/tune/tune-config.sh",
    ".github/workflows/ai-deploy.md",
    ".github/workflows/ai-review.md",
    "config/agents.json",
    "config/chunking.json",
    "config/model-comparison.json",
    "config/search.json",
    "evaluation/eval.py",
    "infra/main.json",
    "mcp/index.js",
    "plugins/README.md",
    "agent.md",
    "CHANGELOG.md",
    "instructions.md",
    "plugin.json",
];

// 1. File count per play (all tiers)
console.log("=== FILE COUNT PER PLAY ===");
const tiers = { "T1 (01-20)": [], "T2 (21-68)": [], "T3 (69-100)": [] };
for (const p of plays) {
    const num = parseInt(p.split("-")[0]);
    const count = countFiles(path.join(dir, p));
    const tier = num <= 20 ? "T1 (01-20)" : num <= 68 ? "T2 (21-68)" : "T3 (69-100)";
    tiers[tier].push({ play: p.substring(0, 25), count });
}
for (const [tier, data] of Object.entries(tiers)) {
    const counts = data.map(d => d.count);
    const min = Math.min(...counts), max = Math.max(...counts);
    const avg = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length);
    console.log(`${tier}: min=${min}, max=${max}, avg=${avg}, plays=${counts.length}`);
}

// 2. Phase A file-by-file check for plays 21-100
console.log("\n=== PHASE A FILE CHECK (plays 21-100) ===");
console.log("| File | Present | Missing | % |");
console.log("|------|---------|---------|---|");
const p21_100 = plays.filter(p => parseInt(p.split("-")[0]) >= 21);
for (const f of phaseAFiles) {
    let present = 0, missing = 0;
    for (const p of p21_100) {
        if (fs.existsSync(path.join(dir, p, f))) present++; else missing++;
    }
    const pct = Math.round(present / p21_100.length * 100);
    const icon = pct === 100 ? "✅" : pct >= 80 ? "⚠️" : "❌";
    console.log(`| ${f} | ${present} | ${missing} | ${pct}% ${icon} |`);
}

// 3. Phase A file check for plays 01-20 (reference tier)
console.log("\n=== T1 FILE CHECK (plays 01-20, reference) ===");
console.log("| File | Present | Missing |");
console.log("|------|---------|---------|");
const p01_20 = plays.filter(p => parseInt(p.split("-")[0]) <= 20);
for (const f of phaseAFiles) {
    let present = 0, missing = 0;
    for (const p of p01_20) {
        if (fs.existsSync(path.join(dir, p, f))) present++; else missing++;
    }
    console.log(`| ${f} | ${present} | ${missing} |`);
}

// 4. Show plays with lowest file counts
console.log("\n=== LOWEST FILE COUNT PLAYS ===");
const all = plays.map(p => ({ play: p, count: countFiles(path.join(dir, p)) })).sort((a, b) => a.count - b.count);
for (const a of all.slice(0, 10)) console.log(`  ${a.play}: ${a.count} files`);
console.log("...");
for (const a of all.slice(-5)) console.log(`  ${a.play}: ${a.count} files`);

function countFiles(d) {
    let c = 0;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isFile()) c++; else if (e.isDirectory()) c += countFiles(path.join(d, e.name));
    }
    return c;
}
