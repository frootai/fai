import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

// ─── Data ──────────────────────────────────────────────────────────

const layers = [
  { id: "F", icon: "🌱", title: "Foundations — The Roots", meta: "Tokens, parameters, models — the vocabulary of AI", color: "#f59e0b", bgColor: "rgba(245, 158, 11, 0.08)",
    modules: [
      { id: "F1", title: "GenAI Foundations", desc: "Transformers, attention, tokenization, inference, parameters, embeddings", duration: "60–90 min", link: "/docs/GenAI-Foundations" },
      { id: "F2", title: "LLM Landscape", desc: "GPT, Claude, Llama, Gemini, Phi — benchmarks, model selection", duration: "45–60 min", link: "/docs/LLM-Landscape" },
      { id: "F3", title: "AI Glossary A–Z", desc: "200+ terms defined — from ablation to zero-shot", duration: "Reference", link: "/docs/F3-AI-Glossary-AZ" },
    ],
  },
  { id: "R", icon: "🪵", title: "Reasoning — The Trunk", meta: "Prompts, RAG, grounding — how to make AI think well", color: "#10b981", bgColor: "rgba(16, 185, 129, 0.08)",
    modules: [
      { id: "R1", title: "Prompt Engineering", desc: "System messages, few-shot, chain-of-thought, structured output", duration: "60–90 min", link: "/docs/Prompt-Engineering" },
      { id: "R2", title: "RAG Architecture", desc: "Chunking, embeddings, vector search, semantic ranking", duration: "90–120 min", link: "/docs/RAG-Architecture" },
      { id: "R3", title: "Deterministic AI", desc: "Hallucination reduction, grounding, temperature tuning", duration: "60–90 min", link: "/docs/R3-Deterministic-AI" },
    ],
  },
  { id: "O¹", icon: "🌿", title: "Orchestration — The Branches", meta: "Semantic Kernel, agents, MCP — connecting AI systems", color: "#06b6d4", bgColor: "rgba(6, 182, 212, 0.08)",
    modules: [
      { id: "O1", title: "Semantic Kernel", desc: "Plugins, planners, memory, LangChain comparison", duration: "60 min", link: "/docs/Semantic-Kernel" },
      { id: "O2", title: "AI Agents", desc: "Planning, memory, tool use, multi-agent patterns", duration: "90–120 min", link: "/docs/AI-Agents-Deep-Dive" },
      { id: "O3", title: "MCP & Tools", desc: "Model Context Protocol, function calling, A2A", duration: "60–90 min", link: "/docs/O3-MCP-Tools-Functions" },
    ],
  },
  { id: "O²", icon: "🍃", title: "Operations — The Leaves", meta: "Azure AI, hosting, Copilot — running AI in production", color: "#6366f1", bgColor: "rgba(99, 102, 241, 0.08)",
    modules: [
      { id: "O4", title: "Azure AI Platform", desc: "AI Foundry, Model Catalog, Landing Zones", duration: "60–90 min", link: "/docs/Azure-AI-Foundry" },
      { id: "O5", title: "AI Infrastructure", desc: "GPU, Container Apps, AKS, model serving", duration: "60–90 min", link: "/docs/AI-Infrastructure" },
      { id: "O6", title: "Copilot Ecosystem", desc: "M365 Copilot, Studio, Power Platform", duration: "45–60 min", link: "/docs/Copilot-Ecosystem" },
    ],
  },
  { id: "T", icon: "🍎", title: "Transformation — The Fruit", meta: "Fine-tuning, safety, production — real-world impact", color: "#7c3aed", bgColor: "rgba(124, 58, 237, 0.08)",
    modules: [
      { id: "T1", title: "Fine-Tuning", desc: "LoRA, QLoRA, RLHF, DPO, MLOps", duration: "60–90 min", link: "/docs/T1-Fine-Tuning-MLOps" },
      { id: "T2", title: "Responsible AI", desc: "Content safety, red teaming, guardrails", duration: "45–60 min", link: "/docs/Responsible-AI-Safety" },
      { id: "T3", title: "Production Patterns", desc: "Multi-agent hosting, API gateway, cost control", duration: "60–90 min", link: "/docs/T3-Production-Patterns" },
    ],
  },
];

const learningPaths = [
  { emoji: "🚀", title: "I'm New to AI", desc: "Start from the roots, build layer by layer", duration: "6–8h", modules: "F1 → F3 → F2 → R1 → R2 → R3" },
  { emoji: "⚡", title: "Build an Agent", desc: "Fast-track to agent development", duration: "4–5h", modules: "F1 → R1 → O2 → O3 → O1 → T3" },
  { emoji: "🏗️", title: "AI Infrastructure", desc: "For infra architects", duration: "5–6h", modules: "F1 → O4 → O5 → T3 → R2 → T1" },
  { emoji: "🔍", title: "Reliable AI", desc: "Determinism & safety", duration: "3–4h", modules: "R3 → R1 → R2 → T2 → REF" },
  { emoji: "🎯", title: "Complete Journey", desc: "Every module, root to fruit", duration: "16–22h", modules: "F1 → F2 → ... → T3" },
  { emoji: "💡", title: "Pro Tip", desc: "Share FrootAI across teams to speak the same AI language. The open glue removes silos.", duration: "", modules: "🔭 + 🔬" },
];

