"""FrootAI Agentic Loop — Autonomous task execution with disk-based shared state.

Implements the Ralph Loop pattern adapted for the FAI ecosystem:
- Plan on disk (implementation plan as shared state)
- Fresh context per iteration (prevents hallucination accumulation)
- Evaluation as backpressure (must pass quality gates before next task)
- Multi-agent dispatch (route tasks to specialized agents)

Usage:
    from frootai.agentic_loop import AgenticLoop, Task

    loop = AgenticLoop(plan_file="spec/plan.md")
    loop.add_task(Task("Create RAG pipeline", agent="builder"))
    loop.add_task(Task("Write integration tests", agent="tester"))
    
    await loop.run(
        on_task_complete=lambda t: print(f"Done: {t.title}"),
        validation_cmd="npm run validate:primitives"
    )
"""

import asyncio
import json
import re
import time
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Optional

from frootai.copilot import CopilotSession, CopilotError, RetryConfig


class TaskStatus(Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class Task:
    """A single task in an agentic execution plan."""
    title: str
    agent: str = "builder"  # builder, reviewer, tuner, or any custom agent
    description: str = ""
    status: TaskStatus = TaskStatus.PENDING
    result: str = ""
    started_at: Optional[float] = None
    completed_at: Optional[float] = None
    attempt: int = 0
    max_attempts: int = 3

    @property
    def duration_s(self) -> float:
        if self.started_at and self.completed_at:
            return round(self.completed_at - self.started_at, 2)
        return 0.0


@dataclass
class LoopConfig:
    """Configuration for the agentic loop."""
    max_iterations: int = 50
    validation_cmd: Optional[str] = None
    require_validation: bool = True
    timeout_per_task: float = 120.0
    knowledge_modules: list[str] = field(default_factory=list)
    waf_pillars: list[str] = field(default_factory=list)
    retry: RetryConfig = field(default_factory=RetryConfig)


class AgenticLoop:
    """Autonomous agentic task loop with FAI ecosystem integration.
    
    The loop follows the Ralph Loop pattern:
    1. Read plan from disk
    2. Pick next pending task
    3. Start fresh CopilotSession (avoids context pollution)
    4. Execute task with appropriate agent
    5. Run validation (backpressure)
    6. Mark task complete in plan
    7. Repeat until all tasks done
    
    State is persisted to disk after each iteration, making it
    crash-resilient and resumable.
    
    Usage:
        loop = AgenticLoop(plan_file="spec/plan.md")
        loop.add_task(Task("Scaffold project structure", agent="builder"))
        loop.add_task(Task("Review security", agent="reviewer"))
        loop.add_task(Task("Optimize config", agent="tuner"))
        
        await loop.run(validation_cmd="npm run validate:primitives")
    """
    
    def __init__(
        self,
        plan_file: str = "spec/implementation-plan.json",
        config: Optional[LoopConfig] = None,
    ):
        self.plan_file = Path(plan_file)
        self.config = config or LoopConfig()
        self.tasks: list[Task] = []
        self.iteration: int = 0
        self.log: list[dict] = []
        self._on_task_complete: Optional[Callable] = None
        self._on_task_failed: Optional[Callable] = None
        self._on_iteration: Optional[Callable] = None
        
        # Load existing plan if it exists
        if self.plan_file.exists():
            self._load_plan()
    
    def add_task(self, task: Task) -> "AgenticLoop":
        """Add a task to the plan. Returns self for chaining."""
        self.tasks.append(task)
        return self
    
    def add_tasks(self, tasks: list[Task]) -> "AgenticLoop":
        """Add multiple tasks. Returns self for chaining."""
        self.tasks.extend(tasks)
        return self
    
    @property
    def pending_tasks(self) -> list[Task]:
        return [t for t in self.tasks if t.status == TaskStatus.PENDING]
    
    @property
    def completed_tasks(self) -> list[Task]:
        return [t for t in self.tasks if t.status == TaskStatus.COMPLETED]
    
    @property
    def failed_tasks(self) -> list[Task]:
        return [t for t in self.tasks if t.status == TaskStatus.FAILED]
    
    @property
    def progress(self) -> float:
        if not self.tasks:
            return 0.0
        return len(self.completed_tasks) / len(self.tasks)
    
    async def run(
        self,
        validation_cmd: Optional[str] = None,
        on_task_complete: Optional[Callable] = None,
        on_task_failed: Optional[Callable] = None,
        on_iteration: Optional[Callable] = None,
    ) -> dict:
        """Execute the agentic loop until all tasks are done or max iterations reached.
        
        Args:
            validation_cmd: Shell command that must exit 0 before proceeding
            on_task_complete: Callback(task) when a task completes
            on_task_failed: Callback(task, error) when a task fails
            on_iteration: Callback(iteration, task) at start of each iteration
            
        Returns:
            Summary dict with counts and timing
        """
        self._on_task_complete = on_task_complete
        self._on_task_failed = on_task_failed
        self._on_iteration = on_iteration
        effective_validation = validation_cmd or self.config.validation_cmd
        
        start_time = time.time()
        
        for i in range(self.config.max_iterations):
            self.iteration = i + 1
            
            # Pick next task
            task = self._next_task()
            if task is None:
                break  # All done
            
            if self._on_iteration:
                self._on_iteration(self.iteration, task)
            
            # Execute with fresh session (Ralph Loop pattern)
            task.status = TaskStatus.IN_PROGRESS
            task.started_at = time.time()
            task.attempt += 1
            
            try:
                result = await self._execute_task(task)
                task.result = result
                
                # Validation backpressure
                if effective_validation and self.config.require_validation:
                    validation_passed = await self._run_validation(effective_validation)
                    if not validation_passed:
                        task.status = TaskStatus.FAILED
                        task.result += "\n[VALIDATION FAILED]"
                        if self._on_task_failed:
                            self._on_task_failed(task, "Validation failed")
                        self._log_iteration(task, "validation_failed")
                        self._save_plan()
                        continue
                
                task.status = TaskStatus.COMPLETED
                task.completed_at = time.time()
                if self._on_task_complete:
                    self._on_task_complete(task)
                self._log_iteration(task, "completed")
                
            except CopilotError as e:
                task.status = TaskStatus.FAILED if task.attempt >= task.max_attempts else TaskStatus.PENDING
                task.result = str(e)
                if self._on_task_failed:
                    self._on_task_failed(task, e)
                self._log_iteration(task, "failed")
            
            self._save_plan()
        
        duration = time.time() - start_time
        return {
            "total_tasks": len(self.tasks),
            "completed": len(self.completed_tasks),
            "failed": len(self.failed_tasks),
            "pending": len(self.pending_tasks),
            "iterations": self.iteration,
            "duration_s": round(duration, 2),
            "progress": f"{self.progress:.0%}",
        }
    
    async def _execute_task(self, task: Task) -> str:
        """Execute a single task with a fresh CopilotSession."""
        # Build agent-specific system prompt
        agent_prompts = {
            "builder": "You are a FrootAI builder agent. Implement the task with production-quality code.",
            "reviewer": "You are a FrootAI reviewer agent. Check WAF compliance, security, and code quality.",
            "tuner": "You are a FrootAI tuner agent. Optimize configuration, thresholds, and performance.",
            "tester": "You are a FrootAI test agent. Generate comprehensive tests with edge cases.",
        }
        
        system_prompt = agent_prompts.get(task.agent, f"You are a FrootAI {task.agent} agent.")
        
        async with CopilotSession(
            system_prompt=system_prompt,
            knowledge_modules=self.config.knowledge_modules,
            waf_pillars=self.config.waf_pillars,
            timeout=self.config.timeout_per_task,
            retry=self.config.retry,
        ) as session:
            # Build task prompt with plan context
            prompt = self._build_task_prompt(task)
            return await session.send(prompt)
    
    def _build_task_prompt(self, task: Task) -> str:
        """Build the prompt for a task, including plan context."""
        parts = [
            f"## Task: {task.title}",
        ]
        if task.description:
            parts.append(f"\n{task.description}")
        
        # Include plan progress as context
        completed = [t.title for t in self.completed_tasks]
        if completed:
            parts.append(f"\n### Already Completed:\n" + "\n".join(f"- ✅ {t}" for t in completed))
        
        remaining = [t.title for t in self.pending_tasks if t != task]
        if remaining:
            parts.append(f"\n### Still Pending:\n" + "\n".join(f"- ⬜ {t}" for t in remaining[:5]))
        
        parts.append("\n### Rules:\n"
                     "1. Focus ONLY on this specific task\n"
                     "2. Output production-quality code\n"
                     "3. Follow WAF pillars if specified\n"
                     "4. Be concise — no explanations unless asked")
        
        return "\n".join(parts)
    
    async def _run_validation(self, cmd: str) -> bool:
        """Run a validation command as backpressure."""
        try:
            proc = await asyncio.create_subprocess_shell(
                cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            _, _ = await asyncio.wait_for(proc.communicate(), timeout=60)
            return proc.returncode == 0
        except (asyncio.TimeoutError, Exception):
            return False
    
    def _next_task(self) -> Optional[Task]:
        """Get the next pending task, or None if all done."""
        for task in self.tasks:
            if task.status == TaskStatus.PENDING:
                return task
        return None
    
    def _log_iteration(self, task: Task, status: str) -> None:
        """Append to iteration log."""
        self.log.append({
            "iteration": self.iteration,
            "task": task.title,
            "agent": task.agent,
            "status": status,
            "attempt": task.attempt,
            "timestamp": time.time(),
        })
    
    def _save_plan(self) -> None:
        """Persist plan state to disk."""
        self.plan_file.parent.mkdir(parents=True, exist_ok=True)
        state = {
            "iteration": self.iteration,
            "tasks": [
                {
                    "title": t.title,
                    "agent": t.agent,
                    "description": t.description,
                    "status": t.status.value,
                    "result": t.result,
                    "attempt": t.attempt,
                    "started_at": t.started_at,
                    "completed_at": t.completed_at,
                }
                for t in self.tasks
            ],
            "log": self.log,
            "saved_at": time.time(),
        }
        with open(self.plan_file, "w") as f:
            json.dump(state, f, indent=2)
    
    def _load_plan(self) -> None:
        """Load plan state from disk (resume after crash)."""
        try:
            with open(self.plan_file, "r") as f:
                state = json.load(f)
            self.iteration = state.get("iteration", 0)
            self.log = state.get("log", [])
            self.tasks = [
                Task(
                    title=t["title"],
                    agent=t.get("agent", "builder"),
                    description=t.get("description", ""),
                    status=TaskStatus(t.get("status", "pending")),
                    result=t.get("result", ""),
                    attempt=t.get("attempt", 0),
                    started_at=t.get("started_at"),
                    completed_at=t.get("completed_at"),
                )
                for t in state.get("tasks", [])
            ]
        except (json.JSONDecodeError, KeyError):
            pass  # Start fresh if plan is corrupted


# ── Convenience function ─────────────────────────────────────────────────────

async def run_plan(
    tasks: list[dict],
    plan_file: str = "spec/plan.json",
    validation_cmd: Optional[str] = None,
    knowledge: Optional[list[str]] = None,
    waf: Optional[list[str]] = None,
) -> dict:
    """Quick way to run an agentic loop from a list of task dicts.
    
    Usage:
        from frootai.agentic_loop import run_plan
        
        result = await run_plan(
            tasks=[
                {"title": "Create API", "agent": "builder"},
                {"title": "Review security", "agent": "reviewer"},
                {"title": "Optimize perf", "agent": "tuner"},
            ],
            validation_cmd="npm run validate:primitives",
            knowledge=["R2-RAG-Architecture"],
            waf=["security", "reliability"],
        )
        print(result)  # {"completed": 3, "failed": 0, "progress": "100%"}
    """
    config = LoopConfig(
        knowledge_modules=knowledge or [],
        waf_pillars=waf or [],
        validation_cmd=validation_cmd,
    )
    
    loop = AgenticLoop(plan_file=plan_file, config=config)
    for t in tasks:
        loop.add_task(Task(
            title=t["title"],
            agent=t.get("agent", "builder"),
            description=t.get("description", ""),
        ))
    
    return await loop.run()
