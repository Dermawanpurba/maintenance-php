import React, { useState } from 'react';
import { Clock, Plus, Search, Gauge, Fuel, X, Trash2 } from 'lucide-react';
import { DailyHM, Equipment } from '../types';
import { api } from '../services/api';

interface DailyHmViewProps {
  dailyHms: DailyHM[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const DailyHmView: React.FC<DailyHmViewProps> = ({
  dailyHms,
  equipments,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<Partial<DailyHM>>({
    tanggal: new Date().toISOString().split('T')[0],
    no_unit: equipments[0]?.no_unit || '',
    hm_awal: 0,
    hm_akhir: 0,
    fuel_liter: 0,
    operator: 'Operator Shift 1',
    shift: 'Shift 1 (Siang)',
  });

  const filtered = dailyHms.filter(hm => {
    return (
      (hm.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (hm.operator || '').toLowerCase().includes(search.toLowerCase()) ||
      (hm.tanggal || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleUnitSelect = (no_unit: string) => {
    const eq = equipments.find(e => e.no_unit === no_unit);
    const lastHm = Number(eq?.last_hm || 0);
    setForm(prev => ({
      ...prev,
      no_unit,
      hm_awal: lastHm,
      hm_akhir: lastHm + 8
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit) {
      alert('Pilih unit terlebih dahulu!');
      return;
    }

    const total_hm = Math.max(0, Number(form.hm_akhir || 0) - Number(form.hm_awal || 0));

    try {
      setSubmitting(true);
      const res = await api.postAction('saveDailyHM', {
        ...form,
        total_hm
      });

      if (res.success) {
        setIsModalOpen(false);
        setForm({
          tanggal: new Date().toISOString().split('T')[0],
          no_unit: equipments[0]?.no_unit || '',
          hm_awal: 0,
          hm_akhir: 0,
          fuel_liter: 0,
          operator: 'Operator Shift 1',
          shift: 'Shift 1 (Siang)',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan data Hour Meter');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus catatan Hour Meter ini?')) return;
    try {
      const res = await api.deleteDailyHM(id);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus data HM');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar Card */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari tanggal / nomor unit / operator..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-sm shadow-purple-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Input Log Hour Meter (HM)</span>
        </button>
      </div>

      {/* HM Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">HM Awal</th>
                <th className="py-3 px-4">HM Akhir</th>
                <th className="py-3 px-4">Total HM Operasi</th>
                <th className="py-3 px-4">BBM (Liter)</th>
                <th className="py-3 px-4">Operator / Driver</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-400">
                    Tidak ada catatan Hour Meter yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((hm, idx) => (
                  <tr key={hm.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500">{hm.tanggal}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-black text-[10px]">
                        {hm.no_unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{hm.shift || 'Shift 1'}</td>
                    <td className="py-3 px-4 font-mono">{hm.hm_awal}</td>
                    <td className="py-3 px-4 font-mono">{hm.hm_akhir}</td>
                    <td className="py-3 px-4 font-mono font-bold text-purple-600">
                      +{hm.total_hm || Math.max(0, hm.hm_akhir - hm.hm_awal)} Jam
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-600 font-bold">
                      {hm.fuel_liter || 0} L
                    </td>
                    <td className="py-3 px-4 text-slate-600">{hm.operator || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(hm.id)}
                        title="Hapus Catatan HM"
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-flex"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Input HM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Gauge className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Input Log Hour Meter (HM) Harian
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
                  <label className="block text-slate-600 mb-1">Tanggal Operasi</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Pilih Shift</label>
                  <select
                    value={form.shift}
                    onChange={e => setForm({ ...form, shift: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="Shift 1 (Siang)">Shift 1 (Siang)</option>
                    <option value="Shift 2 (Malam)">Shift 2 (Malam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Pilih Unit Armada</label>
                <select
                  value={form.no_unit}
                  onChange={e => handleUnitSelect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-purple-500 font-bold"
                >
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.no_unit}>
                      {eq.no_unit} - {eq.model} (Last HM: {eq.last_hm})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">HM Awal</label>
                  <input
                    type="number"
                    value={form.hm_awal}
                    onChange={e => setForm({ ...form, hm_awal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">HM Akhir</label>
                  <input
                    type="number"
                    value={form.hm_akhir}
                    onChange={e => setForm({ ...form, hm_akhir: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono outline-none focus:border-purple-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Konsumsi BBM (Liter)</label>
                  <input
                    type="number"
                    value={form.fuel_liter}
                    onChange={e => setForm({ ...form, fuel_liter: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Nama Operator / Driver</label>
                  <input
                    type="text"
                    value={form.operator}
                    onChange={e => setForm({ ...form, operator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-purple-500"
                  />
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md shadow-purple-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Log HM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
