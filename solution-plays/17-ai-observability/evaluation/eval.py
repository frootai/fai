#!/usr/bin/env python3
"""
FrootAI Play 17  AI Observability Evaluation
Evaluates: KQL query coverage, alert accuracy, dashboard completeness, metric collection.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "kql_query_coverage":     0.85,
    "alert_accuracy":         0.90,
    "dashboard_completeness": 0.80,
    "metric_collection":      0.90,
}

#  Required observability components 
REQUIRED_KQL_TABLES = {"requests", "traces", "exceptions", "customMetrics", "dependencies"}
REQUIRED_METRICS = {"latency_p95", "error_rate", "token_usage", "availability"}

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


def kql_query_coverage(records: list[dict]) -> float:
    """Check if KQL queries cover all required App Insights tables."""
    all_tables_found = set()
    for r in records:
        query = r.get("kql_query", "")
        for table in REQUIRED_KQL_TABLES:
            if re.search(rf"\b{table}\b", query, re.IGNORECASE):
                all_tables_found.add(table.lower())
        # Also check explicit table list
        tables = r.get("covered_tables", [])
        for t in tables:
            all_tables_found.add(t.lower())
    return len(all_tables_found) / len(REQUIRED_KQL_TABLES)


def alert_accuracy(records: list[dict]) -> float:
    """Check if alerts fired correctly: true alerts vs false alerts."""
    correct, total = 0, 0
    for r in records:
        if r.get("test_type") not in ("alert", None) and "expected_alert" not in r:
            continue
        if "expected_alert" not in r:
            continue
        total += 1
        expected = r.get("expected_alert", False)
        fired = r.get("alert_fired", False)
        if expected == fired:
            correct += 1
    return correct / max(total, 1)


def dashboard_completeness(records: list[dict]) -> float:
    """Verify dashboard panels cover required metric categories."""
    required_panels = {"latency", "errors", "tokens", "availability", "cost"}
    found_panels = set()
    for r in records:
        panels = r.get("dashboard_panels", [])
        for panel in panels:
            name = str(panel).lower()
            for req in required_panels:
                if req in name:
                    found_panels.add(req)
        # Also check panel_name field
        pname = r.get("panel_name", "").lower()
        for req in required_panels:
            if req in pname:
                found_panels.add(req)
    return len(found_panels) / max(len(required_panels), 1)


def metric_collection(records: list[dict]) -> float:
    """Check if all required custom metrics are being collected."""
    found_metrics = set()
    for r in records:
        metrics = r.get("collected_metrics", [])
        for m in metrics:
            found_metrics.add(m.lower().replace(" ", "_"))
        # Check metric_name field
        mname = r.get("metric_name", "").lower().replace(" ", "_")
        if mname:
            found_metrics.add(mname)
    coverage = 0
    for req in REQUIRED_METRICS:
        if any(req in m for m in found_metrics):
            coverage += 1
    return coverage / len(REQUIRED_METRICS)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate AI Observability")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "kql_query_coverage":     round(kql_query_coverage(records), 4),
        "alert_accuracy":         round(alert_accuracy(records), 4),
        "dashboard_completeness": round(dashboard_completeness(records), 4),
        "metric_collection":      round(metric_collection(records), 4),
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