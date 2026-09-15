#!/bin/sh
set -e

echo "=== [WOSys ERP] Memulai Inisialisasi Container Production ==="
cd /var/www/html

# 1. Bersihkan file cache bootstrap lokal yang berpotensi memicu Class CollisionServiceProvider not found
echo "[1/9] Membersihkan cache bootstrap lama..."
rm -f /var/www/html/bootstrap/cache/*.php
php artisan optimize:clear || true
php artisan package:discover --ansi || true

# 2. Pastikan folder database dan SQLite ada
echo "[2/9] Menyiapkan database SQLite..."
mkdir -p /var/www/html/database
SQLITE_DB="/var/www/html/database/database.sqlite"
if [ ! -f "$SQLITE_DB" ]; then
    echo "Membuat file database.sqlite..."
    touch "$SQLITE_DB"
fi

# 3. Inisialisasi SQLite WAL Mode untuk high concurrency
echo "[3/9] Mengaktifkan SQLite WAL Mode & Busy Timeout 5000ms..."
sqlite3 "$SQLITE_DB" "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA synchronous=NORMAL;" || true

# 4. Validasi & Inisialisasi APP_KEY Laravel yang Aman (Anti-500 Encrypter Error)
echo "[4/9] Memvalidasi integritas APP_KEY Laravel..."
KEY_FILE="/var/www/html/storage/app/app.key"
mkdir -p /var/www/html/storage/app

IS_KEY_VALID=false
if [ -n "$APP_KEY" ] && [ "$APP_KEY" != "base64:GENERATE_DENGAN_ARTISAN_KEY_GENERATE" ]; then
    RAW_KEY=$(echo "$APP_KEY" | sed 's/^base64://')
    KEY_LEN=$(echo -n "$RAW_KEY" | base64 -d 2>/dev/null | wc -c)
    if [ "$KEY_LEN" -eq 32 ]; then
        IS_KEY_VALID=true
    fi
fi

if [ "$IS_KEY_VALID" = "true" ]; then
    echo "-> APP_KEY dari environment valid (AES-256-CBC 32-byte)."
    echo "$APP_KEY" > "$KEY_FILE"
else
    if [ -f "$KEY_FILE" ]; then
        SAVED_KEY=$(cat "$KEY_FILE" | tr -d '\r\n')
        SAVED_RAW=$(echo "$SAVED_KEY" | sed 's/^base64://')
        SAVED_LEN=$(echo -n "$SAVED_RAW" | base64 -d 2>/dev/null | wc -c)
        if [ "$SAVED_LEN" -eq 32 ]; then
            echo "-> Menggunakan APP_KEY tersimpan dari volume persisten."
            export APP_KEY="$SAVED_KEY"
            IS_KEY_VALID=true
        fi
    fi

    if [ "$IS_KEY_VALID" != "true" ]; then
        echo "-> Menghasilkan APP_KEY produksi baru yang valid (32-byte)..."
        NEW_KEY="base64:$(head -c 32 /dev/urandom | base64 | tr -d '\r\n')"
        export APP_KEY="$NEW_KEY"
        echo "$NEW_KEY" > "$KEY_FILE"
    fi
fi

touch /var/www/html/.env
if grep -q "^APP_KEY=" /var/www/html/.env; then
    sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" /var/www/html/.env
else
    echo "APP_KEY=$APP_KEY" >> /var/www/html/.env
fi

# 5. Jalankan migrasi database & pastikan skema SQLite lengkap
echo "[5/9] Menjalankan database migrations & sinkronisasi skema..."
sqlite3 "$SQLITE_DB" "ALTER TABLE app_users ADD COLUMN email TEXT;" 2>/dev/null || true
sqlite3 "$SQLITE_DB" "UPDATE app_users SET email = username || '@wosys.local' WHERE email IS NULL OR email = '';" 2>/dev/null || true
php artisan migrate --force || true

# 6. Jalankan seeder master data jika database baru / belum ada data
echo "[6/9] Memeriksa status seeding database..."
php artisan db:seed --force || true

# Pastikan seluruh user di database terenkripsi bcrypt dan email terisi lengkap
php -r "require 'vendor/autoload.php'; \$app = require_once 'bootstrap/app.php'; \$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap(); foreach(App\Models\User::all() as \$u) { \$pass = (string)\$u->getRawOriginal('password'); if(!str_starts_with(\$pass, '\$2y\$') && !str_starts_with(\$pass, '\$2a\$')) { Illuminate\Support\Facades\DB::table('app_users')->where('id', \$u->id)->update(['password' => Illuminate\Support\Facades\Hash::make(\$pass ?: '123456')]); } if(empty(\$u->getRawOriginal('email'))) { Illuminate\Support\Facades\DB::table('app_users')->where('id', \$u->id)->update(['email' => \$u->username . '@wosys.local']); } }" || true

# 7. Optimasi FilamentPHP Admin Panel
echo "[7/9] Mengoptimasi Filament Admin Panel & menerbitkan aset..."
php artisan filament:optimize || true
php artisan vendor:publish --tag=filament-assets --force || true

# 8. Pastikan symlink storage terpasang & optimasi cache produksi
echo "[8/9] Membuat symlink storage & mengoptimasi cache Laravel..."
php artisan storage:link --force || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# 9. Set kepemilikan dan permission direktori (anti-permission denied di Docker volume)
echo "[9/9] Memperbaiki izin direktori persistent..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/public /var/www/html/public_frontend 2>/dev/null || true
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database 2>/dev/null || true
chmod 666 /var/www/html/database/database.sqlite* 2>/dev/null || true

echo "=== [WOSys ERP] Container Siap! Menjalankan Supervisor (PHP-FPM + Nginx) ==="
exec /usr/bin/supervisord -n -c /etc/supervisord.conf
