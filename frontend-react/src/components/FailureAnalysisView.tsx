import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Search, AlertOctagon, X, AlertTriangle } from 'lucide-react';
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
    pic: 'Hariadi (GM / PMC Team)',
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
          pic: 'Hariadi (GM / PMC Team)',
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
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar Card */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari No FAR / unit / komponen / penyebab..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-sm shadow-red-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Laporan FAR</span>
        </button>
      </div>

      {/* FAR Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">No. FAR</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Komponen Rusak</th>
                <th className="py-3 px-4">Akar Masalah (RCA)</th>
                <th className="py-3 px-4">Tindakan Korektif</th>
                <th className="py-3 px-4">Investigator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada investigasi kerusakan (FAR) yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((f, idx) => (
                  <tr key={f.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">{f.far_number}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{f.tanggal}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-black text-[10px]">
                        {f.no_unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{f.damage_part}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={f.root_cause}>
                      {f.root_cause}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold max-w-xs truncate" title={f.corrective_action}>
                      {f.corrective_action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{f.pic || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <AlertOctagon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Laporan Investigasi Kerusakan (FAR)
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
                  <label className="block text-slate-600 mb-1">Nomor FAR</label>
                  <input
                    type="text"
                    value={form.far_number}
                    readOnly
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Pilih Unit Armada</label>
                  <select
                    value={form.no_unit}
                    onChange={e => setForm({ ...form, no_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-red-500 font-bold"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.no_unit}>
                        {eq.no_unit} - {eq.model}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Komponen yang Rusak</label>
                <input
                  type="text"
                  value={form.damage_part}
                  onChange={e => setForm({ ...form, damage_part: e.target.value })}
                  placeholder="Contoh: Cylinder Arm Seal Bocor / Final Drive Bearing Pecah"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-red-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Akar Penyebab Masalah (5-Why Analysis)</label>
                <textarea
                  rows={3}
                  value={form.root_cause}
                  onChange={e => setForm({ ...form, root_cause: e.target.value })}
                  placeholder="Jelaskan kronologi dan penyebab dasar kegagalan komponen..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-red-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Tindakan Korektif &amp; Pencegahan</label>
                <textarea
                  rows={2}
                  value={form.corrective_action}
                  onChange={e => setForm({ ...form, corrective_action: e.target.value })}
                  placeholder="Tindakan perbaikan dan SOP pencegahan agar tidak terulang..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-red-500 font-medium"
                />
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
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black shadow-md shadow-red-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Laporan FAR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
