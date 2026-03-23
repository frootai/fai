#!/usr/bin/env python3
"""
FrootAI Play 06  Document Intelligence Evaluation
Evaluates: OCR confidence, field extraction accuracy, document type detection.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "ocr_confidence":         0.90,
    "field_extraction_acc":   0.85,
    "doc_type_accuracy":      0.90,
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


def avg_ocr_confidence(records: list[dict]) -> float:
    """Average OCR confidence score across all records."""
    vals = [r.get("ocr_confidence", 0.0) for r in records if "ocr_confidence" in r]
    return sum(vals) / max(len(vals), 1)


def field_extraction_accuracy(records: list[dict]) -> float:
    """Check how many expected fields were correctly extracted."""
    hits, total = 0, 0
    for r in records:
        expected_fields = r.get("expected_fields", {})
        extracted_fields = r.get("extracted_fields", {})
        for key, exp_val in expected_fields.items():
            total += 1
            ext_val = extracted_fields.get(key, "")
            # Normalise whitespace and case for comparison
            if str(exp_val).strip().lower() == str(ext_val).strip().lower():
                hits += 1
            elif str(exp_val).strip().lower() in str(ext_val).strip().lower():
                hits += 0.5  # partial credit for substring match
    return hits / max(total, 1)


def doc_type_accuracy(records: list[dict]) -> float:
    """Compare predicted document type to expected."""
    hits, total = 0, 0
    for r in records:
        exp = r.get("expected_doc_type", "").lower().strip()
        pred = r.get("predicted_doc_type", "").lower().strip()
        if exp:
            hits += int(exp == pred)
            total += 1
    return hits / max(total, 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Document Intelligence")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "ocr_confidence":       round(avg_ocr_confidence(records), 4),
        "field_extraction_acc": round(field_extraction_accuracy(records), 4),
        "doc_type_accuracy":    round(doc_type_accuracy(records), 4),
    }

    print(f"{'Metric':<25} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 58)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
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