import React, { useState } from 'react';
import { Clock, Plus, Search, Zap, Fuel, X } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari tanggal / nomor unit / operator..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-72"
          />
        </div>

        <button
          onClick={() => {
            handleUnitSelect(equipments[0]?.no_unit || '');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Input Log HM & BBM</span>
        </button>
      </div>

      {/* HM Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4 text-right">HM Awal</th>
                <th className="py-3 px-4 text-right">HM Akhir</th>
                <th className="py-3 px-4 text-right">Jam Operasi (Δ HM)</th>
                <th className="py-3 px-4 text-right">BBM (Liter)</th>
                <th className="py-3 px-4">Shift & Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Tidak ada log Hour Meter yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((hm, idx) => {
                  const diff = (hm.total_hm !== undefined && hm.total_hm !== null)
                    ? Number(hm.total_hm)
                    : Math.max(0, Number(hm.hm_akhir || 0) - Number(hm.hm_awal || 0));

                  return (
                    <tr key={hm.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400">{hm.tanggal}</td>
                      <td className="py-3 px-4 font-bold text-white">{hm.no_unit}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {Number(hm.hm_awal || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-100 font-bold">
                        {Number(hm.hm_akhir || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400 font-bold">
                        +{diff.toFixed(1)} Jam
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-300">
                        {Number(hm.fuel_liter || 0) > 0 ? `${Number(hm.fuel_liter).toLocaleString()} L` : '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        <span>{hm.operator || '-'}</span>
                        <span className="block text-[10px] text-slate-500">{hm.shift || '-'}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add HM Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Input Log Harian Hour Meter & Fuel</span>
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
                  <label className="block text-slate-400 mb-1 font-semibold">Tanggal Log</label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pilih Unit</label>
                  <select
                    value={form.no_unit}
                    onChange={e => handleUnitSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    {equipments.map(eq => (
                      <option key={eq.no_unit} value={eq.no_unit}>
                        {eq.no_unit} (HM: {eq.last_hm})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hour Meter Awal</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.hm_awal}
                    onChange={e => setForm({ ...form, hm_awal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Hour Meter Akhir</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.hm_akhir}
                    onChange={e => setForm({ ...form, hm_akhir: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Pengisian BBM (Liter)</label>
                  <input
                    type="number"
                    placeholder="0 Liter"
                    value={form.fuel_liter}
                    onChange={e => setForm({ ...form, fuel_liter: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-amber-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Shift Kerja</label>
                  <select
                    value={form.shift}
                    onChange={e => setForm({ ...form, shift: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Shift 1 (Siang)">Shift 1 (Siang)</option>
                    <option value="Shift 2 (Malam)">Shift 2 (Malam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Operator</label>
                <input
                  type="text"
                  placeholder="Nama operator yang bertugas"
                  value={form.operator}
                  onChange={e => setForm({ ...form, operator: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
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
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Log HM'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
