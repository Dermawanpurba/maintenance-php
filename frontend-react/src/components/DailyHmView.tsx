import React, { useState, useMemo } from 'react';
import {
  Clock,
  Plus,
  Search,
  Gauge,
  Fuel,
  X,
  Trash2,
  TrendingUp,
  Truck,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { DailyHM, Equipment } from '../types';
import { api } from '../services/api';

interface DailyHmViewProps {
  dailyHms: DailyHM[];
  equipments: Equipment[];
  onRefresh: () => void;
}

export const DailyHmView: React.FC<DailyHmViewProps> = ({
  dailyHms,
  equipments,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const todayStr = new Date().toISOString().split('T')[0];

  // Form state
  const defaultUnit = equipments[0]?.no_unit || equipments[0]?.equip_no || '';
  const [form, setForm] = useState({
    tanggal: todayStr,
    no_unit: defaultUnit,
    hm_awal: 0,
    hm_akhir: 8,
    fuel_liter: 0,
    operator: 'Operator Shift 1',
    shift: 'Shift 1 (Siang)',
  });

  // Calculate deviation per equipment across history
  const hmListWithDeviation = useMemo(() => {
    // Sort chronological ascending to calculate sequence deviation
    const sortedAsc = [...dailyHms].sort((a, b) => {
      const dateA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
      const dateB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
      return dateA - dateB;
    });

    const lastHmAkhirMap: Record<string, number> = {};
    const computed = sortedAsc.map(item => {
      const unitKey = (item.equip_no || item.no_unit || '').toUpperCase();
      let dev: number | null = null;
      const hmAwal = Number(item.hm_awal || 0);
      const hmAkhir = Number(item.hm_akhir || 0);

      if (unitKey && lastHmAkhirMap[unitKey] !== undefined) {
        dev = Number((hmAwal - lastHmAkhirMap[unitKey]).toFixed(2));
      }

      if (unitKey) {
        lastHmAkhirMap[unitKey] = hmAkhir;
      }

      return {
        ...item,
        equip_no: item.equip_no || item.no_unit || '',
        no_unit: item.equip_no || item.no_unit || '',
        deviasi: dev
      };
    });

    // Now sort descending for table display (newest first)
    return computed.sort((a, b) => {
      const dateA = a.tanggal ? new Date(a.tanggal).getTime() : 0;
      const dateB = b.tanggal ? new Date(b.tanggal).getTime() : 0;
      return dateB - dateA;
    });
  }, [dailyHms]);

  // KPI Metrics
  const kpis = useMemo(() => {
    const totalRecords = hmListWithDeviation.length;
    const totalHmOperasi = hmListWithDeviation.reduce((acc, curr) => {
      const diff = Number(curr.total_hm) || Math.max(0, Number(curr.hm_akhir || 0) - Number(curr.hm_awal || 0));
      return acc + diff;
    }, 0);

    const uniqueUnits = new Set(hmListWithDeviation.map(h => (h.equip_no || h.no_unit || '').toUpperCase()).filter(Boolean)).size;

    const withDev = hmListWithDeviation.filter(h => h.deviasi !== null);
    const accurateCount = withDev.filter(h => h.deviasi === 0).length;
    const accuracyPercent = withDev.length > 0 ? Math.round((accurateCount / withDev.length) * 100) : 100;

    return {
      totalRecords,
      totalHmOperasi: totalHmOperasi.toFixed(1),
      uniqueUnits,
      accuracyPercent
    };
  }, [hmListWithDeviation]);

  // Filtered dataset
  const filtered = useMemo(() => {
    return hmListWithDeviation.filter(hm => {
      const unit = (hm.equip_no || hm.no_unit || '').toLowerCase();
      const op = (hm.operator || '').toLowerCase();
      const tgl = (hm.tanggal || '').toLowerCase();
      const q = search.toLowerCase();

      const matchSearch = unit.includes(q) || op.includes(q) || tgl.includes(q);
      const matchUnit = unitFilter === 'ALL' || (hm.equip_no || hm.no_unit || '').toUpperCase() === unitFilter.toUpperCase();

      return matchSearch && matchUnit;
    });
  }, [hmListWithDeviation, search, unitFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleUnitSelect = (no_unit: string) => {
    const eq = equipments.find(e => (e.no_unit || e.equip_no) === no_unit);
    const lastHm = Number(eq?.last_hm || 0);
    setForm(prev => ({
      ...prev,
      no_unit,
      hm_awal: lastHm,
      hm_akhir: lastHm + 8
    }));
  };

  const handleOpenModal = () => {
    const defaultEq = equipments[0];
    const initialUnit = defaultEq?.no_unit || defaultEq?.equip_no || '';
    const initialLastHm = Number(defaultEq?.last_hm || 0);
    setForm({
      tanggal: todayStr,
      no_unit: initialUnit,
      hm_awal: initialLastHm,
      hm_akhir: initialLastHm + 8,
      fuel_liter: 0,
      operator: 'Operator Shift 1',
      shift: 'Shift 1 (Siang)',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const unit = (form.no_unit || '').trim().toUpperCase();
    if (!unit) {
      alert('Pilih unit terlebih dahulu!');
      return;
    }

    const hmAwal = Number(form.hm_awal);
    const hmAkhir = Number(form.hm_akhir);

    if (hmAkhir < hmAwal) {
      alert('HM Akhir tidak boleh lebih kecil dari HM Awal!');
      return;
    }

    const total_hm = Number((hmAkhir - hmAwal).toFixed(2));

    try {
      setSubmitting(true);
      const payload = {
        tanggal: form.tanggal,
        equip_no: unit,
        no_unit: unit,
        hm_awal: hmAwal,
        hm_akhir: hmAkhir,
        total_hm,
        fuel_liter: Number(form.fuel_liter) || 0,
        operator: form.operator,
        shift: form.shift
      };

      const res = await api.postAction('saveDailyHM', payload);

      if (res && res.success) {
        setIsModalOpen(false);
        onRefresh();
      } else {
        alert(res?.message || 'Gagal menyimpan data Hour Meter');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus catatan Hour Meter ini?')) return;
    try {
      const res = await api.deleteDailyHM(id);
      if (res && res.success) {
        onRefresh();
      } else {
        alert(res?.message || 'Gagal menghapus data HM');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shadow-sm">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Log Hour Meter & Pemakaian Bahan Bakar
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pencatatan HM awal & akhir harian, validasi deviasi operasi unit, dan konsumsi solar tambang.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            Refresh Data
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-600/30 transition-all hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Input Daily HM</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Catatan HM</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {kpis.totalRecords}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Data tercatat di sistem
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Jam Operasi</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-600 mt-2 font-mono">
            {kpis.totalHmOperasi} <span className="text-xs font-bold text-slate-500">Jam</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Akumulasi delta HM unit
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Armada Terdata</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {kpis.uniqueUnits} <span className="text-xs font-bold text-slate-500">Unit</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Armada aktif beroperasi
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Akurasi Deviasi</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            {kpis.accuracyPercent}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Sinkronisasi HM antar-shift
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari unit, tanggal (YYYY-MM-DD), operator..."
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 focus:bg-white text-slate-800 placeholder-slate-400 font-medium transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={unitFilter}
              onChange={e => {
                setUnitFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 text-slate-700 font-bold"
            >
              <option value="ALL">Semua Unit ({equipments.length})</option>
              {equipments.map(eq => {
                const u = eq.no_unit || eq.equip_no || '';
                return (
                  <option key={eq.id || u} value={u}>
                    {u} - {eq.model}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <span className="font-bold text-slate-800">{filtered.length}</span> catatan
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 w-32">Tanggal</th>
                <th className="py-3.5 px-4 w-32">Kode Unit</th>
                <th className="py-3.5 px-4 w-36">Shift / Operator</th>
                <th className="py-3.5 px-4 text-right w-24">HM Awal</th>
                <th className="py-3.5 px-4 text-right w-24">HM Akhir</th>
                <th className="py-3.5 px-4 text-right w-32">Total Jam</th>
                <th className="py-3.5 px-4 text-right w-28">Bahan Bakar</th>
                <th className="py-3.5 px-4 text-center w-36">Validasi Deviasi</th>
                <th className="py-3.5 px-4 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400 font-bold">
                    Tidak ada catatan Hour Meter yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedData.map((hm, idx) => {
                  const unitName = hm.equip_no || hm.no_unit || '-';
                  const hmAwal = Number(hm.hm_awal || 0);
                  const hmAkhir = Number(hm.hm_akhir || 0);
                  const totalHm = Number(hm.total_hm) || Math.max(0, hmAkhir - hmAwal);

                  // Deviasi badge
                  let devBadge = <span className="text-[10px] text-slate-400 font-bold">Data Awal</span>;
                  if (hm.deviasi !== null && hm.deviasi !== undefined) {
                    if (hm.deviasi === 0) {
                      devBadge = (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                          AKURAT
                        </span>
                      );
                    } else if (hm.deviasi > 0) {
                      devBadge = (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black">
                          +{hm.deviasi.toFixed(1)} h
                        </span>
                      );
                    } else {
                      devBadge = (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black">
                          {hm.deviasi.toFixed(1)} h
                        </span>
                      );
                    }
                  }

                  return (
                    <tr key={hm.id || hm.item_id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-600 font-mono text-[11px]">
                        {hm.tanggal}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-black text-xs uppercase tracking-tight">
                          {unitName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-[11px]">{hm.shift || 'Shift 1'}</div>
                        <div className="text-[10px] text-slate-400">{hm.operator || 'Operator Site'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-xs">
                        {hmAwal.toLocaleString('id-ID', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-900 font-bold text-xs">
                        {hmAkhir.toLocaleString('id-ID', { minimumFractionDigits: 1 })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono font-black text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-lg border border-purple-100 text-xs">
                          +{totalHm.toFixed(1)} Jam
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono font-bold text-amber-600 text-xs">
                          {hm.fuel_liter ? `${hm.fuel_liter} L` : '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {devBadge}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(hm.id || hm.item_id)}
                          title="Hapus Catatan HM"
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all active:scale-95 inline-flex"
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50/50">
            <div>
              Halaman <span className="font-bold text-slate-900">{currentPage}</span> dari <span className="font-bold text-slate-900">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog Input HM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Input Log Hour Meter (HM) Harian
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Catat pergerakan jam operasi unit armada.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-5 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 text-[11px] uppercase tracking-wider font-bold">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={form.tanggal}
                    onChange={e => setForm({ ...form, tanggal: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 text-[11px] uppercase tracking-wider font-bold">Shift Kerja</label>
                  <select
                    value={form.shift}
                    onChange={e => setForm({ ...form, shift: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-purple-500 focus:bg-white font-bold"
                  >
                    <option value="Shift 1 (Siang)">Shift 1 (Siang)</option>
                    <option value="Shift 2 (Malam)">Shift 2 (Malam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 text-[11px] uppercase tracking-wider font-bold">Kode Unit Armada</label>
                <select
                  required
                  value={form.no_unit}
                  onChange={e => handleUnitSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-purple-500 focus:bg-white font-black text-sm"
                >
                  {equipments.map(eq => {
                    const u = eq.no_unit || eq.equip_no || '';
                    return (
                      <option key={eq.id || u} value={u}>
                        {u} - {eq.model} (Last HM: {eq.last_hm || 0})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
                <div>
                  <label className="block text-purple-900 mb-1 text-[11px] uppercase tracking-wider font-bold">HM Awal</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.hm_awal}
                    onChange={e => setForm({ ...form, hm_awal: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-slate-900 font-mono text-sm font-bold outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-purple-900 mb-1 text-[11px] uppercase tracking-wider font-bold">HM Akhir</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.hm_akhir}
                    onChange={e => setForm({ ...form, hm_akhir: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-purple-200 text-purple-700 font-mono text-sm font-black outline-none focus:border-purple-500"
                  />
                </div>
                <div className="col-span-2 pt-1 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Estimasi Jam Operasi:</span>
                  <span className="font-mono font-black text-purple-700">
                    +{Math.max(0, Number(form.hm_akhir) - Number(form.hm_awal)).toFixed(2)} Jam
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 text-[11px] uppercase tracking-wider font-bold">Konsumsi Solar (Liter)</label>
                  <input
                    type="number"
                    step="1"
                    value={form.fuel_liter}
                    onChange={e => setForm({ ...form, fuel_liter: Number(e.target.value) })}
                    placeholder="Contoh: 120"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 text-[11px] uppercase tracking-wider font-bold">Nama Operator / Driver</label>
                  <input
                    type="text"
                    value={form.operator}
                    onChange={e => setForm({ ...form, operator: e.target.value })}
                    placeholder="Nama operator"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md shadow-purple-600/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Daily HM'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
