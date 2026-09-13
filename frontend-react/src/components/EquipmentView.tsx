import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { Equipment } from '../types';
import { api } from '../services/api';

interface EquipmentViewProps {
  equipments: Equipment[];
  onRefresh: () => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({ equipments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<Equipment>({
    no_unit: '',
    tipe: 'Excavator',
    model: '',
    lokasi: 'Pit 1',
    status: 'READY',
    last_hm: 0,
    serial_number: '',
  });

  const types = Array.from(new Set(equipments.map(e => e.tipe).filter(Boolean)));

  const filtered = equipments.filter(eq => {
    const matchSearch =
      (eq.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.model || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.lokasi || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.serial_number || '').toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'ALL' || eq.tipe === typeFilter;
    const matchStatus = statusFilter === 'ALL' || (eq.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchSearch && matchType && matchStatus;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit.trim()) {
      alert('Nomor Unit wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveMaster', {
        type: 'equip',
        data: form
      });

      if (res.success) {
        setIsModalOpen(false);
        setForm({
          no_unit: '',
          tipe: 'Excavator',
          model: '',
          lokasi: 'Pit 1',
          status: 'READY',
          last_hm: 0,
          serial_number: '',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan unit');
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari unit / model / SN..."
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-72 font-medium transition-all"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
          >
            <option value="ALL">Semua Jenis Unit</option>
            {types.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
          >
            <option value="ALL">Semua Status</option>
            <option value="READY">READY (RFU)</option>
            <option value="BREAKDOWN">BREAKDOWN (BD)</option>
            <option value="STANDBY">STANDBY</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm shadow-blue-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Unit Armada</span>
        </button>
      </div>

      {/* Equipment Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4">Model &amp; Tipe</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4">Lokasi Operasi</th>
                <th className="py-3 px-4">Akumulasi HM</th>
                <th className="py-3 px-4">Status Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ada unit armada yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filtered.map((eq, idx) => {
                  const s = (eq.status || 'READY').toUpperCase();
                  const isReady = s === 'READY' || s === 'OPERASI' || s === 'RFU';
                  const isBreakdown = s === 'BREAKDOWN' || s === 'BD' || s === 'REPAIR';

                  return (
                    <tr key={eq.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-black text-xs font-mono">
                          {eq.no_unit}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{eq.model || '-'}</div>
                        <div className="text-[10px] text-slate-400">{eq.tipe || 'Heavy Equipment'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{eq.serial_number || '-'}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{eq.lokasi || 'Site Plant'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {Number(eq.last_hm || 0).toLocaleString()} Jam
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                              : isBreakdown
                              ? 'bg-red-100 text-red-800 border border-red-300/60'
                              : 'bg-amber-100 text-amber-800 border border-amber-300/60'
                          }`}
                        >
                          {eq.status || 'READY'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Tambah Unit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Pendaftaran Unit Armada Baru
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
                  <label className="block text-slate-600 mb-1">Nomor Unit / CN</label>
                  <input
                    type="text"
                    value={form.no_unit}
                    onChange={e => setForm({ ...form, no_unit: e.target.value })}
                    placeholder="Contoh: EX-201"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 uppercase font-black outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Jenis / Tipe Unit</label>
                  <select
                    value={form.tipe}
                    onChange={e => setForm({ ...form, tipe: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Excavator">Excavator</option>
                    <option value="Dump Truck">Dump Truck</option>
                    <option value="Bulldozer">Bulldozer</option>
                    <option value="Wheel Loader">Wheel Loader</option>
                    <option value="Motor Grader">Motor Grader</option>
                    <option value="Support Truck">Support Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Model / Seri</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={e => setForm({ ...form, model: e.target.value })}
                    placeholder="Contoh: CAT 320D / PC200"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Serial Number (SN)</label>
                  <input
                    type="text"
                    value={form.serial_number}
                    onChange={e => setForm({ ...form, serial_number: e.target.value })}
                    placeholder="Nomor Seri Rangka / Mesin"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Lokasi Kerja</label>
                  <input
                    type="text"
                    value={form.lokasi}
                    onChange={e => setForm({ ...form, lokasi: e.target.value })}
                    placeholder="Contoh: Pit 1 / Workshop"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Hour Meter (HM) Terakhir</label>
                  <input
                    type="number"
                    value={form.last_hm}
                    onChange={e => setForm({ ...form, last_hm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Status Kesiapan Operasional</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
                >
                  <option value="READY">READY (RFU - Siap Kerja)</option>
                  <option value="STANDBY">STANDBY (Cadangan)</option>
                  <option value="BREAKDOWN">BREAKDOWN (BD - Perbaikan)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Servis Rutin)</option>
                </select>
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
