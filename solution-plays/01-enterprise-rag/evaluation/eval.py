#!/usr/bin/env python3
"""
FrootAI Play 01  Enterprise RAG Q&A Evaluation Script
=======================================================

Evaluates RAG pipeline quality against a ground-truth test set.

Metrics computed per test case:
  - Faithfulness : keyword overlap between expected and actual answer
  - Relevance    : cosine similarity via TF-IDF (stdlib only)
  - Groundedness : checks for citation markers like [Source: ...]

Usage:
    python eval.py --test-set evaluation/test-set.jsonl

No external dependencies  uses only Python stdlib.
"""

import argparse
import json
import math
import re
import sys
from collections import Counter

#  Thresholds 
FAITHFULNESS_THRESHOLD = 0.50   # keyword overlap ratio
RELEVANCE_THRESHOLD    = 0.40   # cosine similarity
GROUNDEDNESS_CITATION  = True   # must contain [Source: ...]


#  Utility helpers 

def tokenize(text: str) -> list[str]:
    """Lowercase, strip punctuation, split into word tokens."""
    return re.findall(r"[a-z0-9]+", text.lower())


def keyword_overlap(expected: str, actual: str) -> float:
    """Fraction of expected keywords that appear in the actual answer."""
    exp_tokens = set(tokenize(expected))
    act_tokens = set(tokenize(actual))
    if not exp_tokens:
        return 1.0  # nothing expected  trivially faithful
    return len(exp_tokens & act_tokens) / len(exp_tokens)


def build_tfidf_vector(tokens: list[str], idf: dict[str, float]) -> dict[str, float]:
    """TF-IDF vector for a single document (token list)."""
    tf = Counter(tokens)
    total = len(tokens) or 1
    return {t: (tf[t] / total) * idf.get(t, 0.0) for t in tf}


