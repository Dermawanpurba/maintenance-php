import React, { useState } from 'react';
import { AlertTriangle, Plus, Search, CheckCircle2, Clock, X, Wrench } from 'lucide-react';
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
    no_unit: equipments[0]?.no_unit || '',
    deskripsi: '',
    prioritas: 'HIGH',
    status: 'PENDING',
    part_required: '',
    estimated_hours: 2,
  });

  const filtered = backlogs.filter(bl => {
    const matchSearch =
      (bl.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (bl.deskripsi || '').toLowerCase().includes(search.toLowerCase()) ||
      (bl.part_required || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || (bl.status || '').toUpperCase() === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (id: any, newStatus: string) => {
    try {
      const res = await api.postAction('updateBacklogStatus', {
        id,
        status: newStatus
      });
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal mengubah status backlog');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit || !form.deskripsi?.trim()) {
      alert('Pilih unit dan isi deskripsi temuan defect!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveBacklog', form);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          no_unit: equipments[0]?.no_unit || '',
          deskripsi: '',
          prioritas: 'HIGH',
          status: 'PENDING',
          part_required: '',
          estimated_hours: 2,
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

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar Card */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari defect / unit / part..."
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-72 font-medium transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-slate-700 font-bold transition-all"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">PENDING</option>
            <option value="WAITING PART">WAITING PART</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm shadow-amber-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Backlog Defect</span>
        </button>
      </div>

      {/* Backlog Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4">Deskripsi Temuan Defect</th>
                <th className="py-3 px-4">Kebutuhan Part / Spare</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Est. Jam</th>
                <th className="py-3 px-4">Status &amp; Ubah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ada temuan backlog defect yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((bl, idx) => {
                  const s = (bl.status || 'PENDING').toUpperCase();
                  const p = (bl.prioritas || 'HIGH').toUpperCase();
                  const isDone = s === 'COMPLETED' || s === 'CLOSED';

                  return (
                    <tr key={bl.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-black text-[10px]">
                          {bl.no_unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 max-w-sm truncate" title={bl.deskripsi}>
                        {bl.deskripsi}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {bl.part_required || <span className="text-slate-400 italic">Tidak butuh part</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            p === 'CRITICAL' || p === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {p}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-600">
                        {bl.estimated_hours || 2} Jam
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={s}
                          onChange={e => handleStatusChange(bl.id, e.target.value)}
                          className={`py-1 px-2.5 rounded-lg text-[10px] font-black border transition-colors outline-none cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : s.includes('WAIT')
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-blue-50 text-blue-700 border-blue-300'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="WAITING PART">WAITING PART</option>
                          <option value="SCHEDULED">SCHEDULED</option>
                          <option value="COMPLETED">COMPLETED</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Tambah Backlog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Catat Temuan Backlog Defect
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">Pilih Unit Terkait</label>
                <select
                  value={form.no_unit || ''}
                  onChange={e => setForm({ ...form, no_unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-bold"
                >
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.no_unit}>
                      {eq.no_unit} - {eq.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Deskripsi Temuan Kerusakan / Defect</label>
                <textarea
                  rows={3}
                  value={form.deskripsi || ''}
                  onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  placeholder="Contoh: Seal cylinder arm bocor rembesan oli..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Part / Komponen Dibutuhkan</label>
                  <input
                    type="text"
                    value={form.part_required || ''}
                    onChange={e => setForm({ ...form, part_required: e.target.value })}
                    placeholder="Contoh: Seal Kit Cylinder..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Estimasi Waktu Pengerjaan (Jam)</label>
                  <input
                    type="number"
                    value={form.estimated_hours || 2}
                    onChange={e => setForm({ ...form, estimated_hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-mono"
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Tingkat Urgensi / Prioritas</label>
                  <select
                    value={form.prioritas || 'HIGH'}
                    onChange={e => setForm({ ...form, prioritas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="CRITICAL">CRITICAL (Mendesak)</option>
                    <option value="HIGH">HIGH (Tinggi)</option>
                    <option value="MEDIUM">MEDIUM (Sedang)</option>
                    <option value="LOW">LOW (Rendah)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Status Awal</label>
                  <select
                    value={form.status || 'PENDING'}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="WAITING PART">WAITING PART</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
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
