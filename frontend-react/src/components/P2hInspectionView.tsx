import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Send, History, FileText, Eye, Trash2, X, ShieldCheck } from 'lucide-react';
import { Equipment } from '../types';
import { api } from '../services/api';

interface P2hInspectionViewProps {
  equipments: Equipment[];
  onRefresh: () => void;
}

interface CheckItem {
  id: string;
  category: string;
  label: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  note: string;
}

const defaultChecklist: Omit<CheckItem, 'status' | 'note'>[] = [
  { id: 'eng_oil', category: 'Mesin (Engine)', label: 'Level & Kualitas Oli Mesin (Dipstick)' },
  { id: 'coolant', category: 'Mesin (Engine)', label: 'Level Air Radiator & Selang Reservoir' },
  { id: 'belts', category: 'Mesin (Engine)', label: 'Kondisi V-Belt & Kipas Pendingin' },
  { id: 'hyd_oil', category: 'Sistem Hidrolik', label: 'Level Oli Hidrolik di Sight Glass' },
  { id: 'hyd_hoses', category: 'Sistem Hidrolik', label: 'Selang & Fitting Hidrolik Bebas Rembes' },
  { id: 'brake_service', category: 'Pengereman', label: 'Fungsi Service Brake & Pedal Travel' },
  { id: 'brake_park', category: 'Pengereman', label: 'Fungsi Parking Brake & Emergency Brake' },
  { id: 'steering', category: 'Kemudi & Undercarriage', label: 'Respon Kemudi & Sambungan Artikulasi' },
  { id: 'track_tire', category: 'Kemudi & Undercarriage', label: 'Tegangan Track / Tekanan Ban' },
  { id: 'lights_work', category: 'Kelistrikan & Safety', label: 'Lampu Kerja Depan/Belakang & Rotary' },
  { id: 'horn_alarm', category: 'Kelistrikan & Safety', label: 'Klakson & Back Alarm (Mundur)' },
  { id: 'seatbelt', category: 'Kabin & Keselamatan', label: 'Seatbelt, APAR Siap Pakai & Kaca Spion' },
];

