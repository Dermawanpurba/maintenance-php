import React, { useState } from 'react';
import { Wrench, Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';
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
              placeholder="Cari nomor WO / unit / deskripsi..."
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-72 font-medium transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
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
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all hidden sm:block"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="EMERGENCY">EMERGENCY</option>
            <option value="HIGH">HIGH</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm shadow-blue-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Work Order (WO)</span>
        </button>
      </div>

      {/* WO Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">No. WO</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Deskripsi Gangguan / Perbaikan</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Status &amp; Ubah</th>
                <th className="py-3 px-4">Pelapor / PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada Work Order yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((wo, idx) => {
                  const s = (wo.status || 'OPEN').toUpperCase();
                  const p = (wo.prioritas || 'NORMAL').toUpperCase();
                  const isClosed = s === 'CLOSED' || s === 'COMPLETED';

                  return (
                    <tr key={wo.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">
                        {wo.no_wo}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{wo.tanggal}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-black text-[10px]">
                          {wo.no_unit}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 max-w-sm truncate" title={wo.deskripsi}>
                        {wo.deskripsi}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            p === 'EMERGENCY' || p === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : p === 'NORMAL'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {p}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={s}
                          onChange={e => handleStatusChange(wo.no_wo, e.target.value)}
                          className={`py-1 px-2.5 rounded-lg text-[10px] font-black border transition-colors outline-none cursor-pointer ${
                            isClosed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : s.includes('WAIT')
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-blue-50 text-blue-700 border-blue-300'
                          }`}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="WAITING PART">WAITING PART</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-semibold">
                        {wo.pelapor || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Buat WO Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Buat Surat Perintah Kerja (WO)
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Nomor WO (Auto)</label>
                  <input
                    type="text"
                    value={form.no_wo || ''}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Tanggal WO</label>
                  <input
                    type="date"
                    value={form.tanggal || ''}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Pilih Unit Armada</label>
                <select
                  value={form.no_unit || ''}
                  onChange={e => setForm({ ...form, no_unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
                >
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.no_unit}>
                      {eq.no_unit} - {eq.model} ({eq.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Deskripsi Gangguan / Pekerjaan</label>
                <textarea
                  rows={3}
                  value={form.deskripsi || ''}
                  onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  placeholder="Jelaskan indikasi kerusakan atau rencana servis..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Prioritas</label>
                  <select
                    value={form.prioritas || 'NORMAL'}
                    onChange={e => setForm({ ...form, prioritas: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Status Awal</label>
                  <select
                    value={form.status || 'OPEN'}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="WAITING PART">WAITING PART</option>
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
