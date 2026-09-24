import React, { useState, useMemo } from 'react';
import {
  Droplets,
  Activity,
  Plus,
  Filter,
  Search,
  Printer,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Wrench,
  Trash2,
  Edit,
  X,
  ChevronDown,
  Info,
  Calendar,
  Gauge,
  TrendingUp,
  FileText
} from 'lucide-react';
import { DailyHM, Equipment, OilSample, WorkOrder } from '../types';
import { api } from '../services/api';

interface ScheduledOilSamplingViewProps {
  equipments: Equipment[];
  oilSamples: OilSample[];
  workOrders: WorkOrder[];
  dailyHms: DailyHM[];
  onRefresh?: () => void;
  onNavigateToWO?: (unit: string, problem: string) => void;
}

export const ScheduledOilSamplingView: React.FC<ScheduledOilSamplingViewProps> = ({
  equipments,
  oilSamples,
  workOrders,
  dailyHms,
  onRefresh,
  onNavigateToWO
}) => {
  // Guaranteed Available Units with EX1210 prioritized
  const availableUnits = useMemo(() => {
    const list: string[] = [];
    const seen = new Set<string>();

    const addUnit = (no?: string) => {
      if (!no) return;
      const clean = no.trim().toUpperCase();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        list.push(no.trim());
      }
    };

    addUnit('EX1210');
    addUnit('DT230');
    addUnit('DZ850');

    oilSamples.forEach(s => addUnit(s.equip_no));
    equipments.forEach(e => addUnit(e.equip_no || e.no_unit));

    return list;
  }, [equipments, oilSamples]);

  const [selectedUnit, setSelectedUnit] = useState<string>('EX1210');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [searchCompartment, setSearchCompartment] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editingSample, setEditingSample] = useState<OilSample | null>(null);

  // Active unit metadata
  const currentEquip = useMemo(() => {
    const eq = equipments.find(e => (e.equip_no || e.no_unit)?.toUpperCase() === selectedUnit.toUpperCase());
    if (eq) {
      return {
        ...eq,
        model: eq.model || 'Heavy Equipment',
        last_hm: Number(eq.last_hm || 0)
      };
    }
    return {
      no_unit: selectedUnit,
      equip_no: selectedUnit,
      model: 'Heavy Equipment',
      lokasi: 'Site Plant',
      status: 'READY',
      last_hm: 0
    };
  }, [equipments, selectedUnit]);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: '',
    sample_code: '',
    equip_no: selectedUnit,
    compartment: 'Engine',
    sample_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
    hm: 0,
    oil_grade: '15W-40',
    rating: 'A',
    top_up: 0,
    repair_notes: '',
    si: 0,
    al: 0,
    na: 0,
    fe: 0,
    cu: 0,
    cr: 0,
    pb: 0,
    pq: 0,
    visc_100: 0,
    oxi: 0,
    soot: 0,
    tbn: 0,
    iso_6: 0,
    iso_14: 0,
    water_pct: 0,
    interpretation: 'All Test Results Appear Acceptable. Take Oil Samples At 250 Hour Intervals To Monitor Condition.',
    lab_vendor: 'Caterpillar SOS Lab'
  });

  // Reliability KPI bersumber dari WO dan Daily HM untuk unit yang sedang dipilih.
  // Istilah baku: BS = Breakdown Scheduled, BUS = Breakdown Unscheduled.
  const monthlyMetrics = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const now = new Date();
    const unitKey = selectedUnit.trim().toUpperCase();
    const numberValue = (value: unknown) => Number.parseFloat(String(value ?? 0)) || 0;
    const unitOf = (record: { equip_no?: string; no_unit?: string }) =>
      String(record.equip_no || record.no_unit || '').trim().toUpperCase();
    const dateOf = (value?: string) => {
      if (!value) return null;
      const parsed = new Date(String(value).split('T')[0] + 'T00:00:00');
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };
    const breakdownType = (value?: string): 'scheduled' | 'unscheduled' | null => {
      const type = String(value || '').trim().toUpperCase().replace(/[\s_-]+/g, ' ');
      if (['UNSCH', 'UNSCHEDULED', 'BREAKDOWN UNSCHEDULED', 'BUS'].includes(type)) return 'unscheduled';
      if (['SCH', 'SCHEDULED', 'BREAKDOWN SCHEDULED', 'BS'].includes(type) || type.startsWith('PM')) return 'scheduled';
      return null;
    };

    return Array.from({ length: 4 }, (_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (3 - index), 1);
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const calendarHours = daysInMonth * 24;

      const monthlyWos = workOrders.filter(wo => {
        const date = dateOf(wo.tgl_rusak || wo.tanggal);
        return unitOf(wo) === unitKey && date?.getFullYear() === year && date.getMonth() === month;
      });
      const monthlyHm = dailyHms.filter(hm => {
        const date = dateOf(hm.tanggal);
        return unitOf(hm) === unitKey && date?.getFullYear() === year && date.getMonth() === month;
      });

      let scheduledHours = 0;
      let unscheduledHours = 0;
      let unscheduledCount = 0;
      monthlyWos.forEach(wo => {
        const type = breakdownType(wo.sch_unsch);
        const hours = numberValue(wo.total_downtime ?? wo.downtime_hours);
        if (type === 'scheduled') scheduledHours += hours;
        if (type === 'unscheduled') {
          unscheduledHours += hours;
          unscheduledCount += 1;
        }
      });

      const operatingHours = monthlyHm.reduce((sum, hm) => {
        const recorded = numberValue(hm.total_hm);
        return sum + (recorded || Math.max(0, numberValue(hm.hm_akhir) - numberValue(hm.hm_awal)));
      }, 0);
      const totalDowntime = scheduledHours + unscheduledHours;
      const pa = Math.max(0, Math.min(100, ((calendarHours - totalDowntime) / calendarHours) * 100));

      return {
        month: monthNames[month],
        pa: Number(pa.toFixed(2)),
        paTarget: 80,
        mtbf: Number((unscheduledCount > 0 ? operatingHours / unscheduledCount : operatingHours).toFixed(2)),
        mtbfTarget: 100,
        bs: Number(scheduledHours.toFixed(2)),
        bus: Number(unscheduledHours.toFixed(2))
      };
    });
  }, [selectedUnit, workOrders, dailyHms]);

  const averagePa = useMemo(
    () => monthlyMetrics.reduce((sum, item) => sum + item.pa, 0) / Math.max(1, monthlyMetrics.length),
    [monthlyMetrics]
  );

  // Filter samples for selected unit
  const unitSamples = useMemo(() => {
    return oilSamples.filter(s => (s.equip_no || '').toUpperCase() === selectedUnit.toUpperCase());
  }, [oilSamples, selectedUnit]);

  // Group samples by Compartment
  const compartmentGroups = useMemo(() => {
    const groups: { [key: string]: OilSample[] } = {};
    
    // Preset default compartments for PC1250 / Mining units
    const standardComps = ['Engine', 'Hydraulic System', 'Final Drive Right', 'Final Drive Left', 'Swing Machinery'];
    standardComps.forEach(c => {
      groups[c] = [];
    });

    unitSamples.forEach(s => {
      const comp = s.compartment || 'Other Compartment';
      if (!groups[comp]) {
        groups[comp] = [];
      }
      groups[comp].push(s);
    });

    // Filter by search and rating
    const filteredEntries = Object.entries(groups).filter(([compName, samples]) => {
      if (searchCompartment && !compName.toLowerCase().includes(searchCompartment.toLowerCase())) {
        return false;
      }
      if (ratingFilter !== 'ALL') {
        const hasRating = samples.some(s => (s.rating || 'A').toUpperCase() === ratingFilter);
        if (!hasRating && samples.length > 0) return false;
      }
      return true;
    });

    return filteredEntries;
  }, [unitSamples, searchCompartment, ratingFilter]);

  // Overall Condition Rating for the unit
  const overallCondition = useMemo(() => {
    if (unitSamples.length === 0) return { rating: 'A', text: 'Good / Normal', color: 'emerald' };
    const hasX = unitSamples.some(s => (s.rating || '').toUpperCase() === 'X' || (s.rating || '').toUpperCase() === 'D');
    if (hasX) return { rating: 'X', text: 'Critical Action Needed', color: 'rose' };
    const hasC = unitSamples.some(s => (s.rating || '').toUpperCase() === 'C');
    if (hasC) return { rating: 'C', text: 'Caution Required', color: 'red' };
    const hasB = unitSamples.some(s => (s.rating || '').toUpperCase() === 'B');
    if (hasB) return { rating: 'B', text: 'Watch Condition', color: 'amber' };
    return { rating: 'A', text: 'All Systems Normal', color: 'emerald' };
  }, [unitSamples]);

  // Modal open helper
  const handleOpenAddModal = (presetComp?: string) => {
    setEditingSample(null);
    setFormData({
      id: '',
      sample_code: `LAB-${Math.floor(10000 + Math.random() * 90000)}`,
      equip_no: selectedUnit,
      compartment: presetComp || 'Engine',
      sample_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-'),
      hm: Number(currentEquip.last_hm) || 0,
      oil_grade: presetComp === 'Hydraulic System' ? 'TELLUS 46' : presetComp?.includes('Final Drive') ? 'SAE 30' : '15W-40',
      rating: 'A',
      top_up: 0,
      repair_notes: '',
      si: 0,
      al: 0,
      na: 0,
      fe: 0,
      cu: 0,
      cr: 0,
      pb: 0,
      pq: 0,
      visc_100: 0,
      oxi: 0,
      soot: 0,
      tbn: 0,
      iso_6: 0,
      iso_14: 0,
      water_pct: 0,
      interpretation: 'Normal inspection.',
      lab_vendor: 'Caterpillar SOS Lab'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sample: OilSample) => {
    setEditingSample(sample);
    setFormData({
      id: String(sample.id || sample.item_id || ''),
      sample_code: sample.sample_code || '',
      equip_no: sample.equip_no || selectedUnit,
      compartment: sample.compartment || 'Engine',
      sample_date: sample.sample_date || '',
      hm: Number(sample.hm) || 0,
      oil_grade: sample.oil_grade || '15W-40',
      rating: sample.rating || 'A',
      top_up: Number(sample.top_up) || 0,
      repair_notes: sample.repair_notes || '',
      si: Number(sample.si) || 0,
      al: Number(sample.al) || 0,
      na: Number(sample.na) || 0,
      fe: Number(sample.fe) || 0,
      cu: Number(sample.cu) || 0,
      cr: Number(sample.cr) || 0,
      pb: Number(sample.pb) || 0,
      pq: Number(sample.pq) || 0,
      visc_100: Number(sample.visc_100) || 0,
      oxi: Number(sample.oxi) || 0,
      soot: Number(sample.soot) || 0,
      tbn: Number(sample.tbn) || 0,
      iso_6: Number(sample.iso_6) || 0,
      iso_14: Number(sample.iso_14) || 0,
      water_pct: Number(sample.water_pct) || 0,
      interpretation: sample.interpretation || '',
      lab_vendor: sample.lab_vendor || 'Caterpillar SOS Lab'
    });
    setIsModalOpen(true);
  };

  const handleDeleteSample = async (id: string | number) => {
    if (window.confirm('Yakin ingin menghapus data sampel laboratorium ini?')) {
      try {
        await api.deleteOilSample(id);
        if (onRefresh) onRefresh();
      } catch (err: any) {
        alert('Gagal menghapus sampel: ' + err.message);
      }
    }
  };

  const handleSaveSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.saveOilSample(formData);
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert('Gagal menyimpan hasil sampling: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateWOFromSample = async (compName: string, interpretation: string, rating: string) => {
    if (!window.confirm(`Terbitkan Work Order perbaikan untuk unit ${selectedUnit} (${compName}) berdasarkan temuan SOS Rating ${rating}?`)) {
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.saveWorkOrder({
        no_wo: `WO-SOS-${selectedUnit.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`,
        equip_no: selectedUnit,
        unit_type: currentEquip.tipe || 'Heavy Equipment',
        hm_km: currentEquip.last_hm || 0,
        tgl_input: new Date().toISOString().split('T')[0],
        tgl_rusak: new Date().toISOString().split('T')[0],
        sch_unsch: 'BREAKDOWN SCHEDULED',
        major_comp: compName,
        kendala: `[SOS Alert Rating ${rating}] ${interpretation || 'Perlu tindakan inspeksi internal / penggantian pelumas & filter.'}`,
        status: 'OPEN',
        reported_by: 'Caterpillar SOS Lab',
      });
      if (res && res.success !== false) {
        alert(`Work Order untuk unit ${selectedUnit} (${compName}) berhasil dibuat dan tersinkronisasi!`);
        if (onRefresh) onRefresh();
        if (onNavigateToWO) onNavigateToWO(selectedUnit, interpretation);
      } else {
        alert('Gagal membuat Work Order: ' + (res?.message || 'Terjadi kesalahan'));
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingBadge = (rating: string) => {
    const r = (rating || 'A').toUpperCase();
    if (r === 'A') {
      return <span className="inline-flex items-center justify-center px-3 py-0.5 rounded text-xs font-black bg-emerald-600 text-white shadow-sm">A</span>;
    }
    if (r === 'B') {
      return <span className="inline-flex items-center justify-center px-3 py-0.5 rounded text-xs font-black bg-amber-400 text-slate-900 shadow-sm">B</span>;
    }
    if (r === 'C') {
      return <span className="inline-flex items-center justify-center px-3 py-0.5 rounded text-xs font-black bg-red-600 text-white shadow-sm">C</span>;
    }
    return <span className="inline-flex items-center justify-center px-3 py-0.5 rounded text-xs font-black bg-rose-950 text-rose-200 border border-rose-600 shadow-sm">X</span>;
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4 print:p-0">
      {/* ================= TOP HEADER BAR ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-inner">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                Asset Monitoring Dashboard
              </h1>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                SOS & PA RELIABILITY
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Scheduled Oil Sampling (SOS), Condition Monitoring, & Reliability Management
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Unit Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-300/80 rounded-xl px-3 py-1.5 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-2">No. Unit:</span>
            <select
              id="unit-selector-select"
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="bg-transparent font-black text-xs text-slate-900 focus:outline-none cursor-pointer pr-2"
            >
              {availableUnits.map(unitNo => {
                const eq = equipments.find(e => (e.equip_no || e.no_unit)?.toUpperCase() === unitNo.toUpperCase());
                const model = eq?.model || (unitNo === 'EX1210' ? 'PC1250-8R' : unitNo === 'DT230' ? 'HD785-7' : unitNo === 'DZ850' ? 'D375A-6' : '');
                return (
                  <option key={unitNo} value={unitNo} className="font-semibold text-slate-800">
                    {unitNo} {model ? `(${model})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Model Display */}
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <span className="font-bold text-slate-400 mr-1.5">Model:</span>
            <span className="font-extrabold text-slate-800">{currentEquip.model || 'PC1250-8R'}</span>
          </div>

          {/* Add Sample Button */}
          <button
            onClick={() => handleOpenAddModal()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Input Hasil Lab</span>
          </button>

          {/* Print / Export Button */}
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl transition-colors border border-slate-300/70"
            title="Cetak Laporan Pemantauan"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">Print Report</span>
          </button>
        </div>
      </div>

      {/* ================= 3 KPI CHARTS SECTION ================= */}
      {/* Matches user screenshot: Physical Availability, MTBF, BS:BUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CHART 1: Physical Availability (PA %) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              Physical Availability
            </h3>
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Avg: {averagePa.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%
            </span>
          </div>

          <div className="relative h-44 w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130">
              {/* Y Axis Grid lines */}
              <line x1="30" y1="15" x2="290" y2="15" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="65" x2="290" y2="65" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="115" x2="290" y2="115" stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Y labels */}
              <text x="5" y="18" fill="#94a3b8" fontSize="9" fontWeight="bold">100</text>
              <text x="10" y="68" fill="#94a3b8" fontSize="9" fontWeight="bold">50</text>
              <text x="16" y="118" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>

              {/* Red Target Benchmark Line (~80% target = y:35) */}
              <line x1="35" y1="35" x2="285" y2="35" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />

              <polyline fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                points={monthlyMetrics.map((item, index) => `${65 + index * 70},${115 - item.pa}`).join(' ')} />
              {monthlyMetrics.map((item, index) => {
                const x = 65 + index * 70;
                const y = 115 - item.pa;
                return <g key={`pa-${item.month}`}>
                  <circle cx={x} cy={y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={x} y={Math.max(9, y - 6)} textAnchor="middle" fill="#1e293b" fontSize="8.5" fontWeight="900">
                    {item.pa.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                  </text>
                  <text x={x} y="128" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">{item.month}</text>
                </g>;
              })}
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-600 inline-block rounded"></span>
              <span>Actual PA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-500 inline-block rounded"></span>
              <span>Target PA (80%)</span>
            </div>
          </div>
        </div>

        {/* CHART 2: MTBF (Hours) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              MTBF (Hours)
            </h3>
            <span className="text-[10px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              Target: 100 Jam
            </span>
          </div>

          <div className="relative h-44 w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130">
              {/* Y Axis Grid lines */}
              <line x1="30" y1="15" x2="290" y2="15" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="48" x2="290" y2="48" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="82" x2="290" y2="82" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="115" x2="290" y2="115" stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Y labels */}
              <text x="5" y="18" fill="#94a3b8" fontSize="9" fontWeight="bold">150</text>
              <text x="5" y="51" fill="#94a3b8" fontSize="9" fontWeight="bold">100</text>
              <text x="10" y="85" fill="#94a3b8" fontSize="9" fontWeight="bold">50</text>
              <text x="16" y="118" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>

              {/* Red Target Benchmark Line (100 Jam = y:48) */}
              <line x1="35" y1="48" x2="285" y2="48" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" />

              <polyline fill="none" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
                points={monthlyMetrics.map((item, index) => `${65 + index * 70},${115 - Math.min(150, item.mtbf) / 1.5}`).join(' ')} />
              {monthlyMetrics.map((item, index) => {
                const x = 65 + index * 70;
                const y = 115 - Math.min(150, item.mtbf) / 1.5;
                return <g key={`mtbf-${item.month}`}>
                  <circle cx={x} cy={y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                  <text x={x} y={Math.max(9, y - 6)} textAnchor="middle" fill="#1e293b" fontSize="8.5" fontWeight="900">
                    {item.mtbf.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                  </text>
                  <text x={x} y="128" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">{item.month}</text>
                </g>;
              })}
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-600 inline-block rounded"></span>
              <span>Actual MTBF</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-500 inline-block rounded"></span>
              <span>Target (100 Jam)</span>
            </div>
          </div>
        </div>

        {/* CHART 3: BS:BUS Breakdown Comparison (Bar Chart) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-600" />
              BS : BUS (Hours)
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-extrabold text-blue-700">
                <span className="w-2.5 h-2.5 bg-[#2563eb] inline-block rounded-sm"></span> BS
              </span>
              <span className="flex items-center gap-1 text-[10px] font-extrabold text-red-600">
                <span className="w-2.5 h-2.5 bg-[#dc2626] inline-block rounded-sm"></span> BUS
              </span>
            </div>
          </div>

          <div className="relative h-44 w-full pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 130">
              {/* Y Axis Grid lines */}
              <line x1="30" y1="15" x2="290" y2="15" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="48" x2="290" y2="48" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="82" x2="290" y2="82" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="115" x2="290" y2="115" stroke="#cbd5e1" strokeWidth="1.2" />

              {/* Y labels */}
              <text x="5" y="18" fill="#94a3b8" fontSize="9" fontWeight="bold">300</text>
              <text x="5" y="51" fill="#94a3b8" fontSize="9" fontWeight="bold">200</text>
              <text x="5" y="85" fill="#94a3b8" fontSize="9" fontWeight="bold">100</text>
              <text x="16" y="118" fill="#94a3b8" fontSize="9" fontWeight="bold">0</text>

              {monthlyMetrics.map((item, index) => {
                const center = 65 + index * 70;
                const bsHeight = Math.min(100, item.bs / 3);
                const busHeight = Math.min(100, item.bus / 3);
                return <g key={`bd-${item.month}`}>
                  {bsHeight > 0 && <rect x={center - 17} y={115 - bsHeight} width="15" height={bsHeight} fill="#2563eb" rx="2" />}
                  {busHeight > 0 && <rect x={center + 2} y={115 - busHeight} width="15" height={busHeight} fill="#dc2626" rx="2" />}
                  <text x={center - 9.5} y={Math.max(10, 109 - bsHeight)} textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="bold">{item.bs.toLocaleString('id-ID')}</text>
                  <text x={center + 9.5} y={Math.max(10, 109 - busHeight)} textAnchor="middle" fill="#1e293b" fontSize="8" fontWeight="bold">{item.bus.toLocaleString('id-ID')}</text>
                  <text x={center} y="128" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600">{item.month}</text>
                </g>;
              })}
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
            <span>BS: Breakdown Scheduled</span>
            <span>•</span>
            <span>BUS: Breakdown Unscheduled</span>
          </div>
        </div>
      </div>

      {/* ================= CONDITION MONITORING SECTION ================= */}
      {/* Exact visual layout as depicted in user's image */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Yellow Header Banner */}
        <div className="bg-[#fff000] px-5 py-2.5 border-b border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900 text-sm tracking-wide uppercase">
              Condition Monitoring
            </span>
            <span className="text-xs font-bold text-slate-800 bg-white/70 px-2.5 py-0.5 rounded-full border border-amber-400/50">
              Unit: {selectedUnit} ({currentEquip.model || 'PC1250-8R'})
            </span>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-800 hidden sm:inline mr-1">Filter Rating:</span>
            {['ALL', 'A', 'B', 'C', 'X'].map(r => (
              <button
                key={r}
                onClick={() => setRatingFilter(r)}
                className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                  ratingFilter === r
                    ? 'bg-slate-900 text-white shadow-sm scale-105'
                    : 'bg-white/80 hover:bg-white text-slate-800 border border-slate-300'
                }`}
              >
                {r === 'ALL' ? 'SEMUA' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-toolbar: Search & Actions */}
        <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kompartemen (Engine, Hydraulic, Final Drive...)"
              value={searchCompartment}
              onChange={e => setSearchCompartment(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Menampilkan <strong>{compartmentGroups.length}</strong> Kompartemen</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Status Keseluruhan:
              <strong className={`text-${overallCondition.color}-600 font-extrabold uppercase`}>
                {overallCondition.text}
              </strong>
            </span>
          </div>
        </div>

        {/* Compartments List View */}
        <div className="divide-y-4 divide-slate-100">
          {compartmentGroups.map(([compName, samples]) => {
            // Find compartment specifications
            const latestSample = samples[0] || null;
            const oilGrade = latestSample?.oil_grade || (compName === 'Hydraulic System' ? 'TELLUS 46' : compName.includes('Final Drive') ? 'SAE 30' : '15W-40');
            const lifetime = latestSample?.hm ? `${latestSample.hm.toLocaleString()} HM` : '47,006 HM';
            const topUp = latestSample?.top_up ? `${latestSample.top_up} L` : '--';
            const repair = latestSample?.repair_notes || '--';
            const lastInterpretation = latestSample?.interpretation || 'All Test Results Appear Acceptable. Take Oil Samples At 250 Hour Intervals To Monitor Condition.';
            
            // Check if this compartment uses Hydraulic / ISO cleanliness physical test columns
            const isHydraulicOrDrive = compName.toLowerCase().includes('hydraulic') || compName.toLowerCase().includes('final drive') || compName.toLowerCase().includes('swing');

            return (
              <div key={compName} className="p-5 hover:bg-slate-50/40 transition-colors space-y-3">
                {/* Compartment Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs border-b border-slate-200 pb-2.5">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {compName}
                    </span>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span className="font-semibold text-slate-400">Lifetime :</span>
                      <strong className="text-slate-800">{lifetime}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-400">Grade :</span>
                      <span className="bg-slate-100 text-slate-800 font-black px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {oilGrade}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span className="font-semibold text-slate-400">TOP UP :</span>
                      <strong className="text-slate-800">{topUp}</strong>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <span className="font-semibold text-slate-400">REPAIR :</span>
                      <strong className="text-slate-800">{repair}</strong>
                    </div>
                  </div>

                  {/* Add sample for this compartment button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenAddModal(compName)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1 rounded transition-colors flex items-center gap-1 border border-blue-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Input Sample</span>
                    </button>
                  </div>
                </div>

                {/* Analysis Table */}
                <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-sm">
                  <table className="w-full text-xs text-center border-collapse">
                    <thead>
                      {/* Top Header Group */}
                      <tr className="bg-[#b4c6e7] text-slate-900 font-black text-[11px] border-b border-slate-300">
                        <th rowSpan={2} className="py-1.5 px-3 border-r border-slate-300 font-extrabold text-left min-w-[90px]">
                          Sample Date
                        </th>
                        <th rowSpan={2} className="py-1.5 px-3 border-r border-slate-300 font-extrabold min-w-[70px]">
                          HM
                        </th>
                        <th rowSpan={2} className="py-1.5 px-2 border-r border-slate-300 font-extrabold min-w-[50px]">
                          Rating
                        </th>
                        <th colSpan={3} className="py-1 border-r border-slate-300 bg-[#d9e1f2] font-black uppercase text-[10px] tracking-wider">
                          Contamination
                        </th>
                        <th colSpan={5} className="py-1 border-r border-slate-300 bg-[#e2efda] font-black uppercase text-[10px] tracking-wider">
                          Wear Metal
                        </th>
                        <th colSpan={4} className="py-1 border-r border-slate-300 bg-[#fce4d6] font-black uppercase text-[10px] tracking-wider">
                          Physical Test
                        </th>
                        <th rowSpan={2} className="py-1.5 px-2 font-extrabold min-w-[60px] print:hidden">
                          Aksi
                        </th>
                      </tr>

                      {/* Sub Header Columns */}
                      <tr className="bg-slate-100 text-[10px] font-bold text-slate-700 border-b border-slate-300">
                        {/* Contamination */}
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#d9e1f2]/60">Si</th>
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#d9e1f2]/60">Al</th>
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#d9e1f2]/60">Na</th>

                        {/* Wear Metal */}
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#e2efda]/60">Fe</th>
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#e2efda]/60">Cu</th>
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#e2efda]/60">Cr</th>
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#e2efda]/60">Pb</th>
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#e2efda]/60">PQ</th>

                        {/* Physical Test columns vary by compartment type */}
                        <th className="py-1 px-2 border-r border-slate-300 bg-[#fce4d6]/60 text-blue-700 underline font-extrabold">
                          Visc@100
                        </th>
                        {isHydraulicOrDrive ? (
                          <>
                            <th className="py-1 px-2 border-r border-slate-300 bg-[#fce4d6]/60">ISO.6</th>
                            <th className="py-1 px-2 border-r border-slate-300 bg-[#fce4d6]/60">ISO.14</th>
                            <th className="py-1 px-2 border-r border-slate-300 bg-[#fce4d6]/60">W</th>
                          </>
                        ) : (
                          <>
                            <th className="py-1 px-2 border-r border-slate-300 bg-[#fce4d6]/60">OXI</th>
                            <th className="py-1 px-2 border-r border-slate-300 bg-[#fce4d6]/60">Soot</th>
                            <th className="py-1 px-2 border-r border-slate-300 bg-[#fce4d6]/60">TBN</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                      {samples.length > 0 ? (
                        samples.map(s => (
                          <tr key={s.id || s.item_id || s.sample_code} className="hover:bg-blue-50/40">
                            <td className="py-1.5 px-3 border-r border-slate-300 text-left font-sans font-bold text-slate-800">
                              {s.sample_date}
                            </td>
                            <td className="py-1.5 px-3 border-r border-slate-300 text-slate-800 font-semibold">
                              {s.hm ? s.hm.toLocaleString() : '--'}
                            </td>
                            <td className="py-1 px-2 border-r border-slate-300 font-sans">
                              {getRatingBadge(s.rating)}
                            </td>

                            {/* Contamination */}
                            <td className={`py-1 px-2 border-r border-slate-300 ${(s.si || 0) > 15 ? 'bg-amber-100 font-bold text-amber-900' : ''}`}>
                              {s.si ?? 0}
                            </td>
                            <td className={`py-1 px-2 border-r border-slate-300 ${(s.al || 0) > 5 ? 'bg-amber-100 font-bold text-amber-900' : ''}`}>
                              {s.al ?? 0}
                            </td>
                            <td className={`py-1 px-2 border-r border-slate-300 ${(s.na || 0) > 10 ? 'bg-amber-100 font-bold text-amber-900' : ''}`}>
                              {s.na ?? 0}
                            </td>

                            {/* Wear Metal */}
                            <td className={`py-1 px-2 border-r border-slate-300 ${(s.fe || 0) > 50 ? 'bg-red-100 font-bold text-red-900' : ''}`}>
                              {s.fe ?? 0}
                            </td>
                            <td className={`py-1 px-2 border-r border-slate-300 ${(s.cu || 0) > 50 ? 'bg-amber-100 font-bold text-amber-900' : ''}`}>
                              {s.cu ?? 0}
                            </td>
                            <td className={`py-1 px-2 border-r border-slate-300 ${(s.cr || 0) > 10 ? 'bg-amber-100 font-bold text-amber-900' : ''}`}>
                              {s.cr ?? 0}
                            </td>
                            <td className={`py-1 px-2 border-r border-slate-300 ${(s.pb || 0) > 20 ? 'bg-red-100 font-bold text-red-900' : ''}`}>
                              {s.pb ?? 0}
                            </td>
                            <td className="py-1 px-2 border-r border-slate-300">
                              {s.pq ?? 0}
                            </td>

                            {/* Physical Test */}
                            <td className="py-1 px-2 border-r border-slate-300 font-bold text-blue-900">
                              {s.visc_100 ?? 0}
                            </td>
                            {isHydraulicOrDrive ? (
                              <>
                                <td className="py-1 px-2 border-r border-slate-300">{s.iso_6 ?? 0}</td>
                                <td className={`py-1 px-2 border-r border-slate-300 ${(s.iso_14 || 0) > 2000 ? 'bg-amber-50 font-bold text-amber-900' : ''}`}>
                                  {s.iso_14 ? Number(s.iso_14).toLocaleString() : 0}
                                </td>
                                <td className="py-1 px-2 border-r border-slate-300">{s.water_pct ?? 0}</td>
                              </>
                            ) : (
                              <>
                                <td className="py-1 px-2 border-r border-slate-300">{s.oxi ?? 0}</td>
                                <td className="py-1 px-2 border-r border-slate-300">{s.soot ?? 0}</td>
                                <td className="py-1 px-2 border-r border-slate-300">{s.tbn ?? 0}</td>
                              </>
                            )}

                            {/* Action Buttons */}
                            <td className="py-1 px-2 print:hidden font-sans">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleOpenEditModal(s)}
                                  className="text-slate-500 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors"
                                  title="Edit Sampel"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSample(s.id || s.item_id || '')}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Hapus Sampel"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={16} className="py-4 text-center text-slate-400 font-sans italic text-xs">
                            Belum ada riwayat sampling laboratorium untuk kompartemen ini. Klik "Input Sample" untuk menambahkan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Last Interpretation Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">
                      Last Interpretation :
                    </p>
                    <p className="text-slate-800 font-medium leading-relaxed">
                      {lastInterpretation}
                    </p>
                  </div>

                  {/* Create WO / Backlog Action for Critical or Attention ratings */}
                  {(latestSample?.rating === 'C' || latestSample?.rating === 'X' || latestSample?.rating === 'B') && (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleCreateWOFromSample(compName, lastInterpretation, latestSample?.rating || 'C')}
                      className="flex-shrink-0 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      title="Terbitkan Work Order otomatis ke database untuk temuan ini"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{submitting ? 'Menerbitkan...' : 'Terbitkan Work Order Tindakan'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL INPUT HASIL LAB ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide">
                    {editingSample ? 'Edit Hasil Sampling Laboratorium' : 'Input Hasil Analisis Sampling Oli (SOS)'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pencatatan parameter keausan metal, kontaminasi, dan interpretasi laboratorium
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveSample} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* No Unit */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">No. Unit</label>
                  <select
                    value={formData.equip_no}
                    onChange={e => setFormData({ ...formData, equip_no: e.target.value })}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {equipments.map(eq => {
                      const no = eq.equip_no || eq.no_unit;
                      return <option key={no} value={no}>{no} ({eq.model || 'Heavy Equipment'})</option>;
                    })}
                  </select>
                </div>

                {/* Kompartemen */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Kompartemen</label>
                  <select
                    value={formData.compartment}
                    onChange={e => {
                      const comp = e.target.value;
                      const grade = comp === 'Hydraulic System' ? 'TELLUS 46' : comp.includes('Final Drive') ? 'SAE 30' : '15W-40';
                      setFormData({ ...formData, compartment: comp, oil_grade: grade });
                    }}
                    className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Engine">Engine</option>
                    <option value="Hydraulic System">Hydraulic System</option>
                    <option value="Final Drive Right">Final Drive Right</option>
                    <option value="Final Drive Left">Final Drive Left</option>
                    <option value="Swing Machinery">Swing Machinery</option>
                    <option value="Swing Drive">Swing Drive</option>
                    <option value="Transmission">Transmission / PTO</option>
                    <option value="Differential">Differential</option>
                    <option value="Tandem">Tandem Left/Right</option>
                  </select>
                </div>

                {/* Sample Code / Barcode */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Barcode / Kode Lab</label>
                  <input
                    type="text"
                    required
                    value={formData.sample_code}
                    onChange={e => setFormData({ ...formData, sample_code: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                {/* Tanggal Sampling */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Tgl Sample (cth: 23-Mar-24)</label>
                  <input
                    type="text"
                    required
                    value={formData.sample_date}
                    onChange={e => setFormData({ ...formData, sample_date: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                  />
                </div>

                {/* HM Alat */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">HM Alat</label>
                  <input
                    type="number"
                    required
                    value={formData.hm}
                    onChange={e => setFormData({ ...formData, hm: Number(e.target.value) })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>

                {/* Grade Pelumas */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Grade Pelumas</label>
                  <input
                    type="text"
                    value={formData.oil_grade}
                    onChange={e => setFormData({ ...formData, oil_grade: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold"
                  />
                </div>

                {/* Rating Lab */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">Rating Hasil</label>
                  <select
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full text-xs font-black bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">A - Good / Normal</option>
                    <option value="B">B - Monitor / Watch</option>
                    <option value="C">C - Attention Required</option>
                    <option value="X">X - Critical / Stop</option>
                  </select>
                </div>
              </div>

              {/* Contamination Section */}
              <div className="bg-[#d9e1f2]/30 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                  1. Kontaminasi (ppm)
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Si (Silicon / Debu)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.si}
                      onChange={e => setFormData({ ...formData, si: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Al (Aluminium)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.al}
                      onChange={e => setFormData({ ...formData, al: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Na (Sodium / Coolant)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.na}
                      onChange={e => setFormData({ ...formData, na: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Wear Metal Section */}
              <div className="bg-[#e2efda]/30 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                  2. Wear Metal (ppm)
                </h4>
                <div className="grid grid-cols-5 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Fe (Besi)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.fe}
                      onChange={e => setFormData({ ...formData, fe: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Cu (Tembaga)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.cu}
                      onChange={e => setFormData({ ...formData, cu: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Cr (Kromium)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.cr}
                      onChange={e => setFormData({ ...formData, cr: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Pb (Timbal)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.pb}
                      onChange={e => setFormData({ ...formData, pb: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">PQ Index</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.pq}
                      onChange={e => setFormData({ ...formData, pq: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Physical Test Section */}
              <div className="bg-[#fce4d6]/30 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
                  3. Physical Test & Cleanliness
                </h4>
                <div className="grid grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Visc@100 (cSt)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.visc_100}
                      onChange={e => setFormData({ ...formData, visc_100: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">ISO.6 (Hyd/FD)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.iso_6}
                      onChange={e => setFormData({ ...formData, iso_6: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">ISO.14 (Hyd/FD)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.iso_14}
                      onChange={e => setFormData({ ...formData, iso_14: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Water (%)</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.water_pct}
                      onChange={e => setFormData({ ...formData, water_pct: Number(e.target.value) })}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-1.5 font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Interpretation / Lab Recommendation */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase">
                  Last Interpretation / Rekomendasi Laboratorium
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.interpretation}
                  onChange={e => setFormData({ ...formData, interpretation: e.target.value })}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Hasil Lab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledOilSamplingView;
