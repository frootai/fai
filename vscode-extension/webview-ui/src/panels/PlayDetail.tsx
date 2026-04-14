import type { SolutionPlay } from "../types";
import Badge from "../components/Badge";
import WafPills from "../components/WafPills";
import { vscode } from "../vscode";

const COMPLEXITY: Record<string, string> = {
  F: "Foundation", R: "Medium", O: "High", T: "High",
};
const COMPLEXITY_COLORS: Record<string, string> = {
  Foundation: "#0ea5e9", Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", "Very High": "#7c3aed",
};

interface Props { play?: SolutionPlay; }

export default function PlayDetail({ play }: Props) {
  const p = play ?? { id: "01", name: "Enterprise RAG Q&A", icon: "🔍", status: "Ready", dir: "01-enterprise-rag", layer: "R" };
  const cx = COMPLEXITY[p.layer] ?? "Medium";
  const cxColor = COMPLEXITY_COLORS[cx] ?? "#6b7280";

  const action = (cmd: string) => vscode.postMessage({ command: cmd, playId: p.id, playDir: p.dir });

  return (
    <div className="container">
      <div className="hero">
        <span className="hero-icon">{p.icon}</span>
        <h1>Play {p.id} — {p.name}</h1>
        <Badge label={cx} color={cxColor} />
      </div>

      <div className="section">
        <div className="section-title">📋 Details</div>
        <div className="info-row"><span className="info-label">Play ID</span><span>{p.id}</span></div>
        <div className="info-row"><span className="info-label">Directory</span><span>{p.dir}</span></div>
        <div className="info-row"><span className="info-label">FROOT Layer</span><span>{p.layer}</span></div>
        <div className="info-row"><span className="info-label">Status</span><span>{p.status}</span></div>
      </div>

      <div className="section">
        <div className="section-title">🏗️ WAF Alignment</div>
        <WafPills />
      </div>

      <div className="section">
        <div className="section-title">⚡ Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={() => action("initDevKit")}>Init DevKit</button>
          <button className="btn btn-secondary" onClick={() => action("initTuneKit")}>Init TuneKit</button>
          <button className="btn btn-secondary" onClick={() => action("cost")}>Estimate Cost</button>
          <button className="btn btn-secondary" onClick={() => action("diagram")}>Architecture Diagram</button>
          <button className="btn btn-secondary" onClick={() => action("website")}>View on Website</button>
        </div>
      </div>

      <div className="section">
        <div className="section-title">🔌 FAI Protocol</div>
        <div className="card">
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>fai-manifest.json</div>
          <p style={{ fontSize: 12, opacity: 0.8 }}>
            Wire this play with <code>frootai wire {p.id}</code> to generate the manifest that
            connects agents, instructions, skills, hooks, and guardrails.
          </p>
        </div>
      </div>
    </div>
  );
}
