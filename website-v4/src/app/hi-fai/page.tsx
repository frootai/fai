import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Hi FAI — 5-Minute Quickstart",
  description:
    "Get started with FrootAI in 5 minutes. Install the VS Code extension, configure the MCP server, pick a solution play, and deploy.",
};

const steps = [
  {
    num: 1,
    title: "Welcome to FrootAI",
    tagline: "From the Roots to the Fruits",
    description:
      "FrootAI is a comprehensive AI architecture framework that provides everything you need to build, deploy, and operate enterprise AI solutions on Azure.",
    icon: "🌱",
    color: "text-froot-emerald",
  },
  {
    num: 2,
    title: "Install VS Code Extension",
    tagline: "Your AI architecture copilot",
    description:
      "Install the FrootAI extension from the Visual Studio Code Marketplace for in-editor guidance, solution play scaffolding, and architecture recommendations.",
    icon: "💻",
    color: "text-froot-indigo",
    link: {
      label: "Install from Marketplace",
      href: "https://marketplace.visualstudio.com/items?itemName=pavleenbali.frootai",
      external: true,
    },
  },
  {
    num: 3,
    title: "Setup MCP Server",
    tagline: "22 AI architecture tools at your fingertips",
    description:
      "Run the MCP server for intelligent tool access in Claude Desktop, VS Code, and other MCP-compatible clients.",
    icon: "🔌",
    color: "text-froot-cyan",
    code: [
      { label: "Quick start", value: "npx frootai-mcp" },
      {
        label: "VS Code config",
        value: `// .vscode/mcp.json
{
  "servers": {
    "frootai": {
      "command": "npx",
      "args": ["frootai-mcp@latest"]
    }
  }
}`,
      },
    ],
  },
  {
    num: 4,
    title: "Pick a Solution Play",
    tagline: "20 production-ready architectures",
    description:
      "Browse the solution play catalog and pick the one that matches your use case — from Enterprise RAG to Edge AI to Multi-Agent orchestration.",
    icon: "🎯",
    color: "text-froot-amber",
    link: {
      label: "Open Configurator",
      href: "/configurator",
    },
  },
  {
    num: 5,
    title: "Deploy to Azure",
    tagline: "One command to production",
    description:
      "Every solution play ships with Bicep infrastructure-as-code. Deploy the entire stack with a single Azure CLI command.",
    icon: "🚀",
    color: "text-froot-violet",
    code: [
      {
        label: "Deploy",
        value:
          "az deployment group create \\\n  --resource-group myRG \\\n  --template-file infra/main.bicep \\\n  --parameters infra/main.bicepparam",
      },
    ],
  },
];

export default function HiFaiPage() {
  return (
    <PageShell
      title="🖐️ Hi FAI"
      subtitle="Get started with FrootAI in 5 minutes — from install to deploy."
      badge="5-Minute Quickstart"
      badgeColor="#10b981"
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      {/* Steps */}
      <div className="space-y-12">
        {steps.map((step) => (
          <div
            key={step.num}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <div className="flex items-start gap-6">
              {/* Step number */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">
                {step.num}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    <span className="mr-2">{step.icon}</span>
                    {step.title}
                  </h2>
                  <p className={`mt-1 text-sm font-medium ${step.color}`}>
                    {step.tagline}
                  </p>
                </div>

                <p className="text-gray-300">{step.description}</p>

                {/* Code blocks */}
                {step.code?.map((block) => (
                  <div key={block.label}>
                    <p className="mb-2 text-sm font-medium text-gray-400">
                      {block.label}
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-emerald">
                      <code>{block.value}</code>
                    </pre>
                  </div>
                ))}

                {/* Link */}
                {step.link &&
                  (step.link.external ? (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-froot-emerald/20 px-4 py-2 text-sm font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
                    >
                      {step.link.label} ↗
                    </a>
                  ) : (
                    <Link
                      href={step.link.href}
                      className="inline-flex items-center gap-2 rounded-lg bg-froot-emerald/20 px-4 py-2 text-sm font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
                    >
                      {step.link.label} →
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What's Next */}
      <div className="mt-16 rounded-2xl border border-froot-emerald/30 bg-froot-emerald/5 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">🎉 You're All Set!</h2>
        <p className="mt-2 text-gray-300">
          Explore the full ecosystem, browse all 20 solution plays, or dive
          into the knowledge modules.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/ecosystem"
            className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
          >
            Explore Ecosystem
          </Link>
          <Link
            href="/solution-plays"
            className="rounded-lg bg-froot-amber/20 px-6 py-3 font-medium text-froot-amber transition hover:bg-froot-amber/30"
          >
            Browse Solution Plays
          </Link>
          <Link
            href="/docs"
            className="rounded-lg bg-froot-cyan/20 px-6 py-3 font-medium text-froot-cyan transition hover:bg-froot-cyan/30"
          >
            Read the Docs
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
