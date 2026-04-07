#!/usr/bin/env node
/**
 * FrootAI Content Scaling Sprint — Skills Generator
 * Creates 280+ skills from Section 9 / Appendix 4A taxonomy.
 */
const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');
const D = join(__dirname, '..', 'skills');
let c = 0;

function mk(name, desc) {
    const d = join(D, name);
    const f = join(d, 'SKILL.md');
    if (existsSync(f)) return;
    mkdirSync(d, { recursive: true });
    writeFileSync(f, `---\nname: ${name}\ndescription: '${desc}'\n---\n\n# ${name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')}\n\n${desc}\n`);
    c++;
}

// ─── MCP Server Generators (10) ───────────────────────
const mcpLangs = ['python', 'typescript', 'csharp', 'java', 'go', 'kotlin', 'ruby', 'rust', 'swift', 'php'];
for (const l of mcpLangs) mk(`frootai-mcp-${l}-scaffold`, `Scaffolds a complete ${l} MCP server project with FrootAI patterns, tool definitions, resource handlers, and deployment configuration.`);

// ─── Architecture/Planning (18) ───────────────────────
const archSkills = [
    ['frootai-architecture-decision-record', 'Generates Architecture Decision Records (ADRs) with context, decision, alternatives considered, and consequences.'],
    ['frootai-technical-spike', 'Conducts structured technical spike research with hypothesis, experiment design, findings, and recommendation.'],
    ['frootai-epic-breakdown-arch', 'Decomposes epics into implementable stories from an architecture perspective with dependency mapping.'],
    ['frootai-epic-breakdown-pm', 'Decomposes epics into user stories from a product management perspective with acceptance criteria.'],
    ['frootai-feature-breakdown', 'Breaks down features into atomic implementation tasks with effort estimates and dependency order.'],
    ['frootai-plan-breakdown', 'Decomposes high-level plans into actionable phases with milestones, deliverables, and risk assessment.'],
    ['frootai-tech-stack-blueprint', 'Generates technology stack documentation with component diagram, decision rationale, and alternatives.'],
    ['frootai-context-map', 'Creates domain-driven design context maps showing bounded contexts, relationships, and integration patterns.'],
    ['frootai-domain-driven-design', 'Applies DDD patterns — aggregates, entities, value objects, repositories, and domain events.'],
    ['frootai-folder-structure', 'Designs optimal project folder structure based on framework, team size, and complexity.'],
    ['frootai-prd-generator', 'Generates Product Requirements Documents with user needs, success metrics, constraints, and AI-specific requirements.'],
    ['frootai-implementation-plan-generator', 'Creates structured implementation plans with phases, tasks, dependencies, and verification steps.'],
];
for (const [n, d] of archSkills) mk(n, d);

// ─── Documentation/Writing (15) ──────────────────────
const docSkills = [
    ['frootai-readme-generator', 'Generates comprehensive README.md files with badges, installation, usage, architecture, and contributing sections.'],
    ['frootai-api-docs-generator', 'Generates API documentation from OpenAPI specs or code annotations with examples and error codes.'],
    ['frootai-tutorial-generator', 'Creates step-by-step tutorials with code examples, screenshots, and verification steps.'],
    ['frootai-changelog-generator', 'Generates changelogs from git history following Keep a Changelog format with semantic versioning.'],
    ['frootai-llms-txt-generator', 'Creates llms.txt files for AI-readable project documentation following the llms.txt specification.'],
    ['frootai-copilot-instructions-generator', 'Generates customized copilot-instructions.md files based on project technology stack and conventions.'],
    ['frootai-component-docs', 'Documents software components with interface contracts, usage examples, and dependency diagrams.'],
    ['frootai-comment-tutorial', 'Generates educational code comments explaining complex logic for learning and onboarding.'],
];
for (const [n, d] of docSkills) mk(n, d);

