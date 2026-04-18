"""FAI Engine — Python port of the FAI Protocol runtime.

Reads fai-manifest.json, resolves context (knowledge modules + WAF pillars),
wires primitives (agents, instructions, skills, hooks), and evaluates guardrails.

This is the Python-native equivalent of the Node.js FAI Engine (engine/).

Usage:
    from frootai.engine import FAIEngine

    engine = FAIEngine()
    result = engine.load("solution-plays/01-enterprise-rag/spec/fai-manifest.json")

    # Access wired components
    print(result.manifest)        # Parsed manifest
    print(result.context)         # Resolved knowledge + WAF
    print(result.primitives)      # Wired agents, skills, instructions, hooks
    print(result.guardrails)      # Quality thresholds
    print(result.stats)           # Counts and metadata
    print(result.errors)          # Validation errors (empty = healthy)

    # Evaluate quality scores against guardrails
    scores = {"groundedness": 0.96, "coherence": 0.92, "relevance": 0.88}
    evaluation = engine.evaluate(result, scores)
    print(evaluation.passed)      # True if all thresholds met
    print(evaluation.details)     # Per-metric pass/fail
"""

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Optional


# ─── Constants ─────────────────────────────────────────────────────────────────

WAF_PILLARS = frozenset([
    "security", "reliability", "cost-optimization",
    "operational-excellence", "performance-efficiency", "responsible-ai",
])

MODULE_MAP = {
    "F1-GenAI-Foundations": "GenAI-Foundations.md",
    "F2-LLM-Landscape": "LLM-Landscape.md",
    "F3-AI-Glossary": "F3-AI-Glossary-AZ.md",
    "F4-GitHub-Agentic-OS": "F4-GitHub-Agentic-OS.md",
    "R1-Prompt-Engineering": "Prompt-Engineering.md",
    "R2-RAG-Architecture": "RAG-Architecture.md",
    "R3-Deterministic-AI": "R3-Deterministic-AI.md",
    "O1-Semantic-Kernel": "Semantic-Kernel.md",
    "O2-AI-Agents": "AI-Agents-Deep-Dive.md",
    "O3-MCP-Tools-Functions": "O3-MCP-Tools-Functions.md",
    "O4-Azure-AI-Foundry": "Azure-AI-Foundry.md",
    "O5-AI-Infrastructure": "AI-Infrastructure.md",
    "O6-Copilot-Ecosystem": "Copilot-Ecosystem.md",
    "T1-Fine-Tuning-MLOps": "T1-Fine-Tuning-MLOps.md",
    "T2-Responsible-AI": "Responsible-AI-Safety.md",
    "T3-Production-Patterns": "T3-Production-Patterns.md",
}

WAF_INSTRUCTION_MAP = {
    "security": "waf-security.instructions.md",
    "reliability": "waf-reliability.instructions.md",
    "cost-optimization": "waf-cost-optimization.instructions.md",
    "operational-excellence": "waf-operational-excellence.instructions.md",
    "performance-efficiency": "waf-performance-efficiency.instructions.md",
    "responsible-ai": "waf-responsible-ai.instructions.md",
}

PLAY_ID_PATTERN = re.compile(r"^[0-9]{2,3}-[a-z0-9-]+$")
SEMVER_PATTERN = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+(-[a-z0-9.]+)?$")


# ─── Data Classes ──────────────────────────────────────────────────────────────

@dataclass
class KnowledgeModule:
    """A resolved FROOT knowledge module."""
    id: str
    filename: str
    content: str
    source: str  # "docs", "bundle", or "missing"


@dataclass
class WAFInstruction:
    """A resolved WAF pillar instruction."""
    pillar: str
    filename: str
    content: str


@dataclass
class Primitive:
    """A loaded primitive (agent, instruction, skill, hook)."""
    path: str
    type: str
    name: str
    loaded: bool
    description: str = ""
    waf: list[str] = field(default_factory=list)
    tools: list[str] = field(default_factory=list)
    model: list[str] = field(default_factory=list)
    plays: list[str] = field(default_factory=list)
    frontmatter: dict[str, Any] = field(default_factory=dict)
    content: str = ""
    error: str = ""


