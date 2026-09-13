# WOSys ERP - Enterprise Maintenance Management System
## Standalone Laravel 13 & SQLite 3 Migration

Proyek ini merupakan hasil migrasi profesional dari aplikasi **Google Apps Script (GAS)** (`code.gs` & `index.html`) menjadi aplikasi **Standalone PHP Laravel 13** dengan database lokal **SQLite 3** dan dukungan ekspor **MySQL / phpMyAdmin**.

---

### 🚀 Cara Menjalankan (1-Click Launcher)

1. Cukup klik ganda (double-click) file:
   ```cmd
   BUKA-MAINTENANCE.bat
   ```
2. File batch akan secara otomatis:
   - Memeriksa database SQLite (melakukan migrasi & seeding otomatis jika belum ada).
   - Menghapus cache view dan route.
   - Menjalankan server Laravel di port `8003` (`http://localhost:8003/`).
   - Membuka browser default secara otomatis.

---

### 🔐 Akun Login Default (Pre-Seeded)

| Role | Username | Password Default | Status |
| :--- | :--- | :--- | :--- |
| **Admin / Logistic** | `admin` | `123456` | ACTIVE |
| **Planner** | `planner` | `123456` | ACTIVE |
| **Supervisor** | `supervisor` | `123456` | ACTIVE |
| **Mekanik 1** | `mekanik1` | `123456` | ACTIVE |
| **Mekanik 2** | `mekanik2` | `123456` | ACTIVE |
| **Operator** | `operator` | `123456` | ACTIVE |

---

### 🛠️ Arsitektur & Spesifikasi Teknis

- **Framework**: Laravel 13.x (PHP 8.2+)
- **Database Utama**: SQLite 3 (`database/database.sqlite` - Zero-Config, tanpa perlu start XAMPP MySQL).
- **Ekspor MySQL / phpMyAdmin**: `database/maintenance_database_phpmyadmin.sql` (dapat langsung di-import ke phpMyAdmin jika ingin berpindah ke MySQL).
- **Port Khusus**: `8003` (menghindari bentrok dengan port 8000, 8001, atau 8002).
- **Frontend SPA**: Pure **React 18 + Vite + TailwindCSS + Lucide Icons** (`frontend-react/` - Viewport `100dvh`, 11 Modul ERP Pemeliharaan Terpadu: Dashboard KPI, Monitoring Armada, Work Order, Backlog Defect, Log Hour Meter & Fuel, Inspeksi P2H, Katalog Part & Stok, Special Tools Tracker, Swab Komponen, FAR, Notulen Rapat, dan Status Sistem).
- **API Router Terpadu**:
  - Endpoint: `POST /api/maintenance/router`
  - Kompatibel 100% dengan payload GAS `fetchGAS(action, data)` tanpa mengubah logika JavaScript yang ada.

---

### 📂 Struktur Data & Tabel (26 Tabel Database)

1. `users` - Autentikasi dan data pengguna
2. `user_access` - Hak akses menu per username
3. `master_equips` - Data master unit / alat berat
4. `master_parts` - Master katalog sparepart & harga
5. `stocks` - Lokasi fisik, stok minimum, dan saldo part
6. `master_components` - Katalog komponen mesin/alat
7. `master_mekaniks` - Master teknisi dan spesialisasi
8. `master_pelapors` - Master personil pelapor
9. `master_tools` - Master alat/special tools & peminjaman
10. `plan_alats` - Rencana jam operasi unit bulanan
11. `plan_services` - Rencana jadwal servis berkala (PM)
12. `work_orders` - Transaksi Surat Perintah Kerja (WO)
13. `backlogs` - Temuan defect / pekerjaan tunda
14. `daily_hms` - Log harian Hour Meter & Fuel
15. `mechanic_activities` - Log aktivitas harian mekanik
16. `service_histories` - Riwayat servis & penggantian part
17. `inspections` - Form inspeksi kelayakan unit (P2H)
18. `pcr_components` - Penggantian & perbaikan komponen
19. `pm_records` - Eksekusi Preventive Maintenance
20. `monthly_budgets` - Anggaran biaya pemeliharaan bulanan
21. `equipment_costs` - Realisasi biaya per alat
22. `failure_analyses` - Laporan investigasi kerusakan (FAR)
23. `swab_components` - Log kanibalisasi / swap part
24. `meeting_notes` - Notulen rapat operasional plant
25. `settings` - Pengaturan perusahaan & dokumen
26. `system_logs` - Audit trail & histori aktivitas sistem

---

### 💻 Menjalankan Manual Melalui Terminal

```bash
# Pindah ke direktori
cd "c:\xampp\htdocs\maintenance v1 migrasi laravel"

# Jalankan server
php artisan serve --port=8003 --host=127.0.0.1
```

Akses sistem di browser:
- Web Application: [http://localhost:8003/](http://localhost:8003/)
- Classic ERP Suite: [http://localhost:8003/classic](http://localhost:8003/classic)
- 1-Click Backup: [http://localhost:8003/api/backup/download](http://localhost:8003/api/backup/download)
- API Router: [http://localhost:8003/api/maintenance/router](http://localhost:8003/api/maintenance/router)

---

### 🌐 Standar Deployment VPS Coolify & Modern React Dashboard

Proyek ini telah dikonfigurasi penuh mengikuti blueprint [`vps-coolify-laravel-react`](file:///c:/xampp/htdocs/.agents/skills/vps_coolify_laravel_react/SKILL.md):
- **Container Engine**: `Dockerfile` Multi-Stage (Node 20 Alpine + PHP 8.4-FPM + Nginx + SQLite WAL + Supervisor).
- **Persistent Volumes**:
  - `/var/www/html/database` (Data SQLite anti-hilang saat rebuild).
  - `/var/www/html/storage/app/public` (File unggahan pengguna).
- **Hardening Keamanan**: Middleware `SecurityHeaders.php` (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) dan proteksi anti-git di Nginx / Apache.
- **Frontend Dual-Layer**:
  - `frontend-react/`: Modern React Vite + Tailwind executive dashboard (Viewport `100dvh`, KPI stats, Live Fleet Status, Backup trigger).
  - `/classic` & `/maintenance`: Akses langsung ke seluruh 17.750+ baris modul ERP bawaan.
- **1-Click Backup**: Endpoint `/api/backup/download` yang mengemas database SQLite, seluruh file storage, dan JSON dump ke dalam format `.ZIP`.
- **Panduan Operasional Coolify**: Silakan merujuk ke berkas [COOLIFY.md](file:///C:/xampp/htdocs/maintenance%20v1%20migrasi%20laravel/COOLIFY.md).

