"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

const playGuides: Record<string, { name: string; steps: string[] }> = {
  "01": { name: "Enterprise RAG Q&A", steps: ["Clone repo → cd solution-plays/01-enterprise-rag", "Open in VS Code → Copilot is RAG-aware (reads agent.md + copilot-instructions)", "MCP auto-connects via .vscode/mcp.json", "Build: Co-coder fills skeleton using DevKit context", "Tune: Review config/*.json → adjust knobs per your data", "Deploy: az deployment group create --template-file infra/main.bicep", "Evaluate: python evaluation/eval.py → verify quality targets", "Ship it."] },
  "02": { name: "AI Landing Zone", steps: ["Clone → cd solution-plays/02-ai-landing-zone", "Review config/landing-zone.json → set CIDR, SKUs, region", "Deploy: az deployment group create --template-file infra/main.bicep", "Verify: all services have private endpoints + managed identity", "Layer other solution plays on top."] },
  "03": { name: "Deterministic Agent", steps: ["Clone → cd solution-plays/03-deterministic-agent", "Review agent.md → understand anti-sycophancy + abstention rules", "Build: Co-coder implements guardrail pipeline using DevKit", "Tune: config/openai.json has temp=0, seed=42, strict schema", "Evaluate: python evaluation/eval.py → consistency >95%, groundedness >0.95", "Ship when all green."] },
};

function UserGuideInner() {
  const searchParams = useSearchParams();
  const playId = searchParams.get("play") || "01";
  const guide = playGuides[playId];

  if (!guide) {
    return (
      <PageShell title="📖 User Guide" backLink={{ label: "Solution Plays", href: "/solution-plays" }}>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Select a play to view its guide.</p>
          <Link href="/solution-plays" className="text-froot-amber hover:underline">Browse Solution Plays →</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`📖 Play ${playId}: ${guide.name}`}
      subtitle="Step-by-step walkthrough from clone to deploy."
      badge={`Play ${playId}`}
      badgeColor="#6366f1"
      backLink={{ label: "All Solution Plays", href: "/solution-plays" }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="space-y-3">
          {guide.steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-froot-indigo/15 text-froot-indigo text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed pt-1">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-froot-emerald/20 bg-froot-emerald/[0.03] p-5 text-center">
          <p className="text-[13px] font-bold text-froot-emerald mb-1">DevKit + TuneKit Included</p>
          <p className="text-[12px] text-muted-foreground">
            Each play comes with agent.md, instructions.md, copilot-instructions.md, .vscode/mcp.json,
            config/*.json, infra/main.bicep, and evaluation/ — ready to customize.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

export function UserGuideClient() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading...</div>}>
      <UserGuideInner />
    </Suspense>
  );
}
