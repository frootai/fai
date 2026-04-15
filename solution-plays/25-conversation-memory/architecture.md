# Architecture — Play 25: Tiered Conversation Memory

## Overview

Tiered conversation memory system that enables AI assistants to remember context across sessions. Memory is organized in three tiers: hot (Redis — last few turns, sub-ms), warm (Cosmos DB — full session history, entity store), and cold (AI Search — long-term semantic memory via vector search over conversation summaries). A background summarization pipeline compresses verbose conversation history into compact memory records, extracts entities and facts, and indexes them for future retrieval.

## Architecture Diagram

```mermaid
graph TB
    subgraph User Layer
        User[User / Chat Client]
    end

    subgraph Memory Orchestrator
        API[Container Apps<br/>Memory Manager · Tiered Retrieval]
    end

    subgraph Hot Memory — Milliseconds
        Redis[Azure Cache for Redis<br/>Last 5 Turns · Active Session · Entities]
    end

    subgraph Warm Memory — Sub-Second
        CosmosDB[Cosmos DB<br/>Full Session History · User Profile · Entity Store]
    end

    subgraph Cold Memory — Semantic Search
        AISearch[Azure AI Search<br/>Vector Index · Conversation Summaries · Facts]
    end

    subgraph AI Engine
        OpenAI[Azure OpenAI — GPT-4o<br/>Response Generation · Memory-Augmented Context]
        Summarizer[Azure OpenAI — GPT-4o-mini<br/>Summarization · Entity Extraction]
    end

    subgraph Security
        KV[Key Vault<br/>Encryption Keys · API Keys]
        MI[Managed Identity<br/>Zero-secret Auth]
    end

    subgraph Monitoring
        AppInsights[Application Insights<br/>Cache Hits · Memory Latency · Retrieval Quality]
        LogAnalytics[Log Analytics<br/>Memory Operations · Cache Evictions]
    end

    User -->|Message| API
    API -->|Check Hot| Redis
    Redis -->|Miss| API
    API -->|Check Warm| CosmosDB
    API -->|Semantic Recall| AISearch
    API -->|Context + Memory| OpenAI
    OpenAI -->|Response| API
    API -->|Store Turn| Redis
    API -->|Persist| CosmosDB
    API -->|Background| Summarizer
    Summarizer -->|Summary + Entities| AISearch
    API -->|Response| User
    MI -->|Secrets| KV
    API -->|Traces| AppInsights
    API -->|Logs| LogAnalytics

    style User fill:#3b82f6,color:#fff,stroke:#2563eb
    style API fill:#3b82f6,color:#fff,stroke:#2563eb
    style Redis fill:#f59e0b,color:#fff,stroke:#d97706
    style CosmosDB fill:#f59e0b,color:#fff,stroke:#d97706
    style AISearch fill:#10b981,color:#fff,stroke:#059669
    style OpenAI fill:#10b981,color:#fff,stroke:#059669
    style Summarizer fill:#10b981,color:#fff,stroke:#059669
    style KV fill:#7c3aed,color:#fff,stroke:#6d28d9
    style MI fill:#7c3aed,color:#fff,stroke:#6d28d9
    style AppInsights fill:#0ea5e9,color:#fff,stroke:#0284c7
    style LogAnalytics fill:#0ea5e9,color:#fff,stroke:#0284c7
```

## Data Flow

1. **Message Intake**: User sends a message → Memory orchestrator receives request → Checks Redis for hot context (last 5 turns + active entities) — sub-millisecond lookup
2. **Memory Retrieval**: If context insufficient, orchestrator queries Cosmos DB for full session history and user profile → For cross-session recall, performs vector search on AI Search index to find relevant conversation summaries and extracted facts from past sessions
3. **Context Assembly**: Orchestrator assembles a context window: hot turns (verbatim) + warm session summary + cold semantic matches (top-3 relevant memories) → Total context kept under token budget (default: 4K tokens for memory, 4K for current conversation)
4. **Response Generation**: Assembled context + current message sent to GPT-4o → Model generates response with awareness of past interactions → Response returned to user
5. **Memory Write-Back**: Current turn stored in Redis (hot) → Full conversation persisted to Cosmos DB (warm) → Background job: GPT-4o-mini summarizes every 10 turns into a compact memory record, extracts entities (people, dates, preferences), indexes summary + entities in AI Search (cold) → Redis cache evicts turns older than 5 to manage memory

## Service Roles

| Service | Layer | Role |
|---------|-------|------|
| Container Apps | Compute | Memory manager API, tiered retrieval orchestration |
| Azure Cache for Redis | Hot Memory | Last-5-turn cache, active session state, entity lookups |
| Cosmos DB | Warm Memory | Full conversation history, user profiles, entity store |
| Azure AI Search | Cold Memory | Long-term vector index over conversation summaries and facts |
| Azure OpenAI (GPT-4o) | AI | Memory-augmented response generation |
| Azure OpenAI (GPT-4o-mini) | AI | Background summarization, entity extraction |
| Key Vault | Security | Encryption keys for memory at rest, API keys |
| Managed Identity | Security | Zero-secret service-to-service auth |
| Application Insights | Monitoring | Cache hit rates, memory retrieval latency, tier usage |
| Log Analytics | Monitoring | Memory operations logging, cache eviction tracking |

## Security Architecture

- **Managed Identity**: All service-to-service auth via managed identity — no connection strings in code
- **Memory Encryption**: All memory tiers encrypted at rest (Azure default) + TLS in transit
- **User Isolation**: Memory partitioned by user ID — no cross-user memory leakage via partition keys in Cosmos DB and filtered indexes in AI Search
- **PII Handling**: Entity extraction identifies PII — tagged for compliance, excluded from long-term summaries on opt-out
- **TTL Policies**: Configurable memory retention — hot (session), warm (90 days default), cold (1 year default) — auto-purge on expiration
- **Right to Deletion**: API endpoint to purge all user memory across all tiers — Redis eviction + Cosmos DB delete + AI Search document removal
- **Key Vault**: Encryption keys and API secrets stored with automatic rotation

## Scaling

| Metric | Dev | Production | Enterprise |
|--------|-----|-----------|------------|
| Concurrent sessions | 5-10 | 200-500 | 2,000+ |
| Memory records per user | 50 | 500 | 5,000+ |
| Redis cache hit rate | 70% | 85% | 90%+ |
| Summarization jobs/hour | 10 | 200 | 2,000+ |
| AI Search index size | 100MB | 10GB | 100GB+ |
| Memory retrieval P95 | 50ms | 30ms | 20ms |
| Container replicas | 1 | 2-4 | 5-15 |
