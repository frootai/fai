"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { cn } from "@/lib/utils";

const plays = [
  { id: "01", name: "Enterprise RAG Q&A", icon: "🔍", status: "Ready", cx: "Medium", desc: "Production RAG — AI Search + OpenAI + Container Apps.", infra: "AI Search · Azure OpenAI · Container Apps · Blob", tune: "temperature · top-k · chunk size · reranking" },
  { id: "02", name: "AI Landing Zone", icon: "⛰️", status: "Ready", cx: "Foundation", desc: "Foundational Azure infra — VNet, private endpoints, managed identity, RBAC.", infra: "VNet · Private Endpoints · RBAC · Managed Identity · Key Vault", tune: "Network config · service SKUs · GPU quota · region" },
  { id: "03", name: "Deterministic Agent", icon: "🎯", status: "Ready", cx: "Medium", desc: "Reliable agent — temp=0, structured JSON, multi-layer guardrails.", infra: "Container Apps · Azure OpenAI · Content Safety", tune: "temperature=0 · JSON schema · seed · confidence" },
  { id: "04", name: "Call Center Voice AI", icon: "📞", status: "Skeleton", cx: "High", desc: "Voice-enabled customer service with AI Speech + OpenAI Agent.", infra: "Communication Services · AI Speech · Azure OpenAI", tune: "Speech config · grounding prompts · fallback chains" },
  { id: "05", name: "IT Ticket Resolution", icon: "🎫", status: "Skeleton", cx: "Medium", desc: "Auto-classify, route, and resolve IT tickets.", infra: "Logic Apps · Azure OpenAI · ServiceNow MCP", tune: "Classification prompts · routing rules · confidence" },
  { id: "06", name: "Document Intelligence", icon: "📄", status: "Skeleton", cx: "Medium", desc: "Extract, classify, and structure document data.", infra: "Blob · Document Intelligence · Azure OpenAI · Cosmos DB", tune: "Extraction prompts · confidence · field schemas" },
  { id: "07", name: "Multi-Agent Service", icon: "🤖", status: "Skeleton", cx: "High", desc: "Supervisor agent routes to specialists.", infra: "Container Apps · Azure OpenAI · Cosmos DB · Dapr", tune: "Supervisor routing · tool schemas · handoff rules" },
  { id: "08", name: "Copilot Studio Bot", icon: "💬", status: "Skeleton", cx: "Low", desc: "Low-code enterprise bot with Copilot Studio.", infra: "Copilot Studio · Dataverse · SharePoint", tune: "Topic design · knowledge sources · guardrails" },
  { id: "09", name: "AI Search Portal", icon: "🔎", status: "Skeleton", cx: "Medium", desc: "Enterprise search with Semantic Ranking.", infra: "AI Search · App Service · Azure OpenAI · Blob", tune: "Hybrid weights · semantic config · scoring profiles" },
  { id: "10", name: "Content Moderation", icon: "🛡️", status: "Skeleton", cx: "Low", desc: "Filter harmful content with AI Content Safety.", infra: "Content Safety · API Management · Azure Functions", tune: "Severity levels · custom categories · blocklists" },
  { id: "11", name: "Landing Zone Advanced", icon: "🏔️", status: "Skeleton", cx: "High", desc: "Multi-region, policy-driven, enterprise-grade AI landing zone.", infra: "Multi-region VNet · Azure Policy · PE · RBAC", tune: "Governance policies · multi-region config" },
  { id: "12", name: "Model Serving AKS", icon: "⚙️", status: "Skeleton", cx: "High", desc: "Deploy LLMs on AKS with vLLM and GPU nodes.", infra: "AKS · vLLM · NVIDIA GPU · Container Registry", tune: "Quantization · batching · scaling rules" },
  { id: "13", name: "Fine-Tuning Workflow", icon: "🔬", status: "Skeleton", cx: "High", desc: "End-to-end fine-tuning with LoRA training.", infra: "AI Foundry · GPU Compute · Storage · MLflow", tune: "LoRA rank · learning rate · epochs · eval metrics" },
  { id: "14", name: "AI Gateway", icon: "🚪", status: "Skeleton", cx: "Medium", desc: "APIM-based gateway with semantic caching and token budgets.", infra: "API Management · Redis Cache · Azure OpenAI", tune: "Token budgets · caching rules · rate limits" },
  { id: "15", name: "Multi-Modal DocProc", icon: "🖼️", status: "Skeleton", cx: "Medium", desc: "Process documents with GPT-4o multi-modal.", infra: "GPT-4o · Blob Storage · Cosmos DB · Functions", tune: "Image prompts · extraction schemas" },
  { id: "16", name: "Copilot Teams Extension", icon: "👥", status: "Skeleton", cx: "Medium", desc: "M365 Copilot extension with declarative agents.", infra: "M365 Copilot · Graph API · Azure Functions", tune: "Declarative agent config · permissions" },
  { id: "17", name: "AI Observability", icon: "📊", status: "Skeleton", cx: "Medium", desc: "Monitor AI workloads with KQL queries and workbooks.", infra: "App Insights · Log Analytics · Azure Monitor", tune: "KQL queries · alert thresholds · quality metrics" },
  { id: "18", name: "Prompt Management", icon: "📝", status: "Skeleton", cx: "Medium", desc: "Version control, A/B test, and rollback prompts.", infra: "Prompt Flow · Git · GitHub Actions · AI Foundry", tune: "Prompt versions · A/B weights · rollback rules" },
  { id: "19", name: "Edge AI Phi-4", icon: "📱", status: "Skeleton", cx: "Medium", desc: "Run Phi-4 on edge devices with ONNX Runtime.", infra: "Phi-4 · ONNX Runtime · IoT Hub · Edge Devices", tune: "Quantization · context length · batching" },
  { id: "20", name: "Anomaly Detection", icon: "🔔", status: "Skeleton", cx: "Medium", desc: "Real-time anomaly detection with Metrics Advisor.", infra: "Anomaly Detector · Stream Analytics · Event Hub", tune: "Sensitivity · detection window · alert rules" },
];

