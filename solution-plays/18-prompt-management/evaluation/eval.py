#!/usr/bin/env python3
"""
FrootAI Play 18  Prompt Management Evaluation
Evaluates: version drift detection, A/B test significance, prompt quality score.
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
    "version_drift_detected":  0.90,  # fraction of drifts correctly identified
    "ab_test_significance":    0.80,  # fraction of A/B tests with valid p<0.05
    "prompt_quality_score":    0.75,
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


def version_drift_detection(records: list[dict]) -> float:
    """Check if prompt version changes were correctly detected."""
    correct, total = 0, 0
    for r in records:
        if "expected_drift" not in r:
            continue
        total += 1
        expected = r.get("expected_drift", False)
        detected = r.get("drift_detected", False)
        if expected == detected:
            correct += 1
    return correct / max(total, 1)


def ab_test_significance(records: list[dict]) -> float:
    """Fraction of A/B comparisons where statistical test agrees with expected."""
    valid, total = 0, 0
    for r in records:
        if "variant_a_score" not in r or "variant_b_score" not in r:
            continue
        total += 1
        a_score = float(r["variant_a_score"])
        b_score = float(r["variant_b_score"])
        n_a = int(r.get("n_a", r.get("sample_size_a", 100)))
        n_b = int(r.get("n_b", r.get("sample_size_b", 100)))
        # Simple z-test approximation for proportions
        p_pool = (a_score * n_a + b_score * n_b) / (n_a + n_b) if (n_a + n_b) > 0 else 0
        if p_pool > 0 and p_pool < 1:
            se = math.sqrt(p_pool * (1 - p_pool) * (1/n_a + 1/n_b))
            z = abs(a_score - b_score) / se if se > 0 else 0
            sig = z > 1.96  # p < 0.05
        else:
            sig = False
        expected_sig = r.get("expected_significant", False)
        if sig == expected_sig:
            valid += 1
    return valid / max(total, 1)


def prompt_quality_score(records: list[dict]) -> float:
    """Evaluate prompt quality via structural checks and output quality."""
    scores = []
    for r in records:
        # Pre-computed quality score
        if "quality_score" in r:
            scores.append(float(r["quality_score"]))
            continue
        prompt = r.get("prompt_text", r.get("system_prompt", ""))
        if not prompt:
            continue
        score = 0.0
        checks = 5
        # 1. Has clear instruction
        if any(kw in prompt.lower() for kw in ("you are", "your task", "instructions", "must", "should")):
            score += 1
        # 2. Reasonable length (50-2000 chars)
        if 50 <= len(prompt) <= 2000:
            score += 1
        # 3. Has output format specification
        if any(kw in prompt.lower() for kw in ("format", "json", "respond with", "output")):
            score += 1
        # 4. Has guardrails / constraints
        if any(kw in prompt.lower() for kw in ("do not", "never", "avoid", "only", "must not")):
            score += 1
        # 5. No prompt injection patterns
        if not re.search(r"ignore (previous|above|all)", prompt, re.IGNORECASE):
            score += 1
        scores.append(score / checks)
    return sum(scores) / max(len(scores), 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Prompt Management")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "version_drift_detected": round(version_drift_detection(records), 4),
        "ab_test_significance":   round(ab_test_significance(records), 4),
        "prompt_quality_score":   round(prompt_quality_score(records), 4),
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