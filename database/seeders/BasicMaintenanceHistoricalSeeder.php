<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaintenanceWeek;
use App\Models\PmRecord;

class BasicMaintenanceHistoricalSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Database Maintenance Weeks Table
        $weeks = [
            [
                'week_no' => 'WEEK 40',
                'label' => 'Week 40 (01 Okt - 07 Okt 2026)',
                'start_date' => '2026-10-01',
                'end_date' => '2026-10-07',
                'is_active' => false,
                'target_compliance' => 100,
                'notes' => 'Periode Audit Awal Bulan Oktober Site Mining'
            ],
            [
                'week_no' => 'WEEK 41',
                'label' => 'Week 41 (08 Okt - 14 Okt 2026)',
                'start_date' => '2026-10-08',
                'end_date' => '2026-10-14',
                'is_active' => false,
                'target_compliance' => 100,
                'notes' => 'Periode Pelaksanaan Rutin Minggu ke-2'
            ],
            [
                'week_no' => 'WEEK 42',
                'label' => 'Week 42 (15 Okt - 21 Okt 2026)',
                'start_date' => '2026-10-15',
                'end_date' => '2026-10-21',
                'is_active' => false,
                'target_compliance' => 100,
                'notes' => 'Pemeriksaan Intensif & Mid-Month Inspection'
            ],
            [
                'week_no' => 'WEEK 43',
                'label' => 'Week 43 (22 Okt - 28 Okt 2026)',
                'start_date' => '2026-10-22',
                'end_date' => '2026-10-28',
                'is_active' => true,
                'target_compliance' => 100,
                'notes' => 'Periode Berjalan Aktif (Current Active Operational Week)'
            ]
        ];

        foreach ($weeks as $w) {
            MaintenanceWeek::updateOrCreate(['week_no' => $w['week_no']], $w);
        }

        // 2. Seed Actual Historical Operational Records into pm_records
        // This ensures the database is the TRUE Single Source of Truth
        $historicalData = [
            // WEEK 40
            ['item_id' => 'BM-W40-01', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_inspection', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-02', 'achievement_pct' => 130, 'hm_pm' => 46700, 'mechanic' => 'Rahmat Hidayat (Lead Tech)', 'notes' => 'Weekly Inspection W40 tuntas melebihi target compliance.'],
            ['item_id' => 'BM-W40-02', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_greasing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-03', 'achievement_pct' => 113, 'hm_pm' => 46720, 'mechanic' => 'Budi Santoso', 'notes' => 'Pelumasan harian pin boom dan arm tuntas.'],
            ['item_id' => 'BM-W40-03', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_ac_electrical', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-04', 'achievement_pct' => 105, 'hm_pm' => 46740, 'mechanic' => 'Agus Subekti', 'notes' => 'Pengujian alternator 28V dan filter AC kabin OK.'],
            ['item_id' => 'BM-W40-04', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_bucket_blade', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-05', 'achievement_pct' => 100, 'hm_pm' => 46760, 'mechanic' => 'Joko Priyono', 'notes' => 'Inspeksi keausan tooth bucket dan adapter 100% normal.'],
            ['item_id' => 'BM-W40-05', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_washing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-05', 'achievement_pct' => 60, 'hm_pm' => 46760, 'mechanic' => 'Tim Washing Pit A', 'notes' => 'Terkendala pompa jet air pit A saat pencucian.'],
            ['item_id' => 'BM-W40-06', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_undercarriage', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-06', 'achievement_pct' => 100, 'hm_pm' => 46780, 'mechanic' => 'Tim Undercarriage', 'notes' => 'Pembersihan mud packing track roller selesai.'],
            ['item_id' => 'BM-W40-07', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_retorque', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-06', 'achievement_pct' => 80, 'hm_pm' => 46780, 'mechanic' => 'Dwi Prasetyo', 'notes' => 'Retorque baut shoe selesai 80% karena pergantian shift.'],
            ['item_id' => 'BM-W40-08', 'week_no' => 'WEEK 40', 'pm_type' => 'bm_tyre', 'equip_no' => 'DT230', 'tanggal' => '2026-10-07', 'achievement_pct' => 97, 'hm_pm' => 22900, 'mechanic' => 'Tim Tyre Management', 'notes' => 'Pemeriksaan tekanan ban 105 PSI semua roda normal.'],

            // WEEK 41
            ['item_id' => 'BM-W41-01', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_inspection', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-09', 'achievement_pct' => 126, 'hm_pm' => 46800, 'mechanic' => 'Rahmat Hidayat (Lead Tech)', 'notes' => 'Pemeriksaan rutin hidrolik dan mesin W41 berjalan prima.'],
            ['item_id' => 'BM-W41-02', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_greasing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-10', 'achievement_pct' => 115, 'hm_pm' => 46820, 'mechanic' => 'Budi Santoso', 'notes' => 'Greasing seluruh 24 titik pin arm dan boom selesai.'],
            ['item_id' => 'BM-W41-03', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_ac_electrical', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-11', 'achievement_pct' => 103, 'hm_pm' => 46840, 'mechanic' => 'Agus Subekti', 'notes' => 'Penggantian filter AC kabin dan cek kabel harness.'],
            ['item_id' => 'BM-W41-04', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_bucket_blade', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-12', 'achievement_pct' => 100, 'hm_pm' => 46860, 'mechanic' => 'Joko Priyono', 'notes' => 'Side cutter dan lip shroud kokoh tanpa keretakan.'],
            ['item_id' => 'BM-W41-05', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_washing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-12', 'achievement_pct' => 130, 'hm_pm' => 46860, 'mechanic' => 'Tim Washing Pit A', 'notes' => 'Pencucian bodi dan radiator fin bersih optimal.'],
            ['item_id' => 'BM-W41-06', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_undercarriage', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-13', 'achievement_pct' => 100, 'hm_pm' => 46880, 'mechanic' => 'Tim Undercarriage', 'notes' => 'Pembersihan endapan lumpur mengeras tuntas 100%.'],
            ['item_id' => 'BM-W41-07', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_retorque', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-13', 'achievement_pct' => 100, 'hm_pm' => 46880, 'mechanic' => 'Dwi Prasetyo', 'notes' => 'Retorque baut shoe 580 Nm tuntas 100% sesuai standar.'],
            ['item_id' => 'BM-W41-08', 'week_no' => 'WEEK 41', 'pm_type' => 'bm_tyre', 'equip_no' => 'DT230', 'tanggal' => '2026-10-14', 'achievement_pct' => 96, 'hm_pm' => 23000, 'mechanic' => 'Tim Tyre Management', 'notes' => 'Tread depth rata-rata 64mm, aman operasi.'],

            // WEEK 42
            ['item_id' => 'BM-W42-01', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_inspection', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-16', 'achievement_pct' => 135, 'hm_pm' => 46900, 'mechanic' => 'Rahmat Hidayat (Lead Tech)', 'notes' => 'Inspeksi komprehensif struktur dan kebocoran silinder W42.'],
            ['item_id' => 'BM-W42-02', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_greasing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-17', 'achievement_pct' => 114, 'hm_pm' => 46920, 'mechanic' => 'Budi Santoso', 'notes' => 'Greasing harian swing bearing dan center joint tuntas.'],
            ['item_id' => 'BM-W42-03', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_ac_electrical', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-18', 'achievement_pct' => 117, 'hm_pm' => 46940, 'mechanic' => 'Agus Subekti', 'notes' => 'Tegangan baterai 28.4V prima, kelistrikan lampu operasi terang.'],
            ['item_id' => 'BM-W42-04', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_bucket_blade', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-19', 'achievement_pct' => 100, 'hm_pm' => 46960, 'mechanic' => 'Joko Priyono', 'notes' => 'Pemeriksaan retainer pin tooth bucket tuntas.'],
            ['item_id' => 'BM-W42-05', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_washing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-19', 'achievement_pct' => 100, 'hm_pm' => 46960, 'mechanic' => 'Tim Washing Pit A', 'notes' => 'High pressure washing bodi dan undercarriage selesai.'],
            ['item_id' => 'BM-W42-06', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_undercarriage', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-20', 'achievement_pct' => 100, 'hm_pm' => 46980, 'mechanic' => 'Tim Undercarriage', 'notes' => 'Pembersihan ruang recoil spring dan sprocket teeth.'],
            ['item_id' => 'BM-W42-07', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_retorque', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-20', 'achievement_pct' => 100, 'hm_pm' => 46980, 'mechanic' => 'Dwi Prasetyo', 'notes' => 'Retorque sampling track bolts 100% kencang.'],
            ['item_id' => 'BM-W42-08', 'week_no' => 'WEEK 42', 'pm_type' => 'bm_tyre', 'equip_no' => 'DT230', 'tanggal' => '2026-10-21', 'achievement_pct' => 123, 'hm_pm' => 23100, 'mechanic' => 'Tim Tyre Management', 'notes' => 'Pemeriksaan ban posisi 1-6 dan audit torsi baut roda.'],

            // WEEK 43
            ['item_id' => 'BM-W43-01', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_inspection', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-23', 'achievement_pct' => 152, 'hm_pm' => 47006, 'mechanic' => 'Rahmat Hidayat (Lead Tech)', 'notes' => 'Weekly inspection lengkap tuntas 152% compliance.'],
            ['item_id' => 'BM-W43-02', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_greasing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-24', 'achievement_pct' => 119, 'hm_pm' => 47020, 'mechanic' => 'Budi Santoso', 'notes' => 'Greasing seluruh 24 titik pin arm, boom, dan bucket.'],
            ['item_id' => 'BM-W43-03', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_ac_electrical', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-24', 'achievement_pct' => 118, 'hm_pm' => 47020, 'mechanic' => 'Agus Subekti', 'notes' => 'Alternator charging output stabil 28.2V, AC dingin.'],
            ['item_id' => 'BM-W43-04', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_bucket_blade', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-25', 'achievement_pct' => 100, 'hm_pm' => 47040, 'mechanic' => 'Joko Priyono', 'notes' => 'Sisa keausan tooth 75%, kondisi aman 250 jam.'],
            ['item_id' => 'BM-W43-05', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_washing', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-25', 'achievement_pct' => 180, 'hm_pm' => 47040, 'mechanic' => 'Tim Washing Pit A', 'notes' => 'Extra washing undercarriage dan cooler radiator fin.'],
            ['item_id' => 'BM-W43-06', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_undercarriage', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-26', 'achievement_pct' => 100, 'hm_pm' => 47060, 'mechanic' => 'Tim Undercarriage', 'notes' => 'Pembersihan mud packing dan batu terselip di idler.'],
            ['item_id' => 'BM-W43-07', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_retorque', 'equip_no' => 'EX1210', 'tanggal' => '2026-10-26', 'achievement_pct' => 100, 'hm_pm' => 47060, 'mechanic' => 'Dwi Prasetyo', 'notes' => 'Audit torsi baut track shoe 580 Nm tuntas 100%.'],
            ['item_id' => 'BM-W43-08', 'week_no' => 'WEEK 43', 'pm_type' => 'bm_tyre', 'equip_no' => 'DT230', 'tanggal' => '2026-10-27', 'achievement_pct' => 121, 'hm_pm' => 23150, 'mechanic' => 'Tim Tyre Management', 'notes' => 'Tekanan angin ban 105 PSI normal, tread depth 65mm.']
        ];

        foreach ($historicalData as $d) {
            PmRecord::updateOrCreate(
                ['item_id' => $d['item_id']],
                array_merge($d, [
                    'washing_check' => 'OK',
                    'greasing_check' => 'OK',
                    'inspection_check' => 'OK',
                    'torque_check' => 'OK',
                    'battery_check' => 'OK',
                    'status' => 'Completed',
                    'checklist_json' => json_encode([
                        ['item' => 'Verifikasi fisik komponen utama', 'checked' => true],
                        ['item' => 'Pemeriksaan kelayakan operasional', 'checked' => true]
                    ])
                ])
            );
        }
    }
}
