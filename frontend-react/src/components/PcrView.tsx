import React, { useState } from 'react';
import { Cpu, Search, AlertTriangle, Clock, Plus, CheckCircle2 } from 'lucide-react';
import { PcrItem, Equipment } from '../types';

interface PcrViewProps {
  pcrList: PcrItem[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const PcrView: React.FC<PcrViewProps> = ({ pcrList, equipments, onRefresh }) => {
  const [search, setSearch] = useState('');

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
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari unit / komponen..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400 font-medium w-48 sm:w-60"
            />
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((p, idx) => {
                const target = Number(p.target_lifetime_hm || 10000);
                const current = Number(p.current_hm || 0);
                const remain = Number(p.remaining_hm || target - current);
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
