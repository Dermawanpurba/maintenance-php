#!/bin/sh
set -e

echo "=== [WOSys ERP] Memulai Inisialisasi Container Production ==="
cd /var/www/html

# 1. Bersihkan file cache bootstrap lokal yang berpotensi memicu Class CollisionServiceProvider not found
echo "[1/8] Membersihkan cache bootstrap lama..."
rm -f /var/www/html/bootstrap/cache/*.php
php artisan optimize:clear || true
php artisan package:discover --ansi || true

# 2. Pastikan folder database dan SQLite ada
echo "[2/8] Menyiapkan database SQLite..."
mkdir -p /var/www/html/database
SQLITE_DB="/var/www/html/database/database.sqlite"
if [ ! -f "$SQLITE_DB" ]; then
    echo "Membuat file database.sqlite..."
    touch "$SQLITE_DB"
fi

# 3. Inisialisasi SQLite WAL Mode untuk high concurrency
echo "[3/8] Mengaktifkan SQLite WAL Mode & Busy Timeout 5000ms..."
sqlite3 "$SQLITE_DB" "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA synchronous=NORMAL;" || true

# 4. Generate APP_KEY jika belum terdefinisi
if [ -z "$APP_KEY" ]; then
    echo "[4/8] Menghasilkan APP_KEY Laravel..."
    php artisan key:generate --force || true
else
    echo "[4/8] APP_KEY terkonfigurasi."
fi

# 5. Jalankan migrasi database
echo "[5/8] Menjalankan database migrations..."
php artisan migrate --force || true

# 6. Jalankan seeder master data jika database baru / belum ada data
echo "[6/8] Memeriksa status seeding database..."
php artisan db:seed --force || true

# 7. Pastikan symlink storage terpasang & optimasi cache produksi
echo "[7/8] Membuat symlink storage & mengoptimasi cache Laravel..."
php artisan storage:link --force || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# 8. Set kepemilikan dan permission direktori (anti-permission denied di Docker volume)
echo "[8/8] Memperbaiki izin direktori persistent..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public /var/www/html/public_frontend 2>/dev/null || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database 2>/dev/null || true
chmod 666 /var/www/html/database/database.sqlite* 2>/dev/null || true

echo "=== [WOSys ERP] Container Siap! Menjalankan Supervisor (PHP-FPM + Nginx) ==="
exec /usr/bin/supervisord -n -c /etc/supervisord.conf
