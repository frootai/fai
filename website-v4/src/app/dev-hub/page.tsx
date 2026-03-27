import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "FAI Developer Hub",
  description:
    "Developer resources, API reference, architecture docs, and tools for building with FrootAI.",
};

const quickLinks = [
  { title: "Feature Spec", href: "/feature-spec", icon: "📋", color: "text-froot-amber" },
  { title: "Admin Guide", href: "/docs/admin-guide", icon: "🔧", color: "text-froot-emerald" },
  { title: "User Guide", href: "/docs/user-guide-complete", icon: "📖", color: "text-froot-cyan" },
  { title: "API Reference", href: "/docs/api-reference", icon: "📡", color: "text-froot-indigo" },
  { title: "Contributor Guide", href: "/docs/contributor-guide", icon: "🤝", color: "text-froot-violet" },
  { title: "REST API", href: "/api-docs", icon: "🔗", color: "text-froot-amber" },
  { title: "Architecture", href: "/docs/architecture-overview", icon: "🏗️", color: "text-froot-emerald" },
  { title: "Eval Dashboard", href: "/eval-dashboard", icon: "📊", color: "text-froot-cyan" },
  { title: "Changelog", href: "/dev-hub-changelog", icon: "📰", color: "text-froot-indigo" },
];

const gettingStarted = [
  {
    step: 1,
    title: "Install",
    description: "Get the VS Code extension and MCP server",
    command: "npx frootai-mcp@latest",
  },
  {
    step: 2,
    title: "Scaffold",
    description: "Generate a solution play project",
    command: "npx frootai scaffold --play 01",
  },
  {
    step: 3,
    title: "Build",
    description: "Develop your AI solution with FrootAI guidance",
    command: "npx frootai validate --waf",
  },
  {
    step: 4,
    title: "Deploy",
    description: "Ship to Azure with Bicep IaC",
    command: "az deployment group create --template-file infra/main.bicep",
  },
];

export default function DevHubPage() {
  return (
    <PageShell
      title="🛠️ FAI Developer Hub"
      subtitle="Everything developers need to build, test, and deploy with FrootAI."
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      {/* Version banner */}
      <div className="flex items-center gap-4 rounded-xl border border-froot-emerald/30 bg-froot-emerald/5 px-6 py-4">
        <span className="rounded-full bg-froot-emerald/20 px-3 py-1 text-sm font-bold text-froot-emerald">
          v3.2.0
        </span>
        <span className="text-sm text-gray-300">
          Latest release — March 27, 2026
        </span>
        <Link
          href="/dev-hub-changelog"
          className="ml-auto text-sm text-froot-emerald hover:underline"
        >
          View Changelog →
        </Link>
      </div>

      {/* Quick Links Grid */}
      <div className="mt-10">
        <h2 className="mb-6 text-xl font-bold text-white">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className={`font-medium ${link.color} group-hover:underline`}>
                {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-white">Getting Started</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {gettingStarted.map((s) => (
            <div
              key={s.step}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-froot-emerald/20 text-sm font-bold text-froot-emerald">
                  {s.step}
                </span>
                <h3 className="font-bold text-white">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">{s.description}</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-sm text-froot-emerald">
                <code>{s.command}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* External Links */}
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <a
          href="https://github.com/gitpavleenbali/frootai"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition hover:bg-white/10"
        >
          <div className="text-3xl">🐙</div>
          <div className="mt-2 font-bold text-white">GitHub</div>
          <div className="mt-1 text-sm text-gray-400">Source code &amp; issues</div>
        </a>
        <a
          href="https://marketplace.visualstudio.com/items?itemName=pavleenbali.frootai"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition hover:bg-white/10"
        >
          <div className="text-3xl">💻</div>
          <div className="mt-2 font-bold text-white">VS Code Marketplace</div>
          <div className="mt-1 text-sm text-gray-400">Install extension</div>
        </a>
        <a
          href="https://www.npmjs.com/package/frootai-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/10 bg-white/5 p-6 text-center transition hover:bg-white/10"
        >
          <div className="text-3xl">📦</div>
          <div className="mt-2 font-bold text-white">npm</div>
          <div className="mt-1 text-sm text-gray-400">MCP server package</div>
        </a>
      </div>
    </PageShell>
  );
}
