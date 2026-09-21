<?php

namespace App\Filament\Pages;

use App\Models\MasterEquip;
use App\Models\MasterModel;
use App\Models\MasterPart;
use App\Models\PartService;
use App\Models\TargetJamOperasi;
use Filament\Pages\Page;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PlanningPartService extends Page
{
    protected static ?string $routePath = 'planning-part-service';
    protected string $view = 'filament.pages.planning-part-service';

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static string|\UnitEnum|null $navigationGroup = 'Planning & Coordination';
    protected static ?string $navigationLabel = 'Planning Part Service';
    protected static ?string $title = 'Planning Part Service — Estimasi Kebutuhan Bulanan';
    protected static ?int $navigationSort = 3;

    public int $selectedYear = 2026;
    public int $selectedMonth = 9;
    public ?string $selectedUnitFilter = null;
    public string $searchQuery = '';
    public string $categoryFilter = 'ALL';
    public string $stockFilter = 'ALL';
    public string $activeTab = 'konsolidasi'; // 'konsolidasi', 'per_unit', 'fluida_filter'
    public ?string $expandedUnit = null;

    public function mount(): void
    {
        if (request()->has('unit') && filled(request()->query('unit'))) {
            $this->selectedUnitFilter = strtoupper(trim(request()->query('unit')));
            $this->expandedUnit = $this->selectedUnitFilter;
        }

        if (request()->has('year')) {
            $this->selectedYear = (int) request()->query('year');
        }

        if (request()->has('month')) {
            $this->selectedMonth = (int) request()->query('month');
        }
    }

    public function filterByUnit(string $equipNo): void
    {
        if ($this->selectedUnitFilter === $equipNo) {
            $this->selectedUnitFilter = null;
        } else {
            $this->selectedUnitFilter = $equipNo;
            $this->expandedUnit = $equipNo;
        }
    }

    public function resetUnitFilter(): void
    {
        $this->selectedUnitFilter = null;
    }

    public function toggleExpandUnit(string $equipNo): void
    {
        $this->expandedUnit = $this->expandedUnit === $equipNo ? null : $equipNo;
    }

    public function switchTab(string $tab): void
    {
        $this->activeTab = $tab;
    }

    public function exportCsv(): StreamedResponse
    {
        $data = $this->planningData;
        $items = $this->filteredConsolidated;

        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        $monthName = $monthNames[$this->selectedMonth] ?? (string)$this->selectedMonth;
        $filename = "Planning_Part_Service_{$monthName}_{$this->selectedYear}.csv";

        return response()->streamDownload(function () use ($items) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'NO',
                'NAMA SUKU CADANG',
                'NOMOR PART / SPEK',
                'KATEGORI',
                'KEBUTUHAN PLAN',
                'SATUAN',
                'STOK GUDANG',
                'KEKURANGAN (DEFISIT)',
                'STATUS KESIAPAN',
                'EST. HARGA SATUAN',
                'EST. TOTAL BIAYA',
                'ALOKASI UNIT TERJADWAL'
            ]);

            foreach ($items as $idx => $row) {
                $unitSummary = implode(', ', array_map(function ($u) {
                    return "{$u['equip_no']} ({$u['pm_type']}: {$u['qty']})";
                }, $row['units_allocated']));

                fputcsv($handle, [
                    $idx + 1,
                    $row['part_name'],
                    $row['part_number'],
                    $row['category'],
                    $row['total_qty'],
                    $row['uom'],
                    $row['stock_qty'],
                    $row['shortage'],
                    $row['is_stock_sufficient'] ? 'STOK AMAN' : 'PERLU ORDER',
                    $row['price_estimate'],
                    $row['total_estimated_cost'],
                    $unitSummary
                ]);
            }
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function getPlanningDataProperty(): array
    {
        $targets = TargetJamOperasi::where('plan_year', $this->selectedYear)
            ->where('plan_month', $this->selectedMonth)
            ->get();

        $partServices = PartService::all();

        $partsMap = MasterPart::all()->keyBy(function ($p) {
            return strtoupper(trim($p->part_number ?? ''));
        });

        $consolidatedMap = [];
        $unitPlansList = [];

        $totalOilsLiter = 0;
        $totalFiltersPcs = 0;
        $totalSOSBottles = 0;
        $totalPmEvents = 0;
        $totalEstimatedCost = 0;

        foreach ($targets as $target) {
            $equipNo = trim($target->equip_no ?? '');
            $model = strtoupper(trim($target->model ?? ''));
            $section = strtoupper(trim($target->section ?? 'MINING'));

            // P3.2: Identifikasi model terdaftar untuk pencocokan BOM presisi
            $masterModel = null;
            if ($equipNo) {
                $masterModel = MasterEquip::where('equip_no', $equipNo)->first()?->masterModel;
            }
            if (!$masterModel && $model) {
                $masterModel = MasterModel::findByAlias($model);
            }

            $matchingParts = $partServices->filter(function ($p) use ($model, $section, $masterModel) {
                // Prioritas 1: Matching via model_code (P3.2)
                if ($masterModel && $p->model_code && $p->model_code === $masterModel->model_code) {
                    return true;
                }

                $pModel = strtoupper(trim($p->model ?? ''));
                $pEquip = strtoupper(trim($p->equipment ?? ''));

                // Prioritas 2: Substring match nama model
                if ($pModel && $model && (str_contains($pModel, $model) || str_contains($model, $pModel))) {
                    return true;
                }

                // Prioritas 3: Fallback ke section / equipment category
                if ($pEquip && $section && str_contains($pEquip, $section)) {
                    return true;
                }

                return false;
            });

            $pmEvents = [];
            $intervals = [
                ['key' => 'PS 250', 'field' => 'ps_250', 'count' => (int) ($target->pm_250 ?? 0)],
                ['key' => 'PS 500', 'field' => 'ps_500', 'count' => (int) ($target->pm_500 ?? 0)],
                ['key' => 'PS 1000', 'field' => 'ps_1000', 'count' => (int) ($target->pm_1000 ?? 0)],
                ['key' => 'PS 2000', 'field' => 'ps_2000', 'count' => (int) ($target->pm_2000 ?? 0)],
                ['key' => 'PS 4000', 'field' => 'ps_4000', 'count' => (int) ($target->pm_4000 ?? 0)],
            ];

            $totalCountSpecified = array_sum(array_column($intervals, 'count'));
            if ($totalCountSpecified === 0 && !empty($target->next_service_type)) {
                $typeStr = (string) $target->next_service_type;
                if (str_contains($typeStr, '250')) $intervals[0]['count'] = 1;
                elseif (str_contains($typeStr, '500')) $intervals[1]['count'] = 1;
                elseif (str_contains($typeStr, '1000')) $intervals[2]['count'] = 1;
                elseif (str_contains($typeStr, '2000')) $intervals[3]['count'] = 1;
                elseif (str_contains($typeStr, '4000')) $intervals[4]['count'] = 1;
            }

            foreach ($intervals as $interval) {
                $count = $interval['count'];
                $key = $interval['key'];
                $field = $interval['field'];

                if ($count > 0) {
                    $totalPmEvents += $count;
                    $eventPartsList = [];

                    foreach ($matchingParts as $part) {
                        $qtyNeeded = (float) ($part->{$field} ?? 0);
                        if ($qtyNeeded > 0) {
                            $totalQtyForUnit = $qtyNeeded * $count;
                            $category = $part->category ?: 'General';
                            $partNo = strtoupper(trim($part->part_number ?? ''));
                            $partName = strtoupper(trim($part->part_name ?? ''));

                            $uom = 'PC';
                            $catLower = strtolower($category);
                            $nameLower = strtolower($partName);

                            if (str_contains($catLower, 'oil') || str_contains($catLower, 'lubricant') || str_contains($nameLower, 'oil')) {
                                $uom = 'LTR';
                                $totalOilsLiter += $totalQtyForUnit;
                            } elseif (str_contains($catLower, 'filter') || str_contains($nameLower, 'filter')) {
                                $uom = 'PC';
                                $totalFiltersPcs += $totalQtyForUnit;
                            } elseif (str_contains($nameLower, 'bottle') || str_contains($nameLower, 'sample')) {
                                $uom = 'BOTOL';
                                $totalSOSBottles += $totalQtyForUnit;
                            }

                            $eventPartsList[] = [
                                'part_name' => $partName,
                                'part_number' => $partNo,
                                'category' => $category,
                                'qty' => $totalQtyForUnit,
                                'uom' => $uom,
                            ];

                            $mapKey = $partNo . '___' . $partName;
                            if (!isset($consolidatedMap[$mapKey])) {
                                $stockInfo = $partsMap->get($partNo);
                                $stockQty = (float) ($stockInfo->stock ?? 0);
                                $priceEst = (float) ($stockInfo->price ?? 150000);
                                if ($priceEst <= 0) $priceEst = 150000;

                                $consolidatedMap[$mapKey] = [
                                    'part_name' => $partName,
                                    'part_number' => $partNo,
                                    'category' => $category,
                                    'total_qty' => 0,
                                    'uom' => $uom,
                                    'stock_qty' => $stockQty,
                                    'price_estimate' => $priceEst,
                                    'units_allocated' => [],
                                ];
                            }

                            $consolidatedMap[$mapKey]['total_qty'] += $totalQtyForUnit;
                            $consolidatedMap[$mapKey]['units_allocated'][] = [
                                'equip_no' => $equipNo,
                                'model' => $model,
                                'pm_type' => "{$key} ({$count}x)",
                                'qty' => $totalQtyForUnit,
                            ];
                        }
                    }

                    if (!empty($eventPartsList)) {
                        $pmEvents[] = [
                            'interval' => $key,
                            'count' => $count,
                            'parts' => $eventPartsList,
                        ];
                    }
                }
            }

            if (!empty($pmEvents) || (!empty($target->next_service_hours_due) && $target->next_service_hours_due > 0)) {
                $unitPlansList[] = [
                    'equip_no' => $equipNo,
                    'model' => $model,
                    'section' => $section,
                    'est_hm' => (float) ($target->est_hm ?? 0),
                    'next_service_hours_due' => $target->next_service_hours_due,
                    'next_service_type' => $target->next_service_type,
                    'next_service_date' => $target->next_service_date,
                    'pm_events' => $pmEvents,
                ];
            }
        }

        $consolidatedList = [];
        foreach ($consolidatedMap as &$row) {
            $row['shortage'] = max(0, $row['total_qty'] - $row['stock_qty']);
            $row['is_stock_sufficient'] = $row['stock_qty'] >= $row['total_qty'];
            $row['total_estimated_cost'] = $row['total_qty'] * $row['price_estimate'];
            $totalEstimatedCost += $row['total_estimated_cost'];
            $consolidatedList[] = $row;
        }

        usort($consolidatedList, fn($a, $b) => $b['total_qty'] <=> $a['total_qty']);

        return [
            'metrics' => [
                'totalOilsLiter' => $totalOilsLiter,
                'totalOilsDrum' => round($totalOilsLiter / 200, 1),
                'totalFiltersPcs' => $totalFiltersPcs,
                'totalSOSBottles' => $totalSOSBottles,
                'totalPmEvents' => $totalPmEvents,
                'totalUnitsServiced' => count($unitPlansList),
                'totalEstimatedCost' => $totalEstimatedCost,
            ],
            'consolidated' => $consolidatedList,
            'unitPlans' => $unitPlansList,
        ];
    }

    public function getFilteredConsolidatedProperty(): array
    {
        $list = $this->planningData['consolidated'];

        return array_values(array_filter($list, function ($item) {
            if ($this->selectedUnitFilter) {
                $uFilter = strtoupper(trim($this->selectedUnitFilter));
                $hasUnit = false;
                foreach ($item['units_allocated'] as $u) {
                    if (strtoupper(trim($u['equip_no'])) === $uFilter) {
                        $hasUnit = true;
                        break;
                    }
                }
                if (!$hasUnit) return false;
            }

            if ($this->categoryFilter !== 'ALL' && $item['category'] !== $this->categoryFilter) {
                return false;
            }

            if ($this->stockFilter === 'SHORTAGE' && $item['is_stock_sufficient']) {
                return false;
            }

            if ($this->stockFilter === 'READY' && !$item['is_stock_sufficient']) {
                return false;
            }

            if (filled($this->searchQuery)) {
                $q = strtolower(trim($this->searchQuery));
                $match = str_contains(strtolower($item['part_name']), $q)
                    || str_contains(strtolower($item['part_number']), $q)
                    || str_contains(strtolower($item['category']), $q);

                if (!$match) {
                    foreach ($item['units_allocated'] as $u) {
                        if (str_contains(strtolower($u['equip_no']), $q) || str_contains(strtolower($u['model']), $q)) {
                            $match = true;
                            break;
                        }
                    }
                }
                if (!$match) return false;
            }

            return true;
        }));
    }

    public function getDisplayUnitPlansProperty(): array
    {
        $plans = $this->planningData['unitPlans'];
        if (!$this->selectedUnitFilter) {
            return $plans;
        }

        $target = strtoupper(trim($this->selectedUnitFilter));
        $matched = [];
        $others = [];

        foreach ($plans as $p) {
            if (strtoupper(trim($p['equip_no'])) === $target) {
                $matched[] = $p;
            } else {
                $others[] = $p;
            }
        }

        return array_merge($matched, $others);
    }
}
