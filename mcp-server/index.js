#!/usr/bin/env node

/**
 * FrootAI MCP Server
 * ------------------
 * Exposes the FrootAI knowledge base (17 modules, 200+ AI terms)
 * as an MCP server that any AI agent can query.
 *
 * Usage:
 *   npx frootai-mcp          # Run directly
 *   node index.js             # Run from source
 *
 * MCP Config (Claude Desktop / VS Code):
 *   {
 *     "mcpServers": {
 *       "frootai": {
 *         "command": "npx",
 *         "args": ["frootai-mcp"]
 *       }
 *     }
 *   }
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Knowledge Base Loader ─────────────────────────────────────────
// Two modes:
//   1. BUNDLED (npx frootai-mcp) — reads from knowledge.json shipped in the package
//   2. LOCAL (node index.js from repo) — reads .md files from ../aifroot/

const KNOWLEDGE_BUNDLE = join(__dirname, "knowledge.json");
const KNOWLEDGE_DIR = join(__dirname, "..", "docs");

/** Module metadata keyed by FROOT layer */
const FROOT_MAP = {
  F: {
    name: "Foundations",
    emoji: "🌱",
    metaphor: "The Roots",
    modules: {
      F1: { file: "GenAI-Foundations.md", title: "GenAI Foundations" },
      F2: { file: "LLM-Landscape.md", title: "LLM Landscape & Model Selection" },
      F3: { file: "F3-AI-Glossary-AZ.md", title: "AI Glossary A–Z" },
      F4: { file: "F4-GitHub-Agentic-OS.md", title: ".github Agentic OS — 7 Primitives" },
    },
  },
  R: {
    name: "Reasoning",
    emoji: "🪵",
    metaphor: "The Trunk",
    modules: {
      R1: { file: "Prompt-Engineering.md", title: "Prompt Engineering & Grounding" },
      R2: { file: "RAG-Architecture.md", title: "RAG Architecture & Retrieval" },
      R3: { file: "R3-Deterministic-AI.md", title: "Making AI Deterministic & Reliable" },
    },
  },
  O_ORCH: {
    name: "Orchestration",
    emoji: "🌿",
    metaphor: "The Branches",
    modules: {
      O1: { file: "Semantic-Kernel.md", title: "Semantic Kernel & Orchestration" },
      O2: { file: "AI-Agents-Deep-Dive.md", title: "AI Agents & Microsoft Agent Framework" },
      O3: { file: "O3-MCP-Tools-Functions.md", title: "MCP, Tools & Function Calling" },
    },
  },
  O_OPS: {
    name: "Operations",
    emoji: "🏗️",
    metaphor: "The Canopy",
    modules: {
      O4: { file: "Azure-AI-Foundry.md", title: "Azure AI Platform & Landing Zones" },
      O5: { file: "AI-Infrastructure.md", title: "AI Infrastructure & Hosting" },
      O6: { file: "Copilot-Ecosystem.md", title: "Copilot Ecosystem & Low-Code AI" },
    },
  },
  T: {
    name: "Transformation",
    emoji: "🍎",
    metaphor: "The Fruit",
    modules: {
      T1: { file: "T1-Fine-Tuning-MLOps.md", title: "Fine-Tuning & Model Customization" },
      T2: { file: "Responsible-AI-Safety.md", title: "Responsible AI & Safety" },
      T3: { file: "T3-Production-Patterns.md", title: "Production Architecture Patterns" },
    },
  },
};

/**
 * Load modules — tries bundled JSON first (for npx), falls back to local files (for repo)
 */
function loadModules() {
  // Mode 1: Bundled knowledge.json (for npm/npx distribution)
  if (existsSync(KNOWLEDGE_BUNDLE)) {
    const bundle = JSON.parse(readFileSync(KNOWLEDGE_BUNDLE, "utf-8"));
    const modules = {};
    for (const [modId, mod] of Object.entries(bundle.modules)) {
      modules[modId] = { ...mod, sections: parseSections(mod.content) };
    }
    return modules;
  }

  // Mode 2: Local markdown files (for development from repo)
  const modules = {};
  for (const [layerKey, layer] of Object.entries(FROOT_MAP)) {
    for (const [modId, mod] of Object.entries(layer.modules)) {
      const filePath = join(KNOWLEDGE_DIR, mod.file);
      let content = "";
      if (existsSync(filePath)) {
        content = readFileSync(filePath, "utf-8");
      }
      modules[modId] = {
        id: modId,
        title: mod.title,
        layer: layer.name,
        emoji: layer.emoji,
        metaphor: layer.metaphor,
        file: mod.file,
        content,
        sections: parseSections(content),
      };
    }
  }
  return modules;
}

/**
 * Parse markdown into sections by ## headings
 */
function parseSections(markdown) {
  const sections = [];
  const lines = markdown.split("\n");
  let currentTitle = "";
  let currentContent = [];

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/);
    const h3Match = line.match(/^### (.+)/);
    if (h2Match) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentContent.join("\n").trim() });
      }
      currentTitle = h2Match[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentContent.join("\n").trim() });
  }
  return sections;
}

/**
 * Extract glossary terms from F3 module
 */
function loadGlossary(modules) {
  const glossary = {};
  const f3 = modules.F3;
  if (!f3) return glossary;

  const lines = f3.content.split("\n");
  let currentTerm = null;
  let currentDef = [];

  for (const line of lines) {
    // Match ### headings, strip any trailing emoji tags
    const termMatch = line.match(/^### (.+)/);
    if (termMatch) {
      if (currentTerm) {
        glossary[currentTerm.toLowerCase()] = {
          term: currentTerm,
          definition: currentDef.join("\n").trim(),
        };
      }
      // Strip emoji tags like 🌱🪵🌿🏗️🍎 from the end of the term name
      currentTerm = termMatch[1].replace(/\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]+\s*$/u, "").trim();
      currentDef = [];
    } else if (currentTerm) {
      currentDef.push(line);
    }
  }
  if (currentTerm) {
    glossary[currentTerm.toLowerCase()] = {
      term: currentTerm,
      definition: currentDef.join("\n").trim(),
    };
  }
  return glossary;
}

