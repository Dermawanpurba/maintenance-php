import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { Equipment } from '../types';
import { api } from '../services/api';

interface EquipmentViewProps {
  equipments: Equipment[];
  onRefresh: () => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({ equipments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<Equipment>({
    no_unit: '',
    tipe: 'Excavator',
    model: '',
    lokasi: 'Pit 1',
    status: 'READY',
    last_hm: 0,
    serial_number: '',
  });

  const types = Array.from(new Set(equipments.map(e => e.tipe).filter(Boolean)));

  const filtered = equipments.filter(eq => {
    const matchSearch =
      (eq.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.model || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.lokasi || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.serial_number || '').toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'ALL' || eq.tipe === typeFilter;
    const matchStatus = statusFilter === 'ALL' || (eq.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchSearch && matchType && matchStatus;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit.trim()) {
      alert('Nomor Unit wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveMaster', {
        type: 'equip',
        data: form
      });

      if (res.success) {
        setIsModalOpen(false);
        setForm({
          no_unit: '',
          tipe: 'Excavator',
          model: '',
          lokasi: 'Pit 1',
          status: 'READY',
          last_hm: 0,
          serial_number: '',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan unit');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari unit / model / SN..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Tipe</option>
            {types.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="READY">READY / RUNNING</option>
            <option value="BREAKDOWN">BREAKDOWN / REPAIR</option>
            <option value="STANDBY">STANDBY</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Unit Alat</span>
        </button>
      </div>

      {/* Equipment Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4">Tipe & Model</th>
                <th className="py-3 px-4">Lokasi Site / Pit</th>
                <th className="py-3 px-4">Status Kesiapan</th>
                <th className="py-3 px-4 text-right">Hour Meter (HM)</th>
                <th className="py-3 px-4">Serial Number</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Tidak ada unit yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((eq, idx) => {
                  const s = (eq.status || 'READY').toUpperCase();
                  const isBreakdown = s === 'BREAKDOWN' || s === 'REPAIR';
                  const isStandby = s === 'STANDBY';

                  return (
                    <tr key={eq.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${isBreakdown ? 'bg-rose-500 shadow-sm shadow-rose-500' : isStandby ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                        <span>{eq.no_unit}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200">{eq.tipe}</span>
                        <span className="text-slate-400 text-[11px] block">{eq.model || '-'}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{eq.lokasi || '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isBreakdown
                              ? 'bg-rose-950/70 text-rose-300 border border-rose-800/50'
                              : isStandby
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                              : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                          }`}
                        >
                          {s}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-100">
                        {Number(eq.last_hm || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {eq.serial_number || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Unit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Tambah Unit Alat Berat Baru</span>
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
                <label className="block text-slate-400 mb-1 font-semibold">Nomor Unit (Code)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: EX-01, DT-12, DZ-05"
                  value={form.no_unit}
                  onChange={e => setForm({ ...form, no_unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tipe Alat</label>
                  <input
                    type="text"
                    required
                    placeholder="Excavator, Dump Truck, dll"
                    value={form.tipe}
                    onChange={e => setForm({ ...form, tipe: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Model / Tipe Unit</label>
                  <input
                    type="text"
                    placeholder="Contoh: CAT 320D, Komatsu PC200"
                    value={form.model}
                    onChange={e => setForm({ ...form, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Lokasi Penempatan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pit 1, Workshop"
                    value={form.lokasi}
                    onChange={e => setForm({ ...form, lokasi: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Status Awal</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="READY">READY</option>
                    <option value="BREAKDOWN">BREAKDOWN</option>
                    <option value="STANDBY">STANDBY</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hour Meter Terakhir (HM)</label>
                  <input
                    type="number"
                    value={form.last_hm}
                    onChange={e => setForm({ ...form, last_hm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Serial Number (SN)</label>
                  <input
                    type="text"
                    placeholder="Nomor Seri Rangka/Mesin"
                    value={form.serial_number}
                    onChange={e => setForm({ ...form, serial_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
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
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Unit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
