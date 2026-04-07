// Compliance review: Check healthcare (46) and government (84-86) plays
// for HIPAA, HITRUST, FedRAMP, and security compliance markers
const fs = require("fs"), path = require("path");
const dir = "solution-plays";

const compliancePlays = [
    { id: "46", name: "healthcare-ai-clinical", reqs: ["HIPAA", "HITRUST", "PHI handling", "BAA", "audit logging"] },
    { id: "84", name: "government-citizen-services", reqs: ["FedRAMP", "FISMA", "IL4/IL5", "FIPS 140-2", "Azure Government"] },
    { id: "85", name: "government-policy-analysis", reqs: ["FedRAMP", "data sovereignty", "classified handling", "access controls"] },
    { id: "86", name: "government-public-safety", reqs: ["CJIS", "FedRAMP", "real-time data", "PII protection", "audit trail"] },
];

console.log("=== COMPLIANCE REVIEW ===\n");

for (const play of compliancePlays) {
    const playDir = fs.readdirSync(dir).find(d => d.startsWith(play.id + "-"));
    if (!playDir) { console.log(`❌ Play ${play.id} not found`); continue; }

    const fullDir = path.join(dir, playDir);
    console.log(`\n--- Play ${play.id}: ${playDir} ---`);

    // Check key files for compliance content
    const checkFiles = [
        ".github/copilot-instructions.md",
        ".github/instructions/security.instructions.md",
        "README.md",
        "agent.md",
        "config/guardrails.json",
        "infra/main.bicep",
    ];

    for (const file of checkFiles) {
        const fp = path.join(fullDir, file);
        if (!fs.existsSync(fp)) { console.log(`  ⚠️ ${file}: MISSING`); continue; }
        const content = fs.readFileSync(fp, "utf8").toLowerCase();
        const found = play.reqs.filter(r => content.includes(r.toLowerCase()));
        const missing = play.reqs.filter(r => !content.includes(r.toLowerCase()));
        if (missing.length > 0) {
            console.log(`  ⚠️ ${file}: Missing compliance refs: ${missing.join(", ")}`);
        } else {
            console.log(`  ✅ ${file}: All ${play.reqs.length} compliance refs present`);
        }
    }
}
