import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Feature Spec — Comprehensive Overview",
  description:
    "FrootAI feature specification — 16 sections covering solution plays, toolkits, MCP tools, VS Code commands, API, and roadmap.",
};

const featureSections = [
  {
    category: "Solution Plays",
    color: "text-froot-amber",
    items: [
      { feature: "Enterprise RAG Chatbot", id: "01", status: "GA" },
      { feature: "AI Landing Zone", id: "02", status: "GA" },
      { feature: "Deterministic Agent", id: "03", status: "GA" },
      { feature: "Call Center Voice AI", id: "04", status: "GA" },
      { feature: "IT Ticket Resolution", id: "05", status: "GA" },
      { feature: "Document Intelligence", id: "06", status: "GA" },
      { feature: "Multi-Agent Service", id: "07", status: "GA" },
      { feature: "Copilot Studio Bot", id: "08", status: "GA" },
      { feature: "AI Search Portal", id: "09", status: "GA" },
      { feature: "Content Moderation", id: "10", status: "GA" },
      { feature: "Advanced Landing Zone", id: "11", status: "GA" },
      { feature: "Model Serving AKS", id: "12", status: "GA" },
      { feature: "Fine-Tuning Workflow", id: "13", status: "GA" },
      { feature: "Cost-Optimized AI Gateway", id: "14", status: "GA" },
      { feature: "Multi-Modal DocProc", id: "15", status: "GA" },
      { feature: "Copilot Teams Extension", id: "16", status: "GA" },
      { feature: "AI Observability", id: "17", status: "GA" },
      { feature: "Prompt Management", id: "18", status: "GA" },
      { feature: "Edge AI Phi-4", id: "19", status: "GA" },
      { feature: "Anomaly Detection", id: "20", status: "GA" },
    ],
  },
  {
    category: "Developer Toolkits",
    color: "text-froot-emerald",
    items: [
      { feature: "MCP ServerKit — 22 tools", id: "mcp", status: "GA" },
      { feature: "DevKit — VS Code Extension", id: "vscode", status: "GA" },
      { feature: "TuneKit — Config validation", id: "tune", status: "GA" },
      { feature: "SpecKit — Feature spec templates", id: "spec", status: "GA" },
      { feature: "InfraKit — Bicep IaC modules", id: "infra", status: "GA" },
    ],
  },
  {
    category: "MCP Tools",
    color: "text-froot-cyan",
    items: [
      { feature: "get_froot_overview", id: "t1", status: "GA" },
      { feature: "get_module / list_modules", id: "t2", status: "GA" },
      { feature: "search_knowledge / lookup_term", id: "t3", status: "GA" },
      { feature: "list/search/compare plays", id: "t4", status: "GA" },
      { feature: "estimate_cost / compare_models", id: "t5", status: "GA" },
      { feature: "get_architecture_pattern", id: "t6", status: "GA" },
      { feature: "generate_architecture_diagram", id: "t7", status: "GA" },
      { feature: "agent_build / agent_review / agent_tune", id: "t8", status: "GA" },
      { feature: "fetch_azure_docs / fetch_external_mcp", id: "t9", status: "GA" },
      { feature: "validate_config / embedding_playground", id: "t10", status: "GA" },
    ],
  },
  {
    category: "VS Code Commands",
    color: "text-froot-indigo",
    items: [
      { feature: "16 commands for architecture guidance", id: "vsc1", status: "GA" },
      { feature: "Sidebar panels (Explorer, Knowledge, Cost)", id: "vsc2", status: "GA" },
      { feature: "Play detail views with diagrams", id: "vsc3", status: "GA" },
    ],
  },
  {
    category: "REST API",
    color: "text-froot-violet",
    items: [
      { feature: "GET /health", id: "api1", status: "GA" },
      { feature: "POST /search-plays", id: "api2", status: "GA" },
      { feature: "POST /estimate-cost", id: "api3", status: "GA" },
      { feature: "POST /chat + /chat/stream", id: "api4", status: "GA" },
      { feature: "GET /openapi.json", id: "api5", status: "GA" },
    ],
  },
  {
    category: "Roadmap",
    color: "text-froot-amber",
    items: [
      { feature: "Python SDK", id: "r1", status: "Preview" },
      { feature: "Terraform IaC support", id: "r2", status: "Planned" },
      { feature: "Multi-cloud plays (GCP, AWS)", id: "r3", status: "Planned" },
      { feature: "Visual architecture editor", id: "r4", status: "Planned" },
    ],
  },
];

export default function FeatureSpecPage() {
  return (
    <PageShell
      title="📋 Feature Spec"
      subtitle="Comprehensive feature specification — every play, tool, command, and API endpoint in one place."
      backLink={{ label: "Back to Developer Hub", href: "/dev-hub" }}
    >
      <div className="space-y-10">
        {featureSections.map((section) => (
          <div key={section.category}>
            <h2 className={`mb-4 text-xl font-bold ${section.color}`}>
              {section.category}
            </h2>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-5 py-3 text-sm font-medium text-gray-400">
                      Feature
                    </th>
                    <th className="px-5 py-3 text-right text-sm font-medium text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {section.items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-5 py-3 text-sm text-gray-300">
                        {item.feature}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "GA"
                              ? "bg-froot-emerald/20 text-froot-emerald"
                              : item.status === "Preview"
                              ? "bg-froot-amber/20 text-froot-amber"
                              : "bg-white/10 text-gray-400"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/dev-hub"
          className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          Developer Hub →
        </Link>
        <Link
          href="/dev-hub-changelog"
          className="rounded-lg bg-froot-indigo/20 px-6 py-3 font-medium text-froot-indigo transition hover:bg-froot-indigo/30"
        >
          Changelog →
        </Link>
      </div>
    </PageShell>
  );
}