@dataclass
class ResolvedContext:
    """Shared context resolved from manifest."""
    knowledge: list[KnowledgeModule] = field(default_factory=list)
    waf: list[WAFInstruction] = field(default_factory=list)
    scope: str = "default"
    errors: list[str] = field(default_factory=list)


@dataclass
class WiredPlay:
    """Complete wired play — manifest + context + primitives."""
    manifest: dict[str, Any] = field(default_factory=dict)
    play_id: str = ""
    play_dir: str = ""
    context: Optional[ResolvedContext] = None
    primitives: dict[str, list[Primitive]] = field(default_factory=dict)
    guardrails: dict[str, float] = field(default_factory=dict)
    infrastructure: dict[str, Any] = field(default_factory=dict)
    stats: dict[str, int] = field(default_factory=dict)
    errors: list[str] = field(default_factory=list)


@dataclass
class EvaluationResult:
    """Result of evaluating scores against guardrails."""
    passed: bool
    details: dict[str, dict[str, Any]] = field(default_factory=dict)
    summary: str = ""


# ─── Frontmatter Parser ───────────────────────────────────────────────────────

def parse_frontmatter(content: str) -> dict[str, Any]:
    """Parse YAML frontmatter from markdown content."""
    if not content or not content.startswith("---"):
        return {}

    normalized = content.replace("\r\n", "\n")
    end = normalized.find("---", 3)
    if end == -1:
        return {}

    yaml_block = normalized[3:end].strip()
    result: dict[str, Any] = {}

    for line in yaml_block.split("\n"):
        trimmed = line.strip()
        if not trimmed or trimmed.startswith("#"):
            continue

        colon_idx = trimmed.find(":")
        if colon_idx == -1:
            continue

        key = trimmed[:colon_idx].strip()
        val = trimmed[colon_idx + 1:].strip()

        # Unquote strings
        if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
            val = val[1:-1]

        # Parse arrays
        if val.startswith("[") and val.endswith("]"):
            items = val[1:-1].split(",")
            val = [item.strip().strip("'\"") for item in items if item.strip()]

        result[key] = val

    return result


# ─── FAI Engine ────────────────────────────────────────────────────────────────

