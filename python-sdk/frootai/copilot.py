"""FrootAI Copilot SDK Patterns — Session management, error handling, and MCP integration.

Provides Pythonic wrappers around the GitHub Copilot SDK for building
agentic applications within the FAI ecosystem. Each pattern is a reusable
class that integrates with FrootAI's evaluation, knowledge, and hooks.

Usage:
    from frootai.copilot import CopilotSession, CopilotError, RetryConfig

    # Single session with error handling
    async with CopilotSession(system_prompt="You are a RAG expert") as session:
        response = await session.send("Explain hybrid search", timeout=30)

    # Multiple parallel sessions
    sessions = CopilotSession.create_pool(3, system_prompt="Analyze code")
    results = await CopilotSession.run_parallel(sessions, prompts)
"""

import asyncio
import json
import time
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Optional


# ── Error Types ──────────────────────────────────────────────────────────────

class CopilotError(Exception):
    """Base error for Copilot SDK operations."""
    pass

class CopilotTimeoutError(CopilotError):
    """Operation exceeded the configured timeout."""
    def __init__(self, timeout: float, operation: str = "send"):
        self.timeout = timeout
        self.operation = operation
        super().__init__(f"{operation} timed out after {timeout}s")

class CopilotRateLimitError(CopilotError):
    """API rate limit exceeded — retryable."""
    def __init__(self, retry_after: float = 1.0):
        self.retry_after = retry_after
        super().__init__(f"Rate limited, retry after {retry_after}s")

class CopilotContentFilterError(CopilotError):
    """Content was blocked by safety filters — NOT retryable."""
    pass

class CopilotConnectionError(CopilotError):
    """Connection to Copilot daemon failed."""
    pass


# ── Retry Configuration ─────────────────────────────────────────────────────

@dataclass
class RetryConfig:
    """Retry configuration with exponential backoff.
    
    Usage:
        config = RetryConfig(max_attempts=3, base_delay=1.0, max_delay=30.0)
    """
    max_attempts: int = 3
    base_delay: float = 1.0
    max_delay: float = 30.0
    retryable_errors: tuple = (CopilotTimeoutError, CopilotRateLimitError, CopilotConnectionError)

    def delay_for_attempt(self, attempt: int) -> float:
        """Calculate delay with exponential backoff + jitter."""
        import random
        delay = min(self.base_delay * (2 ** attempt), self.max_delay)
        jitter = random.uniform(0, delay * 0.1)
        return delay + jitter


# ── Event System ─────────────────────────────────────────────────────────────

@dataclass
class CopilotEvent:
    """Event emitted during Copilot operations."""
    type: str  # "message", "tool.start", "tool.end", "error", "idle"
    data: Any = None
    timestamp: float = field(default_factory=time.time)
    session_id: str = ""


class EventEmitter:
    """Simple event emitter for Copilot session lifecycle."""
    
    def __init__(self):
        self._handlers: dict[str, list[Callable]] = {}
    
    def on(self, event_type: str, handler: Callable) -> "EventEmitter":
        """Register an event handler. Returns self for chaining."""
        self._handlers.setdefault(event_type, []).append(handler)
        return self
    
    def off(self, event_type: str, handler: Callable) -> None:
        """Remove an event handler."""
        if event_type in self._handlers:
            self._handlers[event_type] = [h for h in self._handlers[event_type] if h is not handler]
    
    async def emit(self, event: CopilotEvent) -> None:
        """Emit an event to all registered handlers."""
        for handler in self._handlers.get(event.type, []):
            if asyncio.iscoroutinefunction(handler):
                await handler(event)
            else:
                handler(event)
        # Also fire wildcard handlers
        for handler in self._handlers.get("*", []):
            if asyncio.iscoroutinefunction(handler):
                await handler(event)
            else:
                handler(event)


# ── Session ─────────────────────────────────────────────────────────────────

@dataclass
class SessionMessage:
    """A message in a Copilot session."""
    role: str  # "user", "assistant", "system"
    content: str
    timestamp: float = field(default_factory=time.time)
    tool_calls: list[dict] = field(default_factory=list)


