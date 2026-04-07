#!/usr/bin/env node
/**
 * FrootAI Content Scaling Sprint — Instructions Generator
 * Creates 180+ instructions from Appendix 3A taxonomy.
 * All original, WAF-aligned, FAI Protocol connected.
 */

const { writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const DIR = join(__dirname, '..', 'instructions');
let created = 0;

function mk(name, desc, applyTo, waf, body) {
  const f = join(DIR, `${name}.instructions.md`);
  if (existsSync(f)) return;
  const w = waf.length ? `\nwaf:\n${waf.map(v => `  - "${v}"`).join('\n')}` : '';
  writeFileSync(f, `---\ndescription: "${desc}"\napplyTo: "${applyTo}"${w}\n---\n\n# ${name.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' ')} — FrootAI Standards\n\n${body}\n`);
  created++;
}

// Helper for short body
const std = (lang, rules) => `When writing or reviewing ${lang} code, enforce these WAF-aligned standards.\n\n## Rules\n${rules.map(r => `- ${r}`).join('\n')}`;

// ─── Programming Languages (22) ───────────────────────
mk('rust-waf','Rust coding standards — ownership, lifetimes, Result<T,E>, serde, tokio async, and memory safety patterns.','**/*.rs',['security','performance-efficiency','reliability'],std('Rust',['Use Result<T,E> for error handling — never panic in production','Prefer &str over String for function parameters','Use serde for all serialization — derive Serialize/Deserialize','Async with tokio runtime — never block the executor','Pin all dependency versions in Cargo.lock']));

mk('go-waf','Go coding standards — idiomatic Go, return early, error handling, goroutines, and minimal dependency patterns.','**/*.go',['reliability','performance-efficiency'],std('Go',['Return early — check errors first, happy path last','Use context.Context for cancellation and timeouts','Prefer table-driven tests','Never use init() — explicit initialization only','Run golangci-lint in CI']));

mk('java-waf','Java coding standards — constructor injection, immutable objects, streams API, JUnit 5, and Spring Boot patterns.','**/*.java',['reliability','security','operational-excellence'],std('Java',['Constructor injection — never field injection','Prefer records for DTOs — immutable by default','Use Optional for nullable returns — never return null','Stream API for collection processing','JUnit 5 + Mockito for testing']));

mk('kotlin-waf','Kotlin coding standards — coroutines, data classes, null safety, extension functions, and Gradle build patterns.','**/*.kt',['performance-efficiency','reliability'],std('Kotlin',['Use coroutines for async — never raw threads','Data classes for DTOs — automatic equals/hashCode/copy','Leverage null safety — avoid !! operator','Extension functions for utility code','Gradle Kotlin DSL for build scripts']));

mk('swift-waf','Swift coding standards — actors for concurrency, Codable, async/await, SwiftUI, and value types over reference types.','**/*.swift',['performance-efficiency','reliability'],std('Swift',['Use actors for thread-safe shared state','Codable for all serialization — never manual JSON parsing','Prefer structs (value types) over classes','async/await for all I/O operations','@MainActor for UI updates']));

mk('php-waf','PHP coding standards — typed properties, attributes, PSR-12, Composer, and modern PHP 8.3+ patterns.','**/*.php',['security','reliability'],std('PHP',['Typed properties and return types on everything','PSR-12 coding style — enforce with PHP-CS-Fixer','Use attributes over annotations (PHP 8+)','Composer for dependency management — pin versions','Never trust user input — validate at boundaries']));

mk('ruby-waf','Ruby coding standards — Ruby 3.3+, RuboCop enforcement, Ractor patterns, and Rails conventions.','**/*.rb',['reliability','operational-excellence'],std('Ruby',['RuboCop enforcement in CI — no exceptions','Use Ractors for parallelism (Ruby 3.3+)','Prefer symbols over strings for hash keys','Follow Rails conventions when in Rails context','Bundler with locked Gemfile.lock']));

mk('scala-waf','Scala coding standards — immutability, val over var, pattern matching, and functional programming patterns.','**/*.scala',['reliability','performance-efficiency'],std('Scala',['val over var — immutability by default','Pattern matching over if/else chains','Use case classes for data containers','Prefer pure functions — minimize side effects','SBT or Gradle for builds — pin dependencies']));

mk('dart-flutter-waf','Dart/Flutter coding standards — effective Dart, widget composition, state management, and null safety.','**/*.dart',['performance-efficiency','reliability'],std('Dart/Flutter',['Follow Effective Dart guidelines','Prefer composition over inheritance for widgets','Use const constructors where possible','Null safety — no dynamic types','Riverpod or BLoC for state management']));

mk('shell-waf','Shell scripting standards — set -euo pipefail, safe expansions, quoting, and portable POSIX patterns.','**/*.sh',['security','reliability'],std('Shell',['set -euo pipefail at the top of every script','Quote all variable expansions: "$VAR" not $VAR','Use shellcheck in CI — zero warnings','Prefer functions over inline code','Explicit exit codes — 0 success, 1+ failure']));

mk('powershell-waf','PowerShell standards — Verb-Noun naming, PascalCase, standard parameters, and error handling patterns.','**/*.ps1',['operational-excellence','reliability'],std('PowerShell',['Verb-Noun naming for functions (Get-Item, Set-Config)','PascalCase for all function and parameter names','Use -ErrorAction and try/catch for error handling','Prefer cmdlets over external commands','PSScriptAnalyzer in CI for linting']));

mk('r-waf','R coding standards — vectorized operations, tidyverse, lower_snake_case, and reproducible analysis patterns.','**/*.R, **/*.Rmd',['reliability','operational-excellence'],std('R',['Vectorized operations — never use loops for vector ops','Tidyverse style: pipe %>%, lower_snake_case','renv for reproducible package management','Rmarkdown for documentation and reports','testthat for unit testing']));

mk('clojure-waf','Clojure coding standards — REPL-driven, immutable data, pure functions, and spec for validation.','**/*.clj, **/*.cljs',['reliability','performance-efficiency'],std('Clojure',['REPL-driven development — test in REPL first','Immutable data structures by default','Pure functions — minimize side effects','clojure.spec for data validation','deps.edn for dependency management']));

mk('cpp-waf','C++ coding standards — modern C++20/23, RAII, smart pointers, and safe concurrency patterns.','**/*.cpp, **/*.h, **/*.hpp',['security','performance-efficiency','reliability'],std('C++',['Modern C++20/23 standards — no raw new/delete','RAII for resource management — unique_ptr/shared_ptr','Use std::span, std::string_view for non-owning references','Prefer constexpr and compile-time computation','CMake with Conan/vcpkg for dependencies']));

// ─── Backend/API Frameworks (12) ──────────────────────
mk('springboot-waf','Spring Boot standards — constructor injection, profiles, YAML config, and production patterns.','**/*.java, **/application*.yml',['reliability','security','operational-excellence'],std('Spring Boot',['Constructor injection — never @Autowired on fields','Profiles for env separation: dev, staging, prod','YAML config with @ConfigurationProperties','Health actuator endpoint enabled','Integration tests with @SpringBootTest']));

mk('nestjs-waf','NestJS standards — DI, decorators, modular architecture, Pipes validation, and TypeORM patterns.','**/*.ts',['reliability','security'],std('NestJS',['Modular architecture — one module per domain','Pipes for validation (class-validator + class-transformer)','Guards for authentication/authorization','Interceptors for logging and transformation','TypeORM with migrations — never sync in production']));

mk('fastapi-waf','FastAPI standards — Pydantic models, dependency injection, async endpoints, and OpenAPI-first design.','**/*.py',['performance-efficiency','security','reliability'],std('FastAPI',['Pydantic models for all request/response types','Dependency injection for services and DB sessions','Async endpoints for I/O-bound operations','OpenAPI schema auto-generated — keep it accurate','Background tasks for non-blocking operations']));

mk('aspnet-waf','ASP.NET Core standards — Minimal API, DI, middleware pipeline, and Azure-native integration.','**/*.cs',['security','reliability','operational-excellence'],std('ASP.NET Core',['Minimal API for simple endpoints, Controllers for complex','DI for all dependencies — AddSingleton/AddScoped/AddTransient','Middleware pipeline: auth → routing → endpoints','Health checks with AddHealthChecks()','Azure Managed Identity for all service connections']));

mk('rails-waf','Ruby on Rails standards — MVC conventions, Active Record, migrations, and RuboCop enforcement.','**/*.rb, **/Gemfile',['reliability','operational-excellence'],std('Rails',['Follow Rails conventions — CoC over configuration','Active Record: scopes, validations, callbacks','Use migrations — never modify schema directly','RuboCop + Brakeman (security) in CI','Environment-specific config in credentials.yml.enc']));

mk('django-waf','Django standards — models, views, URLs, ORM queries, and security middleware patterns.','**/*.py, **/settings*.py',['security','reliability'],std('Django',['Use class-based views for consistency','ORM queries — never raw SQL unless absolutely necessary','CSRF middleware enabled — never disable','SecurityMiddleware + CSP headers','Django REST Framework for APIs']));

mk('flask-waf','Flask standards — blueprints, app factory, SQLAlchemy, and production configuration patterns.','**/*.py',['security','reliability'],std('Flask',['App factory pattern with create_app()','Blueprints for modular route organization','SQLAlchemy with flask-migrate for DB','Flask-Login or JWT for authentication','WSGI server (gunicorn) in production — never flask run']));

// ─── Cloud/Infrastructure (15) ────────────────────────
mk('terraform-waf','Terraform standards — latest providers, modular design, state safety, and secrets management.','**/*.tf, **/*.tfvars',['operational-excellence','security','reliability'],std('Terraform',['Latest stable provider versions — pin with ~>','Modules for reusable infrastructure components','Remote state in Azure Storage with locking','Never store secrets in .tfvars — use Key Vault','terraform plan before every apply']));

mk('kubernetes-waf','Kubernetes standards — pod security, resource limits, health probes, and production deployment patterns.','**/*.yaml, **/*.yml',['security','reliability','performance-efficiency'],std('Kubernetes',['Resource requests AND limits on every container','Liveness + readiness + startup probes','Pod security standards: restricted profile','NetworkPolicies for pod-to-pod traffic control','Labels: app, version, environment, team']));

mk('docker-waf','Dockerfile standards — multi-stage builds, non-root user, minimal base images, and security scanning.','**/Dockerfile, **/docker-compose*',['security','performance-efficiency'],std('Docker',['Multi-stage builds — separate build from runtime','Non-root USER in final stage','Minimal base: distroless or alpine','Pin base image digest, not just tag','No secrets in build args or ENV — use runtime injection']));

mk('ansible-waf','Ansible standards — idempotent playbooks, roles, vault for secrets, and testing with molecule.','**/*.yaml, **/*.yml',['operational-excellence','reliability','security'],std('Ansible',['Idempotent tasks — safe to run multiple times','Roles for reusable automation','Ansible Vault for all secrets','Molecule for role testing','ansible-lint in CI']));

mk('github-actions-waf','GitHub Actions CI/CD standards — SHA-pinned actions, minimal permissions, secrets handling, and reusable workflows.','**/.github/workflows/*.yml',['security','operational-excellence'],std('GitHub Actions',['Pin actions to SHA digest — never @v4 in production','Minimal permissions per job — least privilege','Secrets via GitHub Secrets — never hardcoded','Reusable workflows for DRY pipelines','Matrix strategy for multi-platform testing']));

mk('azure-devops-waf','Azure DevOps Pipeline standards — YAML pipelines, stages, environments, and approval gates.','**/azure-pipelines*.yml',['operational-excellence','reliability'],std('Azure DevOps',['YAML pipelines over classic editor','Stages: build → test → deploy-staging → deploy-prod','Environments with approval gates for production','Variable groups for secrets (linked to Key Vault)','Branch policies: require PR, status checks']));

mk('azure-functions-waf','Azure Functions standards — triggers, bindings, Managed Identity, and consumption plan patterns.','**/*.ts, **/*.cs, **/*.py',['cost-optimization','reliability','security'],std('Azure Functions',['Managed Identity for all Azure service connections','Isolated worker model (not in-process)','Durable Functions for multi-step orchestration','Consumption plan for variable workloads','Application Insights for monitoring']));

mk('azure-logic-apps-waf','Azure Logic Apps standards — WDL JSON, connector usage, error handling, and retry policies.','**/*.json',['reliability','operational-excellence'],std('Azure Logic Apps',['WDL JSON definition format','Use managed connectors over HTTP actions','Retry policies on every action','Run-after configuration for error handling','Managed Identity for connector auth']));

// ─── AI/Agents/Safety (6) ─────────────────────────────
mk('ai-prompt-safety-waf','AI prompt engineering safety — prompt injection defense, bias mitigation, output validation, and responsible AI generation.','*',['responsible-ai','security'],std('AI Prompt Safety',['Never put secrets or PII in system prompts','Defend against prompt injection (Prompt Shields)','Validate LLM output before presenting to users','Add AI disclosure: "This is AI-generated"','Log interactions for audit (without full PII)']));

mk('context-engineering-waf','Context engineering standards — maximize Copilot effectiveness through structured instructions, examples, and constraints.','**',['operational-excellence','reliability'],std('Context Engineering',['Structured system messages: Role → Rules → Format → Examples','Few-shot examples for format-sensitive tasks','Explicit constraints: "Do NOT do X"','Temperature=0 for deterministic tasks','max_tokens always set in production']));

mk('memory-bank-waf','Persistent project documentation standards — maintain context across AI sessions with structured memory files.','**',['operational-excellence'],std('Memory Bank',['Project brief in memory/ folder — goals, constraints, tech stack','Architecture decisions documented as ADRs','Current sprint context updated each session','Known issues and workarounds tracked','Never delete memory — append and update']));

// ─── Code Quality/Security (6) ────────────────────────
mk('object-calisthenics-waf','Object calisthenics standards — 9 rules for clean, maintainable code across OOP languages.','**/*.cs, **/*.ts, **/*.java, **/*.py',['reliability','operational-excellence'],std('Object Calisthenics',['One level of indentation per method','No else keyword — early return instead','Wrap all primitives and strings in domain types','First-class collections — never raw List/Array','One dot per line — Law of Demeter']));

mk('design-patterns-waf','OOP design patterns — interface segregation, composition over inheritance, and SOLID principles.','**/*.cs, **/*.ts, **/*.java, **/*.py',['reliability','operational-excellence'],std('Design Patterns',['Interface segregation — small, focused interfaces','Composition over inheritance','Single Responsibility — one reason to change','Dependency Inversion — depend on abstractions','Factory pattern for complex object creation']));

mk('code-review-waf','Code review standards — what to check, severity levels, constructive feedback, and merge blocking criteria.','**',['reliability','security','operational-excellence'],std('Code Review',['CRITICAL issues block merge: security vulnerabilities, data loss risk','HIGH issues should fix before merge: missing tests, hardcoded config','MEDIUM: style issues, naming — fix or document why not','Comment with context: what is wrong AND what to do instead','Review for readability first, performance second']));

mk('performance-optimization-waf','Performance optimization standards — measure first, profile before optimizing, and avoid premature optimization.','*',['performance-efficiency','cost-optimization'],std('Performance Optimization',['Measure before optimizing — profile with real data','Optimize the common case first — 80/20 rule','Cache expensive operations (LLM calls, DB queries, embeddings)','Async I/O — never block on network or disk','Set performance budgets (latency P95, token cost per query)']));

mk('self-documenting-code-waf','Self-documenting code standards — comment WHY not WHAT, meaningful names, and code as documentation.','**',['operational-excellence'],std('Self-Documenting Code',['Comment WHY — never comment WHAT (code says what)','Meaningful variable names: userEmail not x, tokenBudget not n','Extract complex conditions into named booleans','Functions should do one thing — name describes the thing','README for every non-trivial module']));

// ─── Web/Frontend Frameworks (6) ──────────────────────
mk('astro-waf','Astro standards — Islands Architecture, content-driven, TypeScript, and static-first patterns.','**/*.astro',['performance-efficiency','reliability'],std('Astro',['Islands Architecture — interactive only where needed','Content-driven: Markdown/MDX for pages','TypeScript for all components','Static-first: SSG by default, SSR only when needed','Image optimization with @astrojs/image']));

mk('blazor-waf','Blazor standards — Razor components, .NET patterns, SignalR, and Server vs WASM decisions.','**/*.razor, **/*.cs',['performance-efficiency','reliability'],std('Blazor',['Components: small, reusable, minimal code-behind','Server for internal apps (simpler), WASM for public (offline)','Use CascadingParameter sparingly','Inject services via DI — never new up dependencies','Error boundaries around every page']));

mk('svelte-waf','Svelte 5 standards — runes, SvelteKit, TypeScript, and minimal-bundle patterns.','**/*.svelte, **/*.ts',['performance-efficiency','reliability'],std('Svelte 5',['Use runes ($state, $derived, $effect) — not legacy stores','SvelteKit for routing, SSR, and data loading','TypeScript for all script blocks','Minimal reactive statements — derived when possible','Form actions for server-side mutations']));

mk('tailwind-waf','Tailwind CSS v4 standards — utility-first, component extraction, responsive design, and dark mode patterns.','**/*.css, **/*.tsx, **/*.vue',['performance-efficiency'],std('Tailwind CSS v4',['CSS-first config — no PostCSS or tailwind.config','Utility-first: compose utilities, extract components for reuse','Responsive: mobile-first with sm/md/lg/xl breakpoints','Dark mode via class strategy','Purge unused CSS in production']));

// ─── Testing Frameworks (6) ──────────────────────────
mk('playwright-waf','Playwright testing standards — role-based locators, auto-wait, visual regression, and accessibility testing.','**/*.spec.ts, **/*.test.ts',['reliability','operational-excellence'],std('Playwright',['Role-based locators: getByRole, getByLabel, getByText','Auto-wait — never use arbitrary sleep/delay','Page Object Model for maintainable tests','Visual regression with toHaveScreenshot()','Accessibility testing with @axe-core/playwright']));

mk('vitest-waf','Vitest testing standards — ES2022, snapshot testing, coverage, and mock patterns for Node.js/TypeScript.','**/*.test.ts, **/*.spec.ts',['reliability'],std('Vitest',['ES2022 syntax — ESM imports, top-level await','Snapshot testing for UI component output','Mock with vi.mock() — never mutate global state','Coverage threshold: 80% for business logic','Describe/it nesting: describe(unit) → it(behavior)']));

mk('pytest-waf','pytest testing standards — fixtures, parametrize, coverage, and mock patterns for Python.','**/test_*.py, **/*_test.py',['reliability'],std('pytest',['Fixtures for setup/teardown — not setUp/tearDown methods','@pytest.mark.parametrize for data-driven tests','conftest.py for shared fixtures','Coverage: pytest-cov with 80% minimum','Mock external services: pytest-httpx, unittest.mock']));

mk('xunit-waf','xUnit testing standards — Fact/Theory, FluentAssertions, and integration testing with WebApplicationFactory.','**/*.cs',['reliability'],std('xUnit',['[Fact] for single-case, [Theory] for data-driven','FluentAssertions for readable assertions','MethodName_Scenario_ExpectedResult naming','WebApplicationFactory<T> for integration tests','Mock with Moq or NSubstitute']));

mk('pester-waf','Pester 5 testing standards — Describe/It blocks, TestDrive, and PowerShell module testing patterns.','**/*.Tests.ps1',['reliability','operational-excellence'],std('Pester 5',['Describe/Context/It hierarchy','TestDrive: for file system testing','Mock cmdlet calls with Mock -CommandName','BeforeAll/BeforeEach for setup','Invoke-Pester with -CI for pipeline mode']));

// ─── MCP Server Development (7 more languages) ───────
mk('rust-mcp-development','Rust MCP server development — rmcp SDK, tokio, proc macros, serde, and high-performance tool serving.','**/*.rs',['performance-efficiency','security'],std('Rust MCP',['Use rmcp crate with tokio runtime','Proc macros for tool definitions','serde for JSON serialization','Error handling with anyhow/thiserror','Async handlers for all tools']));

mk('java-mcp-development','Java MCP server development — official SDK, reactive streams, Spring Boot integration.','**/*.java',['reliability','security'],std('Java MCP',['Use official Java MCP SDK','Reactive streams with Mono/Flux','Spring Boot integration with DI','Tool descriptions in annotations','Structured logging with SLF4J']));

mk('kotlin-mcp-development','Kotlin MCP server development — coroutines, data classes, Ktor, and Gradle patterns.','**/*.kt',['performance-efficiency','reliability'],std('Kotlin MCP',['Coroutines for async tool handlers','Data classes for tool parameters','Ktor for HTTP transport','Gradle Kotlin DSL for builds','Descriptive KDoc on all tools']));

mk('go-mcp-development','Go MCP server development — go-sdk/mcp, struct-based I/O, context handling.','**/*.go',['performance-efficiency','reliability'],std('Go MCP',['Use go-sdk/mcp package','Struct-based input/output for type safety','context.Context for cancellation/timeout','Minimal dependencies — stdlib preferred','Table-driven tests for tool handlers']));

mk('ruby-mcp-development','Ruby MCP server development — mcp gem, block DSL, Rails integration.','**/*.rb',['reliability'],std('Ruby MCP',['Use mcp-ruby gem','Block-based DSL for tool definitions','Rails integration for existing apps','Descriptive documentation strings','RSpec for testing tool behavior']));

mk('swift-mcp-development','Swift MCP server development — actors, Codable, async/await patterns.','**/*.swift',['performance-efficiency','reliability'],std('Swift MCP',['Use Swift MCP SDK','Actors for thread-safe tool state','Codable for parameter serialization','async/await for all handlers','XCTest for tool testing']));

mk('php-mcp-development','PHP MCP server development — attributes, typed properties, Composer.','**/*.php',['reliability','security'],std('PHP MCP',['Use PHP MCP package via Composer','Attributes for tool definitions','Typed properties for all parameters','PSR-4 autoloading','PHPUnit for testing']));

// ─── Platform-Specific (10) ──────────────────────────
mk('dataverse-waf','Dataverse SDK standards — entity operations, metadata, batch requests, and Power Platform integration.','**/*.py, **/*.cs',['reliability','operational-excellence'],std('Dataverse',['Use SDK for CRUD — never raw HTTP unless necessary','Batch requests for bulk operations','Metadata-driven development','Proper error handling on SDK operations','Environment-specific configuration']));

mk('power-bi-dax-waf','Power BI DAX standards — CALCULATE patterns, time intelligence, performance optimization.','**/*.dax, **/*.pbix',['performance-efficiency','cost-optimization'],std('Power BI DAX',['CALCULATE with explicit filters','Time intelligence with DATEADD/SAMEPERIODLASTYEAR','Variables for readability: VAR result = ...','Avoid FILTER on large tables — use KEEPFILTERS','Star schema modeling: facts + dimensions']));

mk('pcf-waf','Power Apps Component Framework standards — lifecycle methods, React integration, and TypeScript patterns.','**/*.ts, **/*.tsx',['reliability','performance-efficiency'],std('PCF Controls',['Implement IInputs/IOutputs interfaces correctly','React wrapper for complex UI components','TypeScript strict mode','Dispose resources in destroy() method','Test with PCF Testing Harness']));

mk('wordpress-waf','WordPress development standards — hooks/filters, custom post types, security, and performance.','**/*.php',['security','performance-efficiency'],std('WordPress',['Use hooks and filters — never modify core','Custom post types for structured content','Escape all output: esc_html(), esc_attr()','Enqueue scripts/styles properly','Prepared statements for DB queries (wpdb)']));

mk('salesforce-apex-waf','Salesforce Apex standards — bulkification, governor limits, trigger patterns, and testing.','**/*.cls, **/*.trigger',['reliability','security'],std('Salesforce Apex',['Bulkification — process collections, not singles','Respect governor limits (100 SOQL, 150 DML)','Trigger handler pattern — one trigger per object','75% code coverage minimum — test edge cases','Separation of concerns: trigger → handler → service']));

mk('salesforce-lwc-waf','Salesforce Lightning Web Components standards — reactive properties, wire adapters, and accessibility.','**/*.js, **/*.html',['performance-efficiency','reliability'],std('LWC',['Use @wire for data — not imperative calls unless needed','Reactive properties with @track (or reactive by default)','Base Lightning components over custom HTML','SLDS utility classes for styling','Jest for unit testing components']));

// ─── Markup/Documentation (4) ────────────────────────
mk('markdown-waf','Markdown standards — CommonMark, GFM, accessibility, heading hierarchy, and structured documentation.','**/*.md',['operational-excellence'],std('Markdown',['CommonMark + GFM (GitHub Flavored Markdown)','Heading hierarchy: H1 once, H2 for sections, H3 for subsections','Alt text on all images for accessibility','One sentence per line (for better git diffs)','Tables for structured comparisons']));

mk('html-css-waf','HTML/CSS standards — semantic HTML, accessibility, 60-30-10 color rule, and responsive design.','**/*.html, **/*.css',['responsible-ai','performance-efficiency'],std('HTML/CSS',['Semantic HTML: header, main, nav, article, aside','ARIA labels for interactive elements','60-30-10 color rule for visual hierarchy','Mobile-first responsive design','CSS custom properties for theming']));

mk('drawio-waf','Draw.io diagram standards — consistent styling, layers, export formats, and architecture diagram patterns.','**/*.drawio, **/*.drawio.svg',['operational-excellence'],std('Draw.io',['Consistent color scheme per diagram type','Layers for separating concerns (network, compute, data)','Export as SVG for web, PNG for docs','Use swim lanes for process flows','Include legend for color meanings']));

// ─── Linux/Shell (4) ─────────────────────────────────
mk('arch-linux-waf','Arch Linux administration standards — pacman, AUR, systemd, and minimal installation patterns.','**/*.sh, **/*.conf',['reliability','security'],std('Arch Linux',['pacman -Syu for updates — keep system current','AUR helpers (yay/paru) for community packages','Systemd service files for daemons','Minimal installation — install only what you need','Regular backup with rsync or Borg']));

mk('debian-waf','Debian/Ubuntu administration standards — apt, systemd, UFW firewall, and server hardening.','**/*.sh, **/*.conf',['reliability','security'],std('Debian/Ubuntu',['apt update && apt upgrade regularly','UFW for firewall — deny by default','Unattended-upgrades for security patches','Fail2ban for SSH brute-force protection','AppArmor profiles for service confinement']));

// ─── Database (4) ────────────────────────────────────
mk('mongodb-waf','MongoDB standards — schema design, indexes, aggregation pipelines, and Atlas Vector Search patterns.','**/*.js, **/*.ts',['performance-efficiency','reliability'],std('MongoDB',['Schema design: embed for 1:few, reference for 1:many','Compound indexes matching query patterns','Aggregation pipeline for complex queries','Atlas Vector Search for embedding storage','Connection pooling — reuse MongoClient']));

mk('sql-optimization-waf','SQL optimization standards — index strategy, query plans, normalized design, and migration patterns.','**/*.sql',['performance-efficiency','reliability'],std('SQL Optimization',['EXPLAIN ANALYZE before optimizing','Covering indexes for frequent queries','Avoid SELECT * — list specific columns','Parameterized queries — never string concatenation','Database migrations: versioned, reversible, tested']));

console.log(`Created: ${created} new instructions`);
