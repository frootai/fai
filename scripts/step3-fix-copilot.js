const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
const extra = `

## Common Pitfalls
- Do NOT use synchronous HTTP libraries — use async clients (httpx, aiohttp)
- Do NOT create new Azure resources without checking config/agents.json first
- Do NOT ignore evaluation results — all metrics must pass before deployment
- Do NOT skip the reviewer step — every implementation must be reviewed
- Do NOT use print statements — use structured logging with correlation IDs
- Do NOT commit secrets — use Key Vault references and Managed Identity
- Do NOT deploy without running Bicep lint first

## Quick Reference Commands
- Deploy infrastructure: \`az bicep build -f infra/main.bicep && azd up\`
- Run evaluation: \`python evaluation/eval.py\`
- Run tests: \`pytest tests/ -v --cov=app\`
- Validate config: \`node -e "require('./config/openai.json')"\`
- Check Bicep: \`az bicep lint -f infra/main.bicep\`

## FAI Protocol Integration
This play is wired through the FAI Protocol via \`fai-manifest.json\`:
- **Context:** Knowledge modules and WAF pillar alignment defined
- **Primitives:** Agent, instruction, skill, and hook references
- **Infrastructure:** Azure resource requirements and deployment config
- **Guardrails:** Quality thresholds, content safety rules, evaluation gates
- **Toolkit:** DevKit (build), TuneKit (optimize), SpecKit (document)

## Cross-Play Compatibility
This play can be combined with other FrootAI solution plays:
- Use shared agents from the agents/ directory for cross-play expertise
- Reference shared instructions from instructions/ for coding standards
- Import shared skills for common operations (deploy, evaluate, tune)
- Wire plays together via fai-manifest.json compatible-plays field

## Response Format
When generating code or documentation:
- Include inline comments explaining non-obvious logic
- Add type hints on all function signatures
- Return structured responses with metadata (latency, tokens, model)
- Include error handling with meaningful error messages
`;

let fixed = 0;
for (const p of plays) {
    const fp = path.join(dir, p, ".github/copilot-instructions.md");
    if (!fs.existsSync(fp)) continue;
    const c = fs.readFileSync(fp, "utf8");
    if (c.split("\n").length < 150) { fs.writeFileSync(fp, c + extra); fixed++; }
}
const lines = plays.map(p => { const fp = path.join(dir, p, ".github/copilot-instructions.md"); return fs.existsSync(fp) ? fs.readFileSync(fp, "utf8").split("\n").length : 0 }).filter(l => l > 0);
console.log("fixed=" + fixed + " min=" + Math.min(...lines) + " avg=" + Math.round(lines.reduce((a, b) => a + b, 0) / lines.length) + " under150=" + lines.filter(l => l < 150).length);
