import React, { useState } from 'react';
import { Wallet, Search, TrendingUp, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { MonthlyBudgetItem } from '../types';

interface MonthlyBudgetViewProps {
  budgets: MonthlyBudgetItem[];
  onRefresh: () => void;
}

export const MonthlyBudgetView: React.FC<MonthlyBudgetViewProps> = ({ budgets, onRefresh }) => {
  const [search, setSearch] = useState('');

  const totalPlan = budgets.reduce((acc, b) => acc + Number(b.anggaran || b.budget_plan || 0), 0);
  const totalActual = budgets.reduce((acc, b) => acc + Number(b.realisasi || b.actual_spent || 0), 0);
  const totalVariance = totalPlan - totalActual;
  const utilizationPct = totalPlan > 0 ? Math.round((totalActual / totalPlan) * 100) : 0;

  const filtered = budgets.filter(b => {
    const kat = b.kategori || b.category || '';
    const ket = b.keterangan || b.notes || '';
    const q = search.toLowerCase();
    return kat.toLowerCase().includes(q) || ket.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 4 KPI Cards for Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Card 1: Total Anggaran */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Total Rencana Anggaran
              </span>
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Rp {(totalPlan / 1000000).toFixed(1)} <span className="text-sm font-bold text-slate-500">Juta</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Periode: September 2026</span>
            <span className="text-blue-600 font-bold">{budgets.length} Pos Alokasi</span>
          </div>
        </div>

        {/* Card 2: Realisasi Terpakai */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Realisasi Biaya Operasi
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Rp {(totalActual / 1000000).toFixed(1)} <span className="text-sm font-bold text-slate-500">Juta</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Serapan Biaya:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
              {utilizationPct}% Terpakai
            </span>
          </div>
        </div>

        {/* Card 3: Sisa Anggaran */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Sisa Cadangan Anggaran
              </span>
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-indigo-700 tracking-tight mt-1">
              Rp {(totalVariance / 1000000).toFixed(1)} <span className="text-sm font-bold text-slate-500">Juta</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Status Keuangan:</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-100/80 px-2 py-0.5 rounded-md">
              SURPLUS / ON BUDGET
            </span>
          </div>
        </div>

        {/* Card 4: Cost per Operating Hour */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-700/50">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Cost Efficiency
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[9px]">
                EFISIEN
              </span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight mt-1">
              ~Rp 148k <span className="text-xs font-bold text-slate-400">/ Jam Unit</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[9.5px] text-slate-400 font-medium">
            <span>Target Cost: &lt;Rp 180k/h</span>
            <span className="text-emerald-400 font-bold">Hemat 17.8%</span>
          </div>
        </div>
      </div>

      {/* Budget Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Rincian Alokasi Anggaran Bulanan Plant
            </h3>
            <p className="text-[11px] text-slate-500">
              Breakdown biaya suku cadang, pelumas, vendor, dan ban alat berat
            </p>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari kategori anggaran..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-800 placeholder-slate-400 font-medium w-48 sm:w-60"
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Kategori Pengeluaran</th>
                <th className="py-3 px-4">Rencana Anggaran</th>
                <th className="py-3 px-4">Realisasi Pengeluaran</th>
                <th className="py-3 px-4">Selisih / Sisa</th>
                <th className="py-3 px-4">Serapan</th>
                <th className="py-3 px-4">Status &amp; Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((b, idx) => {
                const plan = Number(b.anggaran || b.budget_plan || 0);
                const actual = Number(b.realisasi || b.actual_spent || 0);
                const variance = plan - actual;
                const pct = plan > 0 ? Math.round((actual / plan) * 100) : 0;

                return (
                  <tr key={b.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {b.kategori || b.category}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      Rp {plan.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      Rp {actual.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      Rp {variance.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        {pct}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-[9px] uppercase">
                          {b.status || 'ON BUDGET'}
                        </span>
                        <span className="text-slate-500 text-[11px] truncate max-w-xs">
                          {b.keterangan || b.notes || '-'}
                        </span>
                      </div>
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
