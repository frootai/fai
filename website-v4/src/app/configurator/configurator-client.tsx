"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/layout/page-shell";

const steps = [
  {
    question: "What are you trying to build?",
    options: [
      { label: "🔍 Search / Q&A over documents", tags: ["rag", "search"] },
      { label: "🤖 AI Agent / Chatbot", tags: ["agent", "chat"] },
      { label: "📄 Document Processing", tags: ["document"] },
      { label: "🏗️ AI Infrastructure (Landing Zone)", tags: ["infra"] },
      { label: "📊 Monitoring / Observability", tags: ["observability"] },
      { label: "🔬 Fine-Tuning / MLOps", tags: ["finetune"] },
      { label: "🚪 API Gateway / Cost Control", tags: ["gateway"] },
      { label: "📱 Edge / On-Device AI", tags: ["edge"] },
    ],
  },
  {
    question: "What's your team's experience level?",
    options: [
      { label: "🌱 New to AI (want low complexity)", tags: ["low"] },
      { label: "🌿 Some experience (medium is fine)", tags: ["medium"] },
      { label: "🌳 Advanced (bring on the complex stuff)", tags: ["high"] },
    ],
  },
  {
    question: "What's your timeline?",
    options: [
      { label: "⚡ Days (need Ready plays)", tags: ["ready"] },
      { label: "📅 Weeks (Skeleton plays OK)", tags: ["skeleton"] },
      { label: "🗓️ Months (planning ahead)", tags: ["any"] },
    ],
  },
];

const recommendations: Record<string, { plays: string[]; note: string }> = {
  "rag": { plays: ["01", "09"], note: "Start with Play 01 (Enterprise RAG) — it's production-ready." },
  "agent": { plays: ["03", "07", "08"], note: "Play 03 (Deterministic Agent) for reliability, Play 07 for multi-agent." },
  "document": { plays: ["06", "15"], note: "Play 06 for structured extraction, Play 15 for multi-modal." },
  "infra": { plays: ["02", "11"], note: "Play 02 is the foundation. Play 11 adds multi-region governance." },
  "observability": { plays: ["17"], note: "Play 17 gives you KQL queries, alerts, and workbooks." },
  "finetune": { plays: ["13"], note: "Play 13 covers the full LoRA pipeline." },
  "gateway": { plays: ["14"], note: "Play 14 — APIM gateway with semantic caching." },
  "edge": { plays: ["19"], note: "Play 19 — Phi-4 on edge with ONNX Runtime." },
  "chat": { plays: ["03", "07", "04"], note: "Play 03 for deterministic, Play 04 for voice, Play 07 for multi-agent." },
  "search": { plays: ["01", "09"], note: "Play 01 for RAG Q&A, Play 09 for search portal." },
};

export function ConfiguratorClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const done = step >= steps.length;

  function handleSelect(tags: string[]) {
    const newAnswers = [...answers, tags];
    setAnswers(newAnswers);
    setStep(step + 1);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
  }

  const primaryTag = answers[0]?.[0] || "rag";
  const rec = recommendations[primaryTag] || recommendations["rag"];

  return (
    <PageShell
      title="⚙️ Solution Configurator"
      subtitle="Answer 3 quick questions and we'll recommend the best solution plays for your team."
      badge="3-Step Wizard"
      badgeColor="#f59e0b"
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Progress */}
              <div className="flex gap-2 mb-6">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-colors"
                    style={{ background: i <= step ? "#f59e0b" : "var(--border)" }}
                  />
                ))}
              </div>

              <h3 className="text-lg font-bold mb-4">
                Step {step + 1}: {steps[step].question}
              </h3>

              <div className="space-y-2">
                {steps[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(opt.tags)}
                    className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-froot-amber/30 hover:bg-froot-amber/[0.03] transition-all cursor-pointer text-[14px]"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl border border-froot-amber/20 bg-froot-amber/[0.03] p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">Your Recommended Plays</h3>
                <p className="text-[13px] text-muted-foreground mb-4">{rec.note}</p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {rec.plays.map((id) => (
                    <Link
                      key={id}
                      href={`/user-guide?play=${id}`}
                      className="rounded-full border border-froot-indigo/30 bg-froot-indigo/10 px-4 py-2 text-[13px] font-bold text-froot-indigo hover:bg-froot-indigo/20 transition-colors"
                    >
                      Play {id} →
                    </Link>
                  ))}
                </div>
                <button
                  onClick={reset}
                  className="text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  ↺ Start over
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link href="/solution-plays" className="text-[13px] text-froot-amber hover:underline">
                  Browse all 20 plays →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
