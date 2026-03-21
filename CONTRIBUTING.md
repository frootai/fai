# Contributing to FrootAI

> **Know the roots. Ship the fruit.**
> Thank you for contributing! FrootAI grows with every contribution.

---

## How to Contribute

### 1. New Solution Play

Create a new solution play following the two-part model:

```
solution-plays/XX-your-solution/
├── README.md                      (DevKit + TuneKit sections)
├── agent.md                       (DevKit: agent personality)
├── instructions.md                (DevKit: system prompts)
├── .github/copilot-instructions.md (DevKit: IDE context)
├── .vscode/mcp.json               (DevKit: MCP auto-connect)
├── .vscode/settings.json          (DevKit: IDE settings)
├── mcp/index.js                   (DevKit: solution MCP tools)
├── plugins/README.md              (DevKit: plugin specs)
├── config/openai.json             (TuneKit: AI parameters)
├── config/guardrails.json         (TuneKit: safety rules)
├── infra/main.bicep               (TuneKit: Azure resources)
├── infra/parameters.json          (TuneKit: deploy knobs)
├── evaluation/test-set.jsonl      (TuneKit: test set)
└── evaluation/eval.py             (TuneKit: quality scoring)
```

### 2. Improve Existing Play

- Fix config values based on production experience
- Add more test cases to evaluation/test-set.jsonl
- Improve agent.md with better examples
- Add plugins for new capabilities

### 3. Add Knowledge Module

- Add a new .md file in docs/
- Update mcp-server knowledge bundle: `cd mcp-server && npm run build`

### 4. Fix Bugs

- Report issues via GitHub Issues
- PRs welcome for any fix

---

## Quality Requirements

- [ ] DevKit: 6/6 files present
- [ ] TuneKit: 4/4 configs present
- [ ] All config files have `_comments` explaining parameters
- [ ] README has DevKit + TuneKit sections
- [ ] Mermaid diagrams: short text, no overflow

---

## Code of Conduct

Be respectful. Be helpful. Build things that empower people.
