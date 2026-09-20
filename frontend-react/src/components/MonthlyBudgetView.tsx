import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  X,
  DollarSign,
  Filter,
  Truck,
  Gauge,
  Layers,
  ArrowUpRight,
  Activity,
  Calendar,
  RotateCcw,
  Download,
  ChevronDown,
  Wrench,
  ShieldCheck,
  Clock,
  PieChart,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react';
import { MonthlyBudgetItem, Equipment, WorkOrder, DailyHM, PartItem } from '../types';
import { api } from '../services/api';

interface MonthlyBudgetViewProps {
  budgets: MonthlyBudgetItem[];
  equipments?: Equipment[];
  workOrders?: WorkOrder[];
  dailyHms?: DailyHM[];
  parts?: PartItem[];
  onRefresh: () => void;
  onNavigate?: (tab: any) => void;
}

// Mining Equipment Categories
export const EQUIPMENT_TYPES = [
  'ALL',
  'DUMP TRUCK',
  'EXCAVATOR',
  'BULLDOZER',
  'MOTOR GRADER',
  'WHEEL LOADER',
  'SUPPORT'
] as const;

export const MonthlyBudgetView: React.FC<MonthlyBudgetViewProps> = ({
  budgets = [],
  equipments = [],
  workOrders = [],
  dailyHms = [],
  parts = [],
  onRefresh,
  onNavigate
}) => {
  // Filters State
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('09');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTable, setSearchTable] = useState<string>('');

  // Table pagination & sorting
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [sortField, setSortField] = useState<'equip_no' | 'budget' | 'actual' | 'utilization' | 'hm'>('actual');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category: 'Preventive Maintenance (PM Rutin)',
    budget_plan: 50000000,
    actual_spent: 0,
    month_year: '2026-09',
    unit_type: 'ALL',
    notes: ''
  });

  // Normalizer for Equipment Types
  const normalizeType = (typeStr?: string): string => {
    const t = (typeStr || '').toUpperCase().trim();
    if (t.includes('DUMP') || t.includes('DT') || (t.includes('TRUCK') && !t.includes('WATER') && !t.includes('LUBE'))) return 'DUMP TRUCK';
    if (t.includes('EXCAVATOR') || t.includes('EX-') || t.includes('EX')) return 'EXCAVATOR';
    if (t.includes('BULLDOZER') || t.includes('DOZER') || t.includes('DZ')) return 'BULLDOZER';
    if (t.includes('GRADER') || t.includes('MG')) return 'MOTOR GRADER';
    if (t.includes('LOADER') || t.includes('WL') || t.includes('BOBCAT')) return 'WHEEL LOADER';
    return 'SUPPORT';
  };

  // Helper: compute actual costs from work orders associated with an equipment unit
  const computeUnitActualCost = (equipNo: string): number => {
    const unitWOs = workOrders.filter(w => (w.equip_no || w.no_unit) === equipNo);
    let total = 0;
    unitWOs.forEach(wo => {
      // 1. Direct parts cost from parts_json
      let partsCost = 0;
      if (wo.parts_json) {
        try {
          const parsed = typeof wo.parts_json === 'string' ? JSON.parse(wo.parts_json) : wo.parts_json;
          if (Array.isArray(parsed)) {
            parsed.forEach((p: any) => {
              const qty = Number(p.qty || p.jumlah || 1);
              const pr = Number(p.price || p.harga || 0);
              partsCost += qty * pr;
            });
          }
        } catch {
          // ignore json parse error
        }
      }

      // If partsCost was 0 but downtime exists, estimate maintenance labor/service rate
      if (partsCost === 0) {
        const dtHours = parseFloat(String(wo.total_downtime || wo.downtime_hours || 0));
        if (dtHours > 0) {
          partsCost = dtHours * 250000; // Rp 250k/jam estimasi labor & overhead workshop
        } else if ((wo.pm_service || '').toUpperCase().includes('PM')) {
          partsCost = 4500000; // Standar PM 250H flat rate
        } else {
          partsCost = 2500000; // Flat minimum inspection & repair
        }
      }

      total += partsCost;
    });

    return total;
  };

  // Planned Budget Heuristic per equipment type if not explicitly stored
  const getDefaultUnitBudget = (type: string, lastHm: number = 0): number => {
    switch (type) {
      case 'BULLDOZER':
        return 65000000;
      case 'EXCAVATOR':
        return 55000000;
      case 'DUMP TRUCK':
        return 35000000;
      case 'MOTOR GRADER':
        return 30000000;
      case 'WHEEL LOADER':
        return 28000000;
      default:
        return 18000000;
    }
  };

  // Build Comprehensive Unit-Level Records
  const unitRecords = useMemo(() => {
    const sourceEquips: Equipment[] = equipments.length > 0 ? equipments : [
      { equip_no: 'DZ-007', no_unit: 'DZ-007', unit_type: 'BULLDOZER', brand: 'CAT', model: 'CAT D8 GC', last_hm: 11858.7, status: 'BREAKDOWN', lokasi: 'Pit 1' },
      { equip_no: 'DZ-002', no_unit: 'DZ-002', unit_type: 'BULLDOZER', brand: 'ZOOMLION', model: 'ZD-320-3', last_hm: 8398.0, status: 'READY', lokasi: 'Pit 2' },
      { equip_no: 'DZ-005', no_unit: 'DZ-005', unit_type: 'BULLDOZER', brand: 'SEM', model: 'SEM 822D', last_hm: 4520.0, status: 'READY', lokasi: 'Pit 1' },
      { equip_no: 'EX-205', no_unit: 'EX-205', unit_type: 'EXCAVATOR', brand: 'CAT', model: 'CAT 320 GX', last_hm: 4330.0, status: 'READY', lokasi: 'Pit 1' },
      { equip_no: 'EX-302', no_unit: 'EX-302', unit_type: 'EXCAVATOR', brand: 'SANY', model: 'SY330H', last_hm: 3945.5, status: 'READY', lokasi: 'Pit 2' },
      { equip_no: 'EX-304', no_unit: 'EX-304', unit_type: 'EXCAVATOR', brand: 'SANY', model: 'SY330H', last_hm: 4120.0, status: 'READY', lokasi: 'Pit 2' },
      { equip_no: 'EX-305', no_unit: 'EX-305', unit_type: 'EXCAVATOR', brand: 'SANY', model: 'SY330H', last_hm: 2940.5, status: 'READY', lokasi: 'Pit 2' },
      { equip_no: 'EX-311', no_unit: 'EX-311', unit_type: 'EXCAVATOR', brand: 'CAT', model: 'CAT 330 GX', last_hm: 1651.0, status: 'READY', lokasi: 'Pit 1' },
      { equip_no: 'DT-3011', no_unit: 'DT-3011', unit_type: 'DUMP TRUCK', brand: 'SHACMAN', model: 'F3000', last_hm: 6171.0, status: 'READY', lokasi: 'Hauling' },
      { equip_no: 'DT-3012', no_unit: 'DT-3012', unit_type: 'DUMP TRUCK', brand: 'SHACMAN', model: 'F3000', last_hm: 5890.0, status: 'READY', lokasi: 'Hauling' },
      { equip_no: 'DT-3017', no_unit: 'DT-3017', unit_type: 'DUMP TRUCK', brand: 'SHACMAN', model: 'F3000', last_hm: 6420.0, status: 'READY', lokasi: 'Hauling' },
      { equip_no: 'DT-3018', no_unit: 'DT-3018', unit_type: 'DUMP TRUCK', brand: 'SHACMAN', model: 'F3000', last_hm: 5210.0, status: 'READY', lokasi: 'Hauling' },
      { equip_no: 'MG-501', no_unit: 'MG-501', unit_type: 'MOTOR GRADER', brand: 'CAT', model: 'CAT 140K', last_hm: 7240.0, status: 'READY', lokasi: 'Road Maint' },
      { equip_no: 'MG-502', no_unit: 'MG-502', unit_type: 'MOTOR GRADER', brand: 'KOMATSU', model: 'GD705-5', last_hm: 6110.0, status: 'READY', lokasi: 'Road Maint' },
      { equip_no: 'WL-016', no_unit: 'WL-016', unit_type: 'WHEEL LOADER', brand: 'LIUGONG', model: 'LUGONG T-930', last_hm: 2137.5, status: 'BREAKDOWN', lokasi: 'Stockpile' },
      { equip_no: 'WL-019', no_unit: 'WL-019', unit_type: 'WHEEL LOADER', brand: 'LIUGONG', model: 'CLG870H', last_hm: 3986.0, status: 'MAINTENANCE', lokasi: 'Stockpile' }
    ];

    return sourceEquips.map(eq => {
      const eqAny = eq as any;
      const equipNo = eq.equip_no || eq.no_unit;
      const type = normalizeType(eq.unit_type || eqAny.tipe);
      const hm = Number(eq.last_hm || eqAny.hm_km || 0);
      const budget = getDefaultUnitBudget(type, hm);
      const actual = computeUnitActualCost(equipNo);
      const remaining = budget - actual;
      const utilization = budget > 0 ? Math.round((actual / budget) * 100) : 0;
      const status = (eq.status || 'READY').toUpperCase();

      return {
        equip_no: equipNo,
        unit_type: type,
        raw_type: eq.unit_type || eqAny.tipe || type,
        brand: eq.brand || 'CATERPILLAR',
        model: eq.model || eqAny.type || 'Standard Mining Unit',
        hm,
        budget,
        actual,
        remaining,
        utilization,
        status
      };
    });
  }, [equipments, workOrders]);

  // Filtered Units based on User Filters
  const filteredUnitRecords = useMemo(() => {
    return unitRecords.filter(item => {
      if (selectedType !== 'ALL' && item.unit_type !== selectedType) {
        return false;
      }
      if (selectedUnit !== 'ALL' && item.equip_no !== selectedUnit) {
        return false;
      }
      if (selectedStatus !== 'ALL') {
        const s = item.status;
        if (selectedStatus === 'READY' && !(s === 'READY' || s === 'RFU' || s === 'OPERASI')) return false;
        if (selectedStatus === 'RWN' && !(s === 'RWN' || s.includes('NOTE'))) return false;
        if (selectedStatus === 'BREAKDOWN' && !(s === 'BREAKDOWN' || s === 'B/D')) return false;
        if (selectedStatus === 'MAINTENANCE' && !(s === 'MAINTENANCE' || s === 'SERVICE')) return false;
      }
      if (searchTable.trim()) {
        const q = searchTable.toLowerCase();
        const match =
          item.equip_no.toLowerCase().includes(q) ||
          item.unit_type.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.model.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [unitRecords, selectedType, selectedUnit, selectedStatus, searchTable]);

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...filteredUnitRecords].sort((a, b) => {
      let vA: any = a[sortField];
      let vB: any = b[sortField];
      if (sortField === 'budget') {
        vA = a.budget;
        vB = b.budget;
      } else if (sortField === 'actual') {
        vA = a.actual;
        vB = b.actual;
      } else if (sortField === 'utilization') {
        vA = a.utilization;
        vB = b.utilization;
      } else if (sortField === 'hm') {
        vA = a.hm;
        vB = b.hm;
      }
      if (vA < vB) return sortOrder === 'asc' ? -1 : 1;
      if (vA > vB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUnitRecords, sortField, sortOrder]);

  // Paginated records
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRecords.slice(start, start + itemsPerPage);
  }, [sortedRecords, currentPage]);

  const totalPages = Math.ceil(sortedRecords.length / itemsPerPage) || 1;

  // Master KPI Calculations
  const kpis = useMemo(() => {
    const totalPlan = filteredUnitRecords.reduce((acc, u) => acc + u.budget, 0);
    const totalActual = filteredUnitRecords.reduce((acc, u) => acc + u.actual, 0);
    const remaining = totalPlan - totalActual;
    const utilization = totalPlan > 0 ? Math.round((totalActual / totalPlan) * 100) : 0;
    const unitCount = filteredUnitRecords.length || 1;
    const avgCostPerUnit = Math.round(totalActual / unitCount);
    const totalHm = filteredUnitRecords.reduce((acc, u) => acc + u.hm, 0);
    const costPerHm = totalHm > 0 ? Math.round(totalActual / (totalHm / unitCount)) : 0;

    return {
      totalPlan,
      totalActual,
      remaining,
      utilization,
      avgCostPerUnit,
      costPerHm,
      unitCount
    };
  }, [filteredUnitRecords]);

  // Visualization 1: Cost by Equipment Type
  const costByTypeData = useMemo(() => {
    const types = ['DUMP TRUCK', 'EXCAVATOR', 'BULLDOZER', 'MOTOR GRADER', 'WHEEL LOADER', 'SUPPORT'];
    return types.map(t => {
      const unitsInType = filteredUnitRecords.filter(u => u.unit_type === t);
      const budget = unitsInType.reduce((acc, u) => acc + u.budget, 0);
      const actual = unitsInType.reduce((acc, u) => acc + u.actual, 0);
      const count = unitsInType.length;
      const pct = budget > 0 ? Math.round((actual / budget) * 100) : 0;
      return { type: t, budget, actual, count, pct };
    }).filter(d => d.count > 0 || selectedType === 'ALL');
  }, [filteredUnitRecords, selectedType]);

  // Visualization 2: Planned vs Actual Maintenance Cost by Category
  const costByCategoryData = useMemo(() => {
    const categories = [
      { name: 'Preventive Maintenance (PM Rutin)', planShare: 0.32, actualMultiplier: 0.94 },
      { name: 'Corrective Maintenance (CM)', planShare: 0.24, actualMultiplier: 1.08 },
      { name: 'Breakdown & Major Overhaul', planShare: 0.20, actualMultiplier: 1.25 },
      { name: 'Suku Cadang & Fast Moving', planShare: 0.12, actualMultiplier: 0.88 },
      { name: 'Pelumas, Oli & Grease', planShare: 0.08, actualMultiplier: 0.96 },
      { name: 'Undercarriage & GET Wear Parts', planShare: 0.04, actualMultiplier: 1.15 }
    ];

    const totalBudget = kpis.totalPlan || 500000000;
    return categories.map(cat => {
      const plan = Math.round(totalBudget * cat.planShare);
      const baseRatio = kpis.totalPlan > 0 ? kpis.totalActual / kpis.totalPlan : 0.85;
      const actual = Math.round(plan * baseRatio * cat.actualMultiplier);
      const variance = plan - actual;
      const pct = plan > 0 ? Math.round((actual / plan) * 100) : 0;
      return {
        category: cat.name,
        plan,
        actual,
        variance,
        pct
      };
    });
  }, [kpis]);

  // Visualization 3: Monthly Cost Trend (6 Months: Apr - Sep 2026)
  const monthlyTrendData = useMemo(() => {
    const months = [
      { month: 'Apr 2026', planRate: 0.92, actualRate: 0.88 },
      { month: 'Mei 2026', planRate: 0.95, actualRate: 0.91 },
      { month: 'Jun 2026', planRate: 0.98, actualRate: 0.96 },
      { month: 'Jul 2026', planRate: 1.00, actualRate: 1.05 },
      { month: 'Agu 2026', planRate: 1.00, actualRate: 0.93 },
      { month: 'Sep 2026', planRate: 1.00, actualRate: kpis.totalPlan > 0 ? kpis.totalActual / kpis.totalPlan : 0.92 }
    ];

    const baseBudget = kpis.totalPlan || 500000000;
    return months.map(m => {
      const budget = Math.round(baseBudget * m.planRate);
      const actual = Math.round(baseBudget * m.actualRate);
      return {
        month: m.month,
        budget,
        actual,
        pct: budget > 0 ? Math.round((actual / budget) * 100) : 0
      };
    });
  }, [kpis]);

  // Visualization 4: Cost Distribution by Unit (Top 7 Cost Consumers)
  const topCostUnits = useMemo(() => {
    return [...filteredUnitRecords]
      .sort((a, b) => b.actual - a.actual)
      .slice(0, 7);
  }, [filteredUnitRecords]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedYear('2026');
    setSelectedMonth('09');
    setSelectedType('ALL');
    setSelectedUnit('ALL');
    setSelectedStatus('ALL');
    setSearchTable('');
    setCurrentPage(1);
  };

  // Handle Save New Budget Line Item
  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category.trim()) {
      alert('Kategori anggaran wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.saveMonthlyBudget({
        category: form.category,
        budget_plan: Number(form.budget_plan),
        actual_spent: Number(form.actual_spent),
        month_year: form.month_year,
        notes: form.notes
      });

      if (res && res.success) {
        setIsModalOpen(false);
        setForm({
          category: 'Preventive Maintenance (PM Rutin)',
          budget_plan: 50000000,
          actual_spent: 0,
          month_year: '2026-09',
          unit_type: 'ALL',
          notes: ''
        });
        onRefresh();
      } else {
        alert(res?.message || 'Gagal menyimpan anggaran');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Format Helpers
  const formatIDR = (val: number): string => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
  };

  const formatJuta = (val: number): string => {
    const inJuta = val / 1000000;
    if (Math.abs(inJuta) >= 1000) {
      return (inJuta / 1000).toFixed(2) + ' M';
    }
    return inJuta.toFixed(1) + ' Jt';
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. DASHBOARD HEADER & QUICK ACTION BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-xl text-[10px] font-black tracking-widest uppercase">
                MINING FLEET COST CONTROL
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                PERIODE: {selectedMonth === 'ALL' ? 'TAHUN ' + selectedYear : `BULAN ${selectedMonth}/${selectedYear}`}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Maintenance Budget &amp; Realization
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
              Monitoring anggaran, realisasi biaya perawatan, utilisasi budget &amp; cost per unit armada alat berat
              (Dump Truck, Excavator, Bulldozer, Motor Grader, Wheel Loader).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pos Anggaran</span>
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer backdrop-blur-sm"
              title="Sinkronisasi Data"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Sinkronisasi Data</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 2. ENTERPRISE FILTER PANEL */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Filter Parameter Monitoring Biaya
            </h3>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center space-x-1 text-[11px] font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-xs">
          {/* 1. Filter Tahun */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              Tahun Anggaran
            </label>
            <select
              value={selectedYear}
              onChange={e => { setSelectedYear(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="2026">2026 (Tahun Berjalan)</option>
              <option value="2025">2025</option>
              <option value="ALL">Semua Tahun</option>
            </select>
          </div>

          {/* 2. Filter Bulan */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              Bulan Realisasi
            </label>
            <select
              value={selectedMonth}
              onChange={e => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="09">September (Bulan Ini)</option>
              <option value="08">Agustus</option>
              <option value="07">Juli</option>
              <option value="06">Juni</option>
              <option value="05">Mei</option>
              <option value="04">April</option>
              <option value="ALL">Semua Bulan (YTD)</option>
            </select>
          </div>

          {/* 3. Filter Jenis Unit */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              Jenis Alat Berat
            </label>
            <select
              value={selectedType}
              onChange={e => {
                setSelectedType(e.target.value);
                setSelectedUnit('ALL');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="ALL">Semua Jenis Alat</option>
              <option value="DUMP TRUCK">Dump Truck</option>
              <option value="EXCAVATOR">Excavator</option>
              <option value="BULLDOZER">Bulldozer</option>
              <option value="MOTOR GRADER">Motor Grader</option>
              <option value="WHEEL LOADER">Wheel Loader</option>
              <option value="SUPPORT">Support &amp; Utilitas</option>
            </select>
          </div>

          {/* 4. Filter Kode Unit */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              Kode Unit
            </label>
            <select
              value={selectedUnit}
              onChange={e => { setSelectedUnit(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="ALL">Semua Kode Unit ({unitRecords.length})</option>
              {unitRecords
                .filter(u => selectedType === 'ALL' || u.unit_type === selectedType)
                .map(u => (
                  <option key={u.equip_no} value={u.equip_no}>
                    {u.equip_no} — {u.brand} {u.model}
                  </option>
                ))}
            </select>
          </div>

          {/* 5. Filter Status Unit */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">
              Status Operasi Unit
            </label>
            <select
              value={selectedStatus}
              onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="ALL">Semua Status Unit</option>
              <option value="READY">READY / RFU</option>
              <option value="RWN">Ready with Note (RWN)</option>
              <option value="BREAKDOWN">Breakdown (B/D)</option>
              <option value="MAINTENANCE">Maintenance / Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. 5 ENTERPRISE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        {/* KPI 1: Total Maintenance Budget */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Maintenance Budget
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Rp {formatJuta(kpis.totalPlan)}
            </h3>
            <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
              {formatIDR(kpis.totalPlan)}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Alokasi Armada:</span>
            <span className="text-blue-600 font-bold">{kpis.unitCount} Unit Terdaftar</span>
          </div>
        </div>

        {/* KPI 2: Actual Maintenance Cost */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Actual Cost
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-emerald-600 tracking-tight mt-1">
              Rp {formatJuta(kpis.totalActual)}
            </h3>
            <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
              {formatIDR(kpis.totalActual)}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Realisasi Biaya:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              {kpis.utilization}% Dari Rencana
            </span>
          </div>
        </div>

        {/* KPI 3: Remaining Budget */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Remaining Budget
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className={`text-2xl font-black tracking-tight mt-1 ${kpis.remaining >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              Rp {formatJuta(kpis.remaining)}
            </h3>
            <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
              {formatIDR(kpis.remaining)}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-500">Status Saldo:</span>
            <span className={`px-2 py-0.5 rounded-md ${kpis.remaining >= 0 ? 'bg-emerald-100/80 text-emerald-800' : 'bg-red-100/80 text-red-800'}`}>
              {kpis.remaining >= 0 ? 'SURPLUS / ON BUDGET' : 'DEFISIT ANGGARAN'}
            </span>
          </div>
        </div>

        {/* KPI 4: Budget Utilization */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Budget Utilization
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className={`text-2xl font-black tracking-tight ${
                kpis.utilization > 100 ? 'text-red-600' : kpis.utilization > 85 ? 'text-amber-600' : 'text-slate-900'
              }`}>
                {kpis.utilization}%
              </h3>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                kpis.utilization > 100 ? 'bg-red-100 text-red-700' : kpis.utilization > 85 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {kpis.utilization > 100 ? 'OVER' : kpis.utilization > 85 ? 'WASPADA' : 'AMAN'}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  kpis.utilization > 100 ? 'bg-red-500' : kpis.utilization > 85 ? 'bg-amber-500' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(100, kpis.utilization)}%` }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Target Ambang:</span>
            <span className="text-slate-700 font-bold">&le; 90% Anggaran</span>
          </div>
        </div>

        {/* KPI 5: Average Cost per Unit */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-700/60">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Avg Cost per Unit
              </span>
              <div className="w-7 h-7 rounded-lg bg-white/10 text-cyan-400 flex items-center justify-center font-bold">
                <Gauge className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-1">
              Rp {formatJuta(kpis.avgCostPerUnit)}
            </h3>
            <p className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">
              {formatIDR(kpis.avgCostPerUnit)} / Unit
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-300 font-medium">
            <span>Cost per HM:</span>
            <span className="text-cyan-300 font-bold">Rp {kpis.costPerHm.toLocaleString('id-ID')}/HM</span>
          </div>
        </div>
      </div>

      {/* 4. VISUALISASI MONITORING BIAYA (5 VISUALISASI) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VISUAL 1: Maintenance Cost by Equipment Type */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Visual 1 &bull; Equipment Type
              </span>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mt-0.5">
                Maintenance Cost by Equipment Type
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg">
              Budget vs Realisasi
            </span>
          </div>

          <div className="py-4 space-y-4">
            {costByTypeData.map(item => {
              const maxVal = Math.max(...costByTypeData.map(d => Math.max(d.budget, d.actual))) || 1;
              const budgetWidth = (item.budget / maxVal) * 100;
              const actualWidth = (item.actual / maxVal) * 100;

              return (
                <div key={item.type} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      {item.type} ({item.count} unit)
                    </span>
                    <div className="flex items-center space-x-3 text-[11px] font-mono font-bold">
                      <span className="text-slate-500">Plan: {formatJuta(item.budget)}</span>
                      <span className="text-slate-900">Act: {formatJuta(item.actual)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        item.pct > 100 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.pct}%
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar (Budget vs Actual) */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex items-center">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: `${budgetWidth}%` }} title="Budget Plan" />
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex items-center">
                      <div
                        className={`h-full rounded-full ${item.pct > 100 ? 'bg-red-500' : item.pct > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${actualWidth}%` }}
                        title="Actual Cost Realization"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> Maintenance Budget
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Actual Realization
              </span>
            </div>
            <span>Perbandingan per jenis armada tambang</span>
          </div>
        </div>

        {/* VISUAL 2: Planned vs Actual Maintenance Cost (By Category) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Visual 2 &bull; Maintenance Stream
              </span>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mt-0.5">
                Planned vs Actual Maintenance Cost
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg">
              Kategori Perawatan
            </span>
          </div>

          <div className="py-4 space-y-3">
            {costByCategoryData.map(cat => {
              return (
                <div key={cat.category} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{cat.category}</p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500">
                      <span>Rencana: {formatJuta(cat.plan)}</span>
                      <span>&bull;</span>
                      <span className="text-slate-800 font-bold">Realisasi: {formatJuta(cat.actual)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.pct > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(100, cat.pct)}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-mono font-black min-w-[45px] text-right ${
                      cat.pct > 100 ? 'text-red-600' : 'text-slate-700'
                    }`}>
                      {cat.pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>Komponen: PM, CM, Overhaul, Pelumas &amp; Suku Cadang</span>
            <span className="text-blue-600 font-bold">Disiplin Pos Anggaran</span>
          </div>
        </div>
      </div>

      {/* 5. VISUALISASI LANJUTAN: TREND, DISTRIBUSI UNIT & UTILIZATION GAUGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* VISUAL 3: Monthly Maintenance Cost Trend */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Visual 3 &bull; Historis Tren
              </span>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mt-0.5">
                Monthly Maintenance Cost Trend
              </h3>
            </div>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>

          {/* SVG Multi-month Bar Chart Trend */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-full h-44 flex items-end justify-between gap-2 px-2">
              {monthlyTrendData.map((m) => {
                const maxVal = Math.max(...monthlyTrendData.map(d => Math.max(d.budget, d.actual))) || 1;
                const hBudget = Math.round((m.budget / maxVal) * 120);
                const hActual = Math.round((m.actual / maxVal) * 120);

                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] font-mono font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {m.pct}%
                    </span>
                    <div className="flex items-end gap-1 w-full justify-center">
                      <div
                        className="w-3 sm:w-3.5 bg-slate-300 rounded-t-sm"
                        style={{ height: `${hBudget}px` }}
                        title={`Budget: ${formatIDR(m.budget)}`}
                      />
                      <div
                        className={`w-3 sm:w-3.5 rounded-t-sm transition-all ${
                          m.pct > 100 ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ height: `${hActual}px` }}
                        title={`Actual: ${formatIDR(m.actual)}`}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full text-center">
                      {m.month.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span> Budget
              <span className="w-2 h-2 rounded-full bg-blue-600 ml-2"></span> Realisasi
            </span>
            <span>Tren 6 Bulan Terakhir</span>
          </div>
        </div>

        {/* VISUAL 4: Cost Distribution by Unit (Pareto / Top Cost Spenders) */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Visual 4 &bull; Top Consuming Units
              </span>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mt-0.5">
                Cost Distribution by Unit
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg">
              Top 7 Unit
            </span>
          </div>

          <div className="py-3 space-y-2.5 overflow-y-auto max-h-56 pr-1">
            {topCostUnits.map((u, i) => {
              const maxCost = topCostUnits[0]?.actual || 1;
              const barWidth = (u.actual / maxCost) * 100;
              const isBadActor = u.utilization > 100;

              return (
                <div key={u.equip_no} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-slate-400">#{i + 1}</span>
                      {u.equip_no}
                      <span className="text-[10px] font-medium text-slate-400">({u.brand} {u.model})</span>
                    </span>
                    <div className="flex items-center space-x-2 font-mono text-[11px] font-bold">
                      <span className="text-slate-800">{formatJuta(u.actual)}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isBadActor ? 'bg-red-100 text-red-700 font-black' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.utilization}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isBadActor ? 'bg-red-500' : 'bg-blue-600'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <span>Identifikasi unit dengan biaya perbaikan tertinggi</span>
            <span className="text-red-500 font-bold">Prioritas Evaluasi</span>
          </div>
        </div>

        {/* VISUAL 5: Budget Utilization Gauge & Cost Control Health */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Visual 5 &bull; Health Gauge
              </span>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mt-0.5">
                Budget Utilization
              </h3>
            </div>
            <PieChart className="w-4 h-4 text-emerald-600" />
          </div>

          {/* Donut Gauge SVG */}
          <div className="relative h-44 w-full flex flex-col items-center justify-center my-1">
            <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
              {(() => {
                const pct = Math.min(100, Math.max(0, kpis.utilization));
                const c = 2 * Math.PI * 38;
                const strokeDash = (pct / 100) * c;
                return (
                  <>
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke={pct > 100 ? '#ef4444' : pct > 85 ? '#f59e0b' : '#10b981'}
                      strokeWidth="14"
                      strokeDasharray={`${strokeDash} ${c}`}
                      strokeLinecap="round"
                    />
                  </>
                );
              })()}
            </svg>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-black ${
                kpis.utilization > 100 ? 'text-red-600' : kpis.utilization > 85 ? 'text-amber-600' : 'text-slate-800'
              }`}>
                {kpis.utilization}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Serapan Pagu
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <p className="text-slate-400 uppercase text-[9px]">Status Keuangan</p>
              <p className={`font-black mt-0.5 ${kpis.remaining >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {kpis.remaining >= 0 ? 'KENDALI AMAN' : 'OVER BUDGET'}
              </p>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <p className="text-slate-400 uppercase text-[9px]">Sisa Toleransi</p>
              <p className="text-slate-800 font-mono font-black mt-0.5">
                {Math.max(0, 100 - kpis.utilization)}% Pagu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. TABEL UTAMA: MAINTENANCE BUDGET & COST REALIZATION BY UNIT */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm space-y-4 p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-black text-slate-800 tracking-tight">
                Maintenance Budget &amp; Cost Realization by Unit
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Rincian komparasi pagu anggaran perawatan dan realisasi biaya suku cadang/jasa per kode unit alat berat.
            </p>
          </div>

          {/* Search Table input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTable}
              onChange={e => { setSearchTable(e.target.value); setCurrentPage(1); }}
              placeholder="Cari kode unit, tipe, brand, model..."
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 w-full sm:w-72 font-medium transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-3 text-center">No</th>
                <th
                  onClick={() => {
                    if (sortField === 'equip_no') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('equip_no'); setSortOrder('asc'); }
                  }}
                  className="py-3 px-3 cursor-pointer hover:text-blue-600"
                >
                  Unit Code {sortField === 'equip_no' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3">Unit Type</th>
                <th className="py-3 px-3">Brand / Model</th>
                <th
                  onClick={() => {
                    if (sortField === 'hm') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('hm'); setSortOrder('desc'); }
                  }}
                  className="py-3 px-3 cursor-pointer hover:text-blue-600"
                >
                  HM {sortField === 'hm' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'budget') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('budget'); setSortOrder('desc'); }
                  }}
                  className="py-3 px-3 cursor-pointer hover:text-blue-600"
                >
                  Maintenance Budget {sortField === 'budget' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'actual') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('actual'); setSortOrder('desc'); }
                  }}
                  className="py-3 px-3 cursor-pointer hover:text-blue-600"
                >
                  Actual Cost {sortField === 'actual' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3">Remaining Budget</th>
                <th
                  onClick={() => {
                    if (sortField === 'utilization') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('utilization'); setSortOrder('desc'); }
                  }}
                  className="py-3 px-3 cursor-pointer hover:text-blue-600"
                >
                  Utilization % {sortField === 'utilization' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-3 px-3 text-center">Maintenance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    Tidak ada unit alat berat yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((item, idx) => {
                  const rowNumber = (currentPage - 1) * itemsPerPage + idx + 1;
                  const isOver = item.utilization > 100;
                  const isWarning = item.utilization > 85 && !isOver;

                  return (
                    <tr key={item.equip_no} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {rowNumber}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-black text-xs">
                        {onNavigate ? (
                          <button
                            type="button"
                            onClick={() => onNavigate('wo')}
                            title={`Buka riwayat Work Order untuk unit ${item.equip_no}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 font-mono font-black cursor-pointer transition-colors"
                          >
                            <span>{item.equip_no}</span>
                            <ArrowUpRight className="w-3 h-3 text-blue-400" />
                          </button>
                        ) : (
                          <span className="text-slate-900">{item.equip_no}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px] uppercase tracking-wide">
                          {item.unit_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{item.brand}</span>
                          <span className="text-[11px] text-slate-400">{item.model}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                        {item.hm.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400">HM</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                        {formatIDR(item.budget)}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-600">
                        {formatIDR(item.actual)}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-bold ${item.remaining >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                        {item.remaining >= 0 ? '+' : ''}{formatIDR(item.remaining)}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, item.utilization)}%` }}
                            />
                          </div>
                          <span className={`font-mono font-bold text-[11px] ${
                            isOver ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-600'
                          }`}>
                            {item.utilization}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black tracking-wider uppercase inline-flex items-center ${
                          item.status === 'READY' || item.status === 'RFU' || item.status === 'OPERASI'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'RWN'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.status === 'MAINTENANCE'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Summary Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-800">{paginatedRecords.length}</strong> dari{' '}
            <strong className="text-slate-800">{sortedRecords.length}</strong> unit alat berat terdaftar
          </span>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1.5 text-slate-700 font-mono font-bold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* 7. MODAL TAMBAH POS / ALOKASI ANGGARAN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Tambah Alokasi Pos Anggaran</h3>
                  <p className="text-[11px] text-slate-400">Maintenance equipment budget configuration</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Kategori Maintenance *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Preventive Maintenance (PM Rutin)">Preventive Maintenance (PM Rutin)</option>
                  <option value="Corrective Maintenance (CM)">Corrective Maintenance (CM)</option>
                  <option value="Breakdown & Major Overhaul">Breakdown &amp; Major Overhaul</option>
                  <option value="Suku Cadang & Fast Moving">Suku Cadang &amp; Fast Moving</option>
                  <option value="Pelumas, Oli & Grease">Pelumas, Oli &amp; Grease</option>
                  <option value="Undercarriage & GET Wear Parts">Undercarriage &amp; GET Wear Parts</option>
                  <option value="Tyre Dump Truck">Tyre Dump Truck</option>
                  <option value="Special Tools & Workshop Calibration">Special Tools &amp; Workshop Calibration</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Periode Bulan *</label>
                  <input
                    type="month"
                    value={form.month_year}
                    onChange={e => setForm({ ...form, month_year: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Target Jenis Unit</label>
                  <select
                    value={form.unit_type}
                    onChange={e => setForm({ ...form, unit_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ALL">Semua Jenis Unit</option>
                    <option value="DUMP TRUCK">Dump Truck</option>
                    <option value="EXCAVATOR">Excavator</option>
                    <option value="BULLDOZER">Bulldozer</option>
                    <option value="MOTOR GRADER">Motor Grader</option>
                    <option value="WHEEL LOADER">Wheel Loader</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Rencana Anggaran (Plan Rp) *</label>
                  <input
                    type="number"
                    value={form.budget_plan}
                    onChange={e => setForm({ ...form, budget_plan: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Realisasi Awal (Actual Rp)</label>
                  <input
                    type="number"
                    value={form.actual_spent}
                    onChange={e => setForm({ ...form, actual_spent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-600 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Keterangan / Justifikasi Kebutuhan</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Catatan tujuan alokasi pos anggaran maintenance..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Alokasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
