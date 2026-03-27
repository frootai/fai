"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion/fade-in";
import { useState } from "react";

/* ── Data ── */
const ecosystemCards = [
  { to: "/configurator", icon: "⚙️", title: "Solution Configurator", sub: "3 questions → your play", color: "#f59e0b" },
  { to: "/solution-plays", icon: "🎯", title: "Solution Plays", sub: "20 plays · DevKit + TuneKit", color: "#7c3aed" },
  { to: "/vscode-extension", icon: "💻", title: "VS Code Extension", sub: "16 commands · Standalone", color: "#6366f1" },
  { to: "/mcp-tooling", icon: "📦", title: "MCP Server (npm)", sub: "22 tools for your agent", color: "#10b981" },
  { to: "/marketplace", icon: "🏪", title: "Plugin Marketplace", sub: "Discover & share plugins", color: "#ec4899" },
  { to: "/partners", icon: "🤝", title: "Partner Integrations", sub: "ServiceNow, Salesforce, SAP", color: "#06b6d4" },
  { to: "/packages", icon: "🧩", title: "FROOT Packages", sub: "Downloadable LEGO blocks", color: "#8b5cf6" },
  { to: "/learning-hub", icon: "📚", title: "FAI Learning Hub", sub: "18 modules · Glossary · Workshops", color: "#f97316" },
  { to: "/dev-hub", icon: "🛠️", title: "FAI Developer Hub", sub: "API ref · Changelog · Guides", color: "#0ea5e9" },
  { to: "/community", icon: "🌱", title: "100% Open Source", sub: "MIT License — Star on GitHub", color: "#00c853" },
];

const stats = [
  { num: "18+", label: "Modules", color: "#10b981" },
  { num: "20", label: "Solution Plays", color: "#06b6d4" },
  { num: "22", label: "MCP Tools", color: "#6366f1" },
  { num: "200+", label: "AI Terms", color: "#7c3aed" },
];

const layers = [
  { id: "F", icon: "🌱", title: "Foundations", color: "#f59e0b", modules: [
    { id: "F1", name: "GenAI Foundations", link: "/docs/GenAI-Foundations" },
    { id: "F2", name: "LLM Landscape", link: "/docs/LLM-Landscape" },
    { id: "F3", name: "AI Glossary A–Z", link: "/docs/F3-AI-Glossary-AZ" },
    { id: "F4", name: ".github Agentic OS", link: "/docs/F4-GitHub-Agentic-OS" },
  ]},
  { id: "R", icon: "🪵", title: "Reasoning", color: "#10b981", modules: [
    { id: "R1", name: "Prompt Engineering", link: "/docs/Prompt-Engineering" },
    { id: "R2", name: "RAG Architecture", link: "/docs/RAG-Architecture" },
    { id: "R3", name: "Deterministic AI", link: "/docs/R3-Deterministic-AI" },
  ]},
  { id: "O¹", icon: "🌿", title: "Orchestration", color: "#06b6d4", modules: [
    { id: "O1", name: "Semantic Kernel", link: "/docs/Semantic-Kernel" },
    { id: "O2", name: "AI Agents", link: "/docs/AI-Agents-Deep-Dive" },
    { id: "O3", name: "MCP & Tools", link: "/docs/O3-MCP-Tools-Functions" },
  ]},
  { id: "O²", icon: "🍃", title: "Operations", color: "#6366f1", modules: [
    { id: "O4", name: "Azure AI Platform", link: "/docs/Azure-AI-Foundry" },
    { id: "O5", name: "AI Infrastructure", link: "/docs/AI-Infrastructure" },
    { id: "O6", name: "Copilot Ecosystem", link: "/docs/Copilot-Ecosystem" },
  ]},
  { id: "T", icon: "🍎", title: "Transformation", color: "#7c3aed", modules: [
    { id: "T1", name: "Fine-Tuning", link: "/docs/T1-Fine-Tuning-MLOps" },
    { id: "T2", name: "Responsible AI", link: "/docs/Responsible-AI-Safety" },
    { id: "T3", name: "Production Patterns", link: "/docs/T3-Production-Patterns" },
  ]},
];

