import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck, X, Trash2, Edit, Calendar, Clock, Gauge } from 'lucide-react';
import { Equipment, PlanAlat, PlanService } from '../types';
import { api } from '../services/api';

interface EquipmentViewProps {
  equipments: Equipment[];
  planAlats?: PlanAlat[];
  planServices?: PlanService[];
  onNavigate?: (tab: string) => void;
  onRefresh: () => void;
}

type EquipTab = 'armada' | 'plan_service';

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  equipments,
  planAlats = [],
  planServices = [],
  onNavigate,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<EquipTab>('armada');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State for Unit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state for Equipment
  const [form, setForm] = useState<Equipment>({
    no_unit: '',
    tipe: 'Excavator',
    model: '',
    lokasi: 'Pit 1',
    status: 'READY',
    last_hm: 0,
    serial_number: '',
  });

  // Modal State for Plan Service
  const [isPlanServiceModalOpen, setIsPlanServiceModalOpen] = useState(false);
  const [planServiceForm, setPlanServiceForm] = useState<Partial<PlanService>>({
    equip_no: equipments[0]?.no_unit || '',
    model: equipments[0]?.model || '',
    last_service_date: new Date().toISOString().split('T')[0],
    last_service_hm: 2500,
    next_service_hm: 2750,
    kategori: 'PS 250',
    plan_hours_per_month: 400,
  });

  const types = Array.from(new Set(equipments.map(e => e.tipe).filter(Boolean)));

  const filtered = equipments.filter(eq => {
    const matchSearch =
      (eq.no_unit || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.model || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.lokasi || '').toLowerCase().includes(search.toLowerCase()) ||
      (eq.serial_number || '').toLowerCase().includes(search.toLowerCase());

    const matchType = typeFilter === 'ALL' || eq.tipe === typeFilter;
    const matchStatus = statusFilter === 'ALL' || (eq.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchSearch && matchType && matchStatus;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.no_unit.trim()) {
      alert('Nomor Unit wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.saveMaster({
        type: 'equip',
        data: form,
      });

      if (res.success) {
        setIsModalOpen(false);
        setIsEditing(false);
        setForm({
          no_unit: '',
          tipe: 'Excavator',
          model: '',
          lokasi: 'Pit 1',
          status: 'READY',
          last_hm: 0,
          serial_number: '',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan unit');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEquip = async (no_unit: string) => {
    if (!window.confirm(`Yakin ingin menghapus unit ${no_unit}? Data jadwal service dan plan alat terkait juga akan dihapus.`)) return;
    try {
      const res = await api.deleteMasterEquip(no_unit);
      if (res.success) onRefresh();
      else alert(res.message || 'Gagal menghapus unit');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };


  const handleSavePlanService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planServiceForm.equip_no) return;
    try {
      setSubmitting(true);
      const res = await api.saveMaster({
        type: 'PlanService',
        payload: planServiceForm,
      });
      if (res.success) {
        setIsPlanServiceModalOpen(false);
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan Plan Service');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlanService = async (equip_no: string) => {
    if (!window.confirm(`Hapus jadwal Plan Service untuk unit ${equip_no}?`)) return;
    try {
      const res = await api.deletePlan({ equip_no, type: 'PlanService' });
      if (res.success) onRefresh();
      else alert(res.message || 'Gagal menghapus jadwal service');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subtab Navigation Pill Card */}
      <div className="bg-white border border-slate-200/80 p-2 rounded-2xl shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('armada')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'armada'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Master Armada ({equipments.length})</span>
          </button>


          <button
            type="button"
            onClick={() => setActiveTab('plan_service')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'plan_service'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Estimasi Service (Plan Service)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER ARMADA */}
      {activeTab === 'armada' && (
        <>
          {/* Top Filter & Action Bar Card */}
          <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari unit / model / SN..."
                  className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-72 font-medium transition-all"
                />
              </div>

              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
              >
                <option value="ALL">Semua Jenis Unit</option>
                {types.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
              >
                <option value="ALL">Semua Status</option>
                <option value="READY">READY (RFU)</option>
                <option value="BREAKDOWN">BREAKDOWN (BD)</option>
                <option value="STANDBY">STANDBY</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setForm({
                  no_unit: '',
                  tipe: 'Excavator',
                  model: '',
                  lokasi: 'Pit 1',
                  status: 'READY',
                  last_hm: 0,
                  serial_number: '',
                });
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm shadow-blue-500/30 transition-all hover:shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Unit Armada</span>
            </button>
          </div>

          {/* Equipment Table Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                    <th className="py-3 px-4">No. Unit</th>
                    <th className="py-3 px-4">Model &amp; Tipe</th>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">Lokasi Operasi</th>
                    <th className="py-3 px-4">Akumulasi HM</th>
                    <th className="py-3 px-4">Status Unit</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        Tidak ada unit armada yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((eq, idx) => {
                      const s = (eq.status || 'READY').toUpperCase();
                      const isReady = s === 'READY' || s === 'OPERASI' || s === 'RFU';
                      const isBreakdown = s === 'BREAKDOWN' || s === 'BD' || s === 'REPAIR';

                      return (
                        <tr key={eq.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 font-black text-xs font-mono">
                              {eq.no_unit}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-800">{eq.model || '-'}</div>
                            <div className="text-[10px] text-slate-400">{eq.tipe || 'Heavy Equipment'}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-500">{eq.serial_number || '-'}</td>
                          <td className="py-3 px-4 font-semibold text-slate-700">{eq.lokasi || 'Site Plant'}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            {Number(eq.last_hm || 0).toLocaleString()} Jam
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                isReady
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                                  : isBreakdown
                                  ? 'bg-red-100 text-red-800 border border-red-300/60'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300/60'
                              }`}
                            >
                              {eq.status || 'READY'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsEditing(true);
                                  setForm({ ...eq });
                                  setIsModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit Data Unit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEquip(eq.no_unit)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Hapus Unit"
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
        </>
      )}

      {/* TAB 3: ESTIMASI SERVICE BERKALA (PLAN SERVICE) */}
      {activeTab === 'plan_service' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 p-4 md:p-5 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Jadwal &amp; Estimasi Service Preventif (Plan Service)
              </h3>
              <p className="text-[11px] text-slate-500">
                Monitoring jadwal servis berkala (PS 250, PS 500, PS 1000, PS 2000) dan jam service berikutnya
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPlanServiceModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-sm shadow-blue-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Plan Service</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                    <th className="py-3 px-4">No. Unit</th>
                    <th className="py-3 px-4">Model Alat</th>
                    <th className="py-3 px-4">Jenis Service</th>
                    <th className="py-3 px-4">HM Servis Terakhir</th>
                    <th className="py-3 px-4">HM Servis Berikutnya</th>
                    <th className="py-3 px-4">Tgl Servis Terakhir</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {planServices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        Belum ada jadwal Plan Service tersimpan. Silakan klik "Jadwalkan Plan Service".
                      </td>
                    </tr>
                  ) : (
                    planServices.map((ps, idx) => (
                      <tr key={ps.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{ps.equip_no}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{ps.model || '-'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 border border-purple-300 font-black text-[10px]">
                            {ps.kategori || 'PS 250'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {Number(ps.last_service_hm || 0).toLocaleString()} Jam
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-amber-600">
                          {Number(ps.next_service_hm || 0).toLocaleString()} Jam
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{ps.last_service_date || '-'}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeletePlanService(ps.equip_no)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog Tambah / Edit Unit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {isEditing ? `Edit Unit Armada ${form.no_unit}` : 'Pendaftaran Unit Armada Baru'}
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
                  <label className="block text-slate-600 mb-1">Nomor Unit / CN</label>
                  <input
                    type="text"
                    value={form.no_unit}
                    onChange={e => setForm({ ...form, no_unit: e.target.value })}
                    placeholder="Contoh: EX-201"
                    disabled={isEditing}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 uppercase font-black outline-none focus:border-blue-500 disabled:opacity-60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Jenis / Tipe Unit</label>
                  <select
                    value={form.tipe}
                    onChange={e => setForm({ ...form, tipe: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="Excavator">Excavator</option>
                    <option value="Dump Truck">Dump Truck</option>
                    <option value="Bulldozer">Bulldozer</option>
                    <option value="Wheel Loader">Wheel Loader</option>
                    <option value="Motor Grader">Motor Grader</option>
                    <option value="Support Truck">Support Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Model / Seri</label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={e => setForm({ ...form, model: e.target.value })}
                    placeholder="Contoh: CAT 320D / PC200"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Serial Number (SN)</label>
                  <input
                    type="text"
                    value={form.serial_number}
                    onChange={e => setForm({ ...form, serial_number: e.target.value })}
                    placeholder="Nomor Seri Rangka / Mesin"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Lokasi Kerja</label>
                  <input
                    type="text"
                    value={form.lokasi}
                    onChange={e => setForm({ ...form, lokasi: e.target.value })}
                    placeholder="Contoh: Pit 1 / Workshop"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Hour Meter (HM) Terakhir</label>
                  <input
                    type="number"
                    value={form.last_hm}
                    onChange={e => setForm({ ...form, last_hm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Status Kesiapan Operasional</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-blue-500 font-bold"
                >
                  <option value="READY">READY (RFU - Siap Kerja)</option>
                  <option value="STANDBY">STANDBY (Cadangan)</option>
                  <option value="BREAKDOWN">BREAKDOWN (BD - Perbaikan)</option>
                  <option value="MAINTENANCE">MAINTENANCE (Servis Rutin)</option>
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Simpan Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Plan Service */}
      {isPlanServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Jadwal Servis Berkala (Plan Service)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanServiceModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlanService} className="space-y-4 mt-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Pilih Unit Armada</label>
                  <select
                    value={planServiceForm.equip_no}
                    onChange={e => {
                      const eq = equipments.find(x => x.no_unit === e.target.value);
                      setPlanServiceForm({ ...planServiceForm, equip_no: e.target.value, model: eq?.model || '' });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold outline-none focus:border-blue-500"
                  >
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.no_unit}>
                        {eq.no_unit} - {eq.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Kategori Service</label>
                  <select
                    value={planServiceForm.kategori}
                    onChange={e => setPlanServiceForm({ ...planServiceForm, kategori: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold outline-none focus:border-blue-500"
                  >
                    <option value="PS 250">PS 250 (Ganti Oli & Filter)</option>
                    <option value="PS 500">PS 500 (Ganti Filter Solar & Oli)</option>
                    <option value="PS 1000">PS 1000 (Ganti Oli Hidrolik / Transmisi)</option>
                    <option value="PS 2000">PS 2000 (Major Service / Overhaul Inspection)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">HM Terakhir Diservis</label>
                  <input
                    type="number"
                    value={planServiceForm.last_service_hm}
                    onChange={e => {
                      const l = Number(e.target.value);
                      setPlanServiceForm({ ...planServiceForm, last_service_hm: l, next_service_hm: l + 250 });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">HM Servis Berikutnya</label>
                  <input
                    type="number"
                    value={planServiceForm.next_service_hm}
                    onChange={e => setPlanServiceForm({ ...planServiceForm, next_service_hm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Tanggal Servis Terakhir</label>
                <input
                  type="date"
                  value={planServiceForm.last_service_date}
                  onChange={e => setPlanServiceForm({ ...planServiceForm, last_service_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPlanServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Jadwal Plan Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
