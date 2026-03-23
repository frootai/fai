#!/usr/bin/env python3
"""
FrootAI Play 02  AI Landing Zone Validation Script
====================================================

Validates the AI Landing Zone repository structure, infrastructure
files, configuration, and GitHub Agentic OS scaffolding.

Checks:
  1. infra/main.bicep exists with real content (not a skeleton)
  2. infra/parameters.json is valid JSON with required fields
  3. config/ JSON files parse correctly
  4. .github/ agentic OS files exist (19 expected files)

Usage:
    python eval.py --root .

No external dependencies  uses only Python stdlib.
"""

import argparse
import json
import os
import sys

#  Expected .github agentic OS files (relative to .github/) 
EXPECTED_GITHUB_FILES = [
    "copilot-instructions.md",
    "agents/builder.agent.md",
    "agents/reviewer.agent.md",
    "agents/tuner.agent.md",
    "hooks/guardrails.json",
    "instructions/ai-landing-zone-patterns.instructions.md",
    "instructions/azure-coding.instructions.md",
    "instructions/security.instructions.md",
    "prompts/deploy.prompt.md",
    "prompts/evaluate.prompt.md",
    "prompts/review.prompt.md",
    "prompts/test.prompt.md",
    "skills/deploy-azure/deploy.sh",
    "skills/deploy-azure/SKILL.md",
    "skills/evaluate/SKILL.md",
    "skills/tune/SKILL.md",
    "skills/tune/tune-config.sh",
    "workflows/ai-deploy.md",
    "workflows/ai-review.md",
]

# Required top-level keys in parameters.json
REQUIRED_PARAM_KEYS = ["parameters"]

# Config files that must be valid JSON
CONFIG_FILES = [
    "config/openai.json",
    "config/guardrails.json",
    "config/landing-zone.json",
]

# Minimum byte size for main.bicep to be considered "real content"
BICEP_MIN_BYTES = 200


#  Helpers 

def check(description: str, passed: bool, detail: str = "") -> dict:
    """Record a single check result."""
    return {"description": description, "passed": passed, "detail": detail}


def validate_json_file(path: str) -> tuple[bool, str]:
    """Return (ok, detail) for a JSON file."""
    if not os.path.isfile(path):
        return False, "file not found"
    try:
        with open(path, "r", encoding="utf-8") as fh:
            json.load(fh)
        return True, f"{os.path.getsize(path)} bytes, valid JSON"
    except json.JSONDecodeError as exc:
        return False, f"invalid JSON  {exc}"


#  Main validation 

def main() -> None:
    parser = argparse.ArgumentParser(
        description="FrootAI AI Landing Zone  Validation Script"
    )
    parser.add_argument(
        "--root",
        default=".",
        help="Root directory of the landing-zone play (default: current dir)",
    )
    args = parser.parse_args()
    root = os.path.abspath(args.root)

    results: list[dict] = []

    print(f"\n{'='*68}")
    print(f"  FrootAI AI Landing Zone  Compliance Report")
    print(f"  Root: {root}")
    print(f"{'='*68}\n")

    #  1. infra/main.bicep 
    bicep_path = os.path.join(root, "infra", "main.bicep")
    if not os.path.isfile(bicep_path):
        results.append(check("infra/main.bicep exists", False, "file not found"))
    else:
        size = os.path.getsize(bicep_path)
        has_content = size >= BICEP_MIN_BYTES
        # Check it's not just a skeleton comment
        with open(bicep_path, "r", encoding="utf-8") as fh:
            text = fh.read()
        has_resource = "resource " in text or "module " in text
        ok = has_content and has_resource
        detail = f"{size} bytes"
        if not has_content:
            detail += f"  below minimum {BICEP_MIN_BYTES}B"
        if not has_resource:
            detail += "  no resource/module declarations found (skeleton?)"
        results.append(check("infra/main.bicep has real content", ok, detail))

    #  2. infra/parameters.json 
    params_path = os.path.join(root, "infra", "parameters.json")
    ok_json, detail = validate_json_file(params_path)
    results.append(check("infra/parameters.json is valid JSON", ok_json, detail))

    if ok_json:
        with open(params_path, "r", encoding="utf-8") as fh:
            params = json.load(fh)
        missing = [k for k in REQUIRED_PARAM_KEYS if k not in params]
        ok_keys = len(missing) == 0
        detail = "all required keys present" if ok_keys else f"missing: {missing}"
        results.append(check("parameters.json has required fields", ok_keys, detail))

    #  3. Config files 
    for cfg in CONFIG_FILES:
        cfg_path = os.path.join(root, cfg)
        ok_cfg, detail = validate_json_file(cfg_path)
        results.append(check(f"{cfg} is valid JSON", ok_cfg, detail))

    #  4. .github/ agentic OS files 
    github_dir = os.path.join(root, ".github")
    found = 0
    for rel in EXPECTED_GITHUB_FILES:
        fp = os.path.join(github_dir, rel.replace("/", os.sep))
        exists = os.path.isfile(fp)
        if exists:
            found += 1
        results.append(check(f".github/{rel}", exists,
                             "found" if exists else "MISSING"))

    results.append(check(
        f"Agentic OS completeness ({found}/{len(EXPECTED_GITHUB_FILES)})",
        found == len(EXPECTED_GITHUB_FILES),
        f"{found} of {len(EXPECTED_GITHUB_FILES)} files present",
    ))

    #  Report 
    passed = sum(1 for r in results if r["passed"])
    total = len(results)

    hdr = f"{'#':<4} {'Status':<8} {'Check':<52} {'Detail'}"
    print(hdr)
    print("-" * max(len(hdr), 80))
    for i, r in enumerate(results, 1):
        status = "PASS" if r["passed"] else "FAIL"
        print(f"{i:<4} {status:<8} {r['description']:<52} {r['detail']}")

    print(f"\n{''*68}")
    print(f"  Result: {passed}/{total} checks passed  "
          f"({'ALL CLEAR' if passed == total else 'ISSUES FOUND'})")
    print(f"{''*68}\n")

    sys.exit(0 if passed == total else 1)


if __name__ == "__main__":
    main()