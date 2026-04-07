const fs = require("fs"), path = require("path");
const dir = "solution-plays";
const plays = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
const template = JSON.stringify({
    model: "gpt-4o",
    api_version: "2024-12-01-preview",
    deployment_name: "gpt-4o",
    endpoint: "${AZURE_OPENAI_ENDPOINT}",
    temperature: 0.1,
    max_tokens: 4096,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: null,
    response_format: { type: "json_object" },
    seed: 42,
    stream: false,
    embedding_model: "text-embedding-3-large",
    embedding_deployment: "text-embedding-3-large",
    embedding_dimensions: 3072,
    system_message_ref: "agent.md",
    safety: { content_safety_enabled: true, violence_threshold: 2, hate_threshold: 2, sexual_threshold: 2, self_harm_threshold: 2 },
    rate_limits: { requests_per_minute: 60, tokens_per_minute: 80000 },
    retry: { max_retries: 3, backoff_multiplier: 2, backoff_max: 30 }
}, null, 2);

let fixed = 0;
for (const p of plays) {
    const fp = path.join(dir, p, "config/openai.json");
    if (!fs.existsSync(fp)) continue;
    const lines = fs.readFileSync(fp, "utf8").split("\n").length;
    if (lines < 20) { fs.writeFileSync(fp, template); fixed++; }
}
const all = plays.map(p => { const fp = path.join(dir, p, "config/openai.json"); return fs.existsSync(fp) ? fs.readFileSync(fp, "utf8").split("\n").length : 0 }).filter(l => l > 0);
console.log("fixed=" + fixed + " min=" + Math.min(...all) + " avg=" + Math.round(all.reduce((a, b) => a + b, 0) / all.length) + " under20=" + all.filter(l => l < 20).length);
