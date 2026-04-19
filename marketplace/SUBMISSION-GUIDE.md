# FrootAI Marketplace Submission Guide — Step-by-Step

> Execute these tasks in order. Each task is self-contained with exact URLs and instructions.

---

## 📋 Pre-Flight: Quick Copy-Paste Reference

**Description (short):**
```
The uniFAIng glue for the GenAI ecosystem — wire AI primitives into deterministic, reliable solutions
```

**Description (full):**
```
The uniFAIng glue for the GenAI ecosystem — MCP tools spanning architecture guidance, solution plays, primitive management, model comparison, cost estimation, AI evaluation, and FAI Protocol orchestration. Context-wires agents, skills, instructions, hooks, and plugins into deterministic, reliable AI solutions.
```

**Install command:**
```
npx frootai-mcp@latest
```

**Key URLs:**
| What       | URL                                      |
|------------|------------------------------------------|
| GitHub     | https://github.com/frootai/frootai       |
| Website    | https://frootai.dev                      |
| MCP Page   | https://frootai.dev/mcp                  |
| npm        | https://www.npmjs.com/package/frootai-mcp|

---

## ✅ TASK 1: GitHub Repository SEO (5 minutes)

This enables auto-discovery on Glama, mcp.so, and search engines.

### Steps:

1. **Go to** → https://github.com/frootai/frootai
2. **Click the ⚙️ gear icon** next to "About" (top-right of the repo page)
3. In the **Description** field, type:
   ```
   The uniFAIng glue for GenAI — MCP tools, solution plays, AI primitives, FAI Protocol
   ```
4. In the **Website** field, type:
   ```
   https://frootai.dev
   ```
5. In the **Topics** field, add these tags ONE at a time (type each, press Enter):
   ```
   mcp
   mcp-server
   model-context-protocol
   ai-agents
   ai-architecture
   ai-primitives
   fai-protocol
   rag
   azure
   copilot
   semantic-kernel
   langchain
   solution-plays
   ```
6. Click **Save changes**

### Verify:
- Refresh the page
- You should see all topics as blue badges under the repo description
- The description and website link should appear at top-right

---

## ✅ TASK 2: awesome-mcp-servers PR (10 minutes) — 30K+ stars

This is the highest-impact submission. The repo has 30K+ stars and is THE discovery list for MCP servers.

### Steps:

1. **Go to** → https://github.com/punkpeye/awesome-mcp-servers
2. **Click "Fork"** (top-right button)
   - Fork to your personal account (pavleenbali or whichever)
   - Click **Create fork**
3. Wait for the fork to complete. You'll be on YOUR copy of the repo.
4. **Click on `README.md`** in the file list
5. **Click the ✏️ pencil icon** (Edit this file) — top right of the file content
6. **Press Ctrl+F** and search for: `Developer Tools`
   - Find the section `### 🛠️ <a name="developer-tools"></a>Developer Tools`
7. **Find where "F" entries go alphabetically** (after entries starting with "E", before "G")
8. **Add this line** (paste it on a new line):

```markdown
- [frootai/frootai](https://github.com/frootai/frootai) 📇 🏠 ☁️ 🍎 🪟 🐧 - The uniFAIng glue for the GenAI ecosystem — MCP tools for architecture guidance, solution plays, AI primitives (agents, instructions, skills), model comparison, cost estimation, AI evaluation, and FAI Protocol context-wiring. Install: `npx frootai-mcp@5.2.0`.
```

9. **Scroll down** to the "Commit changes" section
   - Commit message: `Add FrootAI MCP Server — MCP tools, solution plays, AI primitives`
   - Select **"Commit directly to the main branch"**
   - Click **Commit changes**
10. **Click "Contribute"** button (top of page, green bar)
    - Click **"Open pull request"**
11. **Fill in the PR:**
    - **Title** (IMPORTANT — include the robot emojis for fast-track merge):
      ```
      Add FrootAI MCP Server — AI primitive unification (MCP tools, solution plays, AI primitives) 🤖🤖🤖
      ```
    - **Body** — paste this:

```markdown
This PR adds [FrootAI MCP Server](https://frootai.dev) to the awesome-mcp-servers list.

**What it does:**
- MCP tools for AI architecture guidance, solution play discovery, model comparison, cost estimation, quality evaluation, primitive management, and FAI Protocol orchestration
- Context-wires AI primitives (agents, instructions, skills, hooks, plugins) via the FAI Protocol into deployable AI systems
- Production-ready solution plays covering Enterprise RAG, Multi-Agent, Voice AI, Document Intelligence, Agentic RAG, Edge AI, Browser Agents, and more
- Cross-framework adapters for Semantic Kernel and LangChain
- Infrastructure as Code (Bicep + Terraform) for every Azure-based play
- Multi-channel distribution: npm, PyPI, VS Code Marketplace, Docker, GitHub Actions, CLI
- FAI Protocol v2.0 with moonshot contract types for declarative agent orchestration

**Installation:** `npx frootai-mcp@5.2.0` (zero config, Node.js 18+)

**License:** MIT

**npm:** https://www.npmjs.com/package/frootai-mcp
**Website:** https://frootai.dev
**GitHub:** https://github.com/frootai/frootai
```

