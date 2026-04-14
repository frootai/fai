import { useState, useMemo } from "react";
import type { McpTool } from "../types";
import ToolCard from "../components/ToolCard";
import SearchInput from "../components/SearchInput";

const DEFAULT_TOOLS: McpTool[] = [
  { name: "list_modules", description: "Browse 18 FROOT knowledge modules by layer", category: "Knowledge", readOnly: true },
  { name: "get_module", description: "Read any module in full (F1-T3)", category: "Knowledge", readOnly: true },
  { name: "search_knowledge", description: "BM25 full-text search across all modules", category: "Knowledge", readOnly: true },
  { name: "lookup_term", description: "200+ AI/ML glossary term lookup", category: "Knowledge", readOnly: true },
  { name: "get_froot_overview", description: "Complete FrootAI framework summary", category: "Knowledge", readOnly: true },
  { name: "get_architecture_pattern", description: "7 architecture decision guides", category: "Knowledge", readOnly: true },
  { name: "list_solution_plays", description: "List all 101 solution plays", category: "Plays", readOnly: true },
  { name: "get_play_detail", description: "Full play info with infra and tuning", category: "Plays", readOnly: true },
  { name: "semantic_search_plays", description: "BM25-powered play matching", category: "Plays", readOnly: true },
  { name: "compare_plays", description: "Side-by-side play comparison", category: "Plays", readOnly: true },
  { name: "generate_architecture_diagram", description: "Mermaid.js architecture diagrams", category: "Architecture", readOnly: true },
  { name: "agent_build", description: "Builder agent — architecture guidance", category: "Agents", readOnly: true },
  { name: "agent_review", description: "Reviewer agent — security/quality audit", category: "Agents", readOnly: true },
  { name: "agent_tune", description: "Tuner agent — production readiness", category: "Agents", readOnly: true },
  { name: "get_model_catalog", description: "Azure AI model catalog with pricing", category: "Models", readOnly: true },
  { name: "get_azure_pricing", description: "Service pricing by tier", category: "Cost", readOnly: true },
  { name: "compare_models", description: "Side-by-side model comparison", category: "Models", readOnly: true },
  { name: "estimate_cost", description: "Itemized monthly cost per play", category: "Cost", readOnly: true },
  { name: "wire_play", description: "Generate fai-manifest.json for a play", category: "Tools", readOnly: false },
  { name: "inspect_wiring", description: "Check primitive connection status", category: "Tools", readOnly: true },
  { name: "validate_manifest", description: "Validate fai-manifest.json schema", category: "Tools", readOnly: true },
  { name: "validate_config", description: "Validate AI config parameters", category: "Tools", readOnly: true },
  { name: "evaluate_quality", description: "Run quality evaluation (5 metrics)", category: "Evaluation", readOnly: true },
  { name: "scaffold_play", description: "Scaffold project with DevKit structure", category: "Tools", readOnly: false },
  { name: "smart_scaffold", description: "AI-powered play recommendation + scaffold", category: "Tools", readOnly: false },
  { name: "list_marketplace", description: "Browse 830+ FAI primitives by type", category: "Primitives", readOnly: true },
  { name: "search_marketplace", description: "Search across all primitives", category: "Primitives", readOnly: true },
  { name: "get_waf_guidance", description: "WAF pillar guidance (6 pillars)", category: "Architecture", readOnly: true },
  { name: "get_learning_path", description: "Curated learning paths by topic", category: "Docs", readOnly: true },
  { name: "get_version_info", description: "Server version and capabilities", category: "Tools", readOnly: true },
];

interface Props { tools?: McpTool[]; }

export default function McpExplorer({ tools }: Props) {
  const allTools = tools?.length ? tools : DEFAULT_TOOLS;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(allTools.map((t) => t.category));
    return ["All", ...Array.from(cats).sort()];
  }, [allTools]);

  const filtered = useMemo(() => {
    return allTools.filter((t) => {
      const matchSearch = !search || t.name.includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || t.category === category;
      return matchSearch && matchCat;
    });
  }, [allTools, search, category]);

  return (
    <div className="container">
      <div className="hero">
        <span className="hero-icon">🔧</span>
        <h1>MCP Tool Explorer</h1>
        <p style={{ opacity: 0.7 }}>{allTools.length} tools across {categories.length - 1} categories</p>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search tools..." resultCount={filtered.length} />

      <div className="filter-bar">
        {categories.map((c) => (
          <button key={c} className={`filter-tag ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>
            {c} {c !== "All" ? `(${allTools.filter((t) => t.category === c).length})` : ""}
          </button>
        ))}
      </div>

      <div className="grid grid-2">
        {filtered.map((t) => <ToolCard key={t.name} tool={t} />)}
      </div>

      {filtered.length === 0 && <div className="empty-state">No tools match your search.</div>}
    </div>
  );
}
