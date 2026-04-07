#!/usr/bin/env node
/**
 * audit-agents-s26-3.js — Section 26.3 Quality Checklist Audit
 * Checks every agent against all 10 criteria and reports failures.
 * Run: node scripts/audit-agents-s26-3.js
 */
const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, "..", "agents");
const agents = fs.readdirSync(dir).filter(f => f.endsWith(".agent.md")).sort();

console.log(`═══ Section 26.3 Quality Checklist Audit — ${agents.length} agents ═══\n`);

const results = { pass: 0, fail: 0, issues: [] };
const criteria = {
    lines200: { pass: 0, fail: 0, failures: [] },
    versionNumbers: { pass: 0, fail: 0, failures: [] },
    expertise10: { pass: 0, fail: 0, failures: [] },
    approach8: { pass: 0, fail: 0, failures: [] },
    guidelines15: { pass: 0, fail: 0, failures: [] },
    nonNeg5: { pass: 0, fail: 0, failures: [] },
    wafPillars: { pass: 0, fail: 0, failures: [] },
    playsListed: { pass: 0, fail: 0, failures: [] },
    toolsArray: { pass: 0, fail: 0, failures: [] },
    originalContent: { pass: 0, fail: 0, failures: [] },
};

for (const f of agents) {
    const fp = path.join(dir, f);
    const c = fs.readFileSync(fp, "utf8");
    const lines = c.split("\n").length;
    const agentIssues = [];

    // 1. 200+ lines minimum
    if (lines >= 200) criteria.lines200.pass++;
    else { criteria.lines200.fail++; criteria.lines200.failures.push(`${f}: ${lines}`); agentIssues.push(`lines=${lines} (<200)`); }

    // 2. Specific version numbers
    const hasVersions = /\d+\.\d+/.test(c) && (
        c.includes("React") || c.includes("Python") || c.includes(".NET") || c.includes("Node") ||
        c.includes("TypeScript") || c.includes("Java") || c.includes("Go ") || c.includes("Ruby") ||
        c.includes("Rust") || c.includes("Swift") || c.includes("Kotlin") || c.includes("PHP") ||
        c.includes("Angular") || c.includes("Vue") || c.includes("Svelte") || c.includes("gpt-4") ||
        c.includes("GPT") || c.includes("Azure") || c.includes("0.1") || c.includes("0.85") || c.includes("3.12")
    );
    if (hasVersions) criteria.versionNumbers.pass++;
    else { criteria.versionNumbers.fail++; criteria.versionNumbers.failures.push(f); agentIssues.push("no version numbers"); }

    // 3. 10+ expertise bullets
    const expertiseSection = c.match(/## Core Expertise\n\n([\s\S]*?)(?=\n## )/);
    const expertiseBullets = expertiseSection ? (expertiseSection[1].match(/^- /gm) || []).length : 0;
    if (expertiseBullets >= 10) criteria.expertise10.pass++;
    else { criteria.expertise10.fail++; criteria.expertise10.failures.push(`${f}: ${expertiseBullets}`); agentIssues.push(`expertise=${expertiseBullets} (<10)`); }

    // 4. 8+ approach principles
    const approachSection = c.match(/## Your Approach\n\n([\s\S]*?)(?=\n## )/);
    const approachItems = approachSection ? (approachSection[1].match(/^\d+\./gm) || []).length : 0;
    if (approachItems >= 8) criteria.approach8.pass++;
    else { criteria.approach8.fail++; criteria.approach8.failures.push(`${f}: ${approachItems}`); agentIssues.push(`approach=${approachItems} (<8)`); }

    // 5. 15+ guidelines
    const guidelinesSection = c.match(/## Guidelines\n\n([\s\S]*?)(?=\n## )/);
    const guidelineItems = guidelinesSection ? (guidelinesSection[1].match(/^\d+\./gm) || []).length : 0;
    if (guidelineItems >= 15) criteria.guidelines15.pass++;
    else { criteria.guidelines15.fail++; criteria.guidelines15.failures.push(`${f}: ${guidelineItems}`); agentIssues.push(`guidelines=${guidelineItems} (<15)`); }

    // 6. 5+ non-negotiable behaviors
    const nonNegSection = c.match(/## Non-Negotiable Behavior\n\n([\s\S]*?)(?=\n## )/);
    const nonNegItems = nonNegSection ? (nonNegSection[1].match(/^\d+\./gm) || []).length : 0;
    if (nonNegItems >= 5) criteria.nonNeg5.pass++;
    else { criteria.nonNeg5.fail++; criteria.nonNeg5.failures.push(`${f}: ${nonNegItems}`); agentIssues.push(`non-neg=${nonNegItems} (<5)`); }

    // 7. WAF pillar alignment
    const hasWaf = c.includes("## WAF Alignment") && (
        c.includes("### Security") || c.includes("### Reliability") || c.includes("### Cost")
    );
    if (hasWaf) criteria.wafPillars.pass++;
    else { criteria.wafPillars.fail++; criteria.wafPillars.failures.push(f); agentIssues.push("no WAF section"); }

    // 8. Compatible plays listed
    const hasPlays = c.includes("## Compatible Solution Plays") || c.includes("## Compatible Plays");
    if (hasPlays) criteria.playsListed.pass++;
    else { criteria.playsListed.fail++; criteria.playsListed.failures.push(f); agentIssues.push("no plays section"); }

    // 9. tools array in frontmatter
    const hasTools = c.match(/^tools:\s*\n\s+-/m) || c.match(/^tools:\s*\[/m);
    if (hasTools) criteria.toolsArray.pass++;
    else { criteria.toolsArray.fail++; criteria.toolsArray.failures.push(f); agentIssues.push("no tools in frontmatter"); }

    // 10. Original content (check it's not just template — has domain-specific bullets)
    const hasDomainContent = expertiseBullets >= 4 && c.length > 5000;
    if (hasDomainContent) criteria.originalContent.pass++;
    else { criteria.originalContent.fail++; criteria.originalContent.failures.push(f); agentIssues.push("possibly generic content"); }

    if (agentIssues.length === 0) results.pass++;
    else { results.fail++; results.issues.push({ agent: f, issues: agentIssues }); }
}

// Report
console.log("═══ CHECKLIST RESULTS ═══\n");
console.log(`| # | Criterion | Pass | Fail | Rate |`);
console.log(`|---|-----------|------|------|------|`);
const labels = [
    ["1", "200+ lines minimum", criteria.lines200],
    ["2", "Version numbers present", criteria.versionNumbers],
    ["3", "10+ expertise bullets", criteria.expertise10],
    ["4", "8+ approach principles", criteria.approach8],
    ["5", "15+ specific guidelines", criteria.guidelines15],
    ["6", "5+ non-negotiable behaviors", criteria.nonNeg5],
    ["7", "WAF pillar alignment", criteria.wafPillars],
    ["8", "Compatible plays listed", criteria.playsListed],
    ["9", "tools array in frontmatter", criteria.toolsArray],
    ["10", "Original domain content", criteria.originalContent],
];
for (const [num, label, c] of labels) {
    const rate = Math.round(c.pass / (c.pass + c.fail) * 100);
    const icon = c.fail === 0 ? "✅" : c.fail <= 5 ? "⚠️" : "❌";
    console.log(`| ${num} | ${label} | ${c.pass} | ${c.fail} | ${icon} ${rate}% |`);
}

console.log(`\n═══ AGENT SUMMARY ═══`);
console.log(`  All criteria pass: ${results.pass}/${agents.length} (${Math.round(results.pass / agents.length * 100)}%)`);
console.log(`  Has issues: ${results.fail}/${agents.length}`);

// Show failures if any
for (const [num, label, c] of labels) {
    if (c.fail > 0) {
        console.log(`\n--- Criterion ${num}: ${label} (${c.fail} failures) ---`);
        c.failures.slice(0, 10).forEach(f => console.log(`  ✗ ${f}`));
        if (c.failures.length > 10) console.log(`  ... and ${c.failures.length - 10} more`);
    }
}