// ─── Components ────────────────────────────────────────────────────

function HeroBanner(): JSX.Element {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <img src="/frootai/img/aifroot-logo.svg" alt="FrootAI" className={styles.heroLogo} />
        <p className={styles.heroLabel}>From Root ⇄ Fruit</p>
        <h1 className={styles.heroTitle}>FrootAI</h1>
        <p style={{ fontSize: "0.88rem", fontStyle: "italic", color: "var(--ifm-color-emphasis-500)", margin: "0 auto 6px", letterSpacing: "0.01em" }}>
          From a single token to a production agent fleet
        </p>
        <p style={{ fontSize: "0.82rem", color: "var(--ifm-color-emphasis-400)", margin: "0 auto 10px", letterSpacing: "0.02em" }}>
          Infra ⇄ Platform ⇄ Apps
        </p>
        <p className={styles.heroAcronym}>
          AI <span className={styles.heroAcronymF}>F</span>oundations · <span className={styles.heroAcronymR}>R</span>easoning · <span className={styles.heroAcronymO1}>O</span>rchestration · <span className={styles.heroAcronymO2}>O</span>perations · <span className={styles.heroAcronymT}>T</span>ransformation
        </p>

        {/* Mission mantra */}
        <p style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.01em", margin: "16px auto 12px", textAlign: "center", background: "linear-gradient(135deg, #10b981, #06b6d4, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          Know the roots. Ship the fruit.
        </p>

        {/* Mission statement — one line */}
        <div style={{ maxWidth: "620px", margin: "0 auto 8px", padding: "12px 24px", borderRadius: "14px", border: "1px solid rgba(16, 185, 129, 0.2)", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.04), rgba(99, 102, 241, 0.04))" }}>
          <p style={{ fontSize: "0.82rem", color: "var(--ifm-color-emphasis-600)", lineHeight: 1.55, margin: 0, textAlign: "center" }}>
            🎯 The open glue — a power kit for infrastructure and platform people to master and bridge the gap with AI, agents, and the agentic ecosystem.
          </p>
        </div>

        {/* 3 visual tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", margin: "20px auto", maxWidth: "720px" }}>
          <div style={{ padding: "14px", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)", background: "rgba(16, 185, 129, 0.04)", textAlign: "center" }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>🔗</div>
            <div style={{ fontWeight: 700, fontSize: "0.78rem" }}>Open Glue</div>
            <div style={{ fontSize: "0.68rem", color: "var(--ifm-color-emphasis-500)" }}>Binds infra · platform · app</div>
          </div>
          <div style={{ padding: "14px", borderRadius: "12px", border: "1px solid rgba(99, 102, 241, 0.2)", background: "rgba(99, 102, 241, 0.04)", textAlign: "center" }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>🔌</div>
            <div style={{ fontWeight: 700, fontSize: "0.78rem" }}>MCP Skill Set</div>
            <div style={{ fontSize: "0.68rem", color: "var(--ifm-color-emphasis-500)" }}>Agent-callable knowledge</div>
          </div>
          <div style={{ padding: "14px", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.2)", background: "rgba(245, 158, 11, 0.04)", textAlign: "center" }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "2px" }}>🎓</div>
            <div style={{ fontWeight: 700, fontSize: "0.78rem" }}>Knowledge Hub</div>
            <div style={{ fontSize: "0.68rem", color: "var(--ifm-color-emphasis-500)" }}>Learn AI architecture fast</div>
          </div>
        </div>

        {/* 3 CTA buttons */}
        <div className={styles.heroCta}>
          <Link className={styles.ctaPrimary} to="/docs/"
            onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 100)}>
            🌱 Start from the Roots
          </Link>
          <Link className={styles.ctaSecondary} to="#mcp-tooling">
            🔌 Explore MCP Tooling
          </Link>
          <Link className={styles.ctaSecondary} to="/packages">
            📦 FROOT Packages
          </Link>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.stat}><span className={styles.statNum} style={{ color: "#10b981" }}>17</span><span className={styles.statLabel}>Modules</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{ color: "#06b6d4" }}>6</span><span className={styles.statLabel}>MCP Tools</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{ color: "#6366f1" }}>200+</span><span className={styles.statLabel}>AI Terms</span></div>
          <div className={styles.stat}><span className={styles.statNum} style={{ color: "#7c3aed" }}>90%</span><span className={styles.statLabel}>Token Savings</span></div>
        </div>
      </div>
    </div>
  );
}

