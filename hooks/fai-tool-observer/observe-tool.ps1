# FAI Tool Observer — PostToolUse hook (Windows)
# Logs tool name, truncated input/output, duration, and outcome to JSONL.
# Redacts sensitive keys. Never blocks — always exits 0 with {}.

[CmdletBinding()]
param()

$ErrorActionPreference = 'SilentlyContinue'

$logDir = if ($env:OBSERVE_LOG_DIR) { $env:OBSERVE_LOG_DIR }        else { 'logs/copilot' }
$logFile = if ($env:OBSERVE_LOG_FILE) { $env:OBSERVE_LOG_FILE }       else { 'tool-trace.jsonl' }
$redactKeysCsv = if ($env:OBSERVE_REDACT_KEYS) { $env:OBSERVE_REDACT_KEYS }    else { 'password,token,secret,apiKey,authorization,connectionString' }
$maxInBytes = [int]($(if ($env:OBSERVE_MAX_INPUT_BYTES) { $env:OBSERVE_MAX_INPUT_BYTES }  else { '2048' }))
$maxOutBytes = [int]($(if ($env:OBSERVE_MAX_OUTPUT_BYTES) { $env:OBSERVE_MAX_OUTPUT_BYTES } else { '2048' }))

$redactKeys = $redactKeysCsv -split ',' | ForEach-Object { $_.Trim().ToLower() } | Where-Object { $_ }

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Force -Path $logDir | Out-Null
}

# Read entire stdin
$stdin = ''
try {
    if (-not [Console]::IsInputRedirected) {
        $stdin = '{}'
    }
    else {
        $stdin = [Console]::In.ReadToEnd()
    }
}
catch {
    $stdin = '{}'
}
if (-not $stdin) { $stdin = '{}' }

function Redact-Object {
    param($obj, [string[]]$keys)
    if ($null -eq $obj) { return $null }
    if ($obj -is [System.Collections.IDictionary]) {
        $copy = @{}
        foreach ($k in $obj.Keys) {
            if ($keys -contains $k.ToString().ToLower()) {
                $copy[$k] = '[REDACTED]'
            }
            else {
                $copy[$k] = Redact-Object $obj[$k] $keys
            }
        }
        return $copy
    }
    if ($obj -is [pscustomobject]) {
        $copy = [ordered]@{}
        foreach ($p in $obj.PSObject.Properties) {
            if ($keys -contains $p.Name.ToLower()) {
                $copy[$p.Name] = '[REDACTED]'
            }
            else {
                $copy[$p.Name] = Redact-Object $p.Value $keys
            }
        }
        return [pscustomobject]$copy
    }
    if ($obj -is [System.Collections.IEnumerable] -and -not ($obj -is [string])) {
        return @($obj | ForEach-Object { Redact-Object $_ $keys })
    }
    return $obj
}

function Trunc-String {
    param([string]$s, [int]$n)
    if ($null -eq $s) { return $null }
    if ($s.Length -le $n) { return $s }
    return $s.Substring(0, $n) + '...[truncated]'
}

$record = $null
try {
    $parsed = $stdin | ConvertFrom-Json -ErrorAction Stop
    $redacted = Redact-Object $parsed $redactKeys

    $toolName = if ($redacted.toolName) { $redacted.toolName }  elseif ($redacted.tool) { $redacted.tool } else { 'unknown' }
    $success = $redacted.success
    $durMs = if ($redacted.durationMs) { $redacted.durationMs } else { $redacted.duration }

    $inputRaw = if ($redacted.toolInput) { $redacted.toolInput }  else { $redacted.input }
    $outputRaw = if ($redacted.toolOutput) { $redacted.toolOutput } else { $redacted.output }

    $inputStr = if ($null -ne $inputRaw) { ($inputRaw  | ConvertTo-Json -Depth 10 -Compress) } else { $null }
    $outputStr = if ($null -ne $outputRaw) { ($outputRaw | ConvertTo-Json -Depth 10 -Compress) } else { $null }

    $record = [ordered]@{
        ts         = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
        tool       = $toolName
        success    = $success
        durationMs = $durMs
        input      = Trunc-String $inputStr  $maxInBytes
        output     = Trunc-String $outputStr $maxOutBytes
    }
}
catch {
    $record = [ordered]@{
        ts      = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
        tool    = 'unknown'
        raw     = $true
        payload = Trunc-String $stdin $maxInBytes
    }
}

$json = $record | ConvertTo-Json -Compress -Depth 10
Add-Content -Path (Join-Path $logDir $logFile) -Value $json

# PostToolUse must echo a JSON object — empty {} = no modification
Write-Output '{}'
exit 0
