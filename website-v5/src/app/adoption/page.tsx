import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "FrootAI Adoption",
  description:
    "FrootAI by the numbers — 20 solution plays, 22 MCP tools, 18 knowledge modules, and real-world use cases.",
};

const stats = [
  { value: "20", label: "Solution Plays", color: "text-froot-amber", description: "Production-ready Azure AI architectures" },
  { value: "22", label: "MCP Tools", color: "text-froot-cyan", description: "Intelligent architecture guidance tools" },
  { value: "18", label: "Knowledge Modules", color: "text-froot-emerald", description: "Deep-dive learning content" },
  { value: "200+", label: "Glossary Terms", color: "text-froot-indigo", description: "Comprehensive AI/ML terminology" },
  { value: "16", label: "VS Code Commands", color: "text-froot-violet", description: "In-editor AI architecture guidance" },
  { value: "730+", label: "Files", color: "text-froot-amber", description: "Code, docs, IaC, and configs" },
];

const useCases = [
  {
    title: "Enterprise RAG Chatbot",
    description:
      "Build a retrieval-augmented generation chatbot that answers questions from your internal knowledge base with grounded, accurate responses.",
    play: "01",
    icon: "💬",
    color: "text-froot-emerald",
  },
  {
    title: "Call Center Voice AI",
    description:
      "Deploy an AI-powered voice assistant for call centers with real-time speech-to-text, intent recognition, and automated resolution.",
    play: "04",
    icon: "📞",
    color: "text-froot-cyan",
  },
  {
    title: "Document Intelligence",
    description:
      "Automate document processing with OCR, entity extraction, classification, and structured data output for invoices, contracts, and forms.",
    play: "06",
    icon: "📄",
    color: "text-froot-amber",
  },
  {
    title: "Multi-Agent Orchestration",
    description:
      "Build a multi-agent service where specialized AI agents collaborate to handle complex workflows across departments.",
    play: "07",
    icon: "🤖",
    color: "text-froot-indigo",
  },
  {
    title: "AI Observability Platform",
    description:
      "Monitor AI model performance, token usage, latency, and quality metrics with comprehensive dashboards and alerting.",
    play: "17",
    icon: "📊",
    color: "text-froot-violet",
  },
];

export default function AdoptionPage() {
  return (
    <PageShell
      title="📊 FrootAI Adoption"
      subtitle="The numbers behind FrootAI — a growing ecosystem of AI architecture tools, knowledge, and production-ready solutions."
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-white/5 p-6"
          >
            <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
            <div className="mt-1 font-medium text-white">{s.label}</div>
            <div className="mt-1 text-sm text-gray-500">{s.description}</div>
          </div>
        ))}
      </div>

      {/* Use Cases */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-white">
          Top Use Cases
        </h2>
        <div className="space-y-6">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="flex gap-6 rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-4xl">{uc.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className={`text-lg font-bold ${uc.color}`}>
                    {uc.title}
                  </h3>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                    Play {uc.play}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-300">{uc.description}</p>
                <Link
                  href={`/solution-plays/${uc.play}`}
                  className={`mt-3 inline-block text-sm ${uc.color} hover:underline`}
                >
                  View Solution Play →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/solution-plays"
          className="rounded-lg bg-froot-amber/20 px-8 py-4 font-medium text-froot-amber transition hover:bg-froot-amber/30"
        >
          Browse All 20 Solution Plays →
        </Link>
      </div>
    </PageShell>
  );
}
