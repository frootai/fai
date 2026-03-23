#!/usr/bin/env python3
"""
FrootAI Play 08  Copilot Studio Bot Evaluation
Evaluates: topic matching, knowledge retrieval, guardrail adherence, user satisfaction.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "topic_match_accuracy":     0.85,
    "knowledge_retrieval_acc":  0.80,
    "guardrail_adherence":      0.95,
    "user_satisfaction":        0.75,  # normalised 0-1 scale
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


def topic_match_accuracy(records: list[dict]) -> float:
    """Check if predicted_topic matches expected_topic."""
    hits, total = 0, 0
    for r in records:
        exp = r.get("expected_topic", "").lower().strip()
        pred = r.get("predicted_topic", "").lower().strip()
        if exp:
            hits += int(exp == pred)
            total += 1
    return hits / max(total, 1)


def knowledge_retrieval_accuracy(records: list[dict]) -> float:
    """Check if retrieved_sources contain the expected_source."""
    hits, total = 0, 0
    for r in records:
        exp_sources = r.get("expected_sources", [])
        ret_sources = [s.lower().strip() for s in r.get("retrieved_sources", [])]
        for src in exp_sources:
            total += 1
            if src.lower().strip() in ret_sources:
                hits += 1
    return hits / max(total, 1)


def guardrail_adherence(records: list[dict]) -> float:
    """Fraction of responses that did NOT violate any guardrail."""
    if not records:
        return 1.0
    compliant = sum(
        1 for r in records
        if not r.get("guardrail_violated", False)
        and r.get("guardrail_status", "pass").lower() == "pass"
    )
    return compliant / len(records)


def user_satisfaction(records: list[dict]) -> float:
    """Average satisfaction score normalised to 0-1 (expects 1-5 or 0-1 scale)."""
    vals = []
    for r in records:
        score = r.get("user_satisfaction", r.get("satisfaction_score", None))
        if score is not None:
            score = float(score)
            if score > 1.0:
                score = score / 5.0  # convert 1-5 to 0-1
            vals.append(score)
    return sum(vals) / max(len(vals), 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Copilot Studio Bot")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "topic_match_accuracy":    round(topic_match_accuracy(records), 4),
        "knowledge_retrieval_acc": round(knowledge_retrieval_accuracy(records), 4),
        "guardrail_adherence":     round(guardrail_adherence(records), 4),
        "user_satisfaction":       round(user_satisfaction(records), 4),
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