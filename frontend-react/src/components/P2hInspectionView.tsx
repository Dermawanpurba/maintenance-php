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
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header card */}
      <div className="bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-900 text-base tracking-tight">
              P2H Digital &amp; Checklist Kelayakan Harian
            </h3>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Pre-Start Safety Inspection sebelum alat berat beroperasi di front tambang
          </p>
        </div>

        {/* Status badges */}
        <div className="flex items-center space-x-2">
          {failCount > 0 ? (
            <span className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 text-xs font-black flex items-center space-x-1.5 border border-red-200">
              <XCircle className="w-4 h-4" />
              <span>{failCount} DEFECT (STOP OPERASI)</span>
            </span>
          ) : warningCount > 0 ? (
            <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-700 text-xs font-black flex items-center space-x-1.5 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
              <span>{warningCount} PERLU MONITOR</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-black flex items-center space-x-1.5 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>UNIT LAYAK OPERASI (RFU)</span>
            </span>
          )}
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm space-y-6">
        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs font-semibold">
          <div>
            <label className="block text-slate-600 mb-1">Pilih Unit Armada</label>
            <select
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
            >
              {equipments.map(eq => (
                <option key={eq.id} value={eq.no_unit}>
                  {eq.no_unit} - {eq.model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Shift Kerja</label>
            <select
              value={shift}
              onChange={e => setShift(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
            >
              <option value="Shift 1">Shift 1 (Pagi / Siang)</option>
              <option value="Shift 2">Shift 2 (Malam)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-600 mb-1">Nama Operator / Pengawas</label>
            <input
              type="text"
              value={inspector}
              onChange={e => setInspector(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Checklist Rows */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Daftar Poin Pemeriksaan Visual &amp; Fisik
          </h4>

          {items.map(it => (
            <div
              key={it.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-600">
                  {it.category}
                </span>
                <p className="font-bold text-slate-800">{it.label}</p>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleStatusChange(it.id, 'PASS')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors cursor-pointer ${
                    it.status === 'PASS'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  OK (Normal)
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(it.id, 'WARNING')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors cursor-pointer ${
                    it.status === 'WARNING'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Note (Perlu Cek)
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(it.id, 'FAIL')}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-colors cursor-pointer ${
                    it.status === 'FAIL'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Defect (Rusak)
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {submittedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hasil P2H berhasil disimpan dan tersinkronisasi!</span>
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Menyimpan...' : 'Kirim Laporan P2H'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
