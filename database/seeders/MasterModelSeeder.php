<?php

namespace Database\Seeders;

use App\Models\MasterEquip;
use App\Models\MasterModel;
use App\Models\PartService;
use App\Models\WorkOrder;
use App\Models\WorkOrderPart;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterModelSeeder extends Seeder
{
    /**
     * Seed initial master models, map model_code to master_equips and part_services,
     * and migrate historical work_orders.parts_json to work_order_parts.
     */
    public function run(): void
    {
        $models = [
            // Bulldozer
            [
                'model_code'        => 'ZOOMLION_ZD320',
                'model_name'        => 'ZOOMLION ZD-320-3',
                'equipment_type'    => 'BULLDOZER',
                'unit_type_alias'   => 'DOZER',
                'manufacturer'      => 'Zoomlion',
                'aliases'           => ['ZD-320-3', 'ZD320-3', 'ZOOMLION 320', 'ZD320', 'ZOOMLION ZD-320-3'],
            ],
            [
                'model_code'        => 'ZOOMLION_ZD220',
                'model_name'        => 'ZOOMLION ZD-220-3',
                'equipment_type'    => 'BULLDOZER',
                'unit_type_alias'   => 'DOZER',
                'manufacturer'      => 'Zoomlion',
                'aliases'           => ['ZD-220-3', 'ZD220-3', 'ZOOMLION 220', 'ZD220', 'ZOOMLION ZD-220-3'],
            ],
            [
                'model_code'        => 'SEM_822D',
                'model_name'        => 'SEM 822D',
                'equipment_type'    => 'BULLDOZER',
                'unit_type_alias'   => 'DOZER',
                'manufacturer'      => 'SEM Caterpillar',
                'aliases'           => ['SEM822D', '822D', 'SEM 822', 'SEM 822D'],
            ],
            [
                'model_code'        => 'CAT_D8GC',
                'model_name'        => 'CAT D8 GC',
                'equipment_type'    => 'BULLDOZER',
                'unit_type_alias'   => 'DOZER',
                'manufacturer'      => 'Caterpillar',
                'aliases'           => ['D8GC', 'D8 GC', 'CAT D8GC', 'CAT D8', 'D8R', 'CAT D8 GC'],
            ],

            // Excavator
            [
                'model_code'        => 'CAT_320GX',
                'model_name'        => 'CAT 320 GX',
                'equipment_type'    => 'EXCAVATOR',
                'unit_type_alias'   => 'EXCA',
                'manufacturer'      => 'Caterpillar',
                'aliases'           => ['320GX', '320 GX', 'CAT 320GX', 'CAT 320 GX / 330 GX', 'CAT 320'],
            ],
            [
                'model_code'        => 'CAT_330GX',
                'model_name'        => 'CAT 330 GX',
                'equipment_type'    => 'EXCAVATOR',
                'unit_type_alias'   => 'EXCA',
                'manufacturer'      => 'Caterpillar',
                'aliases'           => ['330GX', '330 GX', 'CAT 330GX', 'CAT 320 GX / 330 GX', 'CAT 330'],
            ],
            [
                'model_code'        => 'HYUNDAI_HX220S',
                'model_name'        => 'HYUNDAY HX220S',
                'equipment_type'    => 'EXCAVATOR',
                'unit_type_alias'   => 'EXCA',
                'manufacturer'      => 'Hyundai',
                'aliases'           => ['HX220S', 'HYUNDAI HX220S', 'HX 220 S', 'HYUNDAY HX220S'],
            ],
            [
                'model_code'        => 'SANY_SY330H',
                'model_name'        => 'SANY SY330H',
                'equipment_type'    => 'EXCAVATOR',
                'unit_type_alias'   => 'EXCA',
                'manufacturer'      => 'Sany',
                'aliases'           => ['SY330H', 'SANY 330', 'SY 330 H', 'SANY SY330H'],
            ],
            [
                'model_code'        => 'DOOSAN_DX300',
                'model_name'        => 'DOSAN DX300LCA-7M',
                'equipment_type'    => 'EXCAVATOR',
                'unit_type_alias'   => 'EXCA',
                'manufacturer'      => 'Doosan',
                'aliases'           => ['DX300LCA-7M', 'DOOSAN DX300', 'DX300', 'DOSAN DX300LCA-7M'],
            ],

            // Wheel Loader
            [
                'model_code'        => 'SEM_660D',
                'model_name'        => 'SEM 660D',
                'equipment_type'    => 'WHEEL LOADER',
                'unit_type_alias'   => 'LOADER',
                'manufacturer'      => 'SEM Caterpillar',
                'aliases'           => ['SEM660D', '660D', 'SEM 660', 'SEM 660D'],
            ],
            [
                'model_code'        => 'LUGONG_T930',
                'model_name'        => 'LUGONG T-930',
                'equipment_type'    => 'WHEEL LOADER',
                'unit_type_alias'   => 'LOADER',
                'manufacturer'      => 'Lugong',
                'aliases'           => ['T-930', 'T930', 'LUGONG 930', 'LUGONG T-930'],
            ],
            [
                'model_code'        => 'LOVOL_FL955F',
                'model_name'        => 'LOVOL FL955F-II',
                'equipment_type'    => 'WHEEL LOADER',
                'unit_type_alias'   => 'LOADER',
                'manufacturer'      => 'Lovol',
                'aliases'           => ['FL955F-II', 'FL955F', 'LOVOL 955', 'LOVOL FL955F-II'],
            ],
            [
                'model_code'        => 'LIUGONG_CLG870H',
                'model_name'        => 'LIU GONG CLG870H',
                'equipment_type'    => 'WHEEL LOADER',
                'unit_type_alias'   => 'LOADER',
                'manufacturer'      => 'LiuGong',
                'aliases'           => ['CLG870H', 'LIUGONG 870', 'CLG 870 H', 'LIU GONG CLG870H'],
            ],

            // Skid Steer Loader
            [
                'model_code'        => 'BOBCAT_S570',
                'model_name'        => 'BOBCAT S570',
                'equipment_type'    => 'SKID STEER LOADER',
                'unit_type_alias'   => 'SKID STEER',
                'manufacturer'      => 'Bobcat',
                'aliases'           => ['S570', 'BOBCAT 570', 'BOBCAT S570'],
            ],
            [
                'model_code'        => 'LIUGONG_CLG375B',
                'model_name'        => 'LIUGONG CLG375B',
                'equipment_type'    => 'SKID STEER LOADER',
                'unit_type_alias'   => 'SKID STEER',
                'manufacturer'      => 'LiuGong',
                'aliases'           => ['CLG375B', 'LIUGONG 375', 'LIUGONG CLG375B'],
            ],
            [
                'model_code'        => 'CAT_226B3',
                'model_name'        => 'CAT 226B3',
                'equipment_type'    => 'SKID STEER LOADER',
                'unit_type_alias'   => 'SKID STEER',
                'manufacturer'      => 'Caterpillar',
                'aliases'           => ['226B3', 'CAT 226', 'CAT 226B3'],
            ],

            // Dump Truck
            [
                'model_code'        => 'FUSO_FN62',
                'model_name'        => 'FUSO FIGHTER FN62',
                'equipment_type'    => 'DUMP TRUCK',
                'unit_type_alias'   => 'DT',
                'manufacturer'      => 'Mitsubishi Fuso',
                'aliases'           => ['FUSO FN62', 'FN62', 'FIGHTER FN62', 'FUSO FIGHTER', 'FUSO FIGHTER FN62'],
            ],
            [
                'model_code'        => 'SHACMAN_F3000',
                'model_name'        => 'SHACMAN F3000',
                'equipment_type'    => 'DUMP TRUCK',
                'unit_type_alias'   => 'DT',
                'manufacturer'      => 'Shacman',
                'aliases'           => ['F3000', 'SHACMAN 3000', 'SHACMAN F3000'],
            ],
            [
                'model_code'        => 'QUESTER_CWE280',
                'model_name'        => 'QUESTER CWE 280',
                'equipment_type'    => 'DUMP TRUCK',
                'unit_type_alias'   => 'DT',
                'manufacturer'      => 'UD Trucks',
                'aliases'           => ['CWE 280', 'CWE280', 'QUESTER 280', 'UD QUESTER', 'QUESTER CWE 280'],
            ],

            // Support
            [
                'model_code'        => 'FAW_140LT',
                'model_name'        => 'FAW 140LT',
                'equipment_type'    => 'WATER TRUCK 20.000 KL',
                'unit_type_alias'   => 'SUPPORT',
                'manufacturer'      => 'FAW',
                'aliases'           => ['FAW 140', '140LT', 'FAW 140LT'],
            ],
            [
                'model_code'        => 'VGEN_VG40I',
                'model_name'        => 'V-GEN VG40-I',
                'equipment_type'    => 'GENSET 40 KVA',
                'unit_type_alias'   => 'GENSET',
                'manufacturer'      => 'V-Gen',
                'aliases'           => ['VG40-I', 'VG40', 'V-GEN VG40-I'],
            ],
        ];

        foreach ($models as $m) {
            MasterModel::updateOrCreate(
                ['model_code' => $m['model_code']],
                $m
            );
        }

        // ─── Map model_code to MasterEquip ──────────────────────────────
        $equips = MasterEquip::all();
        foreach ($equips as $eq) {
            if (!empty($eq->model)) {
                $matched = MasterModel::findByAlias($eq->model);
                if ($matched) {
                    $eq->updateQuietly(['model_code' => $matched->model_code]);
                }
            }
        }

        // ─── Map model_code to PartService ──────────────────────────────
        $partServices = PartService::all();
        foreach ($partServices as $ps) {
            if (!empty($ps->model)) {
                $matched = MasterModel::findByAlias($ps->model);
                if ($matched) {
                    $ps->updateQuietly(['model_code' => $matched->model_code]);
                }
            }
        }

        // ─── Migrate historical parts_json to work_order_parts ──────────
        $workOrders = WorkOrder::whereNotNull('parts_json')
            ->where('parts_json', '!=', '')
            ->where('parts_json', '!=', '[]')
            ->get();

        foreach ($workOrders as $wo) {
            $raw = $wo->parts_json;
            $items = is_array($raw) ? $raw : json_decode($raw, true);

            if (!is_array($items)) {
                continue;
            }

            foreach ($items as $p) {
                if (!is_array($p)) continue;

                $pNo = trim($p['part_number'] ?? $p['no'] ?? $p['part_no'] ?? '');
                $pName = trim($p['part_name'] ?? $p['desc'] ?? $p['description'] ?? '');
                $pQty = (float) ($p['qty'] ?? $p['qty_used'] ?? 0);
                $pUom = trim($p['uom'] ?? 'PCS');
                $pPrice = (float) ($p['price'] ?? $p['unit_price'] ?? 0);

                if (empty($pNo) && empty($pName)) {
                    continue;
                }

                // Check if already exists in work_order_parts for this WO
                $exists = WorkOrderPart::where('no_wo', $wo->no_wo)
                    ->where('part_number', $pNo)
                    ->where('part_name', $pName)
                    ->exists();

                if (!$exists) {
                    WorkOrderPart::create([
                        'no_wo'          => $wo->no_wo,
                        'part_number'    => $pNo ?: null,
                        'part_name'      => $pName ?: $pNo,
                        'qty_used'       => $pQty,
                        'uom'            => $pUom ?: 'PCS',
                        'unit_price'     => $pPrice,
                        'total_price'    => round($pQty * $pPrice, 2),
                        'stock_deducted' => strtoupper($wo->status ?? '') === 'CLOSED',
                    ]);
                }
            }
        }
    }
}
