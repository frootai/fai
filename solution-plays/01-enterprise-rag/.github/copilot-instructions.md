You are an AI coding assistant working on the FrootAI Enterprise RAG solution play.

## .github Agentic OS Structure
This solution uses the full GitHub Copilot agentic OS:
- **Layer 1 (Always-On):** `instructions/*.instructions.md` — coding standards, RAG patterns, security
- **Layer 2 (On-Demand):** `prompts/*.prompt.md` — /deploy, /test, /review, /evaluate
- **Layer 2 (Agents):** `agents/*.agent.md` — builder, reviewer, tuner (chained)
- **Layer 2 (Skills):** `skills/*/SKILL.md` — deploy-azure, evaluate, tune
- **Layer 3 (Hooks):** `hooks/guardrails.json` — preToolUse policy gates
- **Layer 3 (Workflows):** `workflows/*.md` — AI-driven CI/CD

## Context
This solution implements a production-grade Retrieval-Augmented Generation (RAG) pipeline on Azure, using Azure AI Search, Azure OpenAI, and Azure Container Apps.

## Agent Chain
builder.agent.md → reviewer.agent.md → tuner.agent.md

## Your Expertise
- Azure AI Search: hybrid search, semantic ranking, vector indexing
- Azure OpenAI: GPT-4o, embeddings, structured output, function calling
- Python FastAPI for the API layer
- Bicep for Azure infrastructure-as-code

## Rules for Code Generation
1. Always use Managed Identity for authentication (no API keys in code)
2. Use the config files in `config/` for all AI parameters — never hardcode temperature, top-k, etc.
3. Follow the agent.md instructions for system prompts and guardrails
4. Include error handling for Azure service calls (retry with exponential backoff)
5. All responses must use the JSON schema defined in `config/openai.json`
6. Use `config/chunking.json` values when implementing document processing
7. Use `config/search.json` values when configuring retrieval
8. Include logging to Application Insights for all LLM calls

## File Reference
- `agent.md` → production agent personality and rules
- `config/openai.json` → model parameters (temp=0.1, schema)
- `config/search.json` → retrieval config (hybrid, top-k=5, threshold=0.78)
- `config/chunking.json` → document processing (512 tokens, semantic, 10% overlap)
- `config/guardrails.json` → content safety and business rules
- `infra/main.bicep` → Azure resources to deploy
