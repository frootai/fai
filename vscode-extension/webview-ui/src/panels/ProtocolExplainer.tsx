import { useState } from "react";
import { vscode } from "../vscode";
import {
  FileJson, Layers, Server, Rocket, GitMerge, Shield, Cpu, Play,
  Search, Link, BarChart3, Cloud, Package, CheckCircle, FileText,
  BookOpen, Cog, Zap, ArrowRight, ExternalLink, Code, Box,
} from "lucide-react";

// ─── Types ───
type Tab = "protocol" | "layer" | "engine" | "factory";

const TABS: { id: Tab; label: string; Icon: any; color: string }[] = [
  { id: "protocol", label: "FAI Protocol", Icon: FileJson, color: "#10b981" },
  { id: "layer", label: "FAI Layer", Icon: Layers, color: "#06b6d4" },
  { id: "engine", label: "FAI Engine", Icon: Server, color: "#8b5cf6" },
  { id: "factory", label: "FAI Factory", Icon: Rocket, color: "#f59e0b" },
];

// ─── Reusable components ───
function Section({ icon: Icon, title, color, children }: { icon: any; title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20, padding: 16, borderRadius: 8, border: `1px solid ${color}20`, background: `${color}08` }}>
      <h3 style={{ margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8, color }}>
        <Icon size={16} /> {title}
      </h3>
      {children}
    </div>
  );
}

function SpecRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "4px 0", fontSize: 12, borderBottom: "1px solid var(--vscode-widget-border, #333)" }}>
      <span style={{ minWidth: 130, opacity: 0.6 }}>{label}</span>
      <span style={mono ? { fontFamily: "var(--vscode-editor-font-family)", color: "#10b981" } : undefined}>{value}</span>
    </div>
  );
}

