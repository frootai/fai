#!/usr/bin/env python3
"""
FrootAI Play 19  Edge AI Phi-4 Evaluation
Evaluates: local inference latency, model size validation, ONNX compatibility, offline accuracy.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "inference_latency_p95_ms": 200.0,   # max acceptable for edge
    "model_size_valid":         1.00,    # 100% must be within limit
    "onnx_compatibility":       1.00,    # 100% must be ONNX compatible
    "offline_accuracy":         0.80,
}

#  Model size limits (MB) 
MAX_MODEL_SIZE_MB = 4096  # 4 GB limit for edge deployment

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


def inference_latency_p95(records: list[dict]) -> float:
    """Compute p95 local inference latency in milliseconds."""
    vals = sorted(
        r.get("inference_latency_ms", r.get("latency_ms", 0))
        for r in records
        if "inference_latency_ms" in r or "latency_ms" in r
    )
    if not vals:
        return 0.0
    idx = int(len(vals) * 0.95)
    return vals[min(idx, len(vals) - 1)]


def model_size_valid(records: list[dict]) -> float:
    """Fraction of model entries within the edge size limit."""
    valid, total = 0, 0
    for r in records:
        size_mb = r.get("model_size_mb", None)
        if size_mb is None:
            continue
        total += 1
        if float(size_mb) <= MAX_MODEL_SIZE_MB:
            valid += 1
    return valid / max(total, 1)


def onnx_compatibility(records: list[dict]) -> float:
    """Fraction of models that pass ONNX compatibility checks."""
    valid, total = 0, 0
    for r in records:
        if "onnx_compatible" not in r and "model_format" not in r:
            continue
        total += 1
        is_onnx = r.get("onnx_compatible", False)
        fmt = r.get("model_format", "").lower()
        if is_onnx or fmt in ("onnx", "onnxruntime"):
            valid += 1
    return valid / max(total, 1)


def offline_accuracy(records: list[dict]) -> float:
    """Accuracy of model predictions when running fully offline."""
    hits, total = 0, 0
    for r in records:
        exp = str(r.get("expected_output", r.get("expected_label", ""))).strip().lower()
        pred = str(r.get("predicted_output", r.get("predicted_label", ""))).strip().lower()
        if exp:
            total += 1
            if exp == pred:
                hits += 1
            elif exp in pred or pred in exp:
                hits += 0.5  # partial credit
    return hits / max(total, 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Edge AI Phi-4")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "inference_latency_p95_ms": round(inference_latency_p95(records), 2),
        "model_size_valid":         round(model_size_valid(records), 4),
        "onnx_compatibility":       round(onnx_compatibility(records), 4),
        "offline_accuracy":         round(offline_accuracy(records), 4),
    }

    print(f"{'Metric':<30} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 62)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
        if metric == "inference_latency_p95_ms":
            passed = value <= thresh
        else:
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