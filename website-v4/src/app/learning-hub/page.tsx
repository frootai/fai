import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "FAI Learning Hub",
  description:
    "Learn AI architecture with 18 knowledge modules, 200+ glossary terms, workshop materials, and quizzes.",
};

const cards = [
  {
    icon: "📚",
    title: "18 Knowledge Modules",
    description:
      "Deep-dive into the FROOT framework — from GenAI Foundations to Production Patterns. Each module is a self-contained learning unit with references, examples, and key takeaways.",
    href: "/docs",
    linkLabel: "Browse Modules",
    color: "text-froot-emerald",
    border: "border-froot-emerald/30",
    bg: "bg-froot-emerald/5",
    stats: [
      { label: "Modules", value: "18" },
      { label: "Layers", value: "5" },
      { label: "Topics", value: "100+" },
    ],
  },
  {
    icon: "📖",
    title: "AI Glossary — 200+ Terms",
    description:
      "A comprehensive A-to-Z glossary of AI, ML, and cloud-native terminology. Each term includes a definition, context, and practical usage examples.",
    href: "/docs/F3-AI-Glossary-AZ",
    linkLabel: "Open Glossary",
    color: "text-froot-cyan",
    border: "border-froot-cyan/30",
    bg: "bg-froot-cyan/5",
    stats: [
      { label: "Terms", value: "200+" },
      { label: "Categories", value: "15" },
      { label: "Examples", value: "100+" },
    ],
  },
  {
    icon: "🎓",
    title: "Workshop Materials",
    description:
      "Hands-on workshop content for teams adopting FrootAI. Includes slide decks, lab guides, starter repos, and facilitation notes.",
    href: "https://github.com/gitpavleenbali/frootai",
    linkLabel: "View on GitHub",
    color: "text-froot-amber",
    border: "border-froot-amber/30",
    bg: "bg-froot-amber/5",
    external: true,
    stats: [
      { label: "Workshops", value: "5" },
      { label: "Labs", value: "12" },
      { label: "Hours", value: "20+" },
    ],
  },
  {
    icon: "✅",
    title: "Quiz & Assessment",
    description:
      "Test your understanding of the FROOT modules with quizzes covering each layer. Track progress and identify knowledge gaps.",
    href: "/docs/Quiz-Assessment",
    linkLabel: "Take the Quiz",
    color: "text-froot-violet",
    border: "border-froot-violet/30",
    bg: "bg-froot-violet/5",
    stats: [
      { label: "Questions", value: "50+" },
      { label: "Levels", value: "3" },
      { label: "Topics", value: "18" },
    ],
  },
];

export default function LearningHubPage() {
  return (
    <PageShell
      title="📚 FAI Learning Hub"
      subtitle="Everything you need to learn AI architecture — modules, glossary, workshops, and assessments."
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      <div className="grid gap-8 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border ${card.border} ${card.bg} p-8`}
          >
            <div className="text-4xl">{card.icon}</div>
            <h2 className={`mt-4 text-xl font-bold ${card.color}`}>
              {card.title}
            </h2>
            <p className="mt-3 text-gray-300">{card.description}</p>

            {/* Stats */}
            <div className="mt-6 flex gap-6">
              {card.stats.map((s) => (
                <div key={s.label}>
                  <div className={`text-lg font-bold ${card.color}`}>
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Link */}
            <div className="mt-6">
              {card.external ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 text-sm font-medium ${card.color} hover:underline`}
                >
                  {card.linkLabel} ↗
                </a>
              ) : (
                <Link
                  href={card.href}
                  className={`inline-flex items-center gap-1 text-sm font-medium ${card.color} hover:underline`}
                >
                  {card.linkLabel} →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Learning Path CTA */}
      <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">
          🗺️ Suggested Learning Path
        </h2>
        <p className="mt-2 text-gray-400">
          Foundations → Reasoning → Orchestration → Operations → Transformation
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {["F — Foundations", "R — Reasoning", "O — Orchestration", "O — Operations", "T — Transformation"].map(
            (layer) => (
              <span
                key={layer}
                className="rounded-full bg-white/10 px-4 py-2 text-sm text-gray-300"
              >
                {layer}
              </span>
            )
          )}
        </div>
        <Link
          href="/packages"
          className="mt-6 inline-block rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          View All Packages →
        </Link>
      </div>
    </PageShell>
  );
}
