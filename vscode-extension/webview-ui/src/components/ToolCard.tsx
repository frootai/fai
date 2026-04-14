import type { McpTool } from "../types";
import Badge from "./Badge";

const CATEGORY_COLORS: Record<string, string> = {
  Knowledge: "#3b82f6",
  Plays: "#7c3aed",
  Cost: "#10b981",
  Architecture: "#f59e0b",
  Models: "#ec4899",
  Agents: "#ef4444",
  Evaluation: "#8b5cf6",
  Primitives: "#06b6d4",
  Tools: "#6b7280",
  Docs: "#0ea5e9",
  GitHub: "#f97316",
  Security: "#dc2626",
};

interface ToolCardProps {
  tool: McpTool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const color = CATEGORY_COLORS[tool.category] ?? "#6b7280";
  return (
    <div className="card">
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <code style={{ fontSize: 13, fontWeight: 600 }}>{tool.name}</code>
        <Badge label={tool.readOnly ? "Read" : "Write"} color={tool.readOnly ? "#10b981" : "#f59e0b"} />
      </div>
      <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>{tool.description}</p>
      <Badge label={tool.category} color={color} />
    </div>
  );
}