// ─── Initialize Knowledge Base ─────────────────────────────────────

const modules = loadModules();
const glossary = loadGlossary(modules);

// ─── MCP Server ────────────────────────────────────────────────────

const server = new McpServer({
  name: "frootai",
  version: "2.1.0",
});

// ── Tool: list_modules ─────────────────────────────────────────────

server.tool(
  "list_modules",
  "List all FrootAI modules organized by FROOT layer (Foundations, Reasoning, Orchestration, Operations, Transformation). Use this to explore the knowledge base structure.",
  {},
  async () => {
    const result = [];
    for (const [layerKey, layer] of Object.entries(FROOT_MAP)) {
      const mods = Object.entries(layer.modules).map(([id, m]) => `  ${id}: ${m.title}`);
      result.push(`${layer.emoji} ${layer.name} — ${layer.metaphor}\n${mods.join("\n")}`);
    }
    return {
      content: [
        {
          type: "text",
          text: `FrootAI Knowledge Base — 18 Modules\n${"═".repeat(45)}\n\n${result.join("\n\n")}\n\n📋 Reference\n  REF: Quick Reference Cards\n  QUIZ: Quiz & Assessment\n\nUse get_module to read any module. Use search_knowledge to search across all modules.\n\n🔌 Live tools: fetch_azure_docs, fetch_external_mcp, list_community_plays, get_github_agentic_os`,
        },
      ],
    };
  }
);

// ── Tool: get_module ───────────────────────────────────────────────

server.tool(
  "get_module",
  "Get the full content of a FrootAI module by its ID (F1, F2, F3, R1, R2, R3, O1, O2, O3, O4, O5, O6, T1, T2, T3). Returns the complete module with all sections.",
  {
    module_id: z
      .string()
      .describe(
        "Module ID: F1 (GenAI Foundations), F2 (LLMs), F3 (Glossary), F4 (.github Agentic OS), R1 (Prompts), R2 (RAG), R3 (Deterministic AI), O1 (Semantic Kernel), O2 (Agents), O3 (MCP/Tools), O4 (Azure AI), O5 (Infra), O6 (Copilot), T1 (Fine-Tuning), T2 (Responsible AI), T3 (Production)"
      ),
    section: z
      .string()
      .optional()
      .describe("Optional: specific section title to retrieve (e.g., 'Key Takeaways')"),
  },
  async ({ module_id, section }) => {
    const id = module_id.toUpperCase();
    const mod = modules[id];

    if (!mod) {
      return {
        content: [
          {
            type: "text",
            text: `Module "${module_id}" not found. Valid IDs: ${Object.keys(modules).join(", ")}`,
          },
        ],
      };
    }

    if (section) {
      const sec = mod.sections.find(
        (s) => s.title.toLowerCase().includes(section.toLowerCase())
      );
      if (sec) {
        return {
          content: [
            {
              type: "text",
              text: `## ${sec.title}\n*From ${mod.emoji} ${mod.title} (${mod.layer})*\n\n${sec.content}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: `Section "${section}" not found in ${mod.title}. Available sections:\n${mod.sections.map((s) => `  - ${s.title}`).join("\n")}`,
          },
        ],
      };
    }

    // Return full module (may be long, truncate if needed)
    const content = mod.content.length > 15000
      ? mod.content.substring(0, 15000) + "\n\n... [truncated — use section parameter to get specific parts]"
      : mod.content;

    return {
      content: [{ type: "text", text: content }],
    };
  }
);

// ── Tool: lookup_term ──────────────────────────────────────────────

server.tool(
  "lookup_term",
  "Look up an AI/ML term in the FrootAI Glossary (200+ terms). Returns the definition with context. Examples: 'token', 'RAG', 'temperature', 'LoRA', 'MCP', 'hallucination', 'embeddings'.",
  {
    term: z.string().describe("The AI/ML term to look up (e.g., 'transformer', 'top-k', 'fine-tuning')"),
  },
  async ({ term }) => {
    const key = term.toLowerCase().trim();

    // Direct match
    if (glossary[key]) {
      const g = glossary[key];
      return {
        content: [
          {
            type: "text",
            text: `### ${g.term}\n\n${g.definition}\n\n---\n*Source: FrootAI Glossary A–Z (Module F3)*`,
          },
        ],
      };
    }

    // Fuzzy match — find terms containing the search string
    const matches = Object.entries(glossary)
      .filter(([k, v]) => k.includes(key) || v.term.toLowerCase().includes(key))
      .slice(0, 5);

    if (matches.length > 0) {
      const results = matches
        .map(([k, v]) => `### ${v.term}\n\n${v.definition}`)
        .join("\n\n---\n\n");
      return {
        content: [
          {
            type: "text",
            text: `Found ${matches.length} matching term(s) for "${term}":\n\n${results}\n\n---\n*Source: FrootAI Glossary A–Z (Module F3)*`,
          },
        ],
      };
    }

    // No match — suggest searching modules
    return {
      content: [
        {
          type: "text",
          text: `Term "${term}" not found in glossary. Try search_knowledge for a full-text search across all modules, or browse available terms with get_module module_id=F3.`,
        },
      ],
    };
  }
);

// ── Tool: search_knowledge ─────────────────────────────────────────

server.tool(
  "search_knowledge",
  "Search across all 17 FrootAI modules for a topic. Returns relevant sections matching the query. Use for questions like 'how to reduce hallucination', 'GPU sizing for AI', 'when to use Semantic Kernel vs Agent Framework'.",
  {
    query: z.string().describe("Natural language search query about AI architecture, patterns, or concepts"),
    max_results: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of matching sections to return (default: 5)"),
  },
  async ({ query, max_results = 5 }) => {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

    // Score each section across all modules
    const scored = [];
    for (const mod of Object.values(modules)) {
      for (const section of mod.sections) {
        const text = (section.title + " " + section.content).toLowerCase();
        let score = 0;

        // Exact phrase match (highest value)
        if (text.includes(queryLower)) score += 10;

        // Individual word matches
        for (const word of queryWords) {
          const regex = new RegExp(word, "gi");
          const matches = text.match(regex);
          if (matches) score += matches.length;
        }

        // Title match bonus
        if (section.title.toLowerCase().includes(queryLower)) score += 20;
        for (const word of queryWords) {
          if (section.title.toLowerCase().includes(word)) score += 5;
        }

        if (score > 0) {
          scored.push({
            moduleId: mod.id,
            moduleTitle: mod.title,
            layer: `${mod.emoji} ${mod.layer}`,
            sectionTitle: section.title,
            score,
            preview: section.content.substring(0, 500) + (section.content.length > 500 ? "..." : ""),
          });
        }
      }
    }

    // Sort by score, take top N
    scored.sort((a, b) => b.score - a.score);
    const topResults = scored.slice(0, max_results);

    if (topResults.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No results found for "${query}". Try broader terms or use list_modules to browse available topics.`,
          },
        ],
      };
    }

    const resultText = topResults
      .map(
        (r, i) =>
          `### ${i + 1}. ${r.sectionTitle}\n*${r.layer} → ${r.moduleTitle} (${r.moduleId})*\n\n${r.preview}`
      )
      .join("\n\n---\n\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${scored.length} relevant sections for "${query}". Top ${topResults.length}:\n\n${resultText}\n\n---\nUse get_module with module_id and section to read the full content.`,
        },
      ],
    };
  }
);

