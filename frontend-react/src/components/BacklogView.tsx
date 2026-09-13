import React, { useState } from 'react';
import { AlertTriangle, Plus, Search, CheckCircle2, Clock, X } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari defect / unit / part..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">PENDING</option>
            <option value="ORDERED">PART ORDERED</option>
            <option value="READY">READY FOR INSTALL</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Backlog Defect</span>
        </button>
      </div>

      {/* Backlog Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4">Temuan Defect / Kerusakan</th>
                <th className="py-3 px-4">Kebutuhan Suku Cadang</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Status & Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    Tidak ada backlog yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((bl, idx) => {
                  const s = (bl.status || 'PENDING').toUpperCase();
                  const p = (bl.prioritas || 'NORMAL').toUpperCase();
                  const isClosed = s === 'CLOSED' || s === 'COMPLETED';

                  return (
                    <tr key={bl.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{bl.no_unit}</td>
                      <td className="py-3 px-4 text-slate-200">{bl.deskripsi}</td>
                      <td className="py-3 px-4 font-mono text-emerald-300">
                        {bl.part_required || <span className="text-slate-500 font-sans">-</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            p === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        >
                          {p}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={s}
                          onChange={e => handleStatusChange(bl.id, e.target.value)}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold border ${
                            isClosed
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                          } focus:outline-none`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="ORDERED">ORDERED</option>
                          <option value="READY">READY</option>
                          <option value="CLOSED">CLOSED</option>
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

      {/* Add Backlog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Catat Temuan Backlog Defect Baru</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pilih Unit Armada</label>
                <select
                  value={form.no_unit}
                  onChange={e => setForm({ ...form, no_unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                >
                  {equipments.map(eq => (
                    <option key={eq.no_unit} value={eq.no_unit}>
                      {eq.no_unit} - {eq.tipe}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Deskripsi Temuan Defect</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Contoh: Bocor oli silinder arm, track shoe longgar, lampu kerja mati..."
                  value={form.deskripsi}
                  onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Suku Cadang yang Dibutuhkan</label>
                <input
                  type="text"
                  placeholder="Contoh: Seal Kit Arm Cylinder (Part #123-456)"
                  value={form.part_required}
                  onChange={e => setForm({ ...form, part_required: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Prioritas</label>
                  <select
                    value={form.prioritas}
                    onChange={e => setForm({ ...form, prioritas: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="HIGH">HIGH (Kritis)</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Estimasi Jam Kerja</label>
                  <input
                    type="number"
                    value={form.estimated_hours}
                    onChange={e => setForm({ ...form, estimated_hours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1"
                >
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Defect'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
