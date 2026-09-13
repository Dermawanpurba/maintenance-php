@echo off
setlocal enabledelayedexpansion
title WOSys ERP - React Vite Executive Dashboard (Port 3000)
color 0B
cd /d %~dp0\frontend-react

echo ==========================================================
echo   WOSys ERP - MODERN REACT VITE EXECUTIVE DASHBOARD
echo   Port: 3000 (Proxy API otomatis ke Laravel Port 8003)
echo ==========================================================
echo.
echo Pastikan BUKA-MAINTENANCE.bat sudah berjalan di port 8003!
echo.
echo Menjalankan Vite Dev Server...
start "" cmd /c "timeout /t 3 >nul & start http://localhost:3000/"
npm run dev
pause
