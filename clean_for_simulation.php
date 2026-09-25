<?php

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=======================================================" . PHP_EOL;
echo "  WOSys ERP — PEMBERSIHAN DATA TRANSAKSI UNTUK SIMULASI " . PHP_EOL;
echo "=======================================================" . PHP_EOL;

$tablesToClear = [
    'ps_schedule_backlogs' => 'Relasi Bundling Backlog PS Schedule',
    'ps_schedules'         => 'Jadwal Servis Berkala (PS Schedule)',
    'work_order_parts'     => 'Pemakaian Part Work Order',
    'work_orders'          => 'Transaksi Work Order (WO)',
    'backlogs'             => 'Daftar Temuan Defect Backlog',
    'pm_records'           => 'Catatan Hasil Preventive Maintenance',
    'service_histories'    => 'Riwayat Servis Alat',
    'daily_hms'            => 'Pencatatan HM Harian Unit',
    'inspections'          => 'Formulir P2H / Inspeksi Harian',
    'oil_samples'          => 'Sample Analisis Pelumas (PAP / SOS Lab)',
    'ppu_records'          => 'Inspeksi Undercarriage Chassis (CTS PPC)',
    'target_jam_harian'    => 'Target Jam Operasi Harian & Breakdown',
    'target_jam_operasi'   => 'Rencana Target Jam Operasi Bulanan',
    'failure_analyses'     => 'Analisa Kegagalan Komponen (FAR)',
    'pcr_components'       => 'Plan Component Replacement (PCR)',
    'swab_components'      => 'Riwayat Kanibalisasi Komponen (Swab)',
    'equipment_costs'      => 'Biaya Pemeliharaan Unit Alat',
    'mechanic_activities'  => 'Catatan Aktivitas Harian Mekanik',
    'meeting_notes'        => 'Notulen Rapat Perencanaan Plant',
    'monthly_budgets'      => 'Rencana Anggaran Biaya Bulanan',
    'system_logs'          => 'Catatan Log Sistem',
];

DB::beginTransaction();

