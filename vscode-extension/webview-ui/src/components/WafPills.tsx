const WAF_PILLARS = [
  { name: "Reliability", icon: "🔄", color: "#3b82f6" },
  { name: "Security", icon: "🔒", color: "#ef4444" },
  { name: "Cost Optimization", icon: "💰", color: "#10b981" },
  { name: "Operational Excellence", icon: "⚙️", color: "#f59e0b" },
  { name: "Performance", icon: "⚡", color: "#8b5cf6" },
  { name: "Responsible AI", icon: "🤖", color: "#ec4899" },
];

export default function WafPills() {
  return (
    <div className="flex flex-wrap gap-2">
      {WAF_PILLARS.map((p) => (
        <span
          key={p.name}
          className="pill"
          style={{
            background: `${p.color}18`,
            color: p.color,
            borderColor: `${p.color}40`,
          }}
        >
          {p.icon} {p.name}
        </span>
      ))}
    </div>
  );
}
