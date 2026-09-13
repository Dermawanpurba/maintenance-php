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
    status: 'ACTIVE_SWAB',
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
          status: 'ACTIVE_SWAB',
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari komponen / unit donor / unit penerima..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-72"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Swab Component</span>
        </button>
      </div>

      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Nama Komponen</th>
                <th className="py-3 px-4">Unit Donor (Asal)</th>
                <th className="py-3 px-4">Unit Penerima (Tujuan)</th>
                <th className="py-3 px-4">Alasan Kanibalisasi</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">PIC / Otorisasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Tidak ada catatan swab komponen.
                  </td>
                </tr>
              ) : (
                filtered.map((sw, idx) => (
                  <tr key={sw.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400">{sw.tanggal}</td>
                    <td className="py-3 px-4 font-bold text-white">{sw.component_name}</td>
                    <td className="py-3 px-4 font-mono text-rose-400 font-bold">{sw.donor_unit}</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{sw.recipient_unit}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{sw.reason || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/50">
                        {sw.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{sw.pic || '-'}</td>
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
                <Repeat className="w-4 h-4 text-emerald-400" />
                <span>Catat Kanibalisasi / Swab Komponen</span>
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
                  <label className="block text-slate-400 mb-1 font-semibold">Tanggal Swab</label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Komponen</label>
                  <input
                    type="text"
                    required
                    placeholder="Alternator, Turbo, Starter..."
                    value={form.component_name}
                    onChange={e => setForm({ ...form, component_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Unit Donor (Asal Part)</label>
                  <select
                    value={form.donor_unit}
                    onChange={e => setForm({ ...form, donor_unit: e.target.value })}
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
                  <label className="block text-slate-400 mb-1 font-semibold">Unit Penerima (Tujuan)</label>
                  <select
                    value={form.recipient_unit}
                    onChange={e => setForm({ ...form, recipient_unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    {equipments.map(eq => (
                      <option key={eq.no_unit} value={eq.no_unit}>
                        {eq.no_unit} - {eq.tipe}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Alasan Swab / Kanibalisasi</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jelaskan urgensi operasional atau ketiadaan stok gudang..."
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">PIC / Penanggung Jawab</label>
                <input
                  type="text"
                  value={form.pic}
                  onChange={e => setForm({ ...form, pic: e.target.value })}
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
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Swab'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
