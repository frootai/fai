import { useState } from "react";
import MetricCard from "../components/MetricCard";
import { vscode } from "../vscode";

const METRICS = [
  { key: "groundedness", icon: "🎯", threshold: 4.0 },
  { key: "relevance", icon: "🔍", threshold: 4.0 },
  { key: "coherence", icon: "🔗", threshold: 4.0 },
  { key: "fluency", icon: "💬", threshold: 4.0 },
  { key: "safety", icon: "🛡️", threshold: 4.0 },
];

const DEFAULT_SCORES: Record<string, number> = {
  groundedness: 4.5, relevance: 3.8, coherence: 4.2, fluency: 4.6, safety: 4.9,
};

// Simulated history for trend visualization (most recent first)
const MOCK_HISTORY: Array<{ label: string; scores: Record<string, number> }> = [
  { label: "Run 5 (latest)", scores: { groundedness: 4.5, relevance: 3.8, coherence: 4.2, fluency: 4.6, safety: 4.9 } },
  { label: "Run 4", scores: { groundedness: 4.3, relevance: 3.6, coherence: 4.0, fluency: 4.5, safety: 4.8 } },
  { label: "Run 3", scores: { groundedness: 4.1, relevance: 3.9, coherence: 3.8, fluency: 4.4, safety: 4.7 } },
  { label: "Run 2", scores: { groundedness: 3.8, relevance: 3.5, coherence: 3.7, fluency: 4.3, safety: 4.6 } },
  { label: "Run 1", scores: { groundedness: 3.5, relevance: 3.2, coherence: 3.5, fluency: 4.1, safety: 4.5 } },
];

interface Props {
  scores?: Record<string, number>;
  history?: Array<{ label: string; scores: Record<string, number> }>;
}

function TrendBar({ values, threshold, color }: { values: number[]; threshold: number; color: string }) {
  const max = 5;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
      {values.map((v, i) => {
        const h = (v / max) * 100;
        const isLatest = i === values.length - 1;
        const pass = v >= threshold;
        return (
          <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                width: isLatest ? 14 : 10,
                height: `${h}%`,
                minHeight: 4,
                background: pass ? color : "#ef4444",
                borderRadius: 2,
                opacity: isLatest ? 1 : 0.5 + (i * 0.1),
                transition: "all 0.3s ease",
              }}
              title={`${v.toFixed(1)} / 5.0`}
            />
          </div>
        );
      })}
      {/* threshold line */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: `${(threshold / max) * 100}%`, borderBottom: "1px dashed rgba(255,255,255,0.2)" }} />
    </div>
  );
}

function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  const delta = current - previous;
  if (Math.abs(delta) < 0.05) return <span style={{ fontSize: 11, opacity: 0.5 }}>—</span>;
  const up = delta > 0;
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: up ? "#10b981" : "#ef4444" }}>
      {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}
    </span>
  );
}

export default function Evaluation({ scores, history }: Props) {
  const s = scores ?? DEFAULT_SCORES;
  const hist = history ?? MOCK_HISTORY;
  const [showTrends, setShowTrends] = useState(true);
  const allPass = METRICS.every((m) => (s[m.key] ?? 0) >= m.threshold);
  const passCount = METRICS.filter((m) => (s[m.key] ?? 0) >= m.threshold).length;
  const avg = METRICS.reduce((sum, m) => sum + (s[m.key] ?? 0), 0) / METRICS.length;
  const prevRun = hist.length >= 2 ? hist[1].scores : null;

  return (
    <div className="container">
      <div className="hero">
        <span className="hero-icon">{allPass ? "✅" : "⚠️"}</span>
        <h1>Evaluation Dashboard</h1>
        <span className="badge" style={{ background: allPass ? "#10b981" : "#ef4444", fontSize: 14, padding: "6px 16px" }}>
          {allPass ? "ALL METRICS PASS" : `${passCount}/${METRICS.length} METRICS PASS`}
        </span>
      </div>

      {/* Summary stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase" }}>Average Score</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: avg >= 4 ? "#10b981" : avg >= 3 ? "#f59e0b" : "#ef4444" }}>{avg.toFixed(2)}</div>
          {prevRun && <DeltaBadge current={avg} previous={METRICS.reduce((sum, m) => sum + (prevRun[m.key] ?? 0), 0) / METRICS.length} />}
        </div>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase" }}>Pass Rate</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: allPass ? "#10b981" : "#f59e0b" }}>{Math.round((passCount / METRICS.length) * 100)}%</div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 120, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase" }}>Total Runs</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{hist.length}</div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        {METRICS.map((m) => (
          <MetricCard key={m.key} name={m.key} icon={m.icon} score={s[m.key] ?? 0} threshold={m.threshold} />
        ))}
      </div>

      {/* Trend chart section */}
      {hist.length > 1 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 16, margin: 0 }}>📈 Metric Trends</h2>
            <button className="btn btn-secondary" style={{ fontSize: 11, padding: "4px 10px" }}
              onClick={() => setShowTrends(!showTrends)}>
              {showTrends ? "Hide" : "Show"} Trends
            </button>
          </div>
          {showTrends && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 60px 60px", gap: 8, alignItems: "center" }}>
                <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 600 }}>METRIC</div>
                <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 600 }}>LAST {hist.length} RUNS</div>
                <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 600, textAlign: "right" }}>CURRENT</div>
                <div style={{ fontSize: 11, opacity: 0.5, fontWeight: 600, textAlign: "right" }}>DELTA</div>
                {METRICS.map((m) => {
                  const trendValues = [...hist].reverse().map((h) => h.scores[m.key] ?? 0);
                  const scoreColor = (s[m.key] ?? 0) >= 4 ? "#10b981" : (s[m.key] ?? 0) >= 3 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={m.key} style={{ display: "contents" }}>
                      <div style={{ fontSize: 13, textTransform: "capitalize" }}>{m.icon} {m.key}</div>
                      <div style={{ position: "relative" }}>
                        <TrendBar values={trendValues} threshold={m.threshold} color={scoreColor} />
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: scoreColor, textAlign: "right" }}>{(s[m.key] ?? 0).toFixed(1)}</div>
                      <div style={{ textAlign: "right" }}>
                        {prevRun && <DeltaBadge current={s[m.key] ?? 0} previous={prevRun[m.key] ?? 0} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn" onClick={() => vscode.postMessage({ command: "runEvaluation" })}>
          ▶ Run Evaluation
        </button>
        <button className="btn btn-secondary" onClick={() => vscode.postMessage({ command: "exportJson", scores: s })}>
          📋 Export JSON
        </button>
        <button className="btn btn-secondary" onClick={() => vscode.postMessage({ command: "exportCsv", scores: s })}>
          📊 Export CSV
        </button>
      </div>
    </div>
  );
}