12. Click **"Create pull request"**

### What happens next:
- The `🤖🤖🤖` in the title fast-tracks the merge (per their CONTRIBUTING.md)
- Typically merged within 24-48 hours
- Once merged, you appear on https://glama.ai/mcp/servers too (they sync from this repo)

---

## ✅ TASK 3: Glama Registration (3 minutes)

Glama auto-indexes from GitHub. After Task 1 (topics), it usually picks up repos within 24-48 hours.

### Steps to speed it up:

1. **Go to** → https://glama.ai
2. **Sign in** with GitHub (top-right) if you haven't already
3. **Go to** → https://glama.ai/mcp/servers
4. **Search** for `frootai` in the search box
5. **If NOT found** (likely), email them directly:
   - **To:** hello@glama.ai
   - **Subject:** `Submit MCP Server: frootai-mcp (MCP tools, AI primitives)`
   - **Body:**
     ```
     Hi Glama team,

     I'd like to submit our MCP server for listing:

     Name: FrootAI MCP Server
     GitHub: https://github.com/frootai/frootai
     npm: npx frootai-mcp@5.2.0
     Website: https://frootai.dev/mcp
     License: MIT

     Description: The uniFAIng glue for the GenAI ecosystem — MCP tools
     spanning architecture guidance, solution plays, and AI primitives
     via the FAI Protocol.

     Our repo has the 'mcp' and 'mcp-server' GitHub topics set.

     Thank you!
     ```
6. Also check → https://glama.ai/mcp/servers — there might be a "Submit" button at the bottom of the page

### Alternative:
Glama also syncs from `awesome-mcp-servers` (Task 2). Once your PR is merged there, Glama will auto-index you.

---

## ✅ TASK 4: Smithery (10-15 minutes)

Smithery requires a **public HTTPS URL** for your MCP server. Our server supports HTTP transport but needs to be deployed somewhere.

### Option A: Deploy on Render.com (FREE — recommended)

1. **Go to** → https://render.com
2. **Sign up / Sign in** with GitHub
3. Click **"New"** → **"Web Service"**
4. **Connect your repository:** `frootai/frootai`
5. **Configure:**
   - **Name:** `frootai-mcp`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Root Directory:** `npm-mcp`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js http`
   - **Plan:** Free
6. **Add Environment Variable:**
   - Click "Add Environment Variable"
   - Key: `PORT` → Value: `3001`
   - Key: `HOST` → Value: `0.0.0.0`
7. Click **"Deploy Web Service"**
8. Wait 2-3 minutes for build + deploy
9. You'll get a URL like: `https://frootai-mcp.onrender.com`
10. **Test it:** Visit `https://frootai-mcp.onrender.com/healthz` — should return `{"status":"ok"}`
11. **Now go to Smithery:**
    - **Go to** → https://smithery.ai/new
    - **Sign in** with GitHub
    - **Namespace:** Select your org → `frootai` or your username
    - **Server ID:** `frootai-mcp`
    - **MCP Server URL:** Paste your Render URL + `/mcp`
      ```
      https://frootai-mcp.onrender.com/mcp
      ```
    - Click **Continue**
    - Fill in the details from `smithery-registry.json`
12. **Apply for verified badge** after listing is live

### Option B: Deploy on Railway (FREE — alternative)

1. **Go to** → https://railway.app
2. **Sign in** with GitHub
3. Click **"Deploy from GitHub repo"**
4. Select `frootai/frootai`
5. **Set Root Directory:** `npm-mcp`
6. **Set Start Command:** `node index.js http`
7. Add environment: `PORT=3001`, `HOST=0.0.0.0`
8. Deploy → get URL → use in Smithery same as above

### Option C: Skip for now
If you don't want to deploy a server right now, skip Smithery. The awesome-mcp-servers PR (Task 2) and GitHub topics (Task 1) are higher impact anyway. You can come back to Smithery anytime.

---

## ✅ TASK 5: GitHub MCP Registry (5 minutes)

GitHub has an official MCP registry at https://github.com/mcp.

### Steps:

1. **Go to** → https://github.com/mcp
2. Look for an **"Add your server"** or **"Submit"** link
3. If there's a submission form, fill in:
   - **Name:** `frootai-mcp`
   - **Description:** `The uniFAIng glue for GenAI — MCP tools, solution plays, AI primitives`
   - **Install:** `npx frootai-mcp@5.2.0`
   - **Repository:** `https://github.com/frootai/frootai`
4. If no direct submission:
   - GitHub MCP Registry auto-discovers from npm packages with the `mcp` keyword
   - Your `frootai-mcp` npm package already has the `mcp` keyword ✅
   - It should appear automatically within days

---

## ✅ TASK 6: GitHub Release + Star Campaign (5 minutes)

### Create a GitHub Release:

