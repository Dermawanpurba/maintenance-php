import React, { useState } from 'react';
import { Hammer, Search, Plus, CheckCircle2, Clock, X, Trash2 } from 'lucide-react';
import { ToolItem } from '../types';
import { api } from '../services/api';

interface ToolsTrackerViewProps {
  tools: ToolItem[];
  mechanics?: any[];
  onRefresh: () => void;
}

function formatDateDisplay(d?: string) {
  if (!d) return '-';
  try {
    const parts = d.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2].padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day} ${months[monthIdx]} ${year}`;
      }
    }
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export const ToolsTrackerView: React.FC<ToolsTrackerViewProps> = ({ tools, mechanics = [], onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // State untuk modal peminjaman tool
  const [borrowModalTool, setBorrowModalTool] = useState<ToolItem | null>(null);
  const [borrowForm, setBorrowForm] = useState({
    borrower: '',
    borrow_date: new Date().toISOString().split('T')[0],
  });

  // State form pendaftaran alat baru
  const [addForm, setAddForm] = useState<Partial<ToolItem>>({
    tool_id: `TLS-${Date.now().toString().slice(-4)}`,
    tool_name: '',
    category: 'Precision & Torque',
    status: 'AVAILABLE',
    borrower: '',
    borrow_date: '',
  });

  const filtered = tools.filter(t => {
    return (
      (t.tool_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.tool_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.borrower || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleOpenBorrowModal = (tool: ToolItem) => {
    setBorrowModalTool(tool);
    setBorrowForm({
      borrower: tool.borrower || '',
      borrow_date: tool.borrow_date || new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmitBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowModalTool) return;

    if (!borrowForm.borrower.trim()) {
      alert('Nama teknisi / mekanik peminjam wajib diisi!');
      return;
    }
    if (!borrowForm.borrow_date) {
      alert('Tanggal pinjam wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('updateToolBorrowStatus', {
        tool_id: borrowModalTool.tool_id,
        status: 'BORROWED',
        borrower: borrowForm.borrower.trim(),
        borrow_date: borrowForm.borrow_date,
      });

      if (res.success) {
        setBorrowModalTool(null);
        onRefresh();
      } else {
        alert(res.message || 'Gagal memperbarui status alat');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnTool = async (tool: ToolItem) => {
    if (!window.confirm(`Konfirmasi pengembalian perkakas "${tool.tool_name}" ke rak workshop?`)) return;

    try {
      setSubmitting(true);
      const res = await api.postAction('updateToolBorrowStatus', {
        tool_id: tool.tool_id,
        status: 'AVAILABLE',
        borrower: '',
        borrow_date: '',
      });

      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal mengembalikan alat');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
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

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.tool_name?.trim()) {
      alert('Nama alat wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveMasterTool', addForm);
      if (res.success) {
        setIsAddModalOpen(false);
        setAddForm({
          tool_id: `TLS-${Date.now().toString().slice(-4)}`,
          tool_name: '',
          category: 'Precision & Torque',
          status: 'AVAILABLE',
          borrower: '',
          borrow_date: '',
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
          onClick={() => setIsAddModalOpen(true)}
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
                <th className="py-3 px-4 text-center">Aksi Cepat</th>
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
                  const isBorrowed = t.status === 'BORROWED' || t.status === 'DIPINJAM' || t.status === 'IN USE';

                  return (
                    <tr key={t.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                        {t.tool_id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{t.tool_name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{t.category || 'Special Tool'}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
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
                      <td className="py-3.5 px-4 font-medium">
                        {isBorrowed && t.borrow_date ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 font-mono text-[11px] font-bold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            {formatDateDisplay(t.borrow_date)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {isBorrowed ? (
                            <button
                              type="button"
                              onClick={() => handleReturnTool(t)}
                              className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                              title="Kembalikan alat ke rak workshop"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Kembalikan</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenBorrowModal(t)}
                              className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 flex items-center gap-1"
                              title="Catat peminjaman alat"
                            >
                              <Clock className="w-3 h-3" />
                              <span>Pinjam</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(t.id || t.tool_id)}
                            title="Hapus Perkakas"
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
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

      {/* Modal Pinjam Tool (Dengan Input & Tampilan Tanggal Pinjam Jelas) */}
      {borrowModalTool && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Peminjaman Perkakas / Special Tool
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Catat nama teknisi dan tanggal peminjaman</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBorrowModalTool(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Perkakas yang Dipinjam */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mt-4 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-orange-600 text-[11px]">{borrowModalTool.tool_id}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-semibold">{borrowModalTool.category || 'Special Tool'}</span>
              </div>
              <p className="font-black text-slate-900 text-sm leading-snug">{borrowModalTool.tool_name}</p>
            </div>

            <form onSubmit={handleSubmitBorrow} className="space-y-4 mt-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nama Teknisi / Mekanik Peminjam <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={borrowForm.borrower}
                  onChange={e => setBorrowForm({ ...borrowForm, borrower: e.target.value })}
                  placeholder="Ketik nama mekanik peminjam..."
                  list="mechanics-datalist"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 focus:bg-white font-medium"
                  required
                  autoFocus
                />
                {mechanics.length > 0 && (
                  <datalist id="mechanics-datalist">
                    {mechanics.map((m: any, i: number) => (
                      <option key={i} value={m.nama_mekanik || m.nama || m.name} />
                    ))}
                  </datalist>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Tanggal Pinjam <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={borrowForm.borrow_date}
                  onChange={e => setBorrowForm({ ...borrowForm, borrow_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 focus:bg-white font-mono font-medium"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1 font-normal">
                  Tanggal pinjam otomatis terisi hari ini dan dapat diubah sesuai kebutuhan.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBorrowModalTool(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Menyimpan...' : 'Konfirmasi Pinjam'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Tool Baru */}
      {isAddModalOpen && (
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
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 mt-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 mb-1">ID Tool</label>
                <input
                  type="text"
                  value={addForm.tool_id}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Nama Perkakas / Tool</label>
                <input
                  type="text"
                  value={addForm.tool_name}
                  onChange={e => setAddForm({ ...addForm, tool_name: e.target.value })}
                  placeholder="Contoh: Torque Wrench 3/4 800 Nm"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Kategori Perkakas</label>
                <select
                  value={addForm.category}
                  onChange={e => setAddForm({ ...addForm, category: e.target.value })}
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
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
