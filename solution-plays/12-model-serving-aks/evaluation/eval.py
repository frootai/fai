#!/usr/bin/env python3
"""
FrootAI Play 12  Model Serving AKS Evaluation
Evaluates: inference latency, throughput, model accuracy, GPU utilization.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "inference_latency_p95_ms": 500.0,   # max acceptable
    "throughput_rps":           50.0,     # min acceptable requests/sec
    "model_accuracy":           0.85,
    "gpu_utilization":          0.40,     # min acceptable (under-utilisation check)
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


def inference_latency_p95(records: list[dict]) -> float:
    """Compute p95 inference latency in milliseconds."""
    vals = sorted(r.get("inference_latency_ms", 0) for r in records if "inference_latency_ms" in r)
    if not vals:
        return 0.0
    idx = int(len(vals) * 0.95)
    return vals[min(idx, len(vals) - 1)]


def throughput_rps(records: list[dict]) -> float:
    """Estimate throughput from total records and total elapsed time."""
    total_time_s = 0.0
    count = 0
    for r in records:
        latency = r.get("inference_latency_ms", 0)
        if latency > 0:
            total_time_s += latency / 1000.0
            count += 1
    if total_time_s == 0:
        return 0.0
    # Simulated: assume batch was run concurrently with concurrency=10
    concurrency = min(10, count)
    return count / (total_time_s / concurrency) if total_time_s > 0 else 0.0


def model_accuracy(records: list[dict]) -> float:
    """Compare predicted_label to expected_label."""
    hits, total = 0, 0
    for r in records:
        exp = str(r.get("expected_label", r.get("expected_output", ""))).lower().strip()
        pred = str(r.get("predicted_label", r.get("predicted_output", ""))).lower().strip()
        if exp:
            hits += int(exp == pred)
            total += 1
    return hits / max(total, 1)


def avg_gpu_utilization(records: list[dict]) -> float:
    """Average GPU utilization (0-1 scale)."""
    vals = []
    for r in records:
        gpu = r.get("gpu_utilization", r.get("gpu_util_pct", None))
        if gpu is not None:
            gpu = float(gpu)
            if gpu > 1.0:
                gpu = gpu / 100.0  # convert percentage to fraction
            vals.append(gpu)
    return sum(vals) / max(len(vals), 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Model Serving on AKS")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "inference_latency_p95_ms": round(inference_latency_p95(records), 2),
        "throughput_rps":           round(throughput_rps(records), 2),
        "model_accuracy":           round(model_accuracy(records), 4),
        "gpu_utilization":          round(avg_gpu_utilization(records), 4),
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