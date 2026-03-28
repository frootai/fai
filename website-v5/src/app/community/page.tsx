import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Open Source Community",
  description:
    "FrootAI is free forever, MIT licensed, and built by the community. Contribute plays, knowledge, tools, and ideas.",
};

const contributionWays = [
  {
    icon: "🎯",
    title: "Submit a Solution Play",
    description:
      "Create a new production-ready architecture with Bicep IaC, evaluation pipeline, and deployment guide. Plays are the core building blocks of FrootAI.",
    color: "text-froot-amber",
  },
  {
    icon: "📚",
    title: "Add Knowledge",
    description:
      "Write or improve FROOT knowledge modules. Contribute glossary terms, update existing content, or add new tutorials and guides.",
    color: "text-froot-emerald",
  },
  {
    icon: "🔧",
    title: "Build Tools",
    description:
      "Add MCP tools, VS Code commands, CLI features, or marketplace plugins. Extend the FrootAI developer toolchain.",
    color: "text-froot-cyan",
  },
  {
    icon: "📣",
    title: "Share & Teach",
    description:
      "Write blog posts, create videos, run workshops, or present at meetups. Help others discover and adopt FrootAI.",
    color: "text-froot-violet",
  },
];

const stats = [
  { label: "Price", value: "$0", subtext: "Free forever" },
  { label: "License", value: "MIT", subtext: "Open source" },
  { label: "Solution Plays", value: "20", subtext: "And growing" },
  { label: "Contributors", value: "Open", subtext: "Join us" },
];

export default function CommunityPage() {
  return (
    <PageShell
      title="🌱 Open Source Community"
      subtitle="FrootAI is free, open source, and community-driven. From the Roots to the Fruits."
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

      {/* Contribution Ways */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          4 Ways to Contribute
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {contributionWays.map((way) => (
            <div
              key={way.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-3xl">{way.icon}</div>
              <h3 className={`mt-3 text-lg font-bold ${way.color}`}>
                {way.title}
              </h3>
              <p className="mt-2 text-sm text-gray-400">{way.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Involved */}
      <div className="mt-12 rounded-2xl border border-froot-emerald/30 bg-froot-emerald/5 p-8">
        <h2 className="text-xl font-bold text-white">Get Involved</h2>
        <p className="mt-2 text-gray-300">
          FrootAI is MIT licensed — use it, modify it, share it. Contributions
          of any size are welcome, from fixing a typo to building a full
          solution play.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="https://github.com/gitpavleenbali/frootai"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
          >
            GitHub Repository ↗
          </a>
          <Link
            href="/docs/contributor-guide"
            className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/20"
          >
            Contributor Guide →
          </Link>
          <Link
            href="/marketplace"
            className="rounded-lg bg-froot-amber/20 px-6 py-3 font-medium text-froot-amber transition hover:bg-froot-amber/30"
          >
            Plugin Marketplace →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