def cosine_similarity(vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
    """Cosine similarity between two sparse vectors (dicts)."""
    common = set(vec_a) & set(vec_b)
    dot = sum(vec_a[k] * vec_b[k] for k in common)
    mag_a = math.sqrt(sum(v * v for v in vec_a.values())) or 1e-9
    mag_b = math.sqrt(sum(v * v for v in vec_b.values())) or 1e-9
    return dot / (mag_a * mag_b)


def compute_idf(corpus: list[list[str]]) -> dict[str, float]:
    """Inverse document frequency across the entire corpus."""
    n = len(corpus) or 1
    df: Counter = Counter()
    for doc in corpus:
        df.update(set(doc))
    return {term: math.log((n + 1) / (freq + 1)) + 1 for term, freq in df.items()}


def tfidf_relevance(expected: str, actual: str, idf: dict[str, float]) -> float:
    """Cosine similarity between expected and actual via TF-IDF."""
    tok_exp = tokenize(expected)
    tok_act = tokenize(actual)
    vec_exp = build_tfidf_vector(tok_exp, idf)
    vec_act = build_tfidf_vector(tok_act, idf)
    return cosine_similarity(vec_exp, vec_act)


def has_citation(text: str) -> bool:
    """Return True if the text contains a citation marker [Source: ...]."""
    return bool(re.search(r"\[Source:\s*.+?\]", text, re.IGNORECASE))


#  Test-set loader 

def load_test_set(path: str) -> list[dict]:
    """
    Load a JSONL test set.  Supports two formats:
      1. One JSON object per line  (standard JSONL)
      2. A single JSON object with a top-level "questions" array (legacy)
    Each item must have: id, question, ground_truth.  Optional: actual_answer.
    """
    items: list[dict] = []
    with open(path, "r", encoding="utf-8") as fh:
        raw = fh.read().strip()

    # Try legacy format first (single JSON with "questions" key)
    try:
        blob = json.loads(raw)
        if isinstance(blob, dict) and "questions" in blob:
            items = blob["questions"]
            return items
        if isinstance(blob, list):
            return blob
    except json.JSONDecodeError:
        pass

    # Standard JSONL  one object per line
    for lineno, line in enumerate(raw.splitlines(), 1):
        line = line.strip()
        if not line:
            continue
        try:
            items.append(json.loads(line))
        except json.JSONDecodeError as exc:
            print(f"   Skipping malformed line {lineno}: {exc}")
    return items


#  Main evaluation loop 

def main() -> None:
    parser = argparse.ArgumentParser(
        description="FrootAI Enterprise RAG  Evaluation Script"
    )
    parser.add_argument(
        "--test-set",
        required=True,
        help="Path to test-set.jsonl (questions + ground truth)",
    )
    args = parser.parse_args()

    # Load test cases
    cases = load_test_set(args.test_set)
    if not cases:
        print("ERROR: No test cases loaded. Check the file path and format.")
        sys.exit(1)

    print(f"\n{'='*72}")
    print(f"  FrootAI Enterprise RAG  Evaluation Report")
    print(f"  Test cases loaded: {len(cases)}")
    print(f"{'='*72}\n")

    # Build a corpus-wide IDF from all ground-truth + actual answers
    corpus_tokens = []
    for c in cases:
        corpus_tokens.append(tokenize(c.get("ground_truth", "")))
        corpus_tokens.append(tokenize(c.get("actual_answer", c.get("ground_truth", ""))))
    idf = compute_idf(corpus_tokens)

    # Evaluate each case
    results = []
    for case in cases:
        qid       = case.get("id", "?")
        question  = case.get("question", "")
        expected  = case.get("ground_truth", "")
        # If no actual_answer field, simulate by echoing ground_truth (placeholder)
        actual    = case.get("actual_answer", expected)

        faith = keyword_overlap(expected, actual)
        relev = tfidf_relevance(expected, actual, idf)
        grounded = has_citation(actual)

        results.append({
            "id": qid,
            "question": question[:50],
            "faithfulness": faith,
            "relevance": relev,
            "groundedness": grounded,
            "faith_pass": faith >= FAITHFULNESS_THRESHOLD,
            "relev_pass": relev >= RELEVANCE_THRESHOLD,
            "ground_pass": grounded or not GROUNDEDNESS_CITATION,
        })

    #  Summary table 
    hdr = f"{'ID':<8} {'Question':<52} {'Faith':>6} {'Relev':>6} {'Cited':>6} {'Result':>8}"
    print(hdr)
    print("-" * len(hdr))

    pass_count = 0
    for r in results:
        all_pass = r["faith_pass"] and r["relev_pass"] and r["ground_pass"]
        if all_pass:
            pass_count += 1
        status = "PASS" if all_pass else "FAIL"
        cited = "Yes" if r["groundedness"] else "No"
        print(
            f"{r['id']:<8} {r['question']:<52} "
            f"{r['faithfulness']:>5.2f} {r['relevance']:>6.2f} "
            f"{cited:>6} {status:>8}"
        )

    #  Aggregate metrics 
    total = len(results)
    avg_faith = sum(r["faithfulness"] for r in results) / total
    avg_relev = sum(r["relevance"]    for r in results) / total
    cite_rate = sum(1 for r in results if r["groundedness"]) / total

    print(f"\n{''*72}")
    print(f"  Aggregate Metrics")
    print(f"{''*72}")
    print(f"  Avg Faithfulness : {avg_faith:.3f}  (threshold {FAITHFULNESS_THRESHOLD})")
    print(f"  Avg Relevance    : {avg_relev:.3f}  (threshold {RELEVANCE_THRESHOLD})")
    print(f"  Citation Rate    : {cite_rate:.1%}")
    print(f"  Overall Pass Rate: {pass_count}/{total} ({pass_count/total:.1%})")
    print(f"{''*72}\n")

    # Exit non-zero if any case failed
    sys.exit(0 if pass_count == total else 1)


if __name__ == "__main__":
    main()