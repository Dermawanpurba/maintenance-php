import React, { useState, useMemo } from 'react';
import {
  Crown,
  Printer,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ClipboardCheck,
  Edit3,
  PieChart,
  Truck,
  Wrench,
  X,
  Clock,
  ArrowRight,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Equipment, WorkOrder, Backlog, DailyHM, MeetingNote } from '../types';
import { NavTab } from './Sidebar';
import { printExecutiveReport } from '../utils/printUtils';
import { api } from '../services/api';

interface TopManagementViewProps {
  equipments: Equipment[];
  workOrders: WorkOrder[];
  backlogs: Backlog[];
  dailyHms: DailyHM[];
  meetingNotes?: MeetingNote[];
  onNavigate: (tab: NavTab) => void;
  onRefresh?: () => void;
}

export const TopManagementView: React.FC<TopManagementViewProps> = ({
  equipments,
  workOrders,
  backlogs,
  dailyHms,
  meetingNotes = [],
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
    pelapor: 'Direksi / Top Management',
    shift: '1'
  });

  // Calculate Operational Metrics
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
    const pa = Math.round((readyCount / totalUnits) * 100);

    // Filter work orders within period
    const filteredWOs = workOrders.filter(w => {
      const tgl = w.tgl_rusak || w.tanggal;
      if (!tgl) return true;
      const d = String(tgl).split('T')[0];
      return d >= startDate && d <= endDate;
    });

    // Breakdown count & downtime lost hours
    const bdWOs = filteredWOs.filter(w => {
      const s = (w.status || '').toUpperCase();
      return s !== 'CLOSED' && s !== 'COMPLETED';
    });

    const waitingPartWOs = filteredWOs.filter(w => {
      const s = (w.status || '').toUpperCase();
      return s.includes('WAIT') || s.includes('PART');
    });

    // Estimate total downtime
    let totalDowntimeHours = 0;
    filteredWOs.forEach(w => {
      if (w.total_downtime) {
        totalDowntimeHours += parseFloat(String(w.total_downtime)) || 0;
      }
    });

    const mttr = bdWOs.length > 0 && totalDowntimeHours > 0
      ? (totalDowntimeHours / bdWOs.length).toFixed(1)
      : '0.0';

    return {
      totalUnits,
      rfu,
      rwn,
      bd,
      readyCount,
      pa,
      totalDowntimeHours,
      breakdownCases: bdWOs.length,
      mttr,
      waitingPartsCount: waitingPartWOs.length,
      openBacklogsCount: backlogs.filter(b => (b.status || '').toUpperCase() !== 'CLOSED').length
    };
  }, [equipments, workOrders, backlogs, startDate, endDate]);

  // Critical Attention Units (BD / Waiting Part)
  const criticalUnits = useMemo(() => {
    return equipments
      .filter(eq => {
        const s = (eq.status || '').toUpperCase();
        return s === 'BREAKDOWN' || s === 'REPAIR' || s === 'MAINTENANCE' || s === 'BD' || s.includes('WAIT');
      })
      .map(eq => {
        const matchingWO = workOrders.find(w => {
          const eNo = (w.no_unit || w.equip_no || '').toUpperCase();
          const qNo = (eq.equip_no || eq.no_unit || '').toUpperCase();
          return eNo === qNo && (w.status || '').toUpperCase() !== 'CLOSED';
        });
        return {
          equip_no: eq.equip_no || eq.no_unit || 'UNKNOWN',
          model: eq.model || eq.type || 'HEAVY EQUIPMENT',
          kendala: matchingWO?.deskripsi || eq.keterangan || 'Menunggu tindakan korektif breakdown',
          downtime: matchingWO?.total_downtime ? `${matchingWO.total_downtime}h` : '-',
          status: matchingWO?.status || eq.status || 'B/D'
        };
      });
  }, [equipments, workOrders]);

  // Model breakdown for PA Bar Chart
  const modelStats = useMemo(() => {
    const map: Record<string, { total: number; ready: number }> = {};
    equipments.forEach(eq => {
      const m = (eq.model || eq.type || 'LAINNYA').toUpperCase();
      if (!map[m]) map[m] = { total: 0, ready: 0 };
      map[m].total++;
      const s = (eq.status || '').toUpperCase();
      if (s === 'READY' || s === 'RUNNING' || s === 'ACTIVE' || s === 'OPERASI' || s === 'RFU' || s === 'RWN') {
        map[m].ready++;
      }
    });

    return Object.entries(map).slice(0, 5).map(([name, val]) => ({
      name,
      pa: Math.round((val.ready / val.total) * 100),
      total: val.total
    }));
  }, [equipments]);

  // Major component breakdown for Chart 3
  const majorComponents = useMemo(() => {
    const compMap: Record<string, number> = {};
    const filteredWOs = workOrders.filter(w => {
      const tgl = w.tgl_rusak || w.tanggal;
      if (!tgl) return true;
      const d = String(tgl).split('T')[0];
      return d >= startDate && d <= endDate;
    });

    filteredWOs.forEach(w => {
      if (w.major_comp) {
        const mc = String(w.major_comp).trim().toUpperCase();
        if (mc) {
          const dt = parseFloat(String(w.total_downtime || 0)) || 0;
          compMap[mc] = (compMap[mc] || 0) + dt;
        }
      }
    });
    return Object.entries(compMap)
      .filter(([_, hrs]) => hrs > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [workOrders, startDate, endDate]);

  // Latest Meeting Note
  const latestMeeting = useMemo(() => {
    if (meetingNotes && meetingNotes.length > 0) {
      return meetingNotes[meetingNotes.length - 1];
    }
    return null;
  }, [meetingNotes]);

  // Print Executive Handler
  const handlePrint = () => {
    printExecutiveReport(
      {
        pa: metrics.pa,
        rfu: metrics.rfu,
        rwn: metrics.rwn,
        bd: metrics.bd,
        totalHours: metrics.totalUnits * 24 * 30,
        downtimeHours: metrics.totalDowntimeHours
      },
      equipments,
      workOrders,
      { start: startDate, end: endDate }
    );
  };

  // Quick Breakdown Awal submission
  const handleSaveBDAwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bdForm.equip_no || !bdForm.kendala.trim()) {
      alert('Pilih nomor lambung unit dan isi deskripsi kendala kerusakan!');
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
          pelapor: 'Direksi / Top Management',
          shift: '1'
        });
        if (onRefresh) onRefresh();
        else window.location.reload();
      } else {
        alert(res.message || 'Gagal melaporkan breakdown awal');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmittingBD(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP MANAGEMENT STICKY FILTER BAR */}
      <div className="bg-slate-900 text-white p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shadow-inner flex-shrink-0">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs md:text-sm font-black uppercase tracking-wider text-white">
              Executive Plant Management &amp; Strategic KPI Hub
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              PT. Benamakmur Selaras Sejahtera • Ringkasan Khusus Direksi, Owner &amp; Maintenance Management
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex gap-2 items-center bg-white/10 p-1.5 rounded-xl border border-white/10 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 outline-none font-bold text-xs cursor-pointer rounded-lg px-2.5 py-1 hover:bg-slate-700 transition-colors"
            />
            <span className="text-slate-400 font-black text-xs">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 outline-none font-bold text-xs cursor-pointer rounded-lg px-2.5 py-1 hover:bg-slate-700 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsBDModalOpen(true)}
            className="bg-red-600/80 hover:bg-red-600 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer border border-red-500/60"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>Quick B/D</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Resume Eksekutif</span>
          </button>
        </div>
      </div>

      {/* Modal Quick Breakdown Awal */}
      {isBDModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Pelaporan Cepat Breakdown Awal (Direksi)</span>
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
                  placeholder="Contoh: Hose hidrolik boom pecah, engine overheating..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500 resize-none"
                  required
                />
              </div>

              <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-[11px] text-red-700 leading-relaxed">
                Unit akan langsung ditandai berstatus <strong>B/D (Breakdown)</strong> pada sistem ERP, dan nomor tiket Work Order darurat akan dibuat otomatis.
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

      {/* 2. 4 KARTU METRIK UTAMA EKSEKUTIF (STANDAR ENGINEERING & HEAVY EQUIPMENT KPI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Physical Availability (PA) - Dark Luxury Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between border border-slate-700/50">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Physical Availability (PA)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black text-white tracking-tight">
                  {metrics.pa}
                </span>
                <span className="text-lg font-bold text-slate-400">%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <ShieldCheck className={`w-6 h-6 ${metrics.pa >= 88 ? 'text-emerald-400' : metrics.pa >= 75 ? 'text-amber-400' : 'text-red-400'}`} />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
            <span
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                metrics.pa >= 88
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : metrics.pa >= 75
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}
            >
              {metrics.pa >= 88 ? '🟢 PRIMA (OPTIMAL)' : metrics.pa >= 75 ? '🟡 PERLU PERHATIAN' : '🔴 KRITIS (HIGH DOWNTIME)'}
            </span>
            <span className="text-[9px] text-slate-400 font-bold">
              Target Plan PA &gt;88%
            </span>
          </div>
        </div>

        {/* Card 2: Fleet Operational Status (RFU / RWN / BD) */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Fleet Availability Rate
              </span>
              <span className="text-xs font-black text-emerald-600">
                {metrics.totalUnits > 0 ? Math.round((metrics.readyCount / metrics.totalUnits) * 100) : 0}%
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {metrics.readyCount}{' '}
              <span className="text-sm font-bold text-slate-500">/ {metrics.totalUnits} Unit Operasional</span>
            </h3>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[9.5px] font-bold">
            <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              {metrics.rfu} RFU (Ready)
            </span>
            <span className="text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
              {metrics.rwn} RWN (Note)
            </span>
            <span className="text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
              {metrics.bd} B/D (Breakdown)
            </span>
          </div>
        </div>

        {/* Card 3: Total Breakdown Downtime & Lost Hours */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Total Breakdown Downtime
              </span>
              <span className="text-xs font-black text-red-500">
                {metrics.breakdownCases}x Kasus
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {Math.round(metrics.totalDowntimeHours)}{' '}
              <span className="text-sm font-bold text-slate-500">Lost Hours</span>
            </h3>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>Mean Time to Repair:</span>
            <span className="font-black text-slate-800">{metrics.mttr}h / Kasus</span>
          </div>
        </div>

        {/* Card 4: Waiting Parts & Backlogs */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Waiting Parts / Pending PR
              </span>
              <span className="text-xs font-black text-amber-600">
                {metrics.waitingPartsCount} Antrean
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {metrics.waitingPartsCount}{' '}
              <span className="text-sm font-bold text-slate-500">Unit Tunggu Part</span>
            </h3>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>Backlog Queue:</span>
            <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              {metrics.openBacklogsCount} Open Backlogs
            </span>
          </div>
        </div>
      </div>

      {/* 3. EXECUTIVE BRIEFING & STRATEGIC DIRECTIVES (FROM NOTULEN RAPAT) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700/60 relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5 relative z-10">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-xl flex-shrink-0 shadow-inner mt-0.5 sm:mt-0">
              <ClipboardCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/30 text-indigo-200">
                  Executive Briefing &amp; Management Directives
                </span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  {metrics.pa >= 88 ? 'Status Armada Prima' : 'Status Perlu Perhatian'}
                </span>
              </div>
              <h4 className="font-black text-lg md:text-xl uppercase tracking-tight text-white mt-1">
                Arahan Manajemen &amp; Keputusan Rapat Koordinasi
              </h4>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Isu kritis operasional, dampak target produksi, dan tindak lanjut prioritas yang disepakati pimpinan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('meetings')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/15 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm backdrop-blur-sm cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Input di Notulen Rapat</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Dynamic 4 Strategic Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs relative z-10">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              1. Kesiapan Armada &amp; Utilisasi
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Dari total <strong>{metrics.totalUnits} unit</strong> armada aktif, <strong>{metrics.rfu} unit RFU</strong> dan <strong>{metrics.rwn} unit RWN</strong>. Physical Availability (PA) tercapai sebesar <strong>{metrics.pa}%</strong> terhadap target acuan operasional 88.0%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              2. Status Breakdown Kritis &amp; MTTR
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {criticalUnits.length > 0 ? (
                <>Tercatat <strong>{criticalUnits.length} unit</strong> terhenti operasi ({criticalUnits.slice(0, 3).map(u => u.equip_no).join(', ')}). Rata-rata durasi penanganan perbaikan (MTTR) adalah <strong>{metrics.mttr} jam / kasus</strong>.</>
              ) : (
                <>Seluruh armada berada dalam kondisi siap operasi (RFU) tanpa breakdown aktif di lapangan.</>
              )}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
              3. Kendala Sparepart &amp; Backlog
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Terdapat <strong>{metrics.waitingPartsCount} unit</strong> menunggu alokasi suku cadang dari logistik serta <strong>{metrics.openBacklogsCount} defect backlog</strong> terbuka yang dijadwalkan pada servis periodik berikutnya.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              4. Tindak Lanjut &amp; Rekomendasi
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {latestMeeting?.decision ||
                'Prioritaskan percepatan pengadaan fast moving sparepart dan lakukan audit P2H shift pagi secara ketat guna meminimalkan unscheduled breakdown.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. 3 VISUAL CHARTS GRID (STRATEGIC EXECUTIVE INSIGHTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik 1: Proporsi Kesiapan Armada */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>1. Fleet Availability Distribution</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Komposisi Armada</span>
          </div>

          {/* SVG Donut Chart */}
          <div className="h-60 relative flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-44 h-44 -rotate-90">
              {(() => {
                const total = metrics.totalUnits || 1;
                const rfuAngle = (metrics.rfu / total) * 100;
                const rwnAngle = (metrics.rwn / total) * 100;
                const bdAngle = (metrics.bd / total) * 100;

                const c = 2 * Math.PI * 38; // circumference ~ 238.76
                const rfuStroke = (rfuAngle / 100) * c;
                const rwnStroke = (rwnAngle / 100) * c;
                const bdStroke = (bdAngle / 100) * c;

                return (
                  <>
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
                    {/* RFU */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray={`${rfuStroke} ${c}`}
                      strokeDashoffset="0"
                    />
                    {/* RWN */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="14"
                      strokeDasharray={`${rwnStroke} ${c}`}
                      strokeDashoffset={-rfuStroke}
                    />
                    {/* BD */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="14"
                      strokeDasharray={`${bdStroke} ${c}`}
                      strokeDashoffset={-(rfuStroke + rwnStroke)}
                    />
                  </>
                );
              })()}
            </svg>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">{metrics.readyCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ready</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-3 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> {metrics.rfu} RFU
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> {metrics.rwn} RWN
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {metrics.bd} B/D
              </span>
            </div>
          </div>
        </div>

        {/* Grafik 2: Kesiapan Per Jenis Alat Berat */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500" />
              <span>2. PA per Equipment Model</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Target Plan: 88%</span>
          </div>

          <div className="h-60 flex flex-col justify-center space-y-3.5">
            {modelStats.length > 0 ? (
              modelStats.map(m => (
                <div key={m.name} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-700">
                    <span className="truncate pr-2">{m.name}</span>
                    <span className={m.pa >= 88 ? 'text-emerald-600' : 'text-amber-600'}>
                      {m.pa}% ({m.total} unit)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        m.pa >= 88 ? 'bg-emerald-500' : m.pa >= 75 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, m.pa)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-xs text-slate-400 py-10">Belum ada data model</div>
            )}
          </div>
        </div>

        {/* Grafik 3: Akar Masalah Kerusakan Terlama */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-4 h-4 text-rose-500" />
              <span>3. Top Major Component Lost Hours</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Jam Rusak Terlama</span>
          </div>

          <div className="h-60 flex flex-col justify-center space-y-3.5">
            {majorComponents.length > 0 ? (
              majorComponents.map(([comp, hrs], idx) => {
                const maxHrs = majorComponents[0]?.[1] || 1;
                const pct = maxHrs > 0 ? (hrs / maxHrs) * 100 : 0;
                return (
                  <div key={comp} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span className="truncate pr-2 text-[10px] uppercase font-bold text-slate-600">
                        #{idx + 1} {comp}
                      </span>
                      <span className="text-red-500 font-mono text-xs">{hrs.toFixed(1)} Jam</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-red-500 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-xs text-slate-400 py-10 flex flex-col items-center justify-center gap-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-0.5 opacity-80" />
                <span className="font-bold text-slate-600">Tidak Ada Jam Rusak (0 Jam)</span>
                <span className="text-[10px] text-slate-400">Semua komponen normal / belum ada data kerusakan tercatat</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. TABEL RINGKAS UNIT KRITIS STOP OPERASI (BREAKDOWN & WAITING PARTS) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 border-b border-slate-100 pb-4">
          <div>
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Unit Kritis Stop Operasi (Breakdown &amp; Waiting Parts)</span>
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Monitoring armada yang terhenti operasi dan membutuhkan intervensi manajemen / percepatan pengadaan suku cadang.
            </p>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-xl text-xs font-black uppercase">
            {criticalUnits.length} Unit Terhenti
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-600 tracking-wider">
              <tr>
                <th className="p-3.5 rounded-l-xl w-32">KODE UNIT</th>
                <th className="p-3.5 w-36">MODEL / TIPE</th>
                <th className="p-3.5">DESKRIPSI KERUSAKAN / KENDALA</th>
                <th className="p-3.5 text-center w-28">DOWNTIME</th>
                <th className="p-3.5 text-center rounded-r-xl w-36">STATUS PERBAIKAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {criticalUnits.length > 0 ? (
                criticalUnits.map(unit => (
                  <tr key={unit.equip_no} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-black text-slate-900">{unit.equip_no}</td>
                    <td className="p-3.5 font-bold text-slate-500 uppercase">{unit.model}</td>
                    <td className="p-3.5 text-slate-700">{unit.kendala}</td>
                    <td className="p-3.5 text-center font-mono font-bold text-red-600">{unit.downtime}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                        {unit.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    Semua unit armada dalam kondisi siap operasi (RFU). Tidak ada unit breakdown kritis saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
