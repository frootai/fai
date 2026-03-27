"""FrootAI CLI — Python edition. Offline-first, queries bundled knowledge."""

import argparse
import sys
from frootai import __version__
from frootai.client import FrootAI
from frootai.plays import SolutionPlay


def cmd_plays(args):
    """List solution plays."""
    if args.layer:
        plays = SolutionPlay.by_layer(args.layer.upper())
    elif args.ready:
        plays = SolutionPlay.ready()
    else:
        plays = SolutionPlay.all()
    print(f"\n  FrootAI Solution Plays ({len(plays)} shown)\n")
    for p in plays:
        status = "READY" if p.status == "Ready" else "SKEL "
        print(f"  [{status}] {p.id} {p.name} ({p.complexity}) — {p.layer}")
    print()


def cmd_search(args):
    """Search knowledge base."""
    client = FrootAI()
    results = client.search(args.query, max_results=args.limit)
    if not results:
        print(f"\n  No results for '{args.query}'\n")
        return
    print(f"\n  Search: '{args.query}' — {len(results)} results\n")
    for r in results:
        print(f"  [{r['module_id']}] {r['title']} (layer: {r['layer']}, hits: {r['relevance']})")
        for excerpt in r["excerpts"][:1]:
            print(f"    {excerpt[:120]}...")
        print()


def cmd_modules(args):
    """List all modules."""
    client = FrootAI()
    modules = client.list_modules()
    print(f"\n  FrootAI Knowledge Modules ({len(modules)} total)\n")
    for m in modules:
        size_kb = m["content_length"] // 1024
        print(f"  {m['emoji']} {m['id']} {m['title']} ({m['layer']}, {size_kb}KB)")
    print()


def cmd_glossary(args):
    """Search glossary terms."""
    client = FrootAI()
    if args.term:
        result = client.lookup_term(args.term)
        if result:
            print(f"\n  {result['term']}")
            print(f"  {result['definition']}")
            print(f"  Source: {result['source_module']} — {result['source_title']}\n")
        else:
            results = client.search_glossary(args.term, max_results=5)
            if results:
                print(f"\n  No exact match. Similar terms:\n")
                for r in results:
                    print(f"  {r['term']}: {r['definition'][:80]}...")
            else:
                print(f"\n  Term '{args.term}' not found.\n")
    else:
        print(f"\n  Glossary: {client.glossary_count} terms")
        print("  Use: frootai glossary <term>\n")


def cmd_cost(args):
    """Estimate costs for a play."""
    client = FrootAI()
    result = client.estimate_cost(args.play, args.scale)
    if "error" in result:
        print(f"\n  {result['error']}")
        print("  Available plays: " + ", ".join(
            f"{p.id}-{p.name.lower().replace(' ', '-')}" for p in SolutionPlay.ready()
        ))
        print()
        return
    print(f"\n  Cost Estimate: Play {result['play']} ({result['scale']} scale)")
    print(f"  Monthly Total: ${result['monthly_total']:,} {result['currency']}\n")
    for svc, cost in result["breakdown"].items():
        print(f"    {svc:<30} ${cost:>6,}")
    print()


def main():
    """Entry point for `frootai` Python CLI."""
    parser = argparse.ArgumentParser(
        prog="frootai",
        description="FrootAI — The open glue for AI architecture",
        epilog="Website: https://frootai.dev",
    )
    parser.add_argument("-v", "--version", action="version", version=f"frootai {__version__}")
    sub = parser.add_subparsers(dest="command")

    # plays
    p_plays = sub.add_parser("plays", help="List solution plays")
    p_plays.add_argument("--layer", help="Filter by FROOT layer (F, R, O_ORCH, O_OPS, T)")
    p_plays.add_argument("--ready", action="store_true", help="Show only production-ready plays")

    # search
    p_search = sub.add_parser("search", help="Search knowledge base")
    p_search.add_argument("query", help="Search query")
    p_search.add_argument("--limit", type=int, default=5, help="Max results (default: 5)")

    # modules
    sub.add_parser("modules", help="List all knowledge modules")

    # glossary
    p_glossary = sub.add_parser("glossary", help="Look up a glossary term")
    p_glossary.add_argument("term", nargs="?", help="Term to look up")

    # cost
    p_cost = sub.add_parser("cost", help="Estimate Azure costs for a play")
    p_cost.add_argument("play", help="Play ID (e.g. 01-enterprise-rag)")
    p_cost.add_argument("--scale", default="dev", choices=["dev", "prod"], help="Scale tier")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        return

    commands = {
        "plays": cmd_plays,
        "search": cmd_search,
        "modules": cmd_modules,
        "glossary": cmd_glossary,
        "cost": cmd_cost,
    }
    commands[args.command](args)


if __name__ == "__main__":
    main()