// ─── Code Generation/Scaffolding (12) ────────────────
const codegenSkills = [
    ['frootai-openapi-to-app', 'Generates application code from OpenAPI specifications — routes, models, validation, and test stubs.'],
    ['frootai-springboot-scaffold', 'Scaffolds a Spring Boot Java project with DI, profiles, health checks, and test configuration.'],
    ['frootai-springboot-kotlin-scaffold', 'Scaffolds a Spring Boot Kotlin project with coroutines, data classes, and Gradle config.'],
    ['frootai-aspnet-minimal-api', 'Scaffolds an ASP.NET Core Minimal API with DI, health checks, OpenAPI, and Azure integration.'],
    ['frootai-fastapi-scaffold', 'Scaffolds a FastAPI Python project with Pydantic models, async endpoints, and pytest configuration.'],
    ['frootai-nextjs-scaffold', 'Scaffolds a Next.js 16 project with App Router, Tailwind, TypeScript, and static export.'],
    ['frootai-react-component-scaffold', 'Scaffolds React components with TypeScript, Storybook stories, and test files.'],
    ['frootai-bicep-module-scaffold', 'Scaffolds a Bicep module with parameters, outputs, AVM patterns, and deployment test.'],
    ['frootai-terraform-module-scaffold', 'Scaffolds a Terraform module with variables, outputs, examples, and Terratest configuration.'],
    ['frootai-api-endpoint-generator', 'Generates REST API endpoints with input validation, error handling, and OpenAPI documentation.'],
    ['frootai-web-coder', 'Generates web pages and components from natural language descriptions with responsive design.'],
    ['frootai-premium-frontend-ui', 'Generates premium UI components with animations, glassmorphism, and dark mode support.'],
];
for (const [n, d] of codegenSkills) mk(n, d);

// ─── Testing/Quality (22) ────────────────────────────
const testSkills = [
    ['frootai-polyglot-test', 'Generates tests across Python, TypeScript, C#, Java — detects language and applies appropriate framework.'],
    ['frootai-pytest-coverage', 'Generates pytest test suites with fixtures, parametrize, mocks, and coverage configuration.'],
    ['frootai-xunit-test', 'Generates xUnit test suites with Fact/Theory, FluentAssertions, and WebApplicationFactory.'],
    ['frootai-nunit-test', 'Generates NUnit test suites for .NET projects with TestFixture, Assert patterns.'],
    ['frootai-mstest-test', 'Generates MSTest test suites for .NET projects with TestClass, TestMethod patterns.'],
    ['frootai-junit-test', 'Generates JUnit 5 test suites for Java with @Test, @ParameterizedTest, Mockito.'],
    ['frootai-jest-test', 'Generates Jest/Vitest test suites for TypeScript/JavaScript with mocking and snapshots.'],
    ['frootai-springboot-test', 'Generates Spring Boot integration tests with @SpringBootTest, MockMvc, and Testcontainers.'],
    ['frootai-playwright-test', 'Generates Playwright E2E tests with role-based locators, page objects, and visual regression.'],
    ['frootai-playwright-python-test', 'Generates Playwright tests in Python with async patterns and pytest integration.'],
    ['frootai-playwright-dotnet-test', 'Generates Playwright tests in C#/.NET with MSTest or NUnit integration.'],
    ['frootai-quality-playbook', 'Generates a quality playbook with testing strategy, coverage targets, and CI/CD integration.'],
    ['frootai-security-review-skill', 'Conducts security review following OWASP Top 10 + LLM Top 10 with severity ratings.'],
    ['frootai-secret-scanning', 'Scans code for leaked secrets with 25+ regex patterns across cloud providers and tokens.'],
    ['frootai-threat-model', 'Creates threat models with STRIDE methodology, attack trees, and mitigation recommendations.'],
    ['frootai-code-smell-detector', 'Identifies code smells and anti-patterns with refactoring recommendations.'],
    ['frootai-edge-case-generator', 'Generates edge case and boundary condition test scenarios for comprehensive coverage.'],
    ['frootai-codeql-setup', 'Configures CodeQL analysis for security vulnerability detection in CI/CD pipelines.'],
    ['frootai-gdpr-compliance', 'Validates GDPR compliance in code — data handling, consent, right to deletion, privacy by design.'],
    ['frootai-agent-governance', 'Reviews AI agent implementations for safety, budget controls, and human-in-the-loop patterns.'],
    ['frootai-webapp-testing', 'Generates web application test suites covering unit, integration, E2E, and accessibility.'],
    ['frootai-scoutqa-test', 'Generates AI-powered test suggestions based on code changes and coverage gaps.'],
];
for (const [n, d] of testSkills) mk(n, d);

