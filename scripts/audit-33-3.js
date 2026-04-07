const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory()).sort();
const checks = [
    { f: ".github/agents/builder.agent.md", min: 200, label: "builder.agent.md" },
    { f: ".github/agents/reviewer.agent.md", min: 200, label: "reviewer.agent.md" },
    { f: ".github/agents/tuner.agent.md", min: 200, label: "tuner.agent.md" },
    { f: ".github/copilot-instructions.md", min: 200, label: "copilot-instructions.md" },
    { f: ".github/prompts/deploy.prompt.md", min: 80, label: "deploy.prompt.md" },
    { f: ".github/prompts/evaluate.prompt.md", min: 80, label: "evaluate.prompt.md" },
    { f: ".github/prompts/review.prompt.md", min: 80, label: "review.prompt.md" },
    { f: ".github/prompts/test.prompt.md", min: 80, label: "test.prompt.md" },
    { f: ".github/workflows/ai-deploy.md", min: 60, label: "ai-deploy.md" },
    { f: ".github/workflows/ai-review.md", min: 60, label: "ai-review.md" },
    { f: "evaluation/eval.py", min: 200, label: "eval.py" },
    { f: "infra/main.bicep", min: 150, label: "main.bicep" },
    { f: "agent.md", min: 200, label: "agent.md (root)" },
    { f: "instructions.md", min: 200, label: "instructions.md (root)" },
    { f: "README.md", min: 200, label: "README.md" },
];

console.log("| File | Target | Exist | Miss | Min | Avg | Under Target | Status |");
console.log("|------|--------|-------|------|-----|-----|-------------|--------|");
for (const c of checks) {
    let exist = 0, miss = 0, lines = [];
    for (const p of plays) {
        const fp = path.join(dir, p, c.f);
        if (fs.existsSync(fp)) { exist++; lines.push(fs.readFileSync(fp, "utf8").split("\n").length); }
        else miss++;
    }
    const min = lines.length ? Math.min(...lines) : 0;
    const avg = lines.length ? Math.round(lines.reduce((a, b) => a + b, 0) / lines.length) : 0;
    const under = lines.filter(l => l < c.min).length;
    const icon = miss === 0 && under === 0 ? "✅" : miss > 20 || under > 20 ? "❌" : "⚠️";
    console.log(`| ${c.label} | ${c.min}+ | ${exist} | ${miss} | ${min} | ${avg} | ${under} | ${icon} |`);
}
