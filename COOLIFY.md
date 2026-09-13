# Panduan Standar Deployment VPS Coolify
## WOSys ERP — Laravel 13 (PHP 8.4) + SQLite WAL + React Vite

Panduan ini adalah standar operasional resmi untuk mendeploy aplikasi **WOSys ERP - Maintenance Management System** ke VPS mandiri menggunakan platform **Coolify** dengan mode **Private GitHub Repository**, **Persistent Storage Volume**, dan **SQLite WAL Concurrency**.

---

### 1. Spesifikasi VPS & Persiapan Awal

- **Rekomendasi Provider**: Hetzner, DigitalOcean, Vultr, Linode, AWS Lightsail, atau Biznet Gio.
- **Sistem Operasi**: Ubuntu 22.04 LTS / 24.04 LTS (x86_64).
- **Spesifikasi Minimal**: 1 vCPU, 1 GB RAM (Disarankan 2 GB - 4 GB), 20 GB NVMe/SSD.

#### Wajib: Aktifkan Swap File 2GB (Mencegah OOM saat Build)
Jika VPS Anda memiliki RAM 1GB - 2GB, jalankan di terminal VPS:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### Instalasi Coolify di VPS
```bash
sudo -i
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```
Akses dashboard Coolify di peramban: `http://<IP_VPS_ANDA>:8000`.

---

### 2. Pengaturan GitHub Private Repository

Jangan pernah membiarkan kode aplikasi enterprise dalam mode Public. Gunakan repositori **Private** dan hubungkan ke Coolify melalui salah satu opsi berikut:

#### Opsi A: Integrasi GitHub App Resmi (Paling Direkomendasikan)
1. Di Coolify, buka menu **Keys & Tokens** (atau **Sources**) di sidebar kiri.
2. Klik **+ New Source** ➔ Pilih **GitHub App** ➔ Beri nama (misal `github-apps`) ➔ Klik **Continue**.
3. Klik tombol ungu **Register with GitHub** ➔ Klik **Create GitHub App for [Username]**.
4. Pada opsi *Repository Access*, pilih **All repositories** (atau repositori spesifik) ➔ Klik **Install & Authorize**.
5. *Keuntungan*: Setiap `git push origin main`, Coolify otomatis melakukan build & deploy ulang instan melalui webhook!

#### Opsi B: Deploy Key ED25519 (Per-Repo SSH)
1. Buka **Keys & Tokens** ➔ **Private Keys** ➔ Klik **Generate ED25519**.
2. Salin **Public Key** yang dihasilkan.
3. Buka GitHub Repo Anda ➔ **Settings** ➔ **Deploy keys** ➔ Klik **Add deploy key** ➔ Tempelkan Public Key.
4. Di Coolify, gunakan format URL Git SSH: `git@github.com:<username>/<repo-name>.git`.

---

### 3. Konfigurasi Resource Aplikasi di Dashboard Coolify

1. Di Coolify, masuk ke menu **Projects** ➔ Pilih **Default / Production Environment**.
2. Klik **+ New Resource** ➔ Pilih **Private Repository (GitHub App)**.
3. Pilih repositori target dan branch `main`.
4. Sesuaikan pengaturan dasar:
   - **Build Pack**: Pilih **`Dockerfile`** (Wajib).
   - **Dockerfile Location**: `/Dockerfile`.
   - **Ports Exposes**: Ketik **`80`** (Wajib).
   - **Port Mappings**: Kosongkan (Coolify Traefik akan otomatis memetakan port 80).

---

### 4. Konfigurasi Persistent Storage Volumes (KRUSIAL)

Container Docker bersifat *stateless* (sementara). Agar data database SQLite dan berkas fisik unggahan pengguna **tidak pernah hilang saat deploy/rebuild**, wajib memasang 2 mount volume di tab **Storages / Persistent Storage**:

| No | Volume Name | Destination Path | Keterangan |
| :---: | :--- | :--- | :--- |
| 1 | `wosys-db-volume` | `/var/www/html/database` | Database SQLite (`database.sqlite`) |
| 2 | `wosys-uploads-volume` | `/var/www/html/storage/app/public` | Berkas lampiran & dokumen |

---

### 5. Konfigurasi Environment Variables (.env)

Buka tab **Environment Variables** di Coolify, lalu masukkan konfigurasi berikut:

```env
# APLIKASI UTAMA
APP_NAME="WOSys ERP"
APP_ENV=production
APP_KEY=base64:GENERATE_DENGAN_ARTISAN_KEY_GENERATE
APP_DEBUG=false
APP_URL=https://maintenance.domainanda.com

# DATABASE SQLITE LOKAL WAL MODE
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
DB_FOREIGN_KEYS=true

# LOGGING & DRIVER OPTIMASI
LOG_CHANNEL=stack
LOG_LEVEL=info
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=public
```

> [!TIP]
> Untuk menghasilkan nilai `APP_KEY`, jalankan di terminal lokal:
> ```bash
> php artisan key:generate --show
> ```
> Salin string `base64:...` yang muncul ke variabel `APP_KEY` di atas.

---

### 6. Domain Kustom & SSL Let's Encrypt Otomatis

1. **DNS Management**:
   - Tambahkan **A Record** pada domain/subdomain Anda (misal `maintenance.domainanda.com`) yang mengarah ke `<IP_VPS_ANDA>`.
2. **Pengaturan Domain di Coolify**:
   - Di kolom **Domains**, masukkan URL lengkap dengan skema `https://`:
     ```text
     https://maintenance.domainanda.com
     ```
3. Klik **Deploy** / **Redeploy**.
4. Coolify dan Traefik akan secara otomatis menerbitkan sertifikat SSL gratis dari Let's Encrypt dalam hitungan detik.

---

### 7. Navigasi Rute Aplikasi di Server

Setelah deployment selesai, aplikasi dapat diakses dengan rute:
- **`https://maintenance.domainanda.com/`**
  - Menyajikan antarmuka **Pure React 18 SPA (WOSys ERP)** lengkap dengan 11 modul: Dashboard KPI, Monitoring Armada, Work Orders, Backlog Defect, Hour Meter & Fuel, Inspeksi P2H Digital, Katalog Part & Stok, Special Tools Tracker, Swab Komponen, FAR Laporan Kerusakan, Notulen Rapat, dan Status Server.
- **`https://maintenance.domainanda.com/api/backup/download`**
  - Tombol unduh arsip mandiri (.ZIP) yang mengompresi database SQLite, seluruh file unggahan fisik, dan data JSON terstruktur.
- **`https://maintenance.domainanda.com/api/maintenance/router`**
  - REST API endpoint untuk seluruh operasi sinkronisasi data.

---

### 8. Panduan Pencadangan & Pemulihan (Backup & Restore)

#### Cara Backup:
Klik tombol **"Backup .ZIP"** pada dashboard atau buka endpoint `https://maintenance.domainanda.com/api/backup/download`.

#### Cara Restore ke VPS Baru:
1. Ekstrak berkas `BACKUP_WOSYS_ERP_*.zip`.
2. Salin file `database/database.sqlite` ke dalam container / persistent volume host.
3. Salin file-file di dalam folder `storage_files/` ke `/var/www/html/storage/app/public/`.
4. Berikan izin akses yang benar:
   ```bash
   chown -R www-data:www-data /var/www/html/storage /var/www/html/database
   chmod -R 775 /var/www/html/storage /var/www/html/database
   ```
5. Bersihkan cache:
   ```bash
   php artisan optimize:clear
   ```
