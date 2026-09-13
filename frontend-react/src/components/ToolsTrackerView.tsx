import React, { useState } from 'react';
import { Hammer, Search, Plus, CheckCircle2, Clock, X, Trash2 } from 'lucide-react';
import { ToolItem } from '../types';
import { api } from '../services/api';

interface ToolsTrackerViewProps {
  tools: ToolItem[];
  onRefresh: () => void;
}

export const ToolsTrackerView: React.FC<ToolsTrackerViewProps> = ({ tools, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<ToolItem>>({
    tool_id: `TLS-${Date.now().toString().slice(-4)}`,
    tool_name: '',
    category: 'Precision & Torque',
    status: 'AVAILABLE',
    borrower: '',
  });

  const filtered = tools.filter(t => {
    return (
      (t.tool_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.tool_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.borrower || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleToggleBorrow = async (tool: ToolItem) => {
    const isBorrowed = tool.status === 'BORROWED';
    let borrower = '';
    if (!isBorrowed) {
      const input = prompt('Masukkan nama teknisi / mekanik peminjam:');
      if (!input || !input.trim()) return;
      borrower = input.trim();
    }

    try {
      const res = await api.postAction('updateToolBorrowStatus', {
        tool_id: tool.tool_id,
        status: isBorrowed ? 'AVAILABLE' : 'BORROWED',
        borrower: isBorrowed ? '' : borrower,
        borrow_date: isBorrowed ? '' : new Date().toISOString().split('T')[0]
      });

      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal memperbarui status alat');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (toolId: any) => {
    if (!window.confirm('Yakin ingin menghapus perkakas ini?')) return;
    try {
      const res = await api.deleteMasterTool(toolId);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus alat');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tool_name?.trim()) {
      alert('Nama alat wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveMasterTool', form);
      if (res.success) {
        setIsModalOpen(false);
        setForm({
          tool_id: `TLS-${Date.now().toString().slice(-4)}`,
          tool_name: '',
          category: 'Precision & Torque',
          status: 'AVAILABLE',
          borrower: '',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan alat');
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
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari ID alat / nama perkakas / peminjam..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-sm shadow-orange-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Special Tool</span>
        </button>
      </div>

      {/* Tools Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Tool ID</th>
                <th className="py-3 px-4">Nama Perkakas / Special Tool</th>
                <th className="py-3 px-4">Kategori Alat</th>
                <th className="py-3 px-4">Status Pinjam</th>
                <th className="py-3 px-4">Peminjam / PIC</th>
                <th className="py-3 px-4">Tanggal Pinjam</th>
                <th className="py-3 px-4">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada data perkakas yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((t, idx) => {
                  const isBorrowed = t.status === 'BORROWED';

                  return (
                    <tr key={t.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                        {t.tool_id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.tool_name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{t.category || 'Special Tool'}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            isBorrowed
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {isBorrowed ? 'DIPINJAM' : 'TERSEDIA DI RAK'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-semibold">
                        {t.borrower || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {t.borrow_date || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleToggleBorrow(t)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                              isBorrowed
                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                            }`}
                          >
                            {isBorrowed ? 'Kembalikan' : 'Pinjam'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id || t.tool_id)}
                            title="Hapus Perkakas"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Tool */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Hammer className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Pendaftaran Special Tool Workshop
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
              <div>
                <label className="block text-slate-600 mb-1">ID Tool</label>
                <input
                  type="text"
                  value={form.tool_id}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Nama Perkakas / Tool</label>
                <input
                  type="text"
                  value={form.tool_name}
                  onChange={e => setForm({ ...form, tool_name: e.target.value })}
                  placeholder="Contoh: Torque Wrench 3/4 800 Nm"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Kategori Perkakas</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-bold"
                >
                  <option value="Precision & Torque">Precision &amp; Torque</option>
                  <option value="Lifting Equipment">Lifting Equipment</option>
                  <option value="Testing & Diagnostic">Testing &amp; Diagnostic</option>
                  <option value="General Hand Tool">General Hand Tool</option>
                  <option value="Pneumatic & Hydraulic">Pneumatic &amp; Hydraulic</option>
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
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