// ── Tool: get_architecture_pattern ─────────────────────────────────

server.tool(
  "get_architecture_pattern",
  "Get AI architecture guidance for a specific scenario. Combines knowledge from multiple modules to give actionable recommendations. Scenarios: 'rag_pipeline', 'agent_hosting', 'model_selection', 'cost_optimization', 'deterministic_ai', 'multi_agent', 'fine_tuning_decision'.",
  {
    scenario: z
      .enum([
        "rag_pipeline",
        "agent_hosting",
        "model_selection",
        "cost_optimization",
        "deterministic_ai",
        "multi_agent",
        "fine_tuning_decision",
      ])
      .describe("The architecture scenario to get guidance for"),
  },
  async ({ scenario }) => {
    const patterns = {
      rag_pipeline: {
        title: "RAG Pipeline Architecture",
        modules: ["R2", "R1", "R3"],
        guidance: `## RAG Pipeline — Architecture Decision Guide

**When to use RAG:** When your AI needs to answer questions about YOUR data (not general knowledge).

### Pipeline Flow
Query → Embed → Search (Vector + Keyword) → Rerank → Augment Prompt → Generate → Validate

### Key Design Decisions
| Decision | Recommendation | Why |
|----------|---------------|-----|
| Chunk size | 512 tokens | Balances specificity and context |
| Overlap | 10-20% | Prevents information loss at boundaries |
| Search type | Hybrid (vector + BM25) | Outperforms either alone |
| Reranking | Always use it | 20-40% quality improvement |
| Top-K | 5-10 chunks | Enough context without noise |
| Relevance threshold | 0.8+ cosine | Filters irrelevant matches |

### Azure Services
- **Azure AI Search**: Hybrid search, semantic ranking, vector index
- **Azure OpenAI**: Embedding model (text-embedding-3-large) + completion model
- **Azure Blob Storage**: Document storage
- **Azure AI Document Intelligence**: PDF/image extraction

📖 Deep-dive: Modules R2, R1, R3`,
      },
      agent_hosting: {
        title: "Agent Hosting Patterns",
        modules: ["T3", "O2", "O5"],
        guidance: `## Agent Hosting — Where Should Your Agents Live?

### Decision Matrix
| Criterion | Container Apps | AKS | App Service | Functions |
|-----------|---------------|-----|-------------|-----------|
| Complexity | Low-Medium | High | Low | Low |
| Auto-scale 0→N | ✅ | ✅ | ⚠️ | ✅ |
| GPU | ✅ Preview | ✅ | ❌ | ❌ |
| Long-running | ✅ | ✅ | ✅ | ⚠️ 10min max |
| WebSocket/SSE | ✅ | ✅ | ✅ | ❌ |
| Best for | AI APIs, agents | ML serving | Simple APIs | Event-driven |

### Recommendation
**Container Apps** is the sweet spot for most AI agent workloads:
- Auto-scaling (including scale-to-zero)
- Dapr sidecar for state/pubsub
- Built-in ingress with SSL
- GPU support (preview)

📖 Deep-dive: Modules T3, O2, O5`,
      },
      model_selection: {
        title: "Model Selection Guide",
        modules: ["F2", "F1"],
        guidance: `## Model Selection — Which Model for Your Use Case?

### Quick Decision
| Use Case | Recommended | Why |
|----------|------------|-----|
| General chat/QA | GPT-4o | Best quality/speed balance |
| Simple classification | GPT-4o-mini | 6-17x cheaper, good enough |
| Code generation | GPT-4o / Claude Opus 4 | Best at code |
| Document analysis | GPT-4o (multimodal) | Image + text understanding |
| On-device/edge | Phi-4 (14B) | Small, fast, private |
| Open-source hosting | Llama 3.1 70B | Best open model |
| Cost-sensitive batch | GPT-4o-mini | $0.15/1M input tokens |
| Maximum quality | Claude Opus 4 / GPT-4o | Frontier models |

### Key Parameters
- **Temperature**: 0.0 for factual, 0.7 for creative
- **Top-p**: 0.9-0.95 for most tasks
- **Max tokens**: Set explicitly to control cost

📖 Deep-dive: Modules F2, F1`,
      },
      cost_optimization: {
        title: "AI Cost Optimization",
        modules: ["T3", "F1"],
        guidance: `## AI Cost Optimization — Token Economics

### Cost Formula
Cost = (input_tokens × input_rate) + (output_tokens × output_rate)

### Optimization Strategies (in priority order)
1. **Use smaller models** — GPT-4o-mini is 6-17x cheaper than GPT-4o
2. **Semantic caching** — Cache similar queries (30-50% savings)
3. **Shorten prompts** — Fine-tune to embed instructions (remove system message)
4. **PTU for predictable workloads** — Reserved throughput = predictable cost
5. **Rate limiting** — Token budgets per user/team
6. **Prompt compression** — Remove redundant context

### Example (GPT-4o, 100K requests/day)
System: 800 tokens + User: 200 + RAG: 2,000 + Output: 500
= $0.0125/request × 100K = $1,250/day = $37,500/month

With optimization (mini + cache): ~$3,500/month (90% savings)

📖 Deep-dive: Modules T3, F1`,
      },
      deterministic_ai: {
        title: "Making AI Deterministic",
        modules: ["R3", "R1"],
        guidance: `## Deterministic AI — Making AI Reliable

### The 5-Layer Defense
1. **Generation Controls**: temperature=0, seed parameter, max_tokens
2. **Output Constraints**: JSON schema, function calling, enum fields
3. **Prompt Engineering**: System message rules, few-shot, CoT
4. **Grounding**: RAG with verified docs, citation requirements
5. **Post-Processing**: Schema validation, LLM-as-judge, confidence scoring

### Golden Rules
- temperature=0 is necessary but NOT sufficient
- Ground everything with RAG + citations
- Constrain output with JSON schemas
- Measure reliability (faithfulness >0.90, groundedness >0.95)
- Defense in depth — no single technique works alone

📖 Deep-dive: Modules R3, R1`,
      },
      multi_agent: {
        title: "Multi-Agent Patterns",
        modules: ["O2", "O3", "T3"],
        guidance: `## Multi-Agent Production Patterns

### Pattern 1: Supervisor (Most Common)
One agent routes to specialized agents based on user intent.
Best for: Customer support, domain-specific Q&A

### Pattern 2: Pipeline (Sequential)
Agents hand off in sequence: Extract → Validate → Enrich → Store
Best for: Document processing, data pipelines

### Pattern 3: Swarm (Peer-to-Peer)
Agents negotiate without a central controller.
Best for: Creative tasks, complex reasoning

### Framework Decision
| Criterion | Semantic Kernel | Agent Framework |
|-----------|----------------|-----------------|
| Best for | Plugin orchestration | Multi-agent systems |
| Language | C#, Python | C#, Python |
| Multi-agent | Limited | ✅ Native |
| Tool calling | Via plugins | Via tools |
| Production ready | ✅ Mature | ✅ Growing |

📖 Deep-dive: Modules O2, O3, T3`,
      },
      fine_tuning_decision: {
        title: "Fine-Tuning Decision Framework",
        modules: ["T1"],
        guidance: `## Should You Fine-Tune?

### Decision Flow
1. Does the model understand your task? → If yes and works well → DON'T fine-tune
2. Have you tried detailed prompting + RAG? → If no → Try that first
3. Have you tried few-shot examples? → If no → Try that first
4. Still poor quality? → Fine-tune

### Method Selection
| Data Available | Recommended Method | Cost |
|---------------|-------------------|------|
| <100 examples | Don't fine-tune yet | - |
| 100-1,000 | LoRA / QLoRA | $50-$500 |
| 1,000-10,000 | LoRA or Full FT | $500-$5K |
| 10,000+ | Full Fine-Tuning | $1K-$50K |

### Key Insight
Fine-tuning teaches HOW to respond, not WHAT to know.
- New knowledge → Use RAG
- New behavior/style → Use fine-tuning
- Both → RAG + fine-tuning

📖 Deep-dive: Module T1`,
      },
    };

    const pattern = patterns[scenario];
    return {
      content: [
        {
          type: "text",
          text: `${pattern.guidance}\n\n---\n*FrootAI — The open glue for AI architecture*`,
        },
      ],
    };
  }
);

