import React, { useState } from 'react';
import { Wrench, Plus, Search, Printer, Trash2, Edit3, X, AlertTriangle, ShieldAlert, CheckCircle2, Clock3 } from 'lucide-react';
import { WorkOrder, Equipment, MasterMekanik } from '../types';
import { api } from '../services/api';
import { printWorkOrderSPK } from '../utils/printUtils';

interface WorkOrdersViewProps {
  workOrders: WorkOrder[];
  equipments: Equipment[];
  mechanics: MasterMekanik[];
  onRefresh: () => void;
}

interface PartRow {
  part_number: string;
  part_name: string;
  qty: number;
  uom: string;
}

const normalizeBreakdownClass = (value?: string): 'BREAKDOWN SCHEDULED' | 'BREAKDOWN UNSCHEDULED' | '' => {
  const type = String(value || '').trim().toUpperCase().replace(/[\s_-]+/g, ' ');
  if (['UNSCH', 'UNSCHEDULED', 'BREAKDOWN UNSCHEDULED', 'BUS'].includes(type)) return 'BREAKDOWN UNSCHEDULED';
  if (['SCH', 'SCHEDULED', 'BREAKDOWN SCHEDULED', 'BS'].includes(type) || type.startsWith('PM')) return 'BREAKDOWN SCHEDULED';
  return '';
};

