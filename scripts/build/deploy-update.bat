@echo off
setlocal enableextensions
title Estrategico Aero - Deploy de Atualizacao

echo.
echo === ESTRATEGICO AERO - DEPLOY DE ATUALIZACAO ===
echo.

set "UPDATE_FOLDER=C:\Updates\EstrategicoAero"

echo [1/3] Preparando pasta de updates...
if not exist "%UPDATE_FOLDER%" mkdir "%UPDATE_FOLDER%"
echo       Pasta: %UPDATE_FOLDER%

echo.
echo [2/3] Copiando arquivos de atualizacao...

dir /b "release\EstrategicoAero-Setup-*.exe" >nul 2>nul
if errorlevel 1 goto missingExe

if not exist "release\latest.yml" goto missingLatest

copy /Y "release\EstrategicoAero-Setup-*.exe" "%UPDATE_FOLDER%" >nul
copy /Y "release\latest.yml" "%UPDATE_FOLDER%" >nul
copy /Y "release\EstrategicoAero-Setup-*.exe.blockmap" "%UPDATE_FOLDER%" >nul 2>nul
echo       Arquivos copiados

echo.
echo [3/3] Verificando metadata...
if not exist "%UPDATE_FOLDER%\latest.yml" goto copyFailed
echo       Metadata OK

echo.
echo === DEPLOY CONCLUIDO ===
echo Arquivos copiados para: %UPDATE_FOLDER%
echo Usuarios receberao notificacao ao abrir a aplicacao.
echo.

explorer "%UPDATE_FOLDER%"
pause
exit /b 0

:missingExe
echo [ERRO] Nenhum executavel encontrado em release\
echo        Execute build-app.bat primeiro!
pause
exit /b 1

:missingLatest
echo [ERRO] Arquivo latest.yml nao encontrado em release\
echo        Execute o build completo (electron-builder) para gerar metadata.
pause
exit /b 1

:copyFailed
echo [ERRO] latest.yml nao foi copiado corretamente.
pause
exit /b 1
