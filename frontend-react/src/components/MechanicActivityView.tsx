import React, { useState, useMemo } from 'react';
import {
  HardHat,
  Plus,
  Search,
  Clock,
  Wrench,
  Trash2,
  X,
  Users,
  CheckCircle2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { MechanicActivity, MasterMekanik, WorkOrder } from '../types';
import { api } from '../services/api';

interface MechanicActivityViewProps {
  activities: MechanicActivity[];
  mechanics: MasterMekanik[];
  workOrders: WorkOrder[];
  onRefresh: () => void;
}

interface ActivityRowItem {
  id: string;
  no_wo: string;
  aktifitas: string;
  jam_mulai: string;
  jam_selesai: string;
}

export const MechanicActivityView: React.FC<MechanicActivityViewProps> = ({
  activities,
  mechanics,
  workOrders,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [mechanicFilter, setMechanicFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const todayStr = new Date().toISOString().split('T')[0];

  // Default known mechanics pool
  const defaultMechanicNames = [
    'Agus Priyono',
    'Bambang Irawan',
    'Tim Mekanik KBCT',
    'Tim Mekanik LMP',
    'Andi Herwan (PMC)',
    'Hariadi (GM & Mgr. Maintenance)',
    'Rudi Hermawan',
    'Budi Hartono',
    'Dedi Prasetyo',
    'Slamet Riyadi'
  ];

  const availableMechanics = useMemo(() => {
    const list = new Set<string>();
    defaultMechanicNames.forEach(m => list.add(m));
    mechanics.forEach(m => {
      const name = m.nama || m.nama_mekanik;
      if (name) list.add(name);
    });
    activities.forEach(a => {
      if (a.mekanik) {
        a.mekanik.split(',').forEach(part => {
          const trimmed = part.trim();
          if (trimmed) list.add(trimmed);
        });
      }
    });
    return Array.from(list);
  }, [mechanics, activities]);

  // Form State
  const [formDate, setFormDate] = useState(todayStr);
  const [selectedMechanics, setSelectedMechanics] = useState<string[]>([]);
  const [customMechanic, setCustomMechanic] = useState('');
  const [activityRows, setActivityRows] = useState<ActivityRowItem[]>([
    {
      id: 'row_1',
      no_wo: workOrders[0]?.no_wo || '',
      aktifitas: '',
      jam_mulai: '08:00',
      jam_selesai: '10:00'
    }
  ]);

  // Helper to calculate duration in hours
  const calculateDuration = (start?: string, end?: string): string => {
    if (!start || !end || start === '-' || end === '-') return '-';
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return '-';
      let startMins = sh * 60 + sm;
      let endMins = eh * 60 + em;
      if (endMins < startMins) endMins += 24 * 60; // Cross midnight
      const diffHrs = (endMins - startMins) / 60;
      return `${diffHrs.toFixed(1)} Jam`;
    } catch {
      return '-';
    }
  };

  // KPI calculations
  const kpis = useMemo(() => {
    const totalCount = activities.length;

    const uniqueMekanikSet = new Set<string>();
    activities.forEach(a => {
      if (a.mekanik) {
        a.mekanik.split(',').forEach(p => uniqueMekanikSet.add(p.trim()));
      }
    });

    const uniqueWoSet = new Set<string>();
    activities.forEach(a => {
      if (a.no_wo) uniqueWoSet.add(a.no_wo.trim());
    });

    let totalDurationMins = 0;
    activities.forEach(a => {
      if (a.jam_mulai && a.jam_selesai) {
        const [sh, sm] = a.jam_mulai.split(':').map(Number);
        const [eh, em] = a.jam_selesai.split(':').map(Number);
        if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
          let smins = sh * 60 + sm;
          let emins = eh * 60 + em;
          if (emins < smins) emins += 24 * 60;
          totalDurationMins += (emins - smins);
        }
      }
    });

    const totalHours = (totalDurationMins / 60).toFixed(1);

    return {
      totalCount,
      uniqueMekanikCount: uniqueMekanikSet.size,
      uniqueWoCount: uniqueWoSet.size,
      totalHours
    };
  }, [activities]);

  // Filtered dataset
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activities.filter(act => {
      const tgl = (act.tanggal || '').toLowerCase();
      const wo = (act.no_wo || '').toLowerCase();
      const meks = (act.mekanik || '').toLowerCase();
      const desc = (act.aktifitas || '').toLowerCase();

      const matchSearch = tgl.includes(q) || wo.includes(q) || meks.includes(q) || desc.includes(q);
      const matchMek = mechanicFilter === 'ALL' || meks.includes(mechanicFilter.toLowerCase());

      return matchSearch && matchMek;
    });
  }, [activities, search, mechanicFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const toggleMechanic = (name: string) => {
    setSelectedMechanics(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const handleAddCustomMechanic = () => {
    const trimmed = customMechanic.trim();
    if (!trimmed) return;
    if (!selectedMechanics.includes(trimmed)) {
      setSelectedMechanics(prev => [...prev, trimmed]);
    }
    setCustomMechanic('');
  };

  const handleAddRow = () => {
    setActivityRows(prev => [
      ...prev,
      {
        id: 'row_' + Date.now() + Math.random().toString().slice(-4),
        no_wo: workOrders[0]?.no_wo || 'WO-001201',
        aktifitas: '',
        jam_mulai: '08:00',
        jam_selesai: '10:00'
      }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (activityRows.length <= 1) {
      alert('Minimal harus ada 1 baris aktivitas pekerjaan.');
      return;
    }
    setActivityRows(prev => prev.filter(r => r.id !== id));
  };

  const handleRowChange = (id: string, field: keyof ActivityRowItem, value: string) => {
    setActivityRows(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleOpenModal = () => {
    setFormDate(todayStr);
    setSelectedMechanics(['Agus Priyono']);
    setActivityRows([
      {
        id: 'row_' + Date.now(),
        no_wo: workOrders[0]?.no_wo || 'WO-001201',
        aktifitas: '',
        jam_mulai: '08:00',
        jam_selesai: '10:00'
      }
    ]);
    setIsModalOpen(true);
  };

  const handleSaveActivities = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMechanics.length === 0) {
      alert('Harap pilih minimal 1 mekanik yang bertugas!');
      return;
    }

    // Validate rows
    for (let i = 0; i < activityRows.length; i++) {
      const row = activityRows[i];
      if (!row.aktifitas.trim()) {
        alert(`Harap isi deskripsi pekerjaan pada baris #${i + 1}!`);
        return;
      }
    }

    try {
      setSubmitting(true);
      const mechanicString = selectedMechanics.join(', ');

      for (const row of activityRows) {
        await api.saveActivityLog({
          tanggal: formDate,
          no_wo: row.no_wo,
          mekanik: mechanicString,
          aktifitas: row.aktifitas.trim(),
          jam_mulai: row.jam_mulai,
          jam_selesai: row.jam_selesai
        });
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert('Gagal menyimpan aktivitas: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Yakin ingin menghapus catatan aktivitas ini?')) return;
    try {
      const res = await api.deleteActivity(id);
      if (res && res.success) {
        onRefresh();
      } else {
        alert(res?.message || 'Gagal menghapus aktivitas');
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
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-sm">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Laporan Aktivitas Team Mekanik & Logsheet Lapangan
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pencatatan rincian logsheet pekerjaan perbaikan, durasi jam kerja, dan penugasan team teknisi workshop.
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
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/30 transition-all hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Aktivitas Mekanik</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Laporan Aktivitas</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
            {kpis.totalCount}
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Catatan logsheet tersimpan
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mekanik Terlibat</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 mt-2 font-mono">
            {kpis.uniqueMekanikCount} <span className="text-xs font-bold text-slate-500">Teknisi</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Mekanik aktif mengisi logsheet
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Akumulasi Jam Kerja</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
            {kpis.totalHours} <span className="text-xs font-bold text-slate-500">Jam</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Waktu efektif pekerjaan
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Work Order Ditangani</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600 mt-2 font-mono">
            {kpis.uniqueWoCount} <span className="text-xs font-bold text-slate-500">SPK/WO</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            Terkait surat perintah kerja
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
              placeholder="Cari mekanik, no WO, tindakan perbaikan, tanggal..."
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 font-medium transition-all"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={mechanicFilter}
              onChange={e => {
                setMechanicFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-slate-700 font-bold"
            >
              <option value="ALL">Semua Mekanik</option>
              {availableMechanics.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan <span className="font-bold text-slate-800">{filtered.length}</span> aktivitas
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                <th className="py-3.5 px-4 w-32">Tanggal</th>
                <th className="py-3.5 px-4 w-36">No. Work Order</th>
                <th className="py-3.5 px-4 w-48">Mekanik Bertugas</th>
                <th className="py-3.5 px-4">Deskripsi Aktivitas / Logsheet</th>
                <th className="py-3.5 px-4 text-center w-24">Jam Mulai</th>
                <th className="py-3.5 px-4 text-center w-24">Jam Selesai</th>
                <th className="py-3.5 px-4 text-center w-28">Durasi</th>
                <th className="py-3.5 px-4 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400 font-bold">
                    Tidak ada catatan aktivitas mekanik yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((act, idx) => {
                  const duration = calculateDuration(act.jam_mulai, act.jam_selesai);
                  return (
                    <tr key={act.id || act.item_id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-600 font-mono text-[11px]">
                        {act.tanggal || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-black text-xs uppercase tracking-tight">
                          {act.no_wo || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(act.mekanik || '-').split(',').map((m, i) => (
                            <span
                              key={i}
                              className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100"
                            >
                              {m.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold text-xs">
                        {act.aktifitas || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                          {act.jam_mulai || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold">
                          {act.jam_selesai || '-'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 text-xs">
                          {duration}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(act.id || act.item_id)}
                          title="Hapus Catatan Aktivitas"
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

      {/* Modal Dialog Input Laporan Aktivitas Mekanik */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Input Laporan Aktivitas Team Mekanik
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Catat rincian jam kerja teknisi dan uraian pekerjaan lapangan.
                  </p>
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

            <form onSubmit={handleSaveActivities} className="space-y-5 mt-5 text-xs font-semibold">
              {/* Tanggal */}
              <div className="w-full sm:w-1/2">
                <label className="block text-slate-600 mb-1 text-[11px] uppercase tracking-wider font-bold">
                  Tanggal Aktivitas
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              {/* Pilih Mekanik */}
              <div className="space-y-2">
                <label className="block text-slate-600 text-[11px] uppercase tracking-wider font-bold">
                  Pilih Team Mekanik yang Bertugas ({selectedMechanics.length} Terpilih)
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {availableMechanics.map(m => {
                      const isSelected = selectedMechanics.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleMechanic(m)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{m}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add extra mechanic */}
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/60">
                    <input
                      type="text"
                      value={customMechanic}
                      onChange={e => setCustomMechanic(e.target.value)}
                      placeholder="Tambah nama mekanik baru..."
                      className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-amber-500 flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomMechanic}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Activity Rows */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-slate-600 text-[11px] uppercase tracking-wider font-bold">
                    Daftar Pekerjaan / Tindakan Logsheet
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Baris</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activityRows.map((row, idx) => {
                    const rowDur = calculateDuration(row.jam_mulai, row.jam_selesai);
                    return (
                      <div
                        key={row.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                            Pekerjaan #{idx + 1}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              Durasi: {rowDur}
                            </span>
                            {activityRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(row.id)}
                                className="p-1 rounded text-rose-500 hover:bg-rose-50"
                                title="Hapus Baris"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                          <div className="sm:col-span-4">
                            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                              Pilih Work Order (WO)
                            </label>
                            <input
                              type="text"
                              list="woListModal"
                              required
                              value={row.no_wo}
                              onChange={e => handleRowChange(row.id, 'no_wo', e.target.value)}
                              placeholder="No. WO..."
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none focus:border-amber-500"
                            />
                            <datalist id="woListModal">
                              {workOrders.map(w => (
                                <option key={w.id || w.no_wo} value={w.no_wo}>
                                  {w.no_wo} - {w.equip_no || w.no_unit} ({w.kendala || 'WO'})
                                </option>
                              ))}
                            </datalist>
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                              Deskripsi Pekerjaan / Action
                            </label>
                            <input
                              type="text"
                              required
                              value={row.aktifitas}
                              onChange={e => handleRowChange(row.id, 'aktifitas', e.target.value)}
                              placeholder="Contoh: Ganti filter oli & hose..."
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                              Jam Mulai
                            </label>
                            <input
                              type="time"
                              required
                              value={row.jam_mulai}
                              onChange={e => handleRowChange(row.id, 'jam_mulai', e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-slate-500 text-[10px] uppercase font-bold mb-0.5">
                              Jam Selesai
                            </label>
                            <input
                              type="time"
                              required
                              value={row.jam_selesai}
                              onChange={e => handleRowChange(row.id, 'jam_selesai', e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Cancel Actions */}
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
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-md shadow-amber-600/30 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Laporan Aktivitas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
