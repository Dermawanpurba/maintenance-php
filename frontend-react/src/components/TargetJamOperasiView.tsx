import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Calendar, Plus, RefreshCw, Printer, ChevronLeft, ChevronRight,
  Trash2, X, Save, Edit3, CheckCircle, AlertCircle, Clock, Info,
  Filter, Download, Wrench, ShieldCheck, AlertTriangle, Sparkles,
  Layers, HardHat, FileSpreadsheet, Eye, Activity, Check,
  TrendingUp, BarChart3, Settings2
} from 'lucide-react';
import { api } from '../services/api';
import { Equipment, TargetJamOperasi, TargetJamHarian } from '../types';

// ─── Helpers & Constants ──────────────────────────────────────────────────────
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

const SECTIONS = ['MINING', 'HAULING', 'SUPPORT', 'MAINTENANCE', 'INFRA'];
const STATUS_LIST = ['RFU', 'BD', 'RWN', 'STANDBY'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getDayName(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day);
  return ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][d.getDay()];
}

function isWeekend(year: number, month: number, day: number): boolean {
  const d = new Date(year, month - 1, day);
  return d.getDay() === 0 || d.getDay() === 6;
}

function isToday(year: number, month: number, day: number): boolean {
  const now = new Date();
  return now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === day;
}

function formatNumber(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return Number(val).toLocaleString('id-ID');
}

