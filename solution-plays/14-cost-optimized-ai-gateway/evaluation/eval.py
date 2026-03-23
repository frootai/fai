#!/usr/bin/env python3
"""
FrootAI Play 14  Cost-Optimized AI Gateway Evaluation
Evaluates: cache hit rate, token savings, latency overhead, cost per request.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "cache_hit_rate":       0.30,   # min acceptable
    "token_savings_pct":    0.20,   # min 20% savings
    "latency_overhead_ms":  100.0,  # max acceptable added latency
    "cost_per_request":     0.05,   # max USD per request
}

#  Helpers 
def load_jsonl(path: str) -> list[dict]:
    """Load a JSONL file, skipping blank lines."""
    records = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def cache_hit_rate(records: list[dict]) -> float:
    """Fraction of requests served from cache."""
    if not records:
        return 0.0
    hits = sum(1 for r in records if r.get("cache_hit", False))
    return hits / len(records)


def token_savings_pct(records: list[dict]) -> float:
    """Average token savings as fraction (tokens_saved / tokens_original)."""
    savings = []
    for r in records:
        original = r.get("tokens_original", r.get("prompt_tokens", 0))
        actual = r.get("tokens_actual", r.get("billed_tokens", original))
        if original > 0:
            savings.append((original - actual) / original)
    return sum(savings) / max(len(savings), 1)


def latency_overhead_ms(records: list[dict]) -> float:
    """Average latency overhead introduced by the gateway layer."""
    overheads = []
    for r in records:
        total = r.get("total_latency_ms", 0)
        backend = r.get("backend_latency_ms", 0)
        if total > 0 and backend > 0:
            overheads.append(total - backend)
        elif "gateway_overhead_ms" in r:
            overheads.append(r["gateway_overhead_ms"])
    return sum(overheads) / max(len(overheads), 1)


def cost_per_request(records: list[dict]) -> float:
    """Average cost per request in USD."""
    costs = []
    for r in records:
        cost = r.get("cost_usd", r.get("request_cost", None))
        if cost is not None:
            costs.append(float(cost))
        elif "tokens_actual" in r:
            # Estimate: $0.002 per 1K tokens (GPT-3.5 tier)
            costs.append(r["tokens_actual"] * 0.000002)
    return sum(costs) / max(len(costs), 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Cost-Optimized AI Gateway")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "cache_hit_rate":      round(cache_hit_rate(records), 4),
        "token_savings_pct":   round(token_savings_pct(records), 4),
        "latency_overhead_ms": round(latency_overhead_ms(records), 2),
        "cost_per_request":    round(cost_per_request(records), 6),
    }

    print(f"{'Metric':<28} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 60)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
        if metric in ("latency_overhead_ms", "cost_per_request"):
            passed = value <= thresh
        else:
            passed = value >= thresh
        status = "PASS" if passed else "FAIL"
        if not passed:
            any_fail = True
        print(f"{metric:<28} {value:>10} {thresh:>10} {status:>8}")

    print()
    if any_fail:
        print("RESULT: FAIL  one or more metrics below threshold")
        sys.exit(1)
    else:
        print("RESULT: PASS  all metrics within threshold")
        sys.exit(0)


if __name__ == "__main__":
    main()