"""FrootAI SDK — Programmatic access to the FrootAI ecosystem.

From the Roots to the Fruits. It's simply Frootful.

Usage:
    from frootai import FrootAI, SolutionPlay, Evaluator

    client = FrootAI()
    results = client.search("RAG architecture")
    module = client.get_module("R2")
    cost = client.estimate_cost("01-enterprise-rag", scale="dev")

    plays = SolutionPlay.all()
    play = SolutionPlay.get("03")

    evaluator = Evaluator()
    evaluator.check_thresholds({"groundedness": 4.2, "relevance": 3.8})

    # Copilot SDK patterns (async)
    from frootai.copilot import CopilotSession
    async with CopilotSession(system_prompt="RAG expert") as session:
        response = await session.send("Explain hybrid search")

    # Agentic loop (async)
    from frootai.agentic_loop import AgenticLoop, Task, run_plan
"""

__version__ = "3.3.0"
__author__ = "Pavleen Bali"

from frootai.client import FrootAI
from frootai.plays import SolutionPlay
from frootai.evaluation import Evaluator

__all__ = [
    "FrootAI",
    "SolutionPlay",
    "Evaluator",
    "__version__",
    # Copilot SDK patterns (import separately for async usage)
    # from frootai.copilot import CopilotSession, CopilotError, RetryConfig
    # from frootai.agentic_loop import AgenticLoop, Task, run_plan
]
