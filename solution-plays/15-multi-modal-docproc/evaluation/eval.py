#!/usr/bin/env python3
"""
FrootAI Play 15  Multi-Modal Document Processing Evaluation
Evaluates: image OCR accuracy, table extraction precision, multi-modal fusion score.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "image_ocr_accuracy":       0.88,
    "table_extraction_prec":    0.82,
    "multi_modal_fusion_score": 0.78,
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


def image_ocr_accuracy(records: list[dict]) -> float:
    """Token overlap between expected and extracted text from images."""
    hits, total = 0, 0
    for r in records:
        if r.get("modality") not in ("image", "scan", None) and "expected_ocr_text" not in r:
            continue
        expected = set(re.findall(r"\w+", r.get("expected_ocr_text", "").lower()))
        extracted = set(re.findall(r"\w+", r.get("extracted_ocr_text", "").lower()))
        if expected:
            overlap = len(expected & extracted) / len(expected)
            hits += overlap
            total += 1
    return hits / max(total, 1)


def table_extraction_precision(records: list[dict]) -> float:
    """Check extracted table cells against expected cells."""
    correct, predicted_total = 0, 0
    for r in records:
        exp_cells = r.get("expected_table_cells", [])
        ext_cells = r.get("extracted_table_cells", [])
        if not ext_cells:
            continue
        exp_set = set(str(c).strip().lower() for c in exp_cells)
        for cell in ext_cells:
            predicted_total += 1
            if str(cell).strip().lower() in exp_set:
                correct += 1
    return correct / max(predicted_total, 1)


def multi_modal_fusion_score(records: list[dict]) -> float:
    """Evaluate how well text + image + table signals fuse into correct answer."""
    scores = []
    for r in records:
        # Pre-computed fusion score
        if "fusion_score" in r:
            scores.append(float(r["fusion_score"]))
            continue
        # Heuristic: check if final_answer matches expected across modalities
        exp = str(r.get("expected_answer", "")).strip().lower()
        pred = str(r.get("predicted_answer", "")).strip().lower()
        if not exp:
            continue
        if exp == pred:
            scores.append(1.0)
        elif exp in pred or pred in exp:
            scores.append(0.7)
        else:
            # Partial: keyword overlap
            exp_words = set(exp.split())
            pred_words = set(pred.split())
            overlap = len(exp_words & pred_words) / max(len(exp_words), 1)
            scores.append(overlap * 0.5)
    return sum(scores) / max(len(scores), 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Multi-Modal Document Processing")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "image_ocr_accuracy":       round(image_ocr_accuracy(records), 4),
        "table_extraction_prec":    round(table_extraction_precision(records), 4),
        "multi_modal_fusion_score": round(multi_modal_fusion_score(records), 4),
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