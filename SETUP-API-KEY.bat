@echo off
setlocal
cd /d "%~dp0"
title MS Weather - API Setup
echo ============================================
echo           MS WEATHER API SETUP
echo ============================================
echo.
echo This project already contains the OpenWeather API integration.
echo You need your own API key to receive real weather data.
echo.
echo If you do not have a key, this will open the official page:
echo https://home.openweathermap.org/api_keys
echo.
set /p APIKEY=Paste your OpenWeather API key here (or press Enter to open signup page): 
if "%APIKEY%"=="" (
  start "" "https://home.openweathermap.org/api_keys"
  echo.
  echo Create/sign in to your OpenWeather account, copy an API key,
  echo then run SETUP-API-KEY.bat again and paste it.
  pause
  exit /b 0
)
if not exist "backend\.env" (
  if exist "backend\.env.example" (
    copy "backend\.env.example" "backend\.env" >nul
  ) else (
    echo ERROR: backend\.env.example not found.
    pause
    exit /b 1
  )
)
set "MS_WEATHER_KEY=%APIKEY%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='backend\.env'; $c=Get-Content -Raw $p; if ($c -match '(?m)^OPENWEATHER_API_KEY=.*$') { $c=[regex]::Replace($c,'(?m)^OPENWEATHER_API_KEY=.*$',('OPENWEATHER_API_KEY=' + $env:MS_WEATHER_KEY)) } else { $c += [Environment]::NewLine + 'OPENWEATHER_API_KEY=' + $env:MS_WEATHER_KEY }; Set-Content -Path $p -Value $c -NoNewline"
if errorlevel 1 (
  echo Could not save the key. Please edit backend\.env and set OPENWEATHER_API_KEY.
  pause
  exit /b 1
)
echo.
echo API key saved to backend\.env.
echo The key stays on the backend; do not share this file publicly.
echo Now run START-MS-WEATHER.bat and search for a city.
echo If the key is newly created, provider activation may take a little while.
echo.
pause
