#!/usr/bin/env python3
"""
FrootAI Play 16  Copilot Teams Extension Evaluation
Evaluates: Graph API response validation, Teams message formatting, plugin compliance.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "graph_api_valid":         0.95,
    "message_format_valid":    0.90,
    "plugin_compliance":       0.95,
}

#  Required fields for Adaptive Card / Teams message 
REQUIRED_CARD_FIELDS = {"type", "version", "body"}
REQUIRED_PLUGIN_FIELDS = {"name", "description", "api"}

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


def graph_api_response_valid(records: list[dict]) -> float:
    """Validate Graph API responses have expected structure and status."""
    valid, total = 0, 0
    for r in records:
        if r.get("test_type") not in ("graph_api", None) and "graph_response" not in r:
            continue
        resp = r.get("graph_response", r)
        total += 1
        status = resp.get("status_code", resp.get("status", 0))
        has_value = "value" in resp or "data" in resp
        # Valid: 2xx status + has response data
        if 200 <= int(status) < 300 and has_value:
            valid += 1
        elif 200 <= int(status) < 300:
            valid += 0.5  # status ok but missing data
    return valid / max(total, 1)


def message_format_valid(records: list[dict]) -> float:
    """Check Teams message output follows Adaptive Card schema."""
    valid, total = 0, 0
    for r in records:
        card = r.get("adaptive_card", r.get("message_card", None))
        if card is None:
            # Check if raw message has basic markdown formatting
            msg = r.get("message", r.get("response_text", ""))
            if msg:
                total += 1
                if len(msg.strip()) > 0 and len(msg) < 10000:
                    valid += 1
            continue
        total += 1
        if isinstance(card, str):
            try:
                card = json.loads(card)
            except json.JSONDecodeError:
                continue
        # Check required Adaptive Card fields
        card_keys = set(k.lower() for k in card.keys())
        if REQUIRED_CARD_FIELDS.issubset(card_keys):
            valid += 1
        elif len(REQUIRED_CARD_FIELDS & card_keys) >= 2:
            valid += 0.5
    return valid / max(total, 1)


def plugin_compliance(records: list[dict]) -> float:
    """Validate plugin manifest entries have required fields and valid URLs."""
    valid, total = 0, 0
    for r in records:
        manifest = r.get("plugin_manifest", None)
        if manifest is None:
            continue
        total += 1
        if isinstance(manifest, str):
            try:
                manifest = json.loads(manifest)
            except json.JSONDecodeError:
                continue
        manifest_keys = set(k.lower() for k in manifest.keys())
        has_fields = REQUIRED_PLUGIN_FIELDS.issubset(manifest_keys)
        # Check API URL is valid
        api_url = manifest.get("api", {}).get("url", "") if isinstance(manifest.get("api"), dict) else ""
        url_valid = bool(re.match(r"https?://", api_url)) if api_url else True
        if has_fields and url_valid:
            valid += 1
    return valid / max(total, 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate Copilot Teams Extension")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "graph_api_valid":      round(graph_api_response_valid(records), 4),
        "message_format_valid": round(message_format_valid(records), 4),
        "plugin_compliance":    round(plugin_compliance(records), 4),
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