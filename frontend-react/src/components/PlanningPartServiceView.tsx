import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CalendarDays,
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  Filter,
  RefreshCw,
  Truck,
  Droplets,
  Wrench,
  Disc,
  Layers,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Package,
  ArrowUpRight,
  ExternalLink,
  ClipboardList,
  Sparkles,
  DollarSign,
  X
} from 'lucide-react';
import { TargetJamOperasi, PartServiceItem, Equipment, PartItem } from '../types';

interface PlanningPartServiceViewProps {
  targetJamOperasi?: TargetJamOperasi[];
  partServices?: PartServiceItem[];
  equipments?: Equipment[];
  parts?: PartItem[];
  initialFilterUnit?: string | null;
  onClearFilterUnit?: () => void;
  onRefresh?: () => void;
  onNavigate?: (tab: string) => void;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

interface ConsolidatedPartRow {
  part_name: string;
  part_number: string;
  category: string;
  total_qty: number;
  uom: string;
  stock_qty: number;
  shortage: number;
  is_stock_sufficient: boolean;
  price_estimate: number;
  total_estimated_cost: number;
  units_allocated: {
    equip_no: string;
    model: string;
    pm_type: string;
    qty: number;
  }[];
}

interface UnitServicePlan {
  equip_no: string;
  model: string;
  section: string;
  est_hm: number;
  next_service_hours_due?: number;
  next_service_type?: string;
  next_service_date?: string;
  next_service_hours_due_2?: number;
  next_service_type_2?: string;
  pm_events: {
    interval: string;
    count: number;
    parts: {
      part_name: string;
      part_number: string;
      category: string;
      qty: number;
      uom: string;
    }[];
  }[];
}

export const PlanningPartServiceView: React.FC<PlanningPartServiceViewProps> = ({
  targetJamOperasi = [],
  partServices = [],
  equipments = [],
  parts = [],
  initialFilterUnit = null,
  onClearFilterUnit,
  onRefresh,
  onNavigate
}) => {
  // Current local time is 2026-09-21, so default to 2026 and 9
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9);
  const [activeTab, setActiveTab] = useState<'konsolidasi' | 'per_unit' | 'fluida_filter'>('konsolidasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'SHORTAGE' | 'READY'>('ALL');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string | null>(initialFilterUnit || null);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(initialFilterUnit || null);

  // Sync state if initialFilterUnit changes from navigation
  React.useEffect(() => {
    if (initialFilterUnit) {
      setSelectedUnitFilter(initialFilterUnit);
      setExpandedUnit(initialFilterUnit);
    }
  }, [initialFilterUnit]);

  // Available Years extracted from targetJamOperasi
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    set.add(2026);
    targetJamOperasi.forEach(t => {
      if (t.plan_year) set.add(t.plan_year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [targetJamOperasi]);

  // Filter target jam operasi records for selected period
  const periodTargets = useMemo(() => {
    return targetJamOperasi.filter(
      t => Number(t.plan_year) === selectedYear && Number(t.plan_month) === selectedMonth
    );
  }, [targetJamOperasi, selectedYear, selectedMonth]);

  // Stock lookup map by part_number (case-insensitive)
  const stockMap = useMemo(() => {
    const map = new Map<string, { stock_qty: number; price: number; unit: string }>();
    parts.forEach(p => {
      if (p.part_number) {
        map.set(p.part_number.trim().toUpperCase(), {
          stock_qty: Number(p.stock_qty || (p as any).stock || 0),
          price: Number(p.price || 0),
          unit: p.unit || (p as any).uom || 'PC'
        });
      }
    });
    return map;
  }, [parts]);

  // Build Unit Service Plans and Calculate Total Part Requirements
  const { unitPlans, consolidatedParts, metrics } = useMemo(() => {
    const unitPlansList: UnitServicePlan[] = [];
    const consolidatedMap = new Map<string, ConsolidatedPartRow>();

    let totalOilsLiter = 0;
    let totalFiltersPcs = 0;
    let totalSOSBottles = 0;
    let totalPmEvents = 0;
    let totalEstimatedCost = 0;

    periodTargets.forEach(target => {
      const equipNo = target.equip_no || '';
      const model = (target.model || '').toUpperCase().trim();
      const section = target.section || 'MINING';

      // Find part matrices for this model (or matching equipment)
      const matchingParts = partServices.filter(p => {
        const pModel = (p.model || '').toUpperCase().trim();
        const pEquip = (p.equipment || '').toUpperCase().trim();
        if (pModel && model && (pModel.includes(model) || model.includes(pModel))) {
          return true;
        }
        if (pEquip && section && pEquip.includes(section)) {
          return true;
        }
        return false;
      });

      // Scheduled intervals in this month
      const pmEvents: {
        interval: string;
        count: number;
        parts: { part_name: string; part_number: string; category: string; qty: number; uom: string }[];
      }[] = [];

      const intervalCounts: { key: string; field: 'ps_250' | 'ps_500' | 'ps_1000' | 'ps_2000' | 'ps_4000'; count: number }[] = [
        { key: 'PS 250', field: 'ps_250', count: Number(target.pm_250 || 0) },
        { key: 'PS 500', field: 'ps_500', count: Number(target.pm_500 || 0) },
        { key: 'PS 1000', field: 'ps_1000', count: Number(target.pm_1000 || 0) },
        { key: 'PS 2000', field: 'ps_2000', count: Number(target.pm_2000 || 0) },
        { key: 'PS 4000', field: 'ps_4000', count: Number(target.pm_4000 || 0) },
      ];

      // Fallback: If pm_* counts are 0 but next_service_type is specified and due in this month
      const totalCountSpecified = intervalCounts.reduce((acc, curr) => acc + curr.count, 0);
      if (totalCountSpecified === 0 && target.next_service_type) {
        const typeStr = String(target.next_service_type).trim();
        if (typeStr.includes('250')) intervalCounts[0].count = 1;
        else if (typeStr.includes('500')) intervalCounts[1].count = 1;
        else if (typeStr.includes('1000')) intervalCounts[2].count = 1;
        else if (typeStr.includes('2000')) intervalCounts[3].count = 1;
        else if (typeStr.includes('4000')) intervalCounts[4].count = 1;
      }

      intervalCounts.forEach(({ key, field, count }) => {
        if (count > 0) {
          totalPmEvents += count;

          // Collect parts for this interval
          const eventPartsList: { part_name: string; part_number: string; category: string; qty: number; uom: string }[] = [];

          matchingParts.forEach(part => {
            const qtyNeededPerService = Number(part[field] || 0);
            if (qtyNeededPerService > 0) {
              const totalQtyForUnit = qtyNeededPerService * count;
              const category = part.category || 'General';
              const partNo = (part.part_number || '').trim().toUpperCase();
              const partName = (part.part_name || '').trim().toUpperCase();

              // Determine UOM
              let uom = 'PC';
              if (category.toLowerCase().includes('oil') || category.toLowerCase().includes('lubricant') || partName.includes('OIL')) {
                uom = 'LTR';
                totalOilsLiter += totalQtyForUnit;
              } else if (category.toLowerCase().includes('filter') || partName.includes('FILTER')) {
                uom = 'PC';
                totalFiltersPcs += totalQtyForUnit;
              } else if (partName.includes('BOTTLE') || partName.includes('SAMPLE')) {
                uom = 'BOTOL';
                totalSOSBottles += totalQtyForUnit;
              }

              eventPartsList.push({
                part_name: partName,
                part_number: partNo,
                category,
                qty: totalQtyForUnit,
                uom
              });

              // Add to consolidated map
              const mapKey = `${partNo}___${partName}`;
              if (!consolidatedMap.has(mapKey)) {
                const stockInfo = stockMap.get(partNo);
                const stockQty = stockInfo ? stockInfo.stock_qty : 0;
                const priceEst = stockInfo && stockInfo.price > 0 ? stockInfo.price : 150000;

                consolidatedMap.set(mapKey, {
                  part_name: partName,
                  part_number: partNo,
                  category,
                  total_qty: 0,
                  uom,
                  stock_qty: stockQty,
                  shortage: 0,
                  is_stock_sufficient: true,
                  price_estimate: priceEst,
                  total_estimated_cost: 0,
                  units_allocated: []
                });
              }

              const existing = consolidatedMap.get(mapKey)!;
              existing.total_qty += totalQtyForUnit;
              existing.units_allocated.push({
                equip_no: equipNo,
                model,
                pm_type: `${key} (${count}x)`,
                qty: totalQtyForUnit
              });
            }
          });

          if (eventPartsList.length > 0) {
            pmEvents.push({
              interval: key,
              count,
              parts: eventPartsList
            });
          }
        }
      });

      if (pmEvents.length > 0 || (target.next_service_hours_due && target.next_service_hours_due > 0)) {
        unitPlansList.push({
          equip_no: equipNo,
          model,
          section,
          est_hm: Number(target.est_hm || 0),
          next_service_hours_due: target.next_service_hours_due,
          next_service_type: target.next_service_type,
          next_service_date: target.next_service_date,
          next_service_hours_due_2: target.next_service_hours_due_2,
          next_service_type_2: target.next_service_type_2,
          pm_events: pmEvents
        });
      }
    });

    // Finalize consolidated rows & calculate shortages
    const consolidatedList: ConsolidatedPartRow[] = [];
    consolidatedMap.forEach(row => {
      row.shortage = Math.max(0, row.total_qty - row.stock_qty);
      row.is_stock_sufficient = row.stock_qty >= row.total_qty;
      row.total_estimated_cost = row.total_qty * row.price_estimate;
      totalEstimatedCost += row.total_estimated_cost;
      consolidatedList.push(row);
    });

    // Sort by total quantity desc
    consolidatedList.sort((a, b) => b.total_qty - a.total_qty);

    return {
      unitPlans: unitPlansList,
      consolidatedParts: consolidatedList,
      metrics: {
        totalOilsLiter,
        totalOilsDrum: (totalOilsLiter / 200).toFixed(1),
        totalFiltersPcs,
        totalSOSBottles,
        totalPmEvents,
        totalUnitsServiced: unitPlansList.filter(u => u.pm_events.length > 0).length,
        totalEstimatedCost
      }
    };
  }, [periodTargets, partServices, stockMap]);

  // Categories list for filter
  const categoriesList = useMemo(() => {
    const list = Array.from(new Set(consolidatedParts.map(p => p.category).filter(Boolean)));
    return list.sort();
  }, [consolidatedParts]);

  // Sorted unit plans for Tab 2 (selected unit prioritized at top)
  const displayUnitPlans = useMemo(() => {
    if (!selectedUnitFilter) return unitPlans;
    const target = selectedUnitFilter.toUpperCase().trim();
    const matched = unitPlans.filter(u => u.equip_no.toUpperCase().trim() === target);
    const others = unitPlans.filter(u => u.equip_no.toUpperCase().trim() !== target);
    return [...matched, ...others];
  }, [unitPlans, selectedUnitFilter]);

  // Filtered Consolidated Parts
  const filteredConsolidated = useMemo(() => {
    return consolidatedParts.filter(item => {
      if (selectedUnitFilter) {
        const uFilter = selectedUnitFilter.toUpperCase().trim();
        const hasUnit = item.units_allocated.some(
          u => u.equip_no.toUpperCase().trim() === uFilter
        );
        if (!hasUnit) return false;
      }
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
        return false;
      }
      if (stockFilter === 'SHORTAGE' && item.is_stock_sufficient) {
        return false;
      }
      if (stockFilter === 'READY' && !item.is_stock_sufficient) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.part_name.toLowerCase().includes(q) ||
          item.part_number.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.units_allocated.some(u => u.equip_no.toLowerCase().includes(q) || u.model.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [consolidatedParts, categoryFilter, stockFilter, searchQuery, selectedUnitFilter]);

  // Export to CSV / Excel
  const handleExportCSV = () => {
    const headers = [
      'NO',
      'PART NAME',
      'PART NUMBER',
      'CATEGORY',
      'TOTAL KEBUTUHAN (PLAN)',
      'SATUAN',
      'STOK GUDANG',
      'DEFISIT / KEKURANGAN',
      'STATUS KESIAPAN',
      'EST. HARGA SATUAN',
      'EST. TOTAL BIAYA',
      'ALOKASI UNIT'
    ];

    const rows = filteredConsolidated.map((p, idx) => [
      idx + 1,
      `"${p.part_name.replace(/"/g, '""')}"`,
      `"${p.part_number.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      p.total_qty,
      p.uom,
      p.stock_qty,
      p.shortage,
      p.is_stock_sufficient ? 'READY' : 'DEFISIT / ORDER NEEDED',
      p.price_estimate,
      p.total_estimated_cost,
      `"${p.units_allocated.map(u => `${u.equip_no} (${u.pm_type})`).join('; ')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = `Planning_Part_Service_${MONTH_NAMES[selectedMonth - 1]}_${selectedYear}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card: Title, Month Selector & Action Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
                <ClipboardList className="w-3.5 h-3.5" />
                ESTIMASI MATERIAL REQUIREMENT PLANNING (MRP)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <CalendarDays className="w-3.5 h-3.5" />
                Periode: {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Planning Kebutuhan Part Service Bulanan
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Kalkulasi otomatis seluruh suku cadang, pelumas & filter yang harus disiapkan dalam 1 bulan berjalan berdasarkan estimasi Target Jam Operasi
            </p>
          </div>

          {/* Month & Year Selectors and Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month Picker */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 shadow-xs">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx + 1} className="dark:bg-slate-900">
                    {name}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none cursor-pointer border-l border-slate-300 dark:border-slate-600 pl-2"
              >
                {availableYears.map(yr => (
                  <option key={yr} value={yr} className="dark:bg-slate-900">
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Excel Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-xs transition"
              title="Unduh Lembar Kebutuhan Part Service Excel"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition"
              title="Cetak Laporan Perencanaan Bulanan"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* Refresh Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 transition"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards Banner (KPI Ringkasan Kebutuhan 1 Bulan Berjalan) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mt-5">
          {/* 1. Total Pelumas & Fluida */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                Total Pelumas (Oli)
              </span>
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.totalOilsLiter.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Liter
              </span>
            </div>
            <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1 font-medium">
              ≈ {metrics.totalOilsDrum} Drum (200L)
            </p>
          </div>

          {/* 2. Total Filter */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                Kebutuhan Filter
              </span>
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Filter className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.totalFiltersPcs.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Pieces
              </span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1 font-medium">
              Oli, Solar, Udara, Hidrolik
            </p>
          </div>

          {/* 3. Botol SOS Sampling */}
          <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                Botol Sampling SOS
              </span>
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.totalSOSBottles.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Botol
              </span>
            </div>
            <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-1 font-medium">
              Uji Lab Pelumas Mesin & Hidrolik
            </p>
          </div>

          {/* 4. Jadwal Servis Unit */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Event Servis Terjadwal
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metrics.totalPmEvents}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                PM Event
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1 font-medium">
              Pada {metrics.totalUnitsServiced} Unit Armada Pit
            </p>
          </div>

          {/* 5. Estimasi Anggaran Pengadaan */}
          <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Est. Total Biaya Part
              </span>
              <div className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Rp {metrics.totalEstimatedCost.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Anggaran kebutuhan plan bulan ini
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('konsolidasi')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'konsolidasi'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Kebutuhan Part Konsolidasi (MRP)</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'konsolidasi'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {filteredConsolidated.length} Part
            </span>
          </button>

          <button
            onClick={() => setActiveTab('per_unit')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'per_unit'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Rincian Servis Per Unit Armada</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'per_unit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {unitPlans.length} Unit
            </span>
          </button>

          <button
            onClick={() => setActiveTab('fluida_filter')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'fluida_filter'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Analisis Fluida & Filter (Drum/Pail)</span>
          </button>
        </div>

        {/* Quick Links to Master Part Service & Target Jam Operasi */}
        <div className="flex items-center gap-2">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('target_jam_operasi')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 transition"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Buka Target Jam Operasi</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => onNavigate('master_part_service')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Buka Master Part Service</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: KEBUTUHAN PART KONSOLIDASI (MRP BULANAN)
          ========================================================================= */}
      {activeTab === 'konsolidasi' && (
        <div className="space-y-4">
          {/* Active Unit Allocation Filter Banner */}
          {selectedUnitFilter && (
            <div className="p-3.5 bg-blue-50/90 dark:bg-blue-950/50 border-2 border-blue-400 dark:border-blue-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-900 dark:text-blue-200 tracking-wider">
                      Alokasi Unit Terjadwal:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-mono font-black text-xs shadow-sm">
                      {selectedUnitFilter}
                    </span>
                    {periodTargets.find(t => t.equip_no === selectedUnitFilter)?.model && (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        • {periodTargets.find(t => t.equip_no === selectedUnitFilter)?.model}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                    Menampilkan daftar suku cadang & pelumas yang dialokasikan khusus untuk unit <strong>{selectedUnitFilter}</strong> pada periode {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('per_unit');
                    setExpandedUnit(selectedUnitFilter);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Lihat BOM Servis Unit</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUnitFilter(null);
                    if (onClearFilterUnit) onClearFilterUnit();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Tampilkan semua unit kembali"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Filter Unit</span>
                </button>
              </div>
            </div>
          )}

          {/* Filters Bar: Search, Category, Stock Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama part, nomor part, atau nomor unit..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
                <span className="text-slate-400 font-medium">Kategori:</span>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option value="ALL" className="dark:bg-slate-900">Semua Kategori</option>
                  {categoriesList.map(c => (
                    <option key={c} value={c} className="dark:bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>

              {/* Stock Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs">
                <span className="text-slate-400 font-medium">Status Gudang:</span>
                <select
                  value={stockFilter}
                  onChange={e => setStockFilter(e.target.value as any)}
                  className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                >
                  <option value="ALL" className="dark:bg-slate-900">Semua Status</option>
                  <option value="SHORTAGE" className="dark:bg-slate-900 text-rose-600">🔴 Defisit / Kurang</option>
                  <option value="READY" className="dark:bg-slate-900 text-emerald-600">🟢 Stok Aman / Cukup</option>
                </select>
              </div>
            </div>
          </div>

          {/* Consolidated Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border-spacing-0 text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-black uppercase tracking-wider">
                    <th className="px-4 py-3 border-r border-slate-300 dark:border-slate-700 w-12 text-center">NO</th>
                    <th className="px-4 py-3 border-r border-slate-300 dark:border-slate-700 min-w-[220px]">NAMA SUKU CADANG</th>
                    <th className="px-4 py-3 border-r border-slate-300 dark:border-slate-700 min-w-[160px]">NOMOR PART / SPEK</th>
                    <th className="px-3 py-3 border-r border-slate-300 dark:border-slate-700 min-w-[130px]">KATEGORI</th>
                    <th className="px-3 py-3 border-r border-slate-300 dark:border-slate-700 text-center w-28 bg-blue-50/60 dark:bg-blue-950/40 font-bold text-blue-900 dark:text-blue-200">
                      KEBUTUHAN PLAN
                    </th>
                    <th className="px-3 py-3 border-r border-slate-300 dark:border-slate-700 text-center w-28">
                      STOK GUDANG
                    </th>
                    <th className="px-3 py-3 border-r border-slate-300 dark:border-slate-700 text-center w-28 text-rose-700 dark:text-rose-300">
                      KEKURANGAN
                    </th>
                    <th className="px-3 py-3 border-r border-slate-300 dark:border-slate-700 text-center w-32">
                      STATUS KESIAPAN
                    </th>
                    <th className="px-4 py-3 min-w-[200px]">ALOKASI UNIT TERJADWAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 dark:divide-slate-700 font-sans">
                  {filteredConsolidated.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                          <Package className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            Tidak ada kebutuhan part service pada periode ini
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Pastikan terdapat jadwal servis pada periode {MONTH_NAMES[selectedMonth - 1]} {selectedYear} di Target Jam Operasi.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredConsolidated.map((part, idx) => (
                      <tr
                        key={`${part.part_number}_${part.part_name}`}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        {/* NO */}
                        <td className="px-4 py-2.5 border-r border-slate-300 dark:border-slate-700 text-center text-slate-500">
                          {idx + 1}
                        </td>

                        {/* PART NAME */}
                        <td className="px-4 py-2.5 border-r border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white uppercase">
                          {part.part_name}
                        </td>

                        {/* PART NUMBER */}
                        <td className="px-4 py-2.5 border-r border-slate-300 dark:border-slate-700 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {part.part_number}
                        </td>

                        {/* CATEGORY */}
                        <td className="px-3 py-2.5 border-r border-slate-300 dark:border-slate-700">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {part.category}
                          </span>
                        </td>

                        {/* TOTAL KEBUTUHAN PLAN */}
                        <td className="px-3 py-2.5 border-r border-slate-300 dark:border-slate-700 text-center font-black text-sm text-blue-700 dark:text-blue-300 bg-blue-50/40 dark:bg-blue-950/20">
                          {part.total_qty.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">{part.uom}</span>
                        </td>

                        {/* STOK GUDANG */}
                        <td className="px-3 py-2.5 border-r border-slate-300 dark:border-slate-700 text-center font-semibold text-slate-800 dark:text-slate-200">
                          {part.stock_qty.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-400">{part.uom}</span>
                        </td>

                        {/* KEKURANGAN / SHORTAGE */}
                        <td className="px-3 py-2.5 border-r border-slate-300 dark:border-slate-700 text-center font-bold">
                          {part.shortage > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400 font-black">
                              -{part.shortage.toLocaleString('id-ID')} {part.uom}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              Cukup
                            </span>
                          )}
                        </td>

                        {/* STATUS KESIAPAN GUDANG */}
                        <td className="px-3 py-2.5 border-r border-slate-300 dark:border-slate-700 text-center">
                          {part.is_stock_sufficient ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <CheckCircle2 className="w-3 h-3" />
                              STOK AMAN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 animate-pulse">
                              <AlertTriangle className="w-3 h-3" />
                              PERLU ORDER
                            </span>
                          )}
                        </td>

                        {/* ALOKASI UNIT */}
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {part.units_allocated.map((u, i) => {
                              const isSelected =
                                selectedUnitFilter &&
                                u.equip_no.toUpperCase().trim() === selectedUnitFilter.toUpperCase().trim();
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedUnitFilter(null);
                                      if (onClearFilterUnit) onClearFilterUnit();
                                    } else {
                                      setSelectedUnitFilter(u.equip_no);
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-blue-600 text-white font-black ring-2 ring-blue-400 shadow-sm'
                                      : 'bg-slate-100 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-blue-700 hover:border-blue-300'
                                  }`}
                                  title={`Klik untuk memfilter atau melihat detail alokasi unit ${u.equip_no} (${u.model})`}
                                >
                                  <strong>{u.equip_no}</strong>
                                  <span className="opacity-80">({u.pm_type}: {u.qty})</span>
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-t border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div>
                Menampilkan <strong>{filteredConsolidated.length}</strong> part yang direncanakan untuk periode <strong>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</strong>
              </div>
              <div className="flex items-center gap-4">
                <span>
                  Barang Perlu Order:{' '}
                  <strong className="text-rose-600 dark:text-rose-400">
                    {consolidatedParts.filter(p => !p.is_stock_sufficient).length} Part
                  </strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span>
                  Barang Stok Aman:{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {consolidatedParts.filter(p => p.is_stock_sufficient).length} Part
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: RINCIAN SERVIS PER UNIT ARMADA
          ========================================================================= */}
      {activeTab === 'per_unit' && (
        <div className="space-y-4">
          {/* Active Unit Filter Banner for Tab 2 */}
          {selectedUnitFilter && (
            <div className="p-3.5 bg-blue-50/90 dark:bg-blue-950/50 border-2 border-blue-400 dark:border-blue-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-900 dark:text-blue-200 tracking-wider">
                      Fokus Unit Armada Terjadwal:
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-mono font-black text-xs shadow-sm">
                      {selectedUnitFilter}
                    </span>
                    {periodTargets.find(t => t.equip_no === selectedUnitFilter)?.model && (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        • {periodTargets.find(t => t.equip_no === selectedUnitFilter)?.model}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                    Menampilkan rincian servis & Bill of Materials (BOM) untuk unit ini pada periode {MONTH_NAMES[selectedMonth - 1]} {selectedYear}.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('konsolidasi')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Lihat Konsolidasi MRP</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUnitFilter(null);
                    if (onClearFilterUnit) onClearFilterUnit();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Filter Unit</span>
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {displayUnitPlans.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                <Truck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Tidak ada armada yang terjadwal servis pada periode ini
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Pilih bulan lain pada dropdown di atas atau atur estimasi di modul Target Jam Operasi.
                </p>
              </div>
            ) : (
              displayUnitPlans.map(unit => {
                const isSelected =
                  selectedUnitFilter &&
                  unit.equip_no.toUpperCase().trim() === selectedUnitFilter.toUpperCase().trim();
                const isExpanded = isSelected || expandedUnit === unit.equip_no;
                const totalUnitPartsCount = unit.pm_events.reduce(
                  (acc, curr) => acc + curr.parts.length,
                  0
                );

                return (
                  <div
                    key={unit.equip_no}
                    className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 shadow-sm transition-all ${
                      isSelected
                        ? 'border-2 border-blue-500 ring-4 ring-blue-400/20 bg-blue-50/15 dark:bg-blue-950/25 shadow-md'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setExpandedUnit(isExpanded && !isSelected ? null : unit.equip_no)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-500 cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                              {unit.equip_no}
                            </span>
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                                <CheckCircle2 className="w-3 h-3" />
                                ALOKASI TERPILIH
                              </span>
                            )}
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {unit.section}
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {unit.model}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              HM Awal: <strong>{unit.est_hm.toLocaleString('id-ID')}</strong>
                            </span>
                            {unit.next_service_hours_due && (
                              <>
                                <span>•</span>
                                <span>
                                  Target HM Servis: <strong>{unit.next_service_hours_due.toLocaleString('id-ID')}</strong>
                                </span>
                              </>
                            )}
                            {unit.next_service_date && (
                              <>
                                <span>•</span>
                                <span>
                                  Est. Tanggal: <strong>{unit.next_service_date}</strong>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Event Badges */}
                      <div className="flex items-center gap-2 pl-9 sm:pl-0">
                        {unit.pm_events.map(ev => (
                          <span
                            key={ev.interval}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                          >
                            {ev.interval} ({ev.count}x)
                          </span>
                        ))}
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 font-medium">
                          {totalUnitPartsCount} Suku Cadang
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Details Table */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-blue-600" />
                          Daftar Bill of Materials (BOM) yang Harus Disiapkan untuk {unit.equip_no}:
                        </h4>

                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                                <th className="px-3 py-2">INTERVAL SERVIS</th>
                                <th className="px-3 py-2">NAMA PART</th>
                                <th className="px-3 py-2">NOMOR PART</th>
                                <th className="px-3 py-2">KATEGORI</th>
                                <th className="px-3 py-2 text-center">KUANTITAS KEBUTUHAN</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              {unit.pm_events.flatMap(ev =>
                                ev.parts.map((p, idx) => (
                                  <tr key={`${ev.interval}_${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                    <td className="px-3 py-2 font-bold text-amber-700 dark:text-amber-400">
                                      {ev.interval}
                                    </td>
                                    <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white uppercase">
                                      {p.part_name}
                                    </td>
                                    <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-300">
                                      {p.part_number}
                                    </td>
                                    <td className="px-3 py-2 text-slate-500">
                                      {p.category}
                                    </td>
                                    <td className="px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400">
                                      {p.qty} {p.uom}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ANALISIS FLUIDA & FILTER (DRUM & PAIL CONVERSION)
          ========================================================================= */}
      {activeTab === 'fluida_filter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Lubricants Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Rencana Kebutuhan Pelumas & Fluida
                </h3>
                <p className="text-xs text-slate-500">
                  Estimasi liter, drum (200 Ltr), dan pail (20 Ltr) untuk pengadaan logistik
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {consolidatedParts
                .filter(
                  p =>
                    p.category.toLowerCase().includes('oil') ||
                    p.category.toLowerCase().includes('lubricant') ||
                    p.part_name.includes('OIL')
                )
                .map(oil => {
                  const drums = (oil.total_qty / 200).toFixed(1);
                  const pails = Math.ceil(oil.total_qty / 20);

                  return (
                    <div
                      key={oil.part_number}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white uppercase">
                          {oil.part_name}
                        </span>
                        <p className="text-[11px] font-mono text-slate-500">{oil.part_number}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-blue-600 dark:text-blue-400">
                          {oil.total_qty.toLocaleString('id-ID')} Ltr
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium">
                          ≈ {drums} Drum (200L) / {pails} Pail
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Rencana Kebutuhan Elemen Saringan (Filter)
                </h3>
                <p className="text-xs text-slate-500">
                  Total suku cadang filter yang harus tersedia di rak gudang
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {consolidatedParts
                .filter(
                  p =>
                    p.category.toLowerCase().includes('filter') ||
                    p.part_name.includes('FILTER')
                )
                .map(filterItem => (
                  <div
                    key={filterItem.part_number}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white uppercase">
                        {filterItem.part_name}
                      </span>
                      <p className="text-[11px] font-mono text-slate-500">{filterItem.part_number}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">
                        {filterItem.total_qty} {filterItem.uom}
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Stok Gudang: {filterItem.stock_qty} {filterItem.uom}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