// ── Tool: get_froot_overview ───────────────────────────────────────

server.tool(
  "get_froot_overview",
  "Get a complete overview of the FROOT framework — all 5 layers, 18 modules, what each layer covers, and how they connect. Use when asked 'what is FrootAI' or 'show me the framework'.",
  {},
  async () => {
    const overview = `# FrootAI — The FROOT Framework Overview

## From Root to Fruit: 5 Layers of AI Architecture Knowledge

### ⛰️ BEDROCK — Infrastructure
AI Landing Zones · GPU Compute · Networking · Security · Identity
*The foundation everything grows from*

### 🌱 F — FOUNDATIONS (The Roots)
- **F1**: GenAI Foundations — Transformers, tokens, parameters, attention
- **F2**: LLM Landscape — GPT, Claude, Llama, model selection
- **F3**: AI Glossary A–Z — 200+ terms defined
- **F4**: .github Agentic OS — 7 primitives, 4 layers, agent-native repos
*The vocabulary of AI*

### 🪵 R — REASONING (The Trunk)
- **R1**: Prompt Engineering — System messages, few-shot, CoT, grounding
- **R2**: RAG Architecture — Chunking, embeddings, vector search, reranking
- **R3**: Deterministic AI — Hallucination reduction, evaluation, guardrails
*How to make AI think well*

### 🌿 O — ORCHESTRATION (The Branches)
- **O1**: Semantic Kernel — Plugins, planners, memory, SK vs LangChain
- **O2**: AI Agents — Planning, tool use, multi-agent, Agent Framework
- **O3**: MCP & Tools — Model Context Protocol, function calling, A2A
*Connecting AI into intelligent systems*

### 🍃 O — OPERATIONS (The Leaves)
- **O4**: Azure AI Platform — AI Foundry, Model Catalog, Landing Zones
- **O5**: AI Infrastructure — GPU compute, Container Apps, AKS, serving
- **O6**: Copilot Ecosystem — M365 Copilot, Copilot Studio, low-code
*Running AI in production at scale*

### 🍎 T — TRANSFORMATION (The Fruit)
- **T1**: Fine-Tuning — LoRA, QLoRA, RLHF, DPO, MLOps
- **T2**: Responsible AI — Content safety, red teaming, guardrails
- **T3**: Production Patterns — Multi-agent hosting, API gateway, cost control
*Turning AI into real-world impact*

---
**The Open Glue**: FrootAI removes silos between infrastructure, platform, and application teams.
**Website**: https://gitpavleenbali.github.io/frootai/
**MCP v2**: 10 tools (6 static + 4 live) · 200+ terms · 7 architecture patterns · 20 solution plays`;

    return {
      content: [{ type: "text", text: overview }],
    };
  }
);

