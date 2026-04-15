# Architecture — Play 21: Agentic RAG — Autonomous Multi-Step Retrieval

## Overview

Autonomous RAG agent that iteratively retrieves, evaluates, and refines its knowledge before generating an answer. Unlike single-shot RAG (Play 01), the agent plans multi-step retrieval strategies — decomposing complex questions, reformulating queries when initial results are insufficient, cross-referencing across document collections, and self-evaluating answer completeness. Built on Azure OpenAI function calling with AI Search as the primary retrieval tool.

## Architecture Diagram

```mermaid
graph TB
    subgraph User Layer
        User[User / Client App]
    end

    subgraph Agent Orchestrator
        API[Container Apps<br/>Agent Loop · State Machine]
        Memory[Cosmos DB<br/>Conversation Memory · Reasoning Trace]
    end

    subgraph Reasoning Engine
        OpenAI[Azure OpenAI — GPT-4o<br/>Planning · Synthesis · Self-Eval]
    end

    subgraph Retrieval Tools
        Search[Azure AI Search<br/>Hybrid: BM25 + Vector + Semantic]
        Blob[Blob Storage<br/>Document Corpus · Chunked Artifacts]
    end

    subgraph Safety
        ContentSafety[Content Safety<br/>Per-Step Moderation]
    end

    subgraph Security
        KV[Key Vault<br/>API Keys · Admin Keys]
        MI[Managed Identity<br/>Zero-secret Auth]
    end

    subgraph Monitoring
        AppInsights[Application Insights<br/>Agent Traces · Token Spend · Step Visibility]
    end

    User -->|Complex Question| API
    API -->|Step 1: Plan| OpenAI
    OpenAI -->|Tool Call: Search| API
    API -->|Query| Search
    Search -->|Results| API
    API -->|Step 2: Evaluate| OpenAI
    OpenAI -->|Reformulate or Synthesize| API
    API -->|Step N: Final Answer| User
    API <-->|State| Memory
    Blob -->|Indexer| Search
    API -->|Moderate| ContentSafety
    API -->|Auth| MI
    MI -->|Secrets| KV
    API -->|Traces| AppInsights

    style User fill:#3b82f6,color:#fff,stroke:#2563eb
    style API fill:#06b6d4,color:#fff,stroke:#0891b2
    style Memory fill:#f59e0b,color:#fff,stroke:#d97706
    style OpenAI fill:#10b981,color:#fff,stroke:#059669
    style Search fill:#10b981,color:#fff,stroke:#059669
    style Blob fill:#f59e0b,color:#fff,stroke:#d97706
    style ContentSafety fill:#10b981,color:#fff,stroke:#059669
    style KV fill:#7c3aed,color:#fff,stroke:#6d28d9
    style MI fill:#7c3aed,color:#fff,stroke:#6d28d9
    style AppInsights fill:#0ea5e9,color:#fff,stroke:#0284c7
```

## Data Flow

1. **Question Intake**: User submits a complex question → Container Apps agent receives request, creates session in Cosmos DB → Agent state machine initializes with question + conversation history
2. **Planning**: Agent sends question to GPT-4o with system prompt containing available tools → GPT-4o decomposes question into sub-queries (e.g., "What is X?" + "How does X relate to Y?") → Returns a retrieval plan as structured function calls
3. **Iterative Retrieval**: For each sub-query, agent calls AI Search with reformulated query → Hybrid search (BM25 + vector + semantic reranking) returns top-5 chunks → Agent evaluates result relevance (score 1-5) → If relevance < 3, agent reformulates query and retries (max 2 retries per sub-query)
4. **Synthesis & Self-Evaluation**: After all sub-queries resolved, agent sends accumulated context to GPT-4o for final synthesis → GPT-4o generates answer with citations → Agent self-evaluates: "Does this answer fully address the original question?" → If incomplete, agent identifies gaps and executes additional retrieval steps
5. **Safety & Response**: Each synthesis step passes through Content Safety → Final answer with citations returned to user → Full reasoning trace (plan → retrievals → evaluations → synthesis) logged to Application Insights → Session state persisted to Cosmos DB for follow-up questions

## Service Roles

| Service | Layer | Role |
|---------|-------|------|
| Container Apps | Orchestration | Agent loop, state machine, tool execution, streaming |
| Azure OpenAI (GPT-4o) | Reasoning | Query planning, synthesis, self-evaluation via function calling |
| Azure AI Search | Retrieval | Hybrid search with iterative query reformulation |
| Cosmos DB | Persistence | Agent session state, conversation memory, reasoning traces |
| Blob Storage | Data | Document corpus, source material for search indexing |
| Content Safety | Safety | Per-step moderation — validates intermediate and final outputs |
| Key Vault | Security | API keys, search admin keys, agent configuration secrets |
| Application Insights | Monitoring | Step-level tracing, token cost per query, retrieval quality |

## Security Architecture

- **Managed Identity**: Agent-to-Search and Agent-to-OpenAI via managed identity — zero secrets in orchestrator code
- **Key Vault**: AI Search admin keys and backup OpenAI keys stored with automatic rotation
- **Per-Step Moderation**: Content Safety validates each intermediate synthesis, not just final output — prevents reasoning chain attacks
- **Tool Sandboxing**: Agent can only call registered tools (search, synthesize) — no arbitrary code execution
- **Session Isolation**: Each agent session scoped to user — no cross-session memory leakage
- **Prompt Injection Defense**: System prompts include injection-resistant framing — user input treated as data, not instructions
- **Private Endpoints**: AI Search and OpenAI behind private endpoints in production

## Scaling

| Metric | Dev | Production | Enterprise |
|--------|-----|-----------|------------|
| Concurrent agent sessions | 5 | 50-200 | 1,000+ |
| Reasoning steps/query | 2-3 | 3-5 | 5-8 |
| Tokens/query (avg) | 2K | 5-8K | 10-15K |
| Search queries/user query | 2-4 | 3-6 | 5-10 |
| Documents indexed | 1K | 100K | 1M+ |
| Container replicas | 1 | 2-4 | 5-15 |
| P95 response time | 10s | 8s | 6s |
