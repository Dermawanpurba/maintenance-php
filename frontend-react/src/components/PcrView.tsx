import React, { useState } from 'react';
import { Cpu, Search, AlertTriangle, Clock, Plus, CheckCircle2, Trash2, X } from 'lucide-react';
import { PcrItem, Equipment } from '../types';
import { api } from '../services/api';

interface PcrViewProps {
  pcrList: PcrItem[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const PcrView: React.FC<PcrViewProps> = ({ pcrList, equipments, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<PcrItem>>({
    equip_no: equipments[0]?.no_unit || '',
    component_name: '',
    target_lifetime_hm: 10000,
    current_hm: 0,
    estimated_cost: 50000000,
    scheduled_date: new Date().toISOString().split('T')[0],
    status: 'MONITORING',
  });

  const fallbackPcr: PcrItem[] = pcrList.length > 0 ? pcrList : [
    {
      item_id: 'PCR-001',
      equip_no: 'EX-201',
      component_name: 'Engine Complete 6BTAA-5.9',
      target_lifetime_hm: 12000,
      current_hm: 9450,
      remaining_hm: 2550,
      status: 'MONITORING',
      estimated_cost: 165000000,
      scheduled_date: '2026-11-20'
    },
    {
      item_id: 'PCR-002',
      equip_no: 'EX-302',
      component_name: 'Hydraulic Main Pump (K3V140DT)',
      target_lifetime_hm: 10000,
      current_hm: 8800,
      remaining_hm: 1200,
      status: 'PERSIAPAN PR',
      estimated_cost: 85000000,
      scheduled_date: '2026-10-15'
    },
    {
      item_id: 'PCR-003',
      equip_no: 'DZ-002',
      component_name: 'Final Drive LH & RH',
      target_lifetime_hm: 8000,
      current_hm: 6700,
      remaining_hm: 1300,
      status: 'MONITORING',
      estimated_cost: 70000000,
      scheduled_date: '2026-10-30'
    }
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.component_name || !form.equip_no) {
      alert('Nama komponen dan No. Unit wajib diisi!');
      return;
    }

    const target = Number(form.target_lifetime_hm || 10000);
    const current = Number(form.current_hm || 0);
    const remaining = Math.max(0, target - current);

    try {
      setSubmitting(true);
      const res = await api.savePCR({
        ...form,
        target_lifetime_hm: target,
        current_hm: current,
        remaining_hm: remaining,
      });

      if (res.success) {
        setIsModalOpen(false);
        setForm({
          equip_no: equipments[0]?.no_unit || '',
          component_name: '',
          target_lifetime_hm: 10000,
          current_hm: 0,
          estimated_cost: 50000000,
          scheduled_date: new Date().toISOString().split('T')[0],
          status: 'MONITORING',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan data PCR');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Hapus jadwal Plan Component Replacement (PCR) ini?')) return;
    try {
      const res = await api.deletePCR(id);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const filtered = fallbackPcr.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.equip_no || '').toLowerCase().includes(q) ||
      (p.component_name || '').toLowerCase().includes(q) ||
      (p.status || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Total Komponen Terdaftar
            </span>
            <Cpu className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            {fallbackPcr.length} <span className="text-sm font-bold text-slate-500">Major Components</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Engine, Transmisi, Main Pump &amp; Final Drive</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Mendekati Penggantian (&lt;1500h)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-3xl font-black text-amber-600 tracking-tight mt-1">
            {fallbackPcr.filter(p => (p.remaining_hm || 0) <= 1500).length} <span className="text-sm font-bold text-slate-500">Komponen</span>
          </h3>
          <p className="text-[10px] text-amber-700 font-semibold mt-2">Perlu penerbitan Purchase Request (PR)</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-700/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Estimasi Anggaran PCR
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-white tracking-tight mt-1">
            Rp 320 <span className="text-sm font-bold text-slate-400">Juta</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Budgeting Q4 2026</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Plan Component Replacement (PCR Register)
            </h3>
            <p className="text-[11px] text-slate-500">
              Monitoring umur pakai komponen utama dan target lifetime hour meter
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari unit / komponen..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400 font-medium w-44 sm:w-56"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-sm shadow-orange-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Jadwal PCR</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4">Nama Komponen</th>
                <th className="py-3 px-4">Target Lifetime</th>
                <th className="py-3 px-4">Running HM</th>
                <th className="py-3 px-4">Sisa Jam Operasi</th>
                <th className="py-3 px-4">Status &amp; Rencana</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((p, idx) => {
                const target = Number(p.target_lifetime_hm || 10000);
                const current = Number(p.current_hm || 0);
                const remain = Number(p.remaining_hm || (target - current > 0 ? target - current : 0));
                const pct = target > 0 ? Math.round((current / target) * 100) : 0;
                const isCritical = remain <= 1500;

                return (
                  <tr key={p.item_id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-slate-800">
                        {p.equip_no}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {p.component_name}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {target.toLocaleString()} Jam
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {current.toLocaleString()} Jam
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-black ${isCritical ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {remain.toLocaleString()} Jam
                        </span>
                        <span className="text-[10px] text-slate-400">({pct}% used)</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                          isCritical
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {p.status || 'MONITORING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.item_id || p.id || '')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Jadwal PCR"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Perencanaan Ganti Komponen (PCR)
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
                  <label className="block text-slate-600 mb-1">No. Unit Alat Berat</label>
                  <select
                    value={form.equip_no}
                    onChange={e => setForm({ ...form, equip_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-bold"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.no_unit}>
                        {eq.no_unit} - {eq.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Status Rencana</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-bold"
                  >
                    <option value="MONITORING">MONITORING</option>
                    <option value="PERSIAPAN PR">PERSIAPAN PR</option>
                    <option value="WAITING PARTS">WAITING PARTS</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Nama Major Komponen</label>
                <input
                  type="text"
                  value={form.component_name}
                  onChange={e => setForm({ ...form, component_name: e.target.value })}
                  placeholder="Contoh: Engine Complete Cummins / Transmission / Main Pump"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Target Lifetime (Jam/HM)</label>
                  <input
                    type="number"
                    value={form.target_lifetime_hm}
                    onChange={e => setForm({ ...form, target_lifetime_hm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Running HM Komponen</label>
                  <input
                    type="number"
                    value={form.current_hm}
                    onChange={e => setForm({ ...form, current_hm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Estimasi Biaya Komponen (Rp)</label>
                  <input
                    type="number"
                    value={form.estimated_cost}
                    onChange={e => setForm({ ...form, estimated_cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Estimasi Tanggal Penggantian</label>
                  <input
                    type="date"
                    value={form.scheduled_date}
                    onChange={e => setForm({ ...form, scheduled_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono"
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
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Jadwal PCR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
