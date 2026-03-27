import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Docker — FrootAI MCP Server",
  description:
    "Run the FrootAI MCP server in Docker — multi-arch support for amd64 and arm64.",
};

const commands = [
  {
    label: "Pull the image",
    code: "docker pull ghcr.io/gitpavleenbali/frootai-mcp:latest",
  },
  {
    label: "Run the server",
    code: "docker run -p 3000:3000 ghcr.io/gitpavleenbali/frootai-mcp:latest",
  },
  {
    label: "Run in background",
    code: "docker run -d --name frootai-mcp -p 3000:3000 ghcr.io/gitpavleenbali/frootai-mcp:latest",
  },
  {
    label: "Run with environment variables",
    code: "docker run -d \\\n  --name frootai-mcp \\\n  -p 3000:3000 \\\n  -e NODE_ENV=production \\\n  ghcr.io/gitpavleenbali/frootai-mcp:latest",
  },
];

const architectures = [
  { arch: "linux/amd64", description: "Intel/AMD 64-bit — servers, desktops, CI/CD" },
  { arch: "linux/arm64", description: "ARM 64-bit — Apple Silicon, AWS Graviton, Raspberry Pi" },
];

const dockerComposeExample = `version: "3.8"
services:
  frootai-mcp:
    image: ghcr.io/gitpavleenbali/frootai-mcp:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3`;

export default function DockerPage() {
  return (
    <PageShell
      title="🐳 Docker"
      subtitle="Run the FrootAI MCP server in a container — multi-arch, production-ready."
      backLink={{ label: "Back to Setup Guide", href: "/setup-guide" }}
    >
      {/* Image info */}
      <div className="rounded-xl border border-froot-cyan/30 bg-froot-cyan/5 p-6">
        <h2 className="text-lg font-bold text-white">Container Image</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-cyan">
          <code>ghcr.io/gitpavleenbali/frootai-mcp:latest</code>
        </pre>
      </div>

      {/* Quick Start Commands */}
      <div className="mt-10">
        <h2 className="mb-6 text-xl font-bold text-white">Quick Start</h2>
        <div className="space-y-4">
          {commands.map((cmd) => (
            <div
              key={cmd.label}
              className="rounded-xl border border-white/10 bg-white/5 p-5"
            >
              <p className="mb-2 text-sm font-medium text-gray-400">
                {cmd.label}
              </p>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-emerald">
                <code>{cmd.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Architectures */}
      <div className="mt-10">
        <h2 className="mb-6 text-xl font-bold text-white">
          Multi-Architecture Support
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {architectures.map((a) => (
            <div
              key={a.arch}
              className="rounded-xl border border-white/10 bg-white/5 p-6"
            >
              <code className="text-sm font-bold text-froot-cyan">
                {a.arch}
              </code>
              <p className="mt-2 text-sm text-gray-400">{a.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Docker Compose */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-white">Docker Compose</h2>
        <pre className="overflow-x-auto rounded-2xl bg-black/40 p-6 text-sm text-froot-emerald">
          <code>{dockerComposeExample}</code>
        </pre>
      </div>

      {/* Links */}
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/mcp-tooling"
          className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          MCP Server Docs →
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