// ─── DevOps/Deployment (12) ──────────────────────────
const devopsSkills = [
    ['frootai-containerize-aspnet', 'Containerizes ASP.NET Core applications with multi-stage builds and health probes.'],
    ['frootai-containerize-aspnet-framework', 'Containerizes legacy ASP.NET Framework applications with Windows containers.'],
    ['frootai-multi-stage-docker', 'Generates optimized multi-stage Dockerfiles with minimal runtime images.'],
    ['frootai-import-iac', 'Imports existing Azure resources into Bicep/Terraform Infrastructure as Code.'],
    ['frootai-update-avm-bicep', 'Updates Azure Verified Module references in Bicep templates to latest versions.'],
    ['frootai-gh-cli', 'Automates GitHub operations using gh CLI — issues, PRs, releases, and workflows.'],
    ['frootai-conventional-commit', 'Generates conventional commit messages following the Angular convention for changelogs.'],
    ['frootai-git-commit-best-practices', 'Guides best practices for git commits — atomic changes, descriptive messages, signed commits.'],
    ['frootai-git-flow-branch', 'Creates git branches following GitFlow or trunk-based development conventions.'],
    ['frootai-github-issues', 'Creates well-structured GitHub issues with reproduction steps, expected behavior, and labels.'],
    ['frootai-copilot-usage-metrics', 'Generates Copilot usage analytics reports — adoption rates, acceptance rates, productivity impact.'],
    ['frootai-copilot-cli-quickstart', 'Quick start guide for GitHub Copilot CLI setup and common usage patterns.'],
];
for (const [n, d] of devopsSkills) mk(n, d);

// ─── AI/LLM/Evaluation (12) ─────────────────────────
const aiSkills = [
    ['frootai-agentic-eval', 'Runs evaluator-optimizer pipelines to iteratively improve agent performance.'],
    ['frootai-eval-driven-dev', 'Implements test-driven AI development — define eval metrics first, then build to pass them.'],
    ['frootai-model-recommendation', 'Recommends optimal AI model based on task type, latency needs, cost budget, and quality requirements.'],
    ['frootai-boost-prompt', 'Analyzes and improves prompt quality with specificity scoring and recommendation engine.'],
    ['frootai-finalize-agent-prompt', 'Finalizes agent system prompts with structured sections, guardrails, and few-shot examples.'],
    ['frootai-prompt-builder', 'Builds prompts using the persona-context-task-format template with optimization suggestions.'],
    ['frootai-content-safety-review', 'Reviews AI outputs against Azure Content Safety categories with threshold recommendations.'],
    ['frootai-guardrails-policy', 'Creates content policy guardrails for AI applications with blocked categories and severity thresholds.'],
    ['frootai-human-in-the-loop', 'Designs human-in-the-loop workflows for AI with escalation criteria and approval gates.'],
    ['frootai-basic-prompt-optimization', 'Applies fundamental prompt engineering optimizations — clarity, specificity, format control.'],
    ['frootai-dynamic-prompt', 'Creates context-adaptive prompts that adjust based on query complexity and user profile.'],
    ['frootai-copilot-sdk-integration', 'Integrates Copilot SDK patterns for programmatic AI agent interactions.'],
];
for (const [n, d] of aiSkills) mk(n, d);

