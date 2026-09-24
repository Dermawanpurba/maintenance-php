import React, { useState, useMemo } from 'react';
import {
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  X,
  Wrench,
  Trash2,
  RefreshCw,
  Layers,
  Activity,
  Calendar,
  Truck
} from 'lucide-react';
import { Backlog, Equipment } from '../types';
import { api } from '../services/api';

interface BacklogViewProps {
  backlogs: Backlog[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const BacklogView: React.FC<BacklogViewProps> = ({
  backlogs,
  equipments,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<Partial<Backlog>>({
    tanggal: new Date().toISOString().split('T')[0],
    equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
    deskripsi_backlog: '',
    rencana_eksekusi: '',
    est_hours: 0,
    status: 'OPEN'
  });

  // SMRP BACKLOG METRICS
  const smrpMetrics = useMemo(() => {
    const all = backlogs || [];
    const openBacklogs = all.filter(b => {
      const s = (b.status || 'OPEN').toUpperCase();
      return s === 'OPEN' || s === 'PENDING' || s === 'WAITING PART' || s === 'IN PROGRESS';
    });
    const openCount = openBacklogs.length;
    const totalManHours = openBacklogs.reduce((sum, b) => {
      const h = parseFloat(String(b.est_hours ?? b.estimated_hours ?? 0));
      return sum + (isNaN(h) ? 0 : h);
    }, 0);

    const totalMechanics = 4;
    const weeklyCapacity = totalMechanics * 40; // 160h/week standard SMRP
    const backlogWeeks = weeklyCapacity > 0 ? (totalManHours / weeklyCapacity).toFixed(1) : '0.0';
    const bwNum = parseFloat(backlogWeeks);

    let healthLabel = 'SEHAT (2-4 MINGGU)';
    let healthBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (openCount === 0 || totalManHours === 0) {
      healthLabel = 'NIHIL / KOSONG (0 MINGGU)';
      healthBg = 'bg-slate-50 text-slate-600 border-slate-200';
    } else if (bwNum < 2) {
      healthLabel = 'LOW WORKLOAD (<2 MINGGU)';
      healthBg = 'bg-blue-50 text-blue-700 border-blue-200';
    } else if (bwNum > 4 && bwNum <= 6) {
      healthLabel = 'WARNING (4-6 MINGGU)';
      healthBg = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (bwNum > 6) {
      healthLabel = 'KRITIS / OVERDUE (>6 MINGGU)';
      healthBg = 'bg-red-50 text-red-700 border-red-200';
    }

    return {
      openCount,
      totalManHours,
      weeklyCapacity,
      backlogWeeks,
      healthLabel,
      healthBg
    };
  }, [backlogs]);

  // Filter backlogs
  const filtered = useMemo(() => {
    return backlogs.filter(bl => {
      const eq = String(bl.equip_no || bl.no_unit || '').toLowerCase();
      const id = String(bl.item_id || bl.id || '').toLowerCase();
      const desc = String(bl.deskripsi_backlog || bl.deskripsi || '').toLowerCase();
      const rencana = String(bl.rencana_eksekusi || bl.rencana || bl.part_required || '').toLowerCase();

      const q = search.toLowerCase().trim();
      const matchSearch = !q || eq.includes(q) || id.includes(q) || desc.includes(q) || rencana.includes(q);

      const s = (bl.status || 'OPEN').toUpperCase();
      let matchStatus = true;
      if (statusFilter === 'OPEN') {
        matchStatus = s === 'OPEN' || s === 'PENDING';
      } else if (statusFilter === 'CLOSED') {
        matchStatus = s === 'CLOSED' || s === 'COMPLETED';
      } else if (statusFilter !== 'ALL') {
        matchStatus = s === statusFilter.toUpperCase();
      }

      return matchSearch && matchStatus;
    });
  }, [backlogs, search, statusFilter]);

  // Handle status update
  const handleStatusChange = async (id: any, newStatus: string) => {
    try {
      const res = await api.postAction('updateBacklogStatus', { id, status: newStatus });
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal mengubah status backlog');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus temuan backlog defect ini?')) return;
    try {
      const res = await api.postAction('deleteBacklog', { id });
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus backlog');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const eq = form.equip_no || form.no_unit;
    const desc = form.deskripsi_backlog || form.deskripsi;
    if (!eq || !desc?.trim()) {
      alert('Pilih unit dan isi deskripsi kendala / temuan defect!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveBacklog', {
        tanggal: form.tanggal || new Date().toISOString().split('T')[0],
        equip_no: eq,
        no_unit: eq,
        deskripsi_backlog: desc,
        deskripsi: desc,
        rencana_eksekusi: form.rencana_eksekusi || '',
        rencana: form.rencana_eksekusi || '',
        est_hours: form.est_hours !== undefined ? Number(form.est_hours) : 0,
        status: form.status || 'OPEN'
      });

      if (res.success) {
        setIsModalOpen(false);
        setForm({
          tanggal: new Date().toISOString().split('T')[0],
          equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
          deskripsi_backlog: '',
          rencana_eksekusi: '',
          est_hours: 0,
          status: 'OPEN'
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan backlog');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate aging in days
  const getAgingBadge = (dateStr?: string) => {
    if (!dateStr) return <span className="text-slate-400 text-[9px]">-</span>;
    const blD = new Date(dateStr);
    if (isNaN(blD.getTime())) return <span className="text-slate-400 text-[9px]">-</span>;

    const agingDays = Math.max(0, Math.floor((new Date().getTime() - blD.getTime()) / (1000 * 60 * 60 * 24)));
    if (agingDays <= 7) {
      return (
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-bold">
          Fresh ({agingDays}d)
        </span>
      );
    } else if (agingDays <= 14) {
      return (
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[9px] font-bold">
          Normal ({agingDays}d)
        </span>
      );
    } else if (agingDays <= 30) {
      return (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[9px] font-bold">
          Perhatian ({agingDays}d)
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[9px] font-black animate-pulse">
          Overdue ({agingDays}d)
        </span>
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. HEADER */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Backlog Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Pencatatan dan pemantauan pekerjaan tertunda / antrian perbaikan unit sesuai standar reliabilitas SMRP.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Backlog</span>
          </button>
        </div>
      </div>

      {/* 2. SMRP BACKLOG ANALYTICS & HEALTH BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Antrian Backlog</div>
            <div className="text-3xl font-black text-amber-600 mt-1">
              {smrpMetrics.openCount} <span className="text-xs text-slate-400 font-bold">Item Open</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100">
            Total antrian perbaikan aktif
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Beban Kerja (SMRP)</div>
            <div className="text-3xl font-black text-slate-800 mt-1">
              {smrpMetrics.totalManHours.toFixed(1)} <span className="text-xs text-slate-400 font-bold">Man-Hours</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100">
            Kapasitas: {smrpMetrics.weeklyCapacity}h / minggu
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl md:rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Backlog Weeks (SMRP 5.4.7)</div>
            <div className="text-3xl font-black text-blue-600 mt-1">
              {smrpMetrics.backlogWeeks} <span className="text-xs text-slate-400 font-bold">Minggu</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-3 pt-2 border-t border-slate-100">
            Benchmark Sehat: 2 – 4 Minggu
          </div>
        </div>

        <div className={`p-5 rounded-2xl md:rounded-3xl border shadow-sm ${smrpMetrics.healthBg} flex flex-col justify-between`}>
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider opacity-80">Indikator Kesehatan SMRP</div>
            <div className="text-sm md:text-base font-black mt-1.5">{smrpMetrics.healthLabel}</div>
          </div>
          <div className="text-[10px] opacity-80 font-medium mt-3 pt-2 border-t border-current/20">
            Tingkat beban antrean kerja mekanik
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kode unit, nomor ID, atau deskripsi backlog..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/50 outline-none focus:bg-white focus:border-amber-500 font-medium transition-colors"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">Semua Status Backlog</option>
            <option value="OPEN">Hanya OPEN / PENDING</option>
            <option value="WAITING PART">Hanya WAITING PART</option>
            <option value="IN PROGRESS">Hanya IN PROGRESS</option>
            <option value="CLOSED">Hanya CLOSED</option>
          </select>
        </div>
      </div>

      {/* 4. TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[950px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-wider">
              <tr>
                <th className="p-4 w-36">ID BACKLOG / TGL</th>
                <th className="p-4 w-32">KODE UNIT</th>
                <th className="p-4">DESKRIPSI &amp; RENCANA PERBAIKAN</th>
                <th className="p-4 text-center w-40">BEBAN &amp; AGING</th>
                <th className="p-4 text-center w-36">STATUS PERBAIKAN</th>
                <th className="p-4 text-center w-20">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 italic">
                    Tidak ada temuan backlog defect yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((bl, idx) => {
                  const rawStatus = (bl.status || 'OPEN').toUpperCase();
                  const isClosed = rawStatus === 'CLOSED' || rawStatus === 'COMPLETED';
                  const isWaitPart = rawStatus.includes('WAIT');
                  const isProg = rawStatus.includes('PROG');

                  const equipNo = bl.equip_no || bl.no_unit || '-';
                  const itemId = bl.item_id || bl.id || `BL-${idx + 1}`;
                  const desc = bl.deskripsi_backlog || bl.deskripsi || '-';
                  const rencana = bl.rencana_eksekusi || bl.rencana || bl.part_required || '-';
                  const estH = parseFloat(String(bl.est_hours ?? bl.estimated_hours ?? 0)) || 0;

                  return (
                    <tr key={bl.id || bl.item_id || idx} className="hover:bg-slate-50/80 transition-colors">
                      {/* ID / TGL */}
                      <td className="p-4">
                        <div className="font-black text-slate-900 text-xs font-mono">{itemId}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{bl.tanggal || '-'}</span>
                        </div>
                      </td>

                      {/* EQUIP NO */}
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-black text-[11px] uppercase tracking-wide">
                          <Truck className="w-3 h-3 mr-1 text-blue-500" />
                          {equipNo}
                        </span>
                      </td>

                      {/* DESKRIPSI & RENCANA */}
                      <td className="p-4 max-w-md">
                        <div className="font-bold text-slate-900 text-xs mb-1 leading-relaxed">
                          {desc}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                          <Wrench className="w-3 h-3 text-amber-500 flex-shrink-0" />
                          <span className="font-bold text-slate-600">Rencana:</span>
                          <span className="truncate">{rencana}</span>
                        </div>
                      </td>

                      {/* BEBAN & AGING */}
                      <td className="p-4 text-center">
                        <div className="text-xs font-black text-slate-800 font-mono">
                          {estH} <span className="text-[10px] font-bold text-slate-400">Jam</span>
                        </div>
                        <div className="mt-1">
                          {getAgingBadge(bl.tanggal)}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-4 text-center">
                        <select
                          value={rawStatus}
                          onChange={e => handleStatusChange(bl.item_id || bl.id, e.target.value)}
                          className={`py-1 px-2.5 rounded-xl text-[10px] font-black border transition-all outline-none cursor-pointer shadow-sm ${
                            isClosed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : isWaitPart
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : isProg
                              ? 'bg-blue-50 text-blue-700 border-blue-300'
                              : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="WAITING PART">WAITING PART</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      {/* AKSI */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(bl.item_id || bl.id)}
                          title="Hapus Temuan Backlog"
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-flex active:scale-95 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL FORM TAMBAH BACKLOG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Catat Temuan Backlog Defect Baru
                  </h3>
                  <p className="text-[11px] text-slate-500">Standar pencatatan beban kerja perbaikan SMRP</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Tanggal Backlog *</label>
                  <input
                    type="date"
                    value={form.tanggal || ''}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Nomor Lambung Unit *</label>
                  <select
                    value={form.equip_no || form.no_unit || ''}
                    onChange={e => setForm({ ...form, equip_no: e.target.value, no_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-bold"
                    required
                  >
                    {equipments.map(eq => (
                      <option key={eq.id || eq.equip_no} value={eq.equip_no || eq.no_unit}>
                        {eq.equip_no || eq.no_unit} - {eq.model || eq.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-bold">Deskripsi Kendala / Temuan Defect *</label>
                <textarea
                  rows={3}
                  value={form.deskripsi_backlog || form.deskripsi || ''}
                  onChange={e => setForm({ ...form, deskripsi_backlog: e.target.value, deskripsi: e.target.value })}
                  placeholder="Tuliskan temuan masalah komponen / pekerjaan perbaikan yang tertunda..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 resize-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Rencana Tindakan / Part Pengganti</label>
                  <input
                    type="text"
                    value={form.rencana_eksekusi || form.rencana || ''}
                    onChange={e => setForm({ ...form, rencana_eksekusi: e.target.value, rencana: e.target.value })}
                    placeholder="Contoh: Penggantian hose saat servis PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Estimasi Jam Kerja Mekanik (Est. Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={form.est_hours ?? 0}
                    onChange={e => setForm({ ...form, est_hours: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-wider shadow-md shadow-amber-600/20 cursor-pointer active:scale-95"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Backlog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
