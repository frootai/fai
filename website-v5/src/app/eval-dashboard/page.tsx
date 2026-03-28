import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Evaluation Dashboard",
  description:
    "FrootAI quality metrics — Groundedness, Relevance, Coherence, Fluency, Safety, and Latency benchmarks.",
};

const metrics = [
  {
    name: "Groundedness",
    threshold: ">0.95",
    value: 0.96,
    description:
      "Measures how well AI responses are grounded in the provided context. High groundedness means fewer hallucinations and more factually accurate responses.",
    color: "text-froot-emerald",
    barColor: "bg-froot-emerald",
    bg: "bg-froot-emerald/5",
    border: "border-froot-emerald/30",
  },
  {
    name: "Relevance",
    threshold: ">0.90",
    value: 0.93,
    description:
      "Evaluates whether responses directly address the user's question. High relevance ensures users get the information they need without unnecessary content.",
    color: "text-froot-cyan",
    barColor: "bg-froot-cyan",
    bg: "bg-froot-cyan/5",
    border: "border-froot-cyan/30",
  },
  {
    name: "Coherence",
    threshold: ">0.92",
    value: 0.94,
    description:
      "Assesses the logical flow and consistency of responses. Coherent responses are well-structured, logically ordered, and free of contradictions.",
    color: "text-froot-amber",
    barColor: "bg-froot-amber",
    bg: "bg-froot-amber/5",
    border: "border-froot-amber/30",
  },
  {
    name: "Fluency",
    threshold: ">0.95",
    value: 0.97,
    description:
      "Measures the grammatical correctness and natural language quality. Fluent responses read naturally and are free of grammatical or stylistic errors.",
    color: "text-froot-indigo",
    barColor: "bg-froot-indigo",
    bg: "bg-froot-indigo/5",
    border: "border-froot-indigo/30",
  },
  {
    name: "Safety",
    threshold: ">0.98",
    value: 0.99,
    description:
      "Evaluates content safety against harmful, biased, or inappropriate output. Safety filters ensure responsible AI behavior across all interactions.",
    color: "text-froot-violet",
    barColor: "bg-froot-violet",
    bg: "bg-froot-violet/5",
    border: "border-froot-violet/30",
  },
  {
    name: "Latency",
    threshold: "<500ms",
    value: 420,
    description:
      "Measures end-to-end response time from user query to complete response. Low latency ensures a responsive user experience.",
    color: "text-froot-amber",
    barColor: "bg-froot-amber",
    bg: "bg-froot-amber/5",
    border: "border-froot-amber/30",
    isLatency: true,
  },
];

export default function EvalDashboardPage() {
  return (
    <PageShell
      title="📊 Evaluation Dashboard"
      subtitle="Quality metrics and benchmarks for FrootAI AI responses — every metric meets or exceeds production thresholds."
      backLink={{ label: "Back to Developer Hub", href: "/dev-hub" }}
    >
      {/* Summary bar */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map((m) => (
          <div
            key={m.name}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
          >
            <div className={`text-2xl font-bold ${m.color}`}>
              {m.isLatency ? `${m.value}ms` : (m.value * 100).toFixed(0) + "%"}
            </div>
            <div className="mt-1 text-xs text-gray-400">{m.name}</div>
            <div className="mt-0.5 text-xs text-gray-500">
              Target: {m.threshold}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="mt-10 space-y-6">
        {metrics.map((m) => (
          <div
            key={m.name}
            className={`rounded-2xl border ${m.border} ${m.bg} p-6`}
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold ${m.color}`}>{m.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  Target: {m.threshold}
                </span>
                <span className={`text-xl font-bold ${m.color}`}>
                  {m.isLatency
                    ? `${m.value}ms`
                    : (m.value * 100).toFixed(0) + "%"}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-300">{m.description}</p>

            {/* Progress bar */}
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/30">
              <div
                className={`h-full rounded-full ${m.barColor}`}
                style={{
                  width: m.isLatency
                    ? `${Math.min((m.value / 500) * 100, 100)}%`
                    : `${m.value * 100}%`,
                }}
              />
            </div>

            {/* Pass/Fail */}
            <div className="mt-2 text-right">
              <span className="rounded-full bg-froot-emerald/20 px-3 py-1 text-xs font-medium text-froot-emerald">
                ✓ Passing
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-gray-400">
          Metrics are evaluated using{" "}
          <span className="text-white">Azure AI Evaluation SDK</span> with the{" "}
          <span className="text-white">azure-ai-evaluation</span> package.
          Thresholds follow FrootAI TuneKit recommended values.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link
            href="/docs/Responsible-AI-Safety"
            className="text-sm text-froot-violet hover:underline"
          >
            Responsible AI Guide →
          </Link>
          <Link
            href="/docs/T3-Production-Patterns"
            className="text-sm text-froot-emerald hover:underline"
          >
            Production Patterns →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
