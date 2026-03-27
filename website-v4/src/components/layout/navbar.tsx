"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";

const dropdowns = [
  { label: "FAI Platform", items: [
    { to: "/configurator", label: "⚙️ Solution Configurator" },
    { to: "/solution-plays", label: "🎯 Solution Plays (20)" },
    { to: "/packages", label: "📦 Packages" },
  ]},
  { label: "FAI Solutions", items: [
    { to: "/ecosystem", label: "🔗 Ecosystem Overview" },
    { to: "/vscode-extension", label: "🖥️ VS Code Extension" },
    { to: "/mcp-tooling", label: "🔌 MCP Server (22 tools)" },
    { to: "/cli", label: "⚡ CLI (npx frootai)" },
    { to: "/docker", label: "🐳 Docker Image" },
    { to: "/setup-guide", label: "📋 Setup Guide" },
  ]},
  { label: "FAI Community", items: [
    { to: "/partners", label: "🤝 Partner Integrations" },
    { to: "/marketplace", label: "🏪 Plugin Marketplace" },
    { to: "/community", label: "🌱 Open Source Community" },
    { to: "/adoption", label: "📊 FrootAI Adoption" },
  ]},
  { label: "FAI Learning", items: [
    { to: "/learning-hub", label: "📚 FAI Learning Center" },
    { to: "/docs", label: "📖 Knowledge Modules (18)" },
    { to: "/docs/F3-AI-Glossary-AZ", label: "🔤 AI Glossary (200+)" },
    { to: "/docs/Quiz-Assessment", label: "📝 Quiz & Assessment" },
  ]},
  { label: "FAI Dev Hub", items: [
    { to: "/dev-hub", label: "🛠️ Developer Center" },
    { to: "/feature-spec", label: "📋 Feature Spec" },
    { to: "/api-docs", label: "📡 REST API" },
    { to: "/eval-dashboard", label: "📊 Eval Dashboard" },
    { to: "/dev-hub-changelog", label: "📰 Changelog" },
  ]},
];

const rightLinks = [
  { to: "/hi-fai", label: "🖐️ Hi FAI", glow: "emerald" },
  { to: "/chatbot", label: "✨ Agent FAI", glow: "amber" },
];

function DropdownMenu({ label, items, onClose }: { label: string; items: { to: string; label: string }[]; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 px-3 py-2 text-[13px] text-fg-muted hover:text-fg transition-colors cursor-pointer">
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 min-w-[220px] rounded-xl border border-border bg-bg-surface/95 backdrop-blur-xl p-1.5 shadow-2xl"
          >
            {items.map((item) => (
              <Link key={item.to} href={item.to} onClick={() => { setOpen(false); onClose(); }}
                className="block rounded-lg px-3 py-2 text-[13px] text-fg-muted hover:text-fg hover:bg-bg-elevated transition-colors">
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border-subtle bg-bg/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[15px] tracking-tight">
          <Sparkles className="h-5 w-5 text-[var(--froot-emerald)]" />
          <span>Froot<span className="text-[var(--froot-emerald)]">AI</span></span>
        </Link>

        {/* Desktop dropdowns */}
        <div className="hidden lg:flex items-center">
          {dropdowns.map((d) => (
            <DropdownMenu key={d.label} label={d.label} items={d.items} onClose={() => {}} />
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-1">
          {rightLinks.map((l) => (
            <Link key={l.to} href={l.to}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all hover:bg-bg-elevated ${
                l.glow === "amber" ? "text-[var(--froot-amber)]" : "text-[var(--froot-emerald)]"
              }`}>
              {l.label}
            </Link>
          ))}
          <a href="https://github.com/gitpavleenbali/frootai" target="_blank" rel="noopener noreferrer"
            className="ml-2 px-3 py-1.5 rounded-lg text-[13px] text-fg-muted hover:text-fg transition-colors">
            GitHub
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden p-2 text-fg-muted hover:text-fg cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border-subtle bg-bg/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="max-h-[70vh] overflow-y-auto p-4 space-y-3">
              {dropdowns.map((d) => (
                <div key={d.label}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-fg-dim mb-1.5">{d.label}</p>
                  {d.items.map((item) => (
                    <Link key={item.to} href={item.to} onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-3 py-2 text-[13px] text-fg-muted hover:text-fg hover:bg-bg-elevated transition-colors">
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-2 border-t border-border-subtle flex flex-col gap-1">
                {rightLinks.map((l) => (
                  <Link key={l.to} href={l.to} onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-fg hover:bg-bg-elevated">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