class FAIEngine:
    """FAI Protocol runtime — reads manifests, resolves context, wires primitives.

    Args:
        repo_root: Path to the FrootAI repository root. Auto-detected if not provided.
    """

    def __init__(self, repo_root: Optional[str | Path] = None):
        if repo_root:
            self._root = Path(repo_root)
        else:
            # Auto-detect: walk up from this file looking for fai-protocol/
            candidate = Path(__file__).parent
            for _ in range(10):
                if (candidate / "fai-protocol").exists():
                    self._root = candidate
                    break
                candidate = candidate.parent
            else:
                self._root = Path.cwd()

        self._docs_dir = self._root / "docs"
        self._instructions_dir = self._root / ".github" / "instructions"
        self._knowledge_bundle = self._root / "npm-mcp" / "knowledge.json"
        self._bundled_knowledge: dict | None = None

    def _load_bundle(self) -> dict | None:
        """Lazy-load the bundled knowledge.json."""
        if self._bundled_knowledge is not None:
            return self._bundled_knowledge
        if self._knowledge_bundle.exists():
            try:
                self._bundled_knowledge = json.loads(self._knowledge_bundle.read_text(encoding="utf-8"))
                return self._bundled_knowledge
            except (json.JSONDecodeError, OSError):
                pass
        return None

    # ─── Manifest Loading ──────────────────────────────────────────────────────

    def load_manifest(self, manifest_path: str | Path) -> tuple[dict | None, Path | None, list[str]]:
        """Load and validate a fai-manifest.json file.

        Returns:
            Tuple of (manifest_dict, play_dir_path, errors_list).
        """
        abs_path = Path(manifest_path).resolve()
        errors: list[str] = []

        if not abs_path.exists():
            return None, None, [f"Manifest not found: {abs_path}"]

        try:
            manifest = json.loads(abs_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            return None, None, [f"Invalid JSON: {e}"]

        # Play directory: if manifest is in spec/, go up one level
        play_dir = abs_path.parent
        if play_dir.name == "spec":
            play_dir = play_dir.parent

        # Validate required fields
        play_id = manifest.get("play", "")
        if not play_id or not PLAY_ID_PATTERN.match(play_id):
            errors.append(f'play must match "NN-kebab-case" (got "{play_id}")')

        version = manifest.get("version", "")
        if not version or not SEMVER_PATTERN.match(version):
            errors.append(f'version must be semver (got "{version}")')

        # Context validation
        context = manifest.get("context")
        if not context:
            errors.append("missing context object")
        else:
            knowledge = context.get("knowledge")
            if not isinstance(knowledge, list) or len(knowledge) == 0:
                errors.append("context.knowledge must have at least one module")
            waf = context.get("waf")
            if not isinstance(waf, list) or len(waf) == 0:
                errors.append("context.waf must have at least one pillar")
            elif invalid := [w for w in waf if w not in WAF_PILLARS]:
                errors.append(f"invalid WAF pillars: {', '.join(invalid)}")

        # Primitives validation
        primitives = manifest.get("primitives")
        if not primitives:
            errors.append("missing primitives object")
        else:
            guardrails = primitives.get("guardrails", {})
            if isinstance(guardrails, dict):
                for metric in ("groundedness", "coherence", "relevance"):
                    val = guardrails.get(metric)
                    if val is not None and not (0 <= val <= 1):
                        errors.append(f"guardrails.{metric} must be 0-1 (got {val})")
                if guardrails.get("safety") is not None and guardrails["safety"] != 0:
                    errors.append(f"guardrails.safety must be 0 for production (got {guardrails['safety']})")

        return manifest, play_dir, errors

    # ─── Context Resolution ────────────────────────────────────────────────────

    def resolve_knowledge(self, module_ids: list[str]) -> tuple[list[KnowledgeModule], list[str]]:
        """Resolve FROOT knowledge module IDs to content."""
        modules: list[KnowledgeModule] = []
        missing: list[str] = []
        bundle = self._load_bundle()

        for mod_id in module_ids:
            filename = MODULE_MAP.get(mod_id)

            if not filename:
                # Fuzzy match
                matched_key = next(
                    (k for k in MODULE_MAP if mod_id in k or k.split("-", 1)[-1] in mod_id),
                    None,
                )
                if matched_key:
                    filename = MODULE_MAP[matched_key]
                    mod_id = matched_key
                else:
                    missing.append(mod_id)
                    continue

            # Try bundle first
            if bundle and "modules" in bundle:
                module_key = mod_id.split("-")[0]
                bundled = bundle["modules"].get(module_key) or bundle["modules"].get(mod_id)
                if bundled:
                    content = bundled.get("content") or bundled.get("summary") or json.dumps(bundled)
                    modules.append(KnowledgeModule(id=mod_id, filename=filename, content=content, source="bundle"))
                    continue

            # Fallback to docs directory
            doc_path = self._docs_dir / filename
            if doc_path.exists():
                modules.append(KnowledgeModule(
                    id=mod_id, filename=filename,
                    content=doc_path.read_text(encoding="utf-8"),
                    source="docs",
                ))
            else:
                missing.append(mod_id)

        return modules, missing

    def resolve_waf(self, pillars: list[str]) -> tuple[list[WAFInstruction], list[str]]:
        """Resolve WAF pillar names to instruction content."""
        instructions: list[WAFInstruction] = []
        missing: list[str] = []

        for pillar in pillars:
            filename = WAF_INSTRUCTION_MAP.get(pillar)
            if not filename:
                missing.append(pillar)
                continue

            instr_path = self._instructions_dir / filename
            if instr_path.exists():
                instructions.append(WAFInstruction(
                    pillar=pillar,
                    filename=filename,
                    content=instr_path.read_text(encoding="utf-8"),
                ))
            else:
                missing.append(pillar)

        return instructions, missing

    def build_context(self, context_config: dict) -> ResolvedContext:
        """Build full shared context from manifest's context section."""
        errors: list[str] = []

        modules, missing_modules = self.resolve_knowledge(context_config.get("knowledge", []))
        if missing_modules:
            errors.append(f"Missing knowledge modules: {', '.join(missing_modules)}")

        waf_instr, missing_waf = self.resolve_waf(context_config.get("waf", []))
        if missing_waf:
            errors.append(f"Missing WAF instructions: {', '.join(missing_waf)}")

        return ResolvedContext(
            knowledge=modules,
            waf=waf_instr,
            scope=context_config.get("scope", "default"),
            errors=errors,
        )

    # ─── Primitive Loading ─────────────────────────────────────────────────────

    def load_primitive(self, abs_path: Path, ptype: str) -> Primitive:
        """Load a single primitive file and extract metadata."""
        if not abs_path.exists():
            return Primitive(path=str(abs_path), type=ptype, name=abs_path.name, loaded=False, error="File not found")

        # Directory → resolve to key file
        if abs_path.is_dir():
            if ptype == "skill":
                key_file = abs_path / "SKILL.md"
            elif ptype == "hook":
                key_file = abs_path / "hooks.json"
            else:
                candidates = [f for f in abs_path.iterdir() if f.suffix in (".md", ".json")]
                key_file = candidates[0] if candidates else None

            if not key_file or not key_file.exists():
                return Primitive(path=str(abs_path), type=ptype, name=abs_path.name, loaded=True)
            abs_path = key_file

        name = abs_path.stem

        # JSON files (hooks.json, etc.)
        if abs_path.suffix == ".json":
            try:
                data = json.loads(abs_path.read_text(encoding="utf-8"))
                return Primitive(path=str(abs_path), type=ptype, name=name, loaded=True, frontmatter=data)
            except (json.JSONDecodeError, OSError) as e:
                return Primitive(path=str(abs_path), type=ptype, name=name, loaded=False, error=str(e))

        # Markdown files
        content = abs_path.read_text(encoding="utf-8")
        fm = parse_frontmatter(content)

        tools_val = fm.get("tools", [])
        if isinstance(tools_val, str):
            tools_val = [tools_val]
        model_val = fm.get("model", [])
        if isinstance(model_val, str):
            model_val = [model_val]
        waf_val = fm.get("waf", [])
        if isinstance(waf_val, str):
            waf_val = [waf_val]
        plays_val = fm.get("plays", [])
        if isinstance(plays_val, str):
            plays_val = [plays_val]

        return Primitive(
            path=str(abs_path),
            type=ptype,
            name=fm.get("name", name),
            loaded=True,
            description=fm.get("description", ""),
            waf=waf_val,
            tools=tools_val,
            model=model_val,
            plays=plays_val,
            frontmatter=fm,
            content=content,
        )

    def wire_primitives(self, manifest: dict, play_dir: Path, context: ResolvedContext) -> tuple[dict[str, list[Primitive]], list[str]]:
        """Wire all primitives from manifest into connected structures."""
        errors: list[str] = []
        primitives: dict[str, list[Primitive]] = {
            "agents": [], "instructions": [], "skills": [], "hooks": [], "workflows": [],
        }

        prims = manifest.get("primitives", {})
        type_map = {
            "agents": "agent",
            "instructions": "instruction",
            "skills": "skill",
            "hooks": "hook",
            "workflows": "workflow",
        }

        for ptype_plural, ptype_singular in type_map.items():
            paths = prims.get(ptype_plural, [])
            if not isinstance(paths, list):
                continue
            for rel_path in paths:
                abs_path = (play_dir / rel_path).resolve()
                loaded = self.load_primitive(abs_path, ptype_singular)
                if loaded.loaded:
                    primitives[ptype_plural].append(loaded)
                else:
                    errors.append(f"{ptype_plural}: {rel_path} — {loaded.error}")

        return primitives, errors

    # ─── Main Load ─────────────────────────────────────────────────────────────

    def load(self, manifest_path: str | Path) -> WiredPlay:
        """Load a complete play from its manifest — resolve, wire, validate.

        This is the primary entry point. Returns a fully wired WiredPlay with
        manifest, context, primitives, guardrails, and validation errors.
        """
        manifest, play_dir, errors = self.load_manifest(manifest_path)
        if manifest is None or play_dir is None:
            return WiredPlay(errors=errors)

        # Resolve context
        context = self.build_context(manifest.get("context", {}))
        errors.extend(context.errors)

        # Wire primitives
        primitives, wire_errors = self.wire_primitives(manifest, play_dir, context)
        errors.extend(wire_errors)

        # Extract guardrails
        guardrails = manifest.get("primitives", {}).get("guardrails", {})
        if not isinstance(guardrails, dict):
            guardrails = {}

        # Resolve infrastructure paths
        infra = {}
        for key, rel_path in manifest.get("infrastructure", {}).items():
            if rel_path:
                abs_path = (play_dir / rel_path).resolve()
                infra[key] = {
                    "relative": rel_path,
                    "absolute": str(abs_path),
                    "exists": abs_path.exists(),
                }

        # Compute stats
        stats = {k: len(v) for k, v in primitives.items()}
        stats["total"] = sum(stats.values())
        stats["knowledge_modules"] = len(context.knowledge)
        stats["waf_pillars"] = len(context.waf)

        return WiredPlay(
            manifest=manifest,
            play_id=manifest.get("play", ""),
            play_dir=str(play_dir),
            context=context,
            primitives=primitives,
            guardrails=guardrails,
            infrastructure=infra,
            stats=stats,
            errors=errors,
        )

    # ─── Evaluation ────────────────────────────────────────────────────────────

    def evaluate(self, wired_play: WiredPlay, scores: dict[str, float]) -> EvaluationResult:
        """Evaluate quality scores against play's guardrail thresholds.

        Args:
            wired_play: A loaded WiredPlay with guardrails.
            scores: Dict of metric → score (0-1 for most, 0 for safety).

        Returns:
            EvaluationResult with pass/fail per metric.
        """
        details: dict[str, dict[str, Any]] = {}
        all_passed = True

        for metric, threshold in wired_play.guardrails.items():
            if not isinstance(threshold, (int, float)):
                continue

            actual = scores.get(metric)
            if actual is None:
                details[metric] = {
                    "status": "skipped",
                    "reason": "score not provided",
                    "threshold": threshold,
                }
                continue

            if metric == "safety":
                passed = actual == 0
                details[metric] = {
                    "status": "passed" if passed else "FAILED",
                    "actual": actual,
                    "threshold": 0,
                    "operator": "==",
                }
            elif metric == "costPerQuery":
                passed = actual <= threshold
                details[metric] = {
                    "status": "passed" if passed else "FAILED",
                    "actual": actual,
                    "threshold": threshold,
                    "operator": "<=",
                }
            else:
                passed = actual >= threshold
                details[metric] = {
                    "status": "passed" if passed else "FAILED",
                    "actual": actual,
                    "threshold": threshold,
                    "operator": ">=",
                }

            if not passed:
                all_passed = False

        passed_count = sum(1 for d in details.values() if d["status"] == "passed")
        failed_count = sum(1 for d in details.values() if d["status"] == "FAILED")
        skipped_count = sum(1 for d in details.values() if d["status"] == "skipped")

        summary = f"{passed_count} passed, {failed_count} failed, {skipped_count} skipped"

        return EvaluationResult(passed=all_passed, details=details, summary=summary)

    # ─── Catalog Integration ───────────────────────────────────────────────────

    def scan_all_plays(self, plays_dir: Optional[str | Path] = None) -> list[WiredPlay]:
        """Scan all solution plays and return wired results.

        Args:
            plays_dir: Path to solution-plays directory. Auto-detected if None.

        Returns:
            List of WiredPlay objects (one per play with a manifest).
        """
        if plays_dir is None:
            plays_dir = self._root / "solution-plays"
        else:
            plays_dir = Path(plays_dir)

        results: list[WiredPlay] = []

        if not plays_dir.exists():
            return results

        for play_dir in sorted(plays_dir.iterdir()):
            if not play_dir.is_dir():
                continue
            manifest_path = play_dir / "spec" / "fai-manifest.json"
            if manifest_path.exists():
                results.append(self.load(str(manifest_path)))

        return results
