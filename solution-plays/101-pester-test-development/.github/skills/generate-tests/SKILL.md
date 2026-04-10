---
name: generate-tests
description: "Generate Pester 5.x test suites for PowerShell modules — AST analysis, mock generation, coverage targeting, builder-reviewer-tuner chain. Use when: writing tests, creating tests, test generation, Pester tests, unit tests, integration tests."
---

# Generate Pester Tests

## When to Use
- User asks to generate tests for PowerShell code
- User asks to write unit tests or integration tests
- User asks to add test coverage to existing modules
- User mentions Pester, mocking, or code coverage

## Procedure

### Step 1: Discover Source Files
```powershell
Get-ChildItem -Path ./src -Filter *.ps1 -Recurse |
    ForEach-Object { Write-Host "$($_.Name) — $((Get-Content $_.FullName | Select-String 'function ').Count) functions" }
```

### Step 2: Invoke Builder Subagent
For each source file, invoke the builder subagent:
- Builder analyzes AST to find all functions
- Builder identifies dependencies needing mocks (Az.*, file I/O, REST)
- Builder generates .Tests.ps1 with BeforeAll, Describe, Context, It, Mock, Should

### Step 3: Invoke Reviewer Subagent
After tests are generated:
- Reviewer checks mock completeness (every external call mocked)
- Reviewer validates assertion quality (Should operators correct)
- Reviewer verifies coverage targets (≥90% line, ≥80% branch)

### Step 4: Run Tests
```powershell
$config = New-PesterConfiguration
$config.Run.Path = './tests'
$config.CodeCoverage.Enabled = $true
$config.CodeCoverage.Path = './src'
$config.CodeCoverage.CoveragePercentTarget = 90
$config.Run.Exit = $true
Invoke-Pester -Configuration $config
```

### Step 5: Invoke Tuner Subagent (if needed)
If coverage < 90% or tests fail:
- Tuner analyzes coverage gaps (CommandsMissed)
- Tuner fixes failing tests (mock setup, assertion)
- Tuner eliminates flaky tests

## Important: Context Management
When processing more than 3 source files:
- Process ONE module at a time
- Use subagents for each module (fresh context window)
- Summarize results between modules
