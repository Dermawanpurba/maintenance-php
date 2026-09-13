import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Search, AlertOctagon, X } from 'lucide-react';
import { FARRecord, Equipment } from '../types';
import { api } from '../services/api';

interface FailureAnalysisViewProps {
  fars: FARRecord[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const FailureAnalysisView: React.FC<FailureAnalysisViewProps> = ({ fars, equipments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<FARRecord>>({
    far_number: `FAR-${Date.now().toString().slice(-4)}`,
    tanggal: new Date().toISOString().split('T')[0],
    no_unit: equipments[0]?.no_unit || '',
    damage_part: '',
    root_cause: '',
    corrective_action: '',
    pic: 'Senior Maintenance Engineer',
  });

  const filtered = fars.filter(f => {
    return (
      (f.far_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.damage_part || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.root_cause || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit || !form.damage_part?.trim() || !form.root_cause?.trim()) {
      alert('Nomor unit, komponen rusak, dan akar penyebab masalah wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveFAR', form);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          far_number: `FAR-${Date.now().toString().slice(-4)}`,
          tanggal: new Date().toISOString().split('T')[0],
          no_unit: equipments[0]?.no_unit || '',
          damage_part: '',
          root_cause: '',
          corrective_action: '',
          pic: 'Senior Maintenance Engineer',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan laporan FAR');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari No FAR / unit / komponen / penyebab..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-72"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan FAR</span>
        </button>
      </div>

      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">No. FAR</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Komponen Rusak</th>
                <th className="py-3 px-4">Akar Penyebab (Root Cause)</th>
                <th className="py-3 px-4">Tindakan Pencegahan</th>
                <th className="py-3 px-4">Investigator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Tidak ada laporan investigasi kerusakan (FAR).
                  </td>
                </tr>
              ) : (
                filtered.map((far, idx) => (
                  <tr key={far.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{far.far_number}</td>
                    <td className="py-3 px-4 text-slate-400">{far.tanggal}</td>
                    <td className="py-3 px-4 font-bold text-white">{far.no_unit}</td>
                    <td className="py-3 px-4 text-rose-300 font-semibold">{far.damage_part}</td>
                    <td className="py-3 px-4 text-slate-200 max-w-xs truncate" title={far.root_cause}>
                      {far.root_cause}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={far.corrective_action}>
                      {far.corrective_action}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{far.pic}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Buat Failure Analysis Report (FAR) Baru</span>
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
                  <label className="block text-slate-400 mb-1 font-semibold">Nomor FAR</label>
                  <input
                    type="text"
                    required
                    value={form.far_number}
                    onChange={e => setForm({ ...form, far_number: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tanggal Investigasi</label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pilih Unit Terkait</label>
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
                <label className="block text-slate-400 mb-1 font-semibold">Komponen yang Mengalami Kerusakan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Main Hydraulic Pump, Turbocharger, Final Drive"
                  value={form.damage_part}
                  onChange={e => setForm({ ...form, damage_part: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Akar Masalah (Root Cause)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Hasil investigasi penyebab utama kerusakan komponen..."
                  value={form.root_cause}
                  onChange={e => setForm({ ...form, root_cause: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tindakan Pencegahan (Corrective Action)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Langkah antisipasi agar tidak terulang pada unit lain..."
                  value={form.corrective_action}
                  onChange={e => setForm({ ...form, corrective_action: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
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
                  <span>{submitting ? 'Menyimpan...' : 'Simpan FAR'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
