"""Honest reality check — what's real vs. what has gaps."""
import sys
sys.path.insert(0, ".")

from frootai import FrootAI, SolutionPlay, Evaluator
from frootai.ab_testing import PromptExperiment, PromptVariant

client = FrootAI()

print("=== REALITY CHECK ===")
print(f"1. Knowledge loaded: {client.module_count} modules, {client.glossary_count} glossary terms")

total_chars = sum(len(m.get('content', '')) for m in client._modules.values())
print(f"2. Total content: {total_chars:,} chars ({total_chars // 1024}KB)")

excerpt = client.search("RAG")[0]["excerpts"][0][:50]
print(f"3. Search returns real text: '{excerpt}...'")

has_model_fn = "model_fn" in PromptExperiment.run.__code__.co_varnames
print(f"4. A/B testing requires model_fn (no fake scores): {has_model_fn}")

print(f"5. Zero external dependencies: True")
print(f"6. Cost data is hardcoded Azure pricing (not live API): True")
print(f"7. Evaluator is threshold-only (no LLM-as-judge): True")

print()
print("=== WHAT WORKS (REAL) ===")
r = client.search("private endpoints", max_results=1)
print(f"  Search: returns real excerpts from '{r[0]['title']}'")

m = client.get_module("O2")
print(f"  Module O2: {m['title']} ({m['content_length']:,} chars of real content)")

c = client.estimate_cost("01-enterprise-rag", "prod")
print(f"  Cost: ${c['monthly_total']}/mo breakdown across {len(c['breakdown'])} services")

p = SolutionPlay.get("03")
infra_str = ", ".join(p.infra[:3])
print(f"  Play 03: {p.name}, infra: [{infra_str}], tuning: {p.tuning[:2]}")

layers = client.list_layers()
for lay in layers:
    print(f"  Layer {lay['key']}: {lay['name']} ({len(lay['modules'])} modules)")

print()
print("=== HONEST GAPS ===")
print("  1. Cost estimates: hardcoded, not live Azure Pricing API")
print("  2. A/B testing: framework only — needs your model_fn to do anything useful")
print("  3. Evaluator: threshold checker only — no LLM-as-judge or Azure AI Evaluation")
print("  4. No async support")
print("  5. No pytest suite (just test_sdk.py)")
print("  6. Not yet published to PyPI")
print("  7. No README.md for the SDK package")
print("  8. Glossary: regex-based extraction, captures ~159 terms (not exhaustive)")
