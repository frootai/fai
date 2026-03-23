#!/usr/bin/env python3
"""
FrootAI Play 07  Multi-Agent Service Evaluation
Evaluates: supervisor routing accuracy, agent handoff success, task completion rate.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "supervisor_routing_acc": 0.85,
    "handoff_success_rate":   0.90,
    "task_completion_rate":   0.80,
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


def supervisor_routing_accuracy(records: list[dict]) -> float:
    """Check if supervisor routed to the correct agent."""
    hits, total = 0, 0
    for r in records:
        exp = r.get("expected_agent", "").lower().strip()
        routed = r.get("routed_agent", "").lower().strip()
        if exp:
            hits += int(exp == routed)
            total += 1
    return hits / max(total, 1)


def handoff_success_rate(records: list[dict]) -> float:
    """Fraction of handoffs that completed without error."""
    handoffs = [r for r in records if r.get("has_handoff", False)]
    if not handoffs:
        return 1.0  # no handoffs means no failures
    success = sum(1 for r in handoffs if r.get("handoff_success", False))
    return success / len(handoffs)


def task_completion_rate(records: list[dict]) -> float:
    """Fraction of tasks that reached a completed state."""
    if not records:
        return 0.0
    completed = sum(
        1 for r in records
        if r.get("task_status", "").lower() in ("completed", "done", "resolved")
        or r.get("is_completed", False)
    )
    return completed / len(records)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Multi-Agent Service")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "supervisor_routing_acc": round(supervisor_routing_accuracy(records), 4),
        "handoff_success_rate":   round(handoff_success_rate(records), 4),
        "task_completion_rate":   round(task_completion_rate(records), 4),
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