# Script para reinstalar node_modules
# Execute como Administrador se necessário

Write-Host "=== Reinstalação do PE 2026 ===" -ForegroundColor Cyan

# 1. Parar processos que podem estar travando arquivos
Write-Host "Parando processos..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.Name -match "electron|node|PE 2026" } | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Remover node_modules
Write-Host "Removendo node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    cmd /c "rmdir /s /q node_modules" 2>$null
    if (Test-Path "node_modules") {
        Write-Host "ERRO: Não foi possível remover node_modules. Tente reiniciar o computador." -ForegroundColor Red
        exit 1
    }
}

# 3. Limpar cache do npm
Write-Host "Limpando cache do npm..." -ForegroundColor Yellow
npm cache clean --force 2>$null

# 4. Reinstalar dependências
Write-Host "Instalando dependências..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Instalação concluída com sucesso! ===" -ForegroundColor Green
    Write-Host "Execute 'npm run dev' para iniciar o servidor de desenvolvimento." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "=== Erro na instalação ===" -ForegroundColor Red
    Write-Host "Tente reiniciar o computador e executar novamente." -ForegroundColor Yellow
}
