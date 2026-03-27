"""FrootAI Prompt A/B Testing Framework.

Run prompt experiments across variants, measure quality, pick winners.
Requires a model_fn callback for actual LLM inference.

Usage:
    from frootai.ab_testing import PromptExperiment, PromptVariant

    def my_model(system_prompt: str, query: str) -> str:
        # Call Azure OpenAI, local model, etc.
        return openai_client.chat(system_prompt=system_prompt, query=query)

    def my_scorer(query: str, response: str) -> dict[str, float]:
        return {"groundedness": 4.5, "relevance": 4.0}

    experiment = PromptExperiment(
        name="rag-system-prompt-v2",
        variants=[
            PromptVariant("control", "You are a helpful assistant."),
            PromptVariant("concise", "You are a concise assistant. Answer in 2 sentences max."),
            PromptVariant("expert", "You are an Azure AI expert. Cite sources."),
        ],
        metrics=["groundedness", "relevance", "latency"],
    )

    results = experiment.run(
        test_queries=["What is RAG?", "Explain embeddings"],
        model_fn=my_model,
        scorer_fn=my_scorer,
    )
    winner = experiment.pick_winner(results)
"""

from dataclasses import dataclass, field
from typing import Optional, Callable
import json
import time


@dataclass
class PromptVariant:
    """A single prompt variant in an A/B test."""
    name: str
    system_prompt: str
    weight: float = 1.0


@dataclass
class ExperimentResult:
    """Result of running one variant against one query."""
    variant: str
    query: str
    response: str
    latency_ms: float
    scores: dict[str, float] = field(default_factory=dict)


@dataclass
class PromptExperiment:
    """A/B testing experiment for prompt variants.

    Attributes:
        name: Experiment identifier
        variants: List of prompt variants to test
        metrics: Quality metrics to measure
    """
    name: str
    variants: list[PromptVariant]
    metrics: list[str] = field(default_factory=lambda: ["groundedness", "relevance", "coherence"])

    def run(
        self,
        test_queries: list[str],
        model_fn: Callable[[str, str], str],
        scorer_fn: Optional[Callable[[str, str], dict[str, float]]] = None,
        rounds: int = 1,
    ) -> list[ExperimentResult]:
        """Run the experiment using provided model and scorer functions.

        Args:
            test_queries: Questions to test each variant against.
            model_fn: Callable(system_prompt, query) -> response string.
            scorer_fn: Optional Callable(query, response) -> {metric: score}.
                        If not provided, only latency is measured.
            rounds: Number of rounds to repeat (for statistical stability).
        """
        results = []
        for _ in range(rounds):
            for query in test_queries:
                for variant in self.variants:
                    start = time.perf_counter()
                    response = model_fn(variant.system_prompt, query)
                    latency = (time.perf_counter() - start) * 1000

                    scores = {}
                    if scorer_fn is not None:
                        scores = scorer_fn(query, response)
                    scores["latency_ms"] = round(latency, 1)

                    result = ExperimentResult(
                        variant=variant.name,
                        query=query,
                        response=response,
                        latency_ms=round(latency, 1),
                        scores=scores,
                    )
                    results.append(result)
        return results

    def pick_winner(self, results: list[ExperimentResult]) -> str:
        """Pick the best variant based on average scores (excluding latency)."""
        variant_scores: dict[str, list[float]] = {}
        for r in results:
            if r.variant not in variant_scores:
                variant_scores[r.variant] = []
            quality_scores = {k: v for k, v in r.scores.items() if k != "latency_ms"}
            if quality_scores:
                avg = sum(quality_scores.values()) / len(quality_scores)
                variant_scores[r.variant].append(avg)

        if not variant_scores or all(len(v) == 0 for v in variant_scores.values()):
            # Fall back to lowest latency if no quality scores
            latencies: dict[str, list[float]] = {}
            for r in results:
                latencies.setdefault(r.variant, []).append(r.latency_ms)
            return min(latencies, key=lambda v: sum(latencies[v]) / len(latencies[v]))

        averages = {v: sum(s) / len(s) for v, s in variant_scores.items() if s}
        return max(averages, key=averages.get)

    def summary(self, results: list[ExperimentResult]) -> str:
        """Generate experiment summary."""
        lines = [f"Experiment: {self.name}", "=" * 50]
        variant_data: dict[str, list] = {}
        for r in results:
            variant_data.setdefault(r.variant, []).append(r)

        for variant, data in variant_data.items():
            avg_scores: dict[str, float] = {}
            all_metrics = set()
            for r in data:
                all_metrics.update(r.scores.keys())
            for m in sorted(all_metrics):
                vals = [r.scores[m] for r in data if m in r.scores]
                if vals:
                    avg_scores[m] = sum(vals) / len(vals)
            lines.append(f"\n  Variant: {variant}")
            lines.append(f"  Samples: {len(data)}")
            for m, s in avg_scores.items():
                lines.append(f"    {m}: {s:.2f}")

        winner = self.pick_winner(results)
        lines.append(f"\n  Winner: {winner}")
        return "\n".join(lines)

    def to_json(self) -> str:
        """Export experiment config as JSON."""
        return json.dumps({
            "name": self.name,
            "variants": [{"name": v.name, "system_prompt": v.system_prompt, "weight": v.weight} for v in self.variants],
            "metrics": self.metrics,
        }, indent=2)