class CopilotSession:
    """A Copilot conversation session with FAI ecosystem integration.
    
    Supports:
    - System prompts with FROOT knowledge injection
    - Retry with exponential backoff
    - Timeout management
    - Event listeners (message, tool.start, tool.end, error, idle)
    - Session persistence (save/resume)
    - Parallel session pool
    
    Usage:
        # Context manager (auto-cleanup)
        async with CopilotSession(system_prompt="You are a RAG expert") as session:
            response = await session.send("Explain vector search")
        
        # Manual lifecycle
        session = CopilotSession(session_id="my-session")
        await session.start()
        response = await session.send("Hello")
        await session.stop()
    """
    
    def __init__(
        self,
        session_id: Optional[str] = None,
        system_prompt: Optional[str] = None,
        knowledge_modules: Optional[list[str]] = None,
        waf_pillars: Optional[list[str]] = None,
        retry: Optional[RetryConfig] = None,
        timeout: float = 60.0,
    ):
        self.session_id = session_id or f"fai-{uuid.uuid4().hex[:8]}"
        self.system_prompt = system_prompt
        self.knowledge_modules = knowledge_modules or []
        self.waf_pillars = waf_pillars or []
        self.retry = retry or RetryConfig()
        self.timeout = timeout
        self.events = EventEmitter()
        self.messages: list[SessionMessage] = []
        self._started = False
        self._start_time: Optional[float] = None
    
    async def __aenter__(self):
        await self.start()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.stop()
    
    async def start(self) -> None:
        """Start the Copilot session."""
        self._started = True
        self._start_time = time.time()
        
        # Inject system prompt with FAI context
        if self.system_prompt:
            system_msg = self._build_system_message()
            self.messages.append(SessionMessage(role="system", content=system_msg))
        
        await self.events.emit(CopilotEvent(
            type="session.start", session_id=self.session_id,
            data={"knowledge": self.knowledge_modules, "waf": self.waf_pillars}
        ))
    
    async def stop(self) -> None:
        """Stop the session and emit session.end event."""
        duration = time.time() - self._start_time if self._start_time else 0
        await self.events.emit(CopilotEvent(
            type="session.end", session_id=self.session_id,
            data={"messages": len(self.messages), "duration_s": round(duration, 2)}
        ))
        self._started = False
    
    async def send(self, prompt: str, timeout: Optional[float] = None) -> str:
        """Send a message and wait for response with retry logic.
        
        Args:
            prompt: The user message to send
            timeout: Override default timeout (seconds)
            
        Returns:
            The assistant's response text
            
        Raises:
            CopilotTimeoutError: If no response within timeout
            CopilotContentFilterError: If content is blocked (not retried)
            CopilotError: For other failures after all retries exhausted
        """
        effective_timeout = timeout or self.timeout
        self.messages.append(SessionMessage(role="user", content=prompt))
        
        last_error = None
        for attempt in range(self.retry.max_attempts):
            try:
                await self.events.emit(CopilotEvent(
                    type="send.start", session_id=self.session_id,
                    data={"attempt": attempt + 1, "prompt_length": len(prompt)}
                ))
                
                response = await asyncio.wait_for(
                    self._execute_send(prompt),
                    timeout=effective_timeout
                )
                
                self.messages.append(SessionMessage(role="assistant", content=response))
                await self.events.emit(CopilotEvent(
                    type="message", session_id=self.session_id,
                    data={"role": "assistant", "length": len(response)}
                ))
                return response
                
            except asyncio.TimeoutError:
                last_error = CopilotTimeoutError(effective_timeout)
                await self.events.emit(CopilotEvent(
                    type="error", session_id=self.session_id,
                    data={"error": "timeout", "attempt": attempt + 1}
                ))
            except CopilotContentFilterError:
                raise  # Don't retry content filter errors
            except CopilotError as e:
                last_error = e
                if not isinstance(e, self.retry.retryable_errors):
                    raise
                await self.events.emit(CopilotEvent(
                    type="error", session_id=self.session_id,
                    data={"error": str(e), "attempt": attempt + 1}
                ))
            
            # Wait before retry
            if attempt < self.retry.max_attempts - 1:
                delay = self.retry.delay_for_attempt(attempt)
                await asyncio.sleep(delay)
        
        raise last_error or CopilotError("All retry attempts failed")
    
    async def _execute_send(self, prompt: str) -> str:
        """Execute the actual send operation.
        
        Override this method to integrate with the actual Copilot SDK:
            from github_copilot_sdk import CopilotClient
            client = CopilotClient()
            response = await client.send_and_wait(prompt)
            return response.content
        
        Default implementation returns a placeholder for testing.
        """
        # Placeholder — in production, this calls the Copilot SDK
        await asyncio.sleep(0.01)  # Simulate API call
        return f"[FAI Response to: {prompt[:50]}...]"
    
    def _build_system_message(self) -> str:
        """Build system prompt with FAI context injection."""
        parts = [self.system_prompt]
        
        if self.knowledge_modules:
            parts.append(f"\nFROOT Knowledge Modules: {', '.join(self.knowledge_modules)}")
        
        if self.waf_pillars:
            parts.append(f"WAF Pillars: {', '.join(self.waf_pillars)}")
            parts.append("Apply these WAF pillars to all code suggestions and architecture recommendations.")
        
        parts.append("\nYou are operating within the FrootAI FAI ecosystem. "
                     "Primitives are connected via fai-manifest.json. "
                     "Every response should be Frootful — connected, evaluated, deterministic.")
        
        return "\n".join(parts)
    
    # ── Persistence ──────────────────────────────────────────────────────
    
    def save(self, path: str) -> None:
        """Save session state to disk for resuming later.
        
        Usage:
            session.save("sessions/my-session.json")
            # Later...
            session = CopilotSession.load("sessions/my-session.json")
        """
        state = {
            "session_id": self.session_id,
            "system_prompt": self.system_prompt,
            "knowledge_modules": self.knowledge_modules,
            "waf_pillars": self.waf_pillars,
            "messages": [
                {"role": m.role, "content": m.content, "timestamp": m.timestamp}
                for m in self.messages
            ],
            "created": self._start_time,
            "saved": time.time(),
        }
        
        filepath = Path(path)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w") as f:
            json.dump(state, f, indent=2)
    
    @classmethod
    def load(cls, path: str, **kwargs) -> "CopilotSession":
        """Load a persisted session from disk."""
        with open(path, "r") as f:
            state = json.load(f)
        
        session = cls(
            session_id=state["session_id"],
            system_prompt=state.get("system_prompt"),
            knowledge_modules=state.get("knowledge_modules", []),
            waf_pillars=state.get("waf_pillars", []),
            **kwargs
        )
        session.messages = [
            SessionMessage(role=m["role"], content=m["content"], timestamp=m["timestamp"])
            for m in state.get("messages", [])
        ]
        session._start_time = state.get("created")
        session._started = True
        return session
    
    # ── Parallel Sessions ────────────────────────────────────────────────
    
    @staticmethod
    def create_pool(
        count: int,
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> list["CopilotSession"]:
        """Create a pool of parallel sessions with isolated contexts.
        
        Usage:
            sessions = CopilotSession.create_pool(3, system_prompt="Analyze code")
        """
        return [
            CopilotSession(
                session_id=f"fai-pool-{i+1}-{uuid.uuid4().hex[:4]}",
                system_prompt=system_prompt,
                **kwargs
            )
            for i in range(count)
        ]
    
    @staticmethod
    async def run_parallel(
        sessions: list["CopilotSession"],
        prompts: list[str],
    ) -> list[str]:
        """Run prompts across parallel sessions concurrently.
        
        Args:
            sessions: Pool of CopilotSession instances
            prompts: List of prompts (matched 1:1 with sessions, or round-robin if fewer sessions)
            
        Returns:
            List of responses in the same order as prompts
        """
        async def _run_one(session: "CopilotSession", prompt: str) -> str:
            async with session:
                return await session.send(prompt)
        
        tasks = []
        for i, prompt in enumerate(prompts):
            session = sessions[i % len(sessions)]
            tasks.append(_run_one(session, prompt))
        
        return await asyncio.gather(*tasks)
