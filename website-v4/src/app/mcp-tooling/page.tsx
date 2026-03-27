import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "MCP Server — 22 AI Architecture Tools",
  description:
    "Install the FrootAI MCP server for 22 intelligent AI architecture tools in Claude Desktop, VS Code, and any MCP client.",
};

const tools = [
  "get_froot_overview",
  "get_module",
  "list_modules",
  "search_knowledge",
  "lookup_term",
  "list_community_plays",
  "semantic_search_plays",
  "compare_plays",
  "estimate_cost",
  "compare_models",
  "get_model_catalog",
  "get_azure_pricing",
  "get_architecture_pattern",
  "generate_architecture_diagram",
  "fetch_azure_docs",
  "fetch_external_mcp",
  "get_github_agentic_os",
  "validate_config",
  "agent_build",
  "agent_review",
  "agent_tune",
  "embedding_playground",
];

const installMethods = [
  {
    title: "npm (recommended)",
    code: "npm install -g frootai-mcp\n\n# Or run directly\nnpx frootai-mcp@latest",
    icon: "📦",
  },
  {
    title: "Docker",
    code: "docker pull ghcr.io/gitpavleenbali/frootai-mcp:latest\ndocker run -p 3000:3000 ghcr.io/gitpavleenbali/frootai-mcp",
    icon: "🐳",
  },
  {
    title: "GitHub",
    code: "git clone https://github.com/gitpavleenbali/frootai.git\ncd frootai/mcp-server\nnpm install && npm start",
    icon: "🐙",
  },
];

const clientConfigs = [
  {
    title: "Claude Desktop",
    file: "claude_desktop_config.json",
    code: `{
  "mcpServers": {
    "frootai": {
      "command": "npx",
      "args": ["frootai-mcp@latest"]
    }
  }
}`,
  },
  {
    title: "VS Code",
    file: ".vscode/mcp.json",
    code: `{
  "servers": {
    "frootai": {
      "command": "npx",
      "args": ["frootai-mcp@latest"]
    }
  }
}`,
  },
];

export default function McpToolingPage() {
  return (
    <PageShell
      title="🔌 MCP Server"
      subtitle="22 intelligent AI architecture tools accessible from any MCP-compatible client."
      badge="22 Tools"
      badgeColor="#10b981"
      backLink={{ label: "Back to Ecosystem", href: "/ecosystem" }}
    >
      {/* Install Methods */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-white">Installation</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {installMethods.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{m.icon}</span>
                <h3 className="font-bold text-white">{m.title}</h3>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-emerald">
                <code>{m.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Client Configuration */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          Client Configuration
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {clientConfigs.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="font-bold text-white">{c.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{c.file}</p>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-cyan">
                <code>{c.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          All 22 Tools
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="h-2 w-2 rounded-full bg-froot-emerald" />
              <code className="text-sm text-gray-300">{tool}</code>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-wrap gap-4">
        <a
          href="https://www.npmjs.com/package/frootai-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          View on npm ↗
        </a>
        <Link
          href="/docker"
          className="rounded-lg bg-froot-cyan/20 px-6 py-3 font-medium text-froot-cyan transition hover:bg-froot-cyan/30"
        >
          Docker Setup →
        </Link>
        <Link
          href="/api-docs"
          className="rounded-lg bg-froot-indigo/20 px-6 py-3 font-medium text-froot-indigo transition hover:bg-froot-indigo/30"
        >
          REST API Docs →
        </Link>
      </div>
    </PageShell>
  );
}
