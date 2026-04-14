"""E2E tests for FrootAI Python MCP Server."""
import asyncio
import json
import sys
import pytest

sys.path.insert(0, ".")

from frootai_mcp.server import (
    mcp,
    # Knowledge tools
    list_modules, get_module, search_knowledge, lookup_term,
    get_froot_overview, get_architecture_pattern,
    # Play tools
    list_solution_plays, get_play_detail, semantic_search_plays,
    compare_plays, generate_architecture_diagram,
    # Agent chain
    agent_build, agent_review, agent_tune,
    # Azure/Live
    get_model_catalog, get_azure_pricing, compare_models, estimate_cost,
    # Ecosystem
    get_github_agentic_os, list_community_plays, fetch_azure_docs,
    fetch_external_mcp, get_play_spec,
    # FAI Engine
    wire_play, inspect_wiring, validate_manifest, validate_config, evaluate_quality,
    # Marketplace
    list_marketplace, get_primitive_detail, search_marketplace, embedding_playground,
    # Scaffold
    scaffold_play, smart_scaffold, list_templates, preview_scaffold, scaffold_status,
    # Extra
    run_evaluation, get_bicep_best_practices, list_primitives, get_waf_guidance,
    check_play_compatibility, get_learning_path, export_play_config, get_version_info,
)


# ─── Server Registration Tests ───

class TestServerRegistration:
    def test_server_name(self):
        assert mcp.name == "frootai"

    def test_tool_count(self):
        tools = list(mcp._tool_manager._tools.keys())
        assert len(tools) == 45, f"Expected 45 tools, got {len(tools)}"

    def test_resource_count(self):
        resources = list(mcp._resource_manager._resources.keys()) if hasattr(mcp._resource_manager, '_resources') else []
        templates = list(mcp._resource_manager._templates.keys()) if hasattr(mcp._resource_manager, '_templates') else []
        assert len(resources) + len(templates) == 4

    def test_prompt_count(self):
        prompts = list(mcp._prompt_manager._prompts.keys())
        assert len(prompts) == 6


# ─── Knowledge Tools Tests ───

class TestKnowledgeTools:
    def test_list_modules(self):
        r = json.loads(asyncio.run(list_modules()))
        assert r["count"] > 0
        assert "modules" in r

    def test_get_module_by_id(self):
        r = json.loads(asyncio.run(get_module(module_id="F1")))
        assert "title" in r
        assert r.get("id") == "F1"

    def test_get_module_not_found(self):
        r = json.loads(asyncio.run(get_module(module_id="ZZZZZ")))
        assert "error" in r

    def test_search_knowledge_bm25(self):
        r = json.loads(asyncio.run(search_knowledge(query="RAG retrieval augmented")))
        assert "results" in r
        assert len(r["results"]) > 0

    def test_search_knowledge_empty(self):
        r = json.loads(asyncio.run(search_knowledge(query="")))
        assert "error" in r

    def test_lookup_term(self):
        r = json.loads(asyncio.run(lookup_term(term="transformer")))
        # May find or not, but should not error
        assert isinstance(r, dict)

    def test_get_froot_overview(self):
        r = json.loads(asyncio.run(get_froot_overview()))
        assert r["name"] == "FrootAI"
        assert r["stats"]["tools"] == 45

    def test_get_architecture_pattern(self):
        r = json.loads(asyncio.run(get_architecture_pattern(scenario="rag chatbot")))
        assert "scenario" in r


# ─── Play Tools Tests ───

class TestPlayTools:
    def test_list_solution_plays(self):
        r = json.loads(asyncio.run(list_solution_plays()))
        assert r["count"] == 100

    def test_get_play_detail(self):
        r = json.loads(asyncio.run(get_play_detail(play_id="01")))
        assert "RAG" in r["name"]

    def test_get_play_not_found(self):
        r = json.loads(asyncio.run(get_play_detail(play_id="999")))
        assert "error" in r

    def test_semantic_search_plays(self):
        r = json.loads(asyncio.run(semantic_search_plays(query="document processing")))
        assert len(r.get("matches", [])) > 0

    def test_compare_plays(self):
        r = json.loads(asyncio.run(compare_plays(play1="01", play2="03")))
        assert "play1" in r and "play2" in r

    def test_generate_diagram(self):
        r = json.loads(asyncio.run(generate_architecture_diagram(play="01")))
        assert "mermaid" in r


# ─── Agent Chain Tests ───