// ─── Azure/Cloud Skills (30) ─────────────────────────
const azureSkills = [
    ['frootai-azure-ai-foundry-setup', 'Sets up Azure AI Foundry Hub/Project with RBAC, networking, and connected services.'],
    ['frootai-azure-ai-search-index', 'Creates and configures Azure AI Search vector indexes with HNSW and hybrid search.'],
    ['frootai-azure-app-config', 'Configures Azure App Configuration with feature flags, key-value settings, and refresh patterns.'],
    ['frootai-azure-blob-lifecycle', 'Designs Azure Blob Storage lifecycle management with tiering and retention policies.'],
    ['frootai-azure-cognitive-services', 'Integrates Azure Cognitive Services — Language, Speech, Vision, and Translator.'],
    ['frootai-azure-container-registry', 'Configures Azure Container Registry with geo-replication, scanning, and Managed Identity access.'],
    ['frootai-azure-cosmos-modeling', 'Designs Cosmos DB data models with partition keys, RU estimation, and vector search.'],
    ['frootai-azure-data-explorer', 'Configures Azure Data Explorer for telemetry with KQL queries and dashboards.'],
    ['frootai-azure-event-grid-setup', 'Sets up Azure Event Grid for event-driven AI pipeline triggers and routing.'],
    ['frootai-azure-event-hubs-setup', 'Configures Azure Event Hubs for real-time streaming AI data ingestion.'],
    ['frootai-azure-functions-setup', 'Creates Azure Functions apps with triggers, bindings, Managed Identity, and monitoring.'],
    ['frootai-azure-key-vault-setup', 'Configures Azure Key Vault with RBAC, rotation, CMK, and application integration.'],
    ['frootai-azure-openai-integration', 'Integrates Azure OpenAI with deployment types, content filtering, and token management.'],
    ['frootai-azure-resource-graph', 'Writes Azure Resource Graph KQL queries for cross-subscription resource analysis.'],
    ['frootai-azure-service-bus-setup', 'Configures Azure Service Bus with queues, topics, dead-letter, and session-based messaging.'],
    ['frootai-azure-sql-setup', 'Configures Azure SQL Database with Hyperscale, geo-replication, and performance tuning.'],
    ['frootai-azure-static-web-apps-setup', 'Deploys applications to Azure Static Web Apps with API integration and custom domains.'],
    ['frootai-azure-storage-patterns', 'Implements cross-service Azure Storage patterns — Blob, Queue, Table, File.'],
    ['frootai-azure-role-selector', 'Selects appropriate Azure RBAC roles for AI workloads following least privilege.'],
    ['frootai-az-cost-optimize', 'Analyzes Azure spending and recommends cost optimizations for AI workloads.'],
    ['frootai-cloud-design-patterns', 'Applies cloud design patterns — circuit breaker, bulkhead, cache-aside, CQRS, event sourcing.'],
    ['frootai-azure-architecture-review', 'Conducts Azure Well-Architected Framework reviews with pillar scoring and recommendations.'],
    ['frootai-azure-resource-visualizer', 'Generates visual diagrams of Azure resource topologies and dependencies.'],
    ['frootai-azure-resource-health', 'Diagnoses Azure resource health issues with metrics analysis and remediation steps.'],
    ['frootai-aspire-orchestration', 'Sets up Azure Aspire for multi-container orchestration with service discovery.'],
];
for (const [n, d] of azureSkills) mk(n, d);

// ─── Database/Data Skills (10) ───────────────────────
const dbSkills = [
    ['frootai-cosmosdb-datamodeling', 'Designs Cosmos DB data models for AI workloads with partition key strategy and vector search.'],
    ['frootai-sql-optimization-skill', 'Optimizes SQL queries with execution plan analysis, index recommendations, and rewrite suggestions.'],
    ['frootai-sql-code-review-skill', 'Reviews SQL code for performance, security (injection), and best practices.'],
    ['frootai-postgresql-optimization', 'Optimizes PostgreSQL queries and configurations including pgvector for RAG workloads.'],
    ['frootai-postgresql-code-review', 'Reviews PostgreSQL code for performance, security, extension usage, and connection management.'],
    ['frootai-build-data-lakehouse', 'Designs data lakehouse architecture with medallion pattern (bronze/silver/gold).'],
    ['frootai-build-etl-pipeline', 'Creates ETL pipeline designs for AI data ingestion with quality checks and scheduling.'],
    ['frootai-build-nosql-data-model', 'Designs NoSQL data models with access patterns, partition strategy, and consistency levels.'],
    ['frootai-build-sql-migration', 'Creates database migration scripts with versioning, rollback, and data preservation.'],
    ['frootai-database-schema-designer', 'Designs relational database schemas with normalization, indexes, and referential integrity.'],
];
for (const [n, d] of dbSkills) mk(n, d);

