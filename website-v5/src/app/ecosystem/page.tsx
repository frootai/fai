import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "FAI Ecosystem",
  description:
    "Explore the FrootAI ecosystem — 20 Solution Plays, 18 knowledge modules, 22 MCP tools, and 16 VS Code commands.",
};

const lenses = [
  {
    icon: "🔭",
    title: "Telescope — Big Picture",
    description: "Architecture frameworks and production-ready solutions",
    items: [
      {
        label: "Solution Plays",
        count: 20,
        description:
          "End-to-end Azure AI architectures with Bicep IaC, evaluation pipelines, and deployment automation.",
        href: "/solution-plays",
        color: "text-froot-amber",
        bg: "bg-froot-amber/10 border-froot-amber/30",
      },
      {
        label: "FROOT Packages",
        count: 23,
        description:
          "18 knowledge modules across 5 layers (F/R/O/O/T) plus 5 developer toolkits for building, tuning, and deploying.",
        href: "/packages",
        color: "text-froot-emerald",
        bg: "bg-froot-emerald/10 border-froot-emerald/30",
      },
    ],
  },
  {
    icon: "🔬",
    title: "Microscope — Details",
    description: "Developer tools and integrations",
    items: [
      {
        label: "MCP Server",
        count: 22,
        description:
          "22 intelligent tools accessible from Claude Desktop, VS Code, and any MCP-compatible client.",
        href: "/mcp-tooling",
        color: "text-froot-cyan",
        bg: "bg-froot-cyan/10 border-froot-cyan/30",
      },
      {
        label: "VS Code Extension",
        count: 16,
        description:
          "16 commands, sidebar panels, and in-editor guidance for AI architecture development.",
        href: "/vscode-extension",
        color: "text-froot-indigo",
        bg: "bg-froot-indigo/10 border-froot-indigo/30",
      },
    ],
  },
];

const highlights = [
  { stat: "20", label: "Solution Plays", color: "text-froot-amber" },
  { stat: "22", label: "MCP Tools", color: "text-froot-cyan" },
  { stat: "18", label: "Knowledge Modules", color: "text-froot-emerald" },
  { stat: "5", label: "Developer Kits", color: "text-froot-violet" },
  { stat: "16", label: "VS Code Commands", color: "text-froot-indigo" },
  { stat: "200+", label: "Glossary Terms", color: "text-froot-amber" },
];

export default function EcosystemPage() {
  return (
    <PageShell
      title="🔗 FAI Ecosystem"
      subtitle="Two lenses into the FrootAI universe — zoom out for the big picture, zoom in for the details."
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {highlights.map((h) => (
          <div
            key={h.label}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
          >
            <div className={`text-3xl font-bold ${h.color}`}>{h.stat}</div>
            <div className="mt-1 text-sm text-gray-400">{h.label}</div>
          </div>
        ))}
      </div>

      {/* Lenses */}
      <div className="mt-12 space-y-12">
        {lenses.map((lens) => (
          <div key={lens.title}>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">
                <span className="mr-2">{lens.icon}</span>
                {lens.title}
              </h2>
              <p className="mt-1 text-gray-400">{lens.description}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {lens.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group rounded-2xl border p-8 transition hover:scale-[1.02] ${item.bg}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-bold ${item.color}`}>
                      {item.label}
                    </h3>
                    <span
                      className={`rounded-full bg-white/10 px-3 py-1 text-sm font-bold ${item.color}`}
                    >
                      {item.count}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-300">{item.description}</p>
                  <span className="mt-4 inline-block text-sm text-gray-400 group-hover:text-white">
                    Explore →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <p className="text-gray-400">
          Ready to get started?
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link
            href="/hi-fai"
            className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
          >
            5-Minute Quickstart
          </Link>
          <Link
            href="/configurator"
            className="rounded-lg bg-froot-amber/20 px-6 py-3 font-medium text-froot-amber transition hover:bg-froot-amber/30"
          >
            Solution Configurator
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
