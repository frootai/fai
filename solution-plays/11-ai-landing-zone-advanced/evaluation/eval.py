#!/usr/bin/env python3
"""
FrootAI Play 11  AI Landing Zone Advanced Evaluation
Evaluates: network config validation, RBAC compliance, private endpoint verification, policy compliance.
Run: python eval.py --test-set evaluation/test-set.jsonl
"""
import argparse
import json
import os
import re
import sys

#  Thresholds 
THRESHOLDS = {
    "network_config_valid":     1.00,  # must be 100%
    "rbac_compliance":          0.95,
    "private_endpoint_valid":   1.00,  # must be 100%
    "policy_compliance":        0.95,
}

#  Required patterns 
REQUIRED_NSG_RULES = {"deny-inbound-internet", "allow-vnet-internal"}
REQUIRED_RBAC_ROLES = {"reader", "contributor", "owner"}

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


def network_config_validation(records: list[dict]) -> float:
    """Validate network configs: subnets have NSGs, no public IPs unless allowed."""
    valid, total = 0, 0
    for r in records:
        if r.get("resource_type") != "network":
            continue
        total += 1
        has_nsg = r.get("has_nsg", False)
        no_public_ip = not r.get("has_public_ip", True)
        nsg_rules = set(rule.lower() for rule in r.get("nsg_rules", []))
        rules_ok = REQUIRED_NSG_RULES.issubset(nsg_rules) if nsg_rules else False
        if has_nsg and no_public_ip and rules_ok:
            valid += 1
        elif has_nsg and no_public_ip:
            valid += 0.5  # partial: NSG present but rules incomplete
    return valid / max(total, 1)


def rbac_compliance(records: list[dict]) -> float:
    """Check RBAC assignments follow least-privilege principle."""
    compliant, total = 0, 0
    for r in records:
        if r.get("resource_type") != "rbac":
            continue
        total += 1
        role = r.get("assigned_role", "").lower()
        scope = r.get("scope", "").lower()
        expected_role = r.get("expected_role", "").lower()
        # Check: role matches expected AND scope is not subscription-wide unless expected
        role_ok = role == expected_role if expected_role else role != "owner"
        scope_ok = "subscription" not in scope or r.get("scope_allowed", False)
        if role_ok and scope_ok:
            compliant += 1
    return compliant / max(total, 1)


def private_endpoint_verification(records: list[dict]) -> float:
    """All data services must have private endpoints enabled."""
    valid, total = 0, 0
    data_services = {"storage", "cosmosdb", "sql", "keyvault", "openai", "search", "cognitive"}
    for r in records:
        svc = r.get("service_type", "").lower()
        if svc not in data_services and r.get("resource_type") != "private_endpoint":
            continue
        total += 1
        has_pe = r.get("private_endpoint_enabled", False)
        no_public = not r.get("public_access_enabled", True)
        if has_pe and no_public:
            valid += 1
    return valid / max(total, 1)


def policy_compliance(records: list[dict]) -> float:
    """Check Azure Policy compliance status for each resource."""
    compliant, total = 0, 0
    for r in records:
        if r.get("resource_type") != "policy":
            continue
        total += 1
        status = r.get("compliance_status", "").lower()
        if status in ("compliant", "pass", "ok"):
            compliant += 1
    return compliant / max(total, 1)


#  Main 
def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate AI Landing Zone Advanced")
    parser.add_argument("--test-set", required=True, help="Path to test-set.jsonl")
    args = parser.parse_args()

    if not os.path.isfile(args.test_set):
        print(f"ERROR: test-set not found: {args.test_set}", file=sys.stderr)
        sys.exit(2)

    records = load_jsonl(args.test_set)
    print(f"Loaded {len(records)} records from {args.test_set}\n")

    results = {
        "network_config_valid":   round(network_config_validation(records), 4),
        "rbac_compliance":        round(rbac_compliance(records), 4),
        "private_endpoint_valid": round(private_endpoint_verification(records), 4),
        "policy_compliance":      round(policy_compliance(records), 4),
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