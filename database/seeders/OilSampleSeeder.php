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
            // === UNIT EX1210 (PC1250-8R) - Matches user's screenshot ===
            [
                'item_id' => 'SOS-EX1210-ENG-01',
                'sample_code' => 'LAB-44012',
                'equip_no' => 'EX1210',
                'compartment' => 'Engine',
                'sample_date' => '23-Mar-24',
                'hm' => 47006,
                'oil_grade' => '15W-40',
                'rating' => 'A',
                'top_up' => 0,
                'repair_notes' => 'None',
                'si' => 3, 'al' => 0, 'na' => 0,
                'fe' => 0, 'cu' => 45015, 'cr' => 5, 'pb' => 7, 'pq' => 0,
                'visc_100' => 0, 'oxi' => 0, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0,
                'interpretation' => 'All Test Results Appear Acceptable. Take Oil Samples At 250 Hour Intervals To Monitor Condition.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-EX1210-ENG-02',
                'sample_code' => 'LAB-43890',
                'equip_no' => 'EX1210',
                'compartment' => 'Engine',
                'sample_date' => '27-Feb-24',
                'hm' => 46808,
                'oil_grade' => '15W-40',
                'rating' => 'C',
                'top_up' => 5,
                'repair_notes' => 'Check oil filter bypass valve',
                'si' => 7, 'al' => 1, 'na' => 0,
                'fe' => 0, 'cu' => 44998, 'cr' => 7, 'pb' => 30, 'pq' => 0,
                'visc_100' => 0, 'oxi' => 0, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0,
                'interpretation' => 'Elevated lead and chromium observed on previous sample. Action taken: oil flush and filter renewal performed.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-EX1210-HYD-01',
                'sample_code' => 'LAB-44013',
                'equip_no' => 'EX1210',
                'compartment' => 'Hydraulic System',
                'sample_date' => '23-Mar-24',
                'hm' => 47006,
                'oil_grade' => 'TELLUS 46',
                'rating' => 'B',
                'top_up' => 0,
                'repair_notes' => 'Clean Lines Target: 18/15',
                'si' => 1, 'al' => 0, 'na' => 0,
                'fe' => 0, 'cu' => 45015, 'cr' => 4, 'pb' => 6, 'pq' => 0,
                'visc_100' => 0, 'oxi' => 0, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 0, 'iso_14' => 3801, 'water_pct' => 0,
                'interpretation' => 'The Iso Code Slightly Above Acceptable Clean Lines Range (Clean Lines Target = 18/15). Other Readings Are Acceptable. Take Oil Samples At 250 Hour Intervals To Monitor Condition.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-EX1210-FDR-01',
                'sample_code' => 'LAB-44014',
                'equip_no' => 'EX1210',
                'compartment' => 'Final Drive Right',
                'sample_date' => '23-Mar-24',
                'hm' => 47006,
                'oil_grade' => 'SAE 30',
                'rating' => 'B',
                'top_up' => 0,
                'repair_notes' => 'Monitor planetary bearing',
                'si' => 1, 'al' => 0, 'na' => 0,
                'fe' => 0, 'cu' => 45015, 'cr' => 2, 'pb' => 122, 'pq' => 0,
                'visc_100' => 0, 'oxi' => 0, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 0, 'iso_14' => 59475, 'water_pct' => 0,
                'interpretation' => 'Particle count and wear metals slightly elevated in right drive. Recommended resampling at 125 hour interval.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-EX1210-FDL-01',
                'sample_code' => 'LAB-44015',
                'equip_no' => 'EX1210',
                'compartment' => 'Final Drive Left',
                'sample_date' => '23-Mar-24',
                'hm' => 47006,
                'oil_grade' => 'SAE 30',
                'rating' => 'A',
                'top_up' => 0,
                'repair_notes' => 'None',
                'si' => 1, 'al' => 0, 'na' => 0,
                'fe' => 0, 'cu' => 45015, 'cr' => 1, 'pb' => 5, 'pq' => 0,
                'visc_100' => 0, 'oxi' => 0, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 0, 'iso_14' => 1200, 'water_pct' => 0,
                'interpretation' => 'Compartment normal. All readings conform to standard factory baseline.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-EX1210-SWM-01',
                'sample_code' => 'LAB-44016',
                'equip_no' => 'EX1210',
                'compartment' => 'Swing Machinery',
                'sample_date' => '23-Mar-24',
                'hm' => 47006,
                'oil_grade' => 'SAE 30',
                'rating' => 'A',
                'top_up' => 0,
                'repair_notes' => 'None',
                'si' => 2, 'al' => 0, 'na' => 0,
                'fe' => 0, 'cu' => 45015, 'cr' => 2, 'pb' => 4, 'pq' => 0,
                'visc_100' => 0, 'oxi' => 0, 'soot' => 0, 'tbn' => 0,
                'iso_6' => 0, 'iso_14' => 1540, 'water_pct' => 0,
                'interpretation' => 'All test results appear acceptable. Take oil samples at 250 hour intervals to monitor condition.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // === UNIT DT230 (HD785-7) ===
            [
                'item_id' => 'SOS-DT230-ENG-01',
                'sample_code' => 'LAB-44021',
                'equip_no' => 'DT230',
                'compartment' => 'Engine',
                'sample_date' => '15-Mar-24',
                'hm' => 23150,
                'oil_grade' => '15W-40',
                'rating' => 'A',
                'top_up' => 2,
                'repair_notes' => 'None',
                'si' => 2, 'al' => 0, 'na' => 1,
                'fe' => 8, 'cu' => 12, 'cr' => 1, 'pb' => 2, 'pq' => 0,
                'visc_100' => 14.2, 'oxi' => 1, 'soot' => 0.1, 'tbn' => 9.2,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0,
                'interpretation' => 'Engine wear within OEM tolerances. Normal sampling schedule.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],
            [
                'item_id' => 'SOS-DT230-TRN-01',
                'sample_code' => 'LAB-44022',
                'equip_no' => 'DT230',
                'compartment' => 'Transmission',
                'sample_date' => '18-Mar-24',
                'hm' => 23150,
                'oil_grade' => 'TO-4 10W',
                'rating' => 'C',
                'top_up' => 8,
                'repair_notes' => 'Check clutch slippage pressure',
                'si' => 18, 'al' => 4, 'na' => 2,
                'fe' => 95, 'cu' => 140, 'cr' => 4, 'pb' => 12, 'pq' => 15,
                'visc_100' => 6.8, 'oxi' => 8, 'soot' => 0.2, 'tbn' => 6.1,
                'iso_6' => 21, 'iso_14' => 18, 'water_pct' => 0.05,
                'interpretation' => 'High copper and iron detected. Clutch disc wear suspected. Pressure test recommended before next shift.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ],

            // === UNIT DZ850 (D375A-6) ===
            [
                'item_id' => 'SOS-DZ850-ENG-01',
                'sample_code' => 'LAB-44031',
                'equip_no' => 'DZ850',
                'compartment' => 'Engine',
                'sample_date' => '10-Mar-24',
                'hm' => 18420,
                'oil_grade' => '15W-40',
                'rating' => 'X',
                'top_up' => 10,
                'repair_notes' => 'Urgent: Main bearing inspection required',
                'si' => 42, 'al' => 15, 'na' => 8,
                'fe' => 240, 'cu' => 380, 'cr' => 14, 'pb' => 36, 'pq' => 42,
                'visc_100' => 11.2, 'oxi' => 12, 'soot' => 1.8, 'tbn' => 4.2,
                'iso_6' => 0, 'iso_14' => 0, 'water_pct' => 0.12,
                'interpretation' => 'CRITICAL ALERT: Severe copper, lead, and silicon ingress. Immediate engine stop recommended for bearing inspection.',
                'lab_vendor' => 'Caterpillar SOS Lab',
                'status' => 'APPROVED',
                'created_by' => 'Planner SOS'
            ]
        ];

        foreach ($samples as $s) {
            OilSample::create($s);
        }
    }
}
