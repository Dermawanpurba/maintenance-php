import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Calendar, Plus, RefreshCw, Printer, ChevronLeft, ChevronRight,
  Trash2, X, Save, Edit3, CheckCircle, AlertCircle, Clock, Info,
  Filter, Download, Wrench, ShieldCheck, AlertTriangle, Sparkles,
  Layers, HardHat, FileSpreadsheet, Eye
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
const PM_TYPES_LIST = ['250', '500', '1000', '2000', '4000'];
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

function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const m = MONTH_NAMES_SHORT[d.getMonth()];
    const yr = String(d.getFullYear()).slice(-2);
    return `${day}-${m}-${yr}`;
  } catch {
    return dateStr;
  }
}

// ─── Modal Form (Tambah / Edit Baris) ─────────────────────────────────────────
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
  const [form, setForm] = useState<any>({
    equip_no: '',
    section: 'MINING',
    model: '',
    est_hm: 0,
    est_hm_date: `01-${MONTH_NAMES_SHORT[month - 1]}-${String(year).slice(-2)}`,
    status: 'RFU',
    next_service_hours_due: 0,
    next_service_hours_due_2: 0,
    next_service_type: '250',
    next_service_type_2: '500',
    next_service_date: '',
    next_service_date_2: '',
    pm_250: 0, pm_500: 0, pm_1000: 0, pm_2000: 0, pm_4000: 0,
    downtime_pm: 0, downtime_backlog: 0, downtime_midlife: 0, downtime_pcr: 0,
    plan_year: year,
    plan_month: month,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({ ...editData, plan_year: year, plan_month: month });
    } else {
      setForm({
        equip_no: '',
        section: 'MINING',
        model: '',
        est_hm: 0,
        est_hm_date: `01-${MONTH_NAMES_SHORT[month - 1]}-${String(year).slice(-2)}`,
        status: 'RFU',
        next_service_hours_due: 0,
        next_service_hours_due_2: 0,
        next_service_type: '250',
        next_service_type_2: '500',
        next_service_date: '',
        next_service_date_2: '',
        pm_250: 0, pm_500: 0, pm_1000: 0, pm_2000: 0, pm_4000: 0,
        downtime_pm: 0, downtime_backlog: 0, downtime_midlife: 0, downtime_pcr: 0,
        plan_year: year,
        plan_month: month,
      });
    }
  }, [editData, isOpen, year, month]);

  const handleEquipChange = (equipNo: string) => {
    const eq = equipments.find(e => (e.equip_no || e.no_unit) === equipNo);
    const hm = Number(eq?.last_hm || 0);
    const due1 = Math.ceil((hm + 1) / 250) * 250;
    const due2 = due1 + 250;

    const calcType = (due: number) => {
      if (due % 4000 === 0) return '4000';
      if (due % 2000 === 0) return '2000';
      if (due % 1000 === 0) return '1000';
      if (due % 500 === 0) return '500';
      return '250';
    };

    setForm((p: any) => ({
      ...p,
      equip_no: equipNo,
      model: eq?.model || p.model,
      status: eq?.status || p.status,
      est_hm: hm,
      next_service_hours_due: due1,
      next_service_hours_due_2: due2,
      next_service_type: calcType(due1),
      next_service_type_2: calcType(due2),
    }));
  };

  const handleAutoCalc = () => {
    const hm = parseFloat(form.est_hm) || 0;
    const due1 = Math.ceil((hm + 1) / 250) * 250;
    const due2 = due1 + 250;

    const calcType = (due: number) => {
      if (due % 4000 === 0) return '4000';
      if (due % 2000 === 0) return '2000';
      if (due % 1000 === 0) return '1000';
      if (due % 500 === 0) return '500';
      return '250';
    };

    const type1 = calcType(due1);
    const type2 = calcType(due2);

    setForm((p: any) => ({
      ...p,
      next_service_hours_due: due1,
      next_service_hours_due_2: due2,
      next_service_type: type1,
      next_service_type_2: type2,
      pm_250: type1 === '250' ? 1 : 0,
      pm_500: type1 === '500' ? 1 : 0,
      pm_1000: type1 === '1000' ? 1 : 0,
      pm_2000: type1 === '2000' ? 1 : 0,
      pm_4000: type1 === '4000' ? 1 : 0,
    }));
  };

  const handleSave = async () => {
    if (!form.equip_no) return;
    setSaving(true);
    try {
      await onSave(form);
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
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {editData ? `Edit Schedule Unit: ${editData.equip_no}` : 'Tambah Schedule Service Unit Baru'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Periode: {MONTH_NAMES[month - 1]} {year} — WOSys Maintenance System
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Unit & Section & Model */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className={LabelCls}>Section</label>
              <select className={InputCls} value={form.section} onChange={e => setForm((p: any) => ({ ...p, section: e.target.value }))}>
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={LabelCls}>Model</label>
              <input type="text" className={InputCls} value={form.model} onChange={e => setForm((p: any) => ({ ...p, model: e.target.value }))} placeholder="D85ESS-2" />
            </div>
          </div>

          {/* Est HM, Est HM Date & Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className={LabelCls}>Est. HM Awal Bulan</label>
              <input type="number" className={InputCls} value={form.est_hm} onChange={e => setForm((p: any) => ({ ...p, est_hm: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label className={LabelCls}>Ref. Tanggal HM</label>
              <input type="text" className={InputCls} value={form.est_hm_date || ''} onChange={e => setForm((p: any) => ({ ...p, est_hm_date: e.target.value }))} placeholder="01-Jun-24" />
            </div>
            <div>
              <label className={LabelCls}>Status Unit</label>
              <select className={InputCls} value={form.status} onChange={e => setForm((p: any) => ({ ...p, status: e.target.value }))}>
                {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Next Service Section */}
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Next Service Planning (Dual Horizon)
              </span>
              <button
                type="button"
                onClick={handleAutoCalc}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-50 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-amber-500" /> Auto-Hitung 250 Jam
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service 1 */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/60 space-y-2">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Service 1 (Terdekat)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={LabelCls}>Hours Due</label>
                    <input type="number" className={InputCls} value={form.next_service_hours_due} onChange={e => setForm((p: any) => ({ ...p, next_service_hours_due: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className={LabelCls}>Type</label>
                    <select className={InputCls} value={form.next_service_type} onChange={e => setForm((p: any) => ({ ...p, next_service_type: e.target.value }))}>
                      {PM_TYPES_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LabelCls}>Tanggal</label>
                    <input type="date" className={InputCls} value={form.next_service_date || ''} onChange={e => setForm((p: any) => ({ ...p, next_service_date: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Service 2 */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/60 space-y-2">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Service 2 (Berikutnya)</p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={LabelCls}>Hours Due 2</label>
                    <input type="number" className={InputCls} value={form.next_service_hours_due_2} onChange={e => setForm((p: any) => ({ ...p, next_service_hours_due_2: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className={LabelCls}>Type 2</label>
                    <select className={InputCls} value={form.next_service_type_2} onChange={e => setForm((p: any) => ({ ...p, next_service_type_2: e.target.value }))}>
                      {PM_TYPES_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={LabelCls}>Tanggal 2</label>
                    <input type="date" className={InputCls} value={form.next_service_date_2 || ''} onChange={e => setForm((p: any) => ({ ...p, next_service_date_2: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PM Type Flags */}
          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/50">
            <p className="text-[10px] font-black text-rose-700 dark:text-rose-300 uppercase tracking-wider mb-2.5">
              PM Type Scheduled Bulan Ini (Nilai 1 = Berjadwal)
            </p>
            <div className="grid grid-cols-5 gap-3">
              {['250', '500', '1000', '2000', '4000'].map(type => {
                const key = `pm_${type}`;
                const isChecked = !!(form as any)[key];
                return (
                  <label key={type} className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                    isChecked
                      ? 'bg-rose-100 border-rose-300 text-rose-800 dark:bg-rose-900/40 dark:border-rose-700 dark:text-rose-200 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    <span className="text-xs">{type}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.checked ? 1 : 0 }))}
                      className="w-4 h-4 rounded accent-rose-600 cursor-pointer"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Planned Downtime Allocation */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Estimasi Total Jam Downtime Bulan Ini (Jam)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className={LabelCls}>PM Servis</label>
                <input type="number" step="0.5" className={InputCls} value={form.downtime_pm} onChange={e => setForm((p: any) => ({ ...p, downtime_pm: parseFloat(e.target.value) || 0 }))} placeholder="6" />
              </div>
              <div>
                <label className={LabelCls}>Backlog Defect</label>
                <input type="number" step="0.5" className={InputCls} value={form.downtime_backlog} onChange={e => setForm((p: any) => ({ ...p, downtime_backlog: parseFloat(e.target.value) || 0 }))} placeholder="0" />
              </div>
              <div>
                <label className={LabelCls}>Midlife Overhaul</label>
                <input type="number" step="0.5" className={InputCls} value={form.downtime_midlife} onChange={e => setForm((p: any) => ({ ...p, downtime_midlife: parseFloat(e.target.value) || 0 }))} placeholder="0" />
              </div>
              <div>
                <label className={LabelCls}>PCR Component</label>
                <input type="number" step="0.5" className={InputCls} value={form.downtime_pcr} onChange={e => setForm((p: any) => ({ ...p, downtime_pcr: parseFloat(e.target.value) || 0 }))} placeholder="0" />
              </div>
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
            {saving ? 'Menyimpan...' : 'Simpan Schedule'}
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

  // Styling identical to the operational spreadsheet:
  // 24 = Full day breakdown (solid slate-300/dark:slate-700 block)
  // 3, 5, 6, 12, 17 = PM service downtime (light slate with bold text)
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
  // Default to June 2024 to match user spreadsheet directly
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState(6);

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

  // Seed demo June 2024
  const handleSeedDemo = async () => {
    if (!window.confirm('Muat 14 unit data riil template spreadsheet Juni 2024? Data akan disinkronkan ke database.')) return;
    setSeeding(true);
    try {
      const res = await api.seedDemoTargetJam(year, month);
      if (res.success) {
        showToast(res.message || 'Data template Juni 2024 berhasil dimuat!');
        await loadPeriod();
        onRefresh();
      } else {
        showToast(res.message || 'Gagal memuat template', 'err');
      }
    } catch {
      showToast('Gagal memuat template demo', 'err');
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
        showToast(res.message || 'Schedule unit tersimpan!');
        await loadPeriod();
      } else {
        showToast(res.message || 'Gagal simpan schedule', 'err');
      }
    } catch {
      showToast('Error koneksi API', 'err');
    }
  };

  // Delete row
  const handleDeleteRow = async (row: TargetJamOperasi) => {
    if (!window.confirm(`Hapus jadwal unit ${row.equip_no} periode ${MONTH_NAMES[month - 1]} ${year}?`)) return;
    try {
      await api.deletePlanAlatRow(row.id!);
      showToast(`Data ${row.equip_no} dihapus`);
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
        if (filterStatus === 'RFU' && s !== 'RFU') return false;
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

  const getTotalDowntime = (equipNo: string): number => {
    return harian
      .filter(h => h.equip_no === equipNo && h.plan_year === year && h.plan_month === month)
      .reduce((s, h) => s + (h.jam_rencana || 0), 0);
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

  // Fleet Statistics
  const totalFleetHours = rows.length * daysInMonth * 24;
  const totalFleetDowntime = harian
    .filter(h => h.plan_year === year && h.plan_month === month)
    .reduce((s, h) => s + (h.jam_rencana || 0), 0);
  const projectedFleetPA = totalFleetHours > 0
    ? (((totalFleetHours - totalFleetDowntime) / totalFleetHours) * 100).toFixed(1)
    : '100.0';

  const totalRFU = rows.filter(r => (r.status || '').toUpperCase() === 'RFU').length;
  const totalBD = rows.filter(r => (r.status || '').toUpperCase() === 'BD' || (r.status || '').toUpperCase() === 'B/D').length;

  const totalPM250 = rows.filter(r => !!r.pm_250).length;
  const totalPM500 = rows.filter(r => !!r.pm_500).length;
  const totalPM1000 = rows.filter(r => !!r.pm_1000).length;
  const totalPM2000 = rows.filter(r => !!r.pm_2000).length;
  const totalPM4000 = rows.filter(r => !!r.pm_4000).length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'SECTION', 'UNIT NO', 'MODEL', 'Est. HM', 'STATUS',
      'NEXT SERVICE HRS DUE 1', 'NEXT SERVICE HRS DUE 2',
      'NEXT SERVICE TYPE 1', 'NEXT SERVICE TYPE 2',
      'NEXT SERVICE DATE 1', 'NEXT SERVICE DATE 2',
      'PM 250', 'PM 500', 'PM 1000', 'PM 2000', 'PM 4000',
      'DOWNTIME PM', 'DOWNTIME BACKLOG', 'DOWNTIME MIDLIFE', 'DOWNTIME PCR',
      ...dayArray.map(d => `D-${d}`),
      'TOTAL DOWNTIME', 'PA PROJ (%)'
    ];

    const csvRows = [headers.join(',')];

    filteredRows.forEach(r => {
      const dt = getTotalDowntime(r.equip_no);
      const avail = daysInMonth * 24;
      const pa = avail > 0 ? (((avail - dt) / avail) * 100).toFixed(1) : '100.0';

      const rowData = [
        `"${r.section || ''}"`,
        `"${r.equip_no}"`,
        `"${r.model || ''}"`,
        r.est_hm || 0,
        `"${r.status || 'RFU'}"`,
        r.next_service_hours_due || 0,
        r.next_service_hours_due_2 || 0,
        `"${r.next_service_type || ''}"`,
        `"${r.next_service_type_2 || ''}"`,
        `"${r.next_service_date || ''}"`,
        `"${r.next_service_date_2 || ''}"`,
        r.pm_250 ? 1 : 0,
        r.pm_500 ? 1 : 0,
        r.pm_1000 ? 1 : 0,
        r.pm_2000 ? 1 : 0,
        r.pm_4000 ? 1 : 0,
        r.downtime_pm || 0,
        r.downtime_backlog || 0,
        r.downtime_midlife || 0,
        r.downtime_pcr || 0,
        ...dayArray.map(d => getJam(r.equip_no, d)),
        dt,
        pa
      ];
      csvRows.push(rowData.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Schedule_Service_PM_${MONTH_NAMES_SHORT[month - 1]}_${year}.csv`;
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
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Schedule Service (PM) & Downtime Gantt Matrix
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    PERIODE {MONTH_NAMES_SHORT[month - 1].toUpperCase()} {year}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Rencana servis berkala kelipatan 250 Jam, alokasi jam downtime, dan kalender kesiapan armada tambang
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

            {/* Template Seed Demo Button (Direct match with screenshot) */}
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer transition-all shadow-sm"
              title="Muat 14 data riil screenshot Juni 2024"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Memuat Template...' : 'Muat Data Template Juni 2024'}
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

            {/* Add Unit */}
            <button
              onClick={() => { setEditRow(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-blue-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Unit
            </button>
          </div>
        </div>

        {/* Filter Bar */}
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
              <span>24h (Breakdown/BD)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-200/80 dark:bg-slate-800 inline-block border border-slate-300" />
              <span>Jam Servis PM (3–17h)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300 inline-block" />
              <span>PM Scheduled (Pink)</span>
            </span>
            <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Info className="w-3 h-3" /> Klik sel untuk ubah jam
            </span>
          </div>
        </div>
      </div>

      {/* Top KPI Cards (Fleet Availability & PM Counts) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 print:hidden">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Armada</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">{rows.length}</span>
            <span className="text-[11px] font-bold text-emerald-600">{totalRFU} RFU</span>
            <span className="text-[11px] font-bold text-rose-600">{totalBD} BD</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Proyeksi PA Armada</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-black ${
              Number(projectedFleetPA) >= 90 ? 'text-emerald-600' : Number(projectedFleetPA) >= 80 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {projectedFleetPA}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Physical Avail.</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total PM Berjadwal</p>
          <p className="text-xl font-black text-blue-600 mt-1">
            {totalPM250 + totalPM500 + totalPM1000 + totalPM2000 + totalPM4000} <span className="text-xs font-bold text-slate-500">Event</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Distribusi PM Type</p>
          <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 mt-1.5 flex gap-2">
            <span>250: <b className="text-blue-600">{totalPM250}</b></span>
            <span>500: <b className="text-indigo-600">{totalPM500}</b></span>
            <span>1K: <b className="text-amber-600">{totalPM1000}</b></span>
            <span>2K: <b className="text-purple-600">{totalPM2000}</b></span>
            <span>4K: <b className="text-rose-600">{totalPM4000}</b></span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Jam Downtime</p>
          <p className="text-xl font-black text-rose-600 mt-1">
            {totalFleetDowntime} <span className="text-xs font-bold text-slate-500">Jam</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Jam Operasi Terencana</p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {formatNumber(Math.max(0, totalFleetHours - totalFleetDowntime))} <span className="text-xs font-bold text-slate-500">Jam</span>
          </p>
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
          <table className="w-full border-collapse text-[11px]" style={{ minWidth: 1600 }}>
            {/* ── Table Header (Exact 2-Row Match with Spreadsheet) ── */}
            <thead>
              {/* Row 1 */}
              <tr className="bg-[#2a303c] text-white text-[10px] font-black uppercase tracking-wider">
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center sticky left-0 z-30 bg-[#2a303c]" style={{ minWidth: 80 }}>
                  SECTION
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center sticky left-[80px] z-30 bg-[#2a303c]" style={{ minWidth: 85 }}>
                  UNIT NO
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center sticky left-[165px] z-30 bg-[#2a303c]" style={{ minWidth: 95 }}>
                  MODEL
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center" style={{ minWidth: 80 }}>
                  Est. HM<br />
                  <span className="text-[9px] font-normal opacity-80">{MONTH_NAMES_SHORT[month - 1]}-{String(year).slice(-2)}</span>
                </th>
                <th rowSpan={2} className="border border-slate-600 px-1 py-2 text-center" style={{ minWidth: 60 }}>
                  STATUS
                </th>
                {/* NEXT SERVICE (6 Columns) */}
                <th colSpan={6} className="border border-slate-600 px-2 py-1.5 text-center bg-slate-700">
                  NEXT SERVICE
                </th>
                {/* PM TYPE (5 Columns) */}
                <th colSpan={5} className="border border-slate-600 px-2 py-1.5 text-center bg-amber-900/90">
                  PM TYPE
                </th>
                {/* DOWNTIME SUMMARY (4 Columns) */}
                <th rowSpan={2} className="border border-slate-600 px-1 py-1 text-center bg-slate-800 text-[9px]" style={{ minWidth: 36 }}>
                  PM
                </th>
                <th rowSpan={2} className="border border-slate-600 px-1 py-1 text-center bg-slate-800 text-[9px]" style={{ minWidth: 50 }}>
                  BACK<br/>LOG
                </th>
                <th rowSpan={2} className="border border-slate-600 px-1 py-1 text-center bg-slate-800 text-[9px]" style={{ minWidth: 45 }}>
                  MID<br/>LIFE
                </th>
                <th rowSpan={2} className="border border-slate-600 px-1 py-1 text-center bg-slate-800 text-[9px]" style={{ minWidth: 38 }}>
                  PCR
                </th>
                {/* PERIODE CALENDAR */}
                <th colSpan={daysInMonth} className="border border-slate-600 px-2 py-1.5 text-center bg-[#1e293b]">
                  PERIODE {MONTH_NAMES_SHORT[month - 1].toUpperCase()} {year}
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center bg-slate-800" style={{ minWidth: 60 }}>
                  TOTAL<br/>DT
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center bg-slate-800" style={{ minWidth: 55 }}>
                  PA<br/>(%)
                </th>
                <th rowSpan={2} className="border border-slate-600 px-2 py-2 text-center bg-slate-800 print:hidden" style={{ minWidth: 60 }}>
                  AKSI
                </th>
              </tr>

              {/* Row 2: Sub-headers */}
              <tr className="bg-[#1e293b] text-white text-[9px] font-bold uppercase tracking-wide">
                {/* Sub NEXT SERVICE */}
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-slate-700" style={{ minWidth: 60 }}>HRS DUE</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-slate-700" style={{ minWidth: 60 }}>DUE 2</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-slate-700" style={{ minWidth: 45 }}>TYPE</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-slate-700" style={{ minWidth: 45 }}>TYPE 2</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-slate-700" style={{ minWidth: 70 }}>NEXT DATE</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-slate-700" style={{ minWidth: 70 }}>DATE 2</th>
                {/* Sub PM TYPE */}
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/90" style={{ minWidth: 32 }}>250</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/90" style={{ minWidth: 32 }}>500</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/90" style={{ minWidth: 35 }}>1000</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/90" style={{ minWidth: 35 }}>2000</th>
                <th className="border border-slate-600 px-1 py-1.5 text-center bg-amber-900/90" style={{ minWidth: 35 }}>4000</th>
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
                  <td colSpan={23 + daysInMonth} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                      <p className="font-bold text-slate-500 dark:text-slate-400">Belum ada jadwal unit untuk periode ini</p>
                      <p className="text-xs text-slate-400">Klik tombol di bawah untuk memuat data template riil Juni 2024</p>
                      <button
                        onClick={handleSeedDemo}
                        className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-2xl shadow-md cursor-pointer transition-all"
                      >
                        <Sparkles className="w-4 h-4" /> Muat 14 Unit Template Screenshot Juni 2024
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const statusStr = (row.status || 'RFU').toUpperCase();
                  const isBD = statusStr === 'BD' || statusStr === 'B/D';
                  const dtTotal = getTotalDowntime(row.equip_no);
                  const calendarHours = daysInMonth * 24;
                  const paPercent = calendarHours > 0
                    ? Math.max(0, ((calendarHours - dtTotal) / calendarHours) * 100).toFixed(1)
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
                      <td className={`border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-center font-black text-slate-900 dark:text-white sticky left-[80px] z-20 ${rowBg}`}>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isBD ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                          <span className="tracking-tight">{row.equip_no}</span>
                        </div>
                      </td>

                      {/* MODEL (Sticky Left 3) */}
                      <td className={`border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-center font-semibold text-slate-600 dark:text-slate-400 sticky left-[165px] z-20 ${rowBg}`}>
                        {row.model || '-'}
                      </td>

                      {/* Est. HM */}
                      <td className="border border-slate-300 dark:border-slate-700 px-2 py-1.5 text-center font-bold text-slate-800 dark:text-slate-200">
                        {formatNumber(row.est_hm)}
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

                      {/* NEXT SERVICE (6 Columns) */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 text-center font-semibold text-slate-800 dark:text-slate-200">
                        {row.next_service_hours_due ? formatNumber(row.next_service_hours_due) : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 text-center font-semibold text-slate-500 dark:text-slate-400">
                        {row.next_service_hours_due_2 ? formatNumber(row.next_service_hours_due_2) : '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-bold text-blue-700 dark:text-blue-300">
                        {row.next_service_type || '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-medium text-slate-500 dark:text-slate-400">
                        {row.next_service_type_2 || '-'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                        {formatDateShort(row.next_service_date)}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center text-[10px] font-medium text-slate-400">
                        {formatDateShort(row.next_service_date_2)}
                      </td>

                      {/* PM TYPE (5 Columns - Pink highlight when scheduled!) */}
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

                      {/* DOWNTIME SUMMARY (PM, BACKLOG, MIDLIFE, PCR) */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-black text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-slate-800/30">
                        {row.downtime_pm ? row.downtime_pm : '0'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-medium text-slate-400">
                        {row.downtime_backlog ? row.downtime_backlog : ''}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-medium text-slate-400">
                        {row.downtime_midlife ? row.downtime_midlife : ''}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center font-medium text-slate-400">
                        {row.downtime_pcr ? row.downtime_pcr : ''}
                      </td>

                      {/* GANTT DAY CELLS */}
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

                      {/* TOTAL DOWNTIME */}
                      <td className="border border-slate-300 dark:border-slate-700 px-2 py-1 text-center font-black text-slate-900 dark:text-white bg-slate-100/70 dark:bg-slate-800/60">
                        {dtTotal}
                      </td>

                      {/* PA % */}
                      <td className="border border-slate-300 dark:border-slate-700 px-1 py-1 text-center">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                          Number(paPercent) >= 90
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
                            title="Edit Data Unit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row)}
                            className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            title="Hapus Unit"
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
                  <td colSpan={5} className="border border-slate-600 px-3 py-2 text-right sticky left-0 z-30 bg-[#2a303c]">
                    TOTAL FLEET SUMMARY ({filteredRows.length} UNIT)
                  </td>
                  <td colSpan={6} className="border border-slate-600 px-2 py-2 text-center text-slate-300">
                    {totalPM250 + totalPM500 + totalPM1000 + totalPM2000 + totalPM4000} PM Scheduled
                  </td>
                  {/* PM Type Counts */}
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM250}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM500}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM1000}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM2000}</td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-rose-300">{totalPM4000}</td>
                  {/* Downtime Sum */}
                  <td className="border border-slate-600 px-1 py-2 text-center">
                    {filteredRows.reduce((s, r) => s + (r.downtime_pm || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center">
                    {filteredRows.reduce((s, r) => s + (r.downtime_backlog || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center">
                    {filteredRows.reduce((s, r) => s + (r.downtime_midlife || 0), 0)}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center">
                    {filteredRows.reduce((s, r) => s + (r.downtime_pcr || 0), 0)}
                  </td>
                  {/* Day Columns Totals */}
                  {dayArray.map(d => {
                    const dayTotal = filteredRows.reduce((s, r) => s + getJam(r.equip_no, d), 0);
                    return (
                      <td key={d} className="border border-slate-600 px-0 py-2 text-center text-[9px]">
                        {dayTotal > 0 ? dayTotal : ''}
                      </td>
                    );
                  })}
                  <td className="border border-slate-600 px-2 py-2 text-center text-rose-300">
                    {totalFleetDowntime}
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center text-emerald-300">
                    {projectedFleetPA}%
                  </td>
                  <td className="border border-slate-600 px-1 py-2 text-center print:hidden">-</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
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
