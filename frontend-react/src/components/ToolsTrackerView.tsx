import React, { useState } from 'react';
import { Hammer, Search, Plus, CheckCircle2, Clock, X } from 'lucide-react';
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
    tool_id: `TOOL-${Date.now().toString().slice(-4)}`,
    tool_name: '',
    category: 'Special Tool',
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
          tool_id: `TOOL-${Date.now().toString().slice(-4)}`,
          tool_name: '',
          category: 'Special Tool',
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari ID alat / nama perkakas / peminjam..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-72"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Special Tool</span>
        </button>
      </div>

      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tool ID</th>
                <th className="py-3 px-4">Nama Perkakas / Special Tool</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Peminjam Terakhir</th>
                <th className="py-3 px-4">Tanggal Pinjam</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Tidak ada perkakas yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((tl, idx) => {
                  const isBorrowed = tl.status === 'BORROWED';

                  return (
                    <tr key={tl.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">{tl.tool_id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{tl.tool_name}</td>
                      <td className="py-3 px-4 text-slate-400">{tl.category || 'Special Tool'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            isBorrowed
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          }`}
                        >
                          {tl.status || 'AVAILABLE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-200">{tl.borrower || '-'}</td>
                      <td className="py-3 px-4 text-slate-400">{tl.borrow_date || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleBorrow(tl)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                            isBorrowed
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isBorrowed ? 'Kembalikan' : 'Pinjam Alat'}
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

      {/* Add Tool Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <Hammer className="w-4 h-4 text-emerald-400" />
                <span>Tambah Special Tool Baru</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">ID Tool</label>
                <input
                  type="text"
                  required
                  value={form.tool_id}
                  onChange={e => setForm({ ...form, tool_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Alat / Perkakas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Torque Wrench 500Nm, Hydraulic Pressure Gauge"
                  value={form.tool_name}
                  onChange={e => setForm({ ...form, tool_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kategori Perkakas</label>
                <input
                  type="text"
                  placeholder="Special Tool, Diagnostic Tool, Lifting Equipment"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center space-x-1"
                >
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Alat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
