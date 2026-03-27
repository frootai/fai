"""FrootAI Client — Main entry point for the SDK.

Offline-first: queries bundled 682KB knowledge base (16 modules, 5 FROOT layers).
No network required for search, modules, glossary, or cost estimation.
"""

import json
import re
from pathlib import Path
from typing import Optional

_KNOWLEDGE_PATH = Path(__file__).parent / "knowledge.json"

# Azure AI cost estimates (monthly USD) — sourced from Azure pricing calculator
_COST_DATA = {
    "openai-gpt4o": {"dev": 150, "prod": 2500},
    "openai-gpt4o-mini": {"dev": 30, "prod": 500},
    "ai-search-basic": {"dev": 75, "prod": 300},
    "ai-search-standard": {"dev": 250, "prod": 750},
    "container-apps": {"dev": 20, "prod": 200},
    "app-service-b1": {"dev": 13, "prod": 55},
    "app-service-p1v3": {"dev": 55, "prod": 220},
    "cosmos-db": {"dev": 25, "prod": 400},
    "log-analytics": {"dev": 10, "prod": 150},
    "content-safety": {"dev": 15, "prod": 100},
    "document-intelligence": {"dev": 50, "prod": 500},
    "communication-services": {"dev": 10, "prod": 200},
    "aks-gpu": {"dev": 800, "prod": 3200},
    "vnet-private-endpoints": {"dev": 8, "prod": 40},
    "key-vault": {"dev": 3, "prod": 10},
}

_PLAY_COSTS = {
    "01-enterprise-rag": ["openai-gpt4o", "ai-search-standard", "container-apps", "log-analytics"],
    "02-ai-landing-zone": ["vnet-private-endpoints", "key-vault", "log-analytics"],
    "03-deterministic-agent": ["openai-gpt4o", "container-apps", "content-safety", "log-analytics"],
    "04-call-center-voice": ["openai-gpt4o", "communication-services", "container-apps"],
    "05-it-ticket-resolution": ["openai-gpt4o-mini", "container-apps", "log-analytics"],
    "06-document-intelligence": ["document-intelligence", "openai-gpt4o", "container-apps"],
    "07-multi-agent": ["openai-gpt4o", "container-apps", "cosmos-db", "log-analytics"],
    "09-ai-search-portal": ["ai-search-standard", "app-service-p1v3", "log-analytics"],
    "12-model-serving-aks": ["aks-gpu", "log-analytics", "key-vault"],
    "14-ai-gateway": ["openai-gpt4o", "container-apps", "log-analytics"],
}


