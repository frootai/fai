# FrootAI Website v6 — Implementation Plan

> **Goal**: Complete production-grade modernization. Every page rewritten from scratch using modern Tailwind CSS, React Server Components, Framer Motion, and shadcn/ui patterns. Zero regression, zero shortcuts, zero copied inline styles.

---

## Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (zero inline styles) |
| Components | shadcn/ui patterns (CVA + Tailwind Merge) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Markdown | react-markdown + remark-gfm (tables, code, lists) |
| Fonts | Geist Sans + Geist Mono |
| Deployment | Static export → GitHub Pages |

---

## Phase 0 — Foundation (Scaffold + Design System + Shared Components)

### Tier 0.1 — Project Scaffold
- [ ] Create `website-v6/` with Next.js, TypeScript, Tailwind CSS
- [ ] Install: framer-motion, lucide-react, clsx, class-variance-authority, tailwind-merge, next-themes, react-markdown, remark-gfm
- [ ] Configure `next.config.ts` with `output: 'export'`, turbopack root
- [ ] Copy `/public/img/` assets from production site

### Tier 0.2 — Design System (globals.css)
- [ ] Color tokens: ultra-deep dark (#050508), FROOT brand palette (amber, emerald, cyan, indigo, violet)
- [ ] Typography: Geist font variables, tracking, line-height scale
- [ ] Border/surface/elevated token layers
- [ ] CSS utilities: gradient-text-froot, gradient-text-gold, glow effects
- [ ] Animation keyframes: float, pulse, marquee, bounce-dot, streaming-cursor, blink
- [ ] Glassmorphism class
- [ ] Glow card hover (with CSS custom property --glow)
- [ ] Pill link component class
- [ ] Scrollbar, selection, smooth scroll

### Tier 0.3 — Reusable UI Components (src/components/ui/)
- [ ] `button.tsx` — CVA variants (default, outline, ghost, pill), sizes (sm, md, lg)
- [ ] `card.tsx` — Glow card with --glow color prop, hover lift
- [ ] `badge.tsx` — Status badge (Ready/Skeleton/Coming Soon), color-coded
- [ ] `section-header.tsx` — Title + subtitle + optional badge, centered
- [ ] `code-block.tsx` — Styled code with copy button
- [ ] `pill-link.tsx` — Rounded link with color accent
- [ ] `glow-pill.tsx` — CTA pill links matching production site
- [ ] `expandable.tsx` — Expand/collapse with Framer Motion animation

### Tier 0.4 — Layout Components (src/components/layout/)
- [ ] `navbar.tsx` — 5 dropdown menus + right links (Hi FAI, Agent FAI, Search FAI, GitHub). Animated dropdowns with Framer Motion. Mobile hamburger with grouped sections.
- [ ] `footer.tsx` — 4 columns (Explore, Community, Install, Connect) + copyright
- [ ] `page-shell.tsx` — Reusable page wrapper with title, subtitle, badge, back-link
- [ ] `announcement-bar.tsx` — Top banner matching production (MCP + VS Code promo)

### Tier 0.5 — Motion Components (src/components/motion/)
- [ ] `fade-in.tsx` — Scroll-triggered reveal (direction: up/down/left/right/none)
- [ ] `stagger-children.tsx` — Container that staggers child animations

### Tier 0.6 — Root Layout
- [ ] `layout.tsx` — Geist fonts, dark mode forced, Navbar + Footer + main
- [ ] Full SEO metadata matching production (OG, Twitter, favicon)

**Validation**: `npx next build` must compile with 0 errors. Landing page renders.

---

## Phase 1 — Landing Page + Chatbot (2 highest-impact pages)

### Tier 1.1 — Landing Page (`/`)
- [ ] Hero: Animated floating logo, gradient title "FrootAI", FROOT acronym with colored letters, mission quote box, ambient glow backdrop
- [ ] Ecosystem Grid: 10 cards (glow-card component), responsive 5-col desktop → 2-col mobile
- [ ] Stats Bar: 4 animated counters (18+ Modules, 20 Plays, 22 Tools, 200+ Terms)
- [ ] FROOT Framework: 5 expandable layers, each with module chip links
- [ ] Outcomes Grid: 8 achievement cards
- [ ] CTA Section: BIY headline, Infra/Platform/App metaphor, 12 pill links
- [ ] Verify all internal links work

### Tier 1.2 — Chatbot (`/chatbot`)
- [ ] Hero header: "Agent FAI" gradient title, "Powered by Azure OpenAI GPT-4.1" badge
- [ ] Chat container: Glassmorphism card with border glow
- [ ] Message rendering: User (right-aligned, amber tint) vs Assistant (left-aligned, with ✨ avatar)
- [ ] **Markdown rendering** (CRITICAL): Tables, bold, code blocks (inline + block), lists (ul/ol), blockquotes, links (amber colored), headings, horizontal rules — ALL must render properly
- [ ] SSE streaming: Read `data: {content}` chunks, append to message, show streaming cursor
- [ ] Compute augmentation: `/api/estimate-cost` for cost questions, `/api/search-plays` for play search
- [ ] Fallback responses for 6 categories (document, rag, agent, cost, mcp, start)
- [ ] Suggestion chips: 6 initial prompts + context-aware follow-ups based on last response
- [ ] Bounce-dot loading animation
- [ ] Auto-scroll with manual override (user scrolls up = pause)
- [ ] Textarea input with auto-resize, Shift+Enter for newline
- [ ] Bottom navigation pills

**Validation**: Build succeeds. Chat renders markdown tables correctly. SSE streams. Fallbacks work offline.

---

## Phase 2 — Solution Plays + Configurator + Ecosystem (3 core product pages)

### Tier 2.1 — Solution Plays (`/solution-plays`)
- [ ] Header with play count
- [ ] 3 explainer cards: .github Agentic OS, DevKit, TuneKit (with layer details)
- [ ] 20 PlayCard components, each with:
  - Icon, ID, name, description
  - Status badge (Ready/Skeleton), Complexity badge, WAF badge, SpecKit badge
  - Infra stack, Tuning knobs
  - 5 action buttons: GitHub, DevKit, TuneKit, SpecKit, User Guide
  - Expandable user guide section with monospace text
  - Hover border glow

### Tier 2.2 — Configurator (`/configurator`)
- [ ] 3-step wizard with progress bar
- [ ] Step 1: "What are you building?" — 8 options
- [ ] Step 2: "Team's primary role?" — 4 options
- [ ] Step 3: "Complexity level?" — 3 options
- [ ] Result: Recommended plays with User Guide + View Play + Setup Guide links
- [ ] "Start Over" button
- [ ] Bottom navigation pills

### Tier 2.3 — Ecosystem (`/ecosystem`)
- [ ] Telescope section: Solution Plays card + FROOT Packages card (2-col)
- [ ] Microscope section: MCP Server + VS Code Extension + Docker (3-col)
- [ ] CLI card
- [ ] Each card with bullet features + CTA pill

**Validation**: All 20 plays render. Expand/collapse works. Configurator wizard completes. All links valid.

---

## Phase 3 — Developer Tools (4 pages)

### Tier 3.1 — MCP Tooling (`/mcp-tooling`)
- [ ] 3 install method cards (Quick Run, Install Global, npm Registry)
- [ ] Without vs With comparison cards
- [ ] 6 client config cards (Claude, VS Code, Foundry, Cursor, Copilot Studio, Gemini)
- [ ] 6 static tools grid, 4 live tools grid, 3 agent chain tools grid
- [ ] 6 new AI ecosystem tools grid
- [ ] Bottom navigation pills

### Tier 3.2 — VS Code Extension (`/vscode-extension`)
- [ ] Install card with marketplace link
- [ ] 3 "What You Get" cards (Solution Plays, FROOT Modules, MCP Tools)
- [ ] 12 commands list with hot/normal styling
- [ ] DevKit Init workflow explanation (4 steps with Layer details)
- [ ] Bottom navigation pills

### Tier 3.3 — CLI (`/cli`)
- [ ] 8 CLI commands with descriptions and examples
- [ ] Install instructions
- [ ] Bottom navigation pills

### Tier 3.4 — Docker (`/docker`)
- [ ] Quick start command
- [ ] Docker Compose config
- [ ] Image details (multi-arch, size, pinning)
- [ ] Kubernetes sidecar example
- [ ] Bottom navigation pills

**Validation**: Build succeeds. All 4 pages render correctly. All code blocks formatted.

---

## Phase 4 — Knowledge & Learning (4 pages)

### Tier 4.1 — Packages (`/packages`)
- [ ] 6 category cards (Foundations, Reasoning, Orchestration, Operations, Transformation, MCP Tools)
- [ ] Category filter buttons
- [ ] Full package list (18+ items) with: ID, name, description, file, size, updated date, tags, 3 links (Docs, GitHub, Raw)
- [ ] Search/filter functionality

### Tier 4.2 — Learning Hub (`/learning-hub`)
- [ ] 4 path cards (Knowledge Modules, AI Glossary, Workshops, Quiz)
- [ ] Coming Soon: Certification section with badge
- [ ] Explore More CTA section

### Tier 4.3 — Setup Guide (`/setup-guide`)
- [ ] 4 section scroll buttons (MCP, VS Code, CLI, Docker)
- [ ] MCP section: Prerequisites, Step 1 (3 install options with tab switcher), Step 2 (3-tab client config: Claude/VS Code/Foundry), Verify step
- [ ] VS Code section: Install + commands
- [ ] CLI section: Commands  
- [ ] Docker section: Commands + compose

### Tier 4.4 — Hi FAI (`/hi-fai`)
- [ ] 5-step guided quickstart
- [ ] Step 1: Welcome + 4 stat cards + FROOT quote
- [ ] Step 2: VS Code install + sidebar panels
- [ ] Step 3: MCP setup + mcp.json config
- [ ] Step 4: DevKit + TuneKit init
- [ ] Step 5: Agent chain (Build → Review → Tune)
- [ ] Step navigation (previous/next)
- [ ] Bottom CTA

**Validation**: All 4 pages render. Setup guide tabs work. Hi FAI steps navigate.

---

## Phase 5 — Community & Enterprise (5 pages)

### Tier 5.1 — Partners (`/partners`)
- [ ] How Partner MCP Works (4-step flow)
- [ ] 6 partner cards (ServiceNow, Salesforce, SAP, Datadog, PagerDuty, Jira) with capabilities lists + "Coming Soon" badges
- [ ] Propose a Partner CTA section

### Tier 5.2 — Marketplace (`/marketplace`)
- [ ] Plugin registry concept
- [ ] Plugin manifest spec (plugin.json structure)
- [ ] Example plugins
- [ ] Submit plugin CTA

### Tier 5.3 — Community (`/community`)
- [ ] MIT license info, contribution guide, GitHub links
- [ ] Quick links

### Tier 5.4 — Enterprise (`/enterprise`)
- [ ] Enterprise offering overview (mirrors community with enterprise angle)

### Tier 5.5 — Adoption (`/adoption`)
- [ ] 6 stat cards
- [ ] Ecosystem Health table (6 components with version/status)
- [ ] 6 use case cards
- [ ] Integration points grid

**Validation**: All 5 pages render. All external links correct.

---

## Phase 6 — Developer Hub & Reference (5 pages)

### Tier 6.1 — Dev Hub (`/dev-hub`)
- [ ] 6 quick link cards (Admin Guide, User Guide, Contributor Guide, API Reference, Changelog, Architecture)
- [ ] 3-step Getting Started
- [ ] Latest Release versions
- [ ] Developer Resources grid

### Tier 6.2 — Feature Spec (`/feature-spec`)
- [ ] 16-section scrollable table of contents
- [ ] FeatureTable component (Feature, Description, Status, Link columns)
- [ ] All 16 sections with full data tables
- [ ] Section anchor links

### Tier 6.3 — API Docs (`/api-docs`)
- [ ] 6 REST API endpoints with method, path, description, request/response

### Tier 6.4 — Eval Dashboard (`/eval-dashboard`)
- [ ] 6 quality metric cards with thresholds
- [ ] Evaluation pipeline description

### Tier 6.5 — Dev Hub Changelog (`/dev-hub-changelog`)
- [ ] Release history with version, date, changes

**Validation**: All 5 pages render. Feature spec tables are scrollable. Anchor links work.

---

## Phase 7 — Dynamic Pages + Docs System (2 pages)

### Tier 7.1 — User Guide (`/user-guide`)
- [ ] Dynamic page reading `?play=XX` from URL
- [ ] Shows play-specific guide with 6 steps (VS Code → DevKit → TuneKit → MCP → Auto-Chain → Deploy)
- [ ] All 20 plays supported
- [ ] Client-side only (BrowserOnly equivalent)

### Tier 7.2 — Docs System (`/docs` + `/docs/[slug]`)
- [ ] Docs index page listing all 24 markdown files grouped by FROOT layer
- [ ] Dynamic [slug] page that reads markdown from /docs/ folder
- [ ] generateStaticParams for all 24 slugs
- [ ] Markdown rendering with proper typography (prose classes)

**Validation**: All 24 doc slugs render. User guide works with ?play=01 through ?play=20.

---

## Phase 8 — Final Polish + Validation

### Tier 8.1 — Cross-Page Consistency
- [ ] Every page uses PageShell or equivalent consistent wrapper
- [ ] All navigation pills use same component
- [ ] All cards use same glow-card component
- [ ] Typography hierarchy consistent across all 24 pages

### Tier 8.2 — Animation Polish
- [ ] FadeIn on every section header
- [ ] Stagger on all card grids
- [ ] Smooth expand/collapse on all expandables
- [ ] Hover states on every interactive element

### Tier 8.3 — Mobile Audit
- [ ] Test every page at 375px width
- [ ] Verify touch targets (min 44px)
- [ ] Verify hamburger menu works
- [ ] Verify chatbot is usable on mobile

### Tier 8.4 — Full Validation Suite
- [ ] `npx next build` — 0 errors
- [ ] HTTP 200 on all 28 routes (24 pages + 24 docs)
- [ ] Compare link inventory: old site vs new site
- [ ] Chatbot markdown rendering test (tables, code, bold, lists)

---

## Summary

| Phase | Pages | Description |
|-------|-------|-------------|
| 0 | 0 | Foundation: scaffold, design system, shared components |
| 1 | 2 | Landing page + Chatbot |
| 2 | 3 | Solution Plays + Configurator + Ecosystem |
| 3 | 4 | MCP Tooling + VS Code + CLI + Docker |
| 4 | 4 | Packages + Learning Hub + Setup Guide + Hi FAI |
| 5 | 5 | Partners + Marketplace + Community + Enterprise + Adoption |
| 6 | 5 | Dev Hub + Feature Spec + API Docs + Eval Dashboard + Changelog |
| 7 | 2 | User Guide (dynamic) + Docs System (24 slugs) |
| 8 | 0 | Polish + validation |
| **Total** | **25 pages + 24 docs = 49 routes** | |
