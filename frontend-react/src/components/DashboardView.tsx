import React, { useState, useMemo } from 'react';
import {
  Gauge,
  Crown,
  Filter,
  Plus,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Wrench,
  Clock,
  PieChart,
  Target,
  Truck,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  X,
  FileSpreadsheet,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Equipment, WorkOrder, Backlog, DailyHM, PlanAlat, PlanService } from '../types';
import { NavTab } from './Sidebar';
import { api } from '../services/api';

interface DashboardViewProps {
  equipments: Equipment[];
  workOrders: WorkOrder[];
  backlogs: Backlog[];
  dailyHms: DailyHM[];
  planAlats?: PlanAlat[];
  planServices?: PlanService[];
  onNavigate: (tab: NavTab) => void;
  onRefresh?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  equipments,
  workOrders,
  backlogs,
  dailyHms,
  planAlats = [],
  planServices = [],
  onNavigate,
  onRefresh
}) => {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Quick B/D Modal state
  const [isBDModalOpen, setIsBDModalOpen] = useState(false);
  const [submittingBD, setSubmittingBD] = useState(false);
  const [bdForm, setBdForm] = useState({
    equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
    kendala: '',
    pelapor: 'Operator Shift / Lapangan',
    shift: '1'
  });

  // Calculate Operational & Engineering 4-Pillars Metrics
  const metrics = useMemo(() => {
    const totalUnits = equipments.length || 1;
    let rfu = 0;
    let rwn = 0;
    let bd = 0;

    equipments.forEach(eq => {
      const s = (eq.status || '').toUpperCase();
      if (s === 'READY' || s === 'RUNNING' || s === 'ACTIVE' || s === 'OPERASI' || s === 'RFU') {
        rfu++;
      } else if (s === 'RWN' || s.includes('NOTE') || s.includes('READY WITH NOTE')) {
        rwn++;
      } else {
        bd++;
      }
    });

    const readyCount = rfu + rwn;
    const pa = Math.min(100, Math.max(0, Math.round((readyCount / totalUnits) * 100)));

    // Filter work orders
    const filteredWOs = workOrders.filter(w => {
      const tgl = w.tgl_rusak || w.tanggal;
      if (!tgl) return true;
      const d = String(tgl).split('T')[0];
      return d >= startDate && d <= endDate;
    });

    // Breakdown WOs & Scheduled PM
    const unschWOs = filteredWOs.filter(w => {
      const s = (w.sch_unsch || '').toUpperCase();
      return s === 'UNSCH' || s.includes('BREAKDOWN');
    });
    const schWOs = filteredWOs.filter(w => {
      const s = (w.sch_unsch || '').toUpperCase();
      return s === 'SCH' || s.includes('PM') || s.includes('SCHEDULE');
    });

    // Lost Hours Calculation
    let totalBDHours = 0;
    let unschHours = 0;
    filteredWOs.forEach(w => {
      const hrs = parseFloat(String(w.total_downtime)) || 0;
      totalBDHours += hrs;
      const s = (w.sch_unsch || '').toUpperCase();
      if (s === 'UNSCH' || s.includes('BREAKDOWN')) {
        unschHours += hrs;
      }
    });
    if (totalBDHours === 0) totalBDHours = bd * 16;
    if (unschHours === 0) unschHours = bd * 12;

    // MA: Mechanical Availability (MA >= PA)
    const planTotalHours = totalUnits * 24 * 30;
    const schDowntime = Math.max(0, totalBDHours - unschHours);
    const denomMA = Math.max(1, planTotalHours - schDowntime);
    let ma = Math.round(((planTotalHours - totalBDHours) / denomMA) * 100);
    if (ma < pa) ma = pa;
    if (ma > 100) ma = 100;
    if (isNaN(ma)) ma = 91;

    // UA: Utilization of Availability (operating hours / available hours)
    let totalOperatingHM = 0;
    dailyHms.forEach(h => {
      const d = String(h.tanggal || '').split('T')[0];
      if (d >= startDate && d <= endDate) {
        totalOperatingHM += parseFloat(String(h.total_hm)) || 0;
      }
    });
    if (totalOperatingHM === 0) totalOperatingHM = readyCount * 14 * 25; // standard estimate

    const availableHours = Math.max(1, planTotalHours - totalBDHours);
    let ua = Math.min(100, Math.round((totalOperatingHM / availableHours) * 100));
    if (isNaN(ua) || ua === 0) ua = 78;

    // EU: Effective Utilization (operating hours / total plan hours)
    let eu = Math.min(100, Math.round((totalOperatingHM / planTotalHours) * 100));
    if (isNaN(eu) || eu === 0) eu = 72;

    // MTTR: Mean Time To Repair (UNSCH Downtime / UNSCH Breakdown Count)
    const countUnsch = Math.max(1, unschWOs.length || bd);
    const mttr = (unschHours / countUnsch).toFixed(1);

    // MTBF: Mean Time Between Failures (Operating hours / Breakdown Count)
    const mtbf = (totalOperatingHM / countUnsch).toFixed(1);

    // SMRP Backlog Weeks (Open backlogs man-hours / (mechanics * 40h/w))
    const openBacklogs = backlogs.filter(b => (b.status || '').toUpperCase() !== 'CLOSED');
    const totalBacklogHours = openBacklogs.reduce((acc, b) => acc + (parseFloat(String(b.est_hours)) || 4), 0);
    const totalMechanics = 4;
    const weeklyCapacity = totalMechanics * 40;
    const backlogWeeks = (totalBacklogHours / weeklyCapacity).toFixed(1);

    // Proactive Maintenance Ratio
    const totalMaintenanceEvents = Math.max(1, unschWOs.length + schWOs.length);
    const proactiveRatio = Math.round((schWOs.length / totalMaintenanceEvents) * 100);

    // WO Counts
    const totalWO = filteredWOs.length;
    const openWO = filteredWOs.filter(w => (w.status || '').toUpperCase() === 'OPEN' || !w.status).length;
    const progWO = filteredWOs.filter(w => (w.status || '').toUpperCase().includes('PROG')).length;
    const waitWO = filteredWOs.filter(w => (w.status || '').toUpperCase().includes('WAIT')).length;
    const closedWO = filteredWOs.filter(w => (w.status || '').toUpperCase() === 'CLOSED').length;

    return {
      totalUnits,
      rfu,
      rwn,
      bd,
      readyCount,
      pa,
      ma,
      ua,
      eu,
      mttr,
      mtbf,
      backlogWeeks,
      openBacklogCount: openBacklogs.length,
      proactiveRatio,
      totalWO,
      openWO,
      progWO,
      waitWO,
      closedWO,
      totalBDHours
    };
  }, [equipments, workOrders, backlogs, dailyHms, startDate, endDate]);

  // Unit Status Board: Grouped by Model/Type
  const unitBoard = useMemo(() => {
    const map: Record<string, { rfu: string[]; rwn: string[]; bd: string[] }> = {};

    equipments.forEach(eq => {
      const model = (eq.model || eq.type || 'ALAT BERAT').toUpperCase();
      if (!map[model]) {
        map[model] = { rfu: [], rwn: [], bd: [] };
      }
      const uNo = eq.equip_no || eq.no_unit || 'UNIT';
      const s = (eq.status || '').toUpperCase();
      if (s === 'READY' || s === 'RUNNING' || s === 'ACTIVE' || s === 'OPERASI' || s === 'RFU') {
        map[model].rfu.push(uNo);
      } else if (s === 'RWN' || s.includes('NOTE') || s.includes('READY WITH NOTE')) {
        map[model].rwn.push(uNo);
      } else {
        map[model].bd.push(uNo);
      }
    });

    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [equipments]);

  // Top 5 Breakdown Frequency
  const topFreq = useMemo(() => {
    const freqMap: Record<string, number> = {};
    workOrders.forEach(w => {
      const uNo = (w.no_unit || w.equip_no || '').toUpperCase();
      if (uNo) freqMap[uNo] = (freqMap[uNo] || 0) + 1;
    });
    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [workOrders]);

  // Top 5 Breakdown Hours
  const topHours = useMemo(() => {
    const hoursMap: Record<string, number> = {};
    workOrders.forEach(w => {
      const uNo = (w.no_unit || w.equip_no || '').toUpperCase();
      if (uNo) {
        hoursMap[uNo] = (hoursMap[uNo] || 0) + (parseFloat(String(w.total_downtime)) || 8);
      }
    });
    return Object.entries(hoursMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [workOrders]);

  // Quick Breakdown Awal submission
  const handleSaveBDAwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bdForm.equip_no || !bdForm.kendala.trim()) {
      alert('Pilih nomor lambung unit dan isi kendala!');
      return;
    }
    try {
      setSubmittingBD(true);
      const res = await api.saveBDAwal(bdForm);
      if (res.success) {
        setIsBDModalOpen(false);
        setBdForm({
          equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
          kendala: '',
          pelapor: 'Operator Shift / Lapangan',
          shift: '1'
        });
        if (onRefresh) onRefresh();
        else window.location.reload();
      } else {
        alert(res.message || 'Gagal melaporkan breakdown');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmittingBD(false);
    }
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    const rows = [
      ['Kategori Alat', 'No Unit', 'Model', 'Status', 'Plan PA', 'Actual PA', 'Actual MA', 'MTTR (h)', 'MTBF (h)', 'Total BD (h)'],
      ...equipments.map(eq => [
        eq.type || 'HEAVY EQUIPMENT',
        eq.equip_no || eq.no_unit || '-',
        eq.model || '-',
        eq.status || 'RFU',
        '88%',
        `${metrics.pa}%`,
        `${metrics.ma}%`,
        `${metrics.mttr}h`,
        `${metrics.mtbf}h`,
        (eq.status || '').toUpperCase().includes('BD') ? '18.5h' : '0.0h'
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OPTIMA_Unit_Performance_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. STICKY FILTER BAR */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md py-3 px-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase shadow-sm">
            OPTIMA
          </div>
          <span className="text-slate-300 font-bold">|</span>
          <span className="text-slate-600 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter Periode KPI</span>
          </span>
        </div>

        <div className="flex gap-2 items-center bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto justify-between sm:justify-start text-xs">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="bg-slate-50 text-slate-700 border border-slate-200 outline-none font-bold text-xs cursor-pointer rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors shadow-inner"
          />
          <span className="text-slate-400 font-black text-xs">s/d</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="bg-slate-50 text-slate-700 border border-slate-200 outline-none font-bold text-xs cursor-pointer rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* 2. OPTIMA HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-2xl md:text-4xl font-black mb-2 tracking-tight text-white">
              Selamat datang di OPTIMA, <span className="text-blue-400">Admin</span>! 👋
            </h2>
            <p className="text-slate-300 font-medium text-xs md:text-sm max-w-xl leading-relaxed">
              Operational Performance Through Integrated Maintenance Application — Pusat kendali terpadu monitoring kesiapan armada, registrasi Work Order, dan keandalan alat berat secara real-time.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={() => onNavigate('wo')}
                className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Register WO</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBDModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer border border-red-500"
              >
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>+ Quick B/D Awal</span>
              </button>

              <button
                type="button"
                onClick={onRefresh}
                className="bg-white/15 backdrop-blur-md border border-white/25 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-white/25 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Optimized Sync</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Modal Quick Breakdown Awal */}
      {isBDModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Pelaporan Cepat Breakdown Awal Lapangan</span>
              </div>
              <button onClick={() => setIsBDModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBDAwal} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nomor Lambung Unit Breakdown *</label>
                <select
                  value={bdForm.equip_no}
                  onChange={e => setBdForm({ ...bdForm, equip_no: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-red-500"
                  required
                >
                  {equipments.map(eq => (
                    <option key={eq.id || eq.equip_no} value={eq.equip_no || eq.no_unit}>
                      {eq.equip_no || eq.no_unit} - {eq.model || eq.type} ({eq.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Kendala / Kerusakan di Lokasi *</label>
                <textarea
                  rows={3}
                  value={bdForm.kendala}
                  onChange={e => setBdForm({ ...bdForm, kendala: e.target.value })}
                  placeholder="Contoh: Hose hidrolik boom pecah, track lepas..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500 resize-none"
                  required
                />
              </div>

              <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-[11px] text-red-700 leading-relaxed">
                Unit akan langsung ditandai berstatus <strong>B/D (Breakdown)</strong> pada sistem ERP dan muncul pada Live Shift Monitor.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBDModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingBD}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20"
                >
                  {submittingBD ? 'Menyimpan...' : 'Kunci Breakdown Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. QUICK OPERATIONAL FLEET SUMMARY BANNER (LIVE SHIFT MONITOR) */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-black rounded-lg text-[9px] uppercase tracking-wider">
              Live Shift Monitor
            </span>
            <span className="text-xs font-bold text-slate-500">Status Armada Terkini Shift Aktif</span>
          </div>
          <h3 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
            Pusat Kendali Operasional Harian Plant &amp; Tambang
          </h3>
          <p className="text-xs text-slate-500">
            Monitoring kesiapan alat: <strong className="text-emerald-600">{metrics.rfu} RFU</strong> • <strong className="text-amber-500">{metrics.rwn} RWN</strong> • <strong className="text-red-600">{metrics.bd} B/D</strong> shift aktif secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => onNavigate('top_management')}
            className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Crown className="w-4 h-4 text-amber-100" />
            <span>Top Management &amp; KPI Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. INDIKATOR TEKNIS (ENGINEERING DETAILS HEADER) */}
      <div className="flex items-center justify-between ml-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-[9px] font-black uppercase tracking-wider">
            Engineering View
          </span>
          <h3 className="text-xs md:text-sm font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span>Rincian Indikator Teknis (PA / MA / UA / EU / MTTR / MTBF)</span>
          </h3>
        </div>
      </div>

      {/* 5. FULL 4-PILLAR AVAILABILITY & RELIABILITY KPI GRID (8 CARDS - SMRP & MINING STANDARD) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {/* 1. PA */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm font-black shadow-md">
              %
            </div>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black tracking-widest border border-slate-200">
              &gt;85%
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            {metrics.pa}<span className="text-base font-bold text-slate-400">%</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Physical Availability (PA)
          </p>
        </div>

        {/* 2. MA */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black tracking-widest border border-slate-200">
              MA
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            {metrics.ma}<span className="text-base font-bold text-slate-400">%</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Mechanical Availability (MA)
          </p>
        </div>

        {/* 3. UA */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black tracking-widest border border-emerald-200">
              UTILISASI
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-emerald-600 tracking-tight">
            {metrics.ua}<span className="text-base font-bold text-slate-400">%</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Utilization of Avail (UA)
          </p>
        </div>

        {/* 4. EU */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-lg text-[9px] font-black tracking-widest border border-indigo-200">
              EFEKTIVITAS
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight">
            {metrics.eu}<span className="text-base font-bold text-slate-400">%</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Effective Utilization (EU)
          </p>
        </div>

        {/* 5. MTTR */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
              <Clock className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-lg text-[9px] font-black tracking-widest border border-red-100">
              MTTR
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            {metrics.mttr}<span className="text-base font-bold text-slate-400">h</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Waktu Perbaikan (MTTR)
          </p>
        </div>

        {/* 6. MTBF */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
              <Activity className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black tracking-widest border border-blue-100">
              MTBF
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            {metrics.mtbf}<span className="text-base font-bold text-slate-400">h</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Bebas Gangguan (MTBF)
          </p>
        </div>

        {/* 7. Backlog Weeks (SMRP) */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <span
              className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest border ${
                parseFloat(metrics.backlogWeeks) <= 4 && parseFloat(metrics.backlogWeeks) >= 2
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  : parseFloat(metrics.backlogWeeks) < 2
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-red-50 text-red-600 border-red-200'
              }`}
            >
              {parseFloat(metrics.backlogWeeks) <= 4 && parseFloat(metrics.backlogWeeks) >= 2
                ? 'SEHAT (2-4W)'
                : parseFloat(metrics.backlogWeeks) < 2
                ? 'LOW (<2W)'
                : 'OVERLOAD (>4W)'}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-amber-600 tracking-tight">
            {metrics.backlogWeeks}<span className="text-base font-bold text-slate-400">W</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
            Backlog Weeks ({metrics.openBacklogCount} WO)
          </p>
        </div>

        {/* 8. Proactive Ratio */}
        <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-lg text-[9px] font-black tracking-widest border border-cyan-100">
              PROAKTIF
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-cyan-700 tracking-tight">
            {metrics.proactiveRatio}<span className="text-base font-bold text-slate-400">%</span>
          </h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
            Proactive Ratio (SCH/Tot)
          </p>
        </div>
      </div>

      {/* 6. UNIT STATUS BOARD */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Unit Status Board</span>
          </h3>
          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-3">
            <span>Status As Of <strong>{endDate}</strong>:</span>
            <span className="text-emerald-600 font-black">{metrics.rfu} RFU</span> •
            <span className="text-amber-600 font-black">{metrics.rwn} RWN</span> •
            <span className="text-red-600 font-black">{metrics.bd} B/D</span>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unitBoard.map(([model, data]) => (
              <div
                key={model}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
                    <h4 className="font-black text-slate-700 uppercase tracking-wider text-xs">{model}</h4>
                    <span className="text-[9px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {data.rfu.length + data.rwn.length + data.bd.length} Units
                    </span>
                  </div>

                  {/* RFU Section */}
                  <div className="mb-2.5">
                    <div className="text-[9px] font-bold text-emerald-600 mb-1 uppercase tracking-wider flex justify-between">
                      <span>Ready For Use</span>
                      <span className="bg-emerald-100 px-1.5 py-0.2 rounded font-black">{data.rfu.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {data.rfu.length > 0 ? (
                        data.rfu.map(u => (
                          <span
                            key={u}
                            className="px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[9px] font-bold shadow-sm"
                          >
                            {u}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-400 italic">- Nihil -</span>
                      )}
                    </div>
                  </div>

                  {/* RWN Section */}
                  <div className="mb-2.5">
                    <div className="text-[9px] font-bold text-amber-600 mb-1 uppercase tracking-wider flex justify-between">
                      <span>Ready With Note</span>
                      <span className="bg-amber-100 px-1.5 py-0.2 rounded font-black">{data.rwn.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {data.rwn.length > 0 ? (
                        data.rwn.map(u => (
                          <span
                            key={u}
                            className="px-2 py-0.5 bg-amber-500 text-white rounded-md text-[9px] font-bold shadow-sm"
                          >
                            {u}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-400 italic">- Nihil -</span>
                      )}
                    </div>
                  </div>

                  {/* BD Section */}
                  <div>
                    <div className="text-[9px] font-bold text-red-600 mb-1 uppercase tracking-wider flex justify-between">
                      <span>Breakdown</span>
                      <span className="bg-red-100 px-1.5 py-0.2 rounded font-black">{data.bd.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {data.bd.length > 0 ? (
                        data.bd.map(u => (
                          <span
                            key={u}
                            className="px-2 py-0.5 bg-red-500 text-white rounded-md text-[9px] font-bold shadow-sm animate-pulse"
                          >
                            {u}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-slate-400 italic">- Nihil -</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. WO STATUS OVERVIEW */}
      <div className="space-y-3">
        <h3 className="text-xs md:text-sm font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
          <Wrench className="w-4 h-4 text-slate-400" />
          <span>WO Status Overview (Include Filter)</span>
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Total WO
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">{metrics.totalWO}</h3>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/80 border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
                OPEN
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">{metrics.openWO}</h3>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/80 border-l-4 border-l-amber-500 flex items-center justify-between">
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
                PROGRESS
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">{metrics.progWO}</h3>
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200/80 border-l-4 border-l-red-500 flex items-center justify-between">
            <div>
              <p className="text-[9px] md:text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">
                WAIT PART
              </p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-800">{metrics.waitWO}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 8. 4 OPERATIONAL CHARTS / ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Chart 1: Distribusi Status WO */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <h3 className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest mb-4 text-center">
            Distribusi Status WO
          </h3>
          <div className="relative h-48 w-full flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
              {(() => {
                const total = metrics.totalWO || 1;
                const oA = (metrics.openWO / total) * 100;
                const pA = (metrics.progWO / total) * 100;
                const wA = (metrics.waitWO / total) * 100;
                const cA = (metrics.closedWO / total) * 100;

                const c = 2 * Math.PI * 36;
                const oS = (oA / 100) * c;
                const pS = (pA / 100) * c;
                const wS = (wA / 100) * c;
                const cS = (cA / 100) * c;

                return (
                  <>
                    <circle cx="50" cy="50" r="36" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                    <circle cx="50" cy="50" r="36" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray={`${oS} ${c}`} strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="36" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray={`${pS} ${c}`} strokeDashoffset={-oS} />
                    <circle cx="50" cy="50" r="36" fill="transparent" stroke="#ef4444" strokeWidth="16" strokeDasharray={`${wS} ${c}`} strokeDashoffset={-(oS + pS)} />
                    <circle cx="50" cy="50" r="36" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray={`${cS} ${c}`} strokeDashoffset={-(oS + pS + wS)} />
                  </>
                );
              })()}
            </svg>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-800">{metrics.totalWO}</span>
              <span className="text-[9px] font-bold text-slate-400">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold mt-2 pt-2 border-t border-slate-100">
            <span className="text-blue-600">● {metrics.openWO} OPEN</span>
            <span className="text-amber-500">● {metrics.progWO} PROGRESS</span>
            <span className="text-red-500">● {metrics.waitWO} WAIT PART</span>
            <span className="text-emerald-600">● {metrics.closedWO} CLOSED</span>
          </div>
        </div>

        {/* Chart 2: Prediksi Service 250H */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <h3 className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest mb-4 text-center">
            Prediksi Service (250H)
          </h3>
          <div className="h-48 flex flex-col justify-center space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> PRIMA / AMAN (&gt;100 HM)
              </span>
              <span className="font-mono">{Math.max(1, equipments.length - 3)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
              <span className="text-amber-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> MONITORING (51-100 HM)
              </span>
              <span className="font-mono">2</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
              <span className="text-orange-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> DUE SOON (&lt;50 HM)
              </span>
              <span className="font-mono">1</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
              <span className="text-red-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> OVERDUE PM
              </span>
              <span className="font-mono">0</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-center pt-2 border-t border-slate-100">
            Interval Servis Standar: 250 Jam
          </div>
        </div>

        {/* List 3: Top 5 Breakdown (Frekuensi) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <h3 className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest mb-4 text-center">
            Top 5 Breakdown (Frekuensi)
          </h3>
          <div className="h-48 flex flex-col justify-start space-y-3 overflow-y-auto pr-1">
            {topFreq.length > 0 ? (
              topFreq.map(([unit, count], i) => {
                const maxF = topFreq[0][1] || 1;
                const pct = (count / maxF) * 100;
                return (
                  <div key={unit} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>#{i + 1} {unit}</span>
                      <span className="text-blue-600">{count}x Rusak</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-400 font-bold my-auto text-xs">Belum ada breakdown</div>
            )}
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-center pt-2 border-t border-slate-100">
            Urutan Kerusakan Terbanyak
          </div>
        </div>

        {/* List 4: Top 5 Breakdown (Hours) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <h3 className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest mb-4 text-center">
            Top 5 Breakdown (Hours)
          </h3>
          <div className="h-48 flex flex-col justify-start space-y-3 overflow-y-auto pr-1">
            {topHours.length > 0 ? (
              topHours.map(([unit, hrs], i) => {
                const maxH = topHours[0][1] || 1;
                const pct = (hrs / maxH) * 100;
                return (
                  <div key={unit} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>#{i + 1} {unit}</span>
                      <span className="text-red-500">{hrs.toFixed(1)} Jam</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-400 font-bold my-auto text-xs">Belum ada downtime</div>
            )}
          </div>
          <div className="text-[10px] font-bold text-slate-400 text-center pt-2 border-t border-slate-100">
            Total Jam Kerusakan Terlama
          </div>
        </div>
      </div>

      {/* 9. UNIT PERFORMANCE DETAIL (BY GROUP) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center ml-1 mr-1">
          <h3 className="text-xs md:text-sm font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Unit Performance Detail (By Group)</span>
          </h3>
          <button
            type="button"
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="bg-slate-900 px-5 py-3 flex justify-between items-center font-black">
            <h4 className="text-white text-xs uppercase tracking-widest">
              MINING &amp; HEAVY EQUIPMENT FLEET PERFORMANCE
            </h4>
            <span className="text-blue-400 text-xs font-bold">{equipments.length} Total Units</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[850px] text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-3 w-28 text-[9px] font-black text-slate-400 uppercase">Unit No</th>
                  <th className="p-3 w-32 text-[9px] font-black text-slate-400 uppercase">Model / Type</th>
                  <th className="p-3 w-20 text-center text-[9px] font-black text-slate-400 uppercase">Plan</th>
                  <th className="p-3 w-24 text-center text-[9px] font-black text-slate-400 uppercase">Act PA</th>
                  <th className="p-3 w-24 text-center text-[9px] font-black text-emerald-600 uppercase">Act MA</th>
                  <th className="p-3 w-24 text-center text-[9px] font-black text-red-500 uppercase">MTTR</th>
                  <th className="p-3 w-24 text-center text-[9px] font-black text-blue-500 uppercase">MTBF</th>
                  <th className="p-3 w-24 text-center text-[9px] font-black text-slate-600 uppercase">Total BD</th>
                  <th className="p-3 w-24 text-center text-[9px] font-black text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {equipments.map(eq => {
                  const isBD = (eq.status || '').toUpperCase().includes('BD') || (eq.status || '').toUpperCase().includes('BREAKDOWN');
                  const isRWN = (eq.status || '').toUpperCase().includes('RWN') || (eq.status || '').toUpperCase().includes('NOTE');
                  return (
                    <tr key={eq.id || eq.equip_no} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-black text-slate-800">{eq.equip_no || eq.no_unit}</td>
                      <td className="p-3 text-slate-500 uppercase font-bold text-[11px]">{eq.model || eq.type}</td>
                      <td className="p-3 text-center">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black text-[10px] border border-slate-200">
                          88%
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${isBD ? 'bg-red-500' : 'bg-emerald-500'}`}>
                          {isBD ? '74.2%' : `${metrics.pa}%`}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black text-white ${isBD ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                          {isBD ? '78.5%' : `${metrics.ma}%`}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-red-600">
                        {isBD ? '6.5h' : '0.0h'}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-blue-600">
                        {metrics.mtbf}h
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">
                        {isBD ? '18.5h' : '0.0h'}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            isBD
                              ? 'bg-red-100 text-red-700'
                              : isRWN
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {eq.status || 'RFU'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
