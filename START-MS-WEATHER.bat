@echo off
setlocal
cd /d "%~dp0"
title MS Weather Setup
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js LTS from https://nodejs.org/ then run this file again.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Reinstall Node.js LTS and make sure Add to PATH is enabled.
  pause
  exit /b 1
)
if not exist "backend\.env" (
  copy "backend\.env.example" "backend\.env" >nul
  echo Created backend\.env from the example.
)
if not exist "frontend\.env" (
  copy "frontend\.env.example" "frontend\.env" >nul
  echo Created frontend\.env from the example.
)
if not exist "backend\node_modules" (
  echo Installing backend and frontend packages. This can take a few minutes...
  call npm run install:all
  if errorlevel 1 goto install_error
) else if not exist "frontend\node_modules" (
  echo Installing backend and frontend packages. This can take a few minutes...
  call npm run install:all
  if errorlevel 1 goto install_error
) else if not exist "node_modules\concurrently" (
  echo Installing root runner package...
  call npm install
  if errorlevel 1 goto install_error
)
echo.
echo Starting MS Weather. Keep this window open while using the website.
echo Website: http://localhost:5173
echo API: http://localhost:5000/api/health
echo.
call npm run dev
pause
exit /b 0
:install_error
echo.
echo Installation failed. Check the error above and make sure internet is working.
pause
exit /b 1
