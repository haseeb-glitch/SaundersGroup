@echo off
title ORDENA+ Local

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js no esta instalado. Instala Node.js LTS desde https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 (
    echo La instalacion no pudo completarse.
    pause
    exit /b 1
  )
)

echo.
echo ORDENA+ estara disponible en http://localhost:3000
echo Para detenerlo, presiona Ctrl+C.
echo.
call npm run dev