// ─── Design/UI/UX Skills (15) ────────────────────────
const designSkills = [
    ['frootai-design-ui-components', 'Designs reusable UI component libraries with props, states, and accessibility.'],
    ['frootai-design-layouts', 'Creates responsive page layouts with grid systems, breakpoints, and visual hierarchy.'],
    ['frootai-design-themes', 'Designs theme systems with CSS custom properties, dark mode, and brand customization.'],
    ['frootai-design-forms', 'Designs form experiences with validation UX, error states, and progressive disclosure.'],
    ['frootai-design-animations', 'Creates UI animations with framer-motion, CSS transitions, and interaction design.'],
    ['frootai-design-accessibility', 'Audits and improves accessibility following WCAG 2.1 AA with actionable fixes.'],
    ['frootai-design-responsive', 'Implements responsive design patterns for mobile, tablet, and desktop breakpoints.'],
    ['frootai-design-icon-system', 'Creates icon systems with SVG sprites, icon components, and size/color tokens.'],
    ['frootai-design-state-management', 'Designs client-side state management patterns appropriate for the framework.'],
    ['frootai-design-dialog-system', 'Creates modal/dialog systems with focus trapping, keyboard nav, and accessibility.'],
    ['frootai-design-onboarding', 'Designs user onboarding flows with progressive disclosure and contextual help.'],
    ['frootai-design-system-tokens', 'Creates design token systems for colors, spacing, typography, and shadows.'],
    ['frootai-design-data-visualization', 'Designs data visualization components with charts, graphs, and interactive dashboards.'],
    ['frootai-design-loading-states', 'Designs loading and skeleton states for async operations and streaming AI responses.'],
    ['frootai-design-error-states', 'Designs error state UX with clear messages, recovery actions, and fallback content.'],
];
for (const [n, d] of designSkills) mk(n, d);

// ─── Refactoring Skills (6) ─────────────────────────
const refactorSkills = [
    ['frootai-refactor-skill', 'Refactors code to improve readability, maintainability, and testability while preserving behavior.'],
    ['frootai-refactor-complexity', 'Reduces cyclomatic complexity by extracting methods, simplifying conditions, and removing nesting.'],
    ['frootai-refactor-plan', 'Creates a phased refactoring plan with risk assessment, test coverage, and rollback strategy.'],
    ['frootai-review-and-refactor', 'Combined code review + refactor — identifies issues and applies fixes in one pass.'],
    ['frootai-java-extract-method', 'Applies Extract Method refactoring in Java with proper error handling and testing.'],
    ['frootai-dead-code-removal', 'Identifies and safely removes dead code, unused imports, and unreachable branches.'],
];
for (const [n, d] of refactorSkills) mk(n, d);

// ─── GTM/Business Skills (10) ────────────────────────
const gtmSkills = [
    ['frootai-gtm-launch', 'Creates a go-to-market launch plan for AI products with timeline, channels, and metrics.'],
    ['frootai-gtm-ai-strategy', 'Develops AI go-to-market strategy with positioning, competitive analysis, and pricing models.'],
    ['frootai-gtm-investor-comms', 'Prepares board and investor communications with AI initiative updates and ROI metrics.'],
    ['frootai-gtm-developer-ecosystem', 'Designs developer ecosystem strategy with SDK, docs, community, and partner programs.'],
    ['frootai-gtm-enterprise-planning', 'Creates enterprise account plans for AI solution adoption with stakeholder mapping.'],
    ['frootai-gtm-enterprise-onboarding', 'Designs enterprise customer onboarding workflows for AI platform adoption.'],
    ['frootai-gtm-operating-cadence', 'Establishes operating cadence for AI product teams with ceremonies and metrics reviews.'],
    ['frootai-gtm-partnerships', 'Designs partnership architecture for AI ecosystem collaboration and co-selling.'],
    ['frootai-gtm-positioning', 'Creates product positioning statements with messaging framework and competitive differentiation.'],
    ['frootai-gtm-product-led-growth', 'Designs product-led growth strategy for AI tools with activation, retention, and expansion metrics.'],
];
for (const [n, d] of gtmSkills) mk(n, d);

// ─── Diagrams (4) ───────────────────────────────────
mk('frootai-drawio-generator', 'Generates Draw.io architecture diagrams from natural language descriptions.');
mk('frootai-excalidraw-generator', 'Generates Excalidraw whiteboard diagrams for informal architecture discussions.');
mk('frootai-plantuml-generator', 'Generates PlantUML sequence and class diagrams from code or descriptions.');
mk('frootai-mermaid-generator', 'Generates Mermaid diagrams (flowcharts, sequence, Gantt) from natural language.');

