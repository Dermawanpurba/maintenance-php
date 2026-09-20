import React, { useState } from 'react';
import { FileSpreadsheet, Plus, Search, AlertOctagon, X, AlertTriangle, Eye, Trash2, ShieldAlert, CheckCircle2, Printer } from 'lucide-react';
import { FARRecord, Equipment } from '../types';
import { api } from '../services/api';
import { printFARDocument, printFARSummaryReport } from '../utils/printUtils';

interface FailureAnalysisViewProps {
  fars: FARRecord[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const FailureAnalysisView: React.FC<FailureAnalysisViewProps> = ({ fars, equipments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAR, setSelectedFAR] = useState<FARRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form with 5-Why Root Cause Analysis
  const initialEq = equipments[0];
  const [form, setForm] = useState({
    far_number: `FAR-${Date.now().toString().slice(-4)}`,
    tanggal: new Date().toISOString().split('T')[0],
    no_unit: initialEq?.equip_no || initialEq?.no_unit || '',
    damage_part: '',
    failure_mode: 'OVERHEAT',
    why_1: '',
    why_2: '',
    why_3: '',
    why_4: '',
    why_5: '',
    root_cause: '',
    corrective_action: '',
    preventive_action: '',
    pic: 'Hariadi (GM / Plant Team)'
  });

  const filtered = fars.filter(f => {
    const eq = f.equip_no || f.no_unit || '';
    const part = f.damage_part || f.component || '';
    const cause = f.root_cause || '';
    return (
      (f.far_number || '').toLowerCase().includes(search.toLowerCase()) ||
      eq.toLowerCase().includes(search.toLowerCase()) ||
      part.toLowerCase().includes(search.toLowerCase()) ||
      cause.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit || !form.damage_part.trim()) {
      alert('Nomor unit dan komponen yang rusak wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const combinedRootCause = form.root_cause.trim() ||
        [form.why_1, form.why_2, form.why_3, form.why_4, form.why_5].filter(Boolean).join(' -> ');

      const payload = {
        ...form,
        root_cause: combinedRootCause
      };

      const res = await api.saveFAR(payload);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          far_number: `FAR-${Date.now().toString().slice(-4)}`,
          tanggal: new Date().toISOString().split('T')[0],
          no_unit: initialEq?.equip_no || initialEq?.no_unit || '',
          damage_part: '',
          failure_mode: 'OVERHEAT',
          why_1: '',
          why_2: '',
          why_3: '',
          why_4: '',
          why_5: '',
          root_cause: '',
          corrective_action: '',
          preventive_action: '',
          pic: 'Hariadi (GM / Plant Team)'
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

  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus laporan investigasi FAR ini?')) return;
    try {
      const res = await api.deleteFAR(id);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus FAR');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar Card */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari No FAR / unit / komponen / akar masalah..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-red-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => printFARSummaryReport(filtered)}
            className="flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Cetak Rekapitulasi Laporan FAR Periode Berjalan"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Cetak Rekap PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Laporan FAR (5-Why)</span>
          </button>
        </div>
      </div>

      {/* FAR Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">No. FAR</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Unit Alat</th>
                <th className="py-3 px-4">Komponen Gagal</th>
                <th className="py-3 px-4">Akar Masalah (RCA)</th>
                <th className="py-3 px-4">Tindakan Korektif</th>
                <th className="py-3 px-4">Investigator / PIC</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Tidak ada laporan Failure Analysis yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((far, idx) => {
                  const eq = far.equip_no || far.no_unit || '-';
                  const comp = far.damage_part || far.component || (far as any).component_name || '-';
                  const date = far.incident_date || far.tanggal || '-';
                  const rawId = String(far.far_number || far.item_id || far.id || '');
                  const farNumber = rawId.startsWith('FAR-') ? rawId : (rawId ? `FAR-${rawId}` : '-');
                  const rca = far.root_cause || (far as any).chronology || '-';
                  const investigator = far.pic || far.leader || (far as any).lead_investigator || '-';
                  const matchedEq = equipments.find(e => (e.equip_no || e.no_unit) === eq);

                  return (
                    <tr key={far.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                        {farNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{date}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black text-[11px]">
                          {eq}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{comp}</td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={rca}>
                        {rca}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-emerald-700 font-medium" title={far.corrective_action}>
                        {far.corrective_action || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{investigator}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setSelectedFAR(far)}
                            title="Lihat Detail 5-Why RCA & Approval"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => printFARDocument(far, matchedEq)}
                            title="Cetak Dokumen FAR PDF & Lembar Approval"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(far.id)}
                            title="Hapus FAR"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
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

      {/* Modal Detail 5-Why RCA */}
      {selectedFAR && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Detail Failure Analysis Report: {String(selectedFAR.far_number || selectedFAR.item_id || selectedFAR.id).startsWith('FAR-') ? (selectedFAR.far_number || selectedFAR.item_id || selectedFAR.id) : `FAR-${selectedFAR.id}`}
                  </h3>
                  <p className="text-xs text-slate-400">Unit: {selectedFAR.equip_no || selectedFAR.no_unit} • Komponen: {selectedFAR.damage_part || selectedFAR.component || (selectedFAR as any).component_name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedFAR(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="font-bold text-slate-700 block">Analisis Akar Masalah (Root Cause):</span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedFAR.root_cause || '-'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
                <span className="font-bold text-emerald-800 block">Tindakan Korektif Langsung:</span>
                <p className="text-emerald-900 leading-relaxed font-medium">{selectedFAR.corrective_action || '-'}</p>
              </div>

              {selectedFAR.preventive_action && (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 space-y-2">
                  <span className="font-bold text-blue-800 block">Tindakan Pencegahan Sistemik (Preventive):</span>
                  <p className="text-blue-900 leading-relaxed font-medium">{selectedFAR.preventive_action}</p>
                </div>
              )}

              {/* Status Lembar Pengesahan & Tanda Tangan Approval */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider block">
                    Lembar Pengesahan & Tanda Tangan Approval (Resmi):
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                    Format Siap Cetak PDF
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-[11px]">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">1. Investigator</span>
                    <span className="font-bold text-slate-800 block truncate mt-0.5">{selectedFAR.pic || selectedFAR.leader || (selectedFAR as any).lead_investigator || 'Hariadi'}</span>
                    <span className="text-[9.5px] text-slate-500 block">Lead Mekanik</span>
                    <span className="inline-block mt-1.5 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded">Diselidiki</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">2. Planner / Spv</span>
                    <span className="font-bold text-slate-800 block truncate mt-0.5">{selectedFAR.supervisor || 'Workshop Supervisor'}</span>
                    <span className="text-[9.5px] text-slate-500 block">Supervisor Site</span>
                    <span className="inline-block mt-1.5 text-[9px] bg-blue-50 text-blue-700 border border-blue-200 font-bold px-2 py-0.5 rounded">Diverifikasi</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                    <span className="text-slate-400 block text-[9.5px] uppercase font-bold">3. Plant Head</span>
                    <span className="font-bold text-slate-800 block truncate mt-0.5">{selectedFAR.approved_by || 'Plant Superintendent'}</span>
                    <span className="text-[9.5px] text-slate-500 block">Dept Head</span>
                    <span className="inline-block mt-1.5 text-[9px] bg-purple-50 text-purple-700 border border-purple-200 font-bold px-2 py-0.5 rounded">Disetujui</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 text-slate-400 text-[11px]">
                <span>Investigator: <strong>{selectedFAR.pic || selectedFAR.leader || 'Tim Reliability'}</strong></span>
                <span>Tanggal Insiden: <strong>{selectedFAR.incident_date || selectedFAR.tanggal}</strong></span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const eq = equipments.find(e => (e.equip_no || e.no_unit) === (selectedFAR.equip_no || selectedFAR.no_unit));
                  printFARDocument(selectedFAR, eq);
                }}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen PDF & Approval</span>
              </button>

              <button
                onClick={() => setSelectedFAR(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog Buat FAR Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Buat Laporan Investigasi Kerusakan (FAR)
                  </h3>
                  <p className="text-xs text-slate-400">Analisis akar masalah kerusakan alat berat dengan metode 5-Why</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Nomor FAR *</label>
                  <input
                    type="text"
                    value={form.far_number}
                    onChange={e => setForm({ ...form, far_number: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-red-600 outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Pilih No. Lambung Unit *</label>
                  <select
                    value={form.no_unit}
                    onChange={e => setForm({ ...form, no_unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-red-500"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id || eq.equip_no} value={eq.equip_no || eq.no_unit}>
                        {eq.equip_no || eq.no_unit} - {eq.model || eq.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Tanggal Insiden</label>
                  <input
                    type="date"
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Komponen Rusak *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Torque Converter, Hydraulic Pump..."
                    value={form.damage_part}
                    onChange={e => setForm({ ...form, damage_part: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Mode Kegagalan (Failure Mode)</label>
                  <select
                    value={form.failure_mode}
                    onChange={e => setForm({ ...form, failure_mode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-red-500"
                  >
                    <option value="OVERHEAT">OVERHEATING / THERMAL BREAKDOWN</option>
                    <option value="SEIZURE">BEARING SEIZURE / JAMMED</option>
                    <option value="CAVITATION">HYDRAULIC CAVITATION &amp; EROSION</option>
                    <option value="FATIGUE">FATIGUE CRACKING / FRACTURE</option>
                    <option value="ELECTRICAL">ELECTRICAL SHORT CIRCUIT / BURN</option>
                  </select>
                </div>
              </div>

              {/* 5-Why Investigation Box */}
              <div className="p-4 rounded-2xl bg-red-50/40 border border-red-200/70 space-y-2">
                <span className="font-bold text-red-900 text-xs block">Investigasi 5-Why Root Cause Analysis:</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Why 1: Kenapa komponen rusak? (Contoh: Suhu oli transmisi melonjak 120°C)"
                    value={form.why_1}
                    onChange={e => setForm({ ...form, why_1: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Why 2: Kenapa suhu melonjak? (Contoh: Oil cooler tertutup lumpur pekat)"
                    value={form.why_2}
                    onChange={e => setForm({ ...form, why_2: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Why 3: Kenapa tertutup lumpur? (Contoh: Jadwal washing bertekanan tidak terlaksana)"
                    value={form.why_3}
                    onChange={e => setForm({ ...form, why_3: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Why 4: Kenapa washing terlewat? (Contoh: Pompa air bertekanan workshop rusak)"
                    value={form.why_4}
                    onChange={e => setForm({ ...form, why_4: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Why 5: Akar Masalah Sistemik: Ketiadaan backup peralatan washing workshop"
                    value={form.why_5}
                    onChange={e => setForm({ ...form, why_5: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Tindakan Korektif (Immediate Action)</label>
                <textarea
                  rows={2}
                  value={form.corrective_action}
                  onChange={e => setForm({ ...form, corrective_action: e.target.value })}
                  placeholder="Langkah perbaikan langsung yang telah dilakukan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Tindakan Pencegahan Berulang (Preventive Action)</label>
                <textarea
                  rows={2}
                  value={form.preventive_action}
                  onChange={e => setForm({ ...form, preventive_action: e.target.value })}
                  placeholder="SOP atau jadwal pencegahan agar insiden tidak terulang..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20"
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
