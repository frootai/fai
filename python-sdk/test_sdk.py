"""End-to-end test for the FrootAI Python SDK."""
import sys
sys.path.insert(0, ".")

from frootai import FrootAI, SolutionPlay, Evaluator, __version__

print(f"=== FrootAI SDK v{__version__} ===")

# Test 1: Client initialization + module count
client = FrootAI()
print(f"\n1. Modules: {client.module_count}, Layers: {client.layer_count}, Glossary: {client.glossary_count}")
assert client.module_count == 16
assert client.layer_count == 5
assert client.glossary_count > 50

# Test 2: Search
results = client.search("RAG architecture", max_results=3)
print(f"\n2. Search results for 'RAG architecture':")
for r in results:
    mid = r["module_id"]
    title = r["title"]
    hits = r["relevance"]
    print(f"   [{mid}] {title} (hits: {hits})")
assert len(results) > 0
assert results[0]["module_id"] in ["R1", "R2", "R3"]

# Test 3: Get module
mod = client.get_module("R2")
print(f"\n3. Module R2: {mod['title']} ({mod['content_length']} chars)")
assert mod is not None
assert mod["content_length"] > 1000

# Test 4: List layers
layers = client.list_layers()
print(f"\n4. FROOT Layers:")
for lay in layers:
    mods = lay["modules"]
    print(f"   {lay['emoji']} {lay['key']} - {lay['name']} ({lay['metaphor']}, {len(mods)} modules)")
assert len(layers) == 5

# Test 5: Glossary
term = client.lookup_term("temperature")
if term:
    defn = term["definition"][:80]
    print(f"\n5. Glossary [temperature]: {defn}...")
else:
    print("\n5. Glossary: temperature not found")

# Test 6: Cost estimation
cost = client.estimate_cost("01-enterprise-rag", "dev")
print(f"\n6. Cost (01-enterprise-rag, dev): ${cost['monthly_total']}/mo")
for svc, c in cost["breakdown"].items():
    print(f"   {svc}: ${c}")
assert cost["monthly_total"] > 0

# Test 7: Solution plays
plays = SolutionPlay.all()
ready = SolutionPlay.ready()
print(f"\n7. Plays: {len(plays)} total, {len(ready)} ready")
assert len(plays) == 20
assert len(ready) == 3

play = SolutionPlay.get("03")
print(f"   Play 03: {play.name} (layer: {play.layer})")
assert play.name == "Deterministic Agent"

rag_plays = SolutionPlay.by_layer("R")
print(f"   R-layer plays: {len(rag_plays)}")
assert len(rag_plays) > 0

# Test 8: Evaluator
ev = Evaluator()
scores = {"groundedness": 4.5, "relevance": 3.2, "coherence": 4.1, "fluency": 4.8}
eval_results = ev.check_thresholds(scores)
passed = sum(1 for r in eval_results if r.passed)
print(f"\n8. Evaluation: {passed}/{len(eval_results)} passed")
print(ev.summary(scores))
assert passed == 3  # relevance fails at 3.2 < 4.0

# Test 9: A/B Testing (with real callable)
from frootai.ab_testing import PromptExperiment, PromptVariant

exp = PromptExperiment(
    name="test",
    variants=[PromptVariant("a", "system a"), PromptVariant("b", "system b")],
    metrics=["quality"],
)

def mock_model(system, query):
    return f"Response from {system}"

def mock_scorer(query, response):
    return {"quality": 4.0 if "system a" in response else 3.5}

exp_results = exp.run(["q1", "q2"], model_fn=mock_model, scorer_fn=mock_scorer)
winner = exp.pick_winner(exp_results)
print(f"\n9. A/B Test winner: {winner} (from {len(exp_results)} results)")
assert winner == "a"
assert len(exp_results) == 4  # 2 queries * 2 variants

# Test 10: Section extraction
section = client.get_module_section("F1", "Table of Contents")
if section:
    print(f"\n10. Section extraction: found ({len(section)} chars)")
else:
    print("\n10. Section extraction: not found")

print("\n=== ALL 10 TESTS PASSED ===")
