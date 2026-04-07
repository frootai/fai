// #38: Create 30 new agents for emerging tech to push toward 1000+ primitives
const fs = require("fs"), path = require("path");
const agentsDir = "agents";

const newAgents = [
    { name: "frootai-opentelemetry-expert", desc: "OpenTelemetry observability — distributed tracing, metrics, logs, OTLP exporters, Azure Monitor integration", tools: ["terminal", "file"], waf: ["operational-excellence", "performance-efficiency"] },
    { name: "frootai-graphrag-expert", desc: "Graph-based RAG — entity extraction, relationship mapping, knowledge graphs, Neo4j/Cosmos DB Gremlin, graph traversal for retrieval", tools: ["terminal", "file", "search"], waf: ["performance-efficiency", "reliability"] },
    { name: "frootai-a2a-expert", desc: "Agent-to-Agent protocol — Google A2A specification, agent cards, task delegation, multi-agent handoffs, cross-platform orchestration", tools: ["terminal", "file"], waf: ["reliability", "operational-excellence"] },
    { name: "frootai-ag-ui-expert", desc: "Agent-UI protocol — AG-UI rendering specification, streaming agent responses, real-time UI updates, chat/canvas/dashboard patterns", tools: ["terminal", "file"], waf: ["performance-efficiency", "responsible-ai"] },
    { name: "frootai-cloudflare-expert", desc: "Cloudflare Workers AI — edge inference, Workers KV, D1 database, R2 storage, AI Gateway, CDN optimization for AI workloads", tools: ["terminal", "file"], waf: ["performance-efficiency", "cost-optimization"] },
    { name: "frootai-vercel-expert", desc: "Vercel AI SDK — streaming responses, edge functions, AI playground, Next.js AI integration, serverless deployment patterns", tools: ["terminal", "file"], waf: ["performance-efficiency", "operational-excellence"] },
    { name: "frootai-supabase-expert", desc: "Supabase with AI — pgvector integration, real-time subscriptions, Edge Functions, Auth, storage for AI applications", tools: ["terminal", "file"], waf: ["reliability", "security"] },
    { name: "frootai-neon-expert", desc: "Neon serverless Postgres — branching, auto-scaling, pgvector for AI workloads, connection pooling, database-per-branch development", tools: ["terminal", "file"], waf: ["cost-optimization", "performance-efficiency"] },
    { name: "frootai-temporal-expert", desc: "Temporal workflow orchestration — durable execution, saga patterns, long-running AI workflows, retry policies, activity timeouts", tools: ["terminal", "file"], waf: ["reliability", "operational-excellence"] },
    { name: "frootai-dapr-expert", desc: "Dapr distributed application runtime — service invocation, state management, pub/sub, bindings for AI microservices", tools: ["terminal", "file"], waf: ["reliability", "operational-excellence"] },
    { name: "frootai-ray-expert", desc: "Ray distributed computing — Ray Serve for model serving, Ray Tune for hyperparameter optimization, distributed training at scale", tools: ["terminal", "file"], waf: ["performance-efficiency", "cost-optimization"] },
    { name: "frootai-mlflow-expert", desc: "MLflow experiment tracking — model registry, deployment pipelines, metric logging, artifact storage, Azure ML integration", tools: ["terminal", "file"], waf: ["operational-excellence", "reliability"] },
    { name: "frootai-wandb-expert", desc: "Weights & Biases — experiment tracking, model versioning, hyperparameter sweeps, prompt tracing, evaluation dashboards", tools: ["terminal", "file"], waf: ["operational-excellence", "performance-efficiency"] },
    { name: "frootai-langchain-expert", desc: "LangChain framework — chains, agents, retrievers, memory, callbacks, LCEL expression language, LangSmith tracing", tools: ["terminal", "file", "search"], waf: ["reliability", "operational-excellence"] },
    { name: "frootai-llamaindex-expert", desc: "LlamaIndex data framework — document loaders, index types, query engines, response synthesizers, agent tools", tools: ["terminal", "file", "search"], waf: ["performance-efficiency", "reliability"] },
    { name: "frootai-crewai-expert", desc: "CrewAI multi-agent — crew composition, task delegation, agent roles, tools integration, sequential/hierarchical processes", tools: ["terminal", "file"], waf: ["reliability", "operational-excellence"] },
    { name: "frootai-autogen-expert", desc: "Microsoft AutoGen — conversational agents, group chat, code execution, human-in-the-loop, nested chat patterns", tools: ["terminal", "file"], waf: ["reliability", "responsible-ai"] },
    { name: "frootai-dspy-expert", desc: "DSPy programming — declarative language model programs, optimizers, teleprompters, signatures, assertions, metric-driven prompt optimization", tools: ["terminal", "file"], waf: ["performance-efficiency", "cost-optimization"] },
    { name: "frootai-guidance-expert", desc: "Microsoft Guidance — constrained generation, token healing, regex patterns, structured output, guaranteed JSON/XML compliance", tools: ["terminal", "file"], waf: ["reliability", "performance-efficiency"] },
    { name: "frootai-htmx-expert", desc: "htmx hypermedia — AJAX, server-sent events, WebSockets, HTML-over-the-wire, progressive enhancement for AI-powered UIs", tools: ["terminal", "file"], waf: ["performance-efficiency", "reliability"] },
    { name: "frootai-wasm-expert", desc: "WebAssembly — WASI, component model, edge AI inference, Spin/Fermyon, Wasmtime, portable AI model execution", tools: ["terminal", "file"], waf: ["performance-efficiency", "security"] },
    { name: "frootai-grpc-expert", desc: "gRPC services — Protocol Buffers, streaming RPCs, interceptors, load balancing, health checking for AI microservices", tools: ["terminal", "file"], waf: ["performance-efficiency", "reliability"] },
    { name: "frootai-nats-expert", desc: "NATS messaging — JetStream, key-value store, object store, request-reply, pub-sub for AI event-driven architectures", tools: ["terminal", "file"], waf: ["reliability", "performance-efficiency"] },
    { name: "frootai-deno-expert", desc: "Deno runtime — TypeScript-first, permissions model, Deno KV, Deno Deploy, secure-by-default AI service development", tools: ["terminal", "file"], waf: ["security", "performance-efficiency"] },
    { name: "frootai-bun-expert", desc: "Bun runtime — fast JavaScript/TypeScript, built-in bundler, test runner, SQLite, HTTP server for AI APIs", tools: ["terminal", "file"], waf: ["performance-efficiency", "operational-excellence"] },
    { name: "frootai-solid-expert", desc: "SolidJS — fine-grained reactivity, signals, stores, createResource for AI data fetching, SolidStart SSR", tools: ["terminal", "file"], waf: ["performance-efficiency", "reliability"] },
    { name: "frootai-qwik-expert", desc: "Qwik framework — resumability, lazy loading, Island architecture, Qwik City, instant-on AI-powered web applications", tools: ["terminal", "file"], waf: ["performance-efficiency", "cost-optimization"] },
    { name: "frootai-remix-expert", desc: "Remix framework — nested routing, loaders/actions, progressive enhancement, streaming SSR for AI applications", tools: ["terminal", "file"], waf: ["performance-efficiency", "reliability"] },
    { name: "frootai-protobuf-expert", desc: "Protocol Buffers — schema design, code generation, backward compatibility, gRPC service definitions for AI APIs", tools: ["terminal", "file"], waf: ["performance-efficiency", "operational-excellence"] },
    { name: "frootai-turso-expert", desc: "Turso embedded database — libSQL, edge replication, vector search, multi-tenant databases for AI applications", tools: ["terminal", "file"], waf: ["performance-efficiency", "cost-optimization"] },
];