function SchemaCard({ name, desc, fields, onClick }: { name: string; desc: string; fields: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="glow-card" style={{ padding: 12, textAlign: "left", cursor: "pointer", background: "var(--vscode-editor-background, #1e1e1e)", border: "1px solid var(--vscode-widget-border, #333)", borderRadius: 8, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <FileJson size={14} color="#10b981" />
        <strong style={{ fontSize: 12 }}>{name}</strong>
        <span style={{ fontSize: 10, opacity: 0.5, marginLeft: "auto" }}>{fields} fields</span>
      </div>
      <p style={{ fontSize: 11, opacity: 0.7, margin: 0 }}>{desc}</p>
    </button>
  );
}

// ─── Protocol Tab ───
function ProtocolTab() {
  return (
    <div>
      <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.85, marginBottom: 16 }}>
        The <strong>FAI Protocol</strong> is the specification that wires AI primitives together. At its core is <code>fai-manifest.json</code> — a declarative file that connects agents, instructions, skills, hooks, and guardrails into a unified solution play.
      </p>

      <Section icon={FileJson} title="fai-manifest.json" color="#10b981">
        <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 10px" }}>The central orchestration file — every solution play has one.</p>
        <SpecRow label="Purpose" value="Wire context + primitives + infra + toolkit for a play" />
        <SpecRow label="Context" value="knowledge[], waf[], scope, compatible-plays" />
        <SpecRow label="Primitives" value="agents[], instructions[], skills[], hooks[]" />
        <SpecRow label="Guardrails" value="content-safety thresholds, groundedness ≥ 0.8" />
        <SpecRow label="Infrastructure" value="Azure services, Bicep templates" />
        <SpecRow label="Toolkit" value="DevKit + TuneKit + SpecKit + Infra" />
        <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: "var(--vscode-textCodeBlock-background, #1e1e1e)", fontFamily: "var(--vscode-editor-font-family)", fontSize: 11, lineHeight: 1.6, whiteSpace: "pre", overflow: "auto" }}>
{`{
  "play": "01-enterprise-rag",
  "version": "1.0.0",
  "context": {
    "knowledge": ["R2-RAG-Architecture"],
    "waf": ["security", "reliability"],
    "scope": "enterprise-rag-qa"
  },
  "primitives": {
    "agents": ["./agents/builder.agent.md"],
    "skills": ["./skills/rag-setup/SKILL.md"],
    "hooks": ["./hooks/secrets-scanner/hooks.json"]
  },
  "guardrails": { "groundedness": 0.8 }
}`}
        </div>
      </Section>

      <Section icon={Box} title="fai-context.json" color="#06b6d4">
        <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 10px" }}>
          Lightweight LEGO block context — each standalone primitive can carry its own context reference. When placed inside a play, the engine merges these into the manifest's shared context.
        </p>
        <SpecRow label="Assumes" value="Technology, framework, service prerequisites" />
        <SpecRow label="WAF" value="Which pillars this primitive aligns to" />
        <SpecRow label="Compatible Plays" value="Which solution plays this primitive works with" />
        <SpecRow label="Evaluation" value="Quality thresholds specific to this primitive" />
      </Section>

      <Section icon={Code} title="7 JSON Schemas" color="#8b5cf6">
        <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 12px" }}>Every FAI primitive type has a JSON Schema for validation:</p>
        <div style={{ display: "grid", gap: 8 }}>
          <SchemaCard name="fai-manifest.schema.json" desc="Core wiring — context + primitives + guardrails" fields={12} onClick={() => vscode.postMessage({ command: "openSchema", schema: "fai-manifest" })} />
          <SchemaCard name="fai-context.schema.json" desc="Standalone primitive context reference" fields={6} onClick={() => vscode.postMessage({ command: "openSchema", schema: "fai-context" })} />
          <SchemaCard name="agent.schema.json" desc="Agent frontmatter — description, tools, model, WAF" fields={8} onClick={() => vscode.postMessage({ command: "openSchema", schema: "agent" })} />
          <SchemaCard name="instruction.schema.json" desc="Instruction frontmatter — applyTo globs, description" fields={5} onClick={() => vscode.postMessage({ command: "openSchema", schema: "instruction" })} />
          <SchemaCard name="skill.schema.json" desc="Skill definition — name, parameters, steps" fields={4} onClick={() => vscode.postMessage({ command: "openSchema", schema: "skill" })} />
          <SchemaCard name="hook.schema.json" desc="Hook definition — events, commands, matchers" fields={6} onClick={() => vscode.postMessage({ command: "openSchema", schema: "hook" })} />
          <SchemaCard name="plugin.schema.json" desc="Plugin bundle — name, version, primitives" fields={8} onClick={() => vscode.postMessage({ command: "openSchema", schema: "plugin" })} />
        </div>
      </Section>

      <Section icon={Link} title="Auto-Wiring" color="#f59e0b">
        <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>
          When you place primitives (agents, skills, hooks) inside a solution play, the FAI Engine reads the manifest and propagates shared context to every primitive. No manual configuration — <strong>standalone LEGO blocks auto-wire when placed in a play</strong>.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12 }}>
          <span style={{ padding: "4px 10px", borderRadius: 4, background: "#10b98120", color: "#10b981" }}>Standalone</span>
          <ArrowRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ padding: "4px 10px", borderRadius: 4, background: "#06b6d420", color: "#06b6d4" }}>Place in Play</span>
          <ArrowRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ padding: "4px 10px", borderRadius: 4, background: "#8b5cf620", color: "#8b5cf6" }}>Auto-Wired</span>
        </div>
      </Section>
    </div>
  );
}

// ─── Layer Tab ───
const FROOT_LAYERS = [
  { id: "F", name: "Foundations", emoji: "🌱", color: "#10b981", desc: "Seeds of knowledge — GenAI fundamentals, LLM landscape, glossary", modules: ["F1: GenAI Foundations", "F2: LLM Landscape", "F3: AI Glossary A-Z", "F4: .github Agentic OS"] },
  { id: "R", name: "Reasoning", emoji: "🪵", color: "#a16207", desc: "Growing trunk — prompting, RAG architecture, deterministic AI", modules: ["R1: Prompt Engineering", "R2: RAG Architecture", "R3: Deterministic AI"] },
  { id: "O", name: "Orchestration", emoji: "🌿", color: "#16a34a", desc: "Branching out — Semantic Kernel, agent patterns, MCP & tools", modules: ["O1: Semantic Kernel", "O2: Agent Patterns", "O3: MCP & Tools"] },
  { id: "O*", name: "Operations", emoji: "🏗️", color: "#0ea5e9", desc: "Infrastructure — Azure AI, cloud infra, Copilot ecosystem", modules: ["O4: Azure AI Services", "O5: Cloud Infrastructure", "O6: Copilot Ecosystem"] },
  { id: "T", name: "Transformation", emoji: "🍎", color: "#ef4444", desc: "The fruit — fine-tuning, responsible AI, production readiness", modules: ["T1: Fine-Tuning", "T2: Responsible AI", "T3: Production Readiness"] },
];

