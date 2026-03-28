import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Setup Guide — Step-by-Step",
  description:
    "Complete setup guide for FrootAI — MCP Server, VS Code Extension, CLI, and Docker.",
};

const sections = [
  {
    id: "mcp-server",
    title: "MCP Server",
    icon: "🔌",
    color: "text-froot-emerald",
    border: "border-froot-emerald/30",
    bg: "bg-froot-emerald/5",
    methods: [
      {
        name: "npm (recommended)",
        steps: [
          "Install Node.js 18+ if not already installed",
          "Run: npm install -g frootai-mcp",
          "Start server: frootai-mcp",
          "Verify: curl http://localhost:3000/health",
        ],
        code: "npm install -g frootai-mcp\nfrootai-mcp",
      },
      {
        name: "npx (no install)",
        steps: [
          "Run directly: npx frootai-mcp@latest",
          "Server starts on port 3000",
        ],
        code: "npx frootai-mcp@latest",
      },
      {
        name: "Docker",
        steps: [
          "Pull: docker pull ghcr.io/gitpavleenbali/frootai-mcp:latest",
          "Run: docker run -p 3000:3000 ghcr.io/gitpavleenbali/frootai-mcp",
        ],
        code: "docker pull ghcr.io/gitpavleenbali/frootai-mcp:latest\ndocker run -p 3000:3000 ghcr.io/gitpavleenbali/frootai-mcp",
      },
      {
        name: "GitHub (from source)",
        steps: [
          "Clone: git clone https://github.com/gitpavleenbali/frootai.git",
          "Navigate: cd frootai/mcp-server",
          "Install: npm install",
          "Start: npm start",
        ],
        code: "git clone https://github.com/gitpavleenbali/frootai.git\ncd frootai/mcp-server\nnpm install\nnpm start",
      },
    ],
  },
  {
    id: "vscode",
    title: "VS Code Extension",
    icon: "💻",
    color: "text-froot-indigo",
    border: "border-froot-indigo/30",
    bg: "bg-froot-indigo/5",
    methods: [
      {
        name: "Marketplace",
        steps: [
          "Open VS Code",
          "Go to Extensions (Ctrl+Shift+X)",
          'Search for "FrootAI"',
          "Click Install",
        ],
        code: "ext install pavleenbali.frootai",
      },
      {
        name: "Direct link",
        steps: [
          "Visit the VS Code Marketplace page",
          'Click "Install"',
        ],
        code: "https://marketplace.visualstudio.com/items?itemName=pavleenbali.frootai",
      },
    ],
  },
  {
    id: "cli",
    title: "CLI",
    icon: "⚡",
    color: "text-froot-amber",
    border: "border-froot-amber/30",
    bg: "bg-froot-amber/5",
    methods: [
      {
        name: "npx (recommended)",
        steps: [
          "No installation needed",
          "Run: npx frootai <command>",
          "Available commands: init, scaffold, search, cost, validate, doctor, help",
        ],
        code: "npx frootai init\nnpx frootai scaffold --play 01\nnpx frootai doctor",
      },
    ],
  },
  {
    id: "docker",
    title: "Docker",
    icon: "🐳",
    color: "text-froot-cyan",
    border: "border-froot-cyan/30",
    bg: "bg-froot-cyan/5",
    methods: [
      {
        name: "Container",
        steps: [
          "Pull: docker pull ghcr.io/gitpavleenbali/frootai-mcp:latest",
          "Run: docker run -p 3000:3000 ghcr.io/gitpavleenbali/frootai-mcp",
          "Supports amd64 and arm64",
        ],
        code: "docker pull ghcr.io/gitpavleenbali/frootai-mcp:latest\ndocker run -d -p 3000:3000 --name frootai ghcr.io/gitpavleenbali/frootai-mcp",
      },
    ],
  },
];

export default function SetupGuidePage() {
  return (
    <PageShell
      title="📋 Setup Guide"
      subtitle="Step-by-step instructions for every FrootAI installation method."
      badge="Step-by-Step"
      badgeColor="#14b8a6"
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      {/* Table of Contents */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">On This Page</h2>
        <div className="flex flex-wrap gap-3">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`rounded-lg bg-white/5 px-4 py-2 text-sm ${s.color} hover:bg-white/10`}
            >
              {s.icon} {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="mt-10 space-y-12">
        {sections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className={`rounded-2xl border ${section.border} ${section.bg} p-8`}
          >
            <h2 className={`text-2xl font-bold ${section.color}`}>
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </h2>

            <div className="mt-6 space-y-6">
              {section.methods.map((method) => (
                <div
                  key={method.name}
                  className="rounded-xl border border-white/10 bg-black/20 p-6"
                >
                  <h3 className="font-bold text-white">{method.name}</h3>
                  <ol className="mt-3 space-y-2">
                    {method.steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <span className={`font-bold ${section.color}`}>
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-emerald">
                    <code>{method.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Need Help */}
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          Need help? Check the{" "}
          <Link href="/docs/admin-guide" className="text-froot-emerald hover:underline">
            Admin Guide
          </Link>{" "}
          or open an issue on{" "}
          <a
            href="https://github.com/gitpavleenbali/frootai/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-froot-emerald hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </PageShell>
  );
}
