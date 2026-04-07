# FrootAI — Skills (282)

> 282 self-contained capabilities bundled as folders with SKILL.md files.

## What Are FrootAI Skills?

Skills are the simplest primitive — a folder containing a `SKILL.md` file and optional bundled assets. Each skill describes a capability that Copilot (or any AI agent) can invoke.

## Skill Schema

Every skill uses YAML frontmatter:

```yaml
---
name: kebab-case-matching-folder-name    # Required, must match folder name
description: 'Single line description'   # Required, 10-1024 chars, single-quoted
---
```

## Folder Structure

```
skills/
  frootai-play-initializer/
    SKILL.md              # The skill definition
    fai-context.json      # Optional FAI Layer context
    references/           # Optional bundled assets (<5MB)
      template.json
```

## Body Content Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| Imperative | Direct rules/commands | Testing skills |
| Requirements | Setup guide with steps | MCP generator skills |
| Process | Multi-step workflow | Deployment skills |
| Template | Parameterized with `${VAR}` | Architecture blueprints |
| Framework | Methodology-driven | Documentation skills |

## Template Variables

Skills can use interactive template variables:

```
${PROJECT_TYPE="Auto-detect|.NET|Java|React|Python|Node.js"}
${DETAIL_LEVEL="High-level|Detailed|Comprehensive"}
```

## Naming Convention

Folder name = `kebab-case` matching the `name` field in SKILL.md frontmatter.

## Bundled Assets Convention

Skills can include reference files in a `references/` subfolder:

```
skills/my-skill/
├── SKILL.md              # The skill definition (required)
├── fai-context.json      # FAI Layer context (optional)
└── references/           # Bundled assets (optional)
    ├── template.json     # Templates, examples, reference data
    ├── ERROR-HANDLING.md  # Reference documentation
    └── schema.json       # Schemas or configuration files
```

**Rules:**
- Maximum **5 MB** total for all bundled assets per skill
- All assets must be in the `references/` subfolder (not skill root)
- Supported formats: `.md`, `.json`, `.yaml`, `.yml`, `.txt`, `.csv`, `.xml`
- No executable files (`.sh`, `.py`, `.js`) — logic belongs in SKILL.md instructions
- Reference files are loaded by Copilot when the skill is invoked (progressive loading)

## Validation

```bash
node scripts/validate-primitives.js skills/
```
