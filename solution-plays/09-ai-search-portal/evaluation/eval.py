#!/usr/bin/env python3
"""
FrootAI Play 09  AI Search Portal Evaluation
Evaluates: search relevance (NDCG), hybrid search quality, semantic ranking accuracy.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import math
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "ndcg_at_10":              0.70,
    "hybrid_search_quality":   0.75,
    "semantic_ranking_acc":    0.80,
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


def dcg(relevances: list[float], k: int = 10) -> float:
    """Discounted Cumulative Gain at k."""
    score = 0.0
    for i, rel in enumerate(relevances[:k]):
        score += rel / math.log2(i + 2)  # i+2 because log2(1)=0
    return score


def ndcg_at_k(records: list[dict], k: int = 10) -> float:
    """Compute average NDCG@k across all queries."""
    scores = []
    for r in records:
        relevances = r.get("result_relevances", [])
        ideal = sorted(relevances, reverse=True)
        d = dcg(relevances, k)
        ideal_d = dcg(ideal, k)
        if ideal_d > 0:
            scores.append(d / ideal_d)
        else:
            scores.append(0.0)
    return sum(scores) / max(len(scores), 1)


def hybrid_search_quality(records: list[dict]) -> float:
    """Check if hybrid results contain at least one expected result in top-5."""
    hits, total = 0, 0
    for r in records:
        expected_ids = set(str(e).lower() for e in r.get("expected_result_ids", []))
        returned_ids = [str(e).lower() for e in r.get("returned_result_ids", [])][:5]
        if expected_ids:
            total += 1
            if expected_ids & set(returned_ids):
                hits += 1
    return hits / max(total, 1)


def semantic_ranking_accuracy(records: list[dict]) -> float:
    """Check if the top-1 semantically ranked result matches expected."""
    hits, total = 0, 0
    for r in records:
        exp = str(r.get("expected_top_result", "")).lower().strip()
        actual = str(r.get("top_result", r.get("semantic_top_result", ""))).lower().strip()
        if exp:
            total += 1
            if exp == actual:
                hits += 1
    return hits / max(total, 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate AI Search Portal")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "ndcg_at_10":            round(ndcg_at_k(records, 10), 4),
        "hybrid_search_quality": round(hybrid_search_quality(records), 4),
        "semantic_ranking_acc":  round(semantic_ranking_accuracy(records), 4),
    }

    print(f"{'Metric':<28} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 60)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
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