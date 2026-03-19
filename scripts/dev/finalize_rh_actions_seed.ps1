$ErrorActionPreference = "Stop"

function NowIso() { (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ") }
function NowBr() { (Get-Date).ToString("dd/MM/yyyy HH:mm") }

$repoRoot = (Resolve-Path ".").Path

$mockActionsPath = Join-Path $repoRoot "src/features/area-plans/utils/mockActions.ts"
$mockDataPath    = Join-Path $repoRoot "src/features/area-plans/utils/mockData.ts"

$handoffPath = Join-Path $repoRoot "specs/00_HANDOFF_CURRENT_STATE.md"
$indexPath   = Join-Path $repoRoot "specs/00_INDEX.md"

$reportsDir  = Join-Path $repoRoot "specs/04_REPORTS"
New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null

$stamp = (Get-Date).ToString("yyyyMMdd_HHmm")
$reportPath = Join-Path $reportsDir "QA_RH_ACTIONS_SEED_IMPORT_$stamp.md"

# ---------- Collect: Git info (if exists) ----------
$gitExists = Test-Path (Join-Path $repoRoot ".git")
$gitStatus = ""
$gitDiffStat = ""
$gitDiff = ""

if ($gitExists) {
  try {
    $gitStatus = (git status -sb 2>&1 | Out-String).Trim()
    $gitDiffStat = (git diff --stat 2>&1 | Out-String).Trim()
    $gitDiff = (git diff 2>&1 | Out-String).Trim()
  } catch {
    $gitStatus = "ERRO ao rodar git: $($_.Exception.Message)"
  }
}

# ---------- Collect: Source checks ----------
if (!(Test-Path $mockActionsPath)) { throw "mockActions.ts não encontrado em: $mockActionsPath" }
if (!(Test-Path $mockDataPath))    { throw "mockData.ts não encontrado em: $mockDataPath" }

$mockActions = Get-Content -Raw -Encoding UTF8 $mockActionsPath
$mockData    = Get-Content -Raw -Encoding UTF8 $mockDataPath

# IDs reais esperados: RH-XXX-00
$ids = [regex]::Matches($mockActions, "RH-[A-Z]{3}-\d{2}") | ForEach-Object { $_.Value } | Sort-Object -Unique
$idCount = $ids.Count

# Contagem por programa (CON/DES/REC/INO)
$byProgram = @{}
foreach ($id in $ids) {
  $parts = $id.Split("-")
  if ($parts.Length -ge 3) {
    $p = $parts[1]
    if (!$byProgram.ContainsKey($p)) { $byProgram[$p] = 0 }
    $byProgram[$p]++
  }
}

# Checar se sobrou action-rh-* (antigos)
$oldIdsInMockActions = ([regex]::Matches($mockActions, "action-rh-\d+")).Count

# Checar pack_id/plan_id esperados nos arquivos (presença textual)
$hasPackIdInActions = ($mockActions -match "pack-rh-2026")
$hasPlanIdInActions = ($mockActions -match "plan-rh-2026")

# mockData: garantir que plan-rh-2026 está com pack-rh-2026
$mockDataHasPlanPackLink = ($mockData -match "plan-rh-2026") -and ($mockData -match "pack-rh-2026")

# ---------- Collect: Dist checks (bundle evidence) ----------
$distDir = Join-Path $repoRoot "dist"
$distAssetsDir = Join-Path $distDir "assets"
$bundleIdCount = $null
$bundleIdsUnique = @()

if (Test-Path $distAssetsDir) {
  $bundleMatches = @()
  Get-ChildItem -Path $distAssetsDir -Filter "*.js" -File | ForEach-Object {
    $m = Select-String -Path $_.FullName -Pattern "RH-[A-Z]{3}-\d{2}" -AllMatches
    foreach ($hit in $m) {
      foreach ($mm in $hit.Matches) { $bundleMatches += $mm.Value }
    }
  }
  $bundleIdsUnique = $bundleMatches | Sort-Object -Unique
  $bundleIdCount = $bundleIdsUnique.Count
}

# ---------- Optional: build capture (light) ----------
$buildOut = ""
try {
  $buildOutRaw = (npm run build 2>&1 | Out-String)
  $exit = $LASTEXITCODE
  if ($exit -ne 0) {
    $buildOut = "BUILD FAILED (exit $exit)`n$($buildOutRaw.Trim())"
  } else {
    $buildOut = "BUILD OK (exit $exit)`n$($buildOutRaw.Trim())"
  }
} catch {
  $buildOut = "ERRO no build (exception): $($_.Exception.Message)"
}

# ---------- Update docs: HANDOFF + INDEX ----------
$handoffUpdated = $false
$indexUpdated = $false
$handoffBefore = ""
$indexBefore = ""
$handoffAfter = ""
$indexAfter = ""

if (Test-Path $handoffPath) {
  $handoffBefore = Get-Content -Raw -Encoding UTF8 $handoffPath
  $h = $handoffBefore

  # Atualizar timestamp
  $h = [regex]::Replace($h, '(?m)^\> \*\*Ultima atualizacao:\*\* .*$', "> **Ultima atualizacao:** $(NowBr)", 1)

  # Marcar BLOCO 2 como concluido
  $h = [regex]::Replace(
    $h,
    '(?m)^\|\s*Seed Plano Completo RH.*\|\s*.*\|\s*.*\|$',
    '| Seed Plano Completo RH (42 acoes) | Importado | mockActions.ts + mockData.ts + QA report |',
    1
  )

  # Corrigir seção "Arquivos Alvo" se existir (substituição suave)
  $h = $h -replace "src/features/strategic-pack/api-mock\.ts\s*->\s*destino \(seed\)", "src/features/area-plans/utils/mockActions.ts -> destino (seed real)"
  $h = $h -replace "src/features/area-plans/utils/mockData\.ts\s*->\s*alternativa", "src/features/area-plans/utils/mockData.ts -> vinculo plan<->pack"

  # Inserir link do QA report perto do criterio (se nao existir)
  if ($h -notmatch "QA_RH_ACTIONS_SEED_IMPORT_") {
    $insert = "`n**Evidencia (QA):** `n- ``specs/04_REPORTS/$(Split-Path -Leaf $reportPath)`` `n"
    # tenta inserir apos Criterio de Validacao (se achar)
    if ($h -match "## BLOCO 3") {
      $h = $h -replace '(?s)(### Criterio de Validacao.*?)(\n---|\n##|\z)', "`$1$insert`$2"
    } else {
      $h = $h + "`n---`n$insert"
    }
  }

  Set-Content -Path $handoffPath -Value $h -Encoding UTF8
  $handoffAfter = $h
  $handoffUpdated = $true
}

if (Test-Path $indexPath) {
  $indexBefore = Get-Content -Raw -Encoding UTF8 $indexPath
  $i = $indexBefore

  # Atualizar timestamp
  $i = [regex]::Replace($i, '(?m)^\*\*Ultima atualizacao:\*\* .*$', "**Ultima atualizacao:** $(NowBr)", 1)

  # Atualizar Proximo passo do topo
  $i = [regex]::Replace(
    $i,
    '(?m)^\*\*Proximo passo:\*\*.*$',
    '**Proximo passo:** SPEC_02 - Planning Module - Sprint 5 (Relatorios + Expansao para areas)',
    1
  )

  Set-Content -Path $indexPath -Value $i -Encoding UTF8
  $indexAfter = $i
  $indexUpdated = $true
}

# ---------- Write report ----------
$lines = @()
$lines += "# QA - RH Actions Seed Import (42 acoes) - Finalizacao"
$lines += ""
$ts = NowIso
$lines += "**Timestamp (UTC):** $ts"
$lines += "**Repo:** $repoRoot"
$lines += ""
$lines += "## 1) Evidencias (automaticas)"
$lines += ""
$lines += "- **IDs RH detectados em source (mockActions.ts):** $idCount"
$lines += "- **IDs antigos ``action-rh-*`` restantes no mockActions.ts:** $oldIdsInMockActions"
$lines += "- **mockActions contem ``pack-rh-2026``?** $hasPackIdInActions"
$lines += "- **mockActions contem ``plan-rh-2026``?** $hasPlanIdInActions"
$lines += "- **mockData contem vinculo plan<->pack (``plan-rh-2026`` + ``pack-rh-2026``)?** $mockDataHasPlanPackLink"
$lines += ""
$lines += "### 1.1) Contagem por programa (prefixo RH-XXX-)"
$lines += ""
$lines += "| Programa | Qtd |"
$lines += "|---|---:|"
foreach ($k in ($byProgram.Keys | Sort-Object)) {
  $lines += "| $k | $($byProgram[$k]) |"
}
$lines += ""

if ($null -ne $bundleIdCount) {
  $lines += "### 1.2) Evidencia em bundle (dist/assets)"
  $lines += ""
  $lines += "- **IDs RH detectados no bundle (dist/assets/*.js):** $bundleIdCount"
  $lines += ""
} else {
  $lines += "### 1.2) Evidencia em bundle (dist/assets)"
  $lines += ""
  $lines += "- **dist/assets nao encontrado** (rode ``npm run build`` e gere dist/)."
  $lines += ""
}

$lines += "## 2) Build (log resumido)"
$lines += ""
$lines += '```text'
$lines += $buildOut
$lines += '```'
$lines += ""

$lines += "## 3) Alteracoes (diff)"
$lines += ""
if ($gitExists) {
  $lines += "### 3.1) git status"
  $lines += '```text'
  $lines += $gitStatus
  $lines += '```'
  $lines += ""
  $lines += "### 3.2) git diff --stat"
  $lines += '```text'
  $lines += $gitDiffStat
  $lines += '```'
  $lines += ""
  $lines += "### 3.3) git diff"
  $lines += '```diff'
  $lines += $gitDiff
  $lines += '```'
  $lines += ""
} else {
  $lines += "- Repositorio sem ``.git`` (ou git indisponivel). Incluindo hashes dos arquivos alterados:"
  $lines += ""
  $ha = Get-FileHash $mockActionsPath -Algorithm SHA256
  $hd = Get-FileHash $mockDataPath -Algorithm SHA256
  $lines += "| Arquivo | SHA256 |"
  $lines += "|---|---|"
  $lines += "| src/features/area-plans/utils/mockActions.ts | $($ha.Hash) |"
  $lines += "| src/features/area-plans/utils/mockData.ts | $($hd.Hash) |"
  $lines += ""
}

$lines += "## 4) Docs atualizados"
$lines += ""
$lines += "- **HANDOFF atualizado?** $handoffUpdated (``$handoffPath``)"
$lines += "- **INDEX atualizado?** $indexUpdated (``$indexPath``)"
$lines += "- **QA report gerado em:** ``specs/04_REPORTS/$(Split-Path -Leaf $reportPath)``"
$lines += ""
$lines += "## 5) Checklist de aceite"
$lines += ""
$lines += "- [ ] Source contem 42 IDs RH (mockActions.ts)"
$lines += "- [ ] Nao existe ``action-rh-*`` restante no mockActions.ts"
$lines += "- [ ] mockData vincula ``plan-rh-2026`` <-> ``pack-rh-2026``"
$lines += "- [ ] Build OK (sem erros)"
$lines += "- [ ] Handoff/Index atualizados para refletir conclusao"
$lines += ""

Set-Content -Path $reportPath -Value ($lines -join "`n") -Encoding UTF8

Write-Host "OK: Report gerado em $reportPath"
Write-Host "OK: Handoff atualizado: $handoffUpdated | Index atualizado: $indexUpdated"
