<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaintenanceWeek;
use App\Models\PmRecord;

class BasicMaintenanceHistoricalSeeder extends Seeder
{
    public function run(): void
    {
        // Remove obsolete demo periods/records so reseeding cannot leave October data behind.
        MaintenanceWeek::query()->whereNotIn('week_no', ['WEEK 36', 'WEEK 37', 'WEEK 38'])->delete();
        PmRecord::query()->where('item_id', 'like', 'BM-W%')->delete();

        // 1. Seed Database Maintenance Weeks Table
        $weeks = [
            [
                'week_no' => 'WEEK 36',
                'label' => 'Week 36 (01 Sep - 06 Sep 2026)',
                'start_date' => '2026-09-01',
                'end_date' => '2026-09-06',
                'is_active' => false,
                'target_compliance' => 100,
                'notes' => 'Periode Audit Awal Bulan September Site Mining'
            ],
            [
                'week_no' => 'WEEK 37',
                'label' => 'Week 37 (07 Sep - 13 Sep 2026)',
                'start_date' => '2026-09-07',
                'end_date' => '2026-09-13',
                'is_active' => false,
                'target_compliance' => 100,
                'notes' => 'Periode Pelaksanaan Rutin Minggu ke-2'
            ],
            [
                'week_no' => 'WEEK 38',
                'label' => 'Week 38 (14 Sep - 20 Sep 2026)',
                'start_date' => '2026-09-14',
                'end_date' => '2026-09-20',
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
            // WEEK 36
            ['item_id' => 'BM-W36-01', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_inspection', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-02', 'achievement_pct' => 130, 'hm_pm' => 46700, 'mechanic' => 'Rahmat Hidayat (Lead Tech)', 'notes' => 'Weekly Inspection W36 tuntas melebihi target compliance.'],
            ['item_id' => 'BM-W36-02', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_greasing', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-03', 'achievement_pct' => 113, 'hm_pm' => 46720, 'mechanic' => 'Budi Santoso', 'notes' => 'Pelumasan harian pin boom dan arm tuntas.'],
            ['item_id' => 'BM-W36-03', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_ac_electrical', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-04', 'achievement_pct' => 105, 'hm_pm' => 46740, 'mechanic' => 'Agus Subekti', 'notes' => 'Pengujian alternator 28V dan filter AC kabin OK.'],
            ['item_id' => 'BM-W36-04', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_bucket_blade', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-05', 'achievement_pct' => 100, 'hm_pm' => 46760, 'mechanic' => 'Joko Priyono', 'notes' => 'Inspeksi keausan tooth bucket dan adapter 100% normal.'],
            ['item_id' => 'BM-W36-05', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_washing', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-05', 'achievement_pct' => 60, 'hm_pm' => 46760, 'mechanic' => 'Tim Washing Pit A', 'notes' => 'Terkendala pompa jet air pit A saat pencucian.'],
            ['item_id' => 'BM-W36-06', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_undercarriage', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-06', 'achievement_pct' => 100, 'hm_pm' => 46780, 'mechanic' => 'Tim Undercarriage', 'notes' => 'Pembersihan mud packing track roller selesai.'],
            ['item_id' => 'BM-W36-07', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_retorque', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-06', 'achievement_pct' => 80, 'hm_pm' => 46780, 'mechanic' => 'Dwi Prasetyo', 'notes' => 'Retorque baut shoe selesai 80% karena pergantian shift.'],
            ['item_id' => 'BM-W36-08', 'week_no' => 'WEEK 36', 'pm_type' => 'bm_tyre', 'equip_no' => 'DT230', 'tanggal' => '2026-09-06', 'achievement_pct' => 97, 'hm_pm' => 22900, 'mechanic' => 'Tim Tyre Management', 'notes' => 'Pemeriksaan tekanan ban 105 PSI semua roda normal.'],

            // WEEK 37
            ['item_id' => 'BM-W37-01', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_inspection', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-08', 'achievement_pct' => 126, 'hm_pm' => 46800, 'mechanic' => 'Rahmat Hidayat (Lead Tech)', 'notes' => 'Pemeriksaan rutin hidrolik dan mesin W37 berjalan prima.'],
            ['item_id' => 'BM-W37-02', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_greasing', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-09', 'achievement_pct' => 115, 'hm_pm' => 46820, 'mechanic' => 'Budi Santoso', 'notes' => 'Greasing seluruh 24 titik pin arm dan boom selesai.'],
            ['item_id' => 'BM-W37-03', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_ac_electrical', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-10', 'achievement_pct' => 103, 'hm_pm' => 46840, 'mechanic' => 'Agus Subekti', 'notes' => 'Penggantian filter AC kabin dan cek kabel harness.'],
            ['item_id' => 'BM-W37-04', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_bucket_blade', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-11', 'achievement_pct' => 100, 'hm_pm' => 46860, 'mechanic' => 'Joko Priyono', 'notes' => 'Side cutter dan lip shroud kokoh tanpa keretakan.'],
            ['item_id' => 'BM-W37-05', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_washing', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-11', 'achievement_pct' => 130, 'hm_pm' => 46860, 'mechanic' => 'Tim Washing Pit A', 'notes' => 'Pencucian bodi dan radiator fin bersih optimal.'],
            ['item_id' => 'BM-W37-06', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_undercarriage', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-12', 'achievement_pct' => 100, 'hm_pm' => 46880, 'mechanic' => 'Tim Undercarriage', 'notes' => 'Pembersihan endapan lumpur mengeras tuntas 100%.'],
            ['item_id' => 'BM-W37-07', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_retorque', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-12', 'achievement_pct' => 100, 'hm_pm' => 46880, 'mechanic' => 'Dwi Prasetyo', 'notes' => 'Retorque baut shoe 580 Nm tuntas 100% sesuai standar.'],
            ['item_id' => 'BM-W37-08', 'week_no' => 'WEEK 37', 'pm_type' => 'bm_tyre', 'equip_no' => 'DT230', 'tanggal' => '2026-09-13', 'achievement_pct' => 96, 'hm_pm' => 23000, 'mechanic' => 'Tim Tyre Management', 'notes' => 'Tread depth rata-rata 64mm, aman operasi.'],

            // WEEK 38
            ['item_id' => 'BM-W38-01', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_inspection', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-15', 'achievement_pct' => 135, 'hm_pm' => 46900, 'mechanic' => 'Rahmat Hidayat (Lead Tech)', 'notes' => 'Inspeksi komprehensif struktur dan kebocoran silinder W38.'],
            ['item_id' => 'BM-W38-02', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_greasing', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-16', 'achievement_pct' => 114, 'hm_pm' => 46920, 'mechanic' => 'Budi Santoso', 'notes' => 'Greasing harian swing bearing dan center joint tuntas.'],
            ['item_id' => 'BM-W38-03', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_ac_electrical', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-17', 'achievement_pct' => 117, 'hm_pm' => 46940, 'mechanic' => 'Agus Subekti', 'notes' => 'Tegangan baterai 28.4V prima, kelistrikan lampu operasi terang.'],
            ['item_id' => 'BM-W38-04', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_bucket_blade', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-18', 'achievement_pct' => 100, 'hm_pm' => 46960, 'mechanic' => 'Joko Priyono', 'notes' => 'Pemeriksaan retainer pin tooth bucket tuntas.'],
            ['item_id' => 'BM-W38-05', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_washing', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-18', 'achievement_pct' => 100, 'hm_pm' => 46960, 'mechanic' => 'Tim Washing Pit A', 'notes' => 'High pressure washing bodi dan undercarriage selesai.'],
            ['item_id' => 'BM-W38-06', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_undercarriage', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-19', 'achievement_pct' => 100, 'hm_pm' => 46980, 'mechanic' => 'Tim Undercarriage', 'notes' => 'Pembersihan ruang recoil spring dan sprocket teeth.'],
            ['item_id' => 'BM-W38-07', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_retorque', 'equip_no' => 'EX1210', 'tanggal' => '2026-09-19', 'achievement_pct' => 100, 'hm_pm' => 46980, 'mechanic' => 'Dwi Prasetyo', 'notes' => 'Retorque sampling track bolts 100% kencang.'],
            ['item_id' => 'BM-W38-08', 'week_no' => 'WEEK 38', 'pm_type' => 'bm_tyre', 'equip_no' => 'DT230', 'tanggal' => '2026-09-20', 'achievement_pct' => 123, 'hm_pm' => 23100, 'mechanic' => 'Tim Tyre Management', 'notes' => 'Pemeriksaan ban posisi 1-6 dan audit torsi baut roda.'],

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
