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
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar Card */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari part number / nama barang / rak..."
            className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-80 font-medium transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm shadow-amber-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sparepart Gudang</span>
        </button>
      </div>

      {/* Parts Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Part Number</th>
                <th className="py-3 px-4">Nama Sparepart</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Lokasi Rak</th>
                <th className="py-3 px-4">Stok Saat Ini</th>
                <th className="py-3 px-4">Batas Min</th>
                <th className="py-3 px-4">Status Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    Tidak ada data suku cadang yang tercatat.
                  </td>
                </tr>
              ) : (
                filtered.map((p, idx) => {
                  const isLow = Number(p.stock_qty || 0) <= Number(p.min_stock || 0);

                  return (
                    <tr key={p.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-600">
                        {p.part_number}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-bold">{p.part_name}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{p.category || '-'}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{p.bin_location || '-'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {p.stock_qty} {p.unit || 'PCS'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {p.min_stock} {p.unit || 'PCS'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            isLow
                              ? 'bg-red-100 text-red-700 border border-red-300/60'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                          }`}
                        >
                          {isLow ? 'Stok Kritis / Reorder' : 'Tersedia'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog Tambah Sparepart */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Katalog Suku Cadang Gudang
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Part Number</label>
                  <input
                    type="text"
                    value={form.part_number}
                    onChange={e => setForm({ ...form, part_number: e.target.value })}
                    placeholder="Contoh: 1R-0716"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 uppercase font-mono outline-none focus:border-amber-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Kategori</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="Fast Moving">Fast Moving</option>
                    <option value="Filter & Oil">Filter &amp; Oil</option>
                    <option value="Under-carriage">Under-carriage</option>
                    <option value="Hydraulic & Seal">Hydraulic &amp; Seal</option>
                    <option value="Electrical">Electrical</option>
                    <option value="GET & Blade">GET &amp; Blade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Nama Deskripsi Sparepart</label>
                <input
                  type="text"
                  value={form.part_name}
                  onChange={e => setForm({ ...form, part_name: e.target.value })}
                  placeholder="Contoh: Filter Oli Mesin CAT 320D"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={form.stock_qty}
                    onChange={e => setForm({ ...form, stock_qty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Batas Minimal</label>
                  <input
                    type="number"
                    value={form.min_stock}
                    onChange={e => setForm({ ...form, min_stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Satuan</label>
                  <input
                    type="text"
                    value={form.unit}
                    onChange={e => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 uppercase outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Lokasi Bin / Rak Gudang</label>
                <input
                  type="text"
                  value={form.bin_location}
                  onChange={e => setForm({ ...form, bin_location: e.target.value })}
                  placeholder="Contoh: Rak B3 - Tingkat 2"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-amber-500"
                />
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
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Sparepart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