// ════════════════════════════════════════════════════════════════════
// LIVE TOOLS (v2) — Network-enabled, graceful degradation
// ════════════════════════════════════════════════════════════════════

/**
 * Helper: fetch with timeout and graceful degradation
 */
async function safeFetch(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    clearTimeout(timeout);
    return null; // graceful degradation — caller handles null
  }
}

// ── Tool: fetch_azure_docs ─────────────────────────────────────────

server.tool(
  "fetch_azure_docs",
  "Fetch latest Azure documentation for a specific service or topic. Uses Microsoft Learn REST API. Returns curated summary. Falls back to static knowledge if offline.",
  {
    service: z.string().describe("Azure service name or topic (e.g., 'azure-openai', 'ai-search', 'container-apps', 'ai-foundry', 'content-safety')"),
  },
  async ({ service }) => {
    const searchTerm = encodeURIComponent(`Azure ${service} documentation`);
    const url = `https://learn.microsoft.com/api/search?search=${searchTerm}&locale=en-us&%24top=5&facet=category`;

    const body = await safeFetch(url);
    if (body) {
      try {
        const data = JSON.parse(body);
        const results = (data.results || []).slice(0, 5);
        if (results.length > 0) {
          const formatted = results.map((r, i) =>
            `${i + 1}. **${r.title}**\n   ${r.description || 'No description'}\n   🔗 ${r.url}`
          ).join("\n\n");
          return {
            content: [{
              type: "text",
              text: `## Azure Documentation: ${service}\n*Live from Microsoft Learn*\n\n${formatted}\n\n---\n*Fetched live. For deeper architecture guidance, use get_module or get_architecture_pattern.*`,
            }],
          };
        }
      } catch { /* fall through to static */ }
    }

    // Graceful degradation: suggest static modules
    const relevant = Object.values(modules)
      .filter(m => m.content.toLowerCase().includes(service.toLowerCase()))
      .slice(0, 3)
      .map(m => `  - ${m.id}: ${m.title}`)
      .join("\n");

    return {
      content: [{
        type: "text",
        text: `## Azure Documentation: ${service}\n*Offline — using static knowledge*\n\n⚠️ Could not reach Microsoft Learn API. Here are relevant FrootAI modules:\n\n${relevant || "  No matching modules. Try search_knowledge."}\n\nUse search_knowledge query="${service}" for detailed content from the bundled knowledge base.`,
      }],
    };
  }
);

// ── Tool: fetch_external_mcp ───────────────────────────────────────

