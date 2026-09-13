import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Send } from 'lucide-react';
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
  { id: 'eng_oil', category: 'Mesin (Engine)', label: 'Level & Kualitas Oli Mesin' },
  { id: 'coolant', category: 'Mesin (Engine)', label: 'Level Air Radiator & Reservoir' },
  { id: 'belts', category: 'Mesin (Engine)', label: 'Kondisi V-Belt & Kipas Pendingin' },
  { id: 'hyd_oil', category: 'Sistem Hidrolik', label: 'Level Oli Hidrolik di Sight Glass' },
  { id: 'hyd_hoses', category: 'Sistem Hidrolik', label: 'Selang & Fitting Hidrolik (Bebas Rembes)' },
  { id: 'brake_service', category: 'Pengereman', label: 'Fungsi Service Brake & Pedal Travel' },
  { id: 'brake_park', category: 'Pengereman', label: 'Fungsi Parking Brake & Emergency Brake' },
  { id: 'steering', category: 'Kemudi & Undercarriage', label: 'Respon Kemudi & Sambungan Artikulasi' },
  { id: 'track_tire', category: 'Kemudi & Undercarriage', label: 'Tegangan Track / Tekanan Ban' },
  { id: 'lights_work', category: 'Kelistrikan & Safety', label: 'Lampu Kerja Depan/Belakang & Rotary' },
  { id: 'horn_alarm', category: 'Kelistrikan & Safety', label: 'Klakson & Back Alarm (Mundur)' },
  { id: 'seatbelt', category: 'Kabin & Keselamatan', label: 'Seatbelt, APAR, & Kaca Spion' },
];

export const P2hInspectionView: React.FC<P2hInspectionViewProps> = ({ equipments, onRefresh }) => {
  const [selectedUnit, setSelectedUnit] = useState(equipments[0]?.no_unit || '');
  const [inspector, setInspector] = useState('Operator / Inspector Shift');
  const [shift, setShift] = useState('Shift 1');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [items, setItems] = useState<CheckItem[]>(
    defaultChecklist.map(c => ({ ...c, status: 'PASS', note: '' }))
  );

  const handleStatusChange = (id: string, status: 'PASS' | 'WARNING' | 'FAIL') => {
    setItems(items.map(it => (it.id === id ? { ...it, status } : it)));
  };

  const handleNoteChange = (id: string, note: string) => {
    setItems(items.map(it => (it.id === id ? { ...it, note } : it)));
  };

  const failCount = items.filter(it => it.status === 'FAIL').length;
  const warningCount = items.filter(it => it.status === 'WARNING').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit) {
      alert('Pilih unit alat terlebih dahulu!');
      return;
    }

    try {
      setSubmitting(true);
      const overallResult = failCount > 0 ? 'NOT_READY' : warningCount > 0 ? 'MONITOR' : 'FIT_TO_OPERATE';

      const res = await api.postAction('saveWorkOrder', {
        no_wo: `P2H-${Date.now().toString().slice(-6)}`,
        tanggal: new Date().toISOString().split('T')[0],
        no_unit: selectedUnit,
        deskripsi: `Inspeksi P2H ${selectedUnit} [Hasil: ${overallResult}]. ${failCount} Fail, ${warningCount} Warning.`,
        prioritas: failCount > 0 ? 'HIGH' : 'NORMAL',
        status: failCount > 0 ? 'OPEN' : 'CLOSED',
        pelapor: inspector,
        mekanik: 'Mekanik P2H',
        catatan: JSON.stringify(items)
      });

      if (res.success) {
        setSubmittedSuccess(true);
        setTimeout(() => setSubmittedSuccess(false), 4000);
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan data P2H');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header card */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-sm flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            <span>Formulir Inspeksi Kelayakan Harian (P2H Digital)</span>
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Pemeriksaan menyeluruh sebelum alat dioperasikan di lapangan (Pre-Start Safety Check).
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center space-x-2">
          {failCount > 0 ? (
            <span className="px-3 py-1 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-800 text-xs font-bold flex items-center space-x-1">
              <XCircle className="w-4 h-4" />
              <span>{failCount} DEFECT (TIDAK SIAP)</span>
            </span>
          ) : warningCount > 0 ? (
            <span className="px-3 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-800 text-xs font-bold flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4" />
              <span>{warningCount} PERLU PENGAWASAN</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>LAIK OPERASI (FIT)</span>
            </span>
          )}
        </div>
      </div>

      {submittedSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs flex items-center space-x-2 font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Hasil inspeksi P2H berhasil disimpan dan tersinkronisasi ke sistem!</span>
        </div>
      )}

      {/* Meta Input Card */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Pilih Unit Alat Berat</label>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold"
            >
              {equipments.map(eq => (
                <option key={eq.no_unit} value={eq.no_unit}>
                  {eq.no_unit} - {eq.tipe} ({eq.model || '-'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Nama Petugas / Operator</label>
            <input
              type="text"
              required
              value={inspector}
              onChange={e => setInspector(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Shift Kerja</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
            >
              <option value="Shift 1">Shift 1 (Pagi / Siang)</option>
              <option value="Shift 2">Shift 2 (Malam)</option>
            </select>
          </div>
        </div>

        {/* Checklist items */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-lg">
          {items.map((item, idx) => (
            <div key={item.id} className="p-3.5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5 max-w-md">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <p className="font-semibold text-white">{item.label}</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'PASS')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      item.status === 'PASS'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    BAIK (PASS)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'WARNING')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      item.status === 'WARNING'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PERHATIAN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item.id, 'FAIL')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                      item.status === 'FAIL'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    RUSAK (FAIL)
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Catatan / Keterangan..."
                  value={item.note}
                  onChange={e => handleNoteChange(item.id, e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs placeholder-slate-500 w-36 sm:w-48 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all hover:-translate-y-0.5"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Menyimpan Hasil P2H...' : 'Kirim Laporan Inspeksi P2H'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
