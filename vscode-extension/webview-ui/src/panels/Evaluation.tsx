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

interface Props { scores?: Record<string, number>; }

export default function Evaluation({ scores }: Props) {
  const s = scores ?? DEFAULT_SCORES;
  const allPass = METRICS.every((m) => (s[m.key] ?? 0) >= m.threshold);

  return (
    <div className="container">
      <div className="hero">
        <span className="hero-icon">{allPass ? "✅" : "⚠️"}</span>
        <h1>Evaluation Dashboard</h1>
        <span className="badge" style={{ background: allPass ? "#10b981" : "#ef4444", fontSize: 14, padding: "6px 16px" }}>
          {allPass ? "ALL METRICS PASS" : "SOME METRICS BELOW THRESHOLD"}
        </span>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 24 }}>
        {METRICS.map((m) => (
          <MetricCard key={m.key} name={m.key} icon={m.icon} score={s[m.key] ?? 0} threshold={m.threshold} />
        ))}
      </div>

      <div className="flex gap-2">
        <button className="btn" onClick={() => vscode.postMessage({ command: "runEvaluation" })}>
          Run Evaluation
        </button>
        <button className="btn btn-secondary" onClick={() => vscode.postMessage({ command: "exportJson", scores: s })}>
          Export JSON
        </button>
      </div>
    </div>
  );
}