try {
    echo PHP_EOL . ">>> MENGOSONGKAN TABEL TRANSAKSI & OPERASIONAL:" . PHP_EOL;
    foreach ($tablesToClear as $table => $desc) {
        $count = DB::table($table)->count();
        DB::table($table)->delete();
        // Reset sqlite_sequence auto increment
        DB::table('sqlite_sequence')->where('name', $table)->delete();
        echo "  [CLEARED] {$table} ({$count} baris) — {$desc}" . PHP_EOL;
    }

    // Kembalikan status seluruh Master Unit ke 'READY'
    DB::table('master_equips')->update(['status' => 'READY']);
    echo PHP_EOL . "  [RESET] Seluruh unit di master_equips (" . DB::table('master_equips')->count() . " unit) di-reset statusnya ke 'READY'." . PHP_EOL;

    // Reset plan_services ke baseline awal seeder
    $planServicesBaseline = json_decode('[
        {"equip_no": "DZ-002", "model": "ZOOMLION ZD-320-3", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-18", "last_service_hm": 8250, "next_service_hm": 8500, "kategori": "SERVICE 250H"},
        {"equip_no": "DZ-005", "model": "SEM 822D", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-20", "last_service_hm": 7000, "next_service_hm": 7250, "kategori": "SERVICE 250H"},
        {"equip_no": "DZ-069", "model": "ZOOMLION ZD-220-3", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-17", "last_service_hm": 6750, "next_service_hm": 7000, "kategori": "SERVICE 250H"},
        {"equip_no": "DZ-007", "model": "CAT D8 GC", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-27", "last_service_hm": 11750, "next_service_hm": 12000, "kategori": "SERVICE 250H"},
        {"equip_no": "DZ-008", "model": "CAT D8 GC", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-22", "last_service_hm": 11500, "next_service_hm": 11750, "kategori": "SERVICE 250H"},
        {"equip_no": "DZ-010", "model": "CAT D8 GC", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-18", "last_service_hm": 9000, "next_service_hm": 9250, "kategori": "SERVICE 250H"},
        {"equip_no": "DZ-012", "model": "SEM 822D", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-14", "last_service_hm": 7000, "next_service_hm": 7250, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-201", "model": "HYUNDAY HX220S", "plan_hours_per_month": 720, "plan_pa": 88, "last_service_date": "2026-08-18", "last_service_hm": 4250, "next_service_hm": 4500, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-205", "model": "CAT 320 GX", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-26", "last_service_hm": 4250, "next_service_hm": 4500, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-302", "model": "SANY SY330H", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-12", "last_service_hm": 3750, "next_service_hm": 4000, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-304", "model": "SANY SY330H", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-14", "last_service_hm": 3000, "next_service_hm": 3250, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-305", "model": "SANY SY330H", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-16", "last_service_hm": 2750, "next_service_hm": 3000, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-306", "model": "DOSAN DX300LCA-7M", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-16", "last_service_hm": 5250, "next_service_hm": 5500, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-309", "model": "CAT 330 GX", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-22", "last_service_hm": 250, "next_service_hm": 500, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-310", "model": "CAT 330 GX", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-10", "last_service_hm": 1500, "next_service_hm": 1750, "kategori": "SERVICE 250H"},
        {"equip_no": "EX-311", "model": "CAT 330 GX", "plan_hours_per_month": 720, "plan_pa": 90, "last_service_date": "2026-08-10", "last_service_hm": 1500, "next_service_hm": 1750, "kategori": "SERVICE 250H"},
        {"equip_no": "WL-010", "model": "SEM 660D", "plan_hours_per_month": 720, "plan_pa": 88, "last_service_date": "2026-08-16", "last_service_hm": 5000, "next_service_hm": 5500, "kategori": "SERVICE 500H"},
        {"equip_no": "WL-016", "model": "LIUGONG T-930", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-18", "last_service_hm": 2000, "next_service_hm": 2500, "kategori": "SERVICE 500H"},
        {"equip_no": "WL-017", "model": "LOVOL FL955F-II", "plan_hours_per_month": 720, "plan_pa": 88, "last_service_date": "2026-08-18", "last_service_hm": 6750, "next_service_hm": 7250, "kategori": "SERVICE 500H"},
        {"equip_no": "WL-019", "model": "LIU GONG CLG870H", "plan_hours_per_month": 720, "plan_pa": 85, "last_service_date": "2026-08-24", "last_service_hm": 3750, "next_service_hm": 4250, "kategori": "SERVICE 500H"},
        {"equip_no": "SL-100", "model": "BOBCAT S570", "plan_hours_per_month": 640, "plan_pa": 90, "last_service_date": "2026-08-14", "last_service_hm": 1750, "next_service_hm": 2000, "kategori": "SERVICE 250H"},
        {"equip_no": "SL-200", "model": "LIUGONG CLG375B", "plan_hours_per_month": 640, "plan_pa": 90, "last_service_date": "2026-08-16", "last_service_hm": 2250, "next_service_hm": 2500, "kategori": "SERVICE 250H"},
        {"equip_no": "SL-300", "model": "CAT 226B3", "plan_hours_per_month": 640, "plan_pa": 90, "last_service_date": "2026-08-12", "last_service_hm": 1750, "next_service_hm": 2000, "kategori": "SERVICE 250H"},
        {"equip_no": "SL-400", "model": "LIUGONG CLG375B", "plan_hours_per_month": 640, "plan_pa": 90, "last_service_date": "2026-08-18", "last_service_hm": 1500, "next_service_hm": 1750, "kategori": "SERVICE 250H"},
        {"equip_no": "DT-3011", "model": "SHACMAN F3000", "plan_hours_per_month": 800, "plan_pa": 90, "last_service_date": "2026-08-24", "last_service_hm": 6000, "next_service_hm": 6500, "kategori": "SERVICE 500H"},
        {"equip_no": "DT-3012", "model": "SHACMAN F3000", "plan_hours_per_month": 800, "plan_pa": 90, "last_service_date": "2026-08-20", "last_service_hm": 5250, "next_service_hm": 5750, "kategori": "SERVICE 500H"},
        {"equip_no": "DT-3017", "model": "SHACMAN F3000", "plan_hours_per_month": 800, "plan_pa": 90, "last_service_date": "2026-08-22", "last_service_hm": 5750, "next_service_hm": 6250, "kategori": "SERVICE 500H"},
        {"equip_no": "DT-3018", "model": "SHACMAN F3000", "plan_hours_per_month": 800, "plan_pa": 90, "last_service_date": "2026-08-18", "last_service_hm": 4750, "next_service_hm": 5250, "kategori": "SERVICE 500H"},
        {"equip_no": "DT-3019", "model": "SHACMAN F3000", "plan_hours_per_month": 800, "plan_pa": 90, "last_service_date": "2026-08-17", "last_service_hm": 6250, "next_service_hm": 6750, "kategori": "SERVICE 500H"},
        {"equip_no": "WT-009", "model": "QUESTER CWE 280", "plan_hours_per_month": 720, "plan_pa": 92, "last_service_date": "2026-08-12", "last_service_hm": 3250, "next_service_hm": 3750, "kategori": "SERVICE 500H"},
        {"equip_no": "WT-011", "model": "QUESTER CWE 280", "plan_hours_per_month": 720, "plan_pa": 92, "last_service_date": "2026-08-20", "last_service_hm": 3000, "next_service_hm": 3500, "kategori": "SERVICE 500H"},
        {"equip_no": "ST-002", "model": "FAW 140LT", "plan_hours_per_month": 600, "plan_pa": 92, "last_service_date": "2026-08-27", "last_service_hm": 750, "next_service_hm": 1000, "kategori": "SERVICE 250H"},
        {"equip_no": "GST-003", "model": "V-GEN VG40-I", "plan_hours_per_month": 720, "plan_pa": 95, "last_service_date": "2026-08-17", "last_service_hm": 4750, "next_service_hm": 5250, "kategori": "SERVICE 500H"},
        {"equip_no": "GST-004", "model": "V-GEN VG40-I", "plan_hours_per_month": 720, "plan_pa": 95, "last_service_date": "2026-08-22", "last_service_hm": 4500, "next_service_hm": 5000, "kategori": "SERVICE 500H"}
    ]', true);

    DB::table('plan_services')->truncate();
    foreach ($planServicesBaseline as &$ps) {
        $ps['created_at'] = '2026-09-13 08:00:00';
        $ps['updated_at'] = '2026-09-13 08:00:00';
    }
    DB::table('plan_services')->insert($planServicesBaseline);
    echo "  [RESET] Tabel plan_services di-reset ke baseline 34 unit armada." . PHP_EOL;

    DB::commit();
    echo PHP_EOL . ">>> TRANSAKSI BERHASIL DI-COMMIT. DATABASE SIAP UNTUK SIMULASI!" . PHP_EOL;

} catch (\Exception $e) {
    DB::rollBack();
    echo PHP_EOL . "[ERROR] Terjadi kesalahan: " . $e->getMessage() . PHP_EOL;
}

echo PHP_EOL . "=== STATUS MASTER DATA YANG DIPERTAHANKAN ===" . PHP_EOL;
$masterTables = [
    'master_equips'     => 'Master Unit Alat Berat',
    'master_models'     => 'Master Model Alat Berat',
    'master_components' => 'Master Komponen Alat',
    'master_parts'      => 'Master Katalog Suku Cadang',
    'master_mekaniks'   => 'Master Data Mekanik',
    'master_pelapors'   => 'Master Data Pelapor',
    'master_tools'      => 'Master Peralatan Khusus (Special Tools)',
    'stocks'            => 'Master Stok Gudang Suku Cadang',
    'part_services'     => 'Master Matriks Suku Cadang Servis (BOM)',
    'plan_alats'        => 'Master Rencana Alokasi Alat',
    'plan_services'     => 'Master Rencana Servis Baseline',
    'app_users'         => 'Akun Pengguna Aplikasi',
    'user_access'       => 'Hak Akses Pengguna Fitur ERP',
    'settings'          => 'Konfigurasi Sistem',
];

foreach ($masterTables as $table => $desc) {
    $count = DB::table($table)->count();
    echo str_pad($table, 20) . ": " . str_pad($count . " baris", 12) . " [AMAN] — {$desc}" . PHP_EOL;
}
