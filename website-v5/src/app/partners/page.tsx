import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Partner Integrations",
  description:
    "FrootAI integrates with ServiceNow, Salesforce, SAP, Datadog, PagerDuty, and Jira for enterprise workflows.",
};

const partners = [
  {
    name: "ServiceNow",
    category: "ITSM",
    description:
      "Intelligent ticket routing, incident analysis, and automated knowledge management powered by FrootAI solution plays.",
    icon: "🎫",
    color: "text-froot-emerald",
    border: "border-froot-emerald/30",
    bg: "bg-froot-emerald/5",
    capabilities: [
      "AI-powered ticket classification",
      "Automated incident resolution",
      "Knowledge article generation",
      "SLA prediction and optimization",
    ],
  },
  {
    name: "Salesforce",
    category: "CRM",
    description:
      "AI-driven lead scoring, customer insights, and intelligent case resolution integrated with Salesforce CRM.",
    icon: "☁️",
    color: "text-froot-cyan",
    border: "border-froot-cyan/30",
    bg: "bg-froot-cyan/5",
    capabilities: [
      "Predictive lead scoring",
      "Customer sentiment analysis",
      "Automated case routing",
      "AI-powered sales forecasting",
    ],
  },
  {
    name: "SAP",
    category: "ERP",
    description:
      "Document intelligence and process automation for SAP ERP workflows, from purchase orders to invoices.",
    icon: "🏢",
    color: "text-froot-amber",
    border: "border-froot-amber/30",
    bg: "bg-froot-amber/5",
    capabilities: [
      "Invoice processing automation",
      "Purchase order extraction",
      "Supplier risk analysis",
      "Inventory optimization",
    ],
  },
  {
    name: "Datadog",
    category: "Monitoring",
    description:
      "Real-time AI observability dashboards, anomaly detection, and performance monitoring for FrootAI deployments.",
    icon: "📊",
    color: "text-froot-violet",
    border: "border-froot-violet/30",
    bg: "bg-froot-violet/5",
    capabilities: [
      "AI model latency tracking",
      "Token usage monitoring",
      "Anomaly detection alerts",
      "Custom AI dashboards",
    ],
  },
  {
    name: "PagerDuty",
    category: "Incident",
    description:
      "AI-enhanced incident management with automated escalation, root cause analysis, and intelligent runbooks.",
    icon: "🚨",
    color: "text-froot-indigo",
    border: "border-froot-indigo/30",
    bg: "bg-froot-indigo/5",
    capabilities: [
      "AI-powered incident triage",
      "Automated escalation paths",
      "Root cause analysis",
      "Intelligent runbook execution",
    ],
  },
  {
    name: "Jira",
    category: "Project",
    description:
      "AI-assisted project management with automated backlog grooming, sprint planning, and effort estimation.",
    icon: "📋",
    color: "text-froot-emerald",
    border: "border-froot-emerald/30",
    bg: "bg-froot-emerald/5",
    capabilities: [
      "Automated backlog grooming",
      "AI effort estimation",
      "Sprint planning assistance",
      "Dependency analysis",
    ],
  },
];

export default function PartnersPage() {
  return (
    <PageShell
      title="🤝 Partner Integrations"
      subtitle="Enterprise integrations to connect FrootAI with the tools your teams already use."
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className={`rounded-2xl border ${partner.border} ${partner.bg} p-6`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{partner.icon}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-400">
                {partner.category}
              </span>
            </div>

            <h3 className={`mt-4 text-lg font-bold ${partner.color}`}>
              {partner.name}
            </h3>
            <p className="mt-2 text-sm text-gray-300">{partner.description}</p>

            <ul className="mt-4 space-y-2">
              {partner.capabilities.map((cap) => (
                <li
                  key={cap}
                  className="flex items-start gap-2 text-sm text-gray-400"
                >
                  <span className={`mt-1 ${partner.color}`}>•</span>
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-xl font-bold text-white">
          Build a Custom Integration
        </h2>
        <p className="mt-2 text-gray-400">
          Use the Plugin Marketplace to create and share your own enterprise integration.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/marketplace"
            className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
          >
            Plugin Marketplace →
          </Link>
          <Link
            href="/api-docs"
            className="rounded-lg bg-froot-cyan/20 px-6 py-3 font-medium text-froot-cyan transition hover:bg-froot-cyan/30"
          >
            REST API Docs →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
