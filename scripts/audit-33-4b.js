const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory()).sort();

// Phase B batch tracker: check actual state of each step per batch
const batches = [
    { name: "B1", range: [1, 10] },
    { name: "B2", range: [11, 20] },
    { name: "B3", range: [21, 30] },
    { name: "B4", range: [31, 40] },
    { name: "B5", range: [41, 50] },
    { name: "B6", range: [51, 60] },
    { name: "B7", range: [61, 70] },
    { name: "B8", range: [71, 80] },
    { name: "B9", range: [81, 90] },
    { name: "B10", range: [91, 100] },
];

// Step definitions with file + min line target
const steps = [
    { name: "Step 1: Structure", check: "filecount", target: 40 },
    { name: "Step 2: Agents", files: [".github/agents/builder.agent.md", ".github/agents/reviewer.agent.md", ".github/agents/tuner.agent.md"], target: 150 },
    { name: "Step 3: Instructions", files: [".github/copilot-instructions.md", ".github/instructions/azure-coding.instructions.md", ".github/instructions/security.instructions.md"], target: 100 },
    { name: "Step 4: Prompts", files: [".github/prompts/deploy.prompt.md", ".github/prompts/evaluate.prompt.md", ".github/prompts/review.prompt.md", ".github/prompts/test.prompt.md"], target: 80 },
    { name: "Step 5: Skills/Wf", files: [".github/skills/deploy-azure/deploy.sh", ".github/skills/tune/tune-config.sh", ".github/workflows/ai-deploy.md", ".github/workflows/ai-review.md"], target: 40 },
    { name: "Step 6: Config", files: ["config/agents.json", "config/model-comparison.json", "config/openai.json"], target: 20 },
    { name: "Step 7: eval.py", files: ["evaluation/eval.py"], target: 100 },
    { name: "Step 8: Infra", files: ["infra/main.bicep"], target: 100 },
    { name: "Step 9: Root md", files: ["agent.md", "instructions.md", "README.md"], target: 100 },
];

function countFiles(d) {
    let c = 0;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (e.isFile()) c++; else if (e.isDirectory()) c += countFiles(path.join(d, e.name));
    }
    return c;
}

function lineCount(fp) {
    if (!fs.existsSync(fp)) return -1;
    return fs.readFileSync(fp, "utf8").split("\n").length;
}

console.log("=== PHASE B BATCH TRACKER — ACTUAL STATE ===\n");
console.log("| Batch | Plays | Files | Total Lines | " + steps.map(s => s.name.split(":")[0]).join(" | ") + " |");
console.log("|-------|-------|-------|-------------|" + steps.map(() => "------").join("|") + "|");

for (const b of batches) {
    const batchPlays = plays.filter(p => {
        const n = parseInt(p.split("-")[0]);
        return n >= b.range[0] && n <= b.range[1];
    });

    // File counts & total lines
    let totalFiles = 0, totalLines = 0;
    for (const p of batchPlays) {
        const pd = path.join(dir, p);
        totalFiles += countFiles(pd);
        // quick line count of all files
        function sumLines(d) {
            let s = 0;
            for (const e of fs.readdirSync(d, { withFileTypes: true })) {
                const fp = path.join(d, e.name);
                if (e.isFile()) { try { s += fs.readFileSync(fp, "utf8").split("\n").length; } catch (e) { } }
                else if (e.isDirectory()) s += sumLines(fp);
            }
            return s;
        }
        totalLines += sumLines(pd);
    }

    const stepResults = [];
    for (const step of steps) {
        if (step.check === "filecount") {
            const counts = batchPlays.map(p => countFiles(path.join(dir, p)));
            const minC = Math.min(...counts);
            stepResults.push(minC >= step.target ? "✅" : `⚠️${minC}`);
        } else {
            // Check: all files exist AND all meet min line target
            let allExist = true, allMeet = true, someExist = false;
            for (const p of batchPlays) {
                for (const f of step.files) {
                    const fp = path.join(dir, p, f);
                    if (!fs.existsSync(fp)) { allExist = false; }
                    else {
                        someExist = true;
                        const lc = fs.readFileSync(fp, "utf8").split("\n").length;
                        if (lc < step.target) allMeet = false;
                    }
                }
            }
            if (allExist && allMeet) stepResults.push("✅");
            else if (!someExist && !allExist) stepResults.push("❌");
            else if (allExist && !allMeet) stepResults.push("⚠️");
            else stepResults.push("🔶");
        }
    }

    const avgFiles = Math.round(totalFiles / batchPlays.length);
    const avgLines = Math.round(totalLines / batchPlays.length);
    console.log(`| ${b.name} | ${b.range[0]}-${b.range[1]} | ${avgFiles}/play | ${avgLines} avg | ${stepResults.join(" | ")} |`);
}

// Detailed step-by-step summary
console.log("\n=== STEP-BY-STEP LINE COUNT DETAILS ===\n");
for (const step of steps) {
    if (step.check === "filecount") continue;
    console.log(`--- ${step.name} (target: ${step.target}+ lines) ---`);
    for (const f of step.files) {
        const lines = [];
        let miss = 0;
        for (const p of plays) {
            const l = lineCount(path.join(dir, p, f));
            if (l === -1) miss++;
            else lines.push(l);
        }
        const min = lines.length ? Math.min(...lines) : 0;
        const max = lines.length ? Math.max(...lines) : 0;
        const avg = lines.length ? Math.round(lines.reduce((a, b) => a + b, 0) / lines.length) : 0;
        const under = lines.filter(l => l < step.target).length;
        console.log(`  ${f}: exist=${lines.length}, miss=${miss}, min=${min}, avg=${avg}, max=${max}, under=${under}`);
    }
}
