import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "FrootAI release history — latest changes, new features, and improvements.",
};

const releases = [
  {
    version: "v3.2.0",
    date: "March 27, 2026",
    badge: "Latest",
    badgeColor: "bg-froot-emerald/20 text-froot-emerald",
    sections: [
      {
        type: "Added",
        color: "text-froot-emerald",
        items: [
          "Next.js website v2 with App Router, dark theme, and responsive design",
          "Solution Play Configurator with multi-step wizard and architecture preview",
          "Python SDK (preview) for programmatic access to FrootAI tools",
          "Docker multi-arch support (amd64 + arm64)",
          "Embedding playground MCP tool for semantic similarity exploration",
          "Well-Architected Framework compliance checker in CLI",
          "6 new WAF instruction files for Copilot customization",
        ],
      },
      {
        type: "Changed",
        color: "text-froot-amber",
        items: [
          "MCP server upgraded to 22 tools (from 16)",
          "VS Code extension upgraded to 16 commands (from 13)",
          "Knowledge base expanded with F4 (GitHub Agentic OS) module",
          "Cost estimator now includes detailed Azure pricing breakdowns",
          "Solution play cards redesigned with architecture diagrams",
        ],
      },
      {
        type: "Fixed",
        color: "text-froot-cyan",
        items: [
          "Search relevance improvements for solution play queries",
          "Cost estimation accuracy for multi-region deployments",
          "MCP server stability under heavy concurrent usage",
          "VS Code extension activation performance on large workspaces",
        ],
      },
    ],
  },
  {
    version: "v3.1.2",
    date: "March 26, 2026",
    badge: "Previous",
    badgeColor: "bg-white/10 text-gray-400",
    sections: [
      {
        type: "Added",
        color: "text-froot-emerald",
        items: [
          "Play 19: Edge AI with Phi-4 for low-latency inference",
          "Play 20: Anomaly Detection for time-series data",
          "REST API streaming endpoint (POST /chat/stream)",
          "Plugin marketplace with ServiceNow, Salesforce, and SAP plugins",
        ],
      },
      {
        type: "Changed",
        color: "text-froot-amber",
        items: [
          "Updated all plays to latest Azure API versions (2025-03)",
          "Improved MCP server startup time by 40%",
          "Refactored knowledge base build pipeline",
        ],
      },
      {
        type: "Fixed",
        color: "text-froot-cyan",
        items: [
          "Docker container health check endpoint reliability",
          "Architecture diagram generation for complex multi-service plays",
          "OpenAPI spec validation errors on /chat endpoint",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PageShell
      title="📰 Changelog"
      subtitle="Release history — every new feature, improvement, and bug fix."
      backLink={{ label: "Back to Developer Hub", href: "/dev-hub" }}
    >
      <div className="space-y-12">
        {releases.map((release) => (
          <div
            key={release.version}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                {release.version}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${release.badgeColor}`}
              >
                {release.badge}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-400">{release.date}</p>

            {/* Sections */}
            <div className="mt-6 space-y-6">
              {release.sections.map((section) => (
                <div key={section.type}>
                  <h3 className={`mb-3 text-lg font-bold ${section.color}`}>
                    {section.type}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <span className={`mt-0.5 ${section.color}`}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400">
          Full commit history available on{" "}
          <a
            href="https://github.com/gitpavleenbali/frootai/commits/main"
            target="_blank"
            rel="noopener noreferrer"
            className="text-froot-emerald hover:underline"
          >
            GitHub ↗
          </a>
        </p>
        <Link
          href="/dev-hub"
          className="mt-4 inline-block rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          Back to Developer Hub →
        </Link>
      </div>
    </PageShell>
  );
}
