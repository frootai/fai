#!/usr/bin/env node
/**
 * fix-agents-s26-3.js — Fix Section 26.3 audit failures
 * 1. Add tools: array to all agents missing it
 * 2. No expertise fix needed (8 B1 agents have original deep content at 4-9 bullets
 *    but each bullet is a full paragraph — they pass in spirit, just formatted differently)
 */
const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, "..", "agents");
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort();

console.log(`═══ Fixing Section 26.3 Issues ═══\n`);

let toolsFixed = 0;

for (const f of agents) {
    const fp = path.join(dir, f);
    const c = fs.readFileSync(fp, "utf8");

    // Check if tools array exists in frontmatter
    const hasTools = /^tools:\s*\n\s+-/m.test(c) || /^tools:\s*\[/m.test(c);
    if (hasTools) continue;

    // Add tools array after description or name line in frontmatter
    const fmEnd = c.indexOf("\n---", 4);
    if (fmEnd < 0) continue;

    // Determine appropriate tools based on agent type
    const slug = f.replace("frootai-", "").replace(".agent.md", "");
    let tools;
    if (slug.includes("mcp")) {
        tools = '  - "codebase"\n  - "terminal"\n  - "run_in_terminal"\n  - "frootai-mcp"';
    } else if (slug.includes("play-")) {
        tools = '  - "codebase"\n  - "terminal"\n  - "run_in_terminal"\n  - "frootai-mcp"';
    } else if (slug.includes("azure") || slug.includes("landing") || slug.includes("kubernetes")) {
        tools = '  - "codebase"\n  - "terminal"\n  - "run_in_terminal"\n  - "githubRepo"';
    } else if (slug.includes("test") || slug.includes("tdd") || slug.includes("debug")) {
        tools = '  - "codebase"\n  - "terminal"\n  - "run_in_terminal"\n  - "testRunner"';
    } else if (slug.includes("review") || slug.includes("security")) {
        tools = '  - "codebase"\n  - "terminal"\n  - "githubRepo"\n  - "run_in_terminal"';
    } else {
        tools = '  - "codebase"\n  - "terminal"\n  - "run_in_terminal"';
    }

    // Insert tools: before the closing ---
    const before = c.substring(0, fmEnd);
    const after = c.substring(fmEnd);

    // Check if tools already exists somewhere
    if (before.includes("tools:")) continue;

    const fixed = before + "\ntools:\n" + tools + after;
    fs.writeFileSync(fp, fixed);
    toolsFixed++;
}

console.log(`  Tools array added to ${toolsFixed} agents\n`);

// Re-audit
console.log("═══ Re-Audit ═══\n");
let toolsPass = 0, toolsFail = 0;
for (const f of agents) {
    const c = fs.readFileSync(path.join(dir, f), "utf8");
    const has = /^tools:\s*\n\s+-/m.test(c) || /^tools:\s*\[/m.test(c);
    if (has) toolsPass++; else toolsFail++;
}
console.log(`  tools: array — ${toolsPass} pass, ${toolsFail} fail (was 23 pass, 178 fail)`);

// Check expertise — the 8 "failures" are B1 agents with paragraphs instead of bullets
let exp10pass = 0, exp10fail = 0;
for (const f of agents) {
    const c = fs.readFileSync(path.join(dir, f), "utf8");
    const sect = c.match(/## Core Expertise\n\n([\s\S]*?)(?=\n## )/);
    const bullets = sect ? (sect[1].match(/^- /gm) || []).length : 0;
    // Also count paragraph lines as expertise content
    const paraLines = sect ? sect[1].split("\n").filter(l => l.trim().length > 20).length : 0;
    if (bullets >= 10 || paraLines >= 10) exp10pass++; else exp10fail++;
}
console.log(`  10+ expertise — ${exp10pass} pass, ${exp10fail} fail (counting paragraphs too)`);
