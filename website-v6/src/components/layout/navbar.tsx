"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";

const menus = [
  { label: "FAI Platform", items: [
    { href: "/configurator", label: "⚙️ Solution Configurator" },
    { href: "/solution-plays", label: "🎯 Solution Plays (20)" },
    { href: "/packages", label: "📦 Packages" },
  ]},
  { label: "FAI Solutions", items: [
    { href: "/ecosystem", label: "🔗 Ecosystem Overview" },
    { href: "/vscode-extension", label: "🖥️ VS Code Extension" },
    { href: "/mcp-tooling", label: "🔌 MCP Server (22 tools)" },
    { href: "/cli", label: "⚡ CLI (npx frootai)" },
    { href: "/docker", label: "🐳 Docker Image" },
    { href: "/setup-guide", label: "📋 Setup Guide" },
  ]},
  { label: "FAI Community", items: [
    { href: "/partners", label: "🤝 Partner Integrations" },
    { href: "/marketplace", label: "🏪 Plugin Marketplace" },
    { href: "/community", label: "🌱 Open Source Community" },
    { href: "/adoption", label: "📊 FrootAI Adoption" },
  ]},
  { label: "FAI Learning", items: [
    { href: "/learning-hub", label: "📚 FAI Learning Center" },
    { href: "/docs", label: "📖 Knowledge Modules (18)" },
    { href: "/docs/F3-AI-Glossary-AZ", label: "🔤 AI Glossary (200+)" },
    { href: "/docs/Quiz-Assessment", label: "📝 Quiz & Assessment" },
  ]},
  { label: "FAI Dev Hub", items: [
    { href: "/dev-hub", label: "🛠️ Developer Center" },
    { href: "/feature-spec", label: "📋 Feature Spec" },
    { href: "/api-docs", label: "📡 REST API" },
    { href: "/eval-dashboard", label: "📊 Eval Dashboard" },
    { href: "/dev-hub-changelog", label: "📰 Changelog" },
  ]},
];

function DesktopDropdown({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 px-3 py-2 text-[13px] text-fg-muted hover:text-fg transition-colors cursor-pointer">
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 min-w-[240px] rounded-xl border border-border bg-bg-surface/95 backdrop-blur-2xl p-1.5 shadow-2xl shadow-black/30"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3.5 py-2 text-[13px] text-fg-muted hover:text-fg hover:bg-bg-hover transition-colors"
              >
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
    <header className="fixed top-0 z-50 w-full border-b border-border-subtle bg-bg/70 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-[15px] tracking-tight">
          <Sparkles className="h-5 w-5 text-emerald" />
          <span>Froot<span className="text-emerald">AI</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center">
          {menus.map((m) => <DesktopDropdown key={m.label} {...m} />)}
        </div>

        {/* Right links */}
        <div className="hidden lg:flex items-center gap-1">
          <Link href="/hi-fai" className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-emerald hover:bg-bg-elevated transition-colors">
            🖐️ Hi FAI
          </Link>
          <Link href="/chatbot" className="px-3 py-1.5 rounded-lg text-[13px] font-medium text-amber hover:bg-bg-elevated transition-colors">
            ✨ Agent FAI
          </Link>
          <a href="https://github.com/gitpavleenbali/frootai" target="_blank" rel="noopener noreferrer"
            className="ml-1 px-3 py-1.5 rounded-lg text-[13px] text-fg-dim hover:text-fg transition-colors">
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border-subtle bg-bg/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="max-h-[75vh] overflow-y-auto p-4 space-y-4">
              {menus.map((m) => (
                <div key={m.label}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-fg-dim mb-1.5 px-1">{m.label}</p>
                  <div className="space-y-0.5">
                    {m.items.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-3 py-2.5 text-[13px] text-fg-muted hover:text-fg hover:bg-bg-elevated transition-colors">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-border-subtle space-y-1">
                <Link href="/hi-fai" onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-emerald hover:bg-bg-elevated">🖐️ Hi FAI</Link>
                <Link href="/chatbot" onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-amber hover:bg-bg-elevated">✨ Agent FAI</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