const outcomes = [
  { icon: "🚀", title: "New to AI?", desc: "Build AI literacy from zero" },
  { icon: "🤖", title: "Build Agents", desc: "MCP, SK, Agent Framework" },
  { icon: "🏗️", title: "AI Infra Expert", desc: "Landing zones, GPU, hosting" },
  { icon: "🏛️", title: "Solution Accelerator", desc: "Azure Verified Modules + Bicep" },
  { icon: "🎯", title: "Full-Stack Agentic", desc: ".github Agentic OS · 7 primitives" },
  { icon: "📊", title: "AI Cost Optimization", desc: "FinOps, caching, model selection" },
  { icon: "🌛", title: "Fine-Tuning Pro", desc: "LoRA, evaluation, MLOps" },
  { icon: "🛡️", title: "Reliable AI", desc: "Determinism, guardrails, safety" },
];

const ctaLinks = [
  { label: "⚙️ Configurator", to: "/configurator", color: "#f59e0b" },
  { label: "🎯 Solution Plays", to: "/solution-plays", color: "#7c3aed" },
  { label: "🧩 Packages", to: "/packages", color: "#8b5cf6" },
  { label: "🔗 Ecosystem", to: "/ecosystem", color: "#0ea5e9" },
  { label: "💻 VS Code Extension", to: "/vscode-extension", color: "#6366f1" },
  { label: "🔌 MCP Server", to: "/mcp-tooling", color: "#10b981" },
  { label: "📖 Setup Guide", to: "/setup-guide", color: "#14b8a6" },
  { label: "🏪 Marketplace", to: "/marketplace", color: "#ec4899" },
  { label: "🌱 Community", to: "/community", color: "#00c853" },
  { label: "📚 Knowledge Hub", to: "/docs", color: "#f97316" },
  { label: "✨ Agent FAI", to: "/chatbot", color: "#f59e0b" },
  { label: "🖐️ Hi FAI", to: "/hi-fai", color: "#10b981" },
];