class TestAgentChain:
    def test_agent_build(self):
        r = json.loads(asyncio.run(agent_build(scenario="enterprise RAG")))
        assert "recommended" in r

    def test_agent_review(self):
        r = json.loads(asyncio.run(agent_review(config="temperature=0.3")))
        assert "checks" in r

    def test_agent_tune(self):
        r = json.loads(asyncio.run(agent_tune(config="temperature=0.5")))
        assert "recommendations" in r


# ─── FAI Engine Tests ───

class TestFAIEngine:
    def test_wire_play(self):
        r = json.loads(asyncio.run(wire_play(play_id="01")))
        assert r["status"] == "wired"
        assert "manifest" in r

    def test_inspect_wiring(self):
        r = json.loads(asyncio.run(inspect_wiring(play_id="01")))
        assert "wiring" in r

    def test_validate_manifest_valid(self):
        manifest = json.dumps({"play": "01-test", "version": "1.0.0", "context": {"waf": ["security"]}, "primitives": {}})
        r = json.loads(asyncio.run(validate_manifest(manifest_json=manifest)))
        assert r["valid"] is True

    def test_validate_manifest_invalid(self):
        r = json.loads(asyncio.run(validate_manifest(manifest_json="{}")))
        assert r["valid"] is False
        assert len(r["errors"]) > 0

    def test_validate_config(self):
        r = json.loads(asyncio.run(validate_config(config='{"temperature": 0.9}')))
        assert "warnings" in r

    def test_evaluate_quality_pass(self):
        r = json.loads(asyncio.run(evaluate_quality(scores='{"groundedness": 4.5, "relevance": 4.2}')))
        assert r["overall"] == "PASS"

    def test_evaluate_quality_fail(self):
        r = json.loads(asyncio.run(evaluate_quality(scores='{"groundedness": 2.0}')))
        assert r["overall"] == "FAIL"


# ─── Scaffold Tests ───

class TestScaffold:
    def test_scaffold_dry_run(self):
        r = json.loads(asyncio.run(scaffold_play(play_id="01", dry_run=True)))
        assert r["dry_run"] is True
        assert r["file_count"] > 0

    def test_smart_scaffold(self):
        r = json.loads(asyncio.run(smart_scaffold(description="document chatbot")))
        assert "recommended_play" in r

    def test_list_templates(self):
        r = json.loads(asyncio.run(list_templates()))
        assert "templates" in r

    def test_preview_scaffold(self):
        r = json.loads(asyncio.run(preview_scaffold(play_id="01")))
        assert r["dry_run"] is True


# ─── Marketplace Tests ───

class TestMarketplace:
    def test_list_marketplace(self):
        r = json.loads(asyncio.run(list_marketplace()))
        assert r["total_primitives"] > 700

    def test_search_marketplace(self):
        r = json.loads(asyncio.run(search_marketplace(query="rag")))
        assert len(r["matches"]) > 0

    def test_embedding_playground(self):
        r = json.loads(asyncio.run(embedding_playground(text1="hello world", text2="hi globe")))
        assert "jaccard_similarity" in r


# ─── Extra Tools Tests ───

class TestExtraTools:
    def test_get_waf_guidance(self):
        r = json.loads(asyncio.run(get_waf_guidance(pillar="security")))
        assert r["title"] == "Security"

    def test_get_version_info(self):
        r = json.loads(asyncio.run(get_version_info()))
        assert r["version"] == "5.1.0"
        assert r["capabilities"]["tools"] == 45

    def test_check_play_compatibility(self):
        r = json.loads(asyncio.run(check_play_compatibility(play1="01", play2="02")))
        assert "compatible" in r

    def test_get_learning_path(self):
        r = json.loads(asyncio.run(get_learning_path(topic="rag")))
        assert "modules" in r

    def test_export_play_config(self):
        r = json.loads(asyncio.run(export_play_config(play_id="01")))
        assert "play" in r


# ─── BM25 Search Quality Tests ───

class TestSearchQuality:
    def test_rag_search_finds_rag_play(self):
        r = json.loads(asyncio.run(search_knowledge(query="RAG retrieval augmented generation")))
        titles = [x.get("title", "").lower() for x in r.get("results", [])]
        assert any("rag" in t for t in titles), f"RAG not found in: {titles}"

    def test_security_search(self):
        r = json.loads(asyncio.run(search_knowledge(query="security OWASP prompt injection")))
        assert len(r.get("results", [])) > 0

    def test_cost_optimization_search(self):
        r = json.loads(asyncio.run(semantic_search_plays(query="reduce costs optimize budget")))
        assert len(r.get("matches", [])) > 0
