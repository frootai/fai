#Requires -Version 7.0
<#
.SYNOPSIS
    FrootAI — Rebuild Knowledge Bundle.

.DESCRIPTION
    Rebuilds knowledge.json from docs/ and syncs it across packages.
      1. Runs build-knowledge.js to regenerate knowledge.json from docs/
      2. Copies the new knowledge.json to vscode-extension/
      3. Prints diff stats (old size vs new size, module count)
      4. Optionally bumps version and publishes to npm (-Publish flag)

.PARAMETER Publish
    Bump patch version and publish MCP server to npm.

.EXAMPLE
    .\scripts\rebuild-knowledge.ps1
    .\scripts\rebuild-knowledge.ps1 -Publish
#>

[CmdletBinding()]
param(
    [switch]$Publish
)

$ErrorActionPreference = "Stop"

# ─── Helpers ────────────────────────────────────────────────────────
function Write-Info  { param([string]$Msg) Write-Host "  ℹ  $Msg" -ForegroundColor Cyan }
function Write-Ok    { param([string]$Msg) Write-Host "  ✅ $Msg" -ForegroundColor Green }
function Write-Warn  { param([string]$Msg) Write-Host "  ⚠️  $Msg" -ForegroundColor Yellow }
function Write-Fail  { param([string]$Msg) Write-Host "  ❌ $Msg" -ForegroundColor Red; throw $Msg }

# ─── Resolve Paths ──────────────────────────────────────────────────
$ScriptDir    = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot     = Split-Path -Parent $ScriptDir
$McpDir       = Join-Path $RepoRoot "mcp-server"
$VscodeDir    = Join-Path $RepoRoot "vscode-extension"
$KnowledgeMcp = Join-Path $McpDir "knowledge.json"
$KnowledgeVsc = Join-Path $VscodeDir "knowledge.json"

Write-Host "`n  🌳 FrootAI — Rebuilding Knowledge Bundle`n" -ForegroundColor White

# ─── Step 1: Capture old stats ──────────────────────────────────────
$OldSize    = 0
$OldModules = 0

if (Test-Path $KnowledgeMcp) {
    $OldSize    = (Get-Item $KnowledgeMcp).Length
    $OldModules = (node -e "const k=JSON.parse(require('fs').readFileSync('$($KnowledgeMcp -replace '\\','/')','utf-8')); console.log(Object.keys(k.modules||{}).length)" 2>$null) ?? "0"
}

Write-Info "Old bundle: $OldSize bytes, $OldModules modules"

# ─── Step 2: Rebuild knowledge.json ────────────────────────────────
Write-Info "Running build-knowledge.js..."
Push-Location $McpDir
try {
    node build-knowledge.js
    if ($LASTEXITCODE -ne 0) { Write-Fail "build-knowledge.js failed" }
}
finally {
    Pop-Location
}

# ─── Step 3: Capture new stats ──────────────────────────────────────
$NewSize    = (Get-Item $KnowledgeMcp).Length
$NewModules = node -e "const k=JSON.parse(require('fs').readFileSync('$($KnowledgeMcp -replace '\\','/')','utf-8')); console.log(Object.keys(k.modules||{}).length)" 2>$null

# ─── Step 4: Sync to vscode-extension ──────────────────────────────
Write-Info "Syncing knowledge.json → vscode-extension/"
Copy-Item -Path $KnowledgeMcp -Destination $KnowledgeVsc -Force
Write-Ok "Copied to vscode-extension\knowledge.json"

# ─── Step 5: Print diff stats ──────────────────────────────────────
Write-Host ""
Write-Host "  📊 Knowledge Bundle Stats" -ForegroundColor White
Write-Host "    Old size:    $OldSize bytes"
Write-Host "    New size:    $NewSize bytes"

if ($OldSize -gt 0) {
    $Delta = $NewSize - $OldSize
    $DeltaColor = if ($Delta -ge 0) { "Green" } else { "Red" }
    $DeltaSign  = if ($Delta -ge 0) { "+" } else { "" }
    Write-Host "    Delta:       $DeltaSign$Delta bytes" -ForegroundColor $DeltaColor
}

Write-Host "    Old modules: $OldModules"
Write-Host "    New modules: $NewModules"
Write-Host ""

# ─── Step 6: Publish (optional) ────────────────────────────────────
if ($Publish) {
    Write-Info "Bumping patch version..."
    Push-Location $McpDir
    try {
        npm version patch --no-git-tag-version
        $NewVersion = (node -e "console.log(require('./package.json').version)")
        Write-Info "Publishing frootai-mcp@$NewVersion to npm..."
        npm publish --access public
        if ($LASTEXITCODE -ne 0) { Write-Fail "npm publish failed" }
        Write-Ok "Published frootai-mcp@$NewVersion"
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Info "Skipping publish (use -Publish to bump version and publish to npm)"
}

Write-Host ""
Write-Ok "Knowledge rebuild complete! 🌳"
