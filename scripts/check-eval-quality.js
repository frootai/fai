const fs = require("fs");
const samples = ["01-enterprise-rag", "21-agentic-rag", "50-fraud-detection-ai", "69-carbon-tracking-ai", "100-fai-meta-agent"];
for (const p of samples) {
    const fp = "solution-plays/" + p + "/evaluation/eval.py";
    if (!fs.existsSync(fp)) { console.log(p + ": MISSING"); continue; }
    const c = fs.readFileSync(fp, "utf8");
    const checks = {
        lines: c.split("\n").length,
        docstring: c.includes('"""'),
        argparse: c.includes("argparse"),
        main: c.includes("def main"),
        relevance: c.includes("relevance"),
        groundedness: c.includes("groundedness"),
        coherence: c.includes("coherence"),
        safety: c.includes("safety"),
        ci_gate: c.includes("sys.exit"),
        report: c.includes("report"),
        compare: c.includes("compare"),
        dataclass: c.includes("@dataclass"),
        logging: c.includes("logging"),
    };
    const passed = Object.entries(checks).filter(([k, v]) => v === true || (k === "lines" && v >= 200)).length;
    const total = Object.keys(checks).length;
    console.log(p + ": " + checks.lines + " lines, " + passed + "/" + total + " checks pass");
    Object.entries(checks).forEach(([k, v]) => {
        if (k === "lines") return;
        console.log("  " + (v ? "✅" : "❌") + " " + k);
    });
    console.log("");
}
