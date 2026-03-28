import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "CLI — FrootAI Commands",
  description:
    "FrootAI CLI — 8 commands for scaffolding, searching, cost estimation, validation, and diagnostics.",
};

const commands = [
  {
    name: "init",
    usage: "npx frootai init",
    description:
      "Initialize a new FrootAI project in the current directory. Creates config files, sets up recommended directory structure, and installs dependencies.",
    flags: [],
  },
  {
    name: "scaffold",
    usage: "npx frootai scaffold --play <number>",
    description:
      "Scaffold a solution play project with Bicep IaC, application code, evaluation pipeline, and deployment scripts.",
    flags: [
      { flag: "--play <number>", description: "Solution play number (01-20)" },
      { flag: "--output <dir>", description: "Output directory (default: current directory)" },
    ],
  },
  {
    name: "search",
    usage: 'npx frootai search "query"',
    description:
      "Semantic search across all 20 solution plays. Returns ranked results with confidence scores.",
    flags: [
      { flag: "--top <n>", description: "Number of results (default: 3)" },
    ],
  },
  {
    name: "cost",
    usage: "npx frootai cost --play <number>",
    description:
      "Estimate monthly Azure costs for a solution play at dev or production scale.",
    flags: [
      { flag: "--play <number>", description: "Solution play number" },
      { flag: "--scale <dev|prod>", description: "Scale tier (default: dev)" },
    ],
  },
  {
    name: "validate",
    usage: "npx frootai validate",
    description:
      "Validate project configuration files (openai.json, guardrails.json) against best practices.",
    flags: [],
  },
  {
    name: "validate --waf",
    usage: "npx frootai validate --waf",
    description:
      "Run Well-Architected Framework compliance checks across all 6 pillars: Reliability, Security, Cost, Operations, Performance, and Responsible AI.",
    flags: [],
  },
  {
    name: "doctor",
    usage: "npx frootai doctor",
    description:
      "Run diagnostics to check your environment — Node.js version, Azure CLI, required tools, and configuration.",
    flags: [],
  },
  {
    name: "help",
    usage: "npx frootai help",
    description:
      "Show help information and list all available commands with usage examples.",
    flags: [],
  },
];

export default function CliPage() {
  return (
    <PageShell
      title="⚡ CLI"
      subtitle="8 commands for scaffolding, searching, validating, and managing FrootAI projects."
      backLink={{ label: "Back to Developer Hub", href: "/dev-hub" }}
    >
      {/* Usage */}
      <div className="rounded-xl border border-froot-amber/30 bg-froot-amber/5 p-6">
        <h2 className="text-lg font-bold text-white">Usage</h2>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-amber">
          <code>npx frootai &lt;command&gt; [options]</code>
        </pre>
        <p className="mt-3 text-sm text-gray-400">
          No installation required — run directly with npx. Requires Node.js 18+.
        </p>
      </div>

      {/* Commands */}
      <div className="mt-10 space-y-6">
        {commands.map((cmd) => (
          <div
            key={cmd.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center gap-3">
              <code className="text-lg font-bold text-froot-amber">
                {cmd.name}
              </code>
            </div>

            <pre className="mt-3 overflow-x-auto rounded-lg bg-black/40 p-3 text-sm text-froot-emerald">
              <code>{cmd.usage}</code>
            </pre>

            <p className="mt-3 text-gray-300">{cmd.description}</p>

            {cmd.flags.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-400">
                  Options
                </p>
                <div className="space-y-2">
                  {cmd.flags.map((f) => (
                    <div
                      key={f.flag}
                      className="flex items-start gap-4 text-sm"
                    >
                      <code className="shrink-0 text-froot-cyan">
                        {f.flag}
                      </code>
                      <span className="text-gray-400">{f.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Reference */}
      <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Quick Reference</h2>
        <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-emerald">
          <code>{`npx frootai init                    # Initialize project
npx frootai scaffold --play 01       # Scaffold Enterprise RAG
npx frootai search "voice AI"        # Search solution plays
npx frootai cost --play 04 --scale prod  # Cost estimate
npx frootai validate                 # Validate config
npx frootai validate --waf           # WAF compliance check
npx frootai doctor                   # Environment diagnostics
npx frootai help                     # Show help`}</code>
        </pre>
      </div>

      {/* Links */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/setup-guide"
          className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          Setup Guide →
        </Link>
        <Link
          href="/mcp-tooling"
          className="rounded-lg bg-froot-cyan/20 px-6 py-3 font-medium text-froot-cyan transition hover:bg-froot-cyan/30"
        >
          MCP Server →
        </Link>
      </div>
    </PageShell>
  );
}
