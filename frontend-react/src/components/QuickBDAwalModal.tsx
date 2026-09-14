import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  Clock,
  Calendar,
  Truck,
  Gauge,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Equipment } from '../types';
import { api } from '../services/api';

interface QuickBDAwalModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipments: Equipment[];
  onSuccess: () => void;
}

export const QuickBDAwalModal: React.FC<QuickBDAwalModalProps> = ({
  isOpen,
  onClose,
  equipments = [],
  onSuccess
}) => {
  const [equipNo, setEquipNo] = useState('');
  const [hm, setHm] = useState<number | string>('');
  const [lokasi, setLokasi] = useState('');
  const [tglRusak, setTglRusak] = useState(() => new Date().toISOString().split('T')[0]);
  const [jamRusak, setJamRusak] = useState(() => new Date().toTimeString().slice(0, 5));
  const [shift, setShift] = useState('1');
  const [kendala, setKendala] = useState('');
  const [pelapor, setPelapor] = useState('Operator Pit');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEquipChange = (val: string) => {
    const code = val.toUpperCase();
    setEquipNo(code);
    const found = equipments.find(
      e => (e.equip_no || e.no_unit || '').toUpperCase() === code
    );
    if (found) {
      if (found.last_hm) setHm(found.last_hm);
      if (found.lokasi) setLokasi(found.lokasi);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipNo.trim() || !kendala.trim()) {
      setErrorMsg('Harap lengkapi nomor lambung unit dan deskripsi kendala.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const payload = {
        equip_no: equipNo.trim().toUpperCase(),
        hm_km: Number(hm) || 0,
        kendala: kendala.trim(),
        tgl_rusak: tglRusak,
        jam_rusak: jamRusak,
        shift,
        pelapor: pelapor.trim(),
        lokasi: lokasi.trim()
      };

      const res = await api.saveBDAwal(payload);
      if (res && res.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(res?.message || 'Gagal menyimpan laporan breakdown awal.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan komunikasi dengan server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Alert Gradient */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-sm md:text-base uppercase tracking-wider">
                Lapor Breakdown Awal (B/D)
              </h3>
              <p className="text-[11px] text-red-100">
                Penerbitan darurat Work Order & penguncian armada unit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                No Lambung Unit (Wajib)
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  list="quickEquipList"
                  value={equipNo}
                  onChange={e => handleEquipChange(e.target.value)}
                  placeholder="Ketik kode unit"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase focus:bg-white focus:border-red-500 outline-none"
                />
                <datalist id="quickEquipList">
                  {equipments.map((eq, i) => (
                    <option key={i} value={eq.equip_no || eq.no_unit} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                HM Saat Rusak
              </label>
              <div className="relative">
                <Gauge className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.1"
                  value={hm}
                  onChange={e => setHm(e.target.value)}
                  placeholder="0.0"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                Tgl Rusak
              </label>
              <input
                type="date"
                value={tglRusak}
                onChange={e => setTglRusak(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                Jam Rusak
              </label>
              <input
                type="time"
                value={jamRusak}
                onChange={e => setJamRusak(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                Shift Kerja
              </label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-red-500 outline-none"
              >
                <option value="1">Shift 1 (Siang)</option>
                <option value="2">Shift 2 (Malam)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                Pelapor / Operator
              </label>
              <input
                type="text"
                value={pelapor}
                onChange={e => setPelapor(e.target.value)}
                placeholder="Nama Operator"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
                Lokasi Unit Rusak
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={e => setLokasi(e.target.value)}
                placeholder="Front Pit / Workshop"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">
              Gejala / Kendala Kerusakan Utama (Wajib)
            </label>
            <textarea
              required
              rows={3}
              value={kendala}
              onChange={e => setKendala(e.target.value)}
              placeholder="Contoh: Low power saat beban penuh, temperatur engine overheat 105C, alarm buzzing..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:bg-white focus:border-red-500 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              {loading ? 'Menyimpan...' : 'Kirim Laporan BD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
