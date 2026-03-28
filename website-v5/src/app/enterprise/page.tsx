import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Enterprise — FrootAI",
  description:
    "FrootAI for Enterprise — free forever, MIT licensed, community-driven. No paid tiers, no vendor lock-in.",
};

const stats = [
  { label: "Price", value: "$0", subtext: "Free forever" },
  { label: "License", value: "MIT", subtext: "Open source" },
  { label: "Solution Plays", value: "20", subtext: "Production-ready" },
  { label: "Support", value: "Community", subtext: "GitHub issues" },
];

const features = [
  {
    icon: "🏗️",
    title: "20 Production-Ready Architectures",
    description:
      "Every solution play ships with Bicep IaC, evaluation pipelines, deployment automation, and Well-Architected Framework compliance.",
    color: "text-froot-amber",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    description:
      "Managed Identity, Key Vault, RBAC, content safety, and network isolation built into every play.",
    color: "text-froot-emerald",
  },
  {
    icon: "📊",
    title: "AI Observability",
    description:
      "Built-in evaluation metrics, token monitoring, latency tracking, and quality dashboards.",
    color: "text-froot-cyan",
  },
  {
    icon: "🔌",
    title: "Enterprise Integrations",
    description:
      "ServiceNow, Salesforce, SAP, Datadog, PagerDuty, and Jira plugins for seamless enterprise workflow connectivity.",
    color: "text-froot-indigo",
  },
  {
    icon: "☁️",
    title: "Azure Native",
    description:
      "Built for Azure from the ground up — Azure OpenAI, AI Search, Cosmos DB, Container Apps, and more.",
    color: "text-froot-violet",
  },
  {
    icon: "📦",
    title: "No Vendor Lock-in",
    description:
      "MIT licensed, open source, zero proprietary dependencies. Fork it, modify it, own it.",
    color: "text-froot-amber",
  },
];

export default function EnterprisePage() {
  return (
    <PageShell
      title="Enterprise"
      subtitle="FrootAI is free for everyone — including enterprises. No paid tiers, no vendor lock-in, just great AI architecture."
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-froot-emerald/30 bg-froot-emerald/5 p-6 text-center"
          >
            <div className="text-3xl font-bold text-froot-emerald">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-gray-400">{s.label}</div>
            <div className="text-xs text-gray-500">{s.subtext}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          Enterprise-Grade Features
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className={`mt-3 text-lg font-bold ${f.color}`}>
                {f.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-froot-emerald/30 bg-froot-emerald/5 p-8 text-center">
        <h2 className="text-xl font-bold text-white">
          Ready to Get Started?
        </h2>
        <p className="mt-2 text-gray-400">
          Everything is free and open source. Jump right in.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/hi-fai"
            className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
          >
            5-Minute Quickstart →
          </Link>
          <Link
            href="/community"
            className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
          >
            Community →
          </Link>
          <Link
            href="/partners"
            className="rounded-lg bg-froot-amber/20 px-6 py-3 font-medium text-froot-amber transition hover:bg-froot-amber/30"
          >
            Partner Integrations →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
