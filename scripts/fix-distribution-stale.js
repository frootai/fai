// Fix all remaining stale references across distribution channels
const fs = require("fs");

const files = [
    "vscode-extension/package.json",
    "vscode-extension/src/extension.js",
    "mcp-server/package.json",
    "mcp-server/index.js",
    "mcp-server/cli.js",
    "mcp-server/Dockerfile",
    "python-sdk/pyproject.toml",
    "python-sdk/frootai/client.py",
    "python-mcp/pyproject.toml",
];

const replacements = [
    [/780\+ primitives/g, "830+ primitives"],
    [/780\+ FAI primitives/g, "830+ FAI primitives"],
    [/780\+ agents/g, "830+ agents"],
    [/780\+/g, "830+"],
    [/\b22 MCP tools\b/g, "25 MCP tools"],
    [/\b22 MCP\b/g, "25 MCP"],
    [/\b22 tools\b/g, "25 tools"],
    [/\b201 agents\b/g, "238 agents"],
    [/\b282 skills\b/g, "322 skills"],
    [/\b68 solution plays\b/gi, "100 solution plays"],
    [/\b68 plays\b/gi, "100 plays"],
    [/\b20 solution plays\b/gi, "100 solution plays"],
];

let totalChanges = 0;
const changedFiles = [];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, "utf8");
    let changed = false;
    let fileChanges = 0;

    for (const [pattern, replacement] of replacements) {
        const matches = content.match(pattern);
        if (matches) {
            content = content.replace(pattern, replacement);
            fileChanges += matches.length;
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(file, content);
        changedFiles.push({ file, changes: fileChanges });
        totalChanges += fileChanges;
    }
}

console.log(`Files changed: ${changedFiles.length}`);
console.log(`Total replacements: ${totalChanges}`);
changedFiles.forEach(f => console.log(`  ${f.file}: ${f.changes} changes`));

// Verify
console.log("\n=== VERIFICATION ===");
for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, "utf8");
    const stale = (content.match(/780\+/g) || []).length +
        (content.match(/\b22 tools\b/g) || []).length +
        (content.match(/\b22 MCP\b/g) || []).length +
        (content.match(/\b201 agents?\b/g) || []).length +
        (content.match(/\b282 skills?\b/g) || []).length +
        (content.match(/\b68 (solution )?plays?\b/gi) || []).length +
        (content.match(/\b20 solution plays?\b/gi) || []).length;
    if (stale) console.log(`  ⚠️ ${file}: ${stale} stale remaining`);
}
console.log("Done.");