server.tool(
  "fetch_external_mcp",
  "Search for external MCP servers from public registries. Find MCP servers for specific tools, services, or capabilities. Falls back to curated list if offline.",
  {
    query: z.string().describe("What kind of MCP server you're looking for (e.g., 'github', 'database', 'slack', 'jira', 'azure')"),
  },
  async ({ query }) => {
    // Try mcp.so registry
    const searchUrl = `https://api.mcp.so/api/servers?q=${encodeURIComponent(query)}&limit=8`;
    const body = await safeFetch(searchUrl);

    if (body) {
      try {
        const data = JSON.parse(body);
        const servers = (data.servers || data.data || data || []).slice(0, 8);
        if (Array.isArray(servers) && servers.length > 0) {
          const formatted = servers.map((s, i) =>
            `${i + 1}. **${s.name || s.title || 'Unknown'}**\n   ${s.description || ''}\n   ${s.url || s.homepage || ''}`
          ).join("\n\n");
          return {
            content: [{
              type: "text",
              text: `## External MCP Servers: "${query}"\n*Live from MCP registry*\n\n${formatted}\n\n---\n*Install with: npx <package-name> or add to your mcp.json*`,
            }],
          };
        }
      } catch { /* fall through */ }
    }

    // Curated fallback list
    const curatedServers = {
      github: { name: "@modelcontextprotocol/server-github", desc: "GitHub repos, issues, PRs" },
      filesystem: { name: "@modelcontextprotocol/server-filesystem", desc: "Local file system access" },
      postgres: { name: "@modelcontextprotocol/server-postgres", desc: "PostgreSQL database queries" },
      slack: { name: "@modelcontextprotocol/server-slack", desc: "Slack channels and messages" },
      memory: { name: "@modelcontextprotocol/server-memory", desc: "Persistent memory for agents" },
      puppeteer: { name: "@modelcontextprotocol/server-puppeteer", desc: "Browser automation" },
      azure: { name: "frootai-mcp", desc: "AI architecture knowledge for Azure (this server!)" },
      brave: { name: "@modelcontextprotocol/server-brave-search", desc: "Web search via Brave" },
    };

    const matches = Object.entries(curatedServers)
      .filter(([k, v]) => k.includes(query.toLowerCase()) || v.desc.toLowerCase().includes(query.toLowerCase()))
      .map(([k, v]) => `- **${v.name}** — ${v.desc}`)
      .join("\n");

    return {
      content: [{
        type: "text",
        text: `## External MCP Servers: "${query}"\n*Offline — showing curated list*\n\n${matches || "No curated servers match. Try a broader search."}\n\n🔗 Browse more at: https://mcp.so · https://smithery.ai\n\nFor FrootAI's own MCP: npx frootai-mcp`,
      }],
    };
  }
);

// ── Tool: list_community_plays ─────────────────────────────────────

server.tool(
  "list_community_plays",
  "List FrootAI solution plays from the GitHub repository. Shows all 20 plays with status. Falls back to static list if offline.",
  {
    filter: z.string().optional().describe("Filter by keyword (e.g., 'rag', 'agent', 'landing-zone')"),
  },
  async ({ filter }) => {
    // Try live from GitHub API
    const apiUrl = "https://api.github.com/repos/gitpavleenbali/frootai/contents/solution-plays";
    const body = await safeFetch(apiUrl);

    let plays = [];
    if (body) {
      try {
        const data = JSON.parse(body);
        plays = data
          .filter(d => d.type === "dir")
          .map(d => d.name)
          .filter(name => !filter || name.toLowerCase().includes(filter.toLowerCase()));
      } catch { /* fall through */ }
    }

    if (plays.length > 0) {
      const formatted = plays.map((p, i) =>
        `${i + 1}. **${p}**\n   🔗 https://github.com/gitpavleenbali/frootai/tree/main/solution-plays/${p}`
      ).join("\n");
      return {
        content: [{
          type: "text",
          text: `## FrootAI Solution Plays\n*Live from GitHub*\n\n${formatted}\n\n---\n**Each play ships with:** .github Agentic OS (19 files) + DevKit + TuneKit\n🌐 https://gitpavleenbali.github.io/frootai/solution-plays`,
        }],
      };
    }

    // Static fallback
    const staticPlays = [
      "01-enterprise-rag", "02-ai-landing-zone", "03-deterministic-agent",
      "04-call-center-voice-ai", "05-it-ticket-resolution", "06-document-intelligence",
      "07-multi-agent-service", "08-copilot-studio-bot", "09-ai-search-portal",
      "10-content-moderation", "11-ai-landing-zone-advanced", "12-model-serving-aks",
      "13-fine-tuning-workflow", "14-cost-optimized-ai-gateway", "15-multi-modal-docproc",
      "16-copilot-teams-extension", "17-ai-observability", "18-prompt-management",
      "19-edge-ai-phi4", "20-anomaly-detection",
    ].filter(p => !filter || p.includes(filter?.toLowerCase() || ""));

    const formatted = staticPlays.map((p, i) => `${i + 1}. **${p}**`).join("\n");
    return {
      content: [{
        type: "text",
        text: `## FrootAI Solution Plays\n*Offline — showing bundled list*\n\n${formatted}\n\n---\n**20 plays** · Each with .github Agentic OS + DevKit + TuneKit\n🌐 https://gitpavleenbali.github.io/frootai/solution-plays`,
      }],
    };
  }
);

// ── Tool: get_github_agentic_os ────────────────────────────────────

