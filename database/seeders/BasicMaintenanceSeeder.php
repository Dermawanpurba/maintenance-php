<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PmRecord;

class BasicMaintenanceSeeder extends Seeder
{
    public function run(): void
    {
        $records = [
            [
                'item_id' => 'BM-001',
                'tanggal' => '2026-09-18',
                'equip_no' => 'EX1210',
                'pm_type' => 'weekly_inspection',
                'washing_check' => 'OK',
                'greasing_check' => 'OK',
                'inspection_check' => 'OK',
                'torque_check' => 'OK',
                'battery_check' => 'OK',
                'mechanic' => 'Rahmat Hidayat (Lead Tech)',
                'notes' => 'Weekly inspection complete. Hydraulic cylinder lines, track links, and cabin monitor indicators normal.',
                'hm_pm' => 47006,
                'status' => 'Completed'
            ],
            [
                'item_id' => 'BM-002',
                'tanggal' => '2026-09-18',
                'equip_no' => 'EX1210',
                'pm_type' => 'daily_greasing',
                'washing_check' => 'OK',
                'greasing_check' => 'OK (24 Points)',
                'inspection_check' => 'OK',
                'torque_check' => 'OK',
                'battery_check' => 'OK',
                'mechanic' => 'Budi Santoso',
                'notes' => 'Full greasing on boom foot pin, arm cylinder, bucket linkages, and swing circle ring gear.',
                'hm_pm' => 47006,
                'status' => 'Completed'
            ],
            [
                'item_id' => 'BM-003',
                'tanggal' => '2026-09-17',
                'equip_no' => 'EX1210',
                'pm_type' => 'washing',
                'washing_check' => 'High Pressure OK',
                'greasing_check' => 'OK',
                'inspection_check' => 'OK',
                'torque_check' => 'OK',
                'battery_check' => 'OK',
                'mechanic' => 'Tim Washing Pit A',
                'notes' => 'High-pressure undercarriage mud removal and radiator cooler fin cleaning completed.',
                'hm_pm' => 46980,
                'status' => 'Completed'
            ],
            [
                'item_id' => 'BM-004',
                'tanggal' => '2026-09-16',
                'equip_no' => 'EX1210',
                'pm_type' => 'ac_electrical',
                'washing_check' => 'OK',
                'greasing_check' => 'OK',
                'inspection_check' => 'OK',
                'torque_check' => 'OK',
                'battery_check' => '28.2V Charging OK',
                'mechanic' => 'Agus Subekti (Auto Electrician)',
                'notes' => 'AC cabin filter washed, blower motor tested, alternator output stable at 28.2V, battery terminals greased.',
                'hm_pm' => 46950,
                'status' => 'Completed'
            ],
            [
                'item_id' => 'BM-005',
                'tanggal' => '2026-09-15',
                'equip_no' => 'EX1210',
                'pm_type' => 'bucket_blade',
                'washing_check' => 'OK',
                'greasing_check' => 'OK',
                'inspection_check' => 'OK',
                'torque_check' => 'OK',
                'battery_check' => 'OK',
                'mechanic' => 'Joko Priyono',
                'notes' => 'Tooth bucket, side cutters, and lip shroud inspected. Sisa keausan tooth 75%, aman untuk 250 jam ke depan.',
                'hm_pm' => 46920,
                'status' => 'Completed'
            ],
            [
                'item_id' => 'BM-006',
                'tanggal' => '2026-09-14',
                'equip_no' => 'EX1210',
                'pm_type' => 'clean_undercarriage',
                'washing_check' => 'OK',
                'greasing_check' => 'OK',
                'inspection_check' => 'OK',
                'torque_check' => 'OK',
                'battery_check' => 'OK',
                'mechanic' => 'Tim Undercarriage',
                'notes' => 'Pembersihan material batubara dan batu lempung padat di sekeliling track roller, carrier roller, dan idler guard.',
                'hm_pm' => 46900,
                'status' => 'Completed'
            ],
            [
                'item_id' => 'BM-007',
                'tanggal' => '2026-09-13',
                'equip_no' => 'EX1210',
                'pm_type' => 'retorque_uc',
                'washing_check' => 'OK',
                'greasing_check' => 'OK',
                'inspection_check' => 'OK',
                'torque_check' => 'Torque Wrench 580 Nm OK',
                'battery_check' => 'OK',
                'mechanic' => 'Dwi Prasetyo',
                'notes' => 'Retorque sampling 20% track shoe bolts, sprocket mounting bolts, dan final drive bolts. Semua kencang sesuai spek.',
                'hm_pm' => 46880,
                'status' => 'Completed'
            ],
            [
                'item_id' => 'BM-008',
                'tanggal' => '2026-09-12',
                'equip_no' => 'DT230',
                'pm_type' => 'tyre_inspection',
                'washing_check' => 'OK',
                'greasing_check' => 'OK',
                'inspection_check' => 'OK',
                'torque_check' => 'Wheel Nuts Retorqued',
                'battery_check' => 'OK',
                'mechanic' => 'Tim Tyre Management',
                'notes' => 'Pemeriksaan tekanan ban 105 PSI semua posisi 1-6. Tread depth rata-rata 65 mm. Bebas dari separation & cut.',
                'hm_pm' => 23150,
                'status' => 'Completed'
            ]
        ];

        foreach ($records as $r) {
            PmRecord::updateOrCreate(['item_id' => $r['item_id']], $r);
        }
    }
}