let created = 0;
for (const agent of newAgents) {
    const filePath = path.join(agentsDir, `${agent.name}.agent.md`);
    if (fs.existsSync(filePath)) continue; // Don't overwrite

    const content = `---
description: "${agent.desc}"
tools: ${JSON.stringify(agent.tools)}
model: "gpt-4o"
waf: ${JSON.stringify(agent.waf)}
---

# ${agent.name.replace(/frootai-/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} Agent

You are a FrootAI specialized agent for ${agent.desc.split(" — ")[0]}.

## Core Expertise
${agent.desc.split(" — ").slice(1).join(". ").split(", ").map(s => `- ${s.charAt(0).toUpperCase() + s.slice(1)}`).join("\n")}

## Architecture Knowledge
This agent has deep knowledge of ${agent.name.replace("frootai-", "").replace(/-/g, " ")} patterns:

### Production Patterns
- Design for high availability with automatic failover
- Implement circuit breaker pattern for external service calls
- Use structured logging with correlation IDs for distributed tracing
- Configure health check endpoints for all dependent services
- Implement graceful degradation when services are unavailable

### Integration with FrootAI
- Wire into solution plays via fai-manifest.json primitives section
- Follow the builder → reviewer → tuner agent chain
- Use config/*.json for all tunable parameters
- Align with WAF pillars: ${agent.waf.join(", ")}
- Support MCP tool calling for automated operations

### Security Considerations
- Use Managed Identity for all Azure service authentication
- Store secrets in Azure Key Vault (never in code or config)
- Validate all inputs before processing
- Implement content safety checks on user-facing outputs
- Follow OWASP LLM Top 10 mitigations

### Performance Optimization
- Use connection pooling for all external connections
- Implement caching with appropriate TTL for repeated queries
- Use async/await patterns for all I/O operations
- Monitor latency p95 and set alerts for degradation
- Right-size compute resources based on actual usage patterns

### Cost Management
- Use model routing: cheaper models for simple tasks
- Implement token budgets and usage tracking
- Cache frequent responses to reduce API calls
- Auto-scale with max instance caps to prevent cost overruns
- Monitor cost attribution per team and per play

## Tool Usage
| Tool | When to Use | Example |
|------|------------|---------|
| \`terminal\` | Run commands, deploy, test | \`npm run validate:primitives\` |
| \`file\` | Read/write code, config, docs | Edit configuration files |
| \`search\` | Find code patterns, references | Search for integration patterns |

## WAF Alignment
${agent.waf.map(w => {
        const descriptions = {
            "reliability": "**Reliability:** Retry policies, health checks, circuit breaker, graceful degradation",
            "security": "**Security:** Managed Identity, Key Vault, Content Safety, RBAC, encryption",
            "cost-optimization": "**Cost Optimization:** Model routing, caching, right-sized SKUs, token budgets",
            "operational-excellence": "**Operational Excellence:** IaC, CI/CD, observability, incident runbooks",
            "performance-efficiency": "**Performance Efficiency:** Async patterns, connection pooling, CDN, streaming",
            "responsible-ai": "**Responsible AI:** Content safety, groundedness, fairness, transparency"
        };
        return `- ${descriptions[w] || w}`;
    }).join("\n")}

## Response Format
When generating responses:
- Include inline comments explaining complex logic
- Use type hints on all function signatures
- Return structured responses with metadata
- Include error handling for all external calls
- Follow the coding standards defined in instructions/*.instructions.md

## Guardrails
1. Always use Managed Identity — never hardcode API keys
2. Validate all inputs before processing
3. Check content safety on user-facing outputs
4. Use structured logging with correlation IDs
5. Follow config/ files — never hardcode parameters
6. Include source attribution in generated responses
7. Monitor quality metrics and alert on degradation
8. Document architectural decisions as ADRs

## FAI Protocol Integration
This agent is wired via \`fai-manifest.json\` which defines:
- Context: knowledge modules and WAF pillar alignment
- Primitives: agents, instructions, skills, hooks
- Infrastructure: Azure resource requirements
- Guardrails: quality thresholds, safety rules
- Toolkit: DevKit for building, TuneKit for optimization

## Continuous Improvement
After each interaction:
1. Review output quality against evaluation metrics
2. Check for cost optimization opportunities
3. Verify security compliance
4. Update knowledge base if new patterns discovered
5. Log performance metrics for trend analysis
`;

    fs.writeFileSync(filePath, content);
    created++;
}

// Count total agents now
const totalAgents = fs.readdirSync(agentsDir).filter(f => f.endsWith(".agent.md")).length;
console.log(`Created: ${created} new agents`);
console.log(`Total agents: ${totalAgents}`);

// Count total primitives
const counts = {
    agents: fs.readdirSync("agents").filter(f => f.endsWith(".agent.md")).length,
    instructions: fs.readdirSync("instructions").filter(f => f.endsWith(".instructions.md")).length,
    skills: fs.readdirSync("skills", { withFileTypes: true }).filter(d => d.isDirectory()).length,
    hooks: fs.readdirSync("hooks", { withFileTypes: true }).filter(d => d.isDirectory()).length,
    plugins: fs.readdirSync("plugins", { withFileTypes: true }).filter(d => d.isDirectory()).length,
};
const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log("Primitive counts:", JSON.stringify(counts));
console.log(`Total primitives: ${total} (target: 1000+, gap: ${Math.max(0, 1000 - total)})`);
