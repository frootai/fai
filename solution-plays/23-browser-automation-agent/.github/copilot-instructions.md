---
description: "Browser Automation Agent domain knowledge — auto-injected into every Copilot conversation"
applyTo: "**"
---

# Browser Automation Agent — Domain Knowledge

This workspace implements an AI-powered browser automation agent — using Playwright for web interaction, LLM for decision-making, and structured actions for form filling, navigation, data extraction, and testing.

## Browser Agent Architecture (What the Model Gets Wrong)

### Playwright + LLM Loop
```python
from playwright.async_api import async_playwright

async def browser_agent(task: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        for step in range(max_steps := 10):
            # 1. Capture page state (DOM snapshot, not screenshot)
            state = await get_page_state(page)  # Accessible tree, not raw HTML
            
            # 2. LLM decides next action
            action = await decide_action(task, state, history)
            
            # 3. Execute action
            if action.type == "click": await page.click(action.selector)
            elif action.type == "fill": await page.fill(action.selector, action.value)
            elif action.type == "navigate": await page.goto(action.url)
            elif action.type == "extract": result = await page.text_content(action.selector)
            elif action.type == "done": break
            
            # 4. Wait for navigation/network
            await page.wait_for_load_state("networkidle")
```

### Page State Extraction (Accessible Tree, Not Raw HTML)
```python
# WRONG — full HTML is too large for LLM context
html = await page.content()  # 50K+ tokens for most pages

# CORRECT — accessible tree (compact, semantic)
tree = await page.accessibility.snapshot()
# Returns: {"role": "navigation", "children": [{"role": "link", "name": "Home"}, ...]}
# Typically 500-2000 tokens vs 50K for raw HTML
```

### Key Pitfalls
| Mistake | Why Wrong | Fix |
|---------|----------|-----|
| Screenshot-based (vision) | Slow, expensive, unreliable selectors | Use accessible tree / DOM snapshot |
| Raw HTML to LLM | 50K tokens per page = context overflow | Accessible tree = 500-2000 tokens |
| No action history | Agent repeats failed actions | Track action history, detect loops |
| No max steps | Agent loops forever on complex pages | Max 10-15 steps, then report failure |
| Headful browser in prod | Resource waste, flaky | Headless=True for production |
| No wait_for_load_state | Actions on loading page fail | Wait for "networkidle" after navigation |
| Hardcoded selectors | Break when page layout changes | Use role-based selectors or text matching |
| No error recovery | First error stops entire task | Try/catch per action, retry once, then skip |

## Config Files (TuneKit)
| File | What to Tune |
|------|-------------|
| `config/openai.json` | Model for decision-making, temperature (0 for determinism) |
| `config/guardrails.json` | Max steps, allowed domains, blocked actions |
| `config/agents.json` | Browser settings, timeout, retry rules |

## Available Specialist Agents (optional)
| Agent | Use For |
|-------|---------|
| `@builder` | Implement browser agent, Playwright setup, action execution |
| `@reviewer` | Audit security (allowed domains), error handling, loop detection |
| `@tuner` | Optimize page state extraction, step count, action reliability |

## Slash Commands
`/deploy` — Deploy browser agent | `/test` — Test automation flows | `/review` — Audit security | `/evaluate` — Measure task completion
