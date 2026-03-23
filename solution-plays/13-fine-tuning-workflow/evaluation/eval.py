#!/usr/bin/env python3
"""
FrootAI Play 13  Fine-Tuning Workflow Evaluation
Evaluates: training loss convergence, eval metric improvement, data quality score.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "loss_convergence":       0.80,   # fraction of runs that converged
    "eval_metric_improvement": 0.05,  # min relative improvement over baseline
    "data_quality_score":     0.85,
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


def loss_convergence(records: list[dict]) -> float:
    """Fraction of training runs where final loss < initial loss * 0.5."""
    converged, total = 0, 0
    for r in records:
        losses = r.get("training_losses", [])
        if len(losses) >= 2:
            total += 1
            initial, final = losses[0], losses[-1]
            if initial > 0 and final < initial * 0.5:
                converged += 1
        elif "loss_initial" in r and "loss_final" in r:
            total += 1
            if r["loss_final"] < r["loss_initial"] * 0.5:
                converged += 1
    return converged / max(total, 1)


def eval_metric_improvement(records: list[dict]) -> float:
    """Average relative improvement in eval metric (accuracy/F1) over baseline."""
    improvements = []
    for r in records:
        baseline = r.get("baseline_metric", r.get("baseline_accuracy", 0))
        finetuned = r.get("finetuned_metric", r.get("finetuned_accuracy", 0))
        if baseline > 0:
            improvement = (finetuned - baseline) / baseline
            improvements.append(improvement)
    return sum(improvements) / max(len(improvements), 1)


def data_quality_score(records: list[dict]) -> float:
    """Evaluate training data quality from field completeness and format checks."""
    scores = []
    for r in records:
        # Pre-computed score
        if "data_quality_score" in r:
            scores.append(float(r["data_quality_score"]))
            continue
        # Heuristic: check key fields
        checks = 0
        total_checks = 4
        if r.get("input_text") or r.get("prompt"):
            checks += 1
        if r.get("output_text") or r.get("completion"):
            checks += 1
        if r.get("label") or r.get("expected_output"):
            checks += 1
        # Check for excessive duplication marker
        if not r.get("is_duplicate", False):
            checks += 1
        scores.append(checks / total_checks)
    return sum(scores) / max(len(scores), 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Fine-Tuning Workflow")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "loss_convergence":        round(loss_convergence(records), 4),
        "eval_metric_improvement": round(eval_metric_improvement(records), 4),
        "data_quality_score":      round(data_quality_score(records), 4),
    }

    print(f"{'Metric':<30} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 62)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
        passed = value >= thresh
        status = "PASS" if passed else "FAIL"
        if not passed:
            any_fail = True
        print(f"{metric:<30} {value:>10} {thresh:>10} {status:>8}")

    print()
    if any_fail:
        print("RESULT: FAIL  one or more metrics below threshold")
        sys.exit(1)
    else:
        print("RESULT: PASS  all metrics within threshold")
        sys.exit(0)


if __name__ == "__main__":
    main()