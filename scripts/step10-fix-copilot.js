const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
const extra = `

## Prompt Engineering Guidelines
When crafting prompts for this solution:
- Use clear delimiters between context, instructions, and user query
- Include few-shot examples for complex tasks
- Specify output format explicitly (JSON schema, markdown, bullet points)
- Set persona context at the beginning of the system prompt
- Include guardrails in system prompt: do not hallucinate, cite sources
- Keep system prompts under 2000 tokens for optimal latency
- Version-control all prompts alongside application code

## Troubleshooting Quick Reference
| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| 401 Unauthorized | Managed Identity not configured | Check RBAC role assignments |
| 429 Too Many Requests | Rate limit exceeded | Implement retry with backoff |
| 404 Model Not Found | Wrong deployment name | Verify openai.json deployment_name |
| Content blocked | Safety threshold triggered | Review guardrails.json thresholds |
| Slow responses | No caching, large max_tokens | Enable cache, reduce max_tokens |
| Evaluation fails | Config mismatch | Ensure eval.py reads config/guardrails.json |
| Bicep errors | Missing parameters | Check parameters.json completeness |
| Health check 503 | Missing env vars | Verify app settings match config needs |

## Environment Variables
Required environment variables for this solution:
| Variable | Description | Example |
|----------|-------------|---------|
| AZURE_OPENAI_ENDPOINT | OpenAI service endpoint | https://oai-frootai-prod.openai.azure.com/ |
| AZURE_KEY_VAULT_URL | Key Vault URI | https://kv-frootai-xxx.vault.azure.net/ |
| APPLICATIONINSIGHTS_CONNECTION_STRING | App Insights connection | InstrumentationKey=xxx |
| AZURE_STORAGE_ACCOUNT | Storage account name | stfrootaiprod |
| ENVIRONMENT | Deployment environment | dev, staging, prod |
`;

let f = 0;
for (const p of plays) {
    const fp = path.join(dir, p, ".github/copilot-instructions.md");
    if (fs.existsSync(fp) && fs.readFileSync(fp, "utf8").split("\n").length < 200) {
        fs.writeFileSync(fp, fs.readFileSync(fp, "utf8") + extra);
        f++;
    }
}
const lines = plays.map(p => { const fp = path.join(dir, p, ".github/copilot-instructions.md"); return fs.existsSync(fp) ? fs.readFileSync(fp, "utf8").split("\n").length : 0 }).filter(l => l > 0);
console.log("fixed=" + f + " min=" + Math.min(...lines) + " under200=" + lines.filter(l => l < 200).length);
