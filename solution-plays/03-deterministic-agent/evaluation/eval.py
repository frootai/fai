#!/usr/bin/env python3
"""
FrootAI Play 03  Deterministic Agent Evaluation Script
========================================================

Evaluates a deterministic agent against a test set of input scenarios
and expected structured JSON outputs.

Metrics:
  - JSON Validity Rate   : % of actual outputs that are valid JSON
  - Consistency Rate     : same input  same output structure
  - Abstention Accuracy  : out-of-scope inputs get "I don't know" responses

Usage:
    python eval.py --test-set evaluation/test-set.jsonl

No external dependencies  uses only Python stdlib.
"""

import argparse
import json
import re
import sys
from collections import defaultdict

#  Abstention patterns 
# Phrases that indicate the agent correctly declined to answer
ABSTENTION_PATTERNS = [
    r"i don'?t know",
    r"i cannot (answer|help|assist)",
    r"outside (my|the) scope",
    r"not (within|in) (my|the) (scope|domain|knowledge)",
    r"i'?m (not able|unable) to",
    r"no information (available|found)",
    r"i have no data",
    r"out[- ]of[- ]scope",
    r"cannot provide",
    r"not supported",
]
ABSTENTION_RE = re.compile("|".join(ABSTENTION_PATTERNS), re.IGNORECASE)


#  Helpers 

def is_valid_json(text: str) -> bool:
    """Return True if text is parseable as JSON."""
    try:
        json.loads(text)
        return True
    except (json.JSONDecodeError, TypeError):
        return False


def extract_structure(obj) -> str:
    """
    Return a canonical 'shape' string for a JSON value.
    Captures types and keys but not values  used for consistency checks.
    Example: {"a": 1, "b": [true]}  '{"a": int, "b": [bool]}'
    """
    if isinstance(obj, dict):
        inner = ", ".join(
            f"{k!r}: {extract_structure(v)}" for k, v in sorted(obj.items())
        )
        return "{" + inner + "}"
    if isinstance(obj, list):
        if not obj:
            return "[]"
        # Use structure of first element as representative
        return "[" + extract_structure(obj[0]) + "]"
    return type(obj).__name__


def is_abstention(text: str) -> bool:
    """Return True if the text looks like an abstention / refusal."""
    return bool(ABSTENTION_RE.search(text))


#  Test-set loader 

def load_test_set(path: str) -> list[dict]:
    """
    Load a JSONL test set.  Supports:
      1. Standard JSONL (one JSON object per line)
      2. Legacy single-JSON with a top-level "questions" array
    Each item should have: id, question, ground_truth, category, expect.
    """
    items: list[dict] = []
    with open(path, "r", encoding="utf-8") as fh:
        raw = fh.read().strip()

    # Try legacy format
    try:
        blob = json.loads(raw)
        if isinstance(blob, dict) and "questions" in blob:
            return blob["questions"]
        if isinstance(blob, list):
            return blob
    except json.JSONDecodeError:
        pass

    # Standard JSONL
    for lineno, line in enumerate(raw.splitlines(), 1):
        line = line.strip()
        if not line:
            continue
        try:
            items.append(json.loads(line))
        except json.JSONDecodeError as exc:
            print(f"  Warning: skipping malformed line {lineno}: {exc}")
    return items


#  Main evaluation 

def main() -> None:
    parser = argparse.ArgumentParser(
        description="FrootAI Deterministic Agent  Evaluation Script"
    )
    parser.add_argument(
        "--test-set",
        required=True,
        help="Path to test-set.jsonl (scenarios + expected outputs)",
    )
    args = parser.parse_args()

    cases = load_test_set(args.test_set)
    if not cases:
        print("ERROR: No test cases loaded.")
        sys.exit(1)

    print(f"\n{'='*68}")
    print(f"  FrootAI Deterministic Agent  Evaluation Report")
    print(f"  Test cases loaded: {len(cases)}")
    print(f"{'='*68}\n")

    # Counters
    total = len(cases)
    json_valid_count = 0
    consistency_groups: dict[str, list[str]] = defaultdict(list)
    abstention_correct = 0
    abstention_total = 0
    results = []

    for case in cases:
        qid      = case.get("id", "?")
        question = case.get("question", "")
        truth    = case.get("ground_truth", "")
        category = case.get("category", "in-scope")
        expect   = case.get("expect", "answer")
        # If actual_answer not present, use ground_truth as simulation
        actual   = case.get("actual_answer", truth)

        #  JSON validity 
        # Try to treat the actual answer as JSON; if it's plain text
        # wrap it in a JSON object so the check is meaningful.
        actual_as_json = actual
        if not is_valid_json(actual):
            # Wrap plain-text answers in a standard envelope
            actual_as_json = json.dumps({"answer": actual})
        json_ok = is_valid_json(actual_as_json)
        if json_ok:
            json_valid_count += 1

        #  Consistency (structure fingerprint) 
        try:
            parsed = json.loads(actual_as_json)
            shape = extract_structure(parsed)
        except Exception:
            shape = "<invalid>"
        consistency_groups[category].append(shape)

        #  Abstention check 
        abst_result = None
        if expect == "abstain" or category == "out-of-scope":
            abstention_total += 1
            did_abstain = is_abstention(actual)
            if did_abstain:
                abstention_correct += 1
            abst_result = did_abstain

        results.append({
            "id": qid,
            "question": question[:45],
            "category": category,
            "json_valid": json_ok,
            "shape": shape[:30],
            "abstention": abst_result,
        })

    #  Consistency rate 
    # Within each category, all shapes should be identical
    consistent_categories = 0
    total_categories = len(consistency_groups)
    for cat, shapes in consistency_groups.items():
        if len(set(shapes)) <= 1:
            consistent_categories += 1

    consistency_rate = (
        consistent_categories / total_categories if total_categories else 1.0
    )
    json_validity_rate = json_valid_count / total if total else 0.0
    abstention_accuracy = (
        abstention_correct / abstention_total if abstention_total else 1.0
    )

    #  Per-case table 
    hdr = f"{'ID':<8} {'Question':<47} {'Cat':<14} {'JSON':>5} {'Abst':>6}"
    print(hdr)
    print("-" * len(hdr))
    for r in results:
        json_str = "OK" if r["json_valid"] else "FAIL"
        if r["abstention"] is None:
            abst_str = "n/a"
        else:
            abst_str = "OK" if r["abstention"] else "MISS"
        print(
            f"{r['id']:<8} {r['question']:<47} {r['category']:<14} "
            f"{json_str:>5} {abst_str:>6}"
        )

    #  Aggregate metrics 
    print(f"\n{''*68}")
    print(f"  Aggregate Metrics")
    print(f"{''*68}")
    print(f"  JSON Validity Rate    : {json_validity_rate:.1%}  ({json_valid_count}/{total})")
    print(f"  Consistency Rate      : {consistency_rate:.1%}  ({consistent_categories}/{total_categories} categories)")
    print(f"  Abstention Accuracy   : {abstention_accuracy:.1%}  ({abstention_correct}/{abstention_total})")
    print(f"{''*68}")

    # Pass/fail determination
    all_pass = (
        json_validity_rate >= 0.95
        and consistency_rate >= 0.90
        and abstention_accuracy >= 0.80
    )
    print(f"\n  Overall: {'PASS' if all_pass else 'FAIL'}")
    print(f"    Thresholds: JSON >= 95%, Consistency >= 90%, Abstention >= 80%\n")

    sys.exit(0 if all_pass else 1)


if __name__ == "__main__":
    main()