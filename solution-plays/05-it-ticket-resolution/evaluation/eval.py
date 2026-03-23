#!/usr/bin/env python3
"""
FrootAI Play 05  IT Ticket Resolution Evaluation
Evaluates: classification accuracy, routing precision, resolution time, false positive rate.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "classification_accuracy": 0.85,
    "routing_precision":       0.80,
    "avg_resolution_min":      30.0,   # max acceptable average minutes
    "false_positive_rate":     0.10,
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


def classification_accuracy(records: list[dict]) -> float:
    """Compare predicted_category to expected_category."""
    hits, total = 0, 0
    for r in records:
        exp = r.get("expected_category", "").lower().strip()
        pred = r.get("predicted_category", "").lower().strip()
        if exp:
            hits += int(exp == pred)
            total += 1
    return hits / max(total, 1)


def routing_precision(records: list[dict]) -> float:
    """Check if assigned_team matches expected_team."""
    hits, total = 0, 0
    for r in records:
        exp = r.get("expected_team", "").lower().strip()
        pred = r.get("assigned_team", "").lower().strip()
        if exp:
            hits += int(exp == pred)
            total += 1
    return hits / max(total, 1)


def avg_resolution_time(records: list[dict]) -> float:
    """Average resolution time in minutes."""
    vals = [r.get("resolution_time_min", 0) for r in records if "resolution_time_min" in r]
    return sum(vals) / max(len(vals), 1)


def false_positive_rate(records: list[dict]) -> float:
    """Fraction marked resolved but expected_resolved is false."""
    fp, negatives = 0, 0
    for r in records:
        expected = r.get("expected_resolved", True)
        predicted = r.get("predicted_resolved", True)
        if not expected:
            negatives += 1
            if predicted:
                fp += 1
    return fp / max(negatives, 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate IT Ticket Resolution")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "classification_accuracy": round(classification_accuracy(records), 4),
        "routing_precision":       round(routing_precision(records), 4),
        "avg_resolution_min":      round(avg_resolution_time(records), 2),
        "false_positive_rate":     round(false_positive_rate(records), 4),
    }

    print(f"{'Metric':<28} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 60)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
        if metric in ("avg_resolution_min", "false_positive_rate"):
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