/* ── Expandable Layer ── */
function ExpandableLayer({ layer }: { layer: typeof layers[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-bg-surface/50 overflow-hidden transition-colors hover:border-[color:var(--c)]"
      style={{ "--c": `${layer.color}44` } as React.CSSProperties}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer">
        <span className="text-xl">{layer.icon}</span>
        <span className="font-bold text-[13px]" style={{ color: layer.color }}>{layer.id} — {layer.title}</span>
        <span className="ml-auto text-[11px] text-fg-dim">{layer.modules.length} modules {open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex gap-2 px-4 pb-3.5 flex-wrap">
          {layer.modules.map((m) => (
            <Link key={m.id} href={m.link}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all hover:-translate-y-0.5"
              style={{ borderColor: `${layer.color}33`, color: layer.color }}>
              {m.id}: {m.name} →
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ── Page ── */
export default function Home() {
  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--froot-emerald)]/8 blur-[160px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-[var(--froot-indigo)]/6 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <FadeIn>
            <div className="animate-float mx-auto mb-4">
              <Image src="/img/frootai-logo.png" alt="FrootAI" width={180} height={180} priority
                className="mx-auto drop-shadow-[0_6px_28px_rgba(16,185,129,0.35)]" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter gradient-text-froot">
              FrootAI
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-3 text-[15px] font-medium text-fg-muted tracking-wide uppercase">
              From the Roots to the Fruits
            </p>
            <p className="mt-1 text-sm italic text-[var(--froot-gold)]">It&apos;s simply Frootful.</p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-3 text-[12px] text-fg-dim tracking-widest">Infra ⇄ Platform ⇄ Apps</p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p className="mt-3 text-[13px] font-medium text-fg-muted">
              AI <span className="text-[var(--froot-amber)] font-bold">F</span>oundations ·{" "}
              <span className="text-[var(--froot-emerald)] font-bold">R</span>easoning ·{" "}
              <span className="text-[var(--froot-cyan)] font-bold">O</span>rchestration ·{" "}
              <span className="text-[var(--froot-indigo)] font-bold">O</span>perations ·{" "}
              <span className="text-[var(--froot-violet)] font-bold">T</span>ransformation
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-[var(--froot-emerald)]/20 bg-gradient-to-br from-[var(--froot-emerald)]/[0.03] to-[var(--froot-indigo)]/[0.02] p-5">
              <p className="text-[13px] text-fg-muted leading-relaxed italic">
                &ldquo;Build It Yourself (BIY) — A power kit for infrastructure, platform, and
                application teams to master and bridge the gap between AI Infra, AI Platform,
                and the AI Application/Agentic Ecosystem.&rdquo;
              </p>
              <p className="mt-2 text-[11px] text-fg-dim italic">
                From a single token to a production agent fleet.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 lg:px-6 pb-24 space-y-20">
        {/* ═══ ECOSYSTEM GRID ═══ */}
        <section>
          <FadeIn>
            <h2 className="text-2xl font-bold text-center tracking-tight mb-2">FAI Ecosystem</h2>
            <p className="text-[12px] text-fg-dim text-center mb-8 italic">Click on the cards to explore more</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ecosystemCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 0.04}>
                <Link href={card.to}
                  className="group block rounded-xl border border-border bg-bg-surface/50 p-4 text-center card-hover h-full">
                  <div className="text-2xl mb-1.5 transition-transform group-hover:scale-110">{card.icon}</div>
                  <div className="font-bold text-[13px] text-fg">{card.title}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: card.color }}>{card.sub}</div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <FadeIn>
          <div className="flex justify-center gap-8 sm:gap-14 flex-wrap">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold" style={{ color: s.color }}>{s.num}</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-fg-dim mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ═══ FROOT FRAMEWORK ═══ */}
        <section>
          <FadeIn>
            <h2 className="text-2xl font-bold text-center tracking-tight mb-1">The FROOT Framework</h2>
            <p className="text-sm text-fg-muted text-center mb-8 max-w-lg mx-auto">
              AI Knowledge Hub — 5 layers, 18 modules. Click to expand, then click modules to learn.
            </p>
          </FadeIn>
          <div className="space-y-2.5 max-w-2xl mx-auto">
            {layers.map((l, i) => (
              <FadeIn key={l.id} delay={i * 0.05}>
                <ExpandableLayer layer={l} />
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══ OUTCOMES ═══ */}
        <section>
          <FadeIn>
            <h2 className="text-2xl font-bold text-center tracking-tight mb-8">What These Help You Achieve</h2>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {outcomes.map((o, i) => (
              <FadeIn key={o.title} delay={i * 0.04}>
                <div className="rounded-xl border border-border bg-bg-surface/50 p-4 text-center card-hover">
                  <div className="text-2xl mb-1">{o.icon}</div>
                  <div className="font-bold text-[13px]">{o.title}</div>
                  <div className="text-[11px] text-fg-dim mt-0.5">{o.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section>
          <FadeIn>
            <h2 className="text-2xl font-bold text-center tracking-tight mb-2">
              FrootAI — The <span style={{ color: "#10b981" }}>B</span>uild{" "}
              <span style={{ color: "#06b6d4" }}>I</span>t{" "}
              <span style={{ color: "#7c3aed" }}>Y</span>ourself AI LEGO Kit
            </h2>
            <p className="text-sm text-fg-muted text-center max-w-lg mx-auto mb-2">
              An Open Glue Binding <span className="text-[var(--froot-emerald)] font-bold">I</span>nfrastructure,{" "}
              <span className="text-[var(--froot-cyan)] font-bold">P</span>latform, and{" "}
              <span className="text-[var(--froot-violet)] font-bold">A</span>pplication Teams
            </p>
            <p className="text-[12px] text-fg-dim text-center italic mb-6">
              <span className="text-[var(--froot-emerald)]">Infrastructure</span> are the roots.{" "}
              <span className="text-[var(--froot-cyan)]">Platform</span> is the trunk.{" "}
              <span className="text-[var(--froot-violet)]">Application</span> is the fruit.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2">
              {ctaLinks.map((l) => (
                <Link key={l.to} href={l.to}
                  className="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ borderColor: `${l.color}33`, color: l.color, boxShadow: `0 0 0 0 ${l.color}00` }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>
      </div>
    </>
  );
}
