import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Plugin Marketplace",
  description:
    "FrootAI Plugin Marketplace — extend FrootAI with community plugins for ServiceNow, Salesforce, SAP, and more.",
};

const steps = [
  {
    num: 1,
    title: "Create plugin.json",
    description:
      "Define your plugin manifest with metadata, capabilities, and integration points.",
    icon: "📝",
  },
  {
    num: 2,
    title: "Submit a PR",
    description:
      "Open a pull request to the community-plugins/ directory in the FrootAI repo.",
    icon: "🔀",
  },
  {
    num: 3,
    title: "Available to All",
    description:
      "Once merged, your plugin is available to every FrootAI user worldwide.",
    icon: "🌍",
  },
];

const featuredPlugins = [
  {
    name: "ServiceNow",
    category: "ITSM",
    description:
      "Integrate FrootAI with ServiceNow for intelligent ticket routing, incident analysis, and knowledge management.",
    href: "https://github.com/gitpavleenbali/frootai/tree/main/community-plugins/servicenow",
    icon: "🎫",
    color: "text-froot-emerald",
  },
  {
    name: "Salesforce",
    category: "CRM",
    description:
      "Connect Salesforce CRM with FrootAI for AI-powered lead scoring, customer insights, and case resolution.",
    href: "https://github.com/gitpavleenbali/frootai/tree/main/community-plugins/salesforce",
    icon: "☁️",
    color: "text-froot-cyan",
  },
  {
    name: "SAP",
    category: "ERP",
    description:
      "Bridge SAP ERP systems with FrootAI for intelligent process automation and document understanding.",
    href: "https://github.com/gitpavleenbali/frootai/tree/main/community-plugins/sap",
    icon: "🏢",
    color: "text-froot-amber",
  },
];

const manifestExample = `{
  "name": "my-custom-plugin",
  "version": "1.0.0",
  "description": "A custom FrootAI plugin",
  "author": "Your Name",
  "category": "integration",
  "capabilities": [
    "data-source",
    "action-handler"
  ],
  "config": {
    "apiEndpoint": {
      "type": "string",
      "required": true,
      "description": "API endpoint URL"
    },
    "apiKey": {
      "type": "secret",
      "required": true,
      "description": "API authentication key"
    }
  },
  "entrypoint": "index.js"
}`;

export default function MarketplacePage() {
  return (
    <PageShell
      title="🏪 Plugin Marketplace"
      subtitle="Extend FrootAI with community plugins — integrate with any service, add custom capabilities, and share with the world."
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      {/* How It Works */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-white">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <div className="text-4xl">{step.icon}</div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-froot-emerald/20 text-sm font-bold text-froot-emerald">
                  {step.num}
                </span>
                <h3 className="font-bold text-white">{step.title}</h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Plugins */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          Featured Plugins
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredPlugins.map((plugin) => (
            <a
              key={plugin.name}
              href={plugin.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{plugin.icon}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-400">
                  {plugin.category}
                </span>
              </div>
              <h3 className={`mt-3 text-lg font-bold ${plugin.color}`}>
                {plugin.name}
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {plugin.description}
              </p>
              <span className="mt-4 inline-block text-sm text-gray-500 group-hover:text-white">
                View on GitHub ↗
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Manifest Example */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold text-white">
          Plugin Manifest Example
        </h2>
        <p className="mb-4 text-gray-400">
          Create a <code className="text-froot-cyan">plugin.json</code> file in
          your plugin directory:
        </p>
        <pre className="overflow-x-auto rounded-2xl bg-black/40 p-6 text-sm text-froot-emerald">
          <code>{manifestExample}</code>
        </pre>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-froot-emerald/30 bg-froot-emerald/5 p-8 text-center">
        <h2 className="text-xl font-bold text-white">Build Your Own Plugin</h2>
        <p className="mt-2 text-gray-400">
          Check the contributor guide to get started building and submitting plugins.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/docs/contributor-guide"
            className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
          >
            Contributor Guide →
          </Link>
          <a
            href="https://github.com/gitpavleenbali/frootai"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
          >
            GitHub Repo ↗
          </a>
        </div>
      </div>
    </PageShell>
  );
}
