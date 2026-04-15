# Architecture — Play 23: Browser Automation Agent

## Overview

AI-driven browser automation agent that uses vision models to understand web pages and execute multi-step workflows. The agent captures screenshots, analyzes page structure via GPT-4o Vision, plans actions (click, type, navigate), and executes them through Playwright in a headless browser. Supports complex workflows like form filling, data extraction, testing, and RPA-style task automation across any web application.

## Architecture Diagram

```mermaid
graph TB
    subgraph User Layer
        User[User / API Client]
    end

    subgraph Agent Orchestrator
        API[Container Apps<br/>Agent Loop · Action Planner]
        TaskQ[Cosmos DB<br/>Task Queue · Action History]
    end

    subgraph Browser Runtime
        Browser[Container Apps<br/>Headless Chromium · Playwright]
        Screenshots[Blob Storage<br/>Screenshots · Page Snapshots]
    end

    subgraph Vision & Reasoning
        Vision[Azure OpenAI — GPT-4o Vision<br/>Screenshot Analysis · DOM Reasoning]
        Planner[Azure OpenAI — GPT-4o<br/>Action Planning · Error Recovery]
    end

    subgraph Security
        KV[Key Vault<br/>Site Credentials · API Keys]
        MI[Managed Identity<br/>Zero-secret Auth]
    end

    subgraph Monitoring
        AppInsights[Application Insights<br/>Action Traces · Vision Latency]
        LogAnalytics[Log Analytics<br/>Browser Logs · Failure Diagnostics]
    end

    User -->|Task: "Fill form on site X"| API
    API -->|Step 1: Navigate| Browser
    Browser -->|Screenshot| Screenshots
    Screenshots -->|Image| Vision
    Vision -->|Page Understanding| API
    API -->|Step 2: Plan Actions| Planner
    Planner -->|Click / Type / Scroll| API
    API -->|Execute Action| Browser
    Browser -->|Updated Screenshot| Screenshots
    API -->|Loop until complete| API
    API -->|Result + Evidence| User
    API <-->|State| TaskQ
    MI -->|Secrets| KV
    API -->|Traces| AppInsights
    Browser -->|Logs| LogAnalytics

    style User fill:#3b82f6,color:#fff,stroke:#2563eb
    style API fill:#3b82f6,color:#fff,stroke:#2563eb
    style TaskQ fill:#f59e0b,color:#fff,stroke:#d97706
    style Browser fill:#3b82f6,color:#fff,stroke:#2563eb
    style Screenshots fill:#f59e0b,color:#fff,stroke:#d97706
    style Vision fill:#10b981,color:#fff,stroke:#059669
    style Planner fill:#10b981,color:#fff,stroke:#059669
    style KV fill:#7c3aed,color:#fff,stroke:#6d28d9
    style MI fill:#7c3aed,color:#fff,stroke:#6d28d9
    style AppInsights fill:#0ea5e9,color:#fff,stroke:#0284c7
    style LogAnalytics fill:#0ea5e9,color:#fff,stroke:#0284c7
```

## Data Flow

1. **Task Intake**: User submits a browser automation task (e.g., "Fill the invoice form on portal.example.com") → Agent orchestrator creates a session in Cosmos DB → Headless browser navigates to target URL
2. **Screenshot Capture**: Playwright captures a full-page screenshot → Image stored in Blob Storage → Screenshot sent to GPT-4o Vision for page understanding — identifies interactive elements, form fields, buttons, navigation structure
3. **Action Planning**: Vision analysis returned to the agent orchestrator → GPT-4o plans next action based on task goal and current page state (e.g., "Click the 'New Invoice' button at coordinates [320, 180]") → Action expressed as Playwright commands
4. **Execution Loop**: Agent executes the planned action via Playwright (click, type, scroll, navigate) → New screenshot captured → Vision model re-analyzes the updated page → Loop continues until task is complete or max steps reached (default: 20 steps)
5. **Result & Audit**: Final page state captured as evidence screenshot → Task result (success/failure + extracted data) returned to user → Full action trace (screenshot + action + reasoning per step) logged to Application Insights → Session state persisted for replay or debugging

## Service Roles

| Service | Layer | Role |
|---------|-------|------|
| Container Apps (Orchestrator) | Compute | Agent loop, action planning, step coordination |
| Container Apps (Browser) | Compute | Headless Chromium via Playwright, action execution |
| Azure OpenAI (GPT-4o Vision) | AI | Screenshot analysis, element identification, page understanding |
| Azure OpenAI (GPT-4o) | AI | Action planning, error recovery, task decomposition |
| Blob Storage | Storage | Screenshot archive, page snapshots, audit evidence |
| Cosmos DB | Data | Task queue, action history, agent session state |
| Key Vault | Security | Target site credentials, authentication tokens |
| Managed Identity | Security | Zero-secret inter-service auth |
| Application Insights | Monitoring | Step-level action tracing, vision API latency |
| Log Analytics | Monitoring | Browser container logs, Playwright debug traces |

## Security Architecture

- **Managed Identity**: All Azure service calls via managed identity — no hardcoded credentials
- **Credential Isolation**: Target site credentials stored in Key Vault, fetched just-in-time, never cached in memory beyond session scope
- **Browser Sandboxing**: Headless browser runs in isolated container — no access to host filesystem or network beyond allowed domains
- **Domain Allowlisting**: Browser restricted to pre-configured target domains — prevents agent from navigating to unauthorized sites
- **Screenshot Redaction**: PII detection on screenshots before storage — sensitive fields masked in audit trail
- **Session Scoping**: Each automation task runs in an isolated browser context — no cookie or state leakage between sessions
- **Rate Limiting**: Max actions per minute per session to prevent runaway automation

## Scaling

| Metric | Dev | Production | Enterprise |
|--------|-----|-----------|------------|
| Concurrent browser sessions | 2-3 | 20-50 | 200+ |
| Actions per task (avg) | 5-8 | 8-15 | 10-20 |
| Screenshots per task | 6-9 | 9-16 | 11-21 |
| Vision API calls per task | 6-9 | 9-16 | 11-21 |
| Browser container replicas | 1 | 2-5 | 5-20 |
| P95 response time per action | 5s | 4s | 3s |
| Storage per month | 5GB | 200GB | 1TB+ |
