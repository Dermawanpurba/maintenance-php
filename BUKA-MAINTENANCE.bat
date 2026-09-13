@echo off
setlocal enabledelayedexpansion
title WOSys ERP - Enterprise Maintenance Management System (Port 8003)
color 0A
cd /d %~dp0

echo ==========================================================
echo   WOSys ERP - ENTERPRISE MAINTENANCE MANAGEMENT SYSTEM
echo   Laravel 13 Standalone + SQLite 3 Database (Port 8003)
echo ==========================================================
echo.
echo [1/3] Memeriksa Database SQLite...
if not exist "database\database.sqlite" (
    type nul > "database\database.sqlite"
    echo [v] Database SQLite baru dibuat.
    php artisan migrate --force
    php artisan db:seed --force
)

echo.
echo [2/3] Membersihkan Cache...
php artisan view:clear
php artisan route:clear
php artisan config:clear

echo.
echo [3/3] Menjalankan Server di http://localhost:8003 ...
echo.
echo ==========================================================
echo   BUKA OTOMATIS DI BROWSER DALAM 3 DETIK...
echo   Aplikasi Web : http://localhost:8003/
echo   API Router   : http://localhost:8003/api/maintenance/router
echo   Database     : database\database.sqlite (Zero-Config)
echo.
echo   Server aktif. JANGAN TUTUP JENDELA INI!
echo   Untuk berhenti: tekan CTRL+C lalu ketik Y
echo ==========================================================
echo.

start "" cmd /c "timeout /t 2 >nul & start http://localhost:8003/"
php artisan serve --port=8003 --host=127.0.0.1
pause
