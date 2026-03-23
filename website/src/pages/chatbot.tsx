import React, { useState, useRef, useEffect } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

const CHAT_API_URL = "https://frootai-chatbot-api.azurewebsites.net/api/chat";
const USE_FALLBACK = true;

const SUGGESTIONS = [
  "Which play should I use for building a RAG pipeline?",
  "How do I get started with FrootAI?",
  "Compare gpt-4o vs gpt-4.1 for my use case",
  "How much will an AI agent solution cost per month?",
  "What is the .github Agentic OS?",
  "How do I set up the MCP server?",
];

const FALLBACK: Record<string, string> = {
  document: "For document processing: **Play 06** (Document Intelligence) or **Play 15** (Multi-Modal DocProc).\n\n[User Guide Play 06](/user-guide?play=06) | [User Guide Play 15](/user-guide?play=15)",
  rag: "For RAG pipelines: **Play 01** (Enterprise RAG Q and A) with AI Search + OpenAI.\n\n[User Guide](/user-guide?play=01) | [All Plays](/solution-plays)",
  agent: "For AI agents: **Play 03** (Deterministic) or **Play 07** (Multi-Agent Service).\n\n[User Guide Play 03](/user-guide?play=03)",
  cost: "RAG: $150-300/mo (dev), $2K-8K (prod). Agent: $100-250 (dev), $1.5K-6K (prod).\n\nPlay 14 covers FinOps. [User Guide](/user-guide?play=14)",
  mcp: "Quick MCP setup: Add to .vscode/mcp.json or run: npx frootai-mcp\n\n[Setup Guide](/setup-guide) | [MCP Tools](/mcp-tooling)",
  start: "1. Try [Configurator](/configurator) 2. Install VS Code Extension 3. Init DevKit 4. Init TuneKit 5. Deploy\n\n[Setup Guide](/setup-guide)",
};

function getFallback(msg: string): string {
  const q = msg.toLowerCase();
  for (const [k, v] of Object.entries(FALLBACK)) { if (q.includes(k)) return v; }
  return "I can help with: solution plays, RAG, agents, costs, MCP setup, getting started.\n\nTry the [Configurator](/configurator) for a guided recommendation.";
}

export default function ChatbotPage(): JSX.Element {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{role: string; text: string}>>([
    { role: "assistant", text: "Welcome to **FAI Agent**  your AI architecture guide, powered by **Azure OpenAI GPT-4.1**.\n\nI know everything about FrootAI: 20 solution plays, 16 MCP tools, 18 knowledge modules, and the full ecosystem. Ask me anything!" }
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  // Simple markdown to HTML for clickable links + formatting
  const renderMd = (text: string) => {
    let html = text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#f59e0b;text-decoration:underline;" target="_blank">$1</a>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(245,158,11,0.1);padding:2px 6px;border-radius:4px;font-size:0.8rem;">$1</code>')
      .replace(/^### (.+)$/gm, '<h4 style="margin:8px 0 4px;font-size:0.9rem;font-weight:700;">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 style="margin:10px 0 4px;font-size:0.95rem;font-weight:700;">$1</h3>')
      .replace(/^- (.+)$/gm, '• $1')
      .replace(/^(\d+)\. (.+)$/gm, '$1. $2')
      .replace(/\n/g, '<br/>');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const send = async (text?: string) => {
    const message = text || msg;
    if (!message.trim() || loading) return;
    const newH = [...history, { role: "user", text: message }];
    setHistory(newH); setMsg(""); setLoading(true);
    try {
      const res = await fetch(CHAT_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, history: newH.slice(-10).map(m => ({ role: m.role, content: m.text })) }) });
      if (res.ok) { const d = await res.json(); setHistory([...newH, { role: "assistant", text: d.reply }]); }
      else throw new Error("API " + res.status);
    } catch { setHistory([...newH, { role: "assistant", text: USE_FALLBACK ? getFallback(message) : "Could not reach AI service. Try: npx frootai-mcp" }]); }
    finally { setLoading(false); }
  };

  return (
    <Layout title="FAI Agent - FrootAI" description="AI-powered architecture guide. Grounded in 20 solution plays, 16 MCP tools, 18 knowledge modules. Powered by Azure OpenAI GPT-4.1.">
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 20px 60px" }}>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ display: "inline-block", padding: "3px 14px", borderRadius: "20px", background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(234,179,8,0.08))", border: "1px solid rgba(245,158,11,0.3)", fontSize: "0.65rem", color: "#f59e0b", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "8px" }}>
            Powered by Azure OpenAI GPT-4.1
          </div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 4px" }}>FAI Agent</h1>
          <p style={{ color: "var(--ifm-color-emphasis-400)", fontSize: "0.82rem", margin: 0 }}>
            Your AI architecture guide. Grounded in the complete FrootAI ecosystem.
          </p>
        </div>

        <div style={{ border: "1px solid rgba(245,158,11,0.2)", borderRadius: "16px", background: "rgba(26,26,46,0.6)", display: "flex", flexDirection: "column", minHeight: "450px" }}>
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", maxHeight: "550px" }}>
            {history.map((m, i) => (
              <div key={i} style={{ marginBottom: "14px", display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "rgba(245,158,11,0.12)" : "rgba(99,102,241,0.08)", border: `1px solid ${m.role === "user" ? "rgba(245,158,11,0.25)" : "rgba(99,102,241,0.15)"}`, fontSize: "0.84rem", lineHeight: 1.65 }}>
                  {m.role === "assistant" ? renderMd(m.text) : m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "14px" }}>
                <div style={{ padding: "12px 16px", borderRadius: "14px 14px 14px 4px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", fontSize: "0.84rem" }}>
                  <span style={{ display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }}>Thinking with GPT-4.1...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {history.length <= 1 && (
            <div style={{ padding: "8px 16px 4px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ padding: "5px 12px", borderRadius: "8px", border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.05)", color: "#f59e0b", fontSize: "0.72rem", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,158,11,0.12)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,158,11,0.05)"; e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)"; }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "8px" }}>
            <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask FAI Agent anything about FrootAI..." style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(245,158,11,0.2)", background: "rgba(0,0,0,0.3)", color: "#e0e0e0", fontSize: "0.85rem", outline: "none" }} disabled={loading} />
            <button onClick={() => send()} disabled={loading} style={{ padding: "12px 24px", borderRadius: "10px", background: loading ? "#444" : "linear-gradient(135deg, #f59e0b, #eab308)", color: "#000", border: "none", fontWeight: 700, cursor: loading ? "default" : "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}>{loading ? "..." : "Ask"}</button>
          </div>
        </div>

        <div style={{ marginTop: "16px", textAlign: "center", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className={styles.glowPill} style={{ "--pill-color": "#f59e0b" } as React.CSSProperties}>Back to FrootAI</Link>
          <Link to="/configurator" className={styles.glowPill} style={{ "--pill-color": "#6366f1" } as React.CSSProperties}>Solution Configurator</Link>
          <Link to="/ecosystem" className={styles.glowPill} style={{ "--pill-color": "#7c3aed" } as React.CSSProperties}>FAI Ecosystem</Link>
        </div>
      </div>
    </Layout>
  );
}