server.tool(
  "get_github_agentic_os",
  "Get guidance on GitHub Copilot's .github folder agentic OS — the 7 primitives across 4 layers. Returns the FrootAI-authored reference guide. Use for questions about instructions, prompts, agents, skills, hooks, workflows, or plugins.",
  {
    primitive: z.enum([
      "overview", "instructions", "prompts", "agents", "skills", "hooks", "workflows", "plugins"
    ]).optional().default("overview").describe("Which primitive to explain (or 'overview' for all)"),
  },
  async ({ primitive = "overview" }) => {
    const guides = {
      overview: `## .github Agentic OS — Overview

7 primitives across 4 layers:

**Layer 1 — Always-On Context**
  1. Instructions (.github/copilot-instructions.md + instructions/*.instructions.md)
     → Passive memory, applies to every prompt

**Layer 2 — On-Demand Capabilities**
  2. Prompt Files (.github/prompts/*.prompt.md) → Slash commands
  3. Custom Agents (.github/agents/*.agent.md) → Specialist personas with MCP
  4. Skills (.github/skills/<name>/SKILL.md) → Self-contained folded logic

**Layer 3 — Enforcement & Automation**
  5. Hooks (.github/hooks/*.json) → preToolUse/postToolUse/errorOccurred
  6. Agentic Workflows (.github/workflows/*.md) → AI-driven CI/CD

**Layer 4 — Distribution**
  7. Plugins → Bundle agents + skills + commands for marketplace

FrootAI ships 19 files per solution play × 20 plays = 380 agentic OS files.
📖 Full module: get_module module_id=F4`,

      instructions: `## Primitive 1: Instructions
**Files:** .github/copilot-instructions.md + .github/instructions/*.instructions.md
**Layer:** 1 — Always-On Context
**Trigger:** Every prompt (automatic)

Passive memory that applies to every Copilot interaction. Use modular files for domain separation:
- azure-coding.instructions.md — Azure SDK patterns, managed identity
- <play>-patterns.instructions.md — Solution-specific rules
- security.instructions.md — Secrets, PII, access control

Best practice: keep short, specific, use bullet points, reference real files.`,

      prompts: `## Primitive 2: Prompt Files
**Files:** .github/prompts/*.prompt.md
**Layer:** 2 — On-Demand
**Trigger:** User types slash command (e.g., /deploy)

Slash commands for specific tasks:
- /deploy — deployment runbook with pre-flight checks
- /test — run test suite with quality thresholds
- /review — code review checklist with severity levels
- /evaluate — RAG quality evaluation pipeline

Each prompt defines: Steps, Prerequisites, Expected Output, Rollback.`,

      agents: `## Primitive 3: Custom Agents
**Files:** .github/agents/*.agent.md
**Layer:** 2 — On-Demand
**Trigger:** Agent invocation or handoff

Specialist personas with own tools and MCP servers. Agent chain:
  builder.agent.md → reviewer.agent.md → tuner.agent.md

Each agent defines: Role, Tools, MCP Servers, Rules, Handoff target.
Key: agents have MCP server bindings — they can query external knowledge.`,

      skills: `## Primitive 4: Skills
**Files:** .github/skills/<name>/SKILL.md + scripts
**Layer:** 2 — On-Demand
**Trigger:** Progressively loaded when relevant

Self-contained folders with instructions + scripts + references.
Copilot reads SKILL.md description first, loads full content only when relevant.
- deploy-azure/ — Bicep validation + az deployment
- evaluate/ — RAG quality scoring pipeline
- tune/ — TuneKit config validation`,

      hooks: `## Primitive 5: Hooks
**Files:** .github/hooks/*.json
**Layer:** 3 — Enforcement
**Trigger:** Lifecycle events (preToolUse, postToolUse, errorOccurred)

Deterministic policy gates:
- preToolUse: Block secrets in code, warn on guardrail changes
- postToolUse: Audit logging to .github/audit.log
- errorOccurred: Suggest troubleshooting on deployment failure

No LLM judgment — pure deterministic enforcement.`,

      workflows: `## Primitive 6: Agentic Workflows
**Files:** .github/workflows/*.md → compiled to YAML GitHub Actions
**Layer:** 3 — Automation
**Trigger:** PR events, pushes, schedules

Natural language automation compiled to GitHub Actions:
- ai-review.md — PR review: validate configs + run eval + post findings
- ai-deploy.md — Deployment: staging → smoke test → production (approval gate)

Permissions: read-only unless explicitly elevated.`,

      plugins: `## Primitive 7: Plugins
**Files:** plugin.json manifest
**Layer:** 4 — Distribution
**Trigger:** Install from repo or marketplace

Bundle agents + skills + commands into distributable packages:
{
  "plugin": "frootai-enterprise-rag",
  "agents": ["builder", "reviewer", "tuner"],
  "skills": ["deploy-azure", "evaluate", "tune"],
  "prompts": ["deploy", "test", "review", "evaluate"]
}

Two modes: self-hosted (your repo) or marketplace (public).`,
    };

    const guide = guides[primitive] || guides.overview;
    return {
      content: [{
        type: "text",
        text: `${guide}\n\n---\n*Source: FrootAI Module F4 — .github Agentic OS*\n📖 Full module: get_module module_id=F4`,
      }],
    };
  }
);

// ════════════════════════════════════════════════════════════════════
// AGENT TOOLS — Auto-chain: Build → Review → Tune (in-chat flow)
// ════════════════════════════════════════════════════════════════════

server.tool(
  "agent_build",
  "BUILDER AGENT — Use when the user wants to BUILD or CREATE something. Returns building guidelines based on FrootAI best practices, then suggests review. Triggers the Build → Review → Tune chain.",
  {
    task: z.string().describe("What the user wants to build (e.g., 'IT ticket classification API', 'RAG pipeline', 'agent hosting')"),
  },
  async ({ task }) => {
    // Search knowledge for relevant patterns
    const queryLower = task.toLowerCase();
    const relevant = [];
    for (const mod of Object.values(modules)) {
      for (const section of mod.sections) {
        const text = (section.title + " " + section.content).toLowerCase();
        if (queryLower.split(/\s+/).some(w => w.length > 3 && text.includes(w))) {
          relevant.push({ title: section.title, module: mod.title, preview: section.content.substring(0, 300) });
          if (relevant.length >= 3) break;
        }
      }
      if (relevant.length >= 3) break;
    }

    const patterns = relevant.map(r => `**${r.title}** (${r.module})\n${r.preview}`).join("\n\n");

    return {
      content: [{
        type: "text",
        text: `## 🛠️ Builder Agent — ${task}

### Architecture Guidance
${patterns || "No specific patterns found. Following general Azure + AI best practices."}

### Building Rules (from FrootAI DevKit)
1. **Use config/*.json** for all AI parameters — never hardcode temperature, thresholds, etc.
2. **Use Managed Identity** for Azure authentication — no API keys in code
3. **Include error handling** with retry + exponential backoff + Application Insights logging
4. **Follow .github/instructions/*.instructions.md** for coding standards
5. **Output structured JSON** where applicable (use schemas from config/openai.json)
6. **Apply guardrails** from config/guardrails.json (PII, toxicity, off-topic)

### Recommended Azure Services
Based on "${task}": ${relevant.length > 0 ? "See patterns above for specific service recommendations." : "Use Container Apps for hosting, Azure OpenAI for AI, AI Search for retrieval, Key Vault for secrets."}

---

💡 **Next step:** After building, ask me to **review your code** — I'll check for security, quality, and Azure best practices.
Say: *"Review this code"* or *"Check my implementation for issues"*`,
      }],
    };
  }
);

