import React, { useState } from 'react';
import { Package, Search, AlertCircle, Plus, Layers, X } from 'lucide-react';
import { PartItem } from '../types';
import { api } from '../services/api';

interface PartsStockViewProps {
  parts: PartItem[];
  onRefresh: () => void;
}

export const PartsStockView: React.FC<PartsStockViewProps> = ({ parts, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<Partial<PartItem>>({
    part_number: '',
    part_name: '',
    category: 'Fast Moving',
    stock_qty: 0,
    min_stock: 5,
    unit: 'PCS',
    price: 0,
    bin_location: 'Gudang Utama - Rak A1',
  });

  const filtered = parts.filter(p => {
    return (
      (p.part_number || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.part_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.bin_location || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.part_number?.trim() || !form.part_name?.trim()) {
      alert('Nomor part dan nama part wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.postAction('saveMaster', {
        type: 'part',
        data: form
      });

      if (res.success) {
        setIsModalOpen(false);
        setForm({
          part_number: '',
          part_name: '',
          category: 'Fast Moving',
          stock_qty: 0,
          min_stock: 5,
          unit: 'PCS',
          price: 0,
          bin_location: 'Gudang Utama - Rak A1',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan data part');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari part number / nama barang / rak..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56 sm:w-72"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sparepart</span>
        </button>
      </div>

      {/* Parts Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Part Number</th>
                <th className="py-3 px-4">Nama Barang / Deskripsi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Stok Fisik</th>
                <th className="py-3 px-4 text-right">Stok Min.</th>
                <th className="py-3 px-4">Lokasi Rak / Bin</th>
                <th className="py-3 px-4 text-right">Harga Satuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    Tidak ada suku cadang yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filtered.map((pt, idx) => {
                  const isLow = Number(pt.stock_qty || 0) <= Number(pt.min_stock || 0);

                  return (
                    <tr key={pt.id || idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">{pt.part_number}</td>
                      <td className="py-3 px-4 font-semibold text-white">{pt.part_name}</td>
                      <td className="py-3 px-4 text-slate-400">{pt.category || 'General'}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span
                          className={`inline-block px-2 py-0.5 rounded ${
                            isLow ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50' : 'text-slate-100'
                          }`}
                        >
                          {Number(pt.stock_qty || 0).toLocaleString()} {pt.unit || 'PCS'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {Number(pt.min_stock || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{pt.bin_location || '-'}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-200">
                        {Number(pt.price || 0) > 0 ? `Rp ${Number(pt.price).toLocaleString('id-ID')}` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Part Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Tambah Katalog Suku Cadang Baru</span>
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
                <label className="block text-slate-400 mb-1 font-semibold">Nomor Part (Part Number)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1R-0716, 6I-2505, LF9009"
                  value={form.part_number}
                  onChange={e => setForm({ ...form, part_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nama Barang / Deskripsi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Filter Oli Mesin CAT 320D"
                  value={form.part_name}
                  onChange={e => setForm({ ...form, part_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kategori</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Filter & Pelumas">Filter & Pelumas</option>
                    <option value="Fast Moving">Fast Moving</option>
                    <option value="Undercarriage">Undercarriage</option>
                    <option value="Hydraulic System">Hydraulic System</option>
                    <option value="Electrical">Electrical</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Satuan Unit</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Saldo Stok Awal</label>
                  <input
                    type="number"
                    value={form.stock_qty}
                    onChange={e => setForm({ ...form, stock_qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Batas Stok Minimum</label>
                  <input
                    type="number"
                    value={form.min_stock}
                    onChange={e => setForm({ ...form, min_stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Lokasi Bin / Rak</label>
                  <input
                    type="text"
                    placeholder="Rak A1, Bin 03"
                    value={form.bin_location}
                    onChange={e => setForm({ ...form, bin_location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>
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
                  <span>{submitting ? 'Menyimpan...' : 'Simpan Sparepart'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
