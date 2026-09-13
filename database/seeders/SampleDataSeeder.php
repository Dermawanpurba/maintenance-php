<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Meeting Notes (Notulen Rapat Plant)
        DB::table('meeting_notes')->truncate();
        $meetingNotes = [
            [
                'item_id' => 'MEET-001',
                'tanggal' => '2026-09-08',
                'topic' => 'Evaluasi Kesiapan Alat Berat & Pencapaian Physical Availability (PA) Week 1',
                'leader' => 'Hariadi (GM Plant)',
                'attendees' => 'Andi Herwan (Planner), Brayen (Logistic), M. Nur Salam (Direksi), Foreman Mekanik',
                'discussion_summary' => 'Pembahasan evaluasi PA armada Excavator CAT 330 GX dan Bulldozer SEM 822D di site KBCT. Target PA minimum 88% saat ini tercapai 91%. Perhatian khusus pada unit DZ-007 yang mengalami overheat pada torque converter.',
                'action_items_json' => json_encode([
                    ['task' => 'Inspeksi oil cooler DZ-007', 'pic' => 'Tim Mekanik', 'deadline' => '2026-09-10'],
                    ['task' => 'Follow up order seal kit cylinder arm', 'pic' => 'Brayen (Logistic)', 'deadline' => '2026-09-11']
                ]),
                'status' => 'Open',
                'plant_health' => 'OPTIMAL (91% PA)',
                'critical_issue' => 'Overheat berkala pada DZ-007 saat dorong overburden berat',
                'operational_impact' => 'Potensi delay ripping & penataan disposal',
                'management_decision' => 'Segera lakukan flushing system pendingin DZ-007 dan alokasikan unit cadangan DZ-008 untuk penataan disposal utama.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'MEET-002',
                'tanggal' => '2026-09-11',
                'topic' => 'Rapat Koordinasi Kebutuhan Suku Cadang & Service 1000H EX-302',
                'leader' => 'Andi Herwan (PMC / Planner)',
                'attendees' => 'Brayen (Logistics), Tim Mekanik Shift, Supervisor Tambang',
                'discussion_summary' => 'Penjadwalan Service berkala 1000 Jam untuk EX-302 (SANY SY330H). Konfirmasi ketersediaan filter oli mesin, filter solar separator, dan oli hydraulic Tellus S2 68 di gudang utama.',
                'action_items_json' => json_encode([
                    ['task' => 'Persiapan part service 1000H', 'pic' => 'Logistik', 'deadline' => '2026-09-12'],
                    ['task' => 'Eksekusi service pada jam standby pit', 'pic' => 'Mekanik Shift 1', 'deadline' => '2026-09-13']
                ]),
                'status' => 'Scheduled',
                'plant_health' => 'OPTIMAL',
                'critical_issue' => 'Stok oli hydraulic di gudang menipis (sisa 2 drum)',
                'operational_impact' => 'Perlu PR darurat untuk 10 drum oli hidrolik',
                'management_decision' => 'PO darurat untuk 10 drum oli Shell Tellus disetujui Direksi. Eksekusi service EX-302 dijadwalkan Minggu pagi pukul 07:00.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'MEET-003',
                'tanggal' => '2026-09-13',
                'topic' => 'Audit Keselamatan Kerja (K3) Bengkel Plant & Kalibrasi Alat Khusus',
                'leader' => 'M. Nur Salam (Direksi / HSE)',
                'attendees' => 'Hariadi (GM), Andi Herwan, Seluruh Mekanik & Helper',
                'discussion_summary' => 'Pemeriksaan kepatuhan APD mekanik, housekeeping area pencucian part workshop, penataan drum oli bekas, dan kalibrasi torque wrench 800 Nm.',
                'action_items_json' => json_encode([
                    ['task' => 'Pembersihan oli rembesan di bay 2', 'pic' => 'Helper Workshop', 'deadline' => '2026-09-14'],
                    ['task' => 'Pemberian sertifikat kalibrasi tools', 'pic' => 'Planner', 'deadline' => '2026-09-15']
                ]),
                'status' => 'Closed',
                'plant_health' => 'SAFE & COMPLIANT',
                'critical_issue' => 'SOP pengangkatan beban hoist crane perlu diperbarui',
                'operational_impact' => 'Nir-kecelakaan kerja (Zero LTI) selama 420 hari',
                'management_decision' => 'Terapkan daily safety talk 5 menit sebelum briefing shift pagi dan ganti sling web hoist yang telah aus.',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('meeting_notes')->insert($meetingNotes);

        // 2. Seed Monthly Budget (Plan Budget Bulanan)
        DB::table('monthly_budgets')->truncate();
        $budgets = [
            [
                'item_id' => 'BUD-2026-09-01',
                'month_year' => 202609,
                'category' => 'Sparepart & Filter Rutin',
                'budget_plan' => 185000000,
                'actual_spent' => 142500000,
                'variance' => 42500000,
                'status' => 'ON BUDGET',
                'notes' => 'Pengadaan consumable part & filter service 250H/500H seluruh armada',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'BUD-2026-09-02',
                'month_year' => 202609,
                'category' => 'Pelumas & Oli (Engine, Hyd, Gear)',
                'budget_plan' => 120000000,
                'actual_spent' => 98000000,
                'variance' => 22000000,
                'status' => 'ON BUDGET',
                'notes' => 'Oli Shell Rimula R4X, Tellus S2, dan Spirax HD 90',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'BUD-2026-09-03',
                'month_year' => 202609,
                'category' => 'Jasa Vendor & Machining Eksternal',
                'budget_plan' => 45000000,
                'actual_spent' => 38000000,
                'variance' => 7000000,
                'status' => 'ON BUDGET',
                'notes' => 'Line boring pin boom EX-201 dan re-kondisi bucket lip',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'BUD-2026-09-04',
                'month_year' => 202609,
                'category' => 'Ban Dump Truck & Support',
                'budget_plan' => 95000000,
                'actual_spent' => 95000000,
                'variance' => 0,
                'status' => 'EXACT',
                'notes' => 'Penggantian 8 ban Radial 12.00R20 Shacman F3000',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('monthly_budgets')->insert($budgets);

        // 3. Seed PCR Components (Plan Component Replacement)
        DB::table('pcr_components')->truncate();
        $pcrComponents = [
            [
                'item_id' => 'PCR-001',
                'equip_no' => 'EX-201',
                'component_name' => 'Engine Complete 6BTAA-5.9',
                'target_lifetime_hm' => 12000,
                'current_hm' => 9450,
                'remaining_hm' => 2550,
                'status' => 'MONITORING',
                'estimated_cost' => 165000000,
                'scheduled_date' => '2026-11-20',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'PCR-002',
                'equip_no' => 'EX-302',
                'component_name' => 'Hydraulic Main Pump (K3V140DT)',
                'target_lifetime_hm' => 10000,
                'current_hm' => 8800,
                'remaining_hm' => 1200,
                'status' => 'PERSIAPAN PR',
                'estimated_cost' => 85000000,
                'scheduled_date' => '2026-10-15',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'PCR-003',
                'equip_no' => 'DZ-002',
                'component_name' => 'Final Drive LH & RH',
                'target_lifetime_hm' => 8000,
                'current_hm' => 6700,
                'remaining_hm' => 1300,
                'status' => 'MONITORING',
                'estimated_cost' => 70000000,
                'scheduled_date' => '2026-10-30',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('pcr_components')->insert($pcrComponents);

        // 4. Seed Swab Components (Kanibalisasi Komponen)
        DB::table('swab_components')->truncate();
        $swabs = [
            [
                'item_id' => 'SWAB-001',
                'tanggal' => '2026-09-05',
                'donor_unit' => 'EX-304',
                'target_unit' => 'EX-302',
                'component_name' => 'Alternator 24V 60A',
                'reason' => 'Unit EX-302 prioritas loading batubara darurat, EX-304 sedang standby tunggu track roller',
                'authorized_by' => 'Hariadi (GM)',
                'mechanic' => 'Tim Mekanik KBCT',
                'status' => 'Active',
                'restoration_date' => '2026-09-18',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'SWAB-002',
                'tanggal' => '2026-09-02',
                'donor_unit' => 'DZ-069',
                'target_unit' => 'DZ-005',
                'component_name' => 'Starting Motor 24V',
                'reason' => 'Pinion gear starting motor DZ-005 aus tergerus flywheel',
                'authorized_by' => 'Andi Herwan (Planner)',
                'mechanic' => 'Agus Priyono',
                'status' => 'Restored',
                'restoration_date' => '2026-09-12',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('swab_components')->insert($swabs);

        // 5. Seed Failure Analysis (FAR)
        DB::table('failure_analyses')->truncate();
        $fars = [
            [
                'item_id' => 'FAR-001',
                'tanggal' => '2026-09-07',
                'equip_no' => 'DZ-007',
                'component_name' => 'Torque Converter & Oil Cooler',
                'chronology' => 'Suhu oli transmisi menyentuh 115C saat unit dorong material batubara di kemiringan 12 derajat.',
                'five_why_json' => json_encode(['Suhu oli naik', 'Oil cooler tersumbat debu', 'Blow-out sirip kurang bersih', 'Tekanan angin kompresor turun', 'Regulator kompresor aus']),
                'fishbone_json' => json_encode(['Man' => 'Kurang teliti saat pre-shift', 'Machine' => 'Kompresor angin drop', 'Material' => 'Debu batubara halus menempel']),
                'corrective_action' => 'Cuci chemical fin radiator cooler dan ganti v-belt fan set baru.',
                'preventive_action' => 'Tambahkan jadwal high-pressure air blow-out radiator setiap servis 250H.',
                'status' => 'CLOSED',
                'lead_investigator' => 'Hariadi / PMC Team',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('failure_analyses')->insert($fars);

        // 6. Seed Mechanic Activity (Laporan Aktifitas)
        DB::table('mechanic_activities')->truncate();
        $activities = [
            [
                'item_id' => 'ACT-001',
                'tanggal' => '2026-09-13',
                'no_wo' => 'WO-001201',
                'mekanik' => 'Agus Priyono',
                'aktifitas' => 'Pelaksanaan General Check pre-start & penambahan oli hidrolik 15 liter EX-302',
                'jam_mulai' => '07:30',
                'jam_selesai' => '09:00',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'ACT-002',
                'tanggal' => '2026-09-13',
                'no_wo' => 'WO-001202',
                'mekanik' => 'Bambang Irawan',
                'aktifitas' => 'Greasing full arm equalizer bar & blade trunnion pin points DZ-005',
                'jam_mulai' => '08:00',
                'jam_selesai' => '10:30',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('mechanic_activities')->insert($activities);

        // 7. Seed Master Tools (Special Tools)
        DB::table('master_tools')->truncate();
        $tools = [
            [
                'tool_id' => 'TLS-001',
                'tool_name' => 'Torque Wrench Heavy Duty 3/4" (100 - 800 Nm)',
                'category' => 'Precision & Torque',
                'brand_spec' => 'Tohnichi / Stahlwille',
                'quantity' => 2,
                'condition' => 'BAIK & TERKALIBRASI',
                'location' => 'Lemari Khusus Workshop A',
                'status' => 'AVAILABLE',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'tool_id' => 'TLS-002',
                'tool_name' => 'Hydraulic Bottle Jack 50 Ton',
                'category' => 'Lifting Equipment',
                'brand_spec' => 'Enerpac P-392',
                'quantity' => 3,
                'condition' => 'BAIK',
                'location' => 'Bay 1 Workshop',
                'status' => 'IN USE',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'tool_id' => 'TLS-003',
                'tool_name' => 'Digital Hydraulic Pressure Gauge Kit (0 - 600 Bar)',
                'category' => 'Testing & Diagnostic',
                'brand_spec' => 'Parker SensoControl',
                'quantity' => 1,
                'condition' => 'BAIK',
                'location' => 'Ruang Planner',
                'status' => 'AVAILABLE',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('master_tools')->insert($tools);

        // 8. Seed Inspections (P2H Checklist)
        DB::table('inspections')->truncate();
        $inspections = [
            [
                'item_id' => 'P2H-001',
                'tanggal' => '2026-09-13',
                'equip_no' => 'EX-201',
                'tipe_alat' => 'Excavator',
                'checklist_json' => json_encode([
                    'engine_oil' => 'OK',
                    'coolant_level' => 'OK',
                    'hydraulic_level' => 'OK',
                    'brake_system' => 'OK',
                    'track_link' => 'OK',
                    'lights' => 'OK',
                    'fire_extinguisher' => 'OK',
                    'notes' => 'Unit siap operasi di Front Loading Batubara'
                ]),
                'inspector' => 'Dedi Kurniawan',
                'timestamp' => '2026-09-13 06:45:00',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'P2H-002',
                'tanggal' => '2026-09-13',
                'equip_no' => 'DT-3011',
                'tipe_alat' => 'Dump Truck',
                'checklist_json' => json_encode([
                    'engine_oil' => 'OK',
                    'coolant_level' => 'OK',
                    'hydraulic_level' => 'OK',
                    'brake_system' => 'OK',
                    'tire_pressure' => 'NOTE',
                    'lights' => 'OK',
                    'fire_extinguisher' => 'OK',
                    'notes' => 'Tekanan ban belakang kiri kurang 15 PSI, sudah dipompa di workshop'
                ]),
                'inspector' => 'Suryadi',
                'timestamp' => '2026-09-13 06:50:00',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('inspections')->insert($inspections);

        // 9. Seed PM Records
        DB::table('pm_records')->truncate();
        $pmRecords = [
            [
                'item_id' => 'PM-2026-001',
                'tanggal' => '2026-09-10',
                'equip_no' => 'EX-205',
                'pm_type' => 'PM 250H',
                'washing_check' => 'DONE',
                'greasing_check' => 'DONE',
                'inspection_check' => 'DONE',
                'torque_check' => 'DONE',
                'battery_check' => 'DONE',
                'mechanic' => 'Tim Mekanik KBCT',
                'notes' => 'Penggantian filter oli mesin & fuel filter 1R-0716. Unit selesai dalam 2.5 jam.',
                'hm_pm' => 4500,
                'status' => 'COMPLETED',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'item_id' => 'PM-2026-002',
                'tanggal' => '2026-09-12',
                'equip_no' => 'DZ-008',
                'pm_type' => 'PM 500H',
                'washing_check' => 'DONE',
                'greasing_check' => 'DONE',
                'inspection_check' => 'DONE',
                'torque_check' => 'DONE',
                'battery_check' => 'DONE',
                'mechanic' => 'Agus & Bambang',
                'notes' => 'Penggantian oli transmisi & filter hidrolik. Pembersihan saringan udara primer.',
                'hm_pm' => 11750,
                'status' => 'COMPLETED',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];
        DB::table('pm_records')->insert($pmRecords);
    }
}
