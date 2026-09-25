import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Printer,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  Truck,
  Droplets,
  Layers,
  ShieldCheck,
  ChevronRight,
  X,
  FileText,
  Hammer,
  Sparkles,
  PackageCheck,
  Info,
  SlidersHorizontal,
  Trash2,
  Edit2,
  Zap,
  Activity,
  ClipboardCheck,
  ExternalLink,
  Eye
} from 'lucide-react';
import {
  PsScheduleItem,
  PsScheduleBacklogItem,
  Equipment,
  OilSample,
  PpuRecord,
  Backlog,
  WorkOrder,
  FARRecord
} from '../types';
import { api } from '../services/api';

interface PsScheduleServiceViewProps {
  psSchedules?: PsScheduleItem[];
  equipments?: Equipment[];
  oilSamples?: OilSample[];
  inspections?: any[];
  ppuRecords?: PpuRecord[];
  backlogs?: Backlog[];
  pmRecords?: any[];
  farRecords?: FARRecord[];
  workOrders?: WorkOrder[];
  onRefresh?: () => void;
}

export const PsScheduleServiceView: React.FC<PsScheduleServiceViewProps> = ({
  psSchedules = [],
  equipments = [],
  oilSamples = [],
  inspections = [],
  ppuRecords = [],
  backlogs = [],
  pmRecords = [],
  farRecords = [],
  workOrders = [],
  onRefresh
}) => {
  // ─── Available Dates ─────────────────────────────────────────────────
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(psSchedules.map(s => s.schedule_date).filter(Boolean)));
    return dates.sort().reverse();
  }, [psSchedules]);

  // Tanggal default: utamakan hari ini jika ada di data, jika tidak ambil tanggal pertama
  const initialDate = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    if (availableDates.includes(today)) return today;
    if (availableDates.length > 0) return availableDates[0];
    return today;
  }, [availableDates]);

  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedSubSection, setSelectedSubSection] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDoneModalOpen, setIsDoneModalOpen] = useState<boolean>(false);
  const [targetForDone, setTargetForDone] = useState<PsScheduleItem | null>(null);
  const [doneActualHm, setDoneActualHm] = useState<number>(0);
  const [donePic, setDonePic] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Tahap 4: Official Daily Dispatch Sheet State
  const [isDispatchPreviewOpen, setIsDispatchPreviewOpen] = useState<boolean>(false);
  const [dispatchShift, setDispatchShift] = useState<string>('Shift 1 (Day / 06:00 - 18:00)');
  const [dispatchSupervisor, setDispatchSupervisor] = useState<string>('Hendra Gunawan (Maint. Supervisor)');
  const [dispatchForeman, setDispatchForeman] = useState<string>('Rahmat Hidayat (Workshop Foreman)');
  const [dispatchPlanner, setDispatchPlanner] = useState<string>('Tim Plant Planner');

  // Tahap 4: Detail Hasil Selesai (Closed-Loop)
  const [viewDoneDetail, setViewDoneDetail] = useState<PsScheduleItem | null>(null);

  // Tahap 4: Execution 5-Pillar Verification Checklist
  const [doneWashing, setDoneWashing] = useState<boolean>(true);
  const [doneGreasing, setDoneGreasing] = useState<boolean>(true);
  const [doneInspection, setDoneInspection] = useState<boolean>(true);
  const [doneTorque, setDoneTorque] = useState<boolean>(true);
  const [doneBattery, setDoneBattery] = useState<boolean>(true);
  const [doneNotes, setDoneNotes] = useState<string>('');

  // Reference Inspector Modal State
  const [inspectModal, setInspectModal] = useState<{
    isOpen: boolean;
    type: 'PAP' | 'PPC' | 'VIS' | 'DMS' | 'PPM' | 'PPE' | 'PPA' | 'BACKLOG';
    refCode: string;
    equipNo: string;
    title: string;
    data: any;
  } | null>(null);

  // Form Auto-Bundle State
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [bundleLoading, setBundleLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<PsScheduleItem>>({
    schedule_date: selectedDate,
    plan_start_date: selectedDate,
    plan_start_time: '07:30',
    est_hours: 1.0,
    sub_section: 'SUPPORT MEDIUM',
    pic: 'Mekanik PM',
    location: 'KBCT',
    ps_type: '250',
    av_parts_percent: 100.0,
    backlogs: [],
  });

  // ─── Filtered Data ───────────────────────────────────────────────────
  const filteredSchedules = useMemo(() => {
    return psSchedules.filter(item => {
      // Filter Tanggal
      const matchDate = !selectedDate || item.schedule_date === selectedDate;
      // Filter Sub-Section
      const matchSub = selectedSubSection === 'ALL' || item.sub_section === selectedSubSection;
      // Search
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !search ||
        item.equip_no.toLowerCase().includes(search) ||
        (item.code_number && item.code_number.toLowerCase().includes(search)) ||
        item.model.toLowerCase().includes(search) ||
        item.pic.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search) ||
        (item.wo_no && item.wo_no.toLowerCase().includes(search));

      return matchDate && matchSub && matchSearch;
    });
  }, [psSchedules, selectedDate, selectedSubSection, searchTerm]);

  // ─── Sub-Section Counts ──────────────────────────────────────────────
  const subSectionCounts = useMemo(() => {
    const list = psSchedules.filter(s => !selectedDate || s.schedule_date === selectedDate);
    const counts: Record<string, number> = {
      ALL: list.length,
      'POWER PLANT': 0,
      'SUPPORT MEDIUM': 0,
      'SUPPORT BIG': 0,
    };
    list.forEach(s => {
      const sub = s.sub_section || 'SUPPORT MEDIUM';
      if (counts[sub] !== undefined) {
        counts[sub]++;
      } else {
        counts[sub] = 1;
      }
    });
    return counts;
  }, [psSchedules, selectedDate]);

  // ─── KPI Metrics ─────────────────────────────────────────────────────
  const kpiMetrics = useMemo(() => {
    const totalUnits = filteredSchedules.length;
    let totalDowntime = 0;
    let totalAvParts = 0;
    let totalBacklogs = 0;
    let completedCount = 0;

    filteredSchedules.forEach(s => {
      totalDowntime += Number(s.est_hours || 0);
      totalAvParts += Number(s.av_parts_percent || 0);
      totalBacklogs += (s.backlogs ? s.backlogs.length : 0);
      if (s.status === 'DONE') completedCount++;
    });

    const avgAvParts = totalUnits > 0 ? (totalAvParts / totalUnits).toFixed(1) : '100.0';

    return {
      totalUnits,
      avgAvParts,
      totalDowntime: totalDowntime.toFixed(1),
      totalBacklogs,
      completedCount,
    };
  }, [filteredSchedules]);

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleUnitSelect = async (equipNo: string) => {
    setSelectedUnit(equipNo);
    if (!equipNo) return;

    setBundleLoading(true);
    try {
      const res = await api.autoBundleUnitForPs(equipNo);
      if (res && res.success && res.bundle) {
        const b = res.bundle;
        setFormData(prev => ({
          ...prev,
          equip_no: b.equip_no,
          code_number: b.code_number,
          model: b.model,
          current_hm: b.current_hm,
          plan_hm: b.plan_hm,
          ps_type: b.ps_type,
          est_hours: b.est_hours,
          sub_section: b.sub_section,
          pic: b.pic,
          location: b.location,
          wo_no: b.wo_no,
          notif_no: b.notif_no,
          resrv_no: b.resrv_no,
          av_parts_percent: b.av_parts_percent,
          pap_ref: b.pap_ref,
          ppa_ref: b.ppa_ref,
          dms_ref: b.dms_ref,
          ppm_ref: b.ppm_ref,
          ppe_ref: b.ppe_ref,
          ppc_ref: b.ppc_ref,
          vis_ref: b.vis_ref,
          backlogs: b.backlogs || [],
        }));
      }
    } catch (err: any) {
      console.error('Error auto-bundling:', err);
    } finally {
      setBundleLoading(false);
    }
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.equip_no) {
      alert('Silakan pilih nomor unit alat!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        schedule_date: selectedDate,
        plan_start_date: formData.plan_start_date || selectedDate,
      };
      const res = await api.savePsScheduleItem(payload);
      if (res.success) {
        setIsModalOpen(false);
        if (onRefresh) onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan jadwal servis');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal servis unit ini?')) return;
    try {
      const res = await api.deletePsScheduleItem(id);
      if (res.success && onRefresh) {
        onRefresh();
      }
    } catch (err: any) {
      alert('Gagal menghapus: ' + err.message);
    }
  };

  const openDoneModal = (item: PsScheduleItem) => {
    setTargetForDone(item);
    setDoneActualHm(item.plan_hm || item.current_hm || 0);
    setDonePic(item.pic || 'Mekanik PM');
    setDoneWashing(true);
    setDoneGreasing(true);
    setDoneInspection(true);
    setDoneTorque(true);
    setDoneBattery(true);
    setDoneNotes(`Servis berkala PS-${item.ps_type} unit ${item.equip_no} selesai sesuai standar operasional.`);
    setIsDoneModalOpen(true);
  };

  const handleConfirmDone = async () => {
    if (!targetForDone) return;
    setSubmitting(true);
    try {
      const res = await api.executePsScheduleDone(
        targetForDone.id!,
        doneActualHm,
        selectedDate,
        donePic
      );
      if (res.success) {
        alert(res.message);
        setIsDoneModalOpen(false);
        setTargetForDone(null);
        if (onRefresh) onRefresh();
      } else {
        alert(res.message || 'Gagal menyelesaikan servis');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Reference Inspector Click Handler ───────────────────────────────
  const inspectReference = (
    type: 'PAP' | 'PPC' | 'VIS' | 'DMS' | 'PPM' | 'PPE' | 'PPA' | 'BACKLOG',
    refCode: string | undefined,
    equipNo: string,
    extraData?: any
  ) => {
    if (!refCode) return;

    let title = '';
    let matchedData: any = null;

    if (type === 'PAP') {
      title = `Program Analisa Pelumas (SOS Oil Lab) — ${refCode}`;
      matchedData = oilSamples.find(
        o => o.sample_code === refCode || o.item_id === refCode || (o as any).id == refCode
      );
      if (!matchedData) {
        matchedData = oilSamples.find(o => (o as any).equip_no === equipNo);
      }
    } else if (type === 'PPC') {
      title = `Program Pemeriksaan Chassis (CTS Undercarriage) — ${refCode}`;
      const numMatch = refCode.match(/\d+/);
      const ppuId = numMatch ? parseInt(numMatch[0]) : null;
      matchedData = ppuRecords.find(
        p => (ppuId && p.id === ppuId) || p.unit_no === equipNo
      );
    } else if (type === 'VIS') {
      title = `Visual Inspection (P2H Checklist Harian) — ${refCode}`;
      matchedData = inspections.find(
        i => i.item_id === refCode || i.id == refCode || i.equip_no === equipNo
      );
    } else if (type === 'DMS') {
      title = `Defect Management System / Analisis Kegagalan — ${refCode}`;
      matchedData = farRecords.find(
        f => f.item_id === refCode || f.no_unit === equipNo || f.equip_no === equipNo
      );
      if (!matchedData) {
        matchedData = backlogs.find(b => b.item_id === refCode || b.equip_no === equipNo);
      }
    } else if (type === 'PPM') {
      title = `Program Pemeriksaan Mesin (PM Checklist) — ${refCode}`;
      matchedData = pmRecords.find(
        p => p.item_id === refCode || p.id == refCode || p.equip_no === equipNo
      );
    } else if (type === 'PPE') {
      title = `Program Pemeriksaan Elektrikal / Diagnosis WO — ${refCode}`;
      matchedData = workOrders.find(
        w => w.no_wo === refCode || (w.equip_no === equipNo && w.major_comp === 'ELECTRICAL')
      );
    } else if (type === 'PPA') {
      title = `Program Pemeriksaan Alat Terpadu — ${refCode}`;
      matchedData = equipments.find(e => e.equip_no === equipNo);
    } else if (type === 'BACKLOG') {
      title = `Detail Backlog Defect Tertunda — ${refCode}`;
      matchedData = backlogs.find(b => b.item_id === refCode || b.id == refCode) || extraData;
    }

    setInspectModal({
      isOpen: true,
      type,
      refCode,
      equipNo,
      title,
      data: matchedData
    });
  };

  return (
    <div className="space-y-6">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. Top Bar: Header, Tanggal Operasional, Filter & Quick Actions   */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              PS Schedule Service
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              Live SQLite Data
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Matriks Pelaksanaan Servis Berkala Terintegrasi — Cross-Reference Program Keandalan (PAP, PPC, VIS, DMS, PPM, PPE) & Bundling Backlog Defect
          </p>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Date Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            {availableDates.map(dateStr => (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDate === dateStr
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {dateStr === new Date().toISOString().split('T')[0] ? `Hari Ini (${dateStr})` : dateStr}
              </button>
            ))}
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-mono text-slate-700 dark:text-slate-300 px-2 py-1 outline-none cursor-pointer"
              title="Pilih tanggal kustom"
            />
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          {/* Print Dispatch Sheet Button */}
          <button
            onClick={() => setIsDispatchPreviewOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold shadow-sm transition-all hover:-translate-y-0.5 cursor-pointer"
            title="Buka pratinjau dan cetak formulir resmi Daily Dispatch Sheet untuk shift lapangan"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Cetak Daily Dispatch Sheet
          </button>

          {/* Add / Auto-Bundle Modal Button */}
          <button
            onClick={() => {
              setSelectedUnit('');
              setFormData({
                schedule_date: selectedDate,
                plan_start_date: selectedDate,
                plan_start_time: '07:30',
                est_hours: 1.0,
                sub_section: 'SUPPORT MEDIUM',
                pic: 'INDRA S',
                location: 'KBCT',
                ps_type: '250',
                av_parts_percent: 100.0,
                backlogs: [],
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            Jadwal Servis Baru
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. KPI Cards: 4 Kluster Metrik Operasional Lapangan               */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Scheduled Units */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Unit Terjadwal
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {kpiMetrics.totalUnits}
              </span>
              <span className="text-xs text-slate-500 font-medium">Unit Armada</span>
            </div>
          </div>
        </div>

        {/* Total Planned Downtime */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Target Downtime
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {kpiMetrics.totalDowntime}
              </span>
              <span className="text-xs text-slate-500 font-medium">Jam Servis</span>
            </div>
          </div>
        </div>

        {/* Average Parts Readiness */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Kesiapan Part (AV. Parts)
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {kpiMetrics.avgAvParts}%
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Gudang Ready</span>
            </div>
          </div>
        </div>

        {/* Bundled Backlog Defects */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Bundled Backlog Defect
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                {kpiMetrics.totalBacklogs}
              </span>
              <span className="text-xs text-slate-500 font-medium">Item Tertutup</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 3. Sub-Section Filter Tabs & Real-time Search                     */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Sub-Section Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-x-auto">
          {(['ALL', 'POWER PLANT', 'SUPPORT MEDIUM', 'SUPPORT BIG'] as const).map(sub => {
            const count = subSectionCounts[sub] || 0;
            const isActive = selectedSubSection === sub;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubSection(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>{sub}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Unit / Model / PIC / WO..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 4. Grand Matrix Table: 4 Kluster Kolom Terpadu                    */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[640px]">
          <table className="w-full text-[11px] text-left border-collapse">
            {/* Header Bertingkat (4 Kluster) */}
            <thead className="sticky top-0 z-10 select-none shadow-sm">
              {/* Row 1: Cluster Labels */}
              <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th colSpan={11} className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 border-r border-slate-300 dark:border-slate-700 text-center">
                  1. Setup / Planning Operasional
                </th>
                <th colSpan={4} className="py-2.5 px-3 bg-blue-100/70 dark:bg-blue-950/40 border-r border-slate-300 dark:border-slate-700 text-center text-blue-900 dark:text-blue-300">
                  2. Periodic Service (SAP PM & Gudang)
                </th>
                <th colSpan={7} className="py-2.5 px-3 bg-amber-100/70 dark:bg-amber-950/40 border-r border-slate-300 dark:border-slate-700 text-center text-amber-900 dark:text-amber-300">
                  3. Reference (Program Keandalan & Kondisi Alat)
                </th>
                <th colSpan={5} className="py-2.5 px-3 bg-rose-100/70 dark:bg-rose-950/40 border-r border-slate-300 dark:border-slate-700 text-center text-rose-900 dark:text-rose-300">
                  4. Backlog Bundling Defect
                </th>
                <th className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-center">
                  Aksi
                </th>
              </tr>

              {/* Row 2: Detailed Column Headers */}
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-[10px] whitespace-nowrap">
                {/* Cluster 1: Setup */}
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800 text-center w-8">NO</th>
                <th className="py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800">MODEL</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800">KODE ALAT</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800 text-right">CURRENT HM</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800 text-right">PLAN HM</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800 text-center">PS TYPE</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800 text-center">PLAN START</th>
                <th className="py-2 px-1.5 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800 text-center">HRS</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800">SUB SECTION</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-800">PIC</th>
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 border-r border-slate-300 dark:border-slate-700">LOKASI</th>

                {/* Cluster 2: Periodic Service */}
                <th className="py-2 px-2 bg-blue-50/70 dark:bg-blue-950/20 border-r border-slate-200 dark:border-slate-800">WO NO</th>
                <th className="py-2 px-2 bg-blue-50/70 dark:bg-blue-950/20 border-r border-slate-200 dark:border-slate-800">NOTIF</th>
                <th className="py-2 px-2 bg-blue-50/70 dark:bg-blue-950/20 border-r border-slate-200 dark:border-slate-800">RESRV</th>
                <th className="py-2 px-2 bg-blue-50/70 dark:bg-blue-950/20 border-r border-slate-300 dark:border-slate-700 text-center">AV. PARTS %</th>

                {/* Cluster 3: Reference */}
                <th className="py-2 px-2 bg-amber-50/70 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 text-center" title="Program Analisa Pelumas (Oil SOS)">PAP</th>
                <th className="py-2 px-2 bg-amber-50/70 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 text-center" title="Program Pemeriksaan Alat">PPA</th>
                <th className="py-2 px-2 bg-amber-50/70 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 text-center" title="Defect Management System / FAR">DMS</th>
                <th className="py-2 px-2 bg-amber-50/70 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 text-center" title="Program Pemeriksaan Mesin (PM Record)">PPM</th>
                <th className="py-2 px-2 bg-amber-50/70 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 text-center" title="Program Pemeriksaan Elektrikal">PPE</th>
                <th className="py-2 px-2 bg-amber-50/70 dark:bg-amber-950/20 border-r border-slate-200 dark:border-slate-800 text-center" title="Program Pemeriksaan Chassis / Undercarriage (PPU)">PPC</th>
                <th className="py-2 px-2 bg-amber-50/70 dark:bg-amber-950/20 border-r border-slate-300 dark:border-slate-700 text-center" title="Visual Inspection (P2H Checklist)">VIS</th>

                {/* Cluster 4: Backlog Bundles */}
                <th className="py-2 px-2 bg-rose-50/70 dark:bg-rose-950/20 border-r border-slate-200 dark:border-slate-800">BL WO</th>
                <th className="py-2 px-2 bg-rose-50/70 dark:bg-rose-950/20 border-r border-slate-200 dark:border-slate-800">BL NOTIF</th>
                <th className="py-2 px-2 bg-rose-50/70 dark:bg-rose-950/20 border-r border-slate-200 dark:border-slate-800">BL RESRV</th>
                <th className="py-2 px-2 bg-rose-50/70 dark:bg-rose-950/20 border-r border-slate-200 dark:border-slate-800 text-center">BL AV %</th>
                <th className="py-2 px-3 bg-rose-50/70 dark:bg-rose-950/20 border-r border-slate-300 dark:border-slate-700">DESKRIPSI KERUSAKAN DEFECT</th>

                {/* Action */}
                <th className="py-2 px-2 bg-slate-50 dark:bg-slate-800/80 text-center">AKSI</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={28} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-8 h-8 text-amber-500/80 mb-1" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        Tidak ada jadwal servis untuk filter tanggal {selectedDate}
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        Silakan pilih tanggal lain di atas, atau klik tombol <strong>"+ Jadwal Servis Baru"</strong> untuk auto-bundle unit armada dari SQLite.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((row, idx) => {
                  const hasBacklogs = row.backlogs && row.backlogs.length > 0;
                  const isDone = row.status === 'DONE';

                  return (
                    <tr
                      key={row.id || idx}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isDone ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                      }`}
                    >
                      {/* No */}
                      <td className="py-2.5 px-2 text-center font-mono font-medium text-slate-500 border-r border-slate-200 dark:border-slate-800">
                        {idx + 1}
                      </td>

                      {/* Setup: Model */}
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {row.model || '-'}
                        {isDone && (
                          <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                            DONE
                          </span>
                        )}
                      </td>

                      {/* Code Number */}
                      <td className="py-2 px-2 font-mono font-semibold text-blue-700 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {row.code_number || row.equip_no}
                      </td>

                      {/* Current HM */}
                      <td className="py-2 px-2 font-mono text-right text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                        {Number(row.current_hm || 0).toLocaleString()}
                      </td>

                      {/* Plan HM */}
                      <td className="py-2 px-2 font-mono text-right font-semibold text-blue-600 dark:text-blue-400 border-r border-slate-200 dark:border-slate-800">
                        {Number(row.plan_hm || 0).toLocaleString()}
                      </td>

                      {/* PS Type */}
                      <td className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300/50">
                          {row.ps_type}
                        </span>
                      </td>

                      {/* Plan Start */}
                      <td className="py-2 px-2 text-center text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap font-mono text-[11px]">
                        {row.plan_start_date || row.schedule_date} {row.plan_start_time || '07:30'}
                      </td>

                      {/* Est Hours */}
                      <td className="py-2 px-1.5 text-center font-mono font-semibold text-slate-700 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                        {row.est_hours}
                      </td>

                      {/* Sub-Section */}
                      <td className="py-2 px-2 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.sub_section === 'POWER PLANT'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
                            : row.sub_section === 'SUPPORT BIG'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {row.sub_section}
                        </span>
                      </td>

                      {/* PIC */}
                      <td className="py-2 px-2 font-medium text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                        {row.pic || '-'}
                      </td>

                      {/* Location */}
                      <td className="py-2 px-2 text-slate-600 dark:text-slate-300 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                        {row.location || '-'}
                      </td>

                      {/* Periodic Service: WO */}
                      <td className="py-2 px-2 font-mono text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                        {row.wo_no || '-'}
                      </td>

                      {/* Notif */}
                      <td className="py-2 px-2 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                        {row.notif_no || '-'}
                      </td>

                      {/* Resrv */}
                      <td className="py-2 px-2 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800">
                        {row.resrv_no || '-'}
                      </td>

                      {/* Av Parts % */}
                      <td className="py-2 px-2 text-center border-r border-slate-300 dark:border-slate-700">
                        <span className={`inline-block px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${
                          Number(row.av_parts_percent || 0) >= 98
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {row.av_parts_percent}%
                        </span>
                      </td>

                      {/* ──────────────── CLUSTER 3: REFERENCES (INTERACTIVE) ───────────── */}
                      {/* PAP (Oil SOS) */}
                      <td className="py-2 px-1 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800">
                        {row.pap_ref ? (
                          <button
                            onClick={() => inspectReference('PAP', row.pap_ref, row.equip_no)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-800 transition-transform active:scale-95"
                            title={`PAP: ${row.pap_ref} — Klik untuk cek data aktual laboratorium SOS`}
                          >
                            <Droplets className="w-2.5 h-2.5 text-blue-500" />
                            {row.pap_ref}
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* PPA (Program Pemeriksaan Alat) */}
                      <td className="py-2 px-1 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800">
                        {row.ppa_ref ? (
                          <button
                            onClick={() => inspectReference('PPA', row.ppa_ref, row.equip_no)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-transform active:scale-95"
                            title={`PPA: ${row.ppa_ref}`}
                          >
                            <ClipboardCheck className="w-2.5 h-2.5 text-slate-500" />
                            {row.ppa_ref}
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* DMS (Defect Management System / FAR) */}
                      <td className="py-2 px-1 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800">
                        {row.dms_ref ? (
                          <button
                            onClick={() => inspectReference('DMS', row.dms_ref, row.equip_no)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 font-bold border border-rose-200/80 dark:border-rose-800 transition-transform active:scale-95"
                            title={`DMS: ${row.dms_ref} — Klik untuk cek riwayat analisa kerusakan`}
                          >
                            <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                            {row.dms_ref}
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* PPM (Program Pemeriksaan Mesin / PM Record) */}
                      <td className="py-2 px-1 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800">
                        {row.ppm_ref ? (
                          <button
                            onClick={() => inspectReference('PPM', row.ppm_ref, row.equip_no)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800 transition-transform active:scale-95"
                            title={`PPM: ${row.ppm_ref} — Klik untuk cek riwayat servis PM`}
                          >
                            <Wrench className="w-2.5 h-2.5 text-emerald-500" />
                            {row.ppm_ref}
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* PPE (Program Pemeriksaan Elektrikal) */}
                      <td className="py-2 px-1 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800">
                        {row.ppe_ref ? (
                          <button
                            onClick={() => inspectReference('PPE', row.ppe_ref, row.equip_no)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-200/80 dark:border-purple-800 transition-transform active:scale-95"
                            title={`PPE: ${row.ppe_ref} — Klik untuk cek riwayat elektrikal`}
                          >
                            <Zap className="w-2.5 h-2.5 text-purple-500" />
                            {row.ppe_ref}
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* PPC (PPU Undercarriage) */}
                      <td className="py-2 px-1 text-center font-mono text-[10px] border-r border-slate-200 dark:border-slate-800">
                        {row.ppc_ref ? (
                          <button
                            onClick={() => inspectReference('PPC', row.ppc_ref, row.equip_no)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-200/80 dark:border-amber-800 transition-transform active:scale-95"
                            title={`PPC: ${row.ppc_ref} — Klik untuk cek data keausan rantai undercarriage`}
                          >
                            <Layers className="w-2.5 h-2.5 text-amber-500" />
                            {row.ppc_ref}
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* VIS (Visual Inspection P2H) */}
                      <td className="py-2 px-1 text-center font-mono text-[10px] border-r border-slate-300 dark:border-slate-700">
                        {row.vis_ref ? (
                          <button
                            onClick={() => inspectReference('VIS', row.vis_ref, row.equip_no)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/80 text-teal-800 dark:text-teal-300 font-bold border border-teal-200/80 dark:border-teal-800 transition-transform active:scale-95"
                            title={`VIS: ${row.vis_ref} — Klik untuk cek checklist harian P2H`}
                          >
                            <ShieldCheck className="w-2.5 h-2.5 text-teal-600" />
                            {row.vis_ref}
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* ──────────────── CLUSTER 4: BACKLOG BUNDLES ─────────────────────── */}
                      <td className="py-2 px-2 font-mono text-[11px] text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 align-top">
                        {hasBacklogs ? (
                          <div className="space-y-1">
                            {row.backlogs!.map((bl, bi) => (
                              <div key={bi}>{bl.wo_no || '-'}</div>
                            ))}
                          </div>
                        ) : '-'}
                      </td>

                      <td className="py-2 px-2 font-mono text-[11px] text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 align-top">
                        {hasBacklogs ? (
                          <div className="space-y-1">
                            {row.backlogs!.map((bl, bi) => (
                              <div key={bi}>{bl.notif_no || '-'}</div>
                            ))}
                          </div>
                        ) : '-'}
                      </td>

                      <td className="py-2 px-2 font-mono text-[11px] text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 align-top">
                        {hasBacklogs ? (
                          <div className="space-y-1">
                            {row.backlogs!.map((bl, bi) => (
                              <div key={bi}>{bl.resrv_no || '-'}</div>
                            ))}
                          </div>
                        ) : '-'}
                      </td>

                      <td className="py-2 px-2 text-center border-r border-slate-200 dark:border-slate-800 align-top">
                        {hasBacklogs ? (
                          <div className="space-y-1">
                            {row.backlogs!.map((bl, bi) => (
                              <div key={bi} className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                {bl.av_parts_percent || 100}%
                              </div>
                            ))}
                          </div>
                        ) : '-'}
                      </td>

                      <td className="py-2 px-3 border-r border-slate-300 dark:border-slate-700 align-top max-w-[280px]">
                        {hasBacklogs ? (
                          <div className="space-y-1.5">
                            {row.backlogs!.map((bl, bi) => (
                              <button
                                key={bi}
                                onClick={() => inspectReference('BACKLOG', bl.backlog_id || 'BL', row.equip_no, bl)}
                                className="w-full text-left p-1.5 rounded-lg bg-rose-50/70 hover:bg-rose-100/90 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-900/50 transition-colors group"
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-mono font-bold text-rose-800 dark:text-rose-300">
                                    {bl.backlog_id || `BL-${bi + 1}`}
                                  </span>
                                  <span className="text-[9px] text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 flex items-center gap-0.5">
                                    <Eye className="w-2.5 h-2.5" />
                                    Detail
                                  </span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5">
                                  {bl.description}
                                </p>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">Zero Backlog (Bersih)</span>
                        )}
                      </td>

                      {/* ──────────────── ACTION COLUMN ──────────────────────────────────── */}
                      <td className="py-2 px-2 text-center align-top whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {!isDone ? (
                            <button
                              onClick={() => openDoneModal(row)}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                              title="Tandai servis selesai dan tutup seluruh backlog terkait"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Eksekusi Done
                            </button>
                          ) : (
                            <button
                              onClick={() => setViewDoneDetail(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
                              title="Lihat resume detail hasil eksekusi closed-loop"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Tuntas (Closed-Loop)
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(row.id!)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Hapus baris jadwal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 5. Reference Inspector Modal (Live SQLite Data Connected)          */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {inspectModal && inspectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {inspectModal.type}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {inspectModal.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Unit Terkait: <strong className="text-slate-800 dark:text-slate-200">{inspectModal.equipNo}</strong> | Kode Rujukan: <strong className="text-blue-600 font-mono">{inspectModal.refCode}</strong>
                </p>
              </div>
              <button
                onClick={() => setInspectModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Based on Reference Type */}
            {inspectModal.data ? (
              <div className="space-y-4 text-xs">
                {/* ── Type: PAP (Oil Sample SOS) ── */}
                {inspectModal.type === 'PAP' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Kompartemen</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.compartment || 'Engine'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Grade Pelumas</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{inspectModal.data.oil_grade || '15W-40'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Rating Kondisi</span>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          inspectModal.data.rating === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inspectModal.data.rating === 'B'
                            ? 'bg-amber-100 text-amber-800'
                            : inspectModal.data.rating === 'C'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-rose-100 text-rose-800 font-black'
                        }`}>
                          {inspectModal.data.rating} — {inspectModal.data.rating === 'A' ? 'NORMAL' : inspectModal.data.rating === 'B' ? 'CAUTION' : inspectModal.data.rating === 'C' ? 'ABNORMAL' : 'CRITICAL'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Lab Penguji</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{inspectModal.data.lab_vendor || 'Caterpillar SOS Lab'}</span>
                      </div>
                    </div>

                    {/* Wear Metals Table */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                        Konsentrasi Logam Keausan (Wear Metals in PPM)
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center font-mono">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Fe (Besi)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.fe ?? 0}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Cu (Tembaga)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.cu ?? 0}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Cr (Kromium)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.cr ?? 0}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Pb (Timbal)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.pb ?? 0}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Al (Aluminium)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.al ?? 0}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Si (Silika/Debu)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.si ?? 0}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">PQ Index</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.pq ?? 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Official Lab Interpretation */}
                    <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
                      <span className="font-bold text-blue-900 dark:text-blue-300 block text-[11px]">
                        Diagnosa & Rekomendasi Resmi Laboratorium:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {inspectModal.data.interpretation || 'Hasil analisis dalam batas toleransi pabrikan.'}
                      </p>
                      {inspectModal.data.repair_notes && (
                        <p className="text-amber-700 dark:text-amber-400 text-[11px] font-semibold mt-1">
                          Catatan Perbaikan: {inspectModal.data.repair_notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Type: PPC (PPU Undercarriage CTS) ── */}
                {inspectModal.type === 'PPC' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Track Group Brand</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.track_group_used || 'OEM'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Jam Operasi Rantai</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{inspectModal.data.hours_track_gp ?? 0} Jam</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Persentase Keausan</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">{inspectModal.data.pct_hours_track ?? 0}% Wear</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Status CTS</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{inspectModal.data.status || 'NORMAL'}</span>
                      </div>
                    </div>

                    {/* Measurements */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                        Hasil Pengukuran Fisik CTS (mm)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Sprocket (LH / RH)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.sprocket_lh} / {inspectModal.data.sprocket_rh} mm</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Link Height (LH / RH)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.link_height_lh} / {inspectModal.data.link_height_rh} mm</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Chain Bushing (LH / RH)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.chain_bushing_lh} / {inspectModal.data.chain_bushing_rh} mm</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[9px] text-slate-400 block">Grouser Height (LH / RH)</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.grouser_height_lh} / {inspectModal.data.grouser_height_rh} mm</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
                      <span className="font-bold text-amber-900 dark:text-amber-300 block text-[11px]">
                        Catatan & Rekomendasi Inspektur CTS:
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                        {inspectModal.data.notes || 'Pengukuran dalam batas aman toleransi keausan undercarriage.'}
                      </p>
                      <p className="text-slate-500 text-[10px] mt-1">
                        Diinspeksi oleh: {inspectModal.data.inspector || 'Tim CTS'} pada {inspectModal.data.inspection_date || '-'}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Type: VIS (Visual Inspection P2H) ── */}
                {inspectModal.type === 'VIS' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Tanggal Inspeksi</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.tanggal || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Inspektur</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{inspectModal.data.inspector || 'Mekanik P2H'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Tipe Alat</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{inspectModal.data.tipe_alat || '-'}</span>
                      </div>
                    </div>

                    {/* Checklist Grid */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                        Daftar Pengecekan Form P2H (Visual Inspection Checklist)
                      </span>
                      {(() => {
                        let checks: Record<string, string> = {};
                        try {
                          checks = typeof inspectModal.data.checklist_json === 'string'
                            ? JSON.parse(inspectModal.data.checklist_json)
                            : (inspectModal.data.checklist_json || {});
                        } catch (e) {
                          checks = {};
                        }

                        const keys = Object.keys(checks);
                        if (keys.length === 0) {
                          return <p className="text-slate-400 italic">Pengecekan visual standar telah diverifikasi aman (GOOD).</p>;
                        }

                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {keys.map(k => {
                              const val = checks[k];
                              const isGood = val === 'GOOD' || val === 'PASS';
                              const isFail = val === 'FAIL';
                              return (
                                <div key={k} className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                  <span className="capitalize text-slate-700 dark:text-slate-300 font-medium">
                                    {k.replace(/_/g, ' ')}
                                  </span>
                                  <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                                    isGood
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : isFail
                                      ? 'bg-rose-100 text-rose-800 font-black'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {val}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* ── Type: DMS / FAR ── */}
                {inspectModal.type === 'DMS' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                      <span className="font-bold text-rose-900 dark:text-rose-300 block text-[11px]">
                        Kronologi Kerusakan Komponen:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                        {inspectModal.data.chronology || inspectModal.data.deskripsi_backlog || 'Kerusakan komponen terdeteksi pada operasi shift.'}
                      </p>
                    </div>

                    {inspectModal.data.corrective_action && (
                      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
                        <span className="font-bold text-blue-900 dark:text-blue-300 block text-[11px]">
                          Tindakan Korektif (Corrective Action):
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 text-[11px]">
                          {inspectModal.data.corrective_action}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Type: PPM (PM Record) ── */}
                {inspectModal.type === 'PPM' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Tipe Servis PM</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{inspectModal.data.pm_type || 'PM 250H'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">HM Servis</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{inspectModal.data.hm_pm || '-'} HM</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block">Mekanik Lead</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{inspectModal.data.mechanic || 'Tim Mekanik'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                        Verifikasi 5 Pilar Preventive Maintenance:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">1. Washing Check</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectModal.data.washing_check || 'PASS'}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">2. Greasing Check</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectModal.data.greasing_check || 'PASS'}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">3. Inspection Check</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectModal.data.inspection_check || 'PASS'}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">4. Torque Check</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectModal.data.torque_check || 'PASS'}</span>
                        </div>
                        <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">5. Battery Check</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inspectModal.data.battery_check || 'PASS'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Type: BACKLOG ── */}
                {inspectModal.type === 'BACKLOG' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
                      <span className="font-bold text-rose-900 dark:text-rose-300 block text-[11px]">
                        Deskripsi Kerusakan Defect:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 text-[12px] font-semibold">
                        {inspectModal.data.deskripsi_backlog || inspectModal.data.description || '-'}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 pt-1 border-t border-rose-200 dark:border-rose-900/40">
                        <span>Status: <strong className="text-slate-800 dark:text-slate-200">{inspectModal.data.status || 'PENDING'}</strong></span>
                        <span>Estimasi Pengerjaan: <strong className="text-slate-800 dark:text-slate-200 font-mono">{inspectModal.data.est_hours || 4} Jam</strong></span>
                        <span>Kesiapan Suku Cadang: <strong className="text-emerald-600 font-mono">{inspectModal.data.av_parts_percent || 100}%</strong></span>
                      </div>
                    </div>

                    {inspectModal.data.rencana_eksekusi && (
                      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-1">
                        <span className="font-bold text-blue-900 dark:text-blue-300 block text-[11px]">
                          Rencana Eksekusi di Lapangan:
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 text-[11px]">
                          {inspectModal.data.rencana_eksekusi}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Type: PPE / Work Order ── */}
                {inspectModal.type === 'PPE' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-1.5">
                      <span className="font-bold text-purple-900 dark:text-purple-300 block text-[11px]">
                        Work Order Kelistrikan / Diagnosa ECM:
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 text-[11px]">
                        Kendala: {inspectModal.data.kendala || 'Inspeksi sistem kelistrikan dan charging.'}
                      </p>
                      <p className="text-slate-600 dark:text-slate-400 text-[10px]">
                        Penyebab: {inspectModal.data.failure_reason || '-'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Data rujukan ({inspectModal.refCode}) belum terisi lengkap</p>
                <p className="text-xs text-slate-400 mt-0.5">Unit ini belum memiliki riwayat pengukuran detail di modul terkait.</p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setInspectModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 6. Modal: Tambah & Auto-Bundle Jadwal Servis Unit Baru             */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Auto-Bundle Jadwal Servis Baru (Enterprise Engine)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pilih unit dari armada SQLite. Sistem otomatis mengaitkan HM terkini, interval servis, nomor WO/Notif/Reservasi SAP, serta mendeteksi backlog defect terbuka.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              {/* Unit Selector */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Unit Alat Berat (34 Unit Master Armada)
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedUnit}
                    onChange={e => handleUnitSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold font-mono"
                    required
                  >
                    <option value="">-- Pilih Unit Armada --</option>
                    {equipments.map(eq => (
                      <option key={eq.equip_no || eq.no_unit} value={eq.equip_no || eq.no_unit}>
                        {eq.equip_no || eq.no_unit} — {eq.model} ({eq.unit_type || eq.tipe}) — Lokasi: {(eq as any).location || eq.lokasi || 'KBCT'}
                      </option>
                    ))}
                  </select>
                  {bundleLoading && (
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  )}
                </div>
              </div>

              {/* Grid Setup Param */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Current HM</label>
                  <input
                    type="number"
                    value={formData.current_hm || 0}
                    onChange={e => setFormData({ ...formData, current_hm: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Plan Target HM</label>
                  <input
                    type="number"
                    value={formData.plan_hm || 0}
                    onChange={e => setFormData({ ...formData, plan_hm: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-blue-600 dark:text-blue-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Tipe Servis PS</label>
                  <select
                    value={formData.ps_type || '250'}
                    onChange={e => setFormData({ ...formData, ps_type: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-slate-100"
                  >
                    <option value="250">PS 250H</option>
                    <option value="500">PS 500H</option>
                    <option value="1000">PS 1000H</option>
                    <option value="2000">PS 2000H</option>
                    <option value="4000">PS 4000H</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Sub Section</label>
                  <select
                    value={formData.sub_section || 'SUPPORT MEDIUM'}
                    onChange={e => setFormData({ ...formData, sub_section: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option value="POWER PLANT">POWER PLANT (Tower Lamp / Genset)</option>
                    <option value="SUPPORT MEDIUM">SUPPORT MEDIUM (Excavator / Bulldozer)</option>
                    <option value="SUPPORT BIG">SUPPORT BIG (Dump Truck / Water Truck)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Jam Mulai Servis</label>
                  <input
                    type="time"
                    value={formData.plan_start_time || '07:30'}
                    onChange={e => setFormData({ ...formData, plan_start_time: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">PIC Mekanik Lead</label>
                  <input
                    type="text"
                    value={formData.pic || ''}
                    onChange={e => setFormData({ ...formData, pic: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Lokasi Unit Lapangan</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Rantai Penomoran SAP PM & Gudang */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
                <span className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Rantai Penomoran Eksekusi (SAP PM & Gudang)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500">WO Induk</span>
                    <input
                      type="text"
                      value={formData.wo_no || ''}
                      onChange={e => setFormData({ ...formData, wo_no: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Notification SAP</span>
                    <input
                      type="text"
                      value={formData.notif_no || ''}
                      onChange={e => setFormData({ ...formData, notif_no: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Reservasi Part</span>
                    <input
                      type="text"
                      value={formData.resrv_no || ''}
                      onChange={e => setFormData({ ...formData, resrv_no: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Av. Parts %</span>
                    <input
                      type="number"
                      value={formData.av_parts_percent || 100}
                      onChange={e => setFormData({ ...formData, av_parts_percent: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Rujukan Pemantauan Kondisi */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Rujukan Pemantauan Kondisi Aktual di Sistem (Cross-Reference)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500">PAP (Oil SOS Lab)</span>
                    <input
                      type="text"
                      value={formData.pap_ref || ''}
                      onChange={e => setFormData({ ...formData, pap_ref: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">PPC (Undercarriage CTS)</span>
                    <input
                      type="text"
                      value={formData.ppc_ref || ''}
                      onChange={e => setFormData({ ...formData, ppc_ref: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 text-[11px]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">VIS (P2H Checklist)</span>
                    <input
                      type="text"
                      value={formData.vis_ref || ''}
                      onChange={e => setFormData({ ...formData, vis_ref: e.target.value })}
                      className="w-full px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Bundled Backlogs Section */}
              <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
                <span className="font-semibold text-rose-900 dark:text-rose-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Paket Backlog Defect Tertunda ({formData.backlogs?.length || 0} Terdeteksi)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const current = formData.backlogs || [];
                      setFormData({
                        ...formData,
                        backlogs: [
                          ...current,
                          {
                            description: 'Perbaikan defect temuan',
                            wo_no: '22017' + Math.floor(10000 + Math.random() * 90000),
                            notif_no: '12000' + Math.floor(4100000 + Math.random() * 200000),
                            resrv_no: '53' + Math.floor(10000 + Math.random() * 90000),
                            av_parts_percent: 100,
                          }
                        ]
                      });
                    }}
                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    + Tambah Backlog Manual
                  </button>
                </span>

                {formData.backlogs && formData.backlogs.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {formData.backlogs.map((bl, bIndex) => (
                      <div key={bIndex} className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-slate-500">WO: {bl.wo_no || '-'} | Resrv: {bl.resrv_no || '-'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.backlogs!.filter((_, i) => i !== bIndex);
                              setFormData({ ...formData, backlogs: updated });
                            }}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={bl.description}
                          onChange={e => {
                            const updated = [...formData.backlogs!];
                            updated[bIndex].description = e.target.value;
                            setFormData({ ...formData, backlogs: updated });
                          }}
                          className="w-full px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-800 dark:text-slate-200"
                          placeholder="Deskripsi kerusakan..."
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-[11px] italic">Tidak ada backlog aktif terdeteksi untuk unit ini.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Rilis ke Jadwal Servis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 7. Modal: Konfirmasi Closed-Loop Done (Tahap 4)                    */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isDoneModalOpen && targetForDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    Eksekusi Servis Selesai (Closed-Loop)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unit: <strong className="text-slate-900 dark:text-slate-100 font-mono">{targetForDone.equip_no}</strong> ({targetForDone.model}) — PS {targetForDone.ps_type}H
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDoneModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-2">
              <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Otomatisasi Sistem Closed-Loop:
              </p>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] list-disc pl-4">
                <li>Membuat riwayat eksekusi di <strong>PM Records</strong> & <strong>Service History</strong>.</li>
                <li>Memperbarui HM servis terakhir & kalkulasi interval berikutnya di <strong>Plan Services</strong>.</li>
                <li>Mengembalikan status unit ke <strong>RFU (Ready For Use)</strong> di Master Armada.</li>
                <li>Menutup seluruh <strong>{targetForDone.backlogs?.length || 0} Backlog Defect</strong> terkait (Status: CLOSED).</li>
              </ul>
            </div>

            {/* Input Form Param */}
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Actual HM Selesai *</label>
                  <input
                    type="number"
                    value={doneActualHm}
                    onChange={e => setDoneActualHm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 font-black text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Mekanik Lead Pelaksana *</label>
                  <input
                    type="text"
                    value={donePic}
                    onChange={e => setDonePic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                    required
                  />
                </div>
              </div>

              {/* 5 Pilar PM Verification Checklist */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
                  Verifikasi 5 Pilar Preventive Maintenance (SOP):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input type="checkbox" checked={doneWashing} onChange={e => setDoneWashing(e.target.checked)} className="rounded accent-emerald-600" />
                    <span>1. Washing & UC Clean</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input type="checkbox" checked={doneGreasing} onChange={e => setDoneGreasing(e.target.checked)} className="rounded accent-emerald-600" />
                    <span>2. Greasing All Points</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input type="checkbox" checked={doneInspection} onChange={e => setDoneInspection(e.target.checked)} className="rounded accent-emerald-600" />
                    <span>3. General Inspection</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input type="checkbox" checked={doneTorque} onChange={e => setDoneTorque(e.target.checked)} className="rounded accent-emerald-600" />
                    <span>4. Retorque Component</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer sm:col-span-2">
                    <input type="checkbox" checked={doneBattery} onChange={e => setDoneBattery(e.target.checked)} className="rounded accent-emerald-600" />
                    <span>5. Battery Voltage & Charging Check (28V)</span>
                  </label>
                </div>
              </div>

              {/* Bundled Backlogs Review */}
              {targetForDone.backlogs && targetForDone.backlogs.length > 0 && (
                <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-rose-800 dark:text-rose-300 tracking-wider flex items-center justify-between">
                    <span>Backlog Defect yang Ditutup Otomatis:</span>
                    <span className="bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200 px-1.5 py-0.2 rounded text-[9px]">
                      {targetForDone.backlogs.length} Tiket
                    </span>
                  </span>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {targetForDone.backlogs.map((b, bi) => (
                      <div key={bi} className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-[11px]">
                        <div className="truncate mr-2">
                          <strong className="text-rose-700 dark:text-rose-300 font-mono mr-1.5">{b.backlog_id || `BL-${bi+1}`}</strong>
                          <span className="text-slate-700 dark:text-slate-300">{b.description}</span>
                        </div>
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex-shrink-0">
                          AUTO-CLOSED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Catatan Lapangan */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Catatan Pekerjaan / QC Lead</label>
                <input
                  type="text"
                  value={doneNotes}
                  onChange={e => setDoneNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
                  placeholder="Catatan tambahan hasil servis..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsDoneModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDone}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Selesaikan Servis & Tutup Closed-Loop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 8. Modal: View Detail Eksekusi Closed-Loop (Tahap 4)              */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {viewDoneDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                      Resume Eksekusi Servis (Closed-Loop)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                      TUNTAS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unit: <strong className="text-slate-900 dark:text-slate-100 font-mono">{viewDoneDetail.equip_no}</strong> ({viewDoneDetail.model}) — PS {viewDoneDetail.ps_type}H
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewDoneDetail(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Actual HM Selesai</span>
                <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {viewDoneDetail.actual_hm ? Number(viewDoneDetail.actual_hm).toLocaleString() : (viewDoneDetail.plan_hm ? Number(viewDoneDetail.plan_hm).toLocaleString() : '-')} HM
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Waktu Selesai</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {viewDoneDetail.actual_end_time ? `${viewDoneDetail.actual_end_time} WITA` : '11:30 WITA'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{viewDoneDetail.schedule_date}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Mekanik Lead:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewDoneDetail.pic || 'Mekanik PM'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Lokasi Workshop:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewDoneDetail.location || 'KBCT'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Nomor Work Order:</span>
                <span className="font-mono font-bold text-blue-600">{viewDoneDetail.wo_no || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status Unit Master:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> RFU (Ready For Use)
                </span>
              </div>
            </div>

            {viewDoneDetail.notes && (
              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-xs">
                <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 uppercase block mb-1">Catatan Sistem Closed-Loop:</span>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{viewDoneDetail.notes}</p>
              </div>
            )}

            {/* Backlog Items Closed */}
            {viewDoneDetail.backlogs && viewDoneDetail.backlogs.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
                  Daftar Backlog yang Telah Ditutup ({viewDoneDetail.backlogs.length} Tiket):
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {viewDoneDetail.backlogs.map((b, bi) => (
                    <div key={bi} className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-[11px]">
                      <span className="text-slate-800 dark:text-slate-200 font-medium truncate mr-2">{b.description}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 flex-shrink-0">
                        CLOSED ✓
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setViewDoneDetail(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Tutup Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 9. Modal: Daily Dispatch Sheet Print & Preview (Tahap 4)          */}
      {/* ───────────────────────────────────────────────────────────────── */}
      {isDispatchPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-6xl w-full p-6 shadow-2xl space-y-5 max-h-[95vh] overflow-y-auto print:max-h-none print:border-none print:shadow-none print:p-0 print:rounded-none">
            {/* Control Bar (Hidden on print) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Daily Maintenance Dispatch Sheet & Service Package
                  </h2>
                  <p className="text-xs text-slate-500">
                    Formulir resmi serah-terima paket servis berkala untuk Foreman dan Tim Mekanik Lapangan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Dokumen Sekarang (Print / PDF)
                </button>
                <button
                  type="button"
                  onClick={() => setIsDispatchPreviewOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Parameter Kontrol Cetak (Hidden on print) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 print:hidden text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Shift Kerja</label>
                <select
                  value={dispatchShift}
                  onChange={e => setDispatchShift(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold"
                >
                  <option value="Shift 1 (Day / 06:00 - 18:00)">Shift 1 (Day: 06:00 - 18:00)</option>
                  <option value="Shift 2 (Night / 18:00 - 06:00)">Shift 2 (Night: 18:00 - 06:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Plant Planner</label>
                <input
                  type="text"
                  value={dispatchPlanner}
                  onChange={e => setDispatchPlanner(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Maintenance Supervisor</label>
                <input
                  type="text"
                  value={dispatchSupervisor}
                  onChange={e => setDispatchSupervisor(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Workshop Foreman / Lead</label>
                <input
                  type="text"
                  value={dispatchForeman}
                  onChange={e => setDispatchForeman(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>

            {/* ── PRINTABLE LANDSCAPE DISPATCH SHEET (Official Document) ── */}
            <div id="dispatch-sheet-print-area" className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-300 font-sans print:border-none print:p-0">
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                <div>
                  <h1 className="text-base font-black tracking-tight uppercase text-slate-900">
                    PT. BENAMAKMUR SELARAS SEJAHTERA
                  </h1>
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    PLANT & HEAVY EQUIPMENT MAINTENANCE DEPARTMENT
                  </p>
                  <h2 className="text-sm font-black mt-2 text-slate-900 tracking-wide uppercase bg-slate-100 px-2 py-0.5 inline-block border border-slate-300">
                    DAILY MAINTENANCE DISPATCH SHEET & SERVICE PACKAGE EXECUTION
                  </h2>
                </div>
                <div className="text-right text-[10px] font-mono space-y-0.5">
                  <p><strong>DOC NO:</strong> FM-PLT-DSP-2026-09</p>
                  <p><strong>REV / STATUS:</strong> 03 / RELEASED</p>
                  <p><strong>HALAMAN:</strong> 1 DARI 1</p>
                  <p><strong>TANGGAL CETAK:</strong> {new Date().toLocaleDateString('id-ID')} {new Date().toLocaleTimeString('id-ID')}</p>
                </div>
              </div>

              {/* Document Metadata Bar */}
              <div className="grid grid-cols-6 gap-2 py-2.5 my-2 bg-slate-50 border border-slate-300 text-[10.5px]">
                <div className="px-2 border-r border-slate-200">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Tanggal Servis:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedDate}</span>
                </div>
                <div className="px-2 border-r border-slate-200">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Shift Kerja:</span>
                  <span className="font-bold text-slate-900">{dispatchShift}</span>
                </div>
                <div className="px-2 border-r border-slate-200">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Sub-Section:</span>
                  <span className="font-bold text-slate-900">{selectedSubSection}</span>
                </div>
                <div className="px-2 border-r border-slate-200">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Total Unit Terjadwal:</span>
                  <span className="font-black text-slate-900 font-mono">{filteredSchedules.length} Unit</span>
                </div>
                <div className="px-2 border-r border-slate-200">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Target Total Downtime:</span>
                  <span className="font-black text-rose-700 font-mono">{kpiMetrics.totalDowntime} Jam</span>
                </div>
                <div className="px-2">
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Kesiapan Suku Cadang:</span>
                  <span className="font-black text-emerald-700 font-mono">{kpiMetrics.avgAvParts}% Ready</span>
                </div>
              </div>

              {/* Table Dispatch Content */}
              <table className="w-full border-collapse border border-slate-900 text-[10px] my-3">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 font-black text-center uppercase tracking-wider text-[9px]">
                    <th className="border border-slate-900 px-1 py-1.5 w-6">NO</th>
                    <th className="border border-slate-900 px-2 py-1.5 w-24">UNIT & MODEL</th>
                    <th className="border border-slate-900 px-1.5 py-1.5 w-24">SERVIS & HM</th>
                    <th className="border border-slate-900 px-1.5 py-1.5 w-20">JAM & LOKASI</th>
                    <th className="border border-slate-900 px-2 py-1.5 w-28">TRANSAKSI ERP</th>
                    <th className="border border-slate-900 px-1 py-1.5 w-12">PARTS</th>
                    <th className="border border-slate-900 px-1.5 py-1.5 w-28">REFERENSI KEANDALAN</th>
                    <th className="border border-slate-900 px-2 py-1.5">PAKET BUNDLING DEFECT BACKLOG</th>
                    <th className="border border-slate-900 px-2 py-1.5 w-44">CHECKLIST FISIK LAPANGAN</th>
                    <th className="border border-slate-900 px-2 py-1.5 w-24">LEAD MEKANIK</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((row, idx) => (
                    <tr key={row.id || idx} className="border-b border-slate-900 text-slate-900 align-top">
                      <td className="border border-slate-900 px-1 py-1.5 text-center font-bold">{idx + 1}</td>
                      
                      {/* Unit & Model */}
                      <td className="border border-slate-900 px-1.5 py-1.5">
                        <div className="font-black font-mono text-[11px]">{row.equip_no}</div>
                        <div className="text-[9px] text-slate-600">{row.model}</div>
                        <div className="text-[8px] uppercase text-slate-500 font-semibold">{row.sub_section}</div>
                      </td>

                      {/* Servis & HM */}
                      <td className="border border-slate-900 px-1.5 py-1.5 text-center font-mono">
                        <span className="font-black text-[10px] px-1 bg-amber-100 border border-amber-300 rounded inline-block">
                          PS-{row.ps_type}H
                        </span>
                        <div className="text-[9px] mt-0.5">Plan: <strong>{Number(row.plan_hm || 0).toLocaleString()}</strong></div>
                        <div className="text-[8px] text-slate-500">Cur: {Number(row.current_hm || 0).toLocaleString()}</div>
                      </td>

                      {/* Jam & Lokasi */}
                      <td className="border border-slate-900 px-1.5 py-1.5 text-center font-mono text-[9px]">
                        <div>{row.plan_start_time || '07:30'} ({row.est_hours}h)</div>
                        <div className="font-bold text-slate-700 mt-0.5 font-sans">{row.location || 'KBCT'}</div>
                      </td>

                      {/* Transaksi ERP */}
                      <td className="border border-slate-900 px-1.5 py-1.5 font-mono text-[8.5px] space-y-0.5">
                        <div>WO: <strong>{row.wo_no || '-'}</strong></div>
                        <div>Notif: {row.notif_no || '-'}</div>
                        <div>Resrv: {row.resrv_no || '-'}</div>
                      </td>

                      {/* Parts */}
                      <td className="border border-slate-900 px-1 py-1.5 text-center font-mono font-bold text-[9.5px]">
                        {row.av_parts_percent}%
                      </td>

                      {/* Referensi Keandalan */}
                      <td className="border border-slate-900 px-1.5 py-1.5 text-[8.5px] space-y-0.5 font-mono">
                        {row.pap_ref && <div>PAP: <strong>{row.pap_ref}</strong></div>}
                        {row.ppc_ref && <div>PPC: <strong>{row.ppc_ref}</strong></div>}
                        {row.vis_ref && <div>VIS: <strong>{row.vis_ref}</strong></div>}
                        {!row.pap_ref && !row.ppc_ref && !row.vis_ref && <span className="text-slate-400 italic">Standar PS</span>}
                      </td>

                      {/* Bundling Defect Backlog */}
                      <td className="border border-slate-900 px-2 py-1.5">
                        {row.backlogs && row.backlogs.length > 0 ? (
                          <div className="space-y-1">
                            {row.backlogs.map((b, bi) => (
                              <div key={bi} className="text-[9px] leading-tight">
                                <span className="font-mono font-bold text-rose-700 mr-1">[{b.backlog_id || `BL-${bi+1}`}]</span>
                                <span>{b.description}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[9px]">Zero Backlog Defect</span>
                        )}
                      </td>

                      {/* Checklist Fisik Lapangan */}
                      <td className="border border-slate-900 px-2 py-1.5 text-[8.5px] space-y-0.5 select-none font-mono">
                        <div>[ ] 1. Washing & Clean Kolong</div>
                        <div>[ ] 2. Greasing All Pin/Bushing</div>
                        <div>[ ] 3. Drain/Refill Oli & Filter</div>
                        <div>[ ] 4. Retorque Baut Track/Roda</div>
                        <div>[ ] 5. Cek Sistem Elektrikal/Accu</div>
                        <div>[ ] 6. Safety & Operational QC Pass</div>
                      </td>

                      {/* Lead Mekanik */}
                      <td className="border border-slate-900 px-1.5 py-1.5 text-center">
                        <div className="font-bold text-[9px]">{row.pic || 'Mekanik PM'}</div>
                        <div className="border-b border-dotted border-slate-400 h-6 mt-1"></div>
                        <span className="text-[7.5px] text-slate-400 block mt-0.5">Ttd Mekanik</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Official 4-Column Signature Box */}
              <div className="grid grid-cols-4 gap-4 mt-4 pt-2 text-[10px] text-center border-t-2 border-slate-900">
                <div className="space-y-12">
                  <p className="font-bold uppercase text-slate-700">Direncanakan Oleh:<br/><span className="text-slate-500 font-normal">Plant Planner</span></p>
                  <div>
                    <p className="font-bold border-b border-slate-800 pb-1">{dispatchPlanner}</p>
                    <p className="text-[8.5px] text-slate-500 mt-0.5">Tgl: {selectedDate}</p>
                  </div>
                </div>

                <div className="space-y-12">
                  <p className="font-bold uppercase text-slate-700">Disetujui Oleh:<br/><span className="text-slate-500 font-normal">Maintenance Supervisor</span></p>
                  <div>
                    <p className="font-bold border-b border-slate-800 pb-1">{dispatchSupervisor}</p>
                    <p className="text-[8.5px] text-slate-500 mt-0.5">Tgl: {selectedDate}</p>
                  </div>
                </div>

                <div className="space-y-12">
                  <p className="font-bold uppercase text-slate-700">Diterima & Dikerjakan:<br/><span className="text-slate-500 font-normal">Workshop Foreman / Lead</span></p>
                  <div>
                    <p className="font-bold border-b border-slate-800 pb-1">{dispatchForeman}</p>
                    <p className="text-[8.5px] text-slate-500 mt-0.5">Tgl: {selectedDate}</p>
                  </div>
                </div>

                <div className="space-y-12">
                  <p className="font-bold uppercase text-slate-700">Diverifikasi Kembali:<br/><span className="text-slate-500 font-normal">QC Lead Inspector</span></p>
                  <div>
                    <p className="font-bold border-b border-slate-800 pb-1">(..........................................)</p>
                    <p className="text-[8.5px] text-slate-500 mt-0.5">Tgl: {selectedDate}</p>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-4 pt-2 border-t border-slate-300 text-[8.5px] text-slate-500 flex justify-between">
                <span>WOSys ERP — Sistem Manajemen Pemeliharaan & Alat Berat Terpadu</span>
                <span>Standar Operasional Prosedur (SOP) Perawatan Berkala Tambang Batubara</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
