import React, { useState } from 'react';
import { Wrench, Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { WorkOrder, Equipment } from '../types';
import { api } from '../services/api';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  equipments,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<Partial<WorkOrder>>({
    no_wo: `WO-${Date.now().toString().slice(-6)}`,
    tanggal: new Date().toISOString().split('T')[0],
    no_unit: equipments[0]?.no_unit || '',
    deskripsi: '',
    prioritas: 'NORMAL',
    status: 'OPEN',
    pelapor: 'Planner Plant',
    mekanik: 'Mekanik Shift',
    catatan: '',
  });

  const filtered = workOrders.filter(wo => {
    const matchSearch =
      (wo.no_wo || '').toLowerCase().includes(search.toLowerCase()) ||
      (wo.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (wo.deskripsi || '').toLowerCase().includes(search.toLowerCase()) ||
      (wo.pelapor || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || (wo.status || '').toUpperCase() === statusFilter.toUpperCase();
    const matchPriority = priorityFilter === 'ALL' || (wo.prioritas || '').toUpperCase() === priorityFilter.toUpperCase();

    return matchSearch && matchStatus && matchPriority;
  });

  const handleStatusChange = async (no_wo: string, newStatus: string) => {
    try {
      const res = await api.postAction('updateWOStatus', {
        no_wo,
        status: newStatus
      });
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal mengubah status WO');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit || !form.deskripsi?.trim()) {
      alert('Pilih unit dan isi deskripsi gangguan!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveWorkOrder', form);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          no_wo: `WO-${Date.now().toString().slice(-6)}`,
          tanggal: new Date().toISOString().split('T')[0],
          no_unit: equipments[0]?.no_unit || '',
          deskripsi: '',
          prioritas: 'NORMAL',
          status: 'OPEN',
          pelapor: 'Planner Plant',
          mekanik: 'Mekanik Shift',
          catatan: '',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal membuat Work Order');
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
              placeholder="Cari nomor WO / unit / deskripsi..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="OPEN">OPEN</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="WAITING PART">WAITING PART</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 hidden sm:block"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="EMERGENCY">EMERGENCY</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Work Order (WO)</span>
        </button>
      </div>

      {/* WO Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">No. WO</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Deskripsi Gangguan / Perbaikan</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Status & Ubah</th>
                <th className="py-3 px-4">Pelapor / PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Tidak ada Work Order yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filtered.map((wo, idx) => {
                  const s = (wo.status || 'OPEN').toUpperCase();
                  const p = (wo.prioritas || 'NORMAL').toUpperCase();
                  const isClosed = s === 'CLOSED' || s === 'COMPLETED';

                  return (
                    <tr key={wo.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">{wo.no_wo}</td>
                      <td className="py-3 px-4 text-slate-400">{wo.tanggal}</td>
                      <td className="py-3 px-4 font-bold text-white">{wo.no_unit}</td>
                      <td className="py-3 px-4 text-slate-200 max-w-sm truncate" title={wo.deskripsi}>
                        {wo.deskripsi}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            p === 'EMERGENCY' || p === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        >
                          {p}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={s}
                          onChange={e => handleStatusChange(wo.no_wo, e.target.value)}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold border ${
                            isClosed
                              ? 'bg-slate-800 text-slate-400 border-slate-700'
                              : s === 'IN PROGRESS'
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                          } focus:outline-none`}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="WAITING PART">WAITING PART</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{wo.pelapor || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add WO Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Buat Surat Perintah Kerja (WO) Baru</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nomor WO (Otomatis)</label>
                  <input
                    type="text"
                    required
                    value={form.no_wo}
                    onChange={e => setForm({ ...form, no_wo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tanggal WO</label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pilih Unit Armada</label>
                  <select
                    value={form.no_unit}
                    onChange={e => setForm({ ...form, no_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    {equipments.map(eq => (
                      <option key={eq.no_unit} value={eq.no_unit}>
                        {eq.no_unit} - {eq.tipe} ({eq.model || '-'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tingkat Prioritas</label>
                  <select
                    value={form.prioritas}
                    onChange={e => setForm({ ...form, prioritas: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH (Penting)</option>
                    <option value="EMERGENCY">EMERGENCY (Kritis)</option>
                    <option value="LOW">LOW (Ringan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Deskripsi Keluhan / Kerusakan</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan detail gejala, kerusakan komponen, atau perbaikan berkala..."
                  value={form.deskripsi}
                  onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pelapor</label>
                  <input
                    type="text"
                    value={form.pelapor}
                    onChange={e => setForm({ ...form, pelapor: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mekanik yang Ditugaskan</label>
                  <input
                    type="text"
                    value={form.mekanik}
                    onChange={e => setForm({ ...form, mekanik: e.target.value })}
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
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Work Order'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
