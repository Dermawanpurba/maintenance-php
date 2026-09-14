import React, { useState } from 'react';
import {
  Users,
  HardHat,
  Cpu,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { MasterMekanik, MasterPelapor, MasterComponentItem } from '../types';
import { api } from '../services/api';

interface MasterCrewCompViewProps {
  mechanics: MasterMekanik[];
  pelapors?: MasterPelapor[];
  components?: MasterComponentItem[];
  onRefresh?: () => void;
}

type SubTab = 'mekanik' | 'pelapor' | 'komponen';

export const MasterCrewCompView: React.FC<MasterCrewCompViewProps> = ({
  mechanics = [],
  pelapors = [],
  components = [],
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('mekanik');
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal States
  const [modalType, setModalType] = useState<SubTab | null>(null);

  // Form States
  const [formMekanikNama, setFormMekanikNama] = useState('');
  const [formMekanikStatus, setFormMekanikStatus] = useState('AKTIF');

  const [formPelaporNama, setFormPelaporNama] = useState('');
  const [formPelaporJabatan, setFormPelaporJabatan] = useState('Driver / Operator');
  const [formPelaporDept, setFormPelaporDept] = useState('Produksi Pit');

  const [formMajorComp, setFormMajorComp] = useState('');
  const [formMinorComp, setFormMinorComp] = useState('');
  const [formStandardLifetime, setFormStandardLifetime] = useState<number>(5000);

  // Handlers for Mekanik
  const handleSaveMekanik = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMekanikNama.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.saveMekanik({
        nama_mekanik: formMekanikNama.trim(),
        status: formMekanikStatus
      });
      if (res && res.success) {
        setFeedback({ type: 'success', message: 'Mekanik berhasil ditambahkan!' });
        setModalType(null);
        setFormMekanikNama('');
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menyimpan mekanik.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error server.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMekanik = async (id: string | number) => {
    if (!window.confirm('Hapus mekanik ini dari database?')) return;
    try {
      const res = await api.deleteMekanik(id);
      if (res && res.success) {
        setFeedback({ type: 'success', message: 'Mekanik berhasil dihapus!' });
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menghapus mekanik.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error server.' });
    }
  };

  // Handlers for Pelapor
  const handleSavePelapor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPelaporNama.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.savePelapor({
        nama_pelapor: formPelaporNama.trim(),
        jabatan: formPelaporJabatan.trim(),
        departemen: formPelaporDept.trim()
      });
      if (res && res.success) {
        setFeedback({ type: 'success', message: 'Pelapor lapangan berhasil ditambahkan!' });
        setModalType(null);
        setFormPelaporNama('');
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menyimpan pelapor.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error server.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePelapor = async (id: string | number) => {
    if (!window.confirm('Hapus pelapor ini dari database?')) return;
    try {
      const res = await api.deletePelapor(id);
      if (res && res.success) {
        setFeedback({ type: 'success', message: 'Pelapor berhasil dihapus!' });
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menghapus pelapor.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error server.' });
    }
  };

  // Handlers for Component
  const handleSaveComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMajorComp.trim() || !formMinorComp.trim()) return;

    try {
      setSubmitting(true);
      const res = await api.saveMasterComponent({
        major_component: formMajorComp.trim().toUpperCase(),
        minor_component: formMinorComp.trim().toUpperCase(),
        standard_lifetime_hm: Number(formStandardLifetime) || 5000
      });
      if (res && res.success) {
        setFeedback({ type: 'success', message: 'Komponen berhasil ditambahkan!' });
        setModalType(null);
        setFormMajorComp('');
        setFormMinorComp('');
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menyimpan komponen.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error server.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComponent = async (id: string | number) => {
    if (!window.confirm('Hapus komponen ini dari katalog?')) return;
    try {
      const res = await api.deleteMasterComponent(id);
      if (res && res.success) {
        setFeedback({ type: 'success', message: 'Komponen berhasil dihapus!' });
        if (onRefresh) onRefresh();
      } else {
        setFeedback({ type: 'error', message: res?.message || 'Gagal menghapus komponen.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error server.' });
    }
  };

  // Filtered lists
  const filteredMekanik = mechanics.filter(m =>
    (m.nama_mekanik || m.nama || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredPelapor = pelapors.filter(p =>
    (p.nama_pelapor || p.nama || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.departemen || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredComponents = components.filter(c =>
    (c.major_component || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.minor_component || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Banner Header */}
      <div className="bg-[#0f172a] text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Master Directory
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Katalog Sumber Daya Manusia & Komponen
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-cyan-400" />
              Master Crew & Struktur Komponen
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Pengelolaan data induk mekanik workshop, pengawas/pelapor lapangan, dan hierarki komponen alat berat.
            </p>
          </div>

          <button
            onClick={() => setModalType(activeTab)}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            Tambah{' '}
            {activeTab === 'mekanik'
              ? 'Mekanik'
              : activeTab === 'pelapor'
              ? 'Pelapor'
              : 'Komponen'}
          </button>
        </div>

        {/* Sub-Tabs Nav Pills */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => {
              setActiveTab('mekanik');
              setSearch('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeTab === 'mekanik'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            1. Master Mekanik ({mechanics.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('pelapor');
              setSearch('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeTab === 'pelapor'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            2. Master Pelapor ({pelapors.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('komponen');
              setSearch('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeTab === 'komponen'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            3. Master Komponen ({components.length})
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            {feedback.message}
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Cari dalam ${activeTab}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Content Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* SUBTAB 1: MEKANIK */}
        {activeTab === 'mekanik' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-black tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Teknisi / Mekanik</th>
                  <th className="py-3.5 px-4">Status Kerja</th>
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMekanik.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 font-bold">
                      Belum ada data mekanik terdaftar.
                    </td>
                  </tr>
                ) : (
                  filteredMekanik.map((m, idx) => (
                    <tr key={m.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900 uppercase">
                        {m.nama_mekanik || m.nama || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            (m.status || 'AKTIF').toUpperCase() === 'OFF'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {m.status || 'AKTIF'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteMekanik(m.id || m.nama_mekanik || '')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Mekanik"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 2: PELAPOR */}
        {activeTab === 'pelapor' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-black tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Pelapor</th>
                  <th className="py-3.5 px-4">Jabatan</th>
                  <th className="py-3.5 px-4">Departemen</th>
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPelapor.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                      Belum ada data pelapor kerusakan terdaftar.
                    </td>
                  </tr>
                ) : (
                  filteredPelapor.map((p, idx) => (
                    <tr key={p.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900 uppercase">
                        {p.nama_pelapor || p.nama || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-bold">{p.jabatan || 'Operator'}</td>
                      <td className="py-3.5 px-4 text-slate-500">{p.departemen || 'Produksi Pit'}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeletePelapor(p.id || '')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Pelapor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBTAB 3: KOMPONEN */}
        {activeTab === 'komponen' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase font-black tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Major Component</th>
                  <th className="py-3.5 px-4">Minor Component</th>
                  <th className="py-3.5 px-4 text-right">Standard Lifetime</th>
                  <th className="py-3.5 px-4 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComponents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                      Belum ada struktur komponen terdaftar.
                    </td>
                  </tr>
                ) : (
                  filteredComponents.map((c, idx) => (
                    <tr key={c.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {c.major_component}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">
                        {c.minor_component}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700">
                        {Number(c.standard_lifetime_hm || 5000).toLocaleString()} Jam
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteComponent(c.id || '')}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Komponen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals for Create */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                Tambah Data {modalType === 'mekanik' ? 'Mekanik Baru' : modalType === 'pelapor' ? 'Pelapor Lapangan' : 'Komponen Baru'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === 'mekanik' && (
              <form onSubmit={handleSaveMekanik} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nama Mekanik (Wajib)</label>
                  <input
                    type="text"
                    required
                    value={formMekanikNama}
                    onChange={e => setFormMekanikNama(e.target.value)}
                    placeholder="Contoh: Rahmat Hidayat"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Status Keaktifan</label>
                  <select
                    value={formMekanikStatus}
                    onChange={e => setFormMekanikStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="AKTIF">AKTIF (Ready Shift)</option>
                    <option value="OFF">OFF (Cuti / Istirahat)</option>
                  </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setModalType(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">Batal</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                    {submitting ? 'Menyimpan...' : 'Simpan Mekanik'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'pelapor' && (
              <form onSubmit={handleSavePelapor} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Nama Pelapor (Wajib)</label>
                  <input
                    type="text"
                    required
                    value={formPelaporNama}
                    onChange={e => setFormPelaporNama(e.target.value)}
                    placeholder="Nama Operator / Driver"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Jabatan</label>
                  <input
                    type="text"
                    value={formPelaporJabatan}
                    onChange={e => setFormPelaporJabatan(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Departemen</label>
                  <input
                    type="text"
                    value={formPelaporDept}
                    onChange={e => setFormPelaporDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setModalType(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">Batal</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                    {submitting ? 'Menyimpan...' : 'Simpan Pelapor'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'komponen' && (
              <form onSubmit={handleSaveComponent} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Major Component (Wajib)</label>
                  <input
                    type="text"
                    required
                    value={formMajorComp}
                    onChange={e => setFormMajorComp(e.target.value)}
                    placeholder="Contoh: ENGINE, TRANSMISSION, HYDRAULIC"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Minor Component (Wajib)</label>
                  <input
                    type="text"
                    required
                    value={formMinorComp}
                    onChange={e => setFormMinorComp(e.target.value)}
                    placeholder="Contoh: TURBOCHARGER, WATER PUMP"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Target Umur Pakai (Hour Meter)</label>
                  <input
                    type="number"
                    value={formStandardLifetime}
                    onChange={e => setFormStandardLifetime(Number(e.target.value))}
                    placeholder="5000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setModalType(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold">Batal</button>
                  <button type="submit" disabled={submitting} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
                    {submitting ? 'Menyimpan...' : 'Simpan Komponen'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
