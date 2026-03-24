const http = require("http");
const https = require("https");

// Azure OpenAI Configuration
// Using cs-openai-varcvenlme53e (AI Services, rg-dev) with gpt-4o-mini for speed + quality balance
const AZURE_OPENAI_ENDPOINT = "https://cs-openai-varcvenlme53e.cognitiveservices.azure.com";
const AZURE_OPENAI_DEPLOYMENT = "gpt-4o-mini";
const AZURE_OPENAI_API_VERSION = "2024-10-21";

// ═══ COMPREHENSIVE GROUNDING CONTEXT ═══
// This is the RAG knowledge base for the FrootAI chatbot.
// Every fact, URL, feature, and play detail is here so the AI never hallucinates.

const SYSTEM_PROMPT = `You are **FAI Agent** — the official AI-powered guide for **FrootAI**.
Grounded ONLY in the knowledge below. NEVER make up facts, URLs, or features.
If unsure, say "Check the documentation at [Developer Hub](/dev-hub)".

## FORMAT RULES
Use rich markdown: **## emoji headers**, **bold**, bullet points, tables for comparisons, \`code\` for commands, [clickable links](/path), > blockquotes for tips, --- dividers. End with **## 🚀 Next Steps** (2-3 links). Keep answers concise but visually rich.

---

## WHAT IS FROOTAI
**FrootAI** = Build It Yourself AI LEGO Kit. Open-source glue for **Infra ⇄ Platform ⇄ App** teams.
- **FROOT** = Foundations · Reasoning · Orchestration · Operations · Transformation
- MIT License, built by Pavleen Bali
- [Website](https://gitpavleenbali.github.io/frootai/) | [GitHub](https://github.com/gitpavleenbali/frootai) | [npm](https://www.npmjs.com/package/frootai-mcp) | [VS Code](https://marketplace.visualstudio.com/items?itemName=pavleenbali.frootai)

Each play ships: **DevKit** (19 .github Agentic OS files) + **TuneKit** (AI config) + **Bicep** infra + **eval.py**

## 20 SOLUTION PLAYS
| # | Name | Complexity | Key Azure Services | URL |
|---|------|-----------|-------------------|-----|
| 01 | Enterprise RAG Q&A | Med | AI Search+OpenAI+Container App | [/user-guide?play=01](/user-guide?play=01) |
| 02 | AI Landing Zone | Found | VNet+PE+RBAC+GPU | [/user-guide?play=02](/user-guide?play=02) |
| 03 | Deterministic Agent | Med | Container App+OpenAI(temp=0) | [/user-guide?play=03](/user-guide?play=03) |
| 04 | Call Center Voice AI | High | Comms+Speech+OpenAI | [/user-guide?play=04](/user-guide?play=04) |
| 05 | IT Ticket Resolution | Med | Logic Apps+OpenAI+Service Bus | [/user-guide?play=05](/user-guide?play=05) |
| 06 | Document Intelligence | Med | Doc Intel+OpenAI+Blob | [/user-guide?play=06](/user-guide?play=06) |
| 07 | Multi-Agent Service | High | OpenAI(dual)+Container Apps+Cosmos | [/user-guide?play=07](/user-guide?play=07) |
| 08 | Copilot Studio Bot | Low | AI Search+OpenAI+Storage | [/user-guide?play=08](/user-guide?play=08) |
| 09 | AI Search Portal | Med | AI Search(semantic)+OpenAI+Web | [/user-guide?play=09](/user-guide?play=09) |
| 10 | Content Moderation | Low | Content Safety+OpenAI+APIM | [/user-guide?play=10](/user-guide?play=10) |
| 11 | Landing Zone Adv | High | VNet+NSG+NAT+Firewall+KV | [/user-guide?play=11](/user-guide?play=11) |
| 12 | Model Serving AKS | High | AKS(GPU)+ACR+OpenAI | [/user-guide?play=12](/user-guide?play=12) |
| 13 | Fine-Tuning Workflow | High | ML Workspace+OpenAI+Storage | [/user-guide?play=13](/user-guide?play=13) |
| 14 | AI Gateway FinOps | Med | APIM+OpenAI+Redis | [/user-guide?play=14](/user-guide?play=14) |
| 15 | Multi-Modal DocProc | Med | Doc Intel+OpenAI(4o)+Cosmos | [/user-guide?play=15](/user-guide?play=15) |
| 16 | Copilot Teams Ext | Med | OpenAI+App Service | [/user-guide?play=16](/user-guide?play=16) |
| 17 | AI Observability | Med | Log Analytics+App Insights | [/user-guide?play=17](/user-guide?play=17) |
| 18 | Prompt Management | Med | OpenAI+Cosmos+App Service | [/user-guide?play=18](/user-guide?play=18) |
| 19 | Edge AI Phi-4 | High | IoT Hub+ACR+Storage | [/user-guide?play=19](/user-guide?play=19) |
| 20 | Anomaly Detection | High | Event Hub+Stream Analytics+OpenAI | [/user-guide?play=20](/user-guide?play=20) |

**Play selector**: RAG→01,09 | Agents→03,07 | Voice→04 | Docs→06,15 | Cost→14 | Edge→19 | MLOps→13,18 | Security→10,11 | Start→[Configurator](/configurator)

## DEVKIT (.github Agentic OS) — 19 files/play
4 layers: L1 Always-On (copilot-instructions + 3 instruction files), L2 On-Demand (4 prompts + 3 agents), L3 Auto-Invoked (3 skills), L4 Lifecycle (guardrails + 2 workflows). Plus infra/main.bicep + agent.md + plugin.json.
Get it: VS Code Extension → click play → "Init DevKit"

## TUNEKIT — 4-8 config files/play
openai.json, guardrails.json, agents.json, model-comparison.json, eval.py, test-set.jsonl.
Get it: VS Code Extension → click play → "Init TuneKit"

## MCP SERVER — 16 tools (frootai-mcp@2.2.0)
Install: \`npx frootai-mcp\` | Setup: add to .vscode/mcp.json
Static(6): list_modules, get_module, lookup_term, search_knowledge, get_architecture_pattern, get_froot_overview
Live(4): fetch_azure_docs, fetch_external_mcp, list_community_plays, get_github_agentic_os
Chain(3): agent_build→agent_review→agent_tune
Ecosystem(3): get_model_catalog, get_azure_pricing, compare_models
Guide: [/setup-guide](/setup-guide)

## VS CODE EXTENSION — v0.9.2, 13 commands
Install: \`code --install-extension pavleenbali.frootai\`
Per-play: Read Docs, User Guide, Init DevKit/TuneKit/Hooks/Prompts, Open on GitHub
Global: Auto-Chain Agents, Search Knowledge, Lookup Term, Browse Patterns, Open Module, View MCP Tools
4 sidebar panels: Plays(20), MCP(16), Knowledge(18), Glossary(200+). Standalone — no clone needed.

## 18 KNOWLEDGE MODULES
F: GenAI Foundations, LLM Landscape, AI Glossary(200+), .github Agentic OS
R: Prompt Engineering, RAG Architecture, Deterministic AI
O: Semantic Kernel, AI Agents, MCP & Tools
O: Azure AI Foundry, AI Infrastructure, Copilot Ecosystem
T: Fine-Tuning & MLOps, Responsible AI, Production Patterns
Access: [/docs/](/docs/) or FAI Learning Hub navbar

## KEY PAGES
/ (Home) | [/solution-plays](/solution-plays) | [/configurator](/configurator) | [/user-guide?play=XX](/user-guide?play=01) | [/ecosystem](/ecosystem) | [/vscode-extension](/vscode-extension) | [/mcp-tooling](/mcp-tooling) | [/setup-guide](/setup-guide) | [/packages](/packages) | [/chatbot](/chatbot) | [/partners](/partners) | [/marketplace](/marketplace) | [/community](/community) | [/adoption](/adoption) | [/dev-hub](/dev-hub) | [/dev-hub-changelog](/dev-hub-changelog) | [/feature-spec](/feature-spec) | [/learning-hub](/learning-hub) | [/hi-fai](/hi-fai)

## GETTING STARTED
1. [Configurator](/configurator) → 3 questions → recommended play
2. \`code --install-extension pavleenbali.frootai\`
3. Click play → Init DevKit (19 files) → Init TuneKit
4. Open Copilot Chat → build the solution
5. \`azd up\` to deploy with Bicep templates

## COSTS (monthly)
RAG: $150-300 dev/$2K-8K prod | Agent: $100-250/$1.5K-6K | Voice: $200-400/$2.5K-10K | Gateway: $80-200/$1K-5K

## GUIDELINES
Always include [links](/path). Recommend plays with [User Guide](/user-guide?play=XX). Suggest [Configurator](/configurator) when unsure. Be specific with play numbers and tool names.
`;

