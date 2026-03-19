# ui_raw_colors_heatmap.ps1 — Heatmap de raw colors por arquivo
# Gera top 30 arquivos com mais usos de cores raw

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$srcDir = Join-Path $repoRoot 'src'
$specsDir = Join-Path (Join-Path $repoRoot 'specs') '05_UI_REDESIGN'
$ts = Get-Date -Format 'yyyyMMdd_HHmm'
$outFile = Join-Path $specsDir "METRICS_RAW_COLORS_HEATMAP_$ts.md"

$patterns = @(
    @{ Name = 'text-gray-'; Regex = 'text-gray-' },
    @{ Name = 'bg-gray-'; Regex = 'bg-gray-' },
    @{ Name = 'border-gray-'; Regex = 'border-gray-' },
    @{ Name = 'bg-white'; Regex = 'bg-white' },
    @{ Name = 'text-black'; Regex = 'text-black' },
    @{ Name = 'text-white'; Regex = 'text-white' }
)

# Allowlist
$allowlist = @('tokens.css', 'tailwind.config', '.d.ts', 'icons.tsx')

function Test-Allowed($filePath) {
    foreach ($a in $allowlist) {
        if ($filePath -match [regex]::Escape($a)) { return $true }
    }
    if ($filePath -match [regex]::Escape('src\styles\')) { return $true }
    return $false
}

$files = Get-ChildItem -Path $srcDir -Recurse -Include '*.tsx','*.ts','*.css' |
    Where-Object { -not (Test-Allowed $_.FullName) }

$results = @()

foreach ($file in $files) {
    $content = Get-Content -Raw $file.FullName
    if (-not $content) { continue }
    
    $total = 0
    $breakdown = @{}
    
    foreach ($p in $patterns) {
        $matches = [regex]::Matches($content, $p.Regex)
        $count = $matches.Count
        $breakdown[$p.Name] = $count
        $total += $count
    }
    
    if ($total -gt 0) {
        $relPath = $file.FullName.Replace($repoRoot + '\', '')
        $results += [PSCustomObject]@{
            File = $relPath
            Total = $total
            TextGray = $breakdown['text-gray-']
            BgGray = $breakdown['bg-gray-']
            BorderGray = $breakdown['border-gray-']
            BgWhite = $breakdown['bg-white']
            TextBlack = $breakdown['text-black']
            TextWhite = $breakdown['text-white']
        }
    }
}

$sorted = $results | Sort-Object -Property Total -Descending
$top30 = $sorted | Select-Object -First 30
$grandTotal = ($sorted | Measure-Object -Property Total -Sum).Sum

# Terminal output
Write-Host "`n=== RAW COLORS HEATMAP ===" -ForegroundColor Cyan
Write-Host "Total files with raw colors: $($sorted.Count)" -ForegroundColor Yellow
Write-Host "Grand total raw color usages: $grandTotal" -ForegroundColor Yellow
Write-Host "`nTop 30:" -ForegroundColor Cyan

$rank = 0
foreach ($r in $top30) {
    $rank++
    Write-Host ("  {0,2}. {1,-60} {2,4} total | tg:{3} bg:{4} bdg:{5} bw:{6} tb:{7} tw:{8}" -f `
        $rank, $r.File, $r.Total, $r.TextGray, $r.BgGray, $r.BorderGray, $r.BgWhite, $r.TextBlack, $r.TextWhite)
}

# Save markdown
if (-not (Test-Path $specsDir)) { New-Item -ItemType Directory -Path $specsDir -Force | Out-Null }

$sw = New-Object System.IO.StreamWriter($outFile, $false, [System.Text.Encoding]::UTF8)
$sw.WriteLine('# Heatmap — Raw Colors por Arquivo')
$sw.WriteLine('')
$sw.WriteLine('**Data:** ' + (Get-Date -Format 'yyyy-MM-dd HH:mm') + ' (UTC-03:00)')
$sw.WriteLine('**Repo:** B:\PE_2026')
$sw.WriteLine('**Arquivos analisados:** ' + $files.Count)
$sw.WriteLine('**Arquivos com raw colors:** ' + $sorted.Count)
$sw.WriteLine('**Total raw color usages:** ' + $grandTotal)
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## Top 30 Arquivos')
$sw.WriteLine('')
$sw.WriteLine('| # | Arquivo | Total | text-gray | bg-gray | border-gray | bg-white | text-black | text-white |')
$sw.WriteLine('|---|---------|-------|-----------|---------|-------------|----------|------------|------------|')

$rank = 0
foreach ($r in $top30) {
    $rank++
    $sw.WriteLine("| $rank | ``$($r.File)`` | **$($r.Total)** | $($r.TextGray) | $($r.BgGray) | $($r.BorderGray) | $($r.BgWhite) | $($r.TextBlack) | $($r.TextWhite) |")
}

$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('## Resumo por Pattern')
$sw.WriteLine('')

$totalTextGray = ($sorted | Measure-Object -Property TextGray -Sum).Sum
$totalBgGray = ($sorted | Measure-Object -Property BgGray -Sum).Sum
$totalBorderGray = ($sorted | Measure-Object -Property BorderGray -Sum).Sum
$totalBgWhite = ($sorted | Measure-Object -Property BgWhite -Sum).Sum
$totalTextBlack = ($sorted | Measure-Object -Property TextBlack -Sum).Sum
$totalTextWhite = ($sorted | Measure-Object -Property TextWhite -Sum).Sum

$sw.WriteLine('| Pattern | Total |')
$sw.WriteLine('|---------|-------|')
$sw.WriteLine("| text-gray-* | $totalTextGray |")
$sw.WriteLine("| bg-gray-* | $totalBgGray |")
$sw.WriteLine("| border-gray-* | $totalBorderGray |")
$sw.WriteLine("| bg-white | $totalBgWhite |")
$sw.WriteLine("| text-black | $totalTextBlack |")
$sw.WriteLine("| text-white | $totalTextWhite |")
$sw.WriteLine("| **TOTAL** | **$grandTotal** |")
$sw.WriteLine('')
$sw.WriteLine('---')
$sw.WriteLine('')
$sw.WriteLine('*Gerado por ui_raw_colors_heatmap.ps1*')

$sw.Close()

Write-Host "`nHeatmap salvo em: $outFile" -ForegroundColor Green
