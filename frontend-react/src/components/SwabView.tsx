import React, { useState } from 'react';
import { Repeat, Plus, Search, CheckCircle2, AlertTriangle, X, Trash2, Printer, Eye } from 'lucide-react';
import { SwabRecord, Equipment } from '../types';
import { api } from '../services/api';
import { printSwabDocument, printSwabSummaryReport } from '../utils/printUtils';

interface SwabViewProps {
  swabs: SwabRecord[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const SwabView: React.FC<SwabViewProps> = ({ swabs, equipments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSwab, setSelectedSwab] = useState<SwabRecord | null>(null);
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => printSwabSummaryReport(filtered)}
            className="flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Cetak Rekapitulasi Kanibalisasi / Swab Komponen"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Cetak Rekap PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-black shadow-sm shadow-pink-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Swab Component</span>
          </button>
        </div>
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
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Tidak ada catatan pemindahan atau kanibalisasi komponen.
                  </td>
                </tr>
              ) : (
                filtered.map((s, idx) => {
                  const isActive = (s.status || '').toLowerCase() === 'active';
                  const donorEq = equipments.find(e => (e.equip_no || e.no_unit) === s.donor_unit);
                  const recEq = equipments.find(e => (e.equip_no || e.no_unit) === (s.recipient_unit || (s as any).target_unit));

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
                          {s.recipient_unit || (s as any).target_unit || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={s.reason}>
                        {s.reason || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={async () => {
                            const newStatus = isActive ? 'Restored' : 'Active';
                            try {
                              const res = await api.updateSwabStatus(s.id || '', newStatus);
                              if (res.success) onRefresh();
                              else alert(res.message || 'Gagal mengubah status');
                            } catch (err: any) {
                              alert('Error: ' + err.message);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider cursor-pointer hover:opacity-80 transition-opacity ${
                            isActive
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title="Klik untuk ubah status swab"
                        >
                          {isActive ? 'Aktif Terpasang' : 'Sudah Dikembalikan'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-semibold">{s.pic || (s as any).authorized_by || (s as any).mechanic || '-'}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedSwab(s)}
                            title="Lihat Detail Berita Acara & Approval"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => printSwabDocument(s, donorEq, recEq)}
                            title="Cetak Berita Acara PDF & Lembar Approval"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm(`Hapus catatan swab komponen "${s.component_name}"?`)) return;
                              try {
                                const res = await api.deleteSwabComponent(s.id || '');
                                if (res.success) onRefresh();
                                else alert(res.message || 'Gagal menghapus catatan');
                              } catch (err: any) {
                                alert('Error: ' + err.message);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus Catatan Swab"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Berita Acara Swab */}
      {selectedSwab && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <Repeat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Berita Acara Swab: {selectedSwab.component_name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    No. Dokumen: {String(selectedSwab.item_id || selectedSwab.id || '').startsWith('BA-') ? (selectedSwab.item_id || selectedSwab.id) : `BA-SWAB-${selectedSwab.id || selectedSwab.item_id || '01'}`}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedSwab(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
                  <span className="font-bold text-amber-800 text-[10.5px] uppercase tracking-wider block">Unit Donor (Asal Part)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-amber-900">{selectedSwab.donor_unit}</span>
                    <span className="text-slate-500 font-medium">
                      {equipments.find(e => (e.equip_no || e.no_unit) === selectedSwab.donor_unit)?.model || 'Equipment'}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-700 block">Sumber suku cadang kanibalisasi</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1.5">
                  <span className="font-bold text-emerald-800 text-[10.5px] uppercase tracking-wider block">Unit Tujuan (Penerima)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-emerald-900">{selectedSwab.recipient_unit || (selectedSwab as any).target_unit || '-'}</span>
                    <span className="text-slate-500 font-medium">
                      {equipments.find(e => (e.equip_no || e.no_unit) === (selectedSwab.recipient_unit || (selectedSwab as any).target_unit))?.model || 'Equipment'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 block">Prioritas operasional produksi site</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="font-bold text-slate-700 block">Alasan & Urgensi Pemindahan:</span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedSwab.reason || '-'}</p>
              </div>

              {/* Status Lembar Pengesahan & Tanda Tangan Approval */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                    Lembar Pengesahan & Tanda Tangan Approval (Resmi):
                  </span>
                  <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-md">
                    Format Siap Cetak PDF
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[11px]">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">1. Pelaksana</span>
                    <span className="font-bold text-slate-800 block truncate mt-0.5">{selectedSwab.pic || (selectedSwab as any).authorized_by || 'Teknisi Workshop'}</span>
                    <span className="text-[9.5px] text-slate-500 block">Mekanik Lead Hand</span>
                    <span className="inline-block mt-1.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded">Diusulkan</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">2. Spv / Foreman</span>
                    <span className="font-bold text-slate-800 block truncate mt-0.5">{selectedSwab.supervisor || 'Foreman Workshop'}</span>
                    <span className="text-[9.5px] text-slate-500 block">Workshop Supervisor</span>
                    <span className="inline-block mt-1.5 text-[9px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded">Diverifikasi</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">3. Plant Head</span>
                    <span className="font-bold text-slate-800 block truncate mt-0.5">{selectedSwab.approved_by || 'Plant Superintendent'}</span>
                    <span className="text-[9.5px] text-slate-500 block">Dept Head</span>
                    <span className="inline-block mt-1.5 text-[9px] bg-purple-50 text-purple-700 border border-purple-200 font-bold px-2 py-0.5 rounded">Diotorisasi</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-slate-400 text-[11px]">
                <span>Status Swab: <strong className={selectedSwab.status === 'Active' ? 'text-red-600' : 'text-emerald-600'}>{selectedSwab.status === 'Active' ? 'Aktif Terpasang' : 'Sudah Dikembalikan'}</strong></span>
                <span>Tanggal Swab: <strong>{selectedSwab.tanggal}</strong></span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const donorEq = equipments.find(e => (e.equip_no || e.no_unit) === selectedSwab.donor_unit);
                  const recEq = equipments.find(e => (e.equip_no || e.no_unit) === (selectedSwab.recipient_unit || (selectedSwab as any).target_unit));
                  printSwabDocument(selectedSwab, donorEq, recEq);
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md shadow-pink-600/20 active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Berita Acara PDF & Approval</span>
              </button>

              <button
                onClick={() => setSelectedSwab(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

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
