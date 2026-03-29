"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Puzzle, Package, Monitor, Zap, Wrench, Sliders, Ruler, Link2, Eye, Microscope, Box, Factory, Brain, Layers, Cog, ChevronRight, type LucideIcon } from "lucide-react";
import { GlowPill } from "@/components/ui/glow-pill";
import { FadeIn } from "@/components/motion/fade-in";

/* ═══ DATA ═══ */

const channels = [
  { Icon: Monitor, title: "VS Code Extension", sub: "Sidebar panels, 16 commands, offline", color: "#6366f1", href: "/vscode-extension" },
  { Icon: Package, title: "MCP Server (npm)", sub: "22 tools for your AI agent", color: "#10b981", href: "/mcp-tooling" },
  { Icon: Zap, title: "Docker Image", sub: "Multi-arch, Kubernetes-ready", color: "#06b6d4", href: "/docker" },
  { Icon: Zap, title: "CLI (npx frootai)", sub: "8 commands, scaffolding, search", color: "#f59e0b", href: "/cli" },
  { Icon: Puzzle, title: "Marketplace", sub: "Discover & share plugins", color: "#ec4899", href: "/marketplace" },
];

export default function EcosystemPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 lg:px-6 py-12 sm:py-16">
      {/* ═══ HEADER ═══ */}
      <FadeIn>
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/img/frootai-mark.svg" alt="" className="h-7 w-7" />
            <h1 className="text-3xl font-extrabold tracking-tight">
              F<span className="text-emerald">AI</span> Ecosystem
            </h1>
          </div>
          <div className="mx-auto max-w-xl rounded-2xl border border-emerald/20 bg-gradient-to-br from-emerald/[0.04] to-indigo/[0.02] px-6 py-4">
            <p className="text-[13px] text-fg/60 leading-relaxed italic text-center">
              &ldquo;The living system behind every play — Factory builds, Packages deliver, Toolkit equips.&rdquo;
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ═══ FAI Toolkit ═══ */}
      <FadeIn delay={0.1}>
        <div className="mb-6 rounded-2xl border-2 border-indigo/20 p-6" style={{ background: "#6366f108" }}>
          <div className="mb-4 flex items-start gap-2">
            <Cog className="h-5 w-5 text-indigo mt-0.5 shrink-0" />
            <div>
              <h2 className="font-extrabold text-[16px] text-fg">FAI Toolkit</h2>
              <div className="text-[11px] text-fg/55 mt-0.5">🧠 Layer 3 — composable kits developers touch daily: DevKit, TuneKit, SpecKit</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="rounded-xl border border-cyan/20 bg-cyan/[0.03] p-5 text-center">
              <div className="text-[10px] font-bold text-cyan mb-2">Box 1</div>
              <Wrench className="h-6 w-6 mx-auto mb-2 text-cyan" />
              <div className="font-bold text-[14px] text-fg mb-2">DevKit</div>
              <div className="text-[11px] text-fg/55 leading-relaxed text-left">
                Your AI co-coder. <span className="font-semibold text-fg/70">agent.md</span> gives Copilot solution context, <span className="font-semibold text-fg/70">infra/</span> deploys Bicep, <span className="font-semibold text-fg/70">MCP tools</span> extend your agent, <span className="font-semibold text-fg/70">plugins</span> add custom functions.
              </div>
            </div>
            <div className="rounded-xl border border-violet/20 bg-violet/[0.03] p-5 text-center">
              <div className="text-[10px] font-bold text-violet mb-2">Box 2</div>
              <Sliders className="h-6 w-6 mx-auto mb-2 text-violet" />
              <div className="font-bold text-[14px] text-fg mb-2">TuneKit</div>
              <div className="text-[11px] text-fg/55 leading-relaxed text-left">
                AI config without being a specialist. <span className="font-semibold text-fg/70">config/*.json</span> controls temperature, top-k, models. <span className="font-semibold text-fg/70">evaluation/</span> scores quality. Ship with confidence.
              </div>
            </div>
            <div className="rounded-xl border border-amber/20 bg-amber/[0.03] p-5 text-center">
              <div className="text-[10px] font-bold text-amber mb-2">Box 3</div>
              <Ruler className="h-6 w-6 mx-auto mb-2 text-amber" />
              <div className="font-bold text-[14px] text-fg mb-2">SpecKit</div>
              <div className="text-[11px] text-fg/55 leading-relaxed text-left">
                Architecture blueprint. <span className="font-semibold text-fg/70">play-spec.json</span> defines components, WAF alignment across all 6 pillars, and evaluation thresholds for production.
              </div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-fg/50 italic"><Cog className="h-3 w-3 inline mr-1 text-indigo/60" />Agentic OS (.github) — knowledge · instructions · agents · skills · hooks · workflows — woven into every kit</span>
          </div>
        </div>
      </FadeIn>

      {/* ═══ FAI Packages ═══ */}
      <FadeIn delay={0.15}>
        <div className="mb-6 rounded-2xl border-2 border-emerald/20 p-6" style={{ background: "#10b98108" }}>
          <div className="mb-3 flex items-start gap-2">
            <Package className="h-5 w-5 text-emerald mt-0.5 shrink-0" />
            <div>
              <h2 className="font-extrabold text-[16px] text-fg">FAI Packages</h2>
              <div className="text-[11px] text-fg/55 mt-0.5">🧠 Layer 2 — install one channel, the full Toolkit arrives (VS Code, npm, Docker, CLI)</div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
            {channels.map((c) => (
              <Link key={c.title} href={c.href} className="glow-card rounded-xl p-3 text-center" style={{ "--glow": c.color } as React.CSSProperties}>
                <c.Icon className="h-5 w-5 mx-auto mb-1.5" style={{ color: c.color }} />
                <div className="font-bold text-[12px] text-fg">{c.title}</div>
                <div className="text-[10px] text-fg/50 mt-0.5">{c.sub}</div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/setup-guide" className="glow-card inline-block rounded-lg px-4 py-1.5 text-[12px] text-emerald font-semibold" style={{ "--glow": "#10b981" } as React.CSSProperties}>Setup Guide →</Link>
          </div>
          <div className="mt-3 text-center">
            <span className="text-[11px] text-fg/50 italic"><Package className="h-3 w-3 inline mr-0.5 text-emerald/60" />Install one package, get all three kits — every channel delivers the full Toolkit</span>
          </div>
        </div>
      </FadeIn>

      {/* ═══ FAI Factory ═══ */}
      <FadeIn delay={0.2}>
        <div className="mb-10 rounded-2xl border-2 border-amber/20 p-6" style={{ background: "#f59e0b08" }}>
          <div className="mb-3 flex items-start gap-2">
            <Factory className="h-5 w-5 text-amber mt-0.5 shrink-0" />
            <div>
              <h2 className="font-extrabold text-[16px] text-fg">FAI Factory</h2>
              <div className="text-[11px] text-fg/55 mt-0.5">🧠 Layer 1 — the production engine that packs skills &amp; knowledge into deployable form</div>
            </div>
          </div>
          {/* Conveyor belt visualization */}
          <div className="rounded-xl border border-amber/15 bg-[#0d0d1a] p-3 sm:p-4">
            <div className="flex items-center justify-center gap-0">
              {/* Factory */}
              <div className="flex flex-col items-center shrink-0">
                <Factory className="h-6 w-6 sm:h-8 sm:w-8 text-amber mb-1" />
                <div className="text-[9px] sm:text-[10px] font-bold text-amber">FAI Factory</div>
              </div>
              {/* Belt line */}
              <div className="mx-1.5 sm:mx-3 w-8 sm:w-16 animate-flow-line-amber rounded-full" />
              {/* Packages */}
              <div className="flex flex-col items-center shrink-0">
                <div className="flex gap-1 sm:gap-1.5 mb-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border border-emerald/30 bg-emerald/[0.06] flex items-center justify-center"><Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-emerald" /></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border border-emerald/30 bg-emerald/[0.06] flex items-center justify-center"><Package className="h-3 w-3 sm:h-4 sm:w-4 text-emerald" /></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border border-emerald/30 bg-emerald/[0.06] flex items-center justify-center"><Zap className="h-3 w-3 sm:h-4 sm:w-4 text-emerald" /></div>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-emerald">FAI Packages</div>
              </div>
              {/* Belt line */}
              <div className="mx-1.5 sm:mx-3 w-8 sm:w-16 animate-flow-line rounded-full" />
              {/* Toolkit */}
              <div className="flex flex-col items-center shrink-0">
                <div className="flex gap-1 sm:gap-1.5 mb-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border border-cyan/30 bg-cyan/[0.06] flex items-center justify-center"><Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-cyan" /></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border border-violet/30 bg-violet/[0.06] flex items-center justify-center"><Sliders className="h-3 w-3 sm:h-4 sm:w-4 text-violet" /></div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg border border-amber/30 bg-amber/[0.06] flex items-center justify-center"><Ruler className="h-3 w-3 sm:h-4 sm:w-4 text-amber" /></div>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold text-indigo">FAI Toolkit</div>
              </div>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] sm:text-[12px] text-fg/55 font-medium">Factory builds → Packages deliver → Toolkit equips</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <span className="text-[11px] text-fg/50 italic"><Factory className="h-3 w-3 inline mr-0.5 text-amber/60" />The machine that makes everything — assembles Agentic OS primitives into production AI</span>
          </div>
        </div>
      </FadeIn>

      {/* ═══ SOLUTION PLAYS CTA ═══ */}
      <FadeIn delay={0.25}>
        <div className="mb-8 rounded-2xl border-2 border-emerald/20 bg-gradient-to-br from-emerald/[0.03] to-indigo/[0.02] p-6 text-center animate-glow-border">
          <Layers className="h-6 w-6 mx-auto mb-2 text-emerald animate-pulse-glow" />
          <h2 className="font-extrabold text-[15px] text-fg mb-2">Solution Plays</h2>
          <p className="text-[12px] text-fg/55 mb-4 max-w-md mx-auto">
            Just one byproduct of this ecosystem. Each play ships with the full FAI stack.
          </p>
          <GlowPill href="/solution-plays" color="#10b981">Explore Solution Plays →</GlowPill>
        </div>
      </FadeIn>

      {/* ═══ FROM THE ROOTS TO THE FRUITS ═══ */}
      <FadeIn delay={0.3}>
        <div className="mb-10 rounded-2xl border border-indigo/15 bg-gradient-to-br from-indigo/[0.03] via-[#0a0a18] to-violet/[0.03] p-6 animate-heartbeat relative overflow-hidden">
          {/* DNA helix background */}
          <div className="absolute inset-0 opacity-[0.04]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,30 Q80,0 160,30 T320,30 T480,30 T640,30 T800,30 T960,30" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.5"/>
              <path d="M0,50 Q80,80 160,50 T320,50 T480,50 T640,50 T800,50 T960,50" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.5"/>
              <path d="M40,30 L40,50 M120,30 L120,50 M200,30 L200,50 M280,30 L280,50 M360,30 L360,50 M440,30 L440,50" stroke="#6366f1" strokeWidth="0.5" fill="none" opacity="0.3"/>
            </svg>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-5">
              <h2 className="font-extrabold text-[16px] text-fg mb-1">From the Roots to the Fruits</h2>
              <p className="text-[12px] text-fg/55">The FAI Ecosystem is an engine — not just for Solution Plays.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* FAI Factory */}
              <div className="rounded-xl border border-amber/20 bg-amber/[0.04] p-4 hover:border-amber/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="h-5 w-5 text-amber" />
                  <h3 className="font-bold text-[13px] text-fg">FAI Factory</h3>
                </div>
                <div className="space-y-2 text-[12px] text-fg/60">
                  <div className="flex items-start gap-2"><span className="text-amber shrink-0">⚡</span><span>Assembly lines &amp; developer workflows</span></div>
                  <div className="flex items-start gap-2"><span className="text-amber shrink-0">🚀</span><span>Bicep → AKS automated deployments</span></div>
                  <div className="flex items-start gap-2"><span className="text-amber shrink-0">🏪</span><span>Marketplace-ready partner integrations</span></div>
                </div>
              </div>

              {/* FAI Packages */}
              <div className="rounded-xl border border-emerald/20 bg-emerald/[0.04] p-4 hover:border-emerald/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-emerald" />
                  <h3 className="font-bold text-[13px] text-fg">FAI Packages</h3>
                </div>
                <div className="space-y-2 text-[12px] text-fg/60">
                  <div className="flex items-start gap-2"><span className="text-emerald shrink-0">🔌</span><span>MCP tools &amp; community plugins</span></div>
                  <div className="flex items-start gap-2"><span className="text-emerald shrink-0">🤝</span><span>ServiceNow · SAP · Salesforce connectors</span></div>
                  <div className="flex items-start gap-2"><span className="text-emerald shrink-0">📡</span><span>Edge, offline &amp; enterprise variants</span></div>
                </div>
              </div>

              {/* FAI Toolkit */}
              <div className="rounded-xl border border-indigo/20 bg-indigo/[0.04] p-4 hover:border-indigo/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Cog className="h-5 w-5 text-indigo" />
                  <h3 className="font-bold text-[13px] text-fg">FAI Toolkit</h3>
                </div>
                <div className="space-y-2 text-[12px] text-fg/60">
                  <div className="flex items-start gap-2"><span className="text-indigo shrink-0">🏥</span><span>Vertical kits: healthcare · finance · legal</span></div>
                  <div className="flex items-start gap-2"><span className="text-indigo shrink-0">🧪</span><span>Community eval configs &amp; prompts</span></div>
                  <div className="flex items-start gap-2"><span className="text-indigo shrink-0">🔧</span><span>Custom MCP tools &amp; Bicep modules</span></div>
                </div>
              </div>

              {/* Beyond */}
              <div className="rounded-xl border border-violet/20 bg-violet/[0.04] p-4 hover:border-violet/40 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Puzzle className="h-5 w-5 text-violet" />
                  <h3 className="font-bold text-[13px] text-fg">FAI Engine</h3>
                </div>
                <div className="space-y-2 text-[12px] text-fg/60">
                  <div className="flex items-start gap-2"><span className="text-violet shrink-0">🧱</span><span>Build LEGO blocks — and the buildings too</span></div>
                  <div className="flex items-start gap-2"><span className="text-violet shrink-0">🌍</span><span>Full products from FAI primitives</span></div>
                  <div className="flex items-start gap-2"><span className="text-violet shrink-0">🌱</span><span>Your ecosystem — on top of FAI</span></div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[12px] text-fg/60 italic max-w-lg mx-auto">
                &ldquo;From the Roots to the Fruits — it was always the concept. The roots are the Factory. The trunk is the Packages. The fruits are everything you build with the Toolkit.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ═══ CLOSING ═══ */}
      <div className="text-center mb-8">
        <p className="text-[11px] text-fg/50">Powered by the <span className="font-bold text-emerald/70">FAI Ecosystem</span></p>
        <p className="text-[11px] text-fg/45 mt-1 leading-relaxed max-w-md mx-auto">
          It&apos;s simply Frootful.
        </p>
      </div>

      {/* Bottom nav */}
      <div className="flex flex-wrap justify-center gap-2">
        <GlowPill href="/solution-plays" color="#7c3aed">Solution Plays</GlowPill>
        <GlowPill href="/configurator" color="#f59e0b">Configurator</GlowPill>
        <GlowPill href="/setup-guide" color="#f97316">Setup Guide</GlowPill>
        <GlowPill href="/chatbot" color="#d4a853">Ask Agent FAI</GlowPill>
        <GlowPill href="/" color="#10b981">Back to FrootAI</GlowPill>
      </div>
    </div>
  );
}
