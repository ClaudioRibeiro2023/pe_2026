#!/usr/bin/env pwsh
<#
  QA Script — Sprint 8 Multi-Area + RBAC
  Validates seeds, RBAC config, build, and key files.
  Run from project root: pwsh scripts/dev/qa_multiarea_sprint8.ps1
#>

$ErrorActionPreference = 'Continue'
$pass = 0; $fail = 0; $warn = 0

function ok($msg)  { $script:pass++; Write-Host "  [PASS] $msg" -ForegroundColor Green }
function ko($msg)  { $script:fail++; Write-Host "  [FAIL] $msg" -ForegroundColor Red }
function wn($msg)  { $script:warn++; Write-Host "  [WARN] $msg" -ForegroundColor Yellow }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  QA Sprint 8 - Multi-Area + RBAC" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Key files exist ──
Write-Host "--- 1. Key Files ---"
$files = @(
  "src/shared/config/rbac.ts",
  "src/shared/hooks/useRBAC.ts",
  "src/features/area-plans/utils/mockData.ts",
  "src/features/area-plans/utils/mockActions.ts",
  "src/features/strategic-pack/api-mock.ts",
  "src/features/closings/api-mock.ts",
  "src/shared/config/navigation.ts"
)
foreach ($f in $files) {
  if (Test-Path $f) { ok "Exists: $f" } else { ko "Missing: $f" }
}

# ── 2. RBAC config ──
Write-Host ""
Write-Host "--- 2. RBAC Config ---"
$rbac = Get-Content "src/shared/config/rbac.ts" -Raw
if ($rbac -match 'MULTIAREA_ENABLED\s*=\s*true')  { ok "MULTIAREA_ENABLED = true" } else { wn "MULTIAREA_ENABLED not true" }
if ($rbac -match 'getAllowedAreas')                 { ok "getAllowedAreas exported" } else { ko "getAllowedAreas missing" }
if ($rbac -match 'canAccessArea')                   { ok "canAccessArea exported" } else { ko "canAccessArea missing" }
if ($rbac -match 'hasFeature')                      { ok "hasFeature exported" } else { ko "hasFeature missing" }
if ($rbac -match "'rh'.*'marketing'.*'operacoes'.*'ti'.*'financeiro'") { ok "All 5 area slugs in ALL_AREA_SLUGS" } else { ko "Missing area slugs" }

# ── 3. Seeds — actions count per area ──
Write-Host ""
Write-Host "--- 3. Seeds - Actions per Area ---"
$actions = Get-Content "src/features/area-plans/utils/mockActions.ts" -Raw
$rhCount  = ([regex]::Matches($actions, "id:\s*'RH-")).Count
$mktCount = ([regex]::Matches($actions, "id:\s*'MKT-")).Count
$opsCount = ([regex]::Matches($actions, "id:\s*'OPS-")).Count
$finCount = ([regex]::Matches($actions, "id:\s*'FIN-")).Count
$tiCount  = ([regex]::Matches($actions, "id:\s*'action-ti-")).Count

Write-Host "  RH=$rhCount  MKT=$mktCount  OPS=$opsCount  FIN=$finCount  TI=$tiCount"
if ($rhCount -ge 20) { ok "RH >= 20 actions ($rhCount)" } else { ko "RH < 20 actions ($rhCount)" }
if ($mktCount -ge 20) { ok "MKT >= 20 actions ($mktCount)" } else { ko "MKT < 20 actions ($mktCount)" }
if ($opsCount -ge 20) { ok "OPS >= 20 actions ($opsCount)" } else { ko "OPS < 20 actions ($opsCount)" }
if ($finCount -ge 20) { ok "FIN >= 20 actions ($finCount)" } else { ko "FIN < 20 actions ($finCount)" }
if ($tiCount -ge 4)   { ok "TI >= 4 actions ($tiCount)" } else { wn "TI < 4 actions ($tiCount)" }

# ── 4. Seeds — packs ──
Write-Host ""
Write-Host "--- 4. Seeds - Strategic Packs ---"
$packs = Get-Content "src/features/strategic-pack/api-mock.ts" -Raw
foreach ($pk in @('pack-rh-2026','pack-mkt-2026','pack-ops-2026','pack-fin-2026')) {
  if ($packs -match [regex]::Escape($pk)) { ok "Pack $pk exists" } else { ko "Pack $pk missing" }
}

# ── 5. Seeds — plans linked to packs ──
Write-Host ""
Write-Host "--- 5. Plans linked to Packs ---"
$data = Get-Content "src/features/area-plans/utils/mockData.ts" -Raw
foreach ($pk in @('pack-mkt-2026','pack-ops-2026','pack-fin-2026')) {
  if ($data -match "pack_id:\s*'$pk'") { ok "Plan linked to $pk" } else { ko "Plan NOT linked to $pk" }
}

# ── 6. Seeds — closings multiarea ──
Write-Host ""
Write-Host "--- 6. Closings Multiarea ---"
$closings = Get-Content "src/features/closings/api-mock.ts" -Raw
foreach ($area in @('rh','marketing','operacoes','financeiro')) {
  if ($closings -match "slug:\s*'$area'") { ok "Closings seed for $area" } else { ko "Closings seed missing for $area" }
}

# ── 7. Navigation — area links ──
Write-Host ""
Write-Host "--- 7. Navigation ---"
$nav = Get-Content "src/shared/config/navigation.ts" -Raw
if ($nav -match 'area-plans')         { ok "area-plans section in nav" } else { ko "area-plans section missing" }
if ($nav -match 'getNavigableAreas')  { ok "getNavigableAreas used in nav" } else { ko "getNavigableAreas not used" }
if ($nav -match 'AREA_LABELS')        { ok "AREA_LABELS used in nav" } else { ko "AREA_LABELS not used" }

# ── 8. ID standardization ──
Write-Host ""
Write-Host "--- 8. ID Standardization ---"
$oldIds = ([regex]::Matches($actions, "id:\s*'action-(mkt|ops|fin)-")).Count
if ($oldIds -eq 0) { ok "No legacy action-xxx IDs for MKT/OPS/FIN" } else { ko "Found $oldIds legacy IDs" }

# ── 9. useRBAC hook ──
Write-Host ""
Write-Host "--- 9. useRBAC Hook ---"
$hook = Get-Content "src/shared/hooks/useRBAC.ts" -Raw
if ($hook -match 'useRBAC')     { ok "useRBAC exported" } else { ko "useRBAC missing" }
if ($hook -match 'canAccess')   { ok "canAccess in hook" } else { ko "canAccess missing in hook" }
if ($hook -match 'can:\s*\(')   { ok "can(feature) in hook" } else { ko "can(feature) missing in hook" }

# ── Summary ──
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
$color = 'Green'; if ($fail -gt 0) { $color = 'Red' }
Write-Host "  PASS=$pass  FAIL=$fail  WARN=$warn" -ForegroundColor $color
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($fail -gt 0) { exit 1 } else { exit 0 }
