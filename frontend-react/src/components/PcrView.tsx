import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Search,
  AlertTriangle,
  Clock,
  Plus,
  CheckCircle2,
  Trash2,
  X,
  Printer,
  Zap,
  RefreshCw,
  Layers,
  ShieldAlert,
  ArrowRight,
  Gauge,
  Calendar,
  DollarSign,
  Info,
  ChevronRight
} from 'lucide-react';
import { PcrItem, Equipment, DailyHM } from '../types';
import { api } from '../services/api';
import { printPcrSummaryReport } from '../utils/printUtils';

interface PcrViewProps {
  pcrList: PcrItem[];
  equipments: Equipment[];
  dailyHms?: DailyHM[];
  onRefresh: () => void;
}

const COMMON_COMPONENTS = [
  'Engine Complete',
  'Transmission Unit',
  'Hydraulic Main Pump',
  'Final Drive LH',
  'Final Drive RH',
  'Differential Assembly',
  'Swing Device / Motor',
  'Turbocharger Assembly',
  'Radiator Core Complete'
];

export const PcrView: React.FC<PcrViewProps> = ({
  pcrList,
  equipments,
  dailyHms = [],
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helper untuk mendapatkan HM terkini unit dari Daily HM (fallback: MasterEquip.last_hm)
  const getLatestUnitHm = (equipNo: string): number => {
    if (!equipNo) return 0;
    if (dailyHms && dailyHms.length > 0) {
      const match = dailyHms
        .filter(d => (d.equip_no || d.no_unit) === equipNo)
        .sort((a, b) => {
          const dateComp = (b.tanggal || '').localeCompare(a.tanggal || '');
          if (dateComp !== 0) return dateComp;
          return Number(b.hm_akhir || 0) - Number(a.hm_akhir || 0);
        });
      if (match.length > 0 && match[0].hm_akhir !== undefined && match[0].hm_akhir !== null) {
        return Number(match[0].hm_akhir);
      }
    }
    const eq = equipments.find(e => (e.no_unit || e.equip_no) === equipNo);
    return Number(eq?.last_hm || 0);
  };

  const initialEquip = equipments[0]?.no_unit || '';
  const initialUnitHm = getLatestUnitHm(initialEquip);

  const [form, setForm] = useState<Partial<PcrItem>>({
    equip_no: initialEquip,
    component_name: '',
    install_hm: 0,
    target_lifetime_hm: 10000,
    current_hm: initialUnitHm,
    estimated_cost: 0,
    scheduled_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    status: 'MONITORING',
  });

  // Olah data PCR dengan live sync Daily HM
  const processedPcrList = useMemo(() => {
    return (pcrList || []).map(p => {
      const equipNo = p.equip_no || '';
      const unitLastHm = getLatestUnitHm(equipNo);
      const installHm = Number(p.install_hm || 0);

      // Hitung live running HM:
      // Jika installHm > 0, running HM = max(0, unitLastHm - installHm)
      // Jika installHm == 0 dan unitLastHm > 0, running HM = unitLastHm
      // Fallback ke current_hm yang tersimpan di DB
      let liveCurrentHm = Number(p.current_hm || 0);
      if (unitLastHm > 0) {
        liveCurrentHm = installHm > 0 ? Math.max(0, unitLastHm - installHm) : Math.max(unitLastHm, liveCurrentHm);
      }

      const target = Number(p.target_lifetime_hm || 10000);
      const liveRemaining = Math.max(0, target - liveCurrentHm);
      const pct = target > 0 ? Math.min(100, Math.round((liveCurrentHm / target) * 100)) : 0;

      let status = p.status || 'MONITORING';
      if (liveRemaining <= 500) {
        status = 'CRITICAL';
      } else if (liveRemaining <= 1500 && status === 'MONITORING') {
        status = 'WARNING / PERSIAPAN PR';
      }

      return {
        ...p,
        unit_latest_hm: unitLastHm,
        current_hm: liveCurrentHm,
        remaining_hm: liveRemaining,
        pct_used: pct,
        status: status
      };
    });
  }, [pcrList, dailyHms, equipments]);

  // Handler saat memilih unit pada modal
  const handleSelectUnit = (unitNo: string) => {
    const unitHm = getLatestUnitHm(unitNo);
    const installHm = Number(form.install_hm || 0);
    const calculatedCurrent = installHm > 0 ? Math.max(0, unitHm - installHm) : unitHm;
    const target = Number(form.target_lifetime_hm || 10000);
    const remaining = Math.max(0, target - calculatedCurrent);

    let status = 'MONITORING';
    if (remaining <= 500) status = 'CRITICAL';
    else if (remaining <= 1500) status = 'WARNING / PERSIAPAN PR';

    setForm(prev => ({
      ...prev,
      equip_no: unitNo,
      current_hm: calculatedCurrent,
      status: status
    }));
  };

  // Handler saat install_hm diubah pada modal
  const handleInstallHmChange = (installHmVal: number) => {
    const unitHm = getLatestUnitHm(form.equip_no || '');
    const calculatedCurrent = installHmVal > 0 ? Math.max(0, unitHm - installHmVal) : unitHm;
    const target = Number(form.target_lifetime_hm || 10000);
    const remaining = Math.max(0, target - calculatedCurrent);

    let status = 'MONITORING';
    if (remaining <= 500) status = 'CRITICAL';
    else if (remaining <= 1500) status = 'WARNING / PERSIAPAN PR';

    setForm(prev => ({
      ...prev,
      install_hm: installHmVal,
      current_hm: calculatedCurrent,
      status: status
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.component_name || !form.equip_no) {
      alert('Nama komponen dan No. Unit wajib diisi!');
      return;
    }

    const target = Number(form.target_lifetime_hm || 10000);
    const install = Number(form.install_hm || 0);
    const current = Number(form.current_hm || 0);
    const remaining = Math.max(0, target - current);

    try {
      setSubmitting(true);
      const res = await api.savePCR({
        ...form,
        install_hm: install,
        target_lifetime_hm: target,
        current_hm: current,
        remaining_hm: remaining,
      });

      if (res.success) {
        setIsModalOpen(false);
        const nextUnit = equipments[0]?.no_unit || '';
        const nextHm = getLatestUnitHm(nextUnit);
        setForm({
          equip_no: nextUnit,
          component_name: '',
          install_hm: 0,
          target_lifetime_hm: 10000,
          current_hm: nextHm,
          estimated_cost: 65000000,
          scheduled_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
          status: 'MONITORING',
        });
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan data PCR');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!id) {
      alert('ID jadwal PCR tidak ditemukan');
      return;
    }
    if (!window.confirm('Hapus jadwal Planned Component Replacement (PCR) ini?')) return;
    try {
      const res = await api.deletePCR(id);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SELURUH data Planned Component Replacement (PCR)? Data yang dihapus tidak dapat dikembalikan.')) return;
    try {
      const res = await api.deleteAllPCR();
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Gagal menghapus seluruh data PCR');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const filtered = processedPcrList.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.equip_no || '').toLowerCase().includes(q) ||
      (p.component_name || '').toLowerCase().includes(q) ||
      (p.status || '').toLowerCase().includes(q)
    );
  });

  // Metrik ringkasan
  const totalComponents = processedPcrList.length;
  const criticalItems = processedPcrList.filter(p => (p.remaining_hm || 0) <= 500);
  const warningItems = processedPcrList.filter(
    p => (p.remaining_hm || 0) > 500 && (p.remaining_hm || 0) <= 1500
  );
  const totalEstimatedCost = processedPcrList.reduce(
    (acc, p) => acc + Number(p.estimated_cost || 0),
    0
  );

  const selectedUnitHm = getLatestUnitHm(form.equip_no || '');
  const formCalculatedRemain = Math.max(
    0,
    Number(form.target_lifetime_hm || 10000) - Number(form.current_hm || 0)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Info: Live Sync Daily HM & Fuel */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/30">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-slate-900 uppercase tracking-wide">
                Live Daily HM Sync Aktif
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                Otomatis
              </span>
            </div>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Setiap kali data di-input di menu <strong>Input Daily HM &amp; Fuel</strong>, running HM dan sisa jam operasi komponen PCR akan langsung diperbarui secara otomatis tanpa input manual.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all text-xs cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sinkron Ulang</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Total Terjadwal
            </span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {totalComponents} <span className="text-xs font-bold text-slate-500">Major Comp</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Engine, Transmisi, Main Pump &amp; Final Drive</p>
        </div>

        <div className="bg-white border border-red-200 p-5 rounded-3xl shadow-sm flex flex-col justify-between bg-red-50/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
              Kritis (&le;500 Jam)
            </span>
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-red-600 tracking-tight mt-1">
            {criticalItems.length} <span className="text-xs font-bold text-slate-500">Komponen</span>
          </h3>
          <p className="text-[10px] text-red-700 font-semibold mt-2">Wajib segera eksekusi penggantian</p>
        </div>

        <div className="bg-white border border-amber-200 p-5 rounded-3xl shadow-sm flex flex-col justify-between bg-amber-50/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
              Warning (&le;1500 Jam)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-amber-700 tracking-tight mt-1">
            {warningItems.length} <span className="text-xs font-bold text-slate-500">Komponen</span>
          </h3>
          <p className="text-[10px] text-amber-800 font-semibold mt-2">Segera siapkan Purchase Request (PR)</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-700/50">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Estimasi Total Biaya
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight mt-1">
            Rp {(totalEstimatedCost / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}{' '}
            <span className="text-xs font-bold text-slate-400">Juta</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-2">Total proyeksi anggaran suku cadang</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Planned Component Replacement (PCR Register)
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-black">
                Live HM
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Monitoring jadwal penggantian komponen terencana dengan sinkronisasi otomatis dari Daily HM alat berat.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari unit / komponen / status..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 text-slate-800 placeholder-slate-400 font-medium w-44 sm:w-56 transition-all"
              />
            </div>
            {processedPcrList.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAll}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black transition-all cursor-pointer whitespace-nowrap"
                title="Hapus seluruh data PCR sekaligus"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Hapus Semua</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => printPcrSummaryReport(filtered, equipments, dailyHms)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black shadow-sm transition-all cursor-pointer whitespace-nowrap"
              title="Cetak Rekap Jadwal PCR ke PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Cetak Rekap PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const curUnit = form.equip_no || equipments[0]?.no_unit || '';
                const curHm = getLatestUnitHm(curUnit);
                setForm(prev => ({
                  ...prev,
                  equip_no: curUnit,
                  current_hm: curHm
                }));
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black shadow-sm shadow-orange-500/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Catat Jadwal PCR</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-3 text-center w-12">No</th>
                <th className="py-3 px-4">No. Unit</th>
                <th className="py-3 px-4">Nama Komponen</th>
                <th className="py-3 px-3 text-right">HM Pasang</th>
                <th className="py-3 px-3 text-right">HM Unit Terkini</th>
                <th className="py-3 px-3 text-right">Running HM</th>
                <th className="py-3 px-3 text-right">Target Lifetime</th>
                <th className="py-3 px-4">Sisa Jam &amp; Umur</th>
                <th className="py-3 px-3">Tgl Rencana</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Estimasi Biaya</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((p, idx) => {
                  const target = Number(p.target_lifetime_hm || 10000);
                  const current = Number(p.current_hm || 0);
                  const remain = Number(p.remaining_hm ?? Math.max(0, target - current));
                  const pct = Number((p as any).pct_used ?? (target > 0 ? Math.round((current / target) * 100) : 0));
                  const isCritical = remain <= 500;
                  const isWarning = remain <= 1500 && !isCritical;
                  const unitHm = Number(p.unit_latest_hm || getLatestUnitHm(p.equip_no || ''));

                  return (
                    <tr key={p.item_id || p.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div className="flex flex-col">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-slate-800 text-xs font-black inline-block w-fit">
                            {p.equip_no}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <div className="flex flex-col">
                          <span>{p.component_name}</span>
                          {p.install_hm && Number(p.install_hm) > 0 ? (
                            <span className="text-[10px] text-slate-400 font-normal">
                              Dipasang saat unit HM {Number(p.install_hm).toLocaleString()} Jam
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-normal">
                              Komponen standar unit baru
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                        {Number(p.install_hm || 0).toLocaleString()} Jam
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex flex-col items-end">
                          <span className="font-mono font-bold text-blue-600">
                            {unitHm.toLocaleString()} Jam
                          </span>
                          <span className="text-[9px] text-emerald-600 font-black flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                            Daily HM Sync
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900">
                        {current.toLocaleString()} Jam
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-600">
                        {target.toLocaleString()} Jam
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`font-mono font-black ${
                                isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                              }`}
                            >
                              {remain.toLocaleString()} Jam
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                isCritical
                                  ? 'bg-red-500'
                                  : isWarning
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {p.scheduled_date || '-'}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider inline-block ${
                            isCritical
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : isWarning
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : (p.status || '').toUpperCase() === 'SCHEDULED'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {p.status || (isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'MONITORING')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                        Rp {Number(p.estimated_cost || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(p.item_id || p.id || '')}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Hapus Jadwal PCR"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-slate-700 text-sm">
                          Tidak ada jadwal komponen PCR ditemukan
                        </p>
                        <p className="text-xs text-slate-400">
                          {search
                            ? `Tidak ada hasil yang sesuai dengan kata kunci "${search}"`
                            : 'Mulai dengan mencatat jadwal komponen utama baru'}
                        </p>
                      </div>
                      {!search && (
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(true)}
                          className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-black text-xs hover:bg-orange-700 shadow-sm cursor-pointer"
                        >
                          + Tambah Jadwal PCR
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog: Catat Jadwal PCR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-xl shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    Catat Jadwal Planned Component Replacement (PCR)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Otomatis tersinkronisasi dengan data Input Daily HM &amp; Fuel
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs font-semibold">
              {/* Box Info Live Sync Daily HM */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start space-x-3">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5 animate-bounce" />
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-blue-950 text-xs">
                      Auto-Sync Daily HM &amp; Fuel Terhubung
                    </span>
                    <span className="font-mono font-black text-blue-700 text-xs bg-white px-2 py-0.5 rounded-md border border-blue-200">
                      HM Unit: {selectedUnitHm.toLocaleString()} Jam
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-800 font-normal leading-relaxed">
                    Running HM komponen akan otomatis dihitung: <code>HM Unit ({selectedUnitHm.toLocaleString()}) - HM Pasang</code>. Ketika operator menginput Daily HM baru, jam komponen otomatis ikut bergerak.
                  </p>
                </div>
              </div>

              {/* Unit & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">No. Unit Alat Berat *</label>
                  <select
                    value={form.equip_no}
                    onChange={e => handleSelectUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-bold cursor-pointer"
                    required
                  >
                    {equipments.map(eq => (
                      <option key={eq.id || eq.no_unit} value={eq.no_unit}>
                        {eq.no_unit} - {eq.model} (HM: {Number(eq.last_hm || 0).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Status Rencana</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-bold cursor-pointer"
                  >
                    <option value="MONITORING">MONITORING (Normal)</option>
                    <option value="WARNING / PERSIAPAN PR">WARNING / PERSIAPAN PR (&le;1500h)</option>
                    <option value="CRITICAL">CRITICAL (&le;500h)</option>
                    <option value="WAITING PARTS">WAITING PARTS</option>
                    <option value="SCHEDULED">SCHEDULED (Siap Pasang)</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              {/* Component Name */}
              <div>
                <label className="block text-slate-600 mb-1">Nama Major Komponen *</label>
                <input
                  type="text"
                  value={form.component_name}
                  onChange={e => setForm({ ...form, component_name: e.target.value })}
                  placeholder="Contoh: Engine Complete Cummins QSM11 / Hydraulic Main Pump"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-medium"
                  required
                />
                {/* Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {COMMON_COMPONENTS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, component_name: c })}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* HM Pasang & Running HM */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-600">HM Unit Saat Pasang</label>
                    <span className="text-[10px] text-slate-400 font-normal">
                      (0 jika bawaan unit baru)
                    </span>
                  </div>
                  <input
                    type="number"
                    value={form.install_hm}
                    onChange={e => handleInstallHmChange(Number(e.target.value))}
                    placeholder="Contoh: 0 atau 5000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Isi HM unit ketika komponen baru/rekondisi ini dipasang.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-600">Running HM Komponen</label>
                    <span className="text-[10px] text-emerald-600 font-black">
                      ⚡ Terhitung Otomatis
                    </span>
                  </div>
                  <input
                    type="number"
                    value={form.current_hm}
                    onChange={e => setForm({ ...form, current_hm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-orange-50/50 border border-orange-200 text-orange-950 outline-none focus:border-orange-500 font-mono font-black"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Jam pemakaian komponen hingga saat ini.
                  </p>
                </div>
              </div>

              {/* Target Lifetime & Calculation Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Target Lifetime (Jam/HM) *</label>
                  <input
                    type="number"
                    value={form.target_lifetime_hm}
                    onChange={e => setForm({ ...form, target_lifetime_hm: Number(e.target.value) })}
                    placeholder="10000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono font-bold"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Standar lifetime manufaktur (misal: Engine 12.000h, Pump 10.000h).
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Proyeksi Sisa Jam Operasi
                  </div>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span
                      className={`text-xl font-mono font-black ${
                        formCalculatedRemain <= 500
                          ? 'text-red-600'
                          : formCalculatedRemain <= 1500
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {formCalculatedRemain.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">Jam Tersisa</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {Math.round(
                      (Number(form.current_hm || 0) / Number(form.target_lifetime_hm || 10000)) *
                        100
                    )}
                    % dari target lifetime telah terpakai
                  </span>
                </div>
              </div>

              {/* Estimasi Biaya & Tanggal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Estimasi Biaya Komponen (Rp)</label>
                  <input
                    type="number"
                    value={form.estimated_cost}
                    onChange={e => setForm({ ...form, estimated_cost: Number(e.target.value) })}
                    placeholder="65000000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Estimasi Tanggal Penggantian</label>
                  <input
                    type="date"
                    value={form.scheduled_date}
                    onChange={e => setForm({ ...form, scheduled_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-md shadow-orange-500/20 active:scale-95 disabled:opacity-50 cursor-pointer transition-all flex items-center space-x-1.5"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simpan Jadwal PCR</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
