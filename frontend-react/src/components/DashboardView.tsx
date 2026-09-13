import React, { useState } from 'react';
import {
  TrendingUp,
  Crown,
  Printer,
  ShieldCheck,
  Truck,
  Wrench,
  Clock,
  AlertTriangle,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  X
} from 'lucide-react';
import { Equipment, WorkOrder, Backlog, DailyHM } from '../types';
import { NavTab } from './Sidebar';
import { printExecutiveReport } from '../utils/printUtils';
import { api } from '../services/api';

interface DashboardViewProps {
  equipments: Equipment[];
  workOrders: WorkOrder[];
  backlogs: Backlog[];
  dailyHms: DailyHM[];
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  equipments,
  workOrders,
  backlogs,
  dailyHms,
  onNavigate
}) => {
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [searchWO, setSearchWO] = useState('');

  // Equipment Metrics
  const readyCount = equipments.filter(e => {
    const s = (e.status || '').toUpperCase();
    return s === 'READY' || s === 'RUNNING' || s === 'ACTIVE' || s === 'OPERASI' || s === 'RFU';
  }).length;

  const breakdownCount = equipments.filter(e => {
    const s = (e.status || '').toUpperCase();
    return s === 'BREAKDOWN' || s === 'REPAIR' || s === 'MAINTENANCE' || s === 'BD';
  }).length;

  const warningCount = equipments.length - readyCount - breakdownCount;

  const physicalAvailability = equipments.length > 0
    ? Math.round((readyCount / equipments.length) * 100)
    : 0;

  // Work Orders Metrics
  const openWOs = workOrders.filter(w => {
    const s = (w.status || '').toUpperCase();
    return s !== 'CLOSED' && s !== 'COMPLETED';
  });

  const waitingPartWOs = workOrders.filter(w => {
    const s = (w.status || '').toUpperCase();
    return s.includes('WAIT') || s.includes('PART');
  });

  // Recent Work Orders
  const recentWOs = workOrders
    .filter(w => {
      if (!searchWO) return true;
      const q = searchWO.toLowerCase();
      return (
        (w.no_wo || '').toLowerCase().includes(q) ||
        (w.no_unit || '').toLowerCase().includes(q) ||
        (w.deskripsi || '').toLowerCase().includes(q) ||
        (w.status || '').toLowerCase().includes(q)
      );
    })
    .slice(-6)
    .reverse();

  // Critical Backlogs
  const criticalBacklogs = backlogs
    .filter(b => (b.prioritas || '').toUpperCase() === 'HIGH' || (b.prioritas || '').toUpperCase() === 'CRITICAL')
    .slice(0, 5);

  const [isBDModalOpen, setIsBDModalOpen] = useState(false);
  const [submittingBD, setSubmittingBD] = useState(false);
  const [bdForm, setBdForm] = useState({
    equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
    kendala: '',
    pelapor: 'Top Management',
    shift: '1'
  });

  const handlePrintExecutive = () => {
    printExecutiveReport(
      {
        pa: physicalAvailability,
        rfu: readyCount,
        rwn: warningCount,
        bd: breakdownCount,
        totalHours: equipments.length * 24 * 30,
        downtimeHours: breakdownCount * 120
      },
      equipments,
      workOrders,
      { start: startDate, end: endDate }
    );
  };

  const handleSaveBDAwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bdForm.equip_no || !bdForm.kendala.trim()) {
      alert('Pilih nomor lambung unit dan isi kendala kerusakan!');
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
          pelapor: 'Top Management',
          shift: '1'
        });
        window.location.reload();
      } else {
        alert(res.message || 'Gagal melaporkan breakdown');
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
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black shadow-inner">
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs md:text-sm font-black uppercase tracking-wider text-white">
              Executive Plant Management &amp; Strategic KPI Hub
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              PT. Benamakmur Selaras Sejahtera • Ringkasan Khusus Direksi &amp; Plant Maintenance
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
            onClick={handlePrintExecutive}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Resume Eksekutif</span>
          </button>
        </div>
      </div>

      {/* Modal Quick Breakdown Awal */}
      {isBDModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Pelaporan Cepat Breakdown Awal</span>
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
                  placeholder="Contoh: Hose hidrolik boom pecah, radiator overheat..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500 resize-none"
                  required
                />
              </div>

              <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-[11px] text-red-700 leading-relaxed">
                Unit akan langsung ditandai berstatus <strong>B/D (Breakdown)</strong> pada sistem, dan nomor tiket Work Order darurat akan dibuat otomatis.
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

      {/* 2. 4 KARTU METRIK UTAMA EKSEKUTIF (STANDAR ENGINEERING HEAVY EQUIPMENT) */}
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
                  {physicalAvailability}
                </span>
                <span className="text-lg font-bold text-slate-400">%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
            <span
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                physicalAvailability >= 85
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {physicalAvailability >= 85 ? 'Kesiapan Optimal' : 'Perlu Evaluasi'}
            </span>
            <span className="text-[9px] text-slate-400 font-bold">
              Target Plan PA &gt;88%
            </span>
          </div>
        </div>

        {/* Card 2: Fleet Availability Rate (RFU / RWN / BD) */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Fleet Availability Rate
              </span>
              <span className="text-xs font-black text-emerald-600">
                {equipments.length > 0 ? Math.round((readyCount / equipments.length) * 100) : 0}%
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {readyCount}{' '}
              <span className="text-sm font-bold text-slate-500">Unit Operasional</span>
            </h3>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[9.5px] font-bold">
            <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              {readyCount} RFU (Ready)
            </span>
            <span className="text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
              {warningCount} RWN (Note)
            </span>
            <span className="text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
              {breakdownCount} B/D (Breakdown)
            </span>
          </div>
        </div>

        {/* Card 3: Total Breakdown Downtime */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Total Breakdown Downtime
              </span>
              <span className="text-xs font-black text-red-500">
                {breakdownCount}x Kasus Aktif
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {breakdownCount * 8}{' '}
              <span className="text-sm font-bold text-slate-500">Lost Hours</span>
            </h3>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>Mean Time to Repair:</span>
            <span className="font-black text-slate-800">~6.5h / Kasus</span>
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
                {waitingPartWOs.length} Antrean
              </span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              {waitingPartWOs.length}{' '}
              <span className="text-sm font-bold text-slate-500">Unit Tunggu Part</span>
            </h3>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-500">
            <span>Backlog Queue:</span>
            <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              {backlogs.length} Open Backlogs
            </span>
          </div>
        </div>
      </div>

      {/* 3. MODUL SHORTCUT BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigate('fleet')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-400 transition-all text-left group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800">Master Unit</div>
              <div className="text-[10px] text-slate-500">{equipments.length} Total Armada</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('wo')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all text-left group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800">Work Orders</div>
              <div className="text-[10px] text-slate-500">{openWOs.length} WO Aktif</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-600 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('backlog')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all text-left group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800">Backlog Register</div>
              <div className="text-[10px] text-slate-500">{backlogs.length} Defect Terbuka</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('p2h')}
          className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all text-left group flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-800">P2H Checklist</div>
              <div className="text-[10px] text-slate-500">Inspeksi Harian</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
        </button>
      </div>

      {/* 4. RECENT WORK ORDERS & CRITICAL BACKLOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Work Order Hub Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="text-sm md:text-base font-black text-slate-900 tracking-tight">
                Work Orders Terbaru
              </h3>
              <p className="text-[11px] text-slate-500">
                Pencatatan Surat Perintah Kerja perbaikan &amp; servis berkala
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari WO / unit..."
                  value={searchWO}
                  onChange={e => setSearchWO(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors font-medium w-40 sm:w-48"
                />
              </div>
              <button
                type="button"
                onClick={() => onNavigate('wo')}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-colors"
              >
                Lihat Semua
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-2.5 px-3">No. WO</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Deskripsi Pekerjaan</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Prioritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentWOs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                      Belum ada data Work Order yang tercatat.
                    </td>
                  </tr>
                ) : (
                  recentWOs.map(wo => {
                    const statusUpper = (wo.status || '').toUpperCase();
                    const priorityUpper = (wo.prioritas || '').toUpperCase();

                    return (
                      <tr key={wo.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                        <td className="py-3 px-3 font-mono font-bold text-blue-600">
                          {wo.no_wo}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-black text-[10px]">
                            {wo.no_unit}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                          {wo.deskripsi || '-'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                              statusUpper === 'COMPLETED' || statusUpper === 'CLOSED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : statusUpper.includes('WAIT')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {wo.status || 'OPEN'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold ${
                              priorityUpper === 'HIGH' || priorityUpper === 'CRITICAL'
                                ? 'bg-red-100 text-red-700'
                                : priorityUpper === 'MEDIUM'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {wo.prioritas || 'NORMAL'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Critical Backlogs Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    Critical Backlogs
                  </h3>
                  <p className="text-[10px] text-slate-500">Prioritas tinggi / mendesak</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black">
                {criticalBacklogs.length} Urgent
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {criticalBacklogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-medium text-xs">
                  Tidak ada backlog berkategori kritis saat ini.
                </div>
              ) : (
                criticalBacklogs.map(b => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-black text-slate-800">{b.no_unit}</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-black text-[9px] uppercase">
                        {b.prioritas || 'HIGH'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium line-clamp-2">
                      {b.deskripsi || '-'}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Status: {b.status || 'OPEN'}</span>
                      <span className="text-amber-600 font-bold">{b.part_required || 'Perlu Part'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('backlog')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Buka Backlog Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
