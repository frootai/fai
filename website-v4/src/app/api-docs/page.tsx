import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "REST API — FrootAI Endpoints",
  description:
    "FrootAI REST API reference — 6 endpoints for health checks, play search, cost estimation, and AI chat.",
};

const BASE_URL = "https://frootai-chatbot-api.azurewebsites.net/api";

const endpoints = [
  {
    method: "GET",
    path: "/health",
    description: "Health check — returns server status, version, and uptime.",
    response: `{
  "status": "healthy",
  "version": "3.2.0",
  "uptime": "24h 12m"
}`,
    methodColor: "text-froot-emerald bg-froot-emerald/20",
  },
  {
    method: "POST",
    path: "/search-plays",
    description:
      "Semantic search across all 20 solution plays. Returns ranked results with confidence scores.",
    body: `{
  "query": "process invoices with AI",
  "top_k": 3
}`,
    response: `{
  "results": [
    { "play": "06", "title": "Document Intelligence", "score": 0.94 },
    { "play": "15", "title": "Multi-Modal DocProc", "score": 0.87 }
  ]
}`,
    methodColor: "text-froot-amber bg-froot-amber/20",
  },
  {
    method: "POST",
    path: "/estimate-cost",
    description:
      "Estimate monthly Azure costs for a solution play at dev or production scale.",
    body: `{
  "play": "01",
  "scale": "prod"
}`,
    response: `{
  "play": "01-enterprise-rag",
  "scale": "prod",
  "monthly_estimate": "$1,240",
  "breakdown": { ... }
}`,
    methodColor: "text-froot-amber bg-froot-amber/20",
  },
  {
    method: "POST",
    path: "/chat",
    description:
      "AI chat endpoint — ask questions about FrootAI, Azure AI, or architecture patterns.",
    body: `{
  "message": "What is the best play for a call center?",
  "history": []
}`,
    response: `{
  "reply": "Play 04 — Call Center Voice AI is designed for...",
  "sources": ["O2", "O4"]
}`,
    methodColor: "text-froot-amber bg-froot-amber/20",
  },
  {
    method: "POST",
    path: "/chat/stream",
    description:
      "Streaming chat endpoint — returns Server-Sent Events for real-time responses.",
    body: `{
  "message": "Explain RAG architecture",
  "history": []
}`,
    response: "data: {\"chunk\": \"RAG (Retrieval-Augmented Generation)...\"}\ndata: {\"chunk\": \" combines retrieval...\"}\ndata: [DONE]",
    methodColor: "text-froot-amber bg-froot-amber/20",
  },
  {
    method: "GET",
    path: "/openapi.json",
    description: "OpenAPI 3.0 specification for all endpoints.",
    response: "Returns the full OpenAPI spec JSON.",
    methodColor: "text-froot-emerald bg-froot-emerald/20",
  },
];

export default function ApiDocsPage() {
  return (
    <PageShell
      title="📡 REST API"
      subtitle="6 endpoints for health checks, play search, cost estimation, and AI-powered chat."
      backLink={{ label: "Back to Developer Hub", href: "/dev-hub" }}
    >
      {/* Base URL */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-sm font-medium text-gray-400">Base URL</h2>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-cyan">
          <code>{BASE_URL}</code>
        </pre>
      </div>

      {/* Endpoints */}
      <div className="mt-10 space-y-8">
        {endpoints.map((ep) => (
          <div
            key={ep.path}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <span
                className={`rounded-md px-3 py-1 text-xs font-bold ${ep.methodColor}`}
              >
                {ep.method}
              </span>
              <code className="text-sm text-white">{ep.path}</code>
            </div>

            <p className="mt-3 text-gray-300">{ep.description}</p>

            {/* Request body */}
            {ep.body && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-400">
                  Request Body
                </p>
                <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-amber">
                  <code>{ep.body}</code>
                </pre>
              </div>
            )}

            {/* Response */}
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-gray-400">
                Response
              </p>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 text-sm text-froot-emerald">
                <code>{ep.response}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <div className="mt-12 flex flex-wrap gap-4">
        <a
          href={`${BASE_URL}/openapi.json`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-froot-cyan/20 px-6 py-3 font-medium text-froot-cyan transition hover:bg-froot-cyan/30"
        >
          OpenAPI Spec ↗
        </a>
        <a
          href={`${BASE_URL}/health`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-froot-emerald/20 px-6 py-3 font-medium text-froot-emerald transition hover:bg-froot-emerald/30"
        >
          Health Check ↗
        </a>
        <Link
          href="/mcp-tooling"
          className="rounded-lg bg-froot-indigo/20 px-6 py-3 font-medium text-froot-indigo transition hover:bg-froot-indigo/30"
        >
          MCP Server →
        </Link>
      </div>
    </PageShell>
  );
}
