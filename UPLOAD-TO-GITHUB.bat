@echo off
setlocal
cd /d "%~dp0"
title MS Weather - GitHub par upload
echo ==============================================
echo    MS Weather: GitHub par upload
echo ==============================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo Git install nahi hai. Pehle https://git-scm.com se install karein, phir dobara chalayein.
  pause
  exit /b 1
)

set "REPO=https://github.com/geotoaesai12-art/ms-weather.git"

if not exist ".git" (
  echo [1/5] Naya git folder bana raha hun...
  git init >nul
  git branch -M main
)

echo [2/5] GitHub ka link set kar raha hun...
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin %REPO%
) else (
  git remote set-url origin %REPO%
)

echo [3/5] GitHub par jo purana kaam hai woh la raha hun...
git fetch origin main >nul 2>nul
if not errorlevel 1 (
  git rev-parse HEAD >nul 2>nul
  if errorlevel 1 git reset origin/main >nul 2>nul
)

echo [4/5] Files tayyar kar raha hun...
git add .
git ls-files | findstr /R /C:"\.env$" >nul
if not errorlevel 1 (
  echo.
  echo ROKA GAYA: koi .env file upload hone wali thi ^(usmein secret key hoti hai^).
  echo Kuch upload nahi hua. Is screen ka screenshot bhej dein.
  pause
  exit /b 1
)
git commit -m "MS Weather: Vercel setup and security fixes"

echo [5/5] GitHub par bhej raha hun...
git push -u origin main
if errorlevel 1 (
  echo.
  echo Upload nahi hua. Upar jo error likha hai uska screenshot bhej dein.
  pause
  exit /b 1
)

echo.
echo Ho gaya! GitHub par upload poora hua.
echo Ab Vercel par jayein. Steps DEPLOY-ROMAN-URDU.txt mein hain.
pause
