# Windows Cleaner CLI - PowerShell Startup & Node.js Pre-Flight Check
[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$CliArgs
)

$nodePath = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodePath) {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Red
    Write-Host "  [ERROR] Node.js is not installed or not in your PATH!  " -ForegroundColor Red -BackgroundColor DarkRed
    Write-Host "========================================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Windows Cleaner CLI requires Node.js (version 18.0.0 or higher)." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install Node.js automatically via Windows Package Manager:" -ForegroundColor Cyan
    Write-Host "  winget install OpenJS.NodeJS.LTS" -ForegroundColor White -BackgroundColor Black
    Write-Host ""
    Write-Host "Or download the official installer directly from:" -ForegroundColor Cyan
    Write-Host "  https://nodejs.org/" -ForegroundColor White
    Write-Host ""

    $response = Read-Host "Would you like to install Node.js LTS now via winget? (Y/N)"
    if ($response -match "^[Yy]$") {
        Write-Host "`nLaunching winget installation..." -ForegroundColor Green
        winget install OpenJS.NodeJS.LTS
        Write-Host "`nPlease restart your PowerShell terminal after installation finishes." -ForegroundColor Yellow
    }
    exit 1
}

$scriptDir = $PSScriptRoot
$binPath = Join-Path $scriptDir "dist\bin.js"

if (-not (Test-Path $binPath)) {
    Write-Host "[INFO] Building project..." -ForegroundColor Cyan
    npm run build
}

& node $binPath @CliArgs
