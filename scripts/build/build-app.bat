@echo off
chcp 65001 >nul
title Estratégico Aero - Build Automático

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           ESTRATÉGICO AERO - BUILD AUTOMÁTICO                ║
echo ║              Planejamento que Decola                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Node.js não encontrado. Por favor, instale o Node.js.
    pause
    exit /b 1
)

:: Verificar se npm está instalado
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERRO] npm não encontrado. Por favor, instale o Node.js.
    pause
    exit /b 1
)

echo [1/5] Verificando dependências...
call npm install --silent
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao instalar dependências.
    pause
    exit /b 1
)
echo       ✓ Dependências OK

echo.
echo [2/5] Gerando ícones...
call node scripts/generate-icons.mjs
if %ERRORLEVEL% neq 0 (
    echo [AVISO] Falha ao gerar ícones. Usando ícones existentes.
)
echo       ✓ Ícones OK

echo.
echo [3/5] Compilando aplicação web...
call npm run build:electron
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao compilar aplicação.
    pause
    exit /b 1
)
echo       ✓ Build web OK

echo.
echo [4/5] Gerando executável Windows...
call npx electron-builder --win
if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha ao gerar executável.
    pause
    exit /b 1
)
echo       ✓ Executável gerado

echo.
echo [5/5] Finalizando...
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    BUILD CONCLUÍDO!                          ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  Instalador disponível em:                                   ║
echo ║  release\EstrategicoAero-Setup-<versão>.exe                  ║
echo ║  (use deploy-update.bat para publicar update)                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Abrir pasta release
explorer release

pause
