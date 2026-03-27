import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "FROOT Packages — 18 Modules + 5 Toolkits",
  description:
    "Explore the 18 FROOT knowledge modules across 5 layers and 5 developer toolkits.",
};

const layers = [
  {
    letter: "F",
    name: "Foundations",
    color: "text-froot-emerald",
    border: "border-froot-emerald/30",
    bg: "bg-froot-emerald/5",
    modules: [
      { id: "F1", title: "GenAI Foundations", slug: "GenAI-Foundations" },
      { id: "F2", title: "LLM Landscape", slug: "LLM-Landscape" },
      { id: "F3", title: "AI Glossary A–Z", slug: "F3-AI-Glossary-AZ" },
      { id: "F4", title: "GitHub Agentic OS", slug: "F4-GitHub-Agentic-OS" },
    ],
  },
  {
    letter: "R",
    name: "Reasoning",
    color: "text-froot-cyan",
    border: "border-froot-cyan/30",
    bg: "bg-froot-cyan/5",
    modules: [
      { id: "R1", title: "Prompt Engineering", slug: "Prompt-Engineering" },
      { id: "R2", title: "RAG Architecture", slug: "RAG-Architecture" },
      { id: "R3", title: "Deterministic AI", slug: "R3-Deterministic-AI" },
    ],
  },
  {
    letter: "O",
    name: "Orchestration",
    color: "text-froot-amber",
    border: "border-froot-amber/30",
    bg: "bg-froot-amber/5",
    modules: [
      { id: "O1", title: "Semantic Kernel", slug: "Semantic-Kernel" },
      { id: "O2", title: "AI Agents Deep Dive", slug: "AI-Agents-Deep-Dive" },
      { id: "O3", title: "MCP, Tools & Functions", slug: "O3-MCP-Tools-Functions" },
      { id: "O4", title: "Azure AI Foundry", slug: "Azure-AI-Foundry" },
      { id: "O5", title: "AI Infrastructure", slug: "AI-Infrastructure" },
      { id: "O6", title: "Copilot Ecosystem", slug: "Copilot-Ecosystem" },
    ],
  },
  {
    letter: "O",
    name: "Operations",
    color: "text-froot-indigo",
    border: "border-froot-indigo/30",
    bg: "bg-froot-indigo/5",
    modules: [
      { id: "T1", title: "Fine-Tuning & MLOps", slug: "T1-Fine-Tuning-MLOps" },
      { id: "T2", title: "Responsible AI & Safety", slug: "Responsible-AI-Safety" },
    ],
  },
  {
    letter: "T",
    name: "Transformation",
    color: "text-froot-violet",
    border: "border-froot-violet/30",
    bg: "bg-froot-violet/5",
    modules: [
      { id: "T3", title: "Production Patterns", slug: "T3-Production-Patterns" },
      { id: "QR", title: "Quick Reference Cards", slug: "Quick-Reference-Cards" },
      { id: "QA", title: "Quiz & Assessment", slug: "Quiz-Assessment" },
    ],
  },
];

const toolkits = [
  {
    name: "MCP ServerKit",
    description: "22 intelligent tools for AI architecture guidance via Model Context Protocol.",
    href: "/mcp-tooling",
    icon: "🔌",
  },
  {
    name: "DevKit",
    description: "VS Code extension with 16 commands, sidebar panels, and in-editor AI guidance.",
    href: "/vscode-extension",
    icon: "🛠️",
  },
  {
    name: "TuneKit",
    description: "Configuration validation, prompt optimization, and evaluation benchmarks.",
    href: "/eval-dashboard",
    icon: "🎯",
  },
  {
    name: "SpecKit",
    description: "Feature spec templates, solution play scaffolding, and architecture blueprints.",
    href: "/feature-spec",
    icon: "📋",
  },
  {
    name: "InfraKit",
    description: "Bicep IaC modules, deployment scripts, and Azure landing zone templates.",
    href: "/solution-plays",
    icon: "☁️",
  },
];

export default function PackagesPage() {
  return (
    <PageShell
      title="📦 FROOT Packages"
      subtitle="18 knowledge modules across 5 layers + 5 developer toolkits — everything you need to build enterprise AI."
      backLink={{ label: "Back to Ecosystem", href: "/ecosystem" }}
    >
      {/* FROOT Layers */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white">
          Knowledge Modules — 5 Layers
        </h2>

        {layers.map((layer) => (
          <div
            key={layer.name}
            className={`rounded-2xl border ${layer.border} ${layer.bg} p-6`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold ${layer.color}`}
              >
                {layer.letter}
              </span>
              <h3 className={`text-xl font-bold ${layer.color}`}>
                {layer.name}
              </h3>
              <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs text-gray-400">
                {layer.modules.length} modules
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {layer.modules.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/docs/${mod.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <span className={`text-sm font-bold ${layer.color}`}>
                    {mod.id}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white">
                    {mod.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Toolkits */}
      <div className="mt-16 space-y-8">
        <h2 className="text-2xl font-bold text-white">
          Developer Toolkits — 5 Kits
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {toolkits.map((kit) => (
            <Link
              key={kit.name}
              href={kit.href}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-froot-emerald/30 hover:bg-white/10"
            >
              <div className="text-3xl">{kit.icon}</div>
              <h3 className="mt-3 text-lg font-bold text-white">
                {kit.name}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {kit.description}
              </p>
              <span className="mt-4 inline-block text-sm text-froot-emerald opacity-0 transition group-hover:opacity-100">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