server.tool(
  "agent_review",
  "REVIEWER AGENT — Use when the user wants to REVIEW or CHECK code. Provides a security + quality review checklist, then suggests tuning. Part of the Build → Review → Tune chain.",
  {
    context: z.string().optional().describe("Optional: what was built or what to review (e.g., 'the IT ticket classification API')"),
  },
  async ({ context }) => {
    return {
      content: [{
        type: "text",
        text: `## 🔍 Reviewer Agent${context ? ` — ${context}` : ""}

### Security Checklist
- [ ] **No secrets in code** — API keys, connection strings must be in Key Vault
- [ ] **Managed Identity** for all Azure service-to-service auth
- [ ] **Input validation** — sanitize user inputs for injection (SQL, prompt, command)
- [ ] **Content Safety** — Azure Content Safety applied to inputs AND outputs
- [ ] **PII handling** — mask/redact before logging or storing

### Quality Checklist
- [ ] **Error handling** — try/catch with retry + exponential backoff on all Azure calls
- [ ] **Logging** — Application Insights with correlation IDs
- [ ] **Config from files** — temperature, thresholds, prompts from config/*.json (not hardcoded)
- [ ] **Temperature ≤ 0.3** for factual responses (check config/openai.json)
- [ ] **Evaluation** — test cases exist in evaluation/test-set.jsonl

### Azure Best Practices
- [ ] **Private endpoints** on all data services (Storage, AI Search, OpenAI, Cosmos)
- [ ] **Resource tags** — environment, project, owner, cost-center on all resources
- [ ] **Bicep idempotent** — infra/main.bicep can be re-run safely

### Severity Guide
🔴 **Critical** — security vulnerability or data leak → must fix before merge
🟡 **Warning** — missing best practice or performance issue → should fix
🟢 **Suggestion** — code style or minor improvement → nice to have

---

💡 **Next step:** After reviewing, ask me to **tune your configuration** for production.
Say: *"Validate my config for production"* or *"Is my TuneKit ready?"*`,
      }],
    };
  }
);

server.tool(
  "agent_tune",
  "TUNER AGENT — Use when the user wants to TUNE, VALIDATE, or check PRODUCTION READINESS. Validates TuneKit configuration. Final step in Build → Review → Tune chain.",
  {
    context: z.string().optional().describe("Optional: what solution or config to validate"),
  },
  async ({ context }) => {
    return {
      content: [{
        type: "text",
        text: `## 🎛️ Tuner Agent — Production Readiness${context ? ` for ${context}` : ""}

### Config Validation Checklist
| File | Check | Expected |
|------|-------|----------|
| config/openai.json | temperature | ≤ 0.3 for factual, ≤ 0.7 for conversational |
| config/openai.json | max_tokens | 500–4000 (not unlimited) |
| config/openai.json | model | Specific model name (not "latest") |
| config/guardrails.json | blocked_topics | Non-empty array |
| config/guardrails.json | pii_filter | true |
| config/guardrails.json | abstention | "I don't know" response configured |
| infra/main.bicep | Valid | az bicep build passes |
| infra/main.bicep | Tags | environment + project + owner on all resources |
| infra/parameters.json | Region set | Production region (not "eastus" default) |
| evaluation/test-set.jsonl | Has cases | ≥ 10 test cases with ground truth |
| evaluation/eval.py | Runnable | python eval.py --test-set test-set.jsonl works |

### Production Readiness Verdict
Review the checklist above against your actual files. If all checks pass:

✅ **READY FOR PRODUCTION** — Deploy with confidence.

If any checks fail:
⚠️ **NEEDS TUNING** — Fix the failing items, then re-validate.

### Tuning Knobs (in order of impact)
1. **temperature** → Lower = more deterministic, higher = more creative
2. **top_k / threshold** → Retrieval quality for RAG pipelines
3. **guardrails** → Safety net for production
4. **evaluation** → Quality gate before shipping

---

🚀 **Ready to deploy?** Use the **/deploy** slash command or ask: *"Deploy this to Azure"*
📖 The deploy skill in .github/skills/deploy-azure/ has the full runbook.`,
      }],
    };
  }
);

// ── Resources: Module listing ──────────────────────────────────────

server.resource(
  "frootai-overview",
  "frootai://overview",
  async () => ({
    contents: [
      {
        uri: "frootai://overview",
        mimeType: "text/plain",
        text: `FrootAI v2 — From Root to Fruit
The open glue that binds infrastructure, platform, and application.

🌱 F — Foundations: GenAI Foundations, LLM Landscape, AI Glossary A-Z, .github Agentic OS
🪵 R — Reasoning: Prompt Engineering, RAG Architecture, Deterministic AI
🌿 O — Orchestration: Semantic Kernel, AI Agents, MCP/Tools
🏗️ O — Operations: Azure AI Platform, Infrastructure, Copilot
🍎 T — Transformation: Fine-Tuning, Responsible AI, Production Patterns

18 modules | 200+ AI terms | 10 tools (6 static + 4 live) | 20 solution plays
https://gitpavleenbali.github.io/frootai/`,
      },
    ],
  })
);

// ─── Start Server ──────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
