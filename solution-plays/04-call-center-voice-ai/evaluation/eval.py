#!/usr/bin/env python3
"""
FrootAI Play 04  Call Center Voice AI Evaluation
Evaluates: speech accuracy, response latency, fallback rate, sentiment detection.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys
from collections import Counter

#  Thresholds 
THRESHOLDS = {
    "speech_accuracy":     0.85,
    "response_latency_ms": 3000,   # max acceptable p95 latency
    "fallback_rate":       0.15,   # max acceptable fallback %
    "sentiment_accuracy":  0.80,
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


def speech_accuracy(records: list[dict]) -> float:
    """Compare recognised_text to expected_text using token overlap."""
    hits, total = 0, 0
    for r in records:
        expected = set(re.findall(r"\w+", r.get("expected_text", "").lower()))
        recognised = set(re.findall(r"\w+", r.get("recognised_text", "").lower()))
        if expected:
            hits += len(expected & recognised) / len(expected)
            total += 1
    return hits / max(total, 1)


def response_latency_p95(records: list[dict]) -> float:
    """Compute p95 of response_latency_ms values."""
    vals = sorted(r.get("response_latency_ms", 0) for r in records)
    if not vals:
        return 0.0
    idx = int(len(vals) * 0.95)
    return vals[min(idx, len(vals) - 1)]


def fallback_rate(records: list[dict]) -> float:
    """Fraction of interactions that triggered the fallback intent."""
    if not records:
        return 0.0
    fallbacks = sum(
        1 for r in records
        if r.get("intent") in ("fallback", "unknown", None)
        or r.get("is_fallback", False)
    )
    return fallbacks / len(records)


def sentiment_accuracy(records: list[dict]) -> float:
    """Compare predicted_sentiment to expected_sentiment."""
    hits, total = 0, 0
    for r in records:
        exp = r.get("expected_sentiment", "").lower()
        pred = r.get("predicted_sentiment", "").lower()
        if exp:
            hits += int(exp == pred)
            total += 1
    return hits / max(total, 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Call Center Voice AI")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    # Compute metrics
    results = {
        "speech_accuracy":     round(speech_accuracy(records), 4),
        "response_latency_ms": round(response_latency_p95(records), 2),
        "fallback_rate":       round(fallback_rate(records), 4),
        "sentiment_accuracy":  round(sentiment_accuracy(records), 4),
    }

    # Print table
    print(f"{'Metric':<25} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 58)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
        if metric == "response_latency_ms":
            passed = value <= thresh
        elif metric == "fallback_rate":
            passed = value <= thresh
        else:
            passed = value >= thresh
        status = "PASS" if passed else "FAIL"
        if not passed:
            any_fail = True
        print(f"{metric:<25} {value:>10} {thresh:>10} {status:>8}")

    print()
    if any_fail:
        print("RESULT: FAIL  one or more metrics below threshold")
        sys.exit(1)
    else:
        print("RESULT: PASS  all metrics within threshold")
        sys.exit(0)


if __name__ == "__main__":
    main()