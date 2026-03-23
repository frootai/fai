#!/usr/bin/env python3
"""
FrootAI Play 10  Content Moderation Evaluation
Evaluates: true positive rate, false positive rate, severity classification accuracy.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "true_positive_rate":       0.90,
    "false_positive_rate":      0.08,  # max acceptable
    "severity_class_accuracy":  0.85,
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


def true_positive_rate(records: list[dict]) -> float:
    """Recall: fraction of actual violations correctly flagged."""
    tp, fn = 0, 0
    for r in records:
        is_violation = r.get("expected_violation", False)
        flagged = r.get("predicted_violation", r.get("flagged", False))
        if is_violation:
            if flagged:
                tp += 1
            else:
                fn += 1
    return tp / max(tp + fn, 1)


def false_positive_rate(records: list[dict]) -> float:
    """Fraction of clean content incorrectly flagged."""
    fp, tn = 0, 0
    for r in records:
        is_violation = r.get("expected_violation", False)
        flagged = r.get("predicted_violation", r.get("flagged", False))
        if not is_violation:
            if flagged:
                fp += 1
            else:
                tn += 1
    return fp / max(fp + tn, 1)


def severity_classification_accuracy(records: list[dict]) -> float:
    """Check if predicted severity matches expected severity level."""
    hits, total = 0, 0
    for r in records:
        exp = r.get("expected_severity", "").lower().strip()
        pred = r.get("predicted_severity", "").lower().strip()
        if exp:
            total += 1
            if exp == pred:
                hits += 1
            elif _adjacent_severity(exp, pred):
                hits += 0.5  # partial credit for off-by-one
    return hits / max(total, 1)


SEVERITY_ORDER = ["none", "low", "medium", "high", "critical"]

def _adjacent_severity(a: str, b: str) -> bool:
    """Check if two severity levels are adjacent."""
    if a not in SEVERITY_ORDER or b not in SEVERITY_ORDER:
        return False
    return abs(SEVERITY_ORDER.index(a) - SEVERITY_ORDER.index(b)) == 1


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Content Moderation")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "true_positive_rate":      round(true_positive_rate(records), 4),
        "false_positive_rate":     round(false_positive_rate(records), 4),
        "severity_class_accuracy": round(severity_classification_accuracy(records), 4),
    }

    print(f"{'Metric':<28} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 60)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
        if metric == "false_positive_rate":
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