class FrootAI:
    """FrootAI SDK client — offline-first access to AI architecture knowledge.

    Usage:
        client = FrootAI()
        results = client.search("RAG architecture")
        module = client.get_module("R2")
        cost = client.estimate_cost("01-enterprise-rag", scale="prod")
    """

    def __init__(self, knowledge_path: Optional[str] = None):
        path = Path(knowledge_path) if knowledge_path else _KNOWLEDGE_PATH
        with open(path, "r", encoding="utf-8") as f:
            self._data = json.load(f)
        self._modules = self._data.get("modules", {})
        self._layers = self._data.get("layers", {})
        self._glossary = self._build_glossary()

    def _build_glossary(self) -> dict[str, dict]:
        glossary = {}
        pattern = re.compile(r"\*\*([A-Z][A-Za-z0-9 /\-()]+)\*\*\s*[-:—]\s*(.+?)(?:\n|$)")
        for mod_id, mod in self._modules.items():
            for match in pattern.finditer(mod.get("content", "")):
                term = match.group(1).strip()
                definition = match.group(2).strip()
                if len(term) < 60 and len(definition) > 10:
                    glossary[term.lower()] = {
                        "term": term,
                        "definition": definition,
                        "source_module": mod_id,
                        "source_title": mod.get("title", ""),
                    }
        return glossary

    @property
    def module_count(self) -> int:
        return len(self._modules)

    @property
    def layer_count(self) -> int:
        return len(self._layers)

    @property
    def glossary_count(self) -> int:
        return len(self._glossary)

    def search(self, query: str, max_results: int = 5) -> list[dict]:
        """Search across all modules by keyword. Returns matching excerpts."""
        query_lower = query.lower()
        results = []
        for mod_id, mod in self._modules.items():
            content = mod.get("content", "")
            if query_lower in content.lower():
                # Find paragraph containing the match
                paragraphs = content.split("\n\n")
                excerpts = []
                for p in paragraphs:
                    if query_lower in p.lower() and len(p.strip()) > 20:
                        clean = p.strip()[:300]
                        excerpts.append(clean)
                        if len(excerpts) >= 2:
                            break
                results.append({
                    "module_id": mod_id,
                    "title": mod.get("title", ""),
                    "layer": mod.get("layer", ""),
                    "relevance": content.lower().count(query_lower),
                    "excerpts": excerpts,
                })
        results.sort(key=lambda r: r["relevance"], reverse=True)
        return results[:max_results]

    def get_module(self, module_id: str) -> Optional[dict]:
        """Get a module by ID (e.g. 'F1', 'R2', 'T3')."""
        mod = self._modules.get(module_id)
        if not mod:
            return None
        return {
            "id": mod.get("id", module_id),
            "title": mod.get("title", ""),
            "layer": mod.get("layer", ""),
            "emoji": mod.get("emoji", ""),
            "metaphor": mod.get("metaphor", ""),
            "content_length": len(mod.get("content", "")),
            "content": mod.get("content", ""),
        }

    def list_modules(self) -> list[dict]:
        """List all modules (without content)."""
        return [
            {
                "id": mod_id,
                "title": mod.get("title", ""),
                "layer": mod.get("layer", ""),
                "emoji": mod.get("emoji", ""),
                "metaphor": mod.get("metaphor", ""),
                "content_length": len(mod.get("content", "")),
            }
            for mod_id, mod in self._modules.items()
        ]

    def list_layers(self) -> list[dict]:
        """List all FROOT layers."""
        return [
            {
                "key": key,
                "name": layer.get("name", ""),
                "emoji": layer.get("emoji", ""),
                "metaphor": layer.get("metaphor", ""),
                "modules": layer.get("moduleIds", []),
            }
            for key, layer in self._layers.items()
        ]

    def lookup_term(self, term: str) -> Optional[dict]:
        """Look up a glossary term."""
        return self._glossary.get(term.lower())

    def search_glossary(self, query: str, max_results: int = 10) -> list[dict]:
        """Search glossary terms by keyword."""
        query_lower = query.lower()
        results = []
        for key, entry in self._glossary.items():
            if query_lower in key or query_lower in entry["definition"].lower():
                results.append(entry)
                if len(results) >= max_results:
                    break
        return results

    def estimate_cost(self, play_id: str, scale: str = "dev") -> dict:
        """Estimate monthly Azure costs for a solution play."""
        services = _PLAY_COSTS.get(play_id, [])
        if not services:
            return {"play": play_id, "scale": scale, "error": f"No cost data for play '{play_id}'"}
        breakdown = {}
        total = 0
        for svc in services:
            cost = _COST_DATA.get(svc, {}).get(scale, 0)
            breakdown[svc] = cost
            total += cost
        return {
            "play": play_id,
            "scale": scale,
            "currency": "USD",
            "monthly_total": total,
            "breakdown": breakdown,
        }

    def get_module_section(self, module_id: str, heading: str) -> Optional[str]:
        """Extract a specific section from a module by heading."""
        mod = self._modules.get(module_id)
        if not mod:
            return None
        content = mod.get("content", "")
        pattern = re.compile(
            rf"^(#{1,3})\s+.*{re.escape(heading)}.*$",
            re.MULTILINE | re.IGNORECASE,
        )
        match = pattern.search(content)
        if not match:
            return None
        level = len(match.group(1))
        start = match.start()
        next_heading = re.compile(rf"^#{{{1},{level}}}\s+", re.MULTILINE)
        rest = content[match.end():]
        next_match = next_heading.search(rest)
        end = match.end() + next_match.start() if next_match else len(content)
        return content[start:end].strip()
