import React, { useState } from 'react';
import { Repeat, Plus, Search, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { SwabRecord, Equipment } from '../types';
import { api } from '../services/api';

interface SwabViewProps {
  swabs: SwabRecord[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const SwabView: React.FC<SwabViewProps> = ({ swabs, equipments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<SwabRecord>>({
    tanggal: new Date().toISOString().split('T')[0],
    component_name: '',
    donor_unit: equipments[0]?.no_unit || '',
    recipient_unit: equipments[1]?.no_unit || '',
    reason: '',
    status: 'Active',
    pic: 'Foreman Plant',
  });

  const filtered = swabs.filter(s => {
    return (
      (s.component_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.donor_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.recipient_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.reason || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.component_name?.trim() || !form.donor_unit || !form.recipient_unit) {
      alert('Nama komponen, unit donor, dan unit penerima wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveSwabComponent', form);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          tanggal: new Date().toISOString().split('T')[0],
          component_name: '',
          donor_unit: equipments[0]?.no_unit || '',
          recipient_unit: equipments[1]?.no_unit || '',
          reason: '',
          status: 'Active',
          pic: 'Foreman Plant',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan data swab komponen');
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
            placeholder="Cari komponen / unit donor / unit tujuan..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-pink-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-black shadow-sm shadow-pink-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Swab Component</span>
        </button>
      </div>

      {/* Swab Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Nama Komponen</th>
                <th className="py-3 px-4">Unit Donor (Asal)</th>
                <th className="py-3 px-4">Unit Tujuan (Penerima)</th>
                <th className="py-3 px-4">Alasan Kanibalisasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Otorisasi / PIC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada catatan pemindahan atau kanibalisasi komponen.
                  </td>
                </tr>
              ) : (
                filtered.map((s, idx) => {
                  const isActive = (s.status || '').toLowerCase() === 'active';

                  return (
                    <tr key={s.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{s.tanggal}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{s.component_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
                          {s.donor_unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {s.recipient_unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={s.reason}>
                        {s.reason || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            isActive
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {isActive ? 'Aktif Terpasang' : 'Sudah Dikembalikan'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{s.pic || '-'}</td>
                    </tr>
                  );
                })
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
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <Repeat className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Dokumentasi Swab / Kanibalisasi Part
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
                <label className="block text-slate-600 mb-1">Nama Komponen / Part yang Diswab</label>
                <input
                  type="text"
                  value={form.component_name}
                  onChange={e => setForm({ ...form, component_name: e.target.value })}
                  placeholder="Contoh: Alternator 24V 60A / Starting Motor"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-pink-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Unit Donor (Asal Part)</label>
                  <select
                    value={form.donor_unit}
                    onChange={e => setForm({ ...form, donor_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-pink-500 font-bold"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.no_unit}>
                        {eq.no_unit} - {eq.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Unit Tujuan (Penerima)</label>
                  <select
                    value={form.recipient_unit}
                    onChange={e => setForm({ ...form, recipient_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-pink-500 font-bold"
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
                <label className="block text-slate-600 mb-1">Alasan Mendesak Pemindahan</label>
                <textarea
                  rows={2}
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="Contoh: Unit penerima prioritas loading batubara kapal..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-pink-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Pemberi Otorisasi / PIC</label>
                  <input
                    type="text"
                    value={form.pic}
                    onChange={e => setForm({ ...form, pic: e.target.value })}
                    placeholder="Nama Dept Head / Planner"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Target Restorasi / Pengembalian</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-pink-500"
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
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black shadow-md shadow-pink-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Swab'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
