import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Trash2, Edit2, X, Save, ChevronDown, ChevronUp,
  Activity, AlertTriangle, CheckCircle2, RefreshCw, Filter,
  Layers, TrendingUp, Info
} from 'lucide-react';
import { PpuRecord, Equipment } from '../types';
import { api } from '../services/api';

interface PpuViewProps {
  equipments: Equipment[];
  onRefresh?: () => void;
}

const TRACK_GROUPS = ['CAT (TU)', 'ITM (HHI)', 'KOMATSU', 'BERCO', 'SALT', 'OTHER'];
const STATUS_OPTS = ['NORMAL', 'CAUTION', 'CRITICAL'];

const statusBadge = (status: string) => {
  const cfg = {
    NORMAL:   { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
    CAUTION:  { bg: 'bg-amber-100   text-amber-800   border-amber-200',   icon: <AlertTriangle className="w-3 h-3" /> },
    CRITICAL: { bg: 'bg-rose-100    text-rose-800    border-rose-200',    icon: <AlertTriangle className="w-3 h-3" /> },
  }[status] ?? { bg: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg}`}>
      {cfg.icon}{status}
    </span>
  );
};

// Color helper for measurement values — highlights red if approaching limit
const measureColor = (val: number | undefined) => {
  if (!val) return '';
  if (val >= 90) return 'text-rose-600 font-bold';
  if (val >= 75) return 'text-amber-600 font-bold';
  return 'text-slate-800';
};

const EMPTY_FORM: PpuRecord = {
  unit_no: '',
  model: '',
  track_group_used: '',
  cts_date: '',
  last_fitted_track_group: '',
  pct_hours_track: 0,
  hours_track_gp: 0,
  smu: 0,
  sprocket_lh: 0,
  sprocket_rh: 0,
  link_height_lh: 0,
  link_height_rh: 0,
  chain_bushing_lh: 0,
  chain_bushing_rh: 0,
  frame_ext_lh: 0,
  frame_ext_rh: 0,
  grouser_height_lh: 0,
  grouser_height_rh: 0,
  idler_front_lh: 0,
  idler_front_rh: 0,
  idler_rear_lh: 0,
  idler_rear_rh: 0,
  inspection_date: new Date().toISOString().split('T')[0],
  inspector: '',
  notes: '',
  status: 'NORMAL',
};

export const PpuView: React.FC<PpuViewProps> = ({ equipments, onRefresh }) => {
  const [records, setRecords] = useState<PpuRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<PpuRecord | null>(null);
  const [form, setForm] = useState<PpuRecord>(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.postAction('getPpuRecords');
      if (res.success) setRecords(res.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const unitOptions = useMemo(() => {
    const fromEquip = equipments.map(e => e.equip_no || e.no_unit).filter(Boolean);
    const fromRecords = records.map(r => r.unit_no).filter(Boolean);
    return Array.from(new Set([...fromEquip, ...fromRecords])).sort();
  }, [equipments, records]);

  const filtered = useMemo(() => {
    return records.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        r.unit_no?.toLowerCase().includes(q) ||
        r.model?.toLowerCase().includes(q) ||
        r.track_group_used?.toLowerCase().includes(q) ||
        r.inspector?.toLowerCase().includes(q) ||
        r.inspection_date?.includes(q);
      const matchStatus = !filterStatus || r.status === filterStatus;
      const matchUnit = !filterUnit || r.unit_no === filterUnit;
      return matchSearch && matchStatus && matchUnit;
    });
  }, [records, search, filterStatus, filterUnit]);

  const stats = useMemo(() => {
    const normal   = records.filter(r => r.status === 'NORMAL').length;
    const caution  = records.filter(r => r.status === 'CAUTION').length;
    const critical = records.filter(r => r.status === 'CRITICAL').length;
    return { total: records.length, normal, caution, critical };
  }, [records]);

  const openForm = (record?: PpuRecord) => {
    if (record) {
      setEditRecord(record);
      setForm({ ...record });
    } else {
      setEditRecord(null);
      setForm({ ...EMPTY_FORM, inspection_date: new Date().toISOString().split('T')[0] });
    }
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditRecord(null); };

  const handleInput = (field: keyof PpuRecord, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.unit_no) { setFeedback({ type: 'error', message: 'Unit No wajib diisi!' }); return; }
    setSaving(true);
    try {
      const payload = editRecord ? { ...form, id: editRecord.id } : form;
      const res = await api.postAction('savePpuRecord', payload);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message || 'Data PPU berhasil disimpan' });
        closeForm();
        await loadData();
        onRefresh?.();
      } else {
        setFeedback({ type: 'error', message: res.message || 'Gagal menyimpan data' });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message });
    }
    setSaving(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Hapus data PPU ini?')) return;
    try {
      const res = await api.postAction('deletePpuRecord', { id });
      if (res.success) { await loadData(); onRefresh?.(); }
    } catch { /* ignore */ }
  };

  const NumField = ({ label, field }: { label: string; field: keyof PpuRecord }) => (
    <div>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="number"
        step="0.01"
        value={(form[field] as number) || 0}
        onChange={e => handleInput(field, parseFloat(e.target.value) || 0)}
        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white"
      />
    </div>
  );

  const LHRHGroup = ({ label, lhField, rhField }: { label: string; lhField: keyof PpuRecord; rhField: keyof PpuRecord }) => (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="LH" field={lhField} />
        <NumField label="RH" field={rhField} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pemeriksaan', value: stats.total,    color: 'from-teal-600 to-cyan-600',   icon: <Layers className="w-5 h-5 text-white/80" /> },
          { label: 'Normal',            value: stats.normal,   color: 'from-emerald-600 to-green-600', icon: <CheckCircle2 className="w-5 h-5 text-white/80" /> },
          { label: 'Caution',           value: stats.caution,  color: 'from-amber-500 to-orange-500',  icon: <AlertTriangle className="w-5 h-5 text-white/80" /> },
          { label: 'Critical',          value: stats.critical, color: 'from-rose-600 to-red-600',      icon: <AlertTriangle className="w-5 h-5 text-white/80" /> },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-md`}>
            <div className="flex items-center justify-between mb-2">{s.icon}<TrendingUp className="w-3.5 h-3.5 text-white/50" /></div>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-[11px] font-semibold text-white/80 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-3 rounded-xl flex items-center justify-between border text-sm font-bold ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {feedback.message}
          </span>
          <button onClick={() => setFeedback(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-black text-slate-800">Data Pemeriksaan UC (PPU)</h2>
            <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-[10px] font-bold">{filtered.length} record</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari unit, model, inspektor..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 w-44"
              />
            </div>
            <select value={filterUnit} onChange={e => setFilterUnit(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none">
              <option value="">Semua Unit</option>
              {unitOptions.map(u => <option key={u}>{u}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none">
              <option value="">Semua Status</option>
              {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={loadData} className="p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors" title="Refresh">
              <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <button onClick={() => openForm()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all">
              <Plus className="w-3.5 h-3.5" />Input PPU
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />Memuat data...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-semibold">Belum ada data PPU</p>
              <p className="text-slate-400 text-xs mt-1">Klik "Input PPU" untuk menambah data pemeriksaan undercarriage</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Unit', 'Model', 'Tgl Inspeksi', 'Track Group', 'SMU', 'Sprocket (LH/RH)', 'Link Height (LH/RH)', 'Grouser Ht (LH/RH)', 'Idler F (LH/RH)', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-[10px] uppercase tracking-wider text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(r => (
                  <React.Fragment key={r.id}>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="font-black text-slate-900">{r.unit_no}</div>
                        <div className="text-slate-400 text-[10px]">{r.inspector || '-'}</div>
                      </td>
                      <td className="px-3 py-2.5 text-slate-700 font-medium">{r.model || '-'}</td>
                      <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">{r.inspection_date || '-'}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">{r.track_group_used || '-'}</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-800">{r.smu?.toLocaleString() || '-'}</td>
                      <td className="px-3 py-2.5">
                        <span className={`font-mono ${measureColor(r.sprocket_lh)}`}>{r.sprocket_lh ?? '-'}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className={`font-mono ${measureColor(r.sprocket_rh)}`}>{r.sprocket_rh ?? '-'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`font-mono ${measureColor(r.link_height_lh)}`}>{r.link_height_lh ?? '-'}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className={`font-mono ${measureColor(r.link_height_rh)}`}>{r.link_height_rh ?? '-'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`font-mono ${measureColor(r.grouser_height_lh)}`}>{r.grouser_height_lh ?? '-'}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className={`font-mono ${measureColor(r.grouser_height_rh)}`}>{r.grouser_height_rh ?? '-'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`font-mono ${measureColor(r.idler_front_lh)}`}>{r.idler_front_lh ?? '-'}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className={`font-mono ${measureColor(r.idler_front_rh)}`}>{r.idler_front_rh ?? '-'}</span>
                      </td>
                      <td className="px-3 py-2.5">{statusBadge(r.status || 'NORMAL')}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id!)}
                            className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors" title="Detail">
                            {expandedRow === r.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => openForm(r)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500 transition-colors" title="Hapus">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Expanded Detail Row */}
                    {expandedRow === r.id && (
                      <tr className="bg-teal-50/40">
                        <td colSpan={11} className="px-6 py-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Track Info</p>
                              <div className="space-y-1 text-slate-700">
                                <div><span className="text-slate-400">CTS Date:</span> {r.cts_date || '-'}</div>
                                <div><span className="text-slate-400">Last Fitted:</span> {r.last_fitted_track_group || '-'}</div>
                                <div><span className="text-slate-400">% Hrs Track:</span> {r.pct_hours_track ?? '-'}%</div>
                                <div><span className="text-slate-400">Hrs Track GP:</span> {r.hours_track_gp?.toLocaleString() ?? '-'}</div>
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Track Link (mm)</p>
                              <div className="space-y-1 text-slate-700">
                                <div className="flex justify-between"><span className="text-slate-400">Link Ht LH:</span> <span className={`font-mono ${measureColor(r.link_height_lh)}`}>{r.link_height_lh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Link Ht RH:</span> <span className={`font-mono ${measureColor(r.link_height_rh)}`}>{r.link_height_rh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Chain B. LH:</span> <span className={`font-mono ${measureColor(r.chain_bushing_lh)}`}>{r.chain_bushing_lh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Chain B. RH:</span> <span className={`font-mono ${measureColor(r.chain_bushing_rh)}`}>{r.chain_bushing_rh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Frame Ext LH:</span> <span className="font-mono">{r.frame_ext_lh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Frame Ext RH:</span> <span className="font-mono">{r.frame_ext_rh ?? '-'}</span></div>
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Idler (mm)</p>
                              <div className="space-y-1 text-slate-700">
                                <div className="flex justify-between"><span className="text-slate-400">Front LH:</span> <span className={`font-mono ${measureColor(r.idler_front_lh)}`}>{r.idler_front_lh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Front RH:</span> <span className={`font-mono ${measureColor(r.idler_front_rh)}`}>{r.idler_front_rh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Rear LH:</span>  <span className={`font-mono ${measureColor(r.idler_rear_lh)}`}>{r.idler_rear_lh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Rear RH:</span>  <span className={`font-mono ${measureColor(r.idler_rear_rh)}`}>{r.idler_rear_rh ?? '-'}</span></div>
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Sprocket & Grouser (mm)</p>
                              <div className="space-y-1 text-slate-700">
                                <div className="flex justify-between"><span className="text-slate-400">Sprocket LH:</span> <span className={`font-mono ${measureColor(r.sprocket_lh)}`}>{r.sprocket_lh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Sprocket RH:</span> <span className={`font-mono ${measureColor(r.sprocket_rh)}`}>{r.sprocket_rh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Grouser LH:</span> <span className={`font-mono ${measureColor(r.grouser_height_lh)}`}>{r.grouser_height_lh ?? '-'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Grouser RH:</span> <span className={`font-mono ${measureColor(r.grouser_height_rh)}`}>{r.grouser_height_rh ?? '-'}</span></div>
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-2">Catatan</p>
                              <p className="text-slate-600 leading-relaxed">{r.notes || '-'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {editRecord ? `Edit PPU — ${editRecord.unit_no}` : 'Input Pemeriksaan UC (PPU)'}
                </h3>
              </div>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">

              {/* Section 1 — Identitas */}
              <div>
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />Identitas Unit & Inspeksi
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Unit No *</label>
                    <select value={form.unit_no} onChange={e => handleInput('unit_no', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white">
                      <option value="">-- Pilih Unit --</option>
                      {unitOptions.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Model</label>
                    <input value={form.model || ''} onChange={e => handleInput('model', e.target.value)}
                      placeholder="D8R, D65P, PC300..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tgl Inspeksi</label>
                    <input type="date" value={form.inspection_date || ''} onChange={e => handleInput('inspection_date', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Track Group Used</label>
                    <select value={form.track_group_used || ''} onChange={e => handleInput('track_group_used', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white">
                      <option value="">-- Pilih --</option>
                      {TRACK_GROUPS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inspektor</label>
                    <input value={form.inspector || ''} onChange={e => handleInput('inspector', e.target.value)}
                      placeholder="Nama inspektor..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                    <select value={form.status || 'NORMAL'} onChange={e => handleInput('status', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-white">
                      {STATUS_OPTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2 — Track History */}
              <div>
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />CTS & Track History
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">CTS Date</label>
                    <input value={form.cts_date || ''} onChange={e => handleInput('cts_date', e.target.value)}
                      placeholder="e.g. 13-May-24"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Last Fitted</label>
                    <input value={form.last_fitted_track_group || ''} onChange={e => handleInput('last_fitted_track_group', e.target.value)}
                      placeholder="e.g. 12-Jan-24"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">% Hrs Track GP</label>
                    <input type="number" step="0.01" value={form.pct_hours_track || 0} onChange={e => handleInput('pct_hours_track', parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hours Track GP</label>
                    <input type="number" step="0.1" value={form.hours_track_gp || 0} onChange={e => handleInput('hours_track_gp', parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">SMU (HM)</label>
                    <input type="number" step="0.1" value={form.smu || 0} onChange={e => handleInput('smu', parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400" />
                  </div>
                </div>
              </div>

              {/* Section 3 — Measurements */}
              <div>
                <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />Pengukuran Komponen (mm)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
                  {/* Sprocket */}
                  <div className="col-span-2 md:col-span-1 space-y-1">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">🔩 Sprocket (3 Teeth)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <NumField label="LH" field="sprocket_lh" />
                      <NumField label="RH" field="sprocket_rh" />
                    </div>
                  </div>
                  {/* Track Link */}
                  <div className="col-span-2 md:col-span-2 space-y-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">🔗 Track Link</p>
                    <div className="grid grid-cols-3 gap-2">
                      <LHRHGroup label="Link Height" lhField="link_height_lh" rhField="link_height_rh" />
                      <LHRHGroup label="Chain Bushing" lhField="chain_bushing_lh" rhField="chain_bushing_rh" />
                      <LHRHGroup label="Frame Ext." lhField="frame_ext_lh" rhField="frame_ext_rh" />
                    </div>
                  </div>
                  {/* Track Shoe */}
                  <div className="col-span-2 md:col-span-1 space-y-1">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">👟 Track Shoe</p>
                    <div className="grid grid-cols-2 gap-2">
                      <NumField label="Grouser LH" field="grouser_height_lh" />
                      <NumField label="Grouser RH" field="grouser_height_rh" />
                    </div>
                  </div>
                  {/* Idler */}
                  <div className="col-span-2 md:col-span-2 space-y-3">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">⭕ Idler</p>
                    <div className="grid grid-cols-2 gap-2">
                      <LHRHGroup label="Front" lhField="idler_front_lh" rhField="idler_front_rh" />
                      <LHRHGroup label="Rear"  lhField="idler_rear_lh"  rhField="idler_rear_rh"  />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan</label>
                <textarea value={form.notes || ''} onChange={e => handleInput('notes', e.target.value)}
                  rows={2} placeholder="Rekomendasi, temuan khusus, tindak lanjut..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 resize-none" />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button onClick={closeForm} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-60">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Menyimpan...' : 'Simpan Data PPU'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