1. **Go to** → https://github.com/frootai/frootai/releases
2. Click **"Create a new release"** (or "Draft a new release")
3. **Tag:** Click "Choose a tag" → type `v5.2.0` → click "Create new tag: v5.2.0 on publish"
4. **Release title:**
   ```
   FrootAI v5.2.0 — MCP Tools, Solution Plays, AI Primitives
   ```
5. **Description** — paste this:

```markdown
## 🚀 What's New

FrootAI is the **uniFAIng glue for the GenAI ecosystem** — context-wiring AI primitives into deployable systems via the FAI Protocol.

### Highlights

🔧 **MCP Tools** — Architecture guidance, cost estimation, model comparison, evaluation, primitive orchestration
📦 **Solution Plays** — Production-ready AI architectures (Enterprise RAG, Multi-Agent, Voice AI, Edge AI, and more)
🧩 **AI Primitives** — Agents, instructions, skills, hooks, plugins
🔌 **FAI Protocol v2.0** — Moonshot contract types for declarative agent orchestration
🌐 **Multi-Channel Distribution** — npm, PyPI, VS Code, Docker, GitHub Actions, CLI
🏗️ **Infrastructure as Code** — Bicep + Terraform for every Azure play
🔄 **Cross-Framework** — Semantic Kernel + LangChain adapters

### Quick Start

```bash
# Install — zero config, instant start
npx frootai-mcp@5.2.0

# In VS Code (MCP config)
{
  "mcpServers": {
    "frootai": {
      "command": "npx",
      "args": ["frootai-mcp@5.2.0"]
    }
  }
}
```

### Links

- 🌐 [Website](https://frootai.dev)
- 📖 [MCP Tools](https://frootai.dev/mcp)
- 📦 [npm](https://www.npmjs.com/package/frootai-mcp)
- 🐍 [PyPI](https://pypi.org/project/frootai-mcp/)
- 🧩 [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=frootai.frootai)
```

6. Check **"Set as the latest release"**
7. Click **"Publish release"**

---

## ✅ TASK 7: Social Media Announcements (Optional — do after PRs are merged)

### Reddit (high-impact communities):

1. **r/MachineLearning** → https://www.reddit.com/r/MachineLearning/submit
   - Title: `[P] FrootAI — Open-source glue that wires AI primitives into deployable systems via MCP`
   - Include install command + brief description

2. **r/ChatGPT** → https://www.reddit.com/r/ChatGPT/submit
   - Title: `Free tool: MCP tools for AI architecture — works with Claude, VS Code, Cursor`

3. **r/LocalLLaMA** → https://www.reddit.com/r/LocalLLaMA/submit
   - Title: `FrootAI MCP Server — AI solution plays, framework-agnostic primitive unification`

### Twitter/X:

```
🚀 Just shipped FrootAI — the uniFAIng glue for GenAI

MCP tools · Solution plays · AI primitives
Context-wires agents, skills & plugins into deployable systems

Works with VS Code, Claude Desktop, Cursor

npx frootai-mcp@5.2.0

#MCP #AI #OpenSource
https://github.com/frootai/frootai
```

### LinkedIn:

```
Excited to launch FrootAI — the uniFAIng layer for AI development.

While MCP handles tool calling, A2A handles delegation, and AG-UI handles rendering, nothing handled the WIRING — how AI primitives share context and deploy as a system.

That's what the FAI Protocol solves.

📦 Production-ready AI architectures
🧩 Reusable AI primitives (agents, skills, instructions)
🔧 MCP tools for any AI coding assistant
🏗️ Bicep + Terraform IaC included

It's 100% open source (MIT): https://github.com/frootai/frootai
```

---

## ⏰ Execution Order Summary

| # | Task | Time | Do Now? |
|---|------|------|---------|
| 1 | GitHub Topics + About | 5 min | ✅ YES — enables auto-discovery |
| 2 | awesome-mcp-servers PR | 10 min | ✅ YES — highest visibility |
| 3 | Glama email | 3 min | ✅ YES — quick email |
| 4 | Smithery deployment | 15 min | ⚡ Optional (needs server deploy) |
| 5 | GitHub MCP Registry | 5 min | ✅ YES — check for submit form |
| 6 | GitHub Release | 5 min | ✅ YES — enables discovery |
| 7 | Social media | 10 min | 🟡 After PRs merged |

**Total: ~35-50 minutes for everything**

---

## 🔗 All URLs in One Place

```
SUBMISSION URLS:
├─ https://github.com/frootai/frootai (Settings → Topics)
├─ https://github.com/punkpeye/awesome-mcp-servers (Fork → PR)
├─ https://glama.ai/mcp/servers (Search or email hello@glama.ai)
├─ https://smithery.ai/new (Needs HTTPS URL → deploy on Render first)
├─ https://github.com/mcp (Official GitHub registry)
└─ https://github.com/frootai/frootai/releases (Create v5.2.0 release)

DEPLOYMENT (for Smithery):
├─ https://render.com (Free web service deploy)
└─ https://railway.app (Alternative free deploy)
```