function PlayCard({ play }: { play: typeof plays[0] }) {
  const [open, setOpen] = useState(false);
  const isReady = play.status === "Ready";

  return (
    <div className={cn(
      "rounded-xl border transition-all",
      isReady ? "border-froot-emerald/20 bg-froot-emerald/[0.02]" : "border-border"
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left cursor-pointer group"
      >
        <span className="text-2xl mt-0.5">{play.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-bold">Play {play.id}: {play.name}</span>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
              isReady ? "bg-froot-emerald/15 text-froot-emerald" : "bg-froot-amber/15 text-froot-amber"
            )}>
              {play.status}
            </span>
            <span className="text-[10px] text-muted-foreground/50">{play.cx}</span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-1">{play.desc}</p>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-1">Infrastructure</p>
                <p className="text-[12px] text-muted-foreground">{play.infra}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-1">Tuning Knobs</p>
                <p className="text-[12px] text-muted-foreground">{play.tune}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/user-guide?play=${play.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-froot-indigo/30 px-3 py-1 text-[11px] text-froot-indigo font-medium hover:bg-froot-indigo/5 transition-colors"
                >
                  📖 User Guide
                </Link>
                <a
                  href={`https://github.com/gitpavleenbali/frootai/tree/main/solution-plays/${play.id.padStart(2, "0")}-${play.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground font-medium hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" /> GitHub
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SolutionPlaysClient() {
  return (
    <PageShell
      title="🎯 Solution Plays"
      subtitle="20 pre-built, production-ready AI solution accelerators. Each play includes DevKit (agent.md, instructions.md, .vscode/mcp.json) + TuneKit (config/*.json, infra/main.bicep, evaluation/)."
      badge="20 Plays"
      badgeColor="#7c3aed"
      backLink={{ label: "Back to FrootAI", href: "/" }}
    >
      <div className="space-y-2 max-w-3xl mx-auto">
        {plays.map((play) => (
          <PlayCard key={play.id} play={play} />
        ))}
      </div>
    </PageShell>
  );
}