function LayerTab() {
  return (
    <div>
      <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.85, marginBottom: 16 }}>
        The <strong>FAI Layer</strong> is the conceptual binding glue. It organizes knowledge into 5 layers (the FROOT tree metaphor: <strong>F</strong>oundations → <strong>R</strong>easoning → <strong>O</strong>rchestration → <strong>O</strong>perations → <strong>T</strong>ransformation) with 16 modules.
      </p>

      <Section icon={GitMerge} title="Context Wiring" color="#10b981">
        <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 8px" }}>
          Every primitive carries context — knowledge modules it references, WAF pillars it aligns to, and plays it's compatible with. The FAI Layer resolves these into a shared context chain.
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Knowledge Modules", "WAF Pillars", "Compatible Plays", "Evaluation Thresholds"].map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, background: "#10b98115", border: "1px solid #10b98130", color: "#10b981" }}>{tag}</span>
          ))}
        </div>
      </Section>

      <Section icon={Shield} title="WAF Alignment — 6 Pillars" color="#0ea5e9">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            { name: "Security", color: "#ef4444", desc: "Managed Identity, RBAC, content safety" },
            { name: "Reliability", color: "#f59e0b", desc: "Retry, circuit breaker, health checks" },
            { name: "Cost Optimization", color: "#10b981", desc: "Model routing, token budgets" },
            { name: "Operational Excellence", color: "#06b6d4", desc: "CI/CD, observability, IaC" },
            { name: "Performance Efficiency", color: "#8b5cf6", desc: "Caching, streaming, async" },
            { name: "Responsible AI", color: "#ec4899", desc: "Content safety, fairness, transparency" },
          ].map(p => (
            <div key={p.name} style={{ padding: 8, borderRadius: 6, border: `1px solid ${p.color}25`, background: `${p.color}08`, fontSize: 11 }}>
              <strong style={{ color: p.color }}>{p.name}</strong>
              <div style={{ opacity: 0.7, marginTop: 2 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <h3 style={{ fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
        <Layers size={16} color="#06b6d4" /> The FROOT Tree — 5 Layers, 16 Modules
      </h3>
      {FROOT_LAYERS.map(layer => (
        <div key={layer.id} style={{ marginBottom: 12, padding: 12, borderRadius: 8, border: `1px solid ${layer.color}25`, background: `${layer.color}06` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 20 }}>{layer.emoji}</span>
            <strong style={{ color: layer.color, fontSize: 13 }}>{layer.name}</strong>
            <span style={{ fontSize: 11, opacity: 0.5 }}>({layer.id})</span>
          </div>
          <p style={{ fontSize: 11, opacity: 0.7, margin: "0 0 6px" }}>{layer.desc}</p>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {layer.modules.map(m => (
              <button key={m} className="btn btn-sm btn-ghost" style={{ fontSize: 10, padding: "2px 8px" }}
                onClick={() => vscode.postMessage({ command: "openModule", moduleId: m.split(":")[0].trim() })}>
                {m}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Engine Tab ───
const ENGINE_MODULES = [
  { id: "manifest-reader", Icon: FileText, color: "#10b981", desc: "Loads, parses, and validates fai-manifest.json against the schema. Entry point for all resolution." },
  { id: "context-resolver", Icon: Search, color: "#06b6d4", desc: "Resolves the shared context chain — merges knowledge modules, WAF pillars, and play compatibility across all wired primitives." },
  { id: "primitive-wirer", Icon: Link, color: "#8b5cf6", desc: "Connects agents, instructions, skills, and hooks into the execution graph. Validates references and reports broken links." },
  { id: "hook-runner", Icon: Play, color: "#f59e0b", desc: "Executes lifecycle hooks at 8 events: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PreCompact, SubagentStart, SubagentStop, Stop." },
  { id: "evaluator", Icon: BarChart3, color: "#ec4899", desc: "Runs quality metrics (groundedness, relevance, coherence, fluency, safety) against configured thresholds." },
  { id: "mcp-bridge", Icon: Cloud, color: "#0ea5e9", desc: "Bridges FAI primitives to the MCP protocol — exposes 45 tools, handles tool discovery and invocation." },
  { id: "validator", Icon: CheckCircle, color: "#22c55e", desc: "2,800+ validation checks across all primitive types. Powers the CI/CD quality gate." },
];

function EngineTab() {
  return (
    <div>
      <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.85, marginBottom: 16 }}>
        The <strong>FAI Engine</strong> is the runtime that reads manifests, resolves context, wires primitives, runs hooks, and bridges to external protocols (MCP, A2A). Written in TypeScript, 7 modules, 42 tests.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 16, padding: 12, borderRadius: 8, background: "var(--vscode-textCodeBlock-background, #1e1e1e)" }}>
        {ENGINE_MODULES.map((m, i) => (
          <span key={m.id}>
            <span style={{ padding: "3px 8px", borderRadius: 4, background: `${m.color}20`, color: m.color, fontSize: 11, fontWeight: 600 }}>{m.id}</span>
            {i < ENGINE_MODULES.length - 1 && <ArrowRight size={12} style={{ margin: "0 4px", opacity: 0.3, verticalAlign: -2 }} />}
          </span>
        ))}
      </div>

      {ENGINE_MODULES.map(m => (
        <div key={m.id} className="glow-card" style={{ marginBottom: 10, padding: 14, borderRadius: 8, border: `1px solid ${m.color}20`, background: `${m.color}05` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ padding: 4, borderRadius: 4, background: `${m.color}20` }}><m.Icon size={14} color={m.color} /></span>
            <strong style={{ fontSize: 12 }}>{m.id}</strong>
          </div>
          <p style={{ fontSize: 11, opacity: 0.8, margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
        </div>
      ))}

      <Section icon={Cog} title="Configuration" color="#f59e0b">
        <SpecRow label="Language" value="TypeScript (Node.js)" mono />
        <SpecRow label="Test Suite" value="42 tests (Vitest)" />
        <SpecRow label="Entry Point" value="engine/src/index.ts" mono />
        <SpecRow label="Package" value="@frootai/engine (internal)" mono />
        <SpecRow label="Validation" value="2,800+ checks via validate-primitives.js" />
      </Section>
    </div>
  );
}

// ─── Factory Tab ───
function FactoryTab() {
  return (
    <div>
      <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.85, marginBottom: 16 }}>
        The <strong>FAI Factory</strong> is the CI/CD pipeline that builds, tests, validates, and publishes FrootAI across all distribution channels.
      </p>

      <Section icon={CheckCircle} title="Validation Pipeline" color="#10b981">
        <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 8px" }}>Every commit triggers 2,800+ checks:</p>
        <div style={{ display: "grid", gap: 4, fontSize: 12 }}>
          {[
            "Schema validation — all 7 primitive types checked against JSON Schema",
            "Naming convention — lowercase-hyphen for all file names",
            "Frontmatter — required fields per primitive type (description, applyTo, etc.)",
            "WAF alignment — valid pillar references from the 6-pillar set",
            "Cross-references — broken links, missing dependencies detected",
            "Content quality — no empty files, no placeholder content",
          ].map((check, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
              <CheckCircle size={12} color="#10b981" style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ opacity: 0.8 }}>{check}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Rocket} title="Distribution Channels" color="#8b5cf6">
        <div style={{ display: "grid", gap: 8 }}>
          {[
            { name: "VS Code Extension", pkg: "frootai.frootai-vscode", ver: "v9.2.0", Icon: Cog, color: "#0ea5e9" },
            { name: "MCP Server (npm)", pkg: "frootai-mcp", ver: "v3.5.0", Icon: Cloud, color: "#10b981" },
            { name: "Python SDK (PyPI)", pkg: "frootai", ver: "v4.0.0", Icon: Package, color: "#f59e0b" },
            { name: "Python MCP (PyPI)", pkg: "frootai-mcp", ver: "v3.5.0", Icon: Cloud, color: "#8b5cf6" },
            { name: "Docker Image", pkg: "ghcr.io/frootai/mcp", ver: "v3.5.0", Icon: Box, color: "#06b6d4" },
          ].map(ch => (
            <div key={ch.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 6, border: `1px solid ${ch.color}20`, background: `${ch.color}06` }}>
              <ch.Icon size={16} color={ch.color} />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 12 }}>{ch.name}</strong>
                <div style={{ fontSize: 10, opacity: 0.6, fontFamily: "var(--vscode-editor-font-family)" }}>{ch.pkg}</div>
              </div>
              <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: `${ch.color}20`, color: ch.color }}>{ch.ver}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Zap} title="GitHub Actions" color="#f59e0b">
        <p style={{ fontSize: 12, opacity: 0.8, margin: "0 0 8px" }}>15 automated workflows:</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11 }}>
          {[
            "validate-primitives", "build-extension", "publish-npm",
            "publish-vsce", "publish-pypi", "build-docker",
            "sync-content", "validate-schemas", "generate-knowledge",
            "release-dry", "release", "test-engine",
            "lint", "deploy-website", "security-scan",
          ].map(wf => (
            <div key={wf} style={{ padding: "3px 6px", borderRadius: 4, background: "var(--vscode-textCodeBlock-background, #1e1e1e)", fontFamily: "var(--vscode-editor-font-family)", opacity: 0.8 }}>
              {wf}
            </div>
          ))}
        </div>
      </Section>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button className="btn btn-sm" style={{ background: "#10b98120", color: "#10b981", borderColor: "#10b981" }}
          onClick={() => vscode.postMessage({ command: "openUrl", url: "https://github.com/frootai/frootai/actions" })}>
          <ExternalLink size={12} /> GitHub Actions ↗
        </button>
        <button className="btn btn-sm" style={{ background: "#8b5cf620", color: "#8b5cf6", borderColor: "#8b5cf6" }}
          onClick={() => vscode.postMessage({ command: "openUrl", url: "https://www.npmjs.com/package/frootai-mcp" })}>
          <ExternalLink size={12} /> npm Registry ↗
        </button>
      </div>
    </div>
  );
}

// ─── Main Panel ───
interface Props { logoUri?: string; }

export default function ProtocolExplainer({ logoUri }: Props) {
  const [tab, setTab] = useState<Tab>("protocol");

  return (
    <div className="container">
      {/* Hero */}
      <div className="hero">
        {logoUri && <img src={logoUri} alt="FrootAI" style={{ width: 48, height: 48 }} />}
        <h1>FAI Protocol & Architecture</h1>
        <p style={{ opacity: 0.6, fontSize: 12 }}>The open glue for GenAI — specification, layers, engine, and factory</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              className={`btn btn-sm ${active ? "" : "btn-ghost"}`}
              onClick={() => setTab(t.id)}
              style={{
                background: active ? `${t.color}20` : undefined,
                borderColor: active ? t.color : undefined,
                color: active ? t.color : undefined,
                fontWeight: active ? 700 : 400,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <t.Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "protocol" && <ProtocolTab />}
      {tab === "layer" && <LayerTab />}
      {tab === "engine" && <EngineTab />}
      {tab === "factory" && <FactoryTab />}

      {/* Footer */}
      <div style={{ marginTop: 24, padding: 12, borderRadius: 8, background: "var(--vscode-textCodeBlock-background, #1e1e1e)", fontSize: 11, opacity: 0.7, textAlign: "center" }}>
        Explore further on{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); vscode.postMessage({ command: "openUrl", url: "https://frootai.dev/fai-protocol" }); }} style={{ color: "#10b981" }}>
          frootai.dev/fai-protocol ↗
        </a>
      </div>
    </div>
  );
}