export const WorkOrdersView: React.FC<WorkOrdersViewProps> = ({
  workOrders,
  equipments,
  mechanics,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBDModalOpen, setIsBDModalOpen] = useState(false);
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClosureWO, setSelectedClosureWO] = useState<WorkOrder | null>(null);
  const [closureForm, setClosureForm] = useState({
    action_log: '',
    tgl_selesai: new Date().toISOString().split('T')[0],
    jam_selesai: new Date().toTimeString().slice(0, 5),
    tech: ''
  });

  // Quick Breakdown Awal Form State
  const [bdForm, setBdForm] = useState({
    equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
    kendala: '',
    pelapor: 'Operator Pit',
    shift: '1'
  });

  // Comprehensive WO Form State
  const [form, setForm] = useState<{
    no_wo: string;
    equip_no: string;
    brand: string;
    unit_type: string;
    hm_km: number;
    tgl_rusak: string;
    jam_rusak: string;
    tgl_selesai: string;
    jam_selesai: string;
    sch_unsch: string;
    pm_service: string;
    major_comp: string;
    minor_comp: string;
    kendala: string;
    failure_reason: string;
    status: string;
    reported_by: string;
    tech: string;
    action_log: string;
  }>({
    no_wo: `WO-${Date.now().toString().slice(-6)}`,
    equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
    brand: equipments[0]?.brand || '',
    unit_type: equipments[0]?.model || equipments[0]?.unit_type || '',
    hm_km: Number(equipments[0]?.last_hm || 0),
    tgl_rusak: new Date().toISOString().split('T')[0],
    jam_rusak: new Date().toTimeString().slice(0, 5),
    tgl_selesai: '',
    jam_selesai: '',
    sch_unsch: 'BREAKDOWN UNSCHEDULED',
    pm_service: 'Corrective Maintenance',
    major_comp: 'ENGINE',
    minor_comp: '',
    kendala: '',
    failure_reason: '',
    status: 'OPEN',
    reported_by: 'Operator Pit',
    tech: 'Mekanik Workshop',
    action_log: ''
  });

  // Dynamic Part Usage Rows
  const [partRows, setPartRows] = useState<PartRow[]>([]);

  // When equip_no changes, auto fill brand, unit_type, hm_km
  const handleEquipChange = (eqNo: string) => {
    const eq = equipments.find(e => (e.equip_no || e.no_unit) === eqNo);
    setForm(prev => ({
      ...prev,
      equip_no: eqNo,
      brand: eq?.brand || prev.brand,
      unit_type: eq?.model || eq?.unit_type || prev.unit_type,
      hm_km: Number(eq?.last_hm || prev.hm_km)
    }));
  };

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    const initialEq = equipments[0];
    setForm({
      no_wo: `WO-${Date.now().toString().slice(-6)}`,
      equip_no: initialEq?.equip_no || initialEq?.no_unit || '',
      brand: initialEq?.brand || '',
      unit_type: initialEq?.model || initialEq?.unit_type || '',
      hm_km: Number(initialEq?.last_hm || 0),
      tgl_rusak: new Date().toISOString().split('T')[0],
      jam_rusak: new Date().toTimeString().slice(0, 5),
      tgl_selesai: '',
      jam_selesai: '',
      sch_unsch: 'BREAKDOWN UNSCHEDULED',
      pm_service: 'Corrective Maintenance',
      major_comp: 'ENGINE',
      minor_comp: '',
      kendala: '',
      failure_reason: '',
      status: 'OPEN',
      reported_by: 'Operator Pit',
      tech: 'Mekanik Workshop',
      action_log: ''
    });
    setPartRows([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (wo: WorkOrder) => {
    setIsEditMode(true);
    let parts: PartRow[] = [];
    try {
      if (typeof wo.parts_json === 'string') {
        parts = JSON.parse(wo.parts_json || '[]');
      } else if (Array.isArray(wo.parts_json)) {
        parts = wo.parts_json;
      }
    } catch (e) {
      parts = [];
    }

    setForm({
      no_wo: wo.no_wo || '',
      equip_no: wo.equip_no || wo.no_unit || '',
      brand: wo.brand || '',
      unit_type: wo.unit_type || '',
      hm_km: Number(wo.hm_km || 0),
      tgl_rusak: wo.tgl_rusak || wo.tanggal || new Date().toISOString().split('T')[0],
      jam_rusak: wo.jam_rusak || '',
      tgl_selesai: wo.tgl_selesai || '',
      jam_selesai: wo.jam_selesai || '',
      sch_unsch: normalizeBreakdownClass(wo.sch_unsch) || 'BREAKDOWN UNSCHEDULED',
      pm_service: wo.pm_service || 'Corrective Maintenance',
      major_comp: wo.major_comp || 'ENGINE',
      minor_comp: wo.minor_comp || '',
      kendala: wo.kendala || wo.deskripsi || '',
      failure_reason: wo.failure_reason || '',
      status: wo.status || 'OPEN',
      reported_by: wo.reported_by || wo.pelapor || '',
      tech: wo.tech || wo.mekanik || '',
      action_log: wo.action_log || ''
    });
    setPartRows(parts);
    setIsModalOpen(true);
  };

  const handleAddPartRow = () => {
    setPartRows(prev => [...prev, { part_number: '', part_name: '', qty: 1, uom: 'Pcs' }]);
  };

  const handleRemovePartRow = (index: number) => {
    setPartRows(prev => prev.filter((_, i) => i !== index));
  };

  const handlePartRowChange = (index: number, field: keyof PartRow, value: any) => {
    setPartRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const openClosureModal = (wo: WorkOrder) => {
    setSelectedClosureWO(wo);
    setClosureForm({
      action_log: wo.action_log || '',
      tgl_selesai: wo.tgl_selesai || new Date().toISOString().split('T')[0],
      jam_selesai: wo.jam_selesai || new Date().toTimeString().slice(0, 5),
      tech: wo.tech || wo.mekanik || ''
    });
    setIsClosureModalOpen(true);
  };

  const handleStatusChange = async (wo: WorkOrder, newStatus: string) => {
    if (newStatus === 'CLOSED') {
      openClosureModal(wo);
      return;
    }

    try {
      const res = await api.updateWOStatus(wo.no_wo, newStatus);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal mengubah status WO');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCloseWorkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClosureWO) return;
    if (!closureForm.action_log.trim() || !closureForm.tgl_selesai || !closureForm.jam_selesai || !closureForm.tech.trim()) {
      alert('Tindakan perbaikan, tanggal RFU, jam RFU, dan mekanik wajib diisi.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.updateWOStatus(selectedClosureWO.no_wo, 'CLOSED', closureForm);
      if (res.success) {
        setIsClosureModalOpen(false);
        setIsModalOpen(false);
        setSelectedClosureWO(null);
        setForm(prev => ({
          ...prev,
          status: 'CLOSED',
          action_log: closureForm.action_log,
          tgl_selesai: closureForm.tgl_selesai,
          jam_selesai: closureForm.jam_selesai,
          tech: closureForm.tech
        }));
        onRefresh();
      } else {
        alert(res.message || 'Gagal menutup Work Order');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (no_wo: string) => {
    if (!window.confirm(`Yakin ingin menghapus Work Order ${no_wo}?`)) return;
    try {
      const res = await api.deleteWO(no_wo);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus WO');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSaveWO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.equip_no || !form.kendala?.trim()) {
      alert('Harap pilih unit dan isi deskripsi kendala / masalah!');
      return;
    }

    if (form.status === 'CLOSED') {
      openClosureModal(form as WorkOrder);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        parts_json: partRows
      };
      const res = await api.saveWorkOrder(payload);
      if (res.success) {
        setIsModalOpen(false);
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan Work Order');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveBDAwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bdForm.equip_no || !bdForm.kendala.trim()) {
      alert('Harap pilih nomor lambung unit dan isi kendala breakdown!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.saveBDAwal(bdForm);
      if (res.success) {
        setIsBDModalOpen(false);
        setBdForm({
          equip_no: equipments[0]?.equip_no || equipments[0]?.no_unit || '',
          kendala: '',
          pelapor: 'Operator Pit',
          shift: '1'
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal membuat laporan breakdown');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = workOrders.filter(wo => {
    const eq = wo.equip_no || wo.no_unit || '';
    const desc = wo.kendala || wo.deskripsi || '';
    const rep = wo.reported_by || wo.pelapor || '';
    const matchSearch =
      (wo.no_wo || '').toLowerCase().includes(search.toLowerCase()) ||
      eq.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase()) ||
      rep.toLowerCase().includes(search.toLowerCase());

    const s = (wo.status || 'OPEN').toUpperCase();
    const matchStatus = statusFilter === 'ALL' || s === statusFilter.toUpperCase();
    const matchPriority = priorityFilter === 'ALL' || normalizeBreakdownClass(wo.sch_unsch) === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter & Action Bar Card */}
      <div className="bg-white border border-slate-200/80 p-4 md:p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nomor WO / no lambung / kendala..."
              className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 w-56 sm:w-72 font-medium transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all"
          >
            <option value="ALL">Semua Status</option>
            <option value="OPEN">OPEN</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="WAITING PART">WAITING PART</option>
            <option value="CLOSED">CLOSED</option>
            <option value="BREAKDOWN">BREAKDOWN</option>
          </select>

          {/* Priority / Class Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-blue-500 text-slate-700 font-bold transition-all hidden sm:block"
          >
            <option value="ALL">Semua Klasifikasi</option>
            <option value="BREAKDOWN SCHEDULED">BS — Breakdown Scheduled</option>
            <option value="BREAKDOWN UNSCHEDULED">BUS — Breakdown Unscheduled</option>
          </select>
        </div>

        {/* Action Buttons: Quick BD + Buat WO */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => setIsBDModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>+ Quick B/D Awal</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Work Order (WO)</span>
          </button>
        </div>
      </div>

      {/* WO Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">No. WO</th>
                <th className="py-3 px-4">Tanggal Rusak</th>
                <th className="py-3 px-4">Unit Alat</th>
                <th className="py-3 px-4">Layanan / Kendala</th>
                <th className="py-3 px-4">Komponen</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">PIC Mekanik</th>
                <th className="py-3 px-4 text-center">Aksi &amp; Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    Tidak ada Work Order yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((wo, idx) => {
                  const s = (wo.status || 'OPEN').toUpperCase();
                  const isClosed = s === 'CLOSED' || s === 'COMPLETED';
                  const isBreakdown = s === 'BREAKDOWN';
                  const eqNo = wo.equip_no || wo.no_unit || '-';
                  const desc = wo.kendala || wo.deskripsi || '-';
                  const date = wo.tgl_rusak || wo.tanggal || '-';

                  return (
                    <tr key={wo.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {wo.no_wo}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {date} {wo.jam_rusak ? `(${wo.jam_rusak})` : ''}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black text-[11px]">
                          {eqNo}
                        </span>
                        {wo.brand && <span className="block text-[10px] text-slate-400 mt-0.5">{wo.brand} {wo.unit_type}</span>}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate" title={desc}>
                        <span className="font-semibold text-slate-800 block truncate">{desc}</span>
                        <span className="text-[10px] text-slate-400">{wo.pm_service || 'Corrective'}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {wo.major_comp || 'GENERAL'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={s}
                          onChange={e => handleStatusChange(wo, e.target.value)}
                          className={`py-1 px-2 rounded-lg text-[10px] font-bold border outline-none cursor-pointer ${
                            isClosed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : isBreakdown
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : s.includes('WAIT')
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : 'bg-blue-50 text-blue-700 border-blue-300'
                          }`}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="WAITING PART">WAITING PART</option>
                          <option value="BREAKDOWN">BREAKDOWN</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {wo.tech || wo.mekanik || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Print SPK */}
                          <button
                            onClick={() => printWorkOrderSPK(wo)}
                            title="Cetak SPK / Surat Perintah Kerja"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit WO */}
                          <button
                            onClick={() => handleOpenEditModal(wo)}
                            title="Edit Work Order"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete WO */}
                          <button
                            onClick={() => handleDelete(wo.no_wo)}
                            title="Hapus Work Order"
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

      {/* Modal Quick Breakdown Awal */}
      {isBDModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Pelaporan Cepat Breakdown Awal</span>
              </div>
              <button onClick={() => setIsBDModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBDAwal} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Nomor Lambung Unit Breakdown *</label>
                <select
                  value={bdForm.equip_no}
                  onChange={e => setBdForm({ ...bdForm, equip_no: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-red-500"
                  required
                >
                  {equipments.map(eq => (
                    <option key={eq.id || eq.equip_no} value={eq.equip_no || eq.no_unit}>
                      {eq.equip_no || eq.no_unit} - {eq.model || eq.type} ({eq.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Kendala / Kerusakan di Lokasi *</label>
                <textarea
                  rows={3}
                  value={bdForm.kendala}
                  onChange={e => setBdForm({ ...bdForm, kendala: e.target.value })}
                  placeholder="Contoh: Hose hidrolik boom pecah, radiator overheat..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Pelapor</label>
                  <input
                    type="text"
                    value={bdForm.pelapor}
                    onChange={e => setBdForm({ ...bdForm, pelapor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Shift</label>
                  <select
                    value={bdForm.shift}
                    onChange={e => setBdForm({ ...bdForm, shift: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-red-500"
                  >
                    <option value="1">Shift 1 (Siang)</option>
                    <option value="2">Shift 2 (Malam)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-[11px] text-red-700 leading-relaxed">
                Unit akan langsung ditandai berstatus <strong>B/D (Breakdown)</strong> pada sistem, dan nomor tiket Work Order darurat akan dibuat otomatis.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBDModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-600/20"
                >
                  {submitting ? 'Menyimpan...' : 'Kunci Breakdown Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog Buat / Edit WO Lengkap */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {isEditMode ? `Edit Work Order: ${form.no_wo}` : 'Buat Surat Perintah Kerja (WO) Baru'}
                  </h3>
                  <p className="text-xs text-slate-400">Pencatatan perbaikan unit, pemakaian part, dan delegasi teknisi</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWO} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Nomor WO *</label>
                  <input
                    type="text"
                    value={form.no_wo}
                    onChange={e => setForm({ ...form, no_wo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-blue-600 outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Pilih No. Lambung Unit *</label>
                  <select
                    value={form.equip_no}
                    onChange={e => handleEquipChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                    required
                  >
                    {equipments.map(eq => (
                      <option key={eq.id || eq.equip_no} value={eq.equip_no || eq.no_unit}>
                        {eq.equip_no || eq.no_unit} - {eq.model || eq.type} ({eq.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Hour Meter (HM / KM)</label>
                  <input
                    type="number"
                    value={form.hm_km}
                    onChange={e => setForm({ ...form, hm_km: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Tanggal Rusak</label>
                  <input
                    type="date"
                    value={form.tgl_rusak}
                    onChange={e => setForm({ ...form, tgl_rusak: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Jam Rusak</label>
                  <input
                    type="time"
                    value={form.jam_rusak}
                    onChange={e => setForm({ ...form, jam_rusak: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Klasifikasi Breakdown</label>
                  <select
                    value={form.sch_unsch}
                    onChange={e => setForm({ ...form, sch_unsch: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="BREAKDOWN UNSCHEDULED">BUS — Breakdown Unscheduled</option>
                    <option value="BREAKDOWN SCHEDULED">BS — Breakdown Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Status Work Order</label>
                  <select
                    value={form.status}
                    onChange={e => {
                      const newStatus = e.target.value;
                      if (newStatus === 'CLOSED') {
                        setForm(prev => ({ ...prev, status: 'CLOSED' }));
                        openClosureModal({ ...form, status: 'CLOSED' } as WorkOrder);
                        return;
                      }
                      setForm(prev => ({ ...prev, status: newStatus }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700 outline-none focus:border-blue-500"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="WAITING PART">WAITING PART</option>
                    <option value="BREAKDOWN">BREAKDOWN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  {form.status === 'CLOSED' && (
                    <button
                      type="button"
                      onClick={() => openClosureModal(form as WorkOrder)}
                      className="mt-1.5 w-full px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black transition-colors"
                    >
                      Isi / Perbarui Data RFU
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Deskripsi Kendala &amp; Gejala Kerusakan *</label>
                <textarea
                  rows={2}
                  value={form.kendala}
                  onChange={e => setForm({ ...form, kendala: e.target.value })}
                  placeholder="Deskripsikan secara detail gejala kerusakan atau pekerjaan yang dibutuhkan..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Major Component</label>
                  <select
                    value={form.major_comp}
                    onChange={e => setForm({ ...form, major_comp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="ENGINE">ENGINE</option>
                    <option value="TRANSMISSION">TRANSMISSION / DRIVE LINE</option>
                    <option value="HYDRAULIC">HYDRAULIC SYSTEM</option>
                    <option value="ELECTRICAL">ELECTRICAL SYSTEM</option>
                    <option value="UNDERCARRIAGE">UNDERCARRIAGE</option>
                    <option value="BRAKE">BRAKE &amp; STEERING</option>
                    <option value="CHASSIS">CHASSIS &amp; ATTACHMENT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Leader Mekanik / PIC</label>
                  <input
                    type="text"
                    value={form.tech}
                    onChange={e => setForm({ ...form, tech: e.target.value })}
                    placeholder="Nama mekanik penanggung jawab..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Dynamic Parts Usage Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700 text-xs">Alokasi Suku Cadang &amp; Pelumas</span>
                  <button
                    type="button"
                    onClick={handleAddPartRow}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah Baris Part</span>
                  </button>
                </div>

                {partRows.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic py-2">Belum ada suku cadang ditambahkan.</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {partRows.map((row, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Part Number"
                          value={row.part_number}
                          onChange={e => handlePartRowChange(idx, 'part_number', e.target.value)}
                          className="w-36 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Nama Barang / Deskripsi"
                          value={row.part_name}
                          onChange={e => handlePartRowChange(idx, 'part_name', e.target.value)}
                          className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={row.qty}
                          onChange={e => handlePartRowChange(idx, 'qty', Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center"
                        />
                        <input
                          type="text"
                          placeholder="Satuan"
                          value={row.uom}
                          onChange={e => handlePartRowChange(idx, 'uom', e.target.value)}
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePartRow(idx)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Log / Catatan */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">Tindakan Perbaikan &amp; Catatan</label>
                <textarea
                  rows={2}
                  value={form.action_log}
                  onChange={e => setForm({ ...form, action_log: e.target.value })}
                  placeholder="Catatan pelaksanaan pekerjaan teknis..."
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
                  {submitting ? 'Menyimpan...' : (isEditMode ? 'Perbarui Work Order' : 'Simpan Work Order')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal konfirmasi penyelesaian WO dan pelepasan unit menjadi RFU */}
      {isClosureModalOpen && selectedClosureWO && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4 z-[60] overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl my-8 overflow-hidden">
            <div className="bg-emerald-950 text-white px-6 py-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-black">Konfirmasi Unit RFU</h3>
                  <p className="text-xs text-emerald-200 mt-1">
                    Lengkapi hasil pekerjaan sebelum WO {selectedClosureWO.no_wo} ditutup.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClosureModalOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
                aria-label="Tutup formulir penyelesaian WO"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCloseWorkOrder} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Unit</span>
                  <span className="font-black text-slate-900">{selectedClosureWO.equip_no || selectedClosureWO.no_unit || '-'}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Status Setelah Simpan</span>
                  <span className="font-black text-emerald-700">CLOSED / UNIT RFU</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1.5">Action / Tindakan Perbaikan *</label>
                <textarea
                  rows={4}
                  value={closureForm.action_log}
                  onChange={e => setClosureForm(prev => ({ ...prev, action_log: e.target.value }))}
                  placeholder="Contoh: Ganti hose water pump, isi coolant, bleeding system, lalu test run 30 menit—normal."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-black mb-1.5">Tanggal RFU *</label>
                  <input
                    type="date"
                    value={closureForm.tgl_selesai}
                    onChange={e => setClosureForm(prev => ({ ...prev, tgl_selesai: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-black mb-1.5">Jam RFU *</label>
                  <div className="relative">
                    <Clock3 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      type="time"
                      value={closureForm.jam_selesai}
                      onChange={e => setClosureForm(prev => ({ ...prev, jam_selesai: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1.5">Mekanik / PIC Penyelesaian *</label>
                <input
                  type="text"
                  list="closure-mechanics"
                  value={closureForm.tech}
                  onChange={e => setClosureForm(prev => ({ ...prev, tech: e.target.value }))}
                  placeholder="Pilih atau ketik nama mekanik"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  required
                />
                <datalist id="closure-mechanics">
                  {mechanics.map(mechanic => {
                    const name = mechanic.nama_mekanik || mechanic.nama || '';
                    return name ? <option key={mechanic.id || name} value={name} /> : null;
                  })}
                </datalist>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 leading-relaxed">
                Setelah dikonfirmasi, status WO menjadi <strong>CLOSED</strong> dan status unit otomatis menjadi <strong>RFU</strong>.
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsClosureModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-900/15 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Menyimpan Penyelesaian...' : 'Simpan & Jadikan RFU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