export const P2hInspectionView: React.FC<P2hInspectionViewProps> = ({ equipments, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const initialEq = equipments[0];
  const [selectedUnit, setSelectedUnit] = useState(initialEq?.equip_no || initialEq?.no_unit || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [inspector, setInspector] = useState('Operator Pit Lapangan');
  const [shift, setShift] = useState('Shift 1');
  const [catatan, setCatatan] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);

  const [items, setItems] = useState<CheckItem[]>(
    defaultChecklist.map(c => ({ ...c, status: 'PASS', note: '' }))
  );

  // Local sample history
  const [historyList, setHistoryList] = useState<Array<{
    id: string;
    equip_no: string;
    tanggal: string;
    shift: string;
    inspector: string;
    result: string;
    fail_count: number;
    items: CheckItem[];
    catatan: string;
  }>>([
    {
      id: 'INSP-101',
      equip_no: equipments[0]?.equip_no || 'EX-301',
      tanggal: '2026-09-13',
      shift: 'Shift 1',
      inspector: 'Suhartono (Operator)',
      result: 'RFU',
      fail_count: 0,
      items: defaultChecklist.map(c => ({ ...c, status: 'PASS', note: 'Kondisi Baik' })),
      catatan: 'Unit layak operasi pit tanpa kendala.'
    },
    {
      id: 'INSP-102',
      equip_no: equipments[1]?.equip_no || 'DZ-007',
      tanggal: '2026-09-12',
      shift: 'Shift 2',
      inspector: 'Budi Santoso',
      result: 'RWN',
      fail_count: 1,
      items: defaultChecklist.map((c, i) => ({ ...c, status: i === 4 ? 'WARNING' : 'PASS', note: i === 4 ? 'Rembes minor hose boom' : 'Baik' })),
      catatan: 'Perlu pengencangan fitting hose hidrolik boom saat shift pergantian.'
    }
  ]);

  const handleStatusChange = (id: string, status: 'PASS' | 'WARNING' | 'FAIL') => {
    setItems(items.map(it => (it.id === id ? { ...it, status } : it)));
  };

  const failCount = items.filter(it => it.status === 'FAIL').length;
  const warningCount = items.filter(it => it.status === 'WARNING').length;
  const overallResult = failCount > 0 ? 'B/D' : warningCount > 0 ? 'RWN' : 'RFU';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) {
      alert('Pilih unit alat terlebih dahulu!');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        equip_no: selectedUnit,
        tanggal,
        shift,
        inspector,
        status: overallResult,
        items: items,
        catatan: catatan || (overallResult === 'RFU' ? 'Unit fit to operate' : `${failCount} Fail, ${warningCount} Warning`)
      };

      const res = await api.saveInspection(payload);
      if (res.success) {
        setSubmittedSuccess(true);
        setHistoryList(prev => [
          {
            id: `INSP-${Date.now().toString().slice(-4)}`,
            equip_no: selectedUnit,
            tanggal,
            shift,
            inspector,
            result: overallResult,
            fail_count: failCount,
            items: [...items],
            catatan: catatan || 'Inspeksi P2H selesai.'
          },
          ...prev
        ]);
        setItems(defaultChecklist.map(c => ({ ...c, status: 'PASS', note: '' })));
        setCatatan('');
        setActiveTab('history');
        onRefresh();
        setTimeout(() => setSubmittedSuccess(false), 4000);
      } else {
        alert(res.message || 'Gagal menyimpan data P2H');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus catatan inspeksi P2H ini?')) return;
    try {
      const res = await api.deleteInspection(id);
      if (res.success) {
        setHistoryList(prev => prev.filter(h => h.id !== id));
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus inspeksi');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header card */}
      <div className="bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
                P2H &amp; Checklist Inspeksi Harian Alat Berat
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Pemeriksaan Kelayakan Pre-Start (K3 &amp; Keselamatan Operasi)
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'form' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Formulir P2H</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Inspeksi ({historyList.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        /* TAB 1: FORM P2H 12 ITEM */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata Unit Card */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
              1. Identitas Unit &amp; Petugas Inspeksi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Pilih No. Lambung *</label>
                <select
                  value={selectedUnit}
                  onChange={e => setSelectedUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                  required
                >
                  {equipments.map(eq => (
                    <option key={eq.id || eq.equip_no} value={eq.equip_no || eq.no_unit}>
                      {eq.equip_no || eq.no_unit} - {eq.model || eq.type} ({eq.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Tanggal Inspeksi</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Shift</label>
                <select
                  value={shift}
                  onChange={e => setShift(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 font-medium"
                >
                  <option value="Shift 1">Shift 1 (Siang)</option>
                  <option value="Shift 2">Shift 2 (Malam)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Nama Operator / Inspector</label>
                <input
                  type="text"
                  value={inspector}
                  onChange={e => setInspector(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 12 Checklist Items Card */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Poin Checklist Pemeriksaan Kelayakan Harian (12 Poin Standar)
                </h3>
                <p className="text-xs text-slate-400">Tentukan status: PASS (Baik) / WARNING (Catatan) / FAIL (Bahaya)</p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">PASS: {items.filter(i => i.status === 'PASS').length}</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">WARN: {warningCount}</span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700">FAIL: {failCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {idx + 1}. {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'PASS')}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                        item.status === 'PASS'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>PASS</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'WARNING')}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                        item.status === 'WARNING'
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>WARN</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'FAIL')}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center justify-center space-x-1 ${
                        item.status === 'FAIL'
                          ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <label className="block text-slate-600 font-bold mb-1 text-xs">Catatan Kerusakan Tambahan</label>
              <textarea
                rows={2}
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                placeholder="Rincian kerusakan khusus atau instruksi untuk tim maintenance..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">Kesimpulan Kelayakan:</span>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-black ${
                  overallResult === 'RFU'
                    ? 'bg-emerald-100 text-emerald-800'
                    : overallResult === 'RWN'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {overallResult === 'RFU' ? 'RFU (READY TO OPERATE)' : overallResult === 'RWN' ? 'RWN (READY WITH NOTE)' : 'B/D (NOT READY / BREAKDOWN)'}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-60 cursor-pointer flex items-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Menyimpan...' : 'Simpan Laporan P2H'}</span>
            </button>
          </div>
        </form>
      ) : (
        /* TAB 2: RIWAYAT INSPEKSI P2H */
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4">No. P2H</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Unit Alat</th>
                  <th className="py-3 px-4">Shift</th>
                  <th className="py-3 px-4">Inspector</th>
                  <th className="py-3 px-4">Kelayakan</th>
                  <th className="py-3 px-4">Catatan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {historyList.map((hist, idx) => (
                  <tr key={hist.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{hist.id}</td>
                    <td className="py-3.5 px-4 text-slate-500">{hist.tanggal}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black text-[11px]">
                        {hist.equip_no}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{hist.shift}</td>
                    <td className="py-3.5 px-4 text-slate-600">{hist.inspector}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                          hist.result === 'RFU'
                            ? 'bg-emerald-50 text-emerald-700'
                            : hist.result === 'RWN'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {hist.result}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={hist.catatan}>
                      {hist.catatan}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setSelectedDetail(hist)}
                          title="Lihat Rincian 12 Poin Checklist"
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(hist.id)}
                          title="Hapus Catatan P2H"
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Detail 12 Poin Checklist */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Rincian Hasil Inspeksi P2H: {selectedDetail.id}
                  </h3>
                  <p className="text-xs text-slate-400">Unit: {selectedDetail.equip_no} • Petugas: {selectedDetail.inspector}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
              {selectedDetail.items?.map((it: CheckItem, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{it.category}</span>
                    <span className="font-semibold text-slate-800">{it.label}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      it.status === 'PASS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : it.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {it.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs space-y-1">
              <span className="font-bold text-slate-700 block">Catatan Tambahan:</span>
              <p className="text-slate-600">{selectedDetail.catatan || 'Tidak ada catatan khusus.'}</p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
