@echo off
title SmartSchool ERP - Demarrage Serveur Local
color 0B
echo ========================================================
echo        SMARTSCHOOL ERP - REPUBLIQUE DE GUINEE
echo            LANCEMENT DU SERVEUR LOCAL (PORT 3000)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Verification des fichiers...
if not exist "dist\index.html" (
    echo Compilation des fichiers de production...
    call npm run build
)

echo.
echo [2/3] Demarrage du serveur local sur http://localhost:3000 ...
start "" "http://localhost:3000"

echo [3/3] Serveur actif. Ne fermez pas cette fenetre pendant l'utilisation.
echo Pour arreter le serveur, appuyez sur Ctrl+C ou fermez cette fenetre.
echo.

node server.js
if %errorlevel% neq 0 (
    echo Lancement avec Vite...
    call npm run dev
)
pause
