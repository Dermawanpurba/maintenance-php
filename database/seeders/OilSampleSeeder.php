<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OilSample;

class OilSampleSeeder extends Seeder
{
    public function run(): void
    {
        OilSample::truncate();

        $samples = [
            // EX-205 (CAT 320 GX) - Real Unit from master_equips
            [
                'item_id' => 'SOS-EX205-ENG-01',
                'sample_code' => 'LAB-44012',
                'equip_no' => 'EX-205',
                'compartment' => 'Engine',
                'sample_date' => '2026-09-01',
                'hm' => 4330,
                'oil_grade' => '15W-40',
                'rating' => 'A',
                'top_up' => 0,
                'repair_notes' => 'Normal sampling interval 250H',
                'si' => 3, 'al' => 0, 'na' => 0,
                'fe' => 12, 'cu' => 15, 'cr' => 1, 'pb' => 2, 'pq' => 0,
                'visc_100' => 14.5, 'oxi' => 1, 'soot' => 0.1, 'tbn' => 9.5,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0,
                'interpretation' => 'All test results appear acceptable. Take oil samples at 250 hour intervals to monitor condition.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-EX205-ENG-02',
                'sample_code' => 'LAB-43890',
                'equip_no' => 'EX-205',
                'compartment' => 'Engine',
                'sample_date' => '2026-08-26',
                'hm' => 4250,
                'oil_grade' => '15W-40',
                'rating' => 'C',
                'top_up' => 3,
                'repair_notes' => 'Check oil filter bypass valve',
                'si' => 7, 'al' => 1, 'na' => 0,
                'fe' => 35, 'cu' => 48, 'cr' => 4, 'pb' => 18, 'pq' => 5,
                'visc_100' => 13.8, 'oxi' => 4, 'soot' => 0.3, 'tbn' => 7.8,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0.02,
                'interpretation' => 'Elevated copper and lead observed. Resample at next 250H PM.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-EX205-HYD-01',
                'sample_code' => 'LAB-44013',
                'equip_no' => 'EX-205',
                'compartment' => 'Hydraulic System',
                'sample_date' => '2026-09-01',
                'hm' => 4330,
                'oil_grade' => 'ISO VG 68',
                'rating' => 'B',
                'top_up' => 0,
                'repair_notes' => 'Target clean lines 18/15',
                'si' => 2, 'al' => 0, 'na' => 0,
                'fe' => 5, 'cu' => 8, 'cr' => 0, 'pb' => 1, 'pq' => 0,
                'visc_100' => 68.2, 'oxi' => 1, 'soot' => 0.0, 'tbn' => 0,
                'iso_6' => 19, 'iso_14' => 16, 'water_pct' => 0,
                'interpretation' => 'Hydraulic cleanliness within normal target. No metallic contamination.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // DZ-007 (CAT D8 GC) - Severe condition matching transmission defect
            [
                'item_id' => 'SOS-DZ007-TRN-01',
                'sample_code' => 'LAB-44031',
                'equip_no' => 'DZ-007',
                'compartment' => 'Torqflow Transmission',
                'sample_date' => '2026-09-01',
                'hm' => 11842,
                'oil_grade' => 'TO-4 30',
                'rating' => 'X',
                'top_up' => 12,
                'repair_notes' => 'CRITICAL: Disc clutch slippage and valve body pressure drop',
                'si' => 38, 'al' => 14, 'na' => 5,
                'fe' => 210, 'cu' => 340, 'cr' => 12, 'pb' => 44, 'pq' => 58,
                'visc_100' => 10.4, 'oxi' => 15, 'soot' => 1.2, 'tbn' => 3.8,
                'iso_6' => 24, 'iso_14' => 21, 'water_pct' => 0.08,
                'interpretation' => 'CRITICAL ALERT: Severe copper and iron metal debris from torque converter and disc clutch. Immediate overhaul required.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // DZ-002 (ZOOMLION ZD-320-3)
            [
                'item_id' => 'SOS-DZ002-FDR-01',
                'sample_code' => 'LAB-44014',
                'equip_no' => 'DZ-002',
                'compartment' => 'Final Drive Right',
                'sample_date' => '2026-09-02',
                'hm' => 8398,
                'oil_grade' => 'TO-4 50',
                'rating' => 'B',
                'top_up' => 0,
                'repair_notes' => 'Planetary gear monitoring',
                'si' => 4, 'al' => 1, 'na' => 0,
                'fe' => 28, 'cu' => 14, 'cr' => 2, 'pb' => 5, 'pq' => 2,
                'visc_100' => 19.8, 'oxi' => 2, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 18, 'iso_14' => 15, 'water_pct' => 0,
                'interpretation' => 'Wear metals normal for 8,300 HM operating hours. Resample at 250H interval.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // EX-302 (SANY SY330H)
            [
                'item_id' => 'SOS-EX302-SWM-01',
                'sample_code' => 'LAB-44016',
                'equip_no' => 'EX-302',
                'compartment' => 'Swing Machinery',
                'sample_date' => '2026-09-03',
                'hm' => 3906,
                'oil_grade' => 'SAE 30',
                'rating' => 'A',
                'top_up' => 0,
                'repair_notes' => 'None',
                'si' => 2, 'al' => 0, 'na' => 0,
                'fe' => 8, 'cu' => 6, 'cr' => 0, 'pb' => 1, 'pq' => 0,
                'visc_100' => 11.2, 'oxi' => 1, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 16, 'iso_14' => 13, 'water_pct' => 0,
                'interpretation' => 'Swing gearbox wear particles within strict OEM standard.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // WL-016 (LUGONG T-930)
            [
                'item_id' => 'SOS-WL016-BRK-01',
                'sample_code' => 'LAB-44018',
                'equip_no' => 'WL-016',
                'compartment' => 'Brake & Hydraulic System',
                'sample_date' => '2026-09-01',
                'hm' => 2121,
                'oil_grade' => 'ISO VG 46',
                'rating' => 'B',
                'top_up' => 2,
                'repair_notes' => 'Brake caliper piston leakage observed',
                'si' => 6, 'al' => 1, 'na' => 0,
                'fe' => 22, 'cu' => 34, 'cr' => 1, 'pb' => 4, 'pq' => 1,
                'visc_100' => 46.5, 'oxi' => 2, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 19, 'iso_14' => 16, 'water_pct' => 0.01,
                'interpretation' => 'Moderate copper particles consistent with brake disc wear. Rebuild caliper.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // WL-019 (LIU GONG CLG870H)
            [
                'item_id' => 'SOS-WL019-TRN-01',
                'sample_code' => 'LAB-44022',
                'equip_no' => 'WL-019',
                'compartment' => 'Transmission & Torque Converter',
                'sample_date' => '2026-09-02',
                'hm' => 3952,
                'oil_grade' => 'TO-4 10W',
                'rating' => 'C',
                'top_up' => 5,
                'repair_notes' => 'Transmission temperature overheat >110C',
                'si' => 16, 'al' => 4, 'na' => 1,
                'fe' => 84, 'cu' => 125, 'cr' => 3, 'pb' => 12, 'pq' => 11,
                'visc_100' => 7.2, 'oxi' => 7, 'soot' => 0.2, 'tbn' => 6.4,
                'iso_6' => 21, 'iso_14' => 18, 'water_pct' => 0.04,
                'interpretation' => 'Elevated copper and oil degradation. Heat exchanger flushing and valve inspection recommended.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // DT-3011 (SHACMAN F3000)
            [
                'item_id' => 'SOS-DT3011-ENG-01',
                'sample_code' => 'LAB-44021',
                'equip_no' => 'DT-3011',
                'compartment' => 'Engine (Weichai WP12)',
                'sample_date' => '2026-09-01',
                'hm' => 6133,
                'oil_grade' => '15W-40 CI-4',
                'rating' => 'A',
                'top_up' => 1,
                'repair_notes' => 'None',
                'si' => 2, 'al' => 0, 'na' => 0,
                'fe' => 14, 'cu' => 9, 'cr' => 1, 'pb' => 2, 'pq' => 0,
                'visc_100' => 14.1, 'oxi' => 1, 'soot' => 0.1, 'tbn' => 9.8,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0,
                'interpretation' => 'Weichai engine wear within OEM baseline. Lubricant in excellent condition.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // DT-3017 (SHACMAN F3000)
            [
                'item_id' => 'SOS-DT3017-DIF-01',
                'sample_code' => 'LAB-44023',
                'equip_no' => 'DT-3017',
                'compartment' => 'Differential Rear',
                'sample_date' => '2026-09-03',
                'hm' => 5847,
                'oil_grade' => '85W-140 GL-5',
                'rating' => 'B',
                'top_up' => 0,
                'repair_notes' => 'Propeller shaft vibration inspection',
                'si' => 3, 'al' => 0, 'na' => 0,
                'fe' => 32, 'cu' => 8, 'cr' => 1, 'pb' => 2, 'pq' => 1,
                'visc_100' => 26.5, 'oxi' => 2, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 17, 'iso_14' => 14, 'water_pct' => 0,
                'interpretation' => 'Differential gear contact normal. Balancing propeller shaft recommended.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // WT-009 (QUESTER CWE 280)
            [
                'item_id' => 'SOS-WT009-ENG-01',
                'sample_code' => 'LAB-44025',
                'equip_no' => 'WT-009',
                'compartment' => 'Engine (GH8E280)',
                'sample_date' => '2026-09-04',
                'hm' => 3440,
                'oil_grade' => '15W-40',
                'rating' => 'B',
                'top_up' => 0,
                'repair_notes' => 'Fuel supply pump hard start diagnosis',
                'si' => 4, 'al' => 1, 'na' => 0,
                'fe' => 18, 'cu' => 11, 'cr' => 1, 'pb' => 3, 'pq' => 0,
                'visc_100' => 13.9, 'oxi' => 2, 'soot' => 0.2, 'tbn' => 8.9,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0.01,
                'interpretation' => 'Slight fuel dilution detected (<1.5%). Supply pump calibration will resolve.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // GST-003 (V-GEN VG40-I)
            [
                'item_id' => 'SOS-GST003-ENG-01',
                'sample_code' => 'LAB-44028',
                'equip_no' => 'GST-003',
                'compartment' => 'Engine',
                'sample_date' => '2026-09-02',
                'hm' => 4952,
                'oil_grade' => '15W-40',
                'rating' => 'B',
                'top_up' => 1,
                'repair_notes' => 'Alternator rotor replacement check',
                'si' => 5, 'al' => 1, 'na' => 0,
                'fe' => 16, 'cu' => 12, 'cr' => 1, 'pb' => 2, 'pq' => 0,
                'visc_100' => 14.3, 'oxi' => 2, 'soot' => 0.1, 'tbn' => 9.1,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0,
                'interpretation' => 'Engine compartment stable. All parameters within safe limits.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // GST-004 (V-GEN VG40-I)
            [
                'item_id' => 'SOS-GST004-ENG-01',
                'sample_code' => 'LAB-44029',
                'equip_no' => 'GST-004',
                'compartment' => 'Engine',
                'sample_date' => '2026-09-04',
                'hm' => 4696,
                'oil_grade' => '15W-40',
                'rating' => 'A',
                'top_up' => 0,
                'repair_notes' => 'PM 250H routine check',
                'si' => 2, 'al' => 0, 'na' => 0,
                'fe' => 10, 'cu' => 7, 'cr' => 0, 'pb' => 1, 'pq' => 0,
                'visc_100' => 14.4, 'oxi' => 1, 'soot' => 0.1, 'tbn' => 9.4,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0,
                'interpretation' => 'All parameters excellent. Recommended sampling at 250H interval.',
                'lab_vendor' => 'Pertamina Oil Clinic',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ]
        ];

        foreach ($samples as $s) {
            OilSample::create($s);
        }
    }
}
