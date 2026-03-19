# ui_guardrail_no_raw_colors.ps1 — Guardrail: falha se encontrar cores raw
# Exit 0 = OK, Exit 1 = violacoes

$repoRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
$srcDir = Join-Path $repoRoot "src"

$allowPatterns = @("tokens\.css$", "tailwind\.config", "\.d\.ts$", "icons\.tsx$", "src\\styles\\")
$searchPatterns = @("text-gray-", "bg-gray-", "border-gray-", "bg-white")

$files = Get-ChildItem -Path $srcDir -Recurse -Include "*.tsx","*.ts"
$filteredFiles = @()
foreach ($file in $files) {
    $skip = $false
    foreach ($ap in $allowPatterns) { if ($file.FullName -match $ap) { $skip = $true; break } }
    if (-not $skip) { $filteredFiles += $file }
}

$totalViolations = 0
$violationLines = @()
$countByPattern = @{}
foreach ($sp in $searchPatterns) { $countByPattern[$sp] = 0 }

foreach ($file in $filteredFiles) {
    $lines = Get-Content $file.FullName
    $relPath = $file.FullName.Replace($repoRoot, "").TrimStart("\")
    for ($i = 0; $i -lt $lines.Count; $i++) {
        foreach ($sp in $searchPatterns) {
            if ($lines[$i] -match [regex]::Escape($sp)) {
                $countByPattern[$sp]++
                $totalViolations++
                if ($violationLines.Count -lt 30) {
                    $t = $lines[$i].Trim()
                    if ($t.Length -gt 80) { $t = $t.Substring(0,77) + "..." }
                    $violationLines += "  ${relPath}:$($i+1) -> $t"
                }
            }
        }
    }
}

Write-Host ""
Write-Host "===== GUARDRAIL: Raw Color Check =====" -ForegroundColor Cyan
foreach ($sp in $searchPatterns) {
    $c = $countByPattern[$sp]
    Write-Host "  ${sp}: $c" -ForegroundColor $(if($c -eq 0){"Green"}else{"Yellow"})
}
Write-Host "  TOTAL: $totalViolations" -ForegroundColor $(if($totalViolations -eq 0){"Green"}else{"Red"})
Write-Host "  Scanned: $($filteredFiles.Count) files" -ForegroundColor Gray

if ($violationLines.Count -gt 0) {
    Write-Host "  Top violations:" -ForegroundColor Yellow
    foreach ($vl in $violationLines) { Write-Host $vl -ForegroundColor DarkYellow }
}

if ($totalViolations -gt 0) {
    Write-Host "  RESULT: FAIL" -ForegroundColor Red
    exit 1
} else {
    Write-Host "  RESULT: PASS" -ForegroundColor Green
    exit 0
}
