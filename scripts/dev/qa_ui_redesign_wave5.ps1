# QA Script — UI Redesign Wave 5
$ErrorActionPreference = "Continue"
$ts = Get-Date -Format "yyyyMMdd_HHmm"

Write-Host ""
Write-Host "========================================"
Write-Host " QA UI REDESIGN WAVE 5"
Write-Host "========================================"

# 1. Build
Write-Host ""
Write-Host "[1/4] Running build..."
$buildOut = npx vite build 2>&1
$buildExit = $LASTEXITCODE
if ($buildExit -eq 0) {
    Write-Host "  BUILD OK (exit 0)" -ForegroundColor Green
} else {
    Write-Host "  BUILD FAILED (exit $buildExit)" -ForegroundColor Red
}

# 2. Raw colors count
Write-Host ""
Write-Host "[2/4] Counting raw colors..."
powershell -ExecutionPolicy Bypass -File scripts/dev/ui_count_raw_colors.ps1

# 3. Heatmap
Write-Host ""
Write-Host "[3/4] Generating heatmap..."
powershell -ExecutionPolicy Bypass -File scripts/dev/ui_raw_colors_heatmap.ps1

# 4. A11y smoke
Write-Host ""
Write-Host "[4/4] Running a11y smoke..."
powershell -ExecutionPolicy Bypass -File scripts/dev/ui_a11y_smoke.ps1

Write-Host ""
Write-Host "========================================"
Write-Host " QA COMPLETE"
Write-Host "========================================"
Write-Host "Build: exit $buildExit"