const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && (req.url === "/" || req.url === "/api/health")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "frootai-chatbot-api", model: AZURE_OPENAI_DEPLOYMENT }));
    return;
  }

  // Chat endpoint
  if (req.method === "POST" && (req.url === "/api/chat" || req.url === "/chat")) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { message, history = [] } = JSON.parse(body);
        if (!message) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing 'message' in request body" }));
          return;
        }

        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-10),
          { role: "user", content: message },
        ];

        // Try Managed Identity first (production), fall back to API key (dev)
        let credential;
        let useBearer = false;
        const apiKey = process.env.AZURE_OPENAI_KEY;

        if (process.env.IDENTITY_ENDPOINT) {
          // Running on Azure — use Managed Identity
          try {
            credential = await getManagedIdentityToken();
            useBearer = true;
            console.log("Using Managed Identity token");
          } catch (tokenErr) {
            console.error("MI token failed:", tokenErr.message);
            if (apiKey) { credential = apiKey; } else { throw tokenErr; }
          }
        } else if (apiKey) {
          credential = apiKey;
        } else {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "No auth configured. Set AZURE_OPENAI_KEY or enable Managed Identity." }));
          return;
        }

        const reply = await callAzureOpenAI(messages, credential, useBearer);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(reply));
      } catch (err) {
        console.error("Chat error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to get response", detail: err.message }));
      }
    });
    return;
  }

  // Streaming chat endpoint
  if (req.method === "POST" && (req.url === "/api/chat/stream" || req.url === "/chat/stream")) {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const { message, history = [] } = JSON.parse(body);
        if (!message) { res.writeHead(400); res.end("Missing message"); return; }

        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-10),
          { role: "user", content: message },
        ];

        let credential;
        let useBearer = false;
        const apiKey = process.env.AZURE_OPENAI_KEY;
        if (process.env.IDENTITY_ENDPOINT) {
          try { credential = await getManagedIdentityToken(); useBearer = true; }
          catch { if (apiKey) credential = apiKey; else throw new Error("No auth"); }
        } else if (apiKey) { credential = apiKey; }
        else { res.writeHead(500); res.end("No auth"); return; }

        // SSE streaming
        res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" });

        const reqBody = JSON.stringify({ messages, temperature: 0.4, max_tokens: 600, top_p: 0.9, stream: true });
        const url = new URL(`/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`, AZURE_OPENAI_ENDPOINT);
        const headers = { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(reqBody) };
        if (useBearer) headers["Authorization"] = `Bearer ${credential}`;
        else headers["api-key"] = credential;

        const apiReq = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: "POST", headers }, (apiRes) => {
          let buffer = "";
          apiRes.on("data", (chunk) => {
            buffer += chunk.toString();
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const json = JSON.parse(line.slice(6));
                  const content = json.choices?.[0]?.delta?.content;
                  if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
                } catch {}
              }
              if (line === "data: [DONE]") {
                res.write("data: [DONE]\n\n");
                res.end();
              }
            }
          });
          apiRes.on("end", () => { if (!res.writableEnded) { res.write("data: [DONE]\n\n"); res.end(); } });
        });
        apiReq.on("error", (e) => { res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`); res.end(); });
        apiReq.write(reqBody);
        apiReq.end();
      } catch (err) {
        res.writeHead(500); res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found. Use POST /api/chat" }));
});

function callAzureOpenAI(messages, credential, useBearer) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ messages, temperature: 0.4, max_tokens: 600, top_p: 0.9 });
    const url = new URL(`/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`, AZURE_OPENAI_ENDPOINT);

    const headers = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    };

    if (useBearer) {
      headers["Authorization"] = `Bearer ${credential}`;
    } else {
      headers["api-key"] = credential;
    }

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) { reject(new Error(parsed.error.message)); return; }
          resolve({ reply: parsed.choices?.[0]?.message?.content || "No response", model: parsed.model, usage: parsed.usage });
        } catch (e) { reject(new Error(`Parse error: ${data.substring(0, 200)}`)); }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

server.listen(PORT, () => {
  console.log(`FrootAI Chatbot API running on port ${PORT}`);
  console.log(`Auth: ${process.env.IDENTITY_ENDPOINT ? 'Managed Identity' : (process.env.AZURE_OPENAI_KEY ? 'API Key' : 'NONE')}`);
  console.log(`Health: GET /api/health`);
  console.log(`Chat: POST /api/chat`);
});

// Get access token from Azure Managed Identity
function getManagedIdentityToken() {
  return new Promise((resolve, reject) => {
    const identityEndpoint = process.env.IDENTITY_ENDPOINT;
    const identityHeader = process.env.IDENTITY_HEADER;

    if (!identityEndpoint || !identityHeader) {
      reject(new Error("Managed Identity not available (no IDENTITY_ENDPOINT)"));
      return;
    }

    const tokenUrl = new URL(identityEndpoint);
    tokenUrl.searchParams.set("resource", "https://cognitiveservices.azure.com/");
    tokenUrl.searchParams.set("api-version", "2019-08-01");

    const options = {
      hostname: tokenUrl.hostname,
      port: tokenUrl.port,
      path: tokenUrl.pathname + tokenUrl.search,
      method: "GET",
      headers: { "X-IDENTITY-HEADER": identityHeader },
    };

    const protocol = tokenUrl.protocol === "https:" ? https : http;
    const req = protocol.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) {
            resolve(parsed.access_token);
          } else {
            reject(new Error(`No access_token in MI response: ${data.substring(0, 200)}`));
          }
        } catch (e) {
          reject(new Error(`MI parse error: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}