function FROOTLayer({ layer }: { layer: (typeof layers)[0] }): JSX.Element {
  return (
    <div className={styles.layer}>
      <div className={styles.layerHeader}>
        <div className={styles.layerIcon} style={{ background: layer.bgColor }}>{layer.icon}</div>
        <div>
          <h3 className={styles.layerTitle} style={{ color: layer.color }}>{layer.id} — {layer.title}</h3>
          <p className={styles.layerMeta}>{layer.meta}</p>
        </div>
      </div>
      <div className={styles.layerModules}>
        {layer.modules.map((mod) => (
          <Link key={mod.id} to={mod.link} className={styles.moduleCard} style={{ borderColor: `${layer.color}22` }}
            onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 100)}>
            <span className={styles.moduleId} style={{ color: layer.color }}>{mod.id}</span>
            <span className={styles.moduleTitle}>{mod.title}</span>
            <span className={styles.moduleDesc}>{mod.desc}</span>
            <span className={styles.moduleDuration}>{mod.duration}</span>
            <span className={styles.moduleArrow} style={{ color: layer.color }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
// Order: Hero → FROOT Framework → Two Lenses (with MCP+Packages woven in)
//        → MCP Tooling → Learning Paths → CTA

export default function FrootAIPage(): JSX.Element {
  return (
    <Layout title="FrootAI — The Open Glue for AI Architecture" description="The open glue that binds infrastructure, platform, and application. 17 modules, 200+ AI terms, MCP server, FROOT packages.">
      <HeroBanner />
      <main className={styles.main}>

        {/* ── FROOT Framework ── */}
        <section>
          <h2 className={styles.sectionTitle}>The FROOT Framework</h2>
          <p className={styles.sectionSub}>Five layers — from the bedrock of infrastructure to the fruit of production AI</p>
          <div className={styles.layers}>
            {layers.map((l) => <FROOTLayer key={l.id} layer={l} />)}
          </div>
        </section>

        {/* ── Two Lenses, One Tree (with MCP + Packages woven in) ── */}
        <section className={styles.lensSection}>
          <h2 className={styles.sectionTitle}>Two Lenses, One Tree</h2>
          <p className={styles.sectionSub}>FrootAI gives you the big picture AND the tiny details — plus the tools to act on both</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            <div className={styles.lensCard}>
              <div className={styles.lensEmoji}>🔭</div>
              <h3 className={styles.lensTitle}>Telescope — Big Picture</h3>
              <ul className={styles.lensList}>
                <li>AI Landing Zone architecture</li>
                <li>Semantic Kernel vs Agent Framework</li>
                <li>Multi-agent hosting patterns</li>
                <li>Enterprise copilot strategy</li>
              </ul>
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--ifm-color-emphasis-100)" }}>
                <Link to="/packages" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#10b981" }}>📦 Browse FROOT Packages →</Link>
              </div>
            </div>
            <div className={styles.lensCard}>
              <div className={styles.lensEmoji}>🔬</div>
              <h3 className={styles.lensTitle}>Microscope — Tiny Details</h3>
              <ul className={styles.lensList}>
                <li>top_k=40 vs top_k=10</li>
                <li>BPE tokenization internals</li>
                <li>Cosine similarity thresholds</li>
                <li>LoRA rank selection</li>
              </ul>
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--ifm-color-emphasis-100)" }}>
                <Link to="#mcp-tooling" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6366f1" }}>🔌 Query via MCP Server →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── MCP Tooling ── */}
        <section id="mcp-tooling" className={styles.lensSection} style={{ scrollMarginTop: "80px" }}>
          <h2 className={styles.sectionTitle}>🔌 MCP Tooling — Add FrootAI to Your Agent</h2>
          <p className={styles.sectionSub}>Not just docs — an intelligent, agent-callable skill set. Less tokens, zero hallucination, open economics.</p>

          {/* Without vs With */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div className={styles.lensCard} style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}>
              <div className={styles.lensEmoji}>📚</div>
              <h3 className={styles.lensTitle}>Without FrootAI MCP</h3>
              <ul className={styles.lensList}>
                <li>Agent searches the internet — slow</li>
                <li>Burns 5,000+ tokens per query</li>
                <li>May hallucinate guidance</li>
                <li>High compute, low confidence</li>
              </ul>
            </div>
            <div className={styles.lensCard} style={{ borderColor: "rgba(16, 185, 129, 0.4)", background: "rgba(16, 185, 129, 0.03)" }}>
              <div className={styles.lensEmoji}>🌳</div>
              <h3 className={styles.lensTitle}>With FrootAI MCP</h3>
              <ul className={styles.lensList}>
                <li>Queries curated 664KB knowledge</li>
                <li>90% less token burn</li>
                <li>Zero hallucination — verified docs</li>
                <li>Open economics — less cost</li>
              </ul>
            </div>
          </div>

          {/* 5 config cards (Claude, VS Code, AI Foundry, Windsurf, Copilot Studio) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "32px" }}>
            {[
              { name: "Claude Desktop", icon: "💬", config: '{"mcpServers":{"frootai":{"command":"node","args":["mcp-server/index.js"]}}}', file: "claude_desktop_config.json" },
              { name: "VS Code / Copilot", icon: "💻", config: '{"servers":{"frootai":{"command":"node","args":["mcp-server/index.js"]}}}', file: ".vscode/mcp.json" },
              { name: "Azure AI Foundry", icon: "☁️", config: "Tools → Add Tool → MCP → Point to server", file: "Agent configuration" },
              { name: "Cursor / Windsurf", icon: "⚡", config: '{"mcpServers":{"frootai":{"command":"node","args":["mcp-server/index.js"]}}}', file: "MCP settings" },
              { name: "Copilot Studio", icon: "🤖", config: "Add MCP connector → Point to FrootAI endpoint", file: "Copilot Studio tools" },
            ].map((c) => (
              <div key={c.name} style={{ padding: "14px 16px", borderRadius: "12px", border: "1px solid var(--ifm-color-emphasis-200)", fontSize: "0.75rem" }}>
                <div style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.8rem", marginBottom: "4px" }}>{c.name}</div>
                <div style={{ color: "var(--ifm-color-emphasis-400)", fontSize: "0.68rem", fontFamily: "var(--ifm-font-family-monospace)" }}>{c.file}</div>
              </div>
            ))}
          </div>

          {/* 6 tools */}
          <h3 className={styles.sectionTitle} style={{ marginTop: "0", fontSize: "1.1rem" }}>6 Tools Your Agent Receives</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "16px" }}>
            {[
              { name: "list_modules", desc: "Browse 17 modules by FROOT layer", icon: "📋" },
              { name: "get_module", desc: "Read any module content (F1–T3)", icon: "📖" },
              { name: "lookup_term", desc: "200+ AI/ML term definitions", icon: "🔍" },
              { name: "search_knowledge", desc: "Full-text search all modules", icon: "🔎" },
              { name: "get_architecture_pattern", desc: "7 pre-built decision guides", icon: "🏗️" },
              { name: "get_froot_overview", desc: "Complete FROOT framework summary", icon: "🌳" },
            ].map((t) => (
              <div key={t.name} style={{ padding: "14px", borderRadius: "12px", border: "1px solid var(--ifm-color-emphasis-200)", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "4px" }}>{t.icon}</div>
                <div style={{ fontSize: "0.75rem", fontFamily: "var(--ifm-font-family-monospace)", fontWeight: 600, color: "#10b981" }}>{t.name}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--ifm-color-emphasis-500)", marginTop: "2px" }}>{t.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link to="/setup-guide" style={{ display: "inline-block", padding: "12px 32px", borderRadius: "10px", background: "linear-gradient(135deg, #059669, #10b981)", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
              📖 Full Setup Guide
            </Link>
          </div>
        </section>

        {/* ── Learning Paths ── */}
        <section className={styles.paths}>
          <h2 className={styles.sectionTitle}>Learning Paths</h2>
          <p className={styles.sectionSub}>Not sure where to start? Pick your path</p>
          <div className={styles.pathGrid}>
            {learningPaths.map((p) => (
              <div key={p.title} className={styles.pathCard} style={p.title === "Pro Tip" ? { borderColor: "rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.03)" } : {}}>
                <div className={styles.pathEmoji}>{p.emoji}</div>
                <h3 className={styles.pathTitle}>{p.title}</h3>
                <p className={styles.pathDesc}>{p.desc}</p>
                {p.duration && <p className={styles.pathDuration}>{p.duration}</p>}
                <p className={styles.pathModules}>{p.modules}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className={styles.ctaSection}>
          <h2 className={styles.sectionTitle}>The Open Glue for AI Architecture</h2>
          <p className={styles.ctaDesc}>
            Infrastructure is the bedrock. Platform is the trunk. Application is the fruit.
            FrootAI removes silos between teams — read it, query it via MCP, download the packs, build with it.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link className={styles.ctaButton} to="/docs/"
              onClick={() => setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 100)}>
              🌱 Start from the Roots
            </Link>
            <Link className={styles.ctaButton} to="#mcp-tooling" style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)" }}>
              🔌 Add MCP to Your Agent
            </Link>
            <Link className={styles.ctaButton} to="https://github.com/gitpavleenbali/frootai" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
              ⭐ Star on GitHub
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