// ─── Modal Form (Rencana 1 Bulan: Target Jam & Alokasi BD) ───────────────────
interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  editData?: TargetJamOperasi | null;
  equipments: Equipment[];
  year: number;
  month: number;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen, onClose, onSave, editData, equipments, year, month
}) => {
  const daysInMonth = getDaysInMonth(year, month);
  const calendarHours = daysInMonth * 24;

  const [form, setForm] = useState<any>({
    equip_no: '',
    section: 'MINING',
    model: '',
    est_hm: 0,
    est_hm_date: `01-${MONTH_NAMES_SHORT[month - 1]}-${String(year).slice(-2)}`,
    status: 'RFU',
    target_operating_hours: 500,
    target_pa: 88.0,
    pm_250: 0, pm_500: 0, pm_1000: 0, pm_2000: 0, pm_4000: 0,
    downtime_pm: 0,
    downtime_backlog: 0,
    downtime_midlife: 0,
    downtime_pcr: 0,
    downtime_unscheduled: 0,
    plan_year: year,
    plan_month: month,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        target_operating_hours: editData.target_operating_hours ?? 500,
        target_pa: editData.target_pa ?? 88.0,
        downtime_unscheduled: editData.downtime_unscheduled ?? 0,
        plan_year: year,
        plan_month: month
      });
    } else {
      setForm({
        equip_no: '',
        section: 'MINING',
        model: '',
        est_hm: 0,
        est_hm_date: `01-${MONTH_NAMES_SHORT[month - 1]}-${String(year).slice(-2)}`,
        status: 'RFU',
        target_operating_hours: 500,
        target_pa: 88.0,
        pm_250: 0, pm_500: 0, pm_1000: 0, pm_2000: 0, pm_4000: 0,
        downtime_pm: 0,
        downtime_backlog: 0,
        downtime_midlife: 0,
        downtime_pcr: 0,
        downtime_unscheduled: 0,
        plan_year: year,
        plan_month: month,
      });
    }
  }, [editData, isOpen, year, month]);

  const handleEquipChange = (equipNo: string) => {
    const eq = equipments.find(e => (e.equip_no || e.no_unit) === equipNo);
    const hm = Number(eq?.last_hm || 0);
    const isBD = (eq?.status || '').toUpperCase() === 'BD';

    setForm((p: any) => ({
      ...p,
      equip_no: equipNo,
      model: eq?.model || p.model,
      section: eq?.unit_type ? (eq.unit_type.toUpperCase().includes('DUMP') ? 'HAULING' : 'MINING') : p.section,
      status: eq?.status || p.status,
      est_hm: hm,
      target_operating_hours: isBD ? 0 : 500,
      target_pa: isBD ? 0 : 88.0,
      downtime_unscheduled: isBD ? calendarHours : 0
    }));
  };

  // Kalkulasi total rencana BD 1 bulan
  const totalPlannedBD = useMemo(() => {
    return (parseFloat(form.downtime_pm) || 0) +
      (parseFloat(form.downtime_backlog) || 0) +
      (parseFloat(form.downtime_midlife) || 0) +
      (parseFloat(form.downtime_pcr) || 0) +
      (parseFloat(form.downtime_unscheduled) || 0);
  }, [form.downtime_pm, form.downtime_backlog, form.downtime_midlife, form.downtime_pcr, form.downtime_unscheduled]);

  // Kalkulasi proyeksi PA berdasarkan alokasi BD
  const projectedPA = useMemo(() => {
    if (calendarHours <= 0) return '100.0';
    const pa = Math.max(0, ((calendarHours - totalPlannedBD) / calendarHours) * 100);
    return pa.toFixed(1);
  }, [calendarHours, totalPlannedBD]);

  const handleSave = async () => {
    if (!form.equip_no) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        plan_year: year,
        plan_month: month
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const InputCls = "w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium transition-colors";
  const LabelCls = "block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {editData ? `Rencana 1 Bulan Unit: ${editData.equip_no}` : 'Tambah Rencana 1 Bulan Unit Baru'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target Jam Operasi & Alokasi Breakdown — Periode: {MONTH_NAMES[month - 1]} {year}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Section 1: Identitas Unit */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-blue-500" /> 1. Identitas Alat & Status Operasi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={LabelCls}>Unit No *</label>
                <select className={InputCls} value={form.equip_no} onChange={e => handleEquipChange(e.target.value)}>
                  <option value="">-- Pilih Unit --</option>
                  {equipments.map(eq => {
                    const no = eq.equip_no || eq.no_unit;
                    return <option key={no} value={no}>{no} — {eq.model}</option>;
                  })}
                </select>
              </div>
              <div>
                <label className={LabelCls}>Section Divisi</label>
                <select className={InputCls} value={form.section} onChange={e => setForm((p: any) => ({ ...p, section: e.target.value }))}>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={LabelCls}>Model Alat</label>
                <input type="text" className={InputCls} value={form.model} onChange={e => setForm((p: any) => ({ ...p, model: e.target.value }))} placeholder="D85ESS-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div>
                <label className={LabelCls}>Est. HM Awal Bulan</label>
                <input type="number" className={InputCls} value={form.est_hm} onChange={e => setForm((p: any) => ({ ...p, est_hm: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className={LabelCls}>Ref. Tanggal HM</label>
                <input type="text" className={InputCls} value={form.est_hm_date || ''} onChange={e => setForm((p: any) => ({ ...p, est_hm_date: e.target.value }))} placeholder="01-Sep-26" />
              </div>
              <div>
                <label className={LabelCls}>Status Unit</label>
                <select className={InputCls} value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))}>
                  {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Target Jam Operasi 1 Bulan (MoHH & PA Target) */}
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-3">
            <span className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> 2. Target Operasi 1 Bulan ({MONTH_NAMES[month - 1]} {year})
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={LabelCls}>Jam Kalender Bulan</label>
                <input type="text" disabled className={`${InputCls} bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold cursor-not-allowed`} value={`${calendarHours} Jam (${daysInMonth} Hari)`} />
              </div>
              <div>
                <label className={LabelCls}>Target Jam Operasi (MoHH)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="5"
                    className={InputCls}
                    value={form.target_operating_hours}
                    onChange={e => setForm((p: any) => ({ ...p, target_operating_hours: parseFloat(e.target.value) || 0 }))}
                    placeholder="500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Jam</span>
                </div>
              </div>
              <div>
                <label className={LabelCls}>Target PA Dicanangkan (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    className={InputCls}
                    value={form.target_pa}
                    onChange={e => setForm((p: any) => ({ ...p, target_pa: parseFloat(e.target.value) || 0 }))}
                    placeholder="88.0"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Rencana Breakdown / Downtime 1 Bulan (Jam) — Fokus Utama */}
          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-800 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> 3. Rencana Alokasi Jam Breakdown (BD) 1 Bulan
              </span>
              <span className="text-[11px] font-black text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                Total Rencana: {totalPlannedBD} Jam
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Alokasikan estimasi jam downtime berdasarkan kategori servis berkala, backlog defect, midlife overhaul, dan pergantian komponen (PCS/PCR).
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className={LabelCls}>BD PM (Servis)</label>
                <div className="relative">
                  <input type="number" step="0.5" className={InputCls} value={form.downtime_pm} onChange={e => setForm((p: any) => ({ ...p, downtime_pm: parseFloat(e.target.value) || 0 }))} placeholder="4" />
                  <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">Jam</span>
                </div>
              </div>
              <div>
                <label className={LabelCls}>BD Backlog</label>
                <div className="relative">
                  <input type="number" step="0.5" className={InputCls} value={form.downtime_backlog} onChange={e => setForm((p: any) => ({ ...p, downtime_backlog: parseFloat(e.target.value) || 0 }))} placeholder="0" />
                  <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">Jam</span>
                </div>
              </div>
              <div>
                <label className={LabelCls}>BD Midlife</label>
                <div className="relative">
                  <input type="number" step="0.5" className={InputCls} value={form.downtime_midlife} onChange={e => setForm((p: any) => ({ ...p, downtime_midlife: parseFloat(e.target.value) || 0 }))} placeholder="0" />
                  <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">Jam</span>
                </div>
              </div>
              <div>
                <label className={LabelCls}>BD PCS / PCR</label>
                <div className="relative">
                  <input type="number" step="0.5" className={InputCls} value={form.downtime_pcr} onChange={e => setForm((p: any) => ({ ...p, downtime_pcr: parseFloat(e.target.value) || 0 }))} placeholder="0" />
                  <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">Jam</span>
                </div>
              </div>
              <div>
                <label className={LabelCls}>BD Unscheduled</label>
                <div className="relative">
                  <input type="number" step="0.5" className={InputCls} value={form.downtime_unscheduled} onChange={e => setForm((p: any) => ({ ...p, downtime_unscheduled: parseFloat(e.target.value) || 0 }))} placeholder="0" />
                  <span className="absolute right-2.5 top-2 text-[10px] font-bold text-slate-400">Jam</span>
                </div>
              </div>
            </div>

            {/* Live Calculation Preview Card */}
            <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4 text-xs font-bold">
                <div>
                  <span className="text-slate-400">Total Rencana BD: </span>
                  <span className="text-rose-600 font-black">{totalPlannedBD} Jam</span>
                </div>
                <div>
                  <span className="text-slate-400">Kapasitas Jam Jalan: </span>
                  <span className="text-slate-800 dark:text-slate-200 font-black">{Math.max(0, calendarHours - totalPlannedBD)} Jam</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-bold">Proyeksi PA:</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded ${
                  Number(projectedPA) >= 88 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  Number(projectedPA) >= 80 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {projectedPA}%
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: PM Type Berjadwal Bulan Ini */}
          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2">
            <span className="text-xs font-black text-rose-800 dark:text-rose-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> 4. Checklist Event Servis Berkala (PM Type) Bulan Ini
            </span>
            <p className="text-[11px] text-slate-500">Pilih kelipatan servis yang akan dieksekusi pada bulan ini:</p>
            <div className="grid grid-cols-5 gap-2.5 pt-1">
              {['250', '500', '1000', '2000', '4000'].map(type => {
                const key = `pm_${type}`;
                const isChecked = !!(form as any)[key];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((p: any) => ({ ...p, [key]: isChecked ? 0 : 1 }))}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-600/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span>PS-{type}</span>
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      isChecked ? 'bg-white/20 text-white' : 'border border-slate-300 dark:border-slate-700'
                    }`}>
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-3xl">
          <button onClick={onClose} className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!form.equip_no || saving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-blue-600/20"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan Rencana 1 Bulan'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Inline Editable Cell (Gantt Day Cell) ──────────────────────────────────
interface JamCellProps {
  equipNo: string;
  day: number;
  value: number;
  onSave: (equipNo: string, day: number, jam: number) => void;
  saving?: boolean;
}

const JamCell: React.FC<JamCellProps> = ({ equipNo, day, value, onSave, saving }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(value || ''));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVal(value > 0 ? String(value) : '');
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const commit = () => {
    const jam = parseFloat(val) || 0;
    onSave(equipNo, day, jam);
    setEditing(false);
  };

  if (editing) {
    return (
      <td className="border border-slate-300 dark:border-slate-700 p-0 text-center" style={{ width: 34, minWidth: 34 }}>
        <input
          ref={inputRef}
          type="number"
          value={val}
          onChange={e => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') setEditing(false);
          }}
          className="w-full h-8 text-center text-xs font-black bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 text-blue-900 dark:text-blue-100 outline-none rounded"
          min={0}
          max={24}
          step={0.5}
        />
      </td>
    );
  }

  // 24 = Full day breakdown
  // 3, 4, 6, 8, 12 = Scheduled PM / Component / Backlog service downtime
  let cellBg = '';
  let textCls = '';

  if (value === 24) {
    cellBg = 'bg-slate-300 dark:bg-slate-700';
    textCls = 'text-slate-900 dark:text-slate-100 font-black';
  } else if (value > 0) {
    cellBg = 'bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-600';
    textCls = 'text-slate-800 dark:text-slate-200 font-bold';
  }

  return (
    <td
      className={`border border-slate-300 dark:border-slate-700 text-center text-[10px] cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors p-0.5 select-none ${cellBg} ${textCls}`}
      style={{ width: 34, minWidth: 34, height: 32 }}
      onClick={() => setEditing(true)}
      title={`Hari ${day} | Unit: ${equipNo} | Jam Downtime: ${value || 0} jam (Klik untuk ubah)`}
    >
      {saving ? '…' : (value > 0 ? value : '')}
    </td>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
interface Props {
  equipments: Equipment[];
  targetJamOperasi: TargetJamOperasi[];
  targetJamHarian: TargetJamHarian[];
  onRefresh: () => void;
}

export const TargetJamOperasiView: React.FC<Props> = ({
  equipments,
  targetJamOperasi: initRows,
  targetJamHarian: initHarian,
  onRefresh,
}) => {
  // Default to September 2026 to match current operational period
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9);

  const [rows, setRows] = useState<TargetJamOperasi[]>(initRows);
  const [harian, setHarian] = useState<TargetJamHarian[]>(initHarian);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [savingCell, setSavingCell] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<TargetJamOperasi | null>(null);

  const [filterSection, setFilterSection] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarHoursPerUnit = daysInMonth * 24;

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load period data
  const loadPeriod = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getTargetJamOperasi(year, month);
      if (res.success) {
        setRows(res.targetJamOperasi || []);
        setHarian(res.targetJamHarian || []);
      }
    } catch {
      showToast('Gagal memuat data periode', 'err');
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadPeriod();
  }, [loadPeriod]);

  // Seed demo September 2026
  const handleSeedDemo = async () => {
    if (!window.confirm(`Sinkronkan rencana 1 bulan untuk seluruh unit armada aktif periode ${MONTH_NAMES[month - 1]} ${year}?`)) return;
    setSeeding(true);
    try {
      const res = await api.seedDemoTargetJam(year, month);
      if (res.success) {
        showToast(res.message || `Rencana 1 bulan ${MONTH_NAMES[month - 1]} ${year} berhasil disinkronkan!`);
        await loadPeriod();
        onRefresh();
      } else {
        showToast(res.message || 'Gagal memuat template', 'err');
      }
    } catch {
      showToast('Gagal memuat template rencana', 'err');
    } finally {
      setSeeding(false);
    }
  };

  // Save cell
  const handleSaveCell = async (equipNo: string, day: number, jam: number) => {
    const key = `${equipNo}-${day}`;
    setSavingCell(key);
    try {
      await api.saveJamHarian({
        equip_no: equipNo,
        plan_year: year,
        plan_month: month,
        plan_day: day,
        jam_rencana: jam
      });

      setHarian(prev => {
        const filtered = prev.filter(h => !(h.equip_no === equipNo && h.plan_year === year && h.plan_month === month && h.plan_day === day));
        if (jam > 0) {
          return [...filtered, { equip_no: equipNo, plan_year: year, plan_month: month, plan_day: day, jam_rencana: jam, downtime_type: jam === 24 ? 'BD' : 'PM' }];
        }
        return filtered;
      });
    } catch {
      showToast('Gagal menyimpan jam harian', 'err');
    } finally {
      setSavingCell(null);
    }
  };

  // Save row modal
  const handleSaveRow = async (data: any) => {
    try {
      const res = await api.savePlanAlatRow({ ...data, plan_year: year, plan_month: month });
      if (res.success) {
        showToast(res.message || 'Rencana 1 bulan unit tersimpan!');
        await loadPeriod();
      } else {
        showToast(res.message || 'Gagal simpan rencana unit', 'err');
      }
    } catch {
      showToast('Error koneksi API', 'err');
    }
  };

  // Delete row
  const handleDeleteRow = async (row: TargetJamOperasi) => {
    if (!window.confirm(`Hapus rencana unit ${row.equip_no} periode ${MONTH_NAMES[month - 1]} ${year}?`)) return;
    try {
      await api.deletePlanAlatRow(row.id!);
      showToast(`Data rencana ${row.equip_no} dihapus`);
      await loadPeriod();
    } catch {
      showToast('Gagal menghapus', 'err');
    }
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      if (filterSection !== 'ALL' && r.section !== filterSection) return false;
      if (filterStatus !== 'ALL') {
        const s = (r.status || '').toUpperCase();
        if (filterStatus === 'BD' && s !== 'BD' && s !== 'B/D') return false;
        if (filterStatus === 'RFU' && s !== 'RFU' && s !== 'READY') return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const no = (r.equip_no || '').toLowerCase();
        const m = (r.model || '').toLowerCase();
        const sec = (r.section || '').toLowerCase();
        if (!no.includes(q) && !m.includes(q) && !sec.includes(q)) return false;
      }
      return true;
    });
  }, [rows, filterSection, filterStatus, searchQuery]);

  // Calculations per unit
  const getJam = (equipNo: string, day: number): number => {
    const rec = harian.find(h =>
      h.equip_no === equipNo &&
      h.plan_year === year &&
      h.plan_month === month &&
      h.plan_day === day
    );
    return rec ? rec.jam_rencana : 0;
  };

  // Total jam downtime yang sudah dialokasikan di Gantt (H-1 s/d H-31)
  const getTotalGanttDowntime = (equipNo: string): number => {
    return harian
      .filter(h => h.equip_no === equipNo && h.plan_year === year && h.plan_month === month)
      .reduce((s, h) => s + (h.jam_rencana || 0), 0);
  };

  // Total rencana BD 1 bulan dari parameter: PM + Backlog + Midlife + PCR + Unscheduled
  const getTotalPlannedBD = (row: TargetJamOperasi): number => {
    return (row.downtime_pm || 0) +
      (row.downtime_backlog || 0) +
      (row.downtime_midlife || 0) +
      (row.downtime_pcr || 0) +
      (row.downtime_unscheduled || 0);
  };

  // Month navigation
  const prevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  };

  // ─── Fleet Statistics for 1-Month Plan ──────────────────────────────────────
  const totalFleetHours = rows.length * calendarHoursPerUnit;
  
  // Total jam rencana BD 1 bulan (akumulasi seluruh armada)
  const totalPlannedDowntimeFleet = rows.reduce((s, r) => s + getTotalPlannedBD(r), 0);
  
  // Total breakdown berdasarkan kategori
  const totalDowntimePm = rows.reduce((s, r) => s + (r.downtime_pm || 0), 0);
  const totalDowntimeBacklog = rows.reduce((s, r) => s + (r.downtime_backlog || 0), 0);
  const totalDowntimeMidlife = rows.reduce((s, r) => s + (r.downtime_midlife || 0), 0);
  const totalDowntimePcr = rows.reduce((s, r) => s + (r.downtime_pcr || 0), 0);
  const totalDowntimeUnsch = rows.reduce((s, r) => s + (r.downtime_unscheduled || 0), 0);

  // Target jam operasi armada (MoHH)
  const totalTargetOperatingHours = rows.reduce((s, r) => {
    const isBD = (r.status || '').toUpperCase() === 'BD' || (r.status || '').toUpperCase() === 'B/D';
    return s + (r.target_operating_hours ?? (isBD ? 0 : 500));
  }, 0);

  const avgTargetOperatingHours = rows.length > 0
    ? Math.round(totalTargetOperatingHours / rows.length)
    : 0;

  // Total jam yang sudah terdistribusi di kalender Gantt
  const totalFleetDowntime = harian
    .filter(h => h.plan_year === year && h.plan_month === month)
    .reduce((s, h) => s + (h.jam_rencana || 0), 0);

  const projectedFleetPA = totalFleetHours > 0
    ? (((totalFleetHours - totalFleetDowntime) / totalFleetHours) * 100).toFixed(1)
    : '100.0';

  const avgTargetPA = rows.length > 0
    ? (rows.reduce((s, r) => s + (r.target_pa ?? 88.0), 0) / rows.length).toFixed(1)
    : '88.0';

  const totalRFU = rows.filter(r => (r.status || '').toUpperCase() === 'RFU' || (r.status || '').toUpperCase() === 'READY').length;
  const totalBD = rows.filter(r => (r.status || '').toUpperCase() === 'BD' || (r.status || '').toUpperCase() === 'B/D').length;

  const totalPM250 = rows.filter(r => !!r.pm_250).length;
  const totalPM500 = rows.filter(r => !!r.pm_500).length;
  const totalPM1000 = rows.filter(r => !!r.pm_1000).length;
  const totalPM2000 = rows.filter(r => !!r.pm_2000).length;
  const totalPM4000 = rows.filter(r => !!r.pm_4000).length;

  // Persentase jam rencana BD yang telah diplot ke kalender harian
  const percentPlotted = totalPlannedDowntimeFleet > 0
    ? Math.min(100, Math.round((totalFleetDowntime / totalPlannedDowntimeFleet) * 100))
    : 100;

  // Export to CSV — Rencana 1 Bulan
  const handleExportCSV = () => {
    const headers = [
      'SECTION', 'UNIT NO', 'MODEL', 'STATUS', 'Est. HM AWAL',
      'JAM KALENDER', 'TARGET MOHH', 'TARGET PA (%)',
      'BD PM (JAM)', 'BD BACKLOG (JAM)', 'BD MIDLIFE (JAM)', 'BD PCS/PCR (JAM)', 'BD UNSCH (JAM)',
      'TOTAL RENCANA BD (JAM)',
      'PM 250', 'PM 500', 'PM 1000', 'PM 2000', 'PM 4000',
      ...dayArray.map(d => `D-${String(d).padStart(2, '0')}`),
      'TERJADWAL GANTT (JAM)', 'SELISIH BD (JAM)', 'PROYEKSI PA (%)'
    ];

    const csvRows = [headers.join(',')];

    filteredRows.forEach(r => {
      const isBD = (r.status || '').toUpperCase() === 'BD' || (r.status || '').toUpperCase() === 'B/D';
      const plannedBD = getTotalPlannedBD(r);
      const ganttDT = getTotalGanttDowntime(r.equip_no);
      const selisih = plannedBD - ganttDT;
      const paProj = calendarHoursPerUnit > 0
        ? (((calendarHoursPerUnit - ganttDT) / calendarHoursPerUnit) * 100).toFixed(1)
        : '100.0';

      const rowData = [
        `"${r.section || 'MINING'}"`,
        `"${r.equip_no}"`,
        `"${r.model || ''}"`,
        `"${r.status || 'RFU'}"`,
        r.est_hm || 0,
        calendarHoursPerUnit,
        r.target_operating_hours ?? (isBD ? 0 : 500),
        r.target_pa ?? (isBD ? 0 : 88.0),
        r.downtime_pm || 0,
        r.downtime_backlog || 0,
        r.downtime_midlife || 0,
        r.downtime_pcr || 0,
        r.downtime_unscheduled || 0,
        plannedBD,
        r.pm_250 ? 1 : 0,
        r.pm_500 ? 1 : 0,
        r.pm_1000 ? 1 : 0,
        r.pm_2000 ? 1 : 0,
        r.pm_4000 ? 1 : 0,
        ...dayArray.map(d => getJam(r.equip_no, d)),
        ganttDT,
        selisih,
        paProj
      ];
      csvRows.push(rowData.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rencana_1_Bulan_Target_Operasi_${MONTH_NAMES_SHORT[month - 1]}_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 print:p-0">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-xs font-bold transition-all ${
          toast.type === 'ok' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          {toast.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Target Jam Operasi & Rencana BD 1 Bulan
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    PERIODE {MONTH_NAMES_SHORT[month - 1].toUpperCase()} {year}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fokus rencana 1 bulan: target jam operasi armada (MoHH), alokasi jam breakdown (PM, Backlog, Midlife, PCS/PCR), dan distribusi kalender harian
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Month Nav */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 shadow-sm">
              <button onClick={prevMonth} className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 cursor-pointer text-slate-600 dark:text-slate-300 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 px-3 min-w-[120px] text-center">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <button onClick={nextMonth} className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 cursor-pointer text-slate-600 dark:text-slate-300 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Template Seed / Sync Button */}
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer transition-all shadow-sm"
              title="Sinkronkan rencana 1 bulan dengan data unit riil"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Menyinkronkan...' : 'Sinkronkan Rencana 1 Bulan'}
            </button>

            {/* Refresh */}
            <button
              onClick={loadPeriod}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              CSV
            </button>

            {/* Print */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              Print
            </button>

            {/* Add Unit Plan */}
            <button
              onClick={() => { setEditRow(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-blue-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Rencana Unit
            </button>
          </div>
        </div>

        {/* Filter Bar & Legend */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <input
              type="text"
              placeholder="Cari No Unit / Model / Section..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />

            {/* Filter Section */}
            <select
              value={filterSection}
              onChange={e => setFilterSection(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">— Semua Section —</option>
              {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="ALL">— Semua Status —</option>
              <option value="RFU">RFU (Ready)</option>
              <option value="BD">BD (Breakdown)</option>
            </select>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-700 inline-block border border-slate-400" />
              <span>24h (Full Breakdown/BD)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-200/80 dark:bg-slate-800 inline-block border border-slate-300" />
              <span>Servis PM / Backlog (3–16h)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300 inline-block" />
              <span>PM Event Berjadwal</span>
            </span>
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Info className="w-3 h-3" /> Klik sel kalender untuk ubah jam harian
            </span>
          </div>
        </div>
      </div>

      {/* Top KPI Cards (Fokus Rencana 1 Bulan: Target MoHH, Total Rencana BD & Breakdown Kategori) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
        {/* Card 1: Kesiapan Armada */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Armada & Kesiapan</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">{rows.length}</span>
            <span className="text-[11px] font-bold text-emerald-600">{totalRFU} RFU</span>
            <span className="text-[11px] font-bold text-rose-600">{totalBD} BD</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Kesiapan operasional aktif</p>
        </div>

        {/* Card 2: Target Jam Operasi (MoHH) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target MoHH Armada</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-blue-600">{formatNumber(totalTargetOperatingHours)}</span>
            <span className="text-xs font-bold text-slate-500">Jam</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Rata-rata: {avgTargetOperatingHours} Jam / Unit</p>
        </div>

        {/* Card 3: Total Rencana BD 1 Bulan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Rencana BD 1 Bln</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-rose-600">{formatNumber(totalPlannedDowntimeFleet)}</span>
            <span className="text-xs font-bold text-slate-500">Jam</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">PM + Backlog + Midlife + PCS</p>
        </div>

        {/* Card 4: Rincian Kategori Rencana BD */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Komposisi BD Rencana</p>
          <div className="text-[10.5px] font-black text-slate-700 dark:text-slate-300 mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
            <span>PM: <b className="text-blue-600">{totalDowntimePm}h</b></span>
            <span>BL: <b className="text-amber-600">{totalDowntimeBacklog}h</b></span>
            <span>ML: <b className="text-purple-600">{totalDowntimeMidlife}h</b></span>
            <span>PCS: <b className="text-teal-600">{totalDowntimePcr}h</b></span>
            <span>Unsch: <b className="text-rose-600">{totalDowntimeUnsch}h</b></span>
          </div>
        </div>

        {/* Card 5: Target PA vs Proyeksi Gantt */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target vs Proyeksi PA</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-emerald-600">{avgTargetPA}%</span>
            <span className="text-xs font-bold text-slate-400">Target</span>
            <span className="text-xs font-black text-blue-600">({projectedFleetPA}%)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Proyeksi ketersediaan fisik</p>
        </div>

        {/* Card 6: Alokasi Kalender Gantt */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Plotting Kalender</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">{totalFleetDowntime}</span>
            <span className="text-xs font-bold text-slate-400">/ {totalPlannedDowntimeFleet}h</span>
            <span className="text-[11px] font-bold text-emerald-600 ml-1">({percentPlotted}%)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Jam terdistribusi di Gantt</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-300 dark:border-slate-800 shadow-md overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/75 dark:bg-slate-900/75 backdrop-blur-sm z-40 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        <div className="overflow-x-auto overflow-y-auto max-h-[75vh] print:max-h-none print:overflow-visible">
          <table className="w-full border-collapse text-[11px]" style={{ minWidth: 1680 }}>
            {/* ── Table Header (Fokus Rencana 1 Bulan: No Next Service Clutter) ── */}
            <thead>
              {/* Row 1: Header Clusters */}
              <tr className="bg-[#2a303c] text-white text-[10px] font-black uppercase tracking-wider">
                {/* 1. IDENTITAS & BASELINE (Sticky Left) */}
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center sticky left-0 z-30 bg-[#2a303c]" style={{ minWidth: 78 }}>
                  SECTION
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center sticky left-[78px] z-30 bg-[#2a303c]" style={{ minWidth: 85 }}>
                  UNIT NO
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center sticky left-[163px] z-30 bg-[#2a303c]" style={{ minWidth: 95 }}>
                  MODEL
                </th>
                <th rowSpan={2} className="border border-slate-600 px-1 py-2 text-center" style={{ minWidth: 60 }}>
                  STATUS
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center" style={{ minWidth: 80 }}>
                  Est. HM<br />
                  <span className="text-[9px] font-normal opacity-80">01-{MONTH_NAMES_SHORT[month - 1]}</span>
                </th>

                {/* 2. TARGET OPERASI 1 BULAN (Bulanan) */}
                <th colSpan={3} className="border border-slate-600 px-2 py-1.5 text-center bg-blue-900/90">
                  TARGET OPERASI 1 BULAN
                </th>

                {/* 3. RENCANA DOWNTIME / BD 1 BULAN (JAM) — Fokus Utama */}
                <th colSpan={6} className="border border-slate-600 px-2 py-1.5 text-center bg-rose-900/90 text-rose-100">
                  RENCANA DOWNTIME / BD BULAN INI (JAM)
                </th>

                {/* 4. PM EVENT BULAN INI (Checklist 5 Kelipatan) */}
                <th colSpan={5} className="border border-slate-600 px-2 py-1.5 text-center bg-amber-900/90">
                  PM EVENT
                </th>

                {/* 5. DISTRIBUSI KALENDER HARIAN GANTT */}
                <th colSpan={daysInMonth} className="border border-slate-600 px-2 py-1.5 text-center bg-[#1e293b]">
                  DISTRIBUSI GANTT HARIAN — {MONTH_NAMES_SHORT[month - 1].toUpperCase()} {year}
                </th>

                {/* 6. REKAPITULASI & SINKRONISASI KALENDER */}
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center bg-slate-800" style={{ minWidth: 65 }}>
                  TERJADWAL<br/>GANTT
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center bg-slate-800" style={{ minWidth: 60 }}>
                  SELISIH<br/>BD (h)
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center bg-slate-800" style={{ minWidth: 55 }}>
                  PROYEKSI<br/>PA (%)
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center bg-slate-800 print:hidden" style={{ minWidth: 60 }}>
                  AKSI
                </th>
              </tr>

              {/* Row 2: Sub-headers */}
              <tr className="bg-[#1e293b] text-white text-[9px] font-bold uppercase tracking-wide">
                {/* Sub Target Operasi */}
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-blue-900/80" style={{ minWidth: 55 }}>KALENDER</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-blue-900/80" style={{ minWidth: 65 }}>MOHH PLAN</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-blue-900/80" style={{ minWidth: 55 }}>TARGET PA</th>

                {/* Sub Rencana BD 1 Bulan (PM, Backlog, Midlife, PCS/PCR, Unscheduled, Total BD) */}
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-rose-900/80" style={{ minWidth: 42 }}>BD PM</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-rose-900/80" style={{ minWidth: 45 }}>BACKLOG</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-rose-900/80" style={{ minWidth: 45 }}>MIDLIFE</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-rose-900/80" style={{ minWidth: 45 }}>PCS/PCR</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-rose-900/80" style={{ minWidth: 45 }}>UNSCH</th>
                <th className="border border-slate-600 px-1.5 py-1.5 text-center bg-rose-950 font-black text-rose-200" style={{ minWidth: 62 }}>TOTAL BD</th>

                {/* Sub PM Event */}
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/80" style={{ minWidth: 30 }}>250</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/80" style={{ minWidth: 30 }}>500</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/80" style={{ minWidth: 35 }}>1000</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/80" style={{ minWidth: 35 }}>2000</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/80" style={{ minWidth: 35 }}>4000</th>

                {/* Day Columns */}
                {dayArray.map(d => (
                  <th
                    key={d}
                    className={`border border-slate-600 px-0 py-1 text-center text-[9px] ${
                      isToday(year, month, d)
                        ? 'bg-amber-400 text-slate-900 font-black'
                        : isWeekend(year, month, d)
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-800 text-slate-200'
                    }`}
                    style={{ width: 34, minWidth: 34 }}
                  >
                    <div>{String(d).padStart(2, '0')}</div>
                    <div className="text-[7px] opacity-75">{getDayName(year, month, d)}</div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Table Body ── */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={19 + daysInMonth} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                      <p className="font-bold text-slate-500 dark:text-slate-400">Belum ada rencana jadwal unit untuk periode ini</p>
                      <p className="text-xs text-slate-400">Klik tombol di bawah untuk menyinkronkan seluruh unit armada aktif</p>
                      <button
                        onClick={handleSeedDemo}
                        className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition-all"
                      >
                        <Sparkles className="w-4 h-4" /> Sinkronkan Rencana 1 Bulan Seluruh Unit
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const statusStr = (row.status || 'RFU').toUpperCase();
                  const isBD = statusStr === 'BD' || statusStr === 'B/D';
                  
                  // Total rencana BD 1 bulan
                  const plannedBD = getTotalPlannedBD(row);
                  
                  // Total downtime yang teralokasi di kalender Gantt
                  const ganttDT = getTotalGanttDowntime(row.equip_no);
                  
                  // Selisih antara Rencana BD dengan apa yang sudah diplot di kalender
                  const selisihBD = plannedBD - ganttDT;

                  // Target jam jalan MoHH
                  const targetMoHH = row.target_operating_hours ?? (isBD ? 0 : 500);

                  // Target PA dicanangkan
                  const targetPA = row.target_pa ?? (isBD ? 0 : 88.0);

                  // Proyeksi PA aktual dari distribusi Gantt
                  const paPercent = calendarHoursPerUnit > 0
                    ? Math.max(0, ((calendarHoursPerUnit - ganttDT) / calendarHoursPerUnit) * 100).toFixed(1)
                    : '100.0';

                  const rowBg = idx % 2 === 0
                    ? 'bg-white dark:bg-slate-900'
                    : 'bg-slate-50/70 dark:bg-slate-800/40';

                  return (
                    <tr key={row.id || row.equip_no} className={`${rowBg} hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors`}>
                      {/* SECTION (Sticky Left 1) */}
                      <td className={`border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-center font-bold text-slate-700 dark:text-slate-200 sticky left-0 z-20 ${rowBg}`}>
                        <span className="text-[10px] uppercase">{row.section || 'MINING'}</span>
                      </td>

                      {/* UNIT NO (Sticky Left 2) */}
                      <td className={`border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-center font-black text-slate-900 dark:text-white sticky left-[78px] z-20 ${rowBg}`}>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isBD ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                          <span className="tracking-tight">{row.equip_no}</span>
                        </div>
                      </td>

                      {/* MODEL (Sticky Left 3) */}
                      <td className={`border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-center font-semibold text-slate-600 dark:text-slate-400 sticky left-[163px] z-20 ${rowBg}`}>
                        {row.model || '-'}
                      </td>

                      {/* STATUS */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                          isBD
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200'
                        }`}>
                          {statusStr}
                        </span>
                      </td>

                      {/* Est. HM AWAL */}
                      <td className="border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-center font-bold text-slate-800 dark:text-slate-200">
                        {formatNumber(row.est_hm || (equipments.find(e => (e.equip_no || e.no_unit) === row.equip_no)?.last_hm || 0))}
                      </td>

                      {/* TARGET OPERASI 1 BULAN: Kalender, MoHH Plan, Target PA */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 text-center font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-850/40">
                        {calendarHoursPerUnit}h
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 text-center font-black text-blue-700 dark:text-blue-300 bg-blue-50/30 dark:bg-blue-950/20">
                        {formatNumber(targetMoHH)}h
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 text-center font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-950/20">
                        {targetPA}%
                      </td>

                      {/* RENCANA DOWNTIME / BD 1 BULAN (JAM): PM, Backlog, Midlife, PCS, Unsch, Total BD */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-bold text-slate-800 dark:text-slate-200 bg-rose-50/20 dark:bg-rose-950/10">
                        {row.downtime_pm ? `${row.downtime_pm}` : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-bold text-amber-700 dark:text-amber-300 bg-rose-50/20 dark:bg-rose-950/10">
                        {row.downtime_backlog ? `${row.downtime_backlog}` : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-bold text-purple-700 dark:text-purple-300 bg-rose-50/20 dark:bg-rose-950/10">
                        {row.downtime_midlife ? `${row.downtime_midlife}` : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-bold text-teal-700 dark:text-teal-300 bg-rose-50/20 dark:bg-rose-950/10">
                        {row.downtime_pcr ? `${row.downtime_pcr}` : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-bold text-rose-700 dark:text-rose-400 bg-rose-50/20 dark:bg-rose-950/10">
                        {row.downtime_unscheduled ? `${row.downtime_unscheduled}` : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-2 py-1 text-center font-black text-rose-700 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-950/40">
                        {plannedBD}h
                      </td>

                      {/* PM EVENT FLAGS (5 Columns - Pink highlight when scheduled) */}
                      {['pm_250', 'pm_500', 'pm_1000', 'pm_2000', 'pm_4000'].map(key => {
                        const isScheduled = !!(row as any)[key];
                        return (
                          <td
                            key={key}
                            className={`border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-black select-none ${
                              isScheduled
                                ? 'bg-[#fee2e2] text-rose-900 dark:bg-rose-950/60 dark:text-rose-200'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          >
                            {isScheduled ? '1' : ''}
                          </td>
                        );
                      })}

                      {/* GANTT DAY CELLS (H-1 s/d H-30/31) */}
                      {dayArray.map(d => (
                        <JamCell
                          key={d}
                          equipNo={row.equip_no}
                          day={d}
                          value={getJam(row.equip_no, d)}
                          onSave={handleSaveCell}
                          saving={savingCell === `${row.equip_no}-${d}`}
                        />
                      ))}

                      {/* TERJADWAL GANTT (TOTAL DOWNTIME DI KALENDER) */}
                      <td className="border border-slate-300 dark:border-slate-700 px-2 py-1 text-center font-black text-slate-900 dark:text-white bg-slate-100/70 dark:bg-slate-800/60">
                        {ganttDT}h
                      </td>

                      {/* SELISIH BD: Rencana vs Terjadwal */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          selisihBD === 0
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
                            : selisihBD > 0
                            ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60'
                            : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60'
                        }`}>
                          {selisihBD === 0 ? '0h' : selisihBD > 0 ? `+${selisihBD}h` : `${selisihBD}h`}
                        </span>
                      </td>

                      {/* PROYEKSI PA (%) */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          Number(paPercent) >= 88
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
                            : Number(paPercent) >= 80
                            ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60'
                            : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60'
                        }`}>
                          {paPercent}%
                        </span>
                      </td>

                      {/* AKSI */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => { setEditRow(row); setModalOpen(true); }}
                            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
                            title="Edit Rencana 1 Bulan Unit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row)}
                            className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            title="Hapus Rencana Unit"
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

            {/* ── Table Footer Totals ── */}
            {filteredRows.length > 0 && (
              <tfoot>
                <tr className="bg-[#2a303c] text-white text-[10px] font-black uppercase">
                  {/* Sticky Footer Label */}
                  <td colSpan={5} className="border border-slate-600 px-3 py-2 text-right sticky left-0 z-30 bg-[#2a303c]">
                    TOTAL FLEET PLAN ({filteredRows.length} UNIT)
                  </td>

                  {/* Totals Target Operasi */}
                  <td className="border border-slate-600 px-1 py-2 text-center text-slate-300">
                    {formatNumber(filteredRows.length * calendarHoursPerUnit)}h
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-blue-300">
                    {formatNumber(filteredRows.reduce((s, r) => s + (r.target_operating_hours ?? 500), 0))}h
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-emerald-300">
                    {(filteredRows.reduce((s, r) => s + (r.target_pa ?? 88.0), 0) / (filteredRows.length || 1)).toFixed(1)}%
                  </td>

                  {/* Totals Rencana BD 1 Bulan */}
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-200">
                    {filteredRows.reduce((s, r) => s + (r.downtime_pm || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-amber-200">
                    {filteredRows.reduce((s, r) => s + (r.downtime_backlog || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-purple-200">
                    {filteredRows.reduce((s, r) => s + (r.downtime_midlife || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-teal-200">
                    {filteredRows.reduce((s, r) => s + (r.downtime_pcr || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">
                    {filteredRows.reduce((s, r) => s + (r.downtime_unscheduled || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1.5 py-2 text-center font-black text-rose-300 bg-rose-950/80">
                    {filteredRows.reduce((s, r) => s + getTotalPlannedBD(r), 0)}h
                  </td>

                  {/* Totals PM Event Counts */}
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM250}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM500}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM1000}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM2000}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM4000}</td>

                  {/* Day Columns Totals */}
                  {dayArray.map(d => {
                    const dayTotal = filteredRows.reduce((s, r) => s + getJam(r.equip_no, d), 0);
                    return (
                      <td key={d} className="border border-slate-600 px-0 py-2 text-center text-[9px]">
                        {dayTotal > 0 ? dayTotal : ''}
                      </td>
                    );
                  })}

                  {/* Total Terjadwal Gantt */}
                  <td className="border border-slate-600 px-2 py-2 text-center text-slate-100 font-black">
                    {filteredRows.reduce((s, r) => s + getTotalGanttDowntime(r.equip_no), 0)}h
                  </td>

                  {/* Total Selisih BD */}
                  <td className="border border-slate-600 px-1 py-2 text-center font-black text-amber-300">
                    {filteredRows.reduce((s, r) => s + (getTotalPlannedBD(r) - getTotalGanttDowntime(r.equip_no)), 0)}h
                  </td>

                  {/* Fleet Projected PA % */}
                  <td className="border border-slate-600 px-1 py-2 text-center font-black text-emerald-300">
                    {projectedFleetPA}%
                  </td>

                  <td className="border border-slate-600 px-1 py-2 text-center print:hidden">-</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modal Dialog (Rencana 1 Bulan) */}
      <ModalForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveRow}
        editData={editRow}
        equipments={equipments}
        year={year}
        month={month}
      />
    </div>
  );
};

export default TargetJamOperasiView;
