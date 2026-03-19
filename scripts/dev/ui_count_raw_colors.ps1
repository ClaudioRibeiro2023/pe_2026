# ui_count_raw_colors.ps1 — Conta ocorrencias de cores raw no src/
# Uso: powershell -ExecutionPolicy Bypass -File scripts/dev/ui_count_raw_colors.ps1
# Gera: specs/05_UI_REDESIGN/METRICS_RAW_COLORS_<timestamp>.md

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$srcDir = Join-Path $repoRoot "src"
$specsDir = Join-Path (Join-Path $repoRoot "specs") "05_UI_REDESIGN"

if (-not (Test-Path $specsDir)) { New-Item -ItemType Directory -Path $specsDir -Force > $null }

$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$outFile = Join-Path $specsDir "METRICS_RAW_COLORS_${timestamp}.md"

$patternNames = @("text-gray-", "bg-gray-", "border-gray-", "bg-white", "text-black", "text-white", "stroke-gray-")

$files = Get-ChildItem -Path $srcDir -Recurse -Include "*.tsx","*.ts"
$files = $files | Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.d\.ts$" -and $_.FullName -notmatch "tokens\.css$" -and $_.FullName -notmatch "tailwind\.config" }

$countMap = @{}
$filesMap = @{}
$totalAll = 0

foreach ($pn in $patternNames) {
    $countMap[$pn] = 0
    $filesMap[$pn] = @()
}

foreach ($file in $files) {
    $content = Get-Content -Raw $file.FullName
    $relPath = $file.FullName.Replace($repoRoot, "").TrimStart("\")
    foreach ($pn in $patternNames) {
        $m = [regex]::Matches($content, [regex]::Escape($pn))
        if ($m.Count -gt 0) {
            $countMap[$pn] += $m.Count
            $totalAll += $m.Count
            $filesMap[$pn] += "  - $relPath ($($m.Count)x)"
        }
    }
}

# Print to terminal
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " RAW COLOR COUNT - $timestamp" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

foreach ($pn in $patternNames) {
    $c = $countMap[$pn]
    $color = if ($c -eq 0) { "Green" } else { "Yellow" }
    Write-Host "  ${pn}: $c" -ForegroundColor $color
}
Write-Host ""
Write-Host "  TOTAL: $totalAll" -ForegroundColor $(if ($totalAll -eq 0) { "Green" } else { "Red" })
Write-Host ""

# Write to .md using StreamWriter to avoid pipe issues
$sw = [System.IO.StreamWriter]::new($outFile, $false, [System.Text.Encoding]::UTF8)
$sw.WriteLine("# Raw Color Metrics - $timestamp")
$sw.WriteLine("")
$sw.WriteLine("| Pattern | Count |")
$sw.WriteLine("|---------|-------|")

foreach ($pn in $patternNames) {
    $c = $countMap[$pn]
    $sw.WriteLine("| ``$pn`` | $c |")
}

$sw.WriteLine("| **TOTAL** | **$totalAll** |")
$sw.WriteLine("")
$sw.WriteLine("---")
$sw.WriteLine("")
$sw.WriteLine("## Detail by Pattern")
$sw.WriteLine("")

foreach ($pn in $patternNames) {
    $c = $countMap[$pn]
    if ($c -gt 0) {
        $sw.WriteLine("### ``$pn`` ($c)")
        $sw.WriteLine("")
        foreach ($f in $filesMap[$pn]) {
            $sw.WriteLine($f)
        }
        $sw.WriteLine("")
    }
}

$sw.Close()
Write-Host "Saved to: $outFile" -ForegroundColor Green
Write-Host ""
