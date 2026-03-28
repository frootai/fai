import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Knowledge Modules",
  description: "18 knowledge modules organized in the FROOT framework — Foundations, Reasoning, Orchestration, Operations, Transformation.",
};

const layers = [
  { id: "F", title: "Foundations", color: "#f59e0b", icon: "🌱", modules: [
    { id: "F1", name: "GenAI Foundations", slug: "GenAI-Foundations" },
    { id: "F2", name: "LLM Landscape", slug: "LLM-Landscape" },
    { id: "F3", name: "AI Glossary A–Z", slug: "F3-AI-Glossary-AZ" },
    { id: "F4", name: ".github Agentic OS", slug: "F4-GitHub-Agentic-OS" },
  ]},
  { id: "R", title: "Reasoning", color: "#10b981", icon: "🪵", modules: [
    { id: "R1", name: "Prompt Engineering", slug: "Prompt-Engineering" },
    { id: "R2", name: "RAG Architecture", slug: "RAG-Architecture" },
    { id: "R3", name: "Deterministic AI", slug: "R3-Deterministic-AI" },
  ]},
  { id: "O¹", title: "Orchestration", color: "#06b6d4", icon: "🌿", modules: [
    { id: "O1", name: "Semantic Kernel", slug: "Semantic-Kernel" },
    { id: "O2", name: "AI Agents Deep Dive", slug: "AI-Agents-Deep-Dive" },
    { id: "O3", name: "MCP & Tools", slug: "O3-MCP-Tools-Functions" },
  ]},
  { id: "O²", title: "Operations", color: "#6366f1", icon: "🍃", modules: [
    { id: "O4", name: "Azure AI Foundry", slug: "Azure-AI-Foundry" },
    { id: "O5", name: "AI Infrastructure", slug: "AI-Infrastructure" },
    { id: "O6", name: "Copilot Ecosystem", slug: "Copilot-Ecosystem" },
  ]},
  { id: "T", title: "Transformation", color: "#7c3aed", icon: "🍎", modules: [
    { id: "T1", name: "Fine-Tuning & MLOps", slug: "T1-Fine-Tuning-MLOps" },
    { id: "T2", name: "Responsible AI & Safety", slug: "Responsible-AI-Safety" },
    { id: "T3", name: "Production Patterns", slug: "T3-Production-Patterns" },
  ]},
];

const reference = [
  { name: "Quick Reference Cards", slug: "Quick-Reference-Cards" },
  { name: "Quiz & Assessment", slug: "Quiz-Assessment" },
];

const devHub = [
  { name: "Admin Guide", slug: "admin-guide" },
  { name: "User Guide (Complete)", slug: "user-guide-complete" },
  { name: "Contributor Guide", slug: "contributor-guide" },
  { name: "API Reference", slug: "api-reference" },
  { name: "Architecture Overview", slug: "architecture-overview" },
];

export default function DocsIndexPage() {
  return (
    <PageShell
      title="📖 Knowledge Modules"
      subtitle="18 modules organized in 5 FROOT layers. From GenAI foundations to production patterns."
      badge="FROOT Framework"
      badgeColor="#6366f1"
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {layers.map((layer) => (
          <div key={layer.id}>
            <h3 className="text-[15px] font-bold flex items-center gap-2 mb-3" style={{ color: layer.color }}>
              <span>{layer.icon}</span> {layer.id} — {layer.title}
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {layer.modules.map((m) => (
                <Link
                  key={m.id}
                  href={`/docs/${m.slug}`}
                  className="rounded-lg border border-border p-3 transition-all hover:border-white/15 hover:bg-white/[0.02]"
                >
                  <span className="text-[12px] font-bold" style={{ color: layer.color }}>{m.id}</span>
                  <span className="text-[13px] ml-2">{m.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-[15px] font-bold flex items-center gap-2 mb-3 text-muted-foreground">
            📋 Reference
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {reference.map((m) => (
              <Link key={m.slug} href={`/docs/${m.slug}`} className="rounded-lg border border-border p-3 text-[13px] transition-all hover:border-white/15 hover:bg-white/[0.02]">
                {m.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-bold flex items-center gap-2 mb-3 text-muted-foreground">
            🛠️ Developer Hub
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {devHub.map((m) => (
              <Link key={m.slug} href={`/docs/${m.slug}`} className="rounded-lg border border-border p-3 text-[13px] transition-all hover:border-white/15 hover:bg-white/[0.02]">
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
