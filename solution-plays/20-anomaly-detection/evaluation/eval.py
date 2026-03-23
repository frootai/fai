#!/usr/bin/env python3
"""
FrootAI Play 20  Anomaly Detection Evaluation
Evaluates: anomaly precision, recall, false alarm rate, detection latency.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "anomaly_precision":      0.85,
    "anomaly_recall":         0.80,
    "false_alarm_rate":       0.10,   # max acceptable
    "detection_latency_p95s": 60.0,   # max acceptable seconds
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


def anomaly_precision(records: list[dict]) -> float:
    """Precision: TP / (TP + FP) among predicted anomalies."""
    tp, fp = 0, 0
    for r in records:
        predicted = r.get("predicted_anomaly", r.get("is_anomaly_predicted", False))
        actual = r.get("expected_anomaly", r.get("is_anomaly", False))
        if predicted:
            if actual:
                tp += 1
            else:
                fp += 1
    return tp / max(tp + fp, 1)


def anomaly_recall(records: list[dict]) -> float:
    """Recall: TP / (TP + FN) among actual anomalies."""
    tp, fn = 0, 0
    for r in records:
        predicted = r.get("predicted_anomaly", r.get("is_anomaly_predicted", False))
        actual = r.get("expected_anomaly", r.get("is_anomaly", False))
        if actual:
            if predicted:
                tp += 1
            else:
                fn += 1
    return tp / max(tp + fn, 1)


def false_alarm_rate(records: list[dict]) -> float:
    """FPR: FP / (FP + TN) among non-anomalous points."""
    fp, tn = 0, 0
    for r in records:
        predicted = r.get("predicted_anomaly", r.get("is_anomaly_predicted", False))
        actual = r.get("expected_anomaly", r.get("is_anomaly", False))
        if not actual:
            if predicted:
                fp += 1
            else:
                tn += 1
    return fp / max(fp + tn, 1)


def detection_latency_p95(records: list[dict]) -> float:
    """P95 of detection latency in seconds (time from event to alert)."""
    vals = sorted(
        r.get("detection_latency_s", r.get("detection_delay_s", 0))
        for r in records
        if "detection_latency_s" in r or "detection_delay_s" in r
    )
    if not vals:
        return 0.0
    idx = int(len(vals) * 0.95)
    return vals[min(idx, len(vals) - 1)]


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Anomaly Detection")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "anomaly_precision":      round(anomaly_precision(records), 4),
        "anomaly_recall":         round(anomaly_recall(records), 4),
        "false_alarm_rate":       round(false_alarm_rate(records), 4),
        "detection_latency_p95s": round(detection_latency_p95(records), 2),
    }

    print(f"{'Metric':<28} {'Value':>10} {'Threshold':>10} {'Status':>8}")
    print("-" * 60)
    any_fail = False
    for metric, value in results.items():
        thresh = THRESHOLDS[metric]
        if metric in ("false_alarm_rate", "detection_latency_p95s"):
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