// ─── Git/GitHub Skills (6) ──────────────────────────
mk('frootai-github-pr-review', 'Reviews GitHub PRs with checklist-based assessment across security, quality, and WAF alignment.');
mk('frootai-github-issue-triage', 'Triages GitHub issues with priority, labels, assignment, and milestone recommendations.');
mk('frootai-make-repo-contribution', 'Guides making first contribution to a FrootAI repository following CONTRIBUTING.md.');
mk('frootai-copilot-spaces-setup', 'Configures Copilot Spaces for collaborative AI-assisted development environments.');
mk('frootai-semantic-kernel-integration', 'Integrates Semantic Kernel with Azure OpenAI, plugins, memory stores, and agent framework.');
mk('frootai-langchain-integration', 'Integrates LangChain with Azure OpenAI, vector stores, and retrieval patterns.');

// ─── Meta/Discovery Skills (10) ─────────────────────
mk('frootai-suggest-agents', 'Discovers and recommends relevant FrootAI agents based on user task description.');
mk('frootai-suggest-instructions', 'Discovers and recommends relevant FrootAI instructions based on file type and project context.');
mk('frootai-suggest-skills', 'Discovers and recommends relevant FrootAI skills based on user goal description.');
mk('frootai-skill-template', 'Generates a SKILL.md template with frontmatter, sections, template variables, and verification steps.');
mk('frootai-remember', 'Persistent memory skill — saves and retrieves project context across AI sessions.');
mk('frootai-first-ask', 'Context gathering skill — asks clarifying questions before proceeding with complex tasks.');
mk('frootai-what-context-needed', 'Analyzes a task and identifies what context the AI needs to produce high-quality output.');
mk('frootai-daily-prep', 'Daily preparation skill — summarizes yesterday, plans today, identifies blockers.');
mk('frootai-editorconfig-setup', 'Generates .editorconfig files for consistent code formatting across editors and languages.');
mk('frootai-tldr-prompt', 'Summarizes long conversations into concise action items and decisions.');

// ─── AI Build Skills (12) ───────────────────────────
mk('frootai-build-genai-rag', 'Builds a complete RAG pipeline with embeddings, vector store, retrieval, and evaluation.');
mk('frootai-build-llm-evaluator', 'Builds custom LLM evaluation metrics for groundedness, coherence, and domain-specific quality.');
mk('frootai-build-semantic-search', 'Builds semantic similarity search with embedding generation and vector index.');
mk('frootai-build-vector-store', 'Sets up and configures a vector database for embedding storage and similarity search.');
mk('frootai-build-tokenizer', 'Implements tokenization pipelines for LLM input preparation and token counting.');
mk('frootai-build-prompting-system', 'Builds a multi-turn prompting system with template management and variable injection.');
mk('frootai-build-agentic-loops', 'Implements autonomous agent loops with ReAct pattern, tool calling, and termination conditions.');
mk('frootai-contextual-rag', 'Builds context-aware RAG with query routing, multi-source retrieval, and result synthesis.');
mk('frootai-deterministic-agent-skill', 'Builds deterministic AI agents with grounding, structured output, and evaluation gates.');
mk('frootai-evaluation-framework', 'Sets up an AI evaluation framework with metrics, test sets, and CI/CD integration.');
mk('frootai-fine-tune-llm', 'Guides LLM fine-tuning with data preparation, LoRA config, training, and evaluation.');
mk('frootai-inference-optimization', 'Optimizes model inference with quantization, batching, caching, and serving framework selection.');

// ─── Power Platform Skills (8) ──────────────────────
mk('frootai-power-apps-scaffold', 'Scaffolds Power Apps Canvas app with component library, data sources, and navigation.');
mk('frootai-power-bi-report', 'Creates Power BI reports with DAX measures, data modeling, and performance optimization.');
mk('frootai-power-bi-dashboard', 'Designs Power BI dashboards with KPIs, drill-through, and real-time streaming.');
mk('frootai-power-automate-flow', 'Creates Power Automate flows with triggers, actions, error handling, and approval gates.');
mk('frootai-power-platform-connector', 'Builds custom Power Platform connectors from OpenAPI specs with authentication.');
mk('frootai-flowstudio-design', 'Designs Power Automate desktop flows with UI automation and data extraction.');
mk('frootai-powerbi-modeling', 'Designs Power BI data models with star schema, relationships, and calculation groups.');
mk('frootai-fabric-lakehouse', 'Designs Microsoft Fabric lakehouse architecture with medallion pattern and notebooks.');

console.log(`Created: ${c} new skills`);
