"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send } from "lucide-react";

const CHAT_API = "https://frootai-chatbot-api.azurewebsites.net/api/chat";
const STREAM_API = "https://frootai-chatbot-api.azurewebsites.net/api/chat/stream";

const SUGGESTIONS = [
  "Which play should I use for building a RAG pipeline?",
  "How do I get started with FrootAI?",
  "Compare gpt-4o vs gpt-4.1 for my use case",
  "How much will an AI agent solution cost per month?",
  "What is the .github Agentic OS?",
  "How do I set up the MCP server?",
];

function getFollowUps(lastReply: string): string[] {
  const r = lastReply.toLowerCase();
  if (r.includes("play 01") || r.includes("rag")) return ["How do I deploy Play 01?", "What chunking strategy should I use?", "Compare Play 01 vs Play 09"];
  if (r.includes("play 03") || r.includes("deterministic")) return ["How do guardrails work in Play 03?", "Can I combine Play 03 with Play 07?", "What is temperature=0?"];
  if (r.includes("play 07") || r.includes("multi-agent")) return ["How does agent handoff work?", "What's the Cosmos DB schema for state?", "Play 07 cost estimate"];
  if (r.includes("play 14") || r.includes("gateway") || r.includes("finops")) return ["How does semantic caching work?", "What's the token metering setup?", "Compare APIM vs custom proxy"];
  if (r.includes("mcp") || r.includes("npx frootai")) return ["List all 22 MCP tools", "How do agent chain tools work?", "What's the model catalog tool?"];
  if (r.includes("devkit") || r.includes("agentic os")) return ["What files are in L1 Always-On?", "How do prompts differ from agents?", "What are skills?"];
  if (r.includes("vs code") || r.includes("extension")) return ["How does Init DevKit work?", "What are the 4 sidebar panels?", "How to auto-chain agents?"];
  if (r.includes("cost") || r.includes("pricing")) return ["Which model is cheapest for classification?", "How to reduce costs with caching?", "Play 14 AI Gateway details"];
  if (r.includes("configurator")) return ["Show me all 20 plays", "Which play for document processing?", "What's the easiest play to start with?"];
  return ["Show me the 20 solution plays", "How do I install the VS Code extension?", "What is the FROOT framework?", "Recommend a play for my team"];
}

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
  for (const [k, v] of Object.entries(FALLBACK)) {
    if (q.includes(k)) return v;
  }
  return "I can help with: solution plays, RAG, agents, costs, MCP setup, getting started.\n\nTry the [Configurator](/configurator) for a guided recommendation.";
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const mdComponents: Record<string, React.FC<any>> = {
  a: ({ href, children }: any) => (
    <a href={href || ""} className="text-froot-amber underline font-medium" target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  strong: ({ children }: any) => <strong className="text-froot-gold font-bold">{children}</strong>,
  code: ({ children, className }: any) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <pre className="bg-black/40 border border-froot-amber/15 rounded-lg p-3 my-2 overflow-x-auto text-[12px] leading-relaxed">
        <code>{children}</code>
      </pre>
    ) : (
      <code className="bg-froot-amber/10 px-1.5 py-0.5 rounded text-[12px] text-froot-gold">{children}</code>
    );
  },
  pre: ({ children }: any) => <>{children}</>,
  p: ({ children }: any) => <p className="my-1.5 leading-relaxed">{children}</p>,
  ul: ({ children }: any) => <ul className="my-1 pl-4 list-disc">{children}</ul>,
  ol: ({ children }: any) => <ol className="my-1 pl-4 list-decimal">{children}</ol>,
  li: ({ children }: any) => <li className="my-0.5 text-[13px] leading-relaxed">{children}</li>,
  blockquote: ({ children }: any) => (
    <blockquote className="my-2 border-l-2 border-froot-amber pl-3 text-muted-foreground italic">{children}</blockquote>
  ),
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function ChatbotClient() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Message[]>([
    { role: "assistant", text: "Hi, I'm **FAI**. Ready to make your journey **frootful**? 🌱\n\n> 🖐️ **New here?** Try [Hi FAI](/hi-fai) — our 5-minute quickstart guide." },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (chatRef.current && autoScroll) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history, autoScroll]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const handleScroll = () => {
      setAutoScroll(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const send = useCallback(async (text?: string) => {
    const message = text || msg;
    if (!message.trim() || loading) return;
    const newH = [...history, { role: "user" as const, text: message }];
    setHistory(newH);
    setMsg("");
    setLoading(true);
    setAutoScroll(true);

    // Compute augmentation
    let computeContext = "";
    const q = message.toLowerCase();
    try {
      const costMatch = q.match(/(?:cost|price|pricing|how much|estimate|budget).*(?:play|solution)?\s*(\d{1,2})/);
      if (costMatch || q.includes("cost") || q.includes("pricing") || q.includes("how much")) {
        const playNum = costMatch?.[1] || "01";
        const scale = q.includes("prod") || q.includes("production") ? "prod" : "dev";
        const r = await fetch(CHAT_API.replace("/api/chat", "/api/estimate-cost"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ play: playNum, scale }),
        });
        if (r.ok) {
          const data = await r.json();
          computeContext = `\n\n[COMPUTED DATA]\nCost estimate for Play ${data.play.id} (${data.play.name}) at ${data.scale} scale:\n${data.items.map((i: any) => `- ${i.service}: $${i.cost}/mo`).join("\n")}\nTotal: $${data.total}/mo\n[END]`;
        }
      } else if (q.includes("which play") || q.includes("what play") || q.includes("recommend") || q.includes("find a play") || q.includes("suggest")) {
        const r = await fetch(CHAT_API.replace("/api/chat", "/api/search-plays"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: message }),
        });
        if (r.ok) {
          const data = await r.json();
          computeContext = `\n\n[COMPUTED DATA]\nPlay search results for "${message}":\n${data.results.map((p: any) => `- Play ${p.id}: ${p.name} (${(p.score * 100).toFixed(0)}% match)`).join("\n")}\n[END]`;
        }
      }
    } catch { /* augmentation is optional */ }

    const streamH: Message[] = [...newH, { role: "assistant", text: "" }];
    setHistory(streamH);

    try {
      const msgWithContext = computeContext ? message + computeContext : message;
      const res = await fetch(STREAM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgWithContext, history: newH.slice(-10).map(m => ({ role: m.role, content: m.text })) }),
      });
      if (!res.ok || !res.body) throw new Error("API " + res.status);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.content) {
                accumulated += json.content;
                setHistory([...newH, { role: "assistant", text: accumulated }]);
              }
            } catch { /* skip bad chunks */ }
          }
        }
      }
      if (!accumulated) throw new Error("Empty stream");
    } catch {
      setHistory([...newH, { role: "assistant", text: getFallback(message) }]);
    } finally {
      setLoading(false);
    }
  }, [msg, loading, history]);

  const lastAssistant = [...history].reverse().find(m => m.role === "assistant");
  const followUps = lastAssistant ? getFollowUps(lastAssistant.text) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 relative">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.06),transparent_70%)]" />

      {/* Hero header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-block px-3 py-1 rounded-full bg-froot-amber/10 border border-froot-amber/20 text-[11px] text-froot-amber font-bold uppercase tracking-wider mb-3">
          Powered by Azure OpenAI GPT-4.1
        </div>
        <h1 className="text-4xl font-extrabold gradient-text-gold">✨ Agent FAI</h1>
        <p className="mt-2 text-[14px] text-muted-foreground">
          Your open glue for binding{" "}
          <span className="text-froot-emerald font-bold">Infrastructure</span>,{" "}
          <span className="text-froot-cyan font-bold">Platform</span> &{" "}
          <span className="text-froot-violet font-bold">Application</span>
        </p>
        <p className="text-[12px] text-muted-foreground/50 italic">From the Roots to the Fruits</p>
      </div>

      {/* Chat container */}
      <div className="glass rounded-3xl flex flex-col min-h-[520px] shadow-2xl relative z-10">
        {/* Messages */}
        <div ref={chatRef} className="flex-1 p-5 overflow-y-auto max-h-[520px] space-y-4">
          {history.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-froot-amber/20 to-froot-indigo/15 border border-froot-amber/30 flex items-center justify-center text-[12px] shrink-0 mt-0.5">
                  ✨
                </div>
              )}
              <div
                className={`max-w-[85%] px-4 py-3 text-[13px] leading-relaxed backdrop-blur-sm ${
                  m.role === "user"
                    ? "bg-froot-amber/8 border border-froot-amber/15 rounded-2xl rounded-br-sm"
                    : "bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-bl-sm"
                } ${loading && i === history.length - 1 && m.role === "assistant" ? "streaming-cursor" : ""}`}
              >
                {m.role === "assistant" ? (
                  <Markdown remarkPlugins={[remarkGfm]} components={mdComponents}>{m.text}</Markdown>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}

          {/* Loading dots */}
          {loading && history[history.length - 1]?.text === "" && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-froot-amber/20 to-froot-indigo/15 border border-froot-amber/30 flex items-center justify-center text-[12px] shrink-0">
                ✨
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="inline-flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay) => (
                    <span
                      key={delay}
                      className="w-[7px] h-[7px] rounded-full bg-froot-amber"
                      style={{ animation: `bounce-dot 1.4s ease-in-out ${delay}s infinite` }}
                    />
                  ))}
                  <span className="text-[12px] text-muted-foreground ml-1.5">Agent FAI is thinking</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion chips */}
        {!loading && (
          <div className="px-5 pb-2 flex gap-1.5 flex-wrap">
            {(history.length <= 1 ? SUGGESTIONS : followUps).map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                className="px-3 py-1.5 rounded-full border border-froot-amber/20 bg-froot-amber/[0.03] text-froot-amber text-[11px] cursor-pointer transition-all hover:bg-froot-amber/10 hover:border-froot-amber/40 whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/[0.04] flex gap-2.5 items-end">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything... (Shift+Enter for new line)"
            rows={1}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur text-[14px] text-foreground outline-none resize-none min-h-[48px] max-h-[160px] transition-colors focus:border-froot-amber/30 focus:bg-white/[0.05] placeholder:text-muted-foreground/50"
            onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 160) + "px"; }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !msg.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-froot-indigo to-froot-violet text-white font-bold text-[14px] cursor-pointer transition-all shadow-lg shadow-froot-indigo/30 disabled:opacity-30 disabled:cursor-default disabled:shadow-none hover:shadow-froot-indigo/50"
          >
            {loading ? "..." : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Bottom links */}
      <div className="mt-5 flex gap-2 justify-center flex-wrap">
        {[
          { label: "Back to FrootAI", to: "/", color: "#f59e0b" },
          { label: "Solution Configurator", to: "/configurator", color: "#6366f1" },
          { label: "FAI Ecosystem", to: "/ecosystem", color: "#7c3aed" },
          { label: "FAI Learning Center", to: "/learning-hub", color: "#f97316" },
        ].map((p) => (
          <Link
            key={p.label}
            href={p.to}
            className="rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all hover:bg-white/5"
            style={{ borderColor: `${p.color}33`, color: p.color }}
          >
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
