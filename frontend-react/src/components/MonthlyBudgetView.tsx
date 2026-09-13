import React, { useState } from 'react';
import { Wallet, Search, TrendingUp, CheckCircle2, AlertTriangle, ArrowUpRight, Plus, Trash2, X, DollarSign } from 'lucide-react';
import { MonthlyBudgetItem } from '../types';
import { api } from '../services/api';

interface MonthlyBudgetViewProps {
  budgets: MonthlyBudgetItem[];
  onRefresh: () => void;
}

export const MonthlyBudgetView: React.FC<MonthlyBudgetViewProps> = ({ budgets, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    category: 'Sparepart & Filter Rutin',
    budget_plan: 50000000,
    actual_spent: 0,
    notes: ''
  });

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category.trim()) {
      alert('Kategori anggaran wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.saveMonthlyBudget(form);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          category: 'Sparepart & Filter Rutin',
          budget_plan: 50000000,
          actual_spent: 0,
          notes: ''
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan anggaran');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus pos anggaran ini?')) return;
    try {
      const res = await api.deleteMonthlyBudget(id);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus pos anggaran');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

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

        {/* Card 4: Cost Efficiency */}
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
              Rp 148 <span className="text-sm font-bold text-slate-400">K/Jam</span>
            </h3>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-300 font-medium">
            <span>Target Cost: &lt; Rp 175K/HM</span>
            <span className="text-emerald-400 font-bold">TERKENDALI</span>
          </div>
        </div>
      </div>

      {/* Filter & Add Action Bar */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kategori anggaran / rincian pengeluaran..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pos Anggaran</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Kategori Anggaran</th>
                <th className="py-3 px-4">Rencana Alokasi (Plan)</th>
                <th className="py-3 px-4">Realisasi Belanja (Actual)</th>
                <th className="py-3 px-4">Selisih (Variance)</th>
                <th className="py-3 px-4">Serapan</th>
                <th className="py-3 px-4">Keterangan / Alokasi Khusus</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Tidak ada data anggaran bulanan yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                filtered.map((b, idx) => {
                  const plan = Number(b.anggaran || b.budget_plan || 0);
                  const actual = Number(b.realisasi || b.actual_spent || 0);
                  const variance = plan - actual;
                  const pct = plan > 0 ? Math.round((actual / plan) * 100) : 0;
                  const kat = b.kategori || b.category || 'Operasional';

                  return (
                    <tr key={b.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {kat}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        Rp {plan.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                        Rp {actual.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        Rp {variance.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                          <span className="font-bold text-[11px] text-slate-600">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={b.keterangan || b.notes}>
                        {b.keterangan || b.notes || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(b.id)}
                          title="Hapus Pos Anggaran"
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors inline-flex"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pos Anggaran */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Tambah Pos Anggaran Baru</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Kategori Belanja *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="Sparepart & Filter Rutin">Sparepart &amp; Filter Rutin</option>
                  <option value="Pelumas & Oli Shell/Rimula">Pelumas &amp; Oli Shell/Rimula</option>
                  <option value="Jasa Bubut & Machining Pin">Jasa Bubut &amp; Machining Pin</option>
                  <option value="Ban & Tyre Dump Truck">Ban &amp; Tyre Dump Truck</option>
                  <option value="BBM Solar Workshop">BBM Solar Workshop</option>
                  <option value="Tools & Perlengkapan K3">Tools &amp; Perlengkapan K3</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Rencana Anggaran (Plan Rp) *</label>
                <input
                  type="number"
                  value={form.budget_plan}
                  onChange={e => setForm({ ...form, budget_plan: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Realisasi Belanja Saat Ini (Actual Rp)</label>
                <input
                  type="number"
                  value={form.actual_spent}
                  onChange={e => setForm({ ...form, actual_spent: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-600 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Keterangan / Alokasi Spesifik</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Catatan tujuan alokasi pos anggaran..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 resize-none"
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
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Anggaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
