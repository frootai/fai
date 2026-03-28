import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "VS Code Extension — 16 Commands",
  description:
    "Install the FrootAI VS Code extension for in-editor AI architecture guidance, solution play scaffolding, and 16 commands.",
};

const commands = [
  { name: "frootai.showOverview", description: "Show FROOT framework overview" },
  { name: "frootai.browseModules", description: "Browse all 18 knowledge modules" },
  { name: "frootai.searchKnowledge", description: "Search across all modules" },
  { name: "frootai.lookupTerm", description: "Look up AI glossary term" },
  { name: "frootai.browsePlays", description: "Browse 20 solution plays" },
  { name: "frootai.searchPlays", description: "Semantic search for plays" },
  { name: "frootai.comparePlays", description: "Compare solution plays side-by-side" },
  { name: "frootai.estimateCost", description: "Estimate Azure costs for a play" },
  { name: "frootai.compareModels", description: "Compare AI models" },
  { name: "frootai.modelCatalog", description: "View model catalog" },
  { name: "frootai.architecturePattern", description: "Get architecture pattern guidance" },
  { name: "frootai.generateDiagram", description: "Generate architecture diagram" },
  { name: "frootai.validateConfig", description: "Validate TuneKit configuration" },
  { name: "frootai.agentBuild", description: "Build agent workflow" },
  { name: "frootai.agentReview", description: "Review agent implementation" },
  { name: "frootai.agentTune", description: "Tune agent configuration" },
];

const panels = [
  {
    title: "Explorer Panel",
    description: "Browse solution plays, modules, and the glossary from the sidebar.",
    icon: "📂",
  },
  {
    title: "Play Detail View",
    description: "View architecture diagrams, cost estimates, and deployment steps inline.",
    icon: "🏗️",
  },
  {
    title: "Knowledge Panel",
    description: "Read FROOT modules and search across the entire knowledge base.",
    icon: "📚",
  },
  {
    title: "Cost Estimator",
    description: "Get real-time Azure cost breakdowns for dev and production scales.",
    icon: "💰",
  },
];

export default function VscodeExtensionPage() {
  return (
    <PageShell
      title="💻 VS Code Extension"
      subtitle="AI architecture guidance directly in your editor — 16 commands, sidebar panels, and intelligent code suggestions."
      badge="16 Commands"
      badgeColor="#6366f1"
      backLink={{ label: "Back to Ecosystem", href: "/ecosystem" }}
    >
      {/* Install */}
      <div className="rounded-2xl border border-froot-indigo/30 bg-froot-indigo/5 p-8">
        <h2 className="text-xl font-bold text-white">Install</h2>
        <p className="mt-2 text-gray-300">
          Install from the Visual Studio Code Marketplace or search for
          &ldquo;FrootAI&rdquo; in the Extensions tab.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <a
            href="https://marketplace.visualstudio.com/items?itemName=pavleenbali.frootai"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-froot-indigo/20 px-6 py-3 font-medium text-froot-indigo transition hover:bg-froot-indigo/30"
          >
            Install from Marketplace ↗
          </a>
          <div className="flex items-center gap-2">
            <pre className="rounded-lg bg-black/40 px-4 py-3 text-sm text-froot-emerald">
              <code>ext install pavleenbali.frootai</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">Sidebar Panels</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {panels.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-3xl">{p.icon}</div>
              <h3 className="mt-3 font-bold text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commands */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          All 16 Commands
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-gray-400">
                  Command
                </th>
                <th className="px-6 py-3 text-sm font-medium text-gray-400">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {commands.map((cmd) => (
                <tr key={cmd.name} className="hover:bg-white/5">
                  <td className="px-6 py-3">
                    <code className="text-sm text-froot-indigo">
                      {cmd.name}
                    </code>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-300">
                    {cmd.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Links */}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/mcp-tooling"
          className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          MCP Server →
        </Link>
        <Link
          href="/setup-guide"
          className="rounded-lg bg-froot-cyan/20 px-6 py-3 font-medium text-froot-cyan transition hover:bg-froot-cyan/30"
        >
          Full Setup Guide →
        </Link>
      </div>
    </PageShell>
  );
}
