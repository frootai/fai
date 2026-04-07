#!/usr/bin/env node
/** Sprint 3 — Final push to 200+ agents */
const { writeFileSync, existsSync } = require('fs');
const { join } = require('path');
const D = join(__dirname, '..', 'agents');
let c = 0;
function mk(n,d,w) {
  const f=join(D,`${n}.agent.md`);
  if(existsSync(f))return;
  writeFileSync(f,`---\ndescription: "${d}"\nname: "${n.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')}"\nwaf:\n${w.map(v=>`  - "${v}"`).join('\n')}\n---\n\n# ${n.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')}\n\nYou are a FrootAI specialist. ${d}\n`);
  c++;
}
// TDD agents
mk('frootai-tdd-red','TDD Red phase — write failing tests from requirements before any implementation.',['reliability']);
mk('frootai-tdd-green','TDD Green phase — minimal implementation to make failing tests pass.',['reliability']);
mk('frootai-tdd-refactor','TDD Refactor phase — improve code quality while keeping all tests green.',['reliability','performance-efficiency']);
// Polyglot test agents
mk('frootai-test-planner','Test planning specialist — organizes tests by priority, identifies coverage gaps, designs test strategy.',['reliability','operational-excellence']);
mk('frootai-test-generator','Test generation specialist — creates unit, integration, and E2E tests across Python, TypeScript, C#.',['reliability']);
mk('frootai-test-runner','Test execution specialist — runs test suites, interprets results, identifies flaky tests.',['reliability','operational-excellence']);
// Additional Azure services
mk('frootai-azure-storage-expert','Azure Storage specialist — Blob lifecycle, ADLS Gen2, Queue/Table, private endpoints, SAS tokens.',['security','cost-optimization']);
mk('frootai-azure-networking-expert','Azure networking specialist — VNets, NSGs, Private Link, Front Door, Application Gateway, DNS.',['security','reliability']);
mk('frootai-azure-identity-expert','Azure identity specialist — Entra ID, Managed Identity, Conditional Access, PIM, RBAC best practices.',['security','operational-excellence']);
mk('frootai-azure-policy-expert','Azure Policy specialist — built-in policies, custom definitions, compliance scanning, remediation tasks.',['security','operational-excellence']);
mk('frootai-azure-devops-expert','Azure DevOps specialist — pipelines, boards, repos, artifacts, and integration with GitHub Actions.',['operational-excellence','reliability']);
mk('frootai-azure-logic-apps-expert','Azure Logic Apps specialist — workflow automation, 1400+ connectors, WDL, enterprise integration.',['operational-excellence','reliability']);
mk('frootai-azure-event-hubs-expert','Azure Event Hubs specialist — real-time streaming, Kafka compatibility, partition strategy for AI data.',['performance-efficiency','reliability']);
mk('frootai-azure-service-bus-expert','Azure Service Bus specialist — queues, topics, dead-letter, session-based messaging for agent orchestration.',['reliability','performance-efficiency']);
mk('frootai-azure-cdn-expert','Azure CDN/Front Door specialist — global content delivery, caching rules, WAF integration, edge optimization.',['performance-efficiency','security']);
mk('frootai-azure-sql-expert','Azure SQL specialist — Hyperscale, serverless, geo-replication, intelligent performance tuning.',['performance-efficiency','reliability','cost-optimization']);
// Additional MCP language experts  
mk('frootai-rust-mcp-expert','Rust MCP server specialist — rmcp SDK, tokio async, proc macros, serde, high-performance tool serving.',['performance-efficiency','security']);
mk('frootai-java-mcp-expert','Java MCP server specialist — official SDK, reactive streams, Spring Boot integration, enterprise service.',['reliability','security']);
mk('frootai-kotlin-mcp-expert','Kotlin MCP server specialist — coroutines, Ktor, Gradle, data classes for concise tool definitions.',['performance-efficiency','reliability']);
mk('frootai-go-mcp-expert','Go MCP server specialist — go-sdk/mcp, struct-based I/O, context handling, minimal-dependency servers.',['performance-efficiency','reliability']);
mk('frootai-ruby-mcp-expert','Ruby MCP server specialist — mcp gem, block DSL, Rails integration, idiomatic Ruby tool design.',['reliability']);
mk('frootai-swift-mcp-expert','Swift MCP server specialist — actors, Codable, async/await, Apple platform integration.',['reliability','performance-efficiency']);
mk('frootai-php-mcp-expert','PHP MCP server specialist — attributes, PSR standards, Composer, typed properties for tool schemas.',['reliability','security']);
// Planning/Architecture agents
mk('frootai-specification-writer','Specification writer — generates AI-ready specs with requirements, evaluation criteria, WAF alignment.',['operational-excellence']);
mk('frootai-adr-writer','Architecture Decision Record writer — documents decisions with context, alternatives, consequences.',['operational-excellence']);
mk('frootai-epic-breakdown-expert','Epic breakdown specialist — decomposes large features into implementable stories with acceptance criteria.',['operational-excellence']);
mk('frootai-prd-writer','Product Requirements Document writer — user needs, success metrics, constraints, and AI-specific requirements.',['operational-excellence','responsible-ai']);
mk('frootai-code-reviewer','Code review specialist — SOLID principles, clean code, design patterns, anti-pattern detection across languages.',['reliability','security']);
mk('frootai-tech-debt-analyst','Tech debt analyst — identifies, quantifies, and prioritizes technical debt with remediation plans.',['operational-excellence','reliability']);
mk('frootai-mentoring-agent','Developer mentoring specialist — explains concepts Socratically, guides learning, provides constructive feedback.',['responsible-ai']);
mk('frootai-debug-expert','Systematic debugging specialist — root cause analysis, reproduce-isolate-fix methodology, stack trace interpretation.',['reliability','operational-excellence']);
mk('frootai-refactoring-expert','Code refactoring specialist — extract method, reduce complexity, improve testability while maintaining behavior.',['reliability','performance-efficiency']);
// Misc specialists
mk('frootai-markdown-expert','Markdown specialist — CommonMark, GFM, accessibility, content structure, documentation formatting.',['operational-excellence']);
mk('frootai-mermaid-diagram-expert','Mermaid diagram specialist — flowcharts, sequence diagrams, architecture diagrams, entity relationships.',['operational-excellence']);
mk('frootai-git-workflow-expert','Git workflow specialist — branching strategies, conventional commits, rebasing, merge conflict resolution.',['operational-excellence']);
mk('frootai-cicd-pipeline-expert','CI/CD pipeline specialist — GitHub Actions, Azure Pipelines, multi-stage deployments, quality gates.',['operational-excellence','reliability']);

console.log(`Created: ${c} new agents`);
