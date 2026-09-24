@echo off
title WOSys ERP - Laravel 13 Backend Server (Port 8003)
color 0A
cd /d "%~dp0"

echo =========================================================================
echo       WOSys ERP - ENTERPRISE MAINTENANCE MANAGEMENT SYSTEM
echo       Laravel 13 PHP 8.4 REST API + SQLite WAL Server (Port 8003)
echo =========================================================================
echo.

REM 1. Deteksi executable PHP (dukung PATH sistem maupun instalasi XAMPP)
where php >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\xampp\php\php.exe" (
        set "PATH=C:\xampp\php;%PATH%"
        echo [v] Menggunakan PHP dari C:\xampp\php
    ) else (
        echo [X] ERROR: PHP tidak ditemukan di PATH maupun C:\xampp\php\php.exe!
        echo     Pastikan XAMPP terinstal di C:\xampp atau daftarkan php.exe ke PATH sistem.
        echo.
        pause
        exit /b 1
    )
)

REM 2. Periksa Database SQLite
echo [1/3] Memeriksa Database SQLite...
if not exist "database\database.sqlite" (
    if not exist "database" mkdir "database"
    type nul > "database\database.sqlite"
    echo [!] File database.sqlite tidak ditemukan. File kosong baru telah dibuat.
    echo [*] Menjalankan migrasi struktur tabel...
    php artisan migrate --force
    echo [*] Menyiapkan akun pengguna default dan hak akses...
    php artisan db:seed --class=MaintenanceDatabaseSeeder --force
) else (
    echo [v] Database SQLite ditemukan: database\database.sqlite
    php artisan migrate --force >nul 2>&1
)

REM 3. Bersihkan Cache Laravel
echo.
echo [2/3] Membersihkan Cache Sistem...
php artisan view:clear >nul 2>&1
php artisan route:clear >nul 2>&1
php artisan config:clear >nul 2>&1
echo [v] Cache konfigurasi, route, dan view berhasil dibersihkan.

REM 4. Cek Port 8003
echo.
echo [3/3] Menyiapkan Server Laravel di Port 8003...
netstat -ano | findstr :8003 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo [!] PERINGATAN: Port 8003 sudah aktif / sedang digunakan proses lain.
    echo     Jika server Laravel sudah berjalan sebelumnya, silakan langsung buka browser.
)

echo.
echo =========================================================================
echo   STATUS SERVER WOSYS ERP:
echo   - Backend dan Web App : http://localhost:8003/
echo   - API Health / Router : http://localhost:8003/api/maintenance/router
echo   - Frontend React Dev  : http://localhost:3000/ (via BUKA-REACT-DASHBOARD.bat)
echo   - Database File       : database\database.sqlite (SQLite WAL)
echo.
echo   AKUN LOGIN DEFAULT (jika database baru):
echo   - Username: admin (Password: 123456)
echo   - Username: planner (Password: 123456)
echo.
echo   JANGAN TUTUP JENDELA INI SELAMA APLIKASI DIGUNAKAN!
echo   Untuk menghentikan server: Tekan CTRL+C lalu ketik Y
echo =========================================================================
echo.

REM Buka browser otomatis ke port 8003 dalam 2 detik
start "" cmd /c "timeout /t 2 >nul 2>&1 & start http://localhost:8003/"

php artisan serve --port=8003 --host=127.0.0.1
pause
