# Architecture — Play 16: Copilot Teams Extension

## Overview

AI-powered Microsoft Teams bot that brings GPT-4o intelligence directly into the Teams workspace. Users interact via natural language in channels, group chats, or 1:1 conversations. The bot retrieves context from organizational knowledge bases via Azure AI Search, maintains multi-turn conversation history in Cosmos DB, and returns grounded answers with adaptive card formatting.

## Architecture Diagram

```mermaid
graph TB
    subgraph Teams Platform
        Users[Teams Users<br/>Channels · Chat · 1:1]
        Teams[Microsoft Teams<br/>Bot Framework Channel]
    end

    subgraph Bot Backend
        AppSvc[App Service<br/>Bot Webhook · Message Handler]
        BotSvc[Bot Service<br/>Channel Registration · Auth]
    end

    subgraph AI Layer
        OpenAI[Azure OpenAI<br/>GPT-4o · Conversational AI]
        Search[Azure AI Search<br/>Knowledge Base · Internal Docs]
    end

    subgraph Data Layer
        Cosmos[Cosmos DB<br/>Conversation History · Preferences]
        Graph[Microsoft Graph<br/>User Profile · Calendar · Files]
    end

    subgraph Security
        KV[Key Vault<br/>Bot Secrets · API Keys]
        MI[Managed Identity<br/>Zero-secret Auth]
        Entra[Microsoft Entra ID<br/>SSO · User Auth]
    end

    subgraph Monitoring
        AppInsights[Application Insights<br/>Conversation Metrics · Engagement]
    end

    Users -->|Message| Teams
    Teams -->|Webhook| BotSvc
    BotSvc -->|Route| AppSvc
    AppSvc -->|Query| Search
    Search -->|Context| OpenAI
    OpenAI -->|Response| AppSvc
    AppSvc -->|Adaptive Card| Teams
    AppSvc -->|Save Turn| Cosmos
    AppSvc -->|User Data| Graph
    AppSvc -->|Auth| MI
    MI -->|Secrets| KV
    BotSvc -->|SSO| Entra
    AppSvc -->|Telemetry| AppInsights

    style Users fill:#3b82f6,color:#fff,stroke:#2563eb
    style Teams fill:#3b82f6,color:#fff,stroke:#2563eb
    style AppSvc fill:#3b82f6,color:#fff,stroke:#2563eb
    style BotSvc fill:#3b82f6,color:#fff,stroke:#2563eb
    style OpenAI fill:#10b981,color:#fff,stroke:#059669
    style Search fill:#10b981,color:#fff,stroke:#059669
    style Cosmos fill:#f59e0b,color:#fff,stroke:#d97706
    style Graph fill:#f59e0b,color:#fff,stroke:#d97706
    style KV fill:#7c3aed,color:#fff,stroke:#6d28d9
    style MI fill:#7c3aed,color:#fff,stroke:#6d28d9
    style Entra fill:#7c3aed,color:#fff,stroke:#6d28d9
    style AppInsights fill:#0ea5e9,color:#fff,stroke:#0284c7
```

## Data Flow

1. **User Message**: User sends a message in Teams channel or chat → Teams platform delivers message to Bot Service via webhook → Bot Service routes to App Service backend
2. **Context Retrieval**: App Service loads conversation history from Cosmos DB (last N turns) → Queries Azure AI Search for relevant knowledge base documents → Optionally calls Microsoft Graph for user-specific context (calendar, files)
3. **AI Generation**: Conversation history + retrieved context + system prompt sent to GPT-4o → Model generates grounded response with citations → Content Safety filter validates output
4. **Response Delivery**: App Service formats response as Teams adaptive card (rich formatting, action buttons, citations) → Bot Service sends back through Teams channel → Conversation turn saved to Cosmos DB
5. **Proactive Messaging**: Scheduled triggers or external events can push proactive notifications → Bot Service sends adaptive cards to channels or individual users → Engagement tracked in Application Insights
6. **Analytics**: All conversations logged to Application Insights → Metrics: response time, user satisfaction (thumbs up/down), topics, escalation rate

## Service Roles

| Service | Layer | Role |
|---------|-------|------|
| Azure Bot Service | Platform | Teams channel registration, message routing, auth |
| App Service | Compute | Bot webhook, message handler, card rendering |
| Azure OpenAI (GPT-4o) | AI | Conversational AI, summarization, task completion |
| Azure AI Search | AI | Knowledge base retrieval, grounded answers |
| Cosmos DB | Data | Conversation history, user preferences, session state |
| Microsoft Graph | Data | User profiles, calendar, files, organizational data |
| Key Vault | Security | Bot secrets, OpenAI keys, Graph credentials |
| Microsoft Entra ID | Security | SSO, user authentication, tenant isolation |
| Application Insights | Monitoring | Conversation analytics, engagement, quality metrics |

## Security Architecture

- **SSO via Entra ID**: Users authenticate through Teams SSO — no separate login required
- **Tenant Isolation**: Bot scoped to organization's tenant — no cross-tenant data leakage
- **Managed Identity**: App Service authenticates to OpenAI, Search, Cosmos via MI — no secrets in code
- **Content Filtering**: All AI responses pass through Azure Content Safety before delivery to users
- **Data Residency**: Conversation data stored in tenant's preferred Azure region
- **Audit Logging**: All bot interactions logged with user UPN, timestamps, and response metadata

## Scaling

| Metric | Dev | Production | Enterprise |
|--------|-----|-----------|------------|
| Active users | 10 | 500-2,000 | 10,000+ |
| Messages/day | 100 | 5,000 | 50,000+ |
| Concurrent conversations | 5 | 50-100 | 500+ |
| Knowledge base docs | 100 | 5,000 | 50,000+ |
| Conversation history depth | 5 turns | 20 turns | 50 turns |
| App Service instances | 1 | 2-3 | 5-10 |
