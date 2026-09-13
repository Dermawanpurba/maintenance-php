import React, { useState } from 'react';
import { ShieldCheck, Plus, Search, Droplets, Wrench, Hammer, Zap, CheckCircle2, FileText, History, Calendar, User, Clock } from 'lucide-react';
import { Equipment } from '../types';
import { api } from '../services/api';

export type PMCategory = 'pm_washing' | 'pm_greasing' | 'pm_inspection' | 'pm_torque' | 'pm_battery';

interface PreventiveMaintenanceViewProps {
  category: PMCategory;
  equipments: Equipment[];
  onRefresh: () => void;
}

const pmConfig: Record<PMCategory, { title: string; subtitle: string; icon: React.FC<any>; color: string; items: string[] }> = {
  pm_washing: {
    title: '1. Washing & Pressure Cleaning',
    subtitle: 'Pencucian undercarriage, bodi alat, radiator fin, dan engine compartment dari endapan lumpur & batubara',
    icon: Droplets,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    items: ['Cuci High-Pressure Undercarriage & Track Link', 'Pembersihan Radiator Fin & Oil Cooler', 'Pembersihan Kabin Operator & Kaca', 'Pemeriksaan rembesan oli/fluida setelah pencucian']
  },
  pm_greasing: {
    title: '2. Greasing Full Points',
    subtitle: 'Pelumasan grease NLGI 2 EP pada seluruh bushing, pin boom, arm, bucket, center pin, dan universal joint',
    icon: Wrench,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    items: ['Greasing Boom Foot Pin & Cylinder Eyes', 'Greasing Arm & Bucket Linkage Pin', 'Greasing Swing Circle & Pinion Gear', 'Greasing Equalizer Bar & Track Idler']
  },
  pm_inspection: {
    title: '3. General Inspection (PM Inspection)',
    subtitle: 'Pemeriksaan menyeluruh kebocoran fluida, level oli, keretakan struktur rangka, dan indikator sensor monitor',
    icon: ShieldCheck,
    color: 'text-sky-600 bg-sky-50 border-sky-200',
    items: ['Cek Level Oli Mesin, Hidrolik & Transmisi', 'Pemeriksaan Radiator Coolant & Hoses', 'Cek Ketegangan Belt Alternator & AC', 'Inspeksi Keretakan Boom & Arm Weldments']
  },
  pm_torque: {
    title: '4. Pengencangan & Torque Audit',
    subtitle: 'Pengecekan torsi baut roda, counterweight, track shoe bolts, dan mounting engine sesuai spesifikasi manual book',
    icon: Hammer,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    items: ['Torsi Baut Track Shoe (550 - 620 Nm)', 'Torsi Baut Sprocket & Final Drive', 'Torsi Baut Counterweight Bodi Belakang', 'Torsi Mounting Engine & Transmisi']
  },
  pm_battery: {
    title: '5. Battery & Electrical Check',
    subtitle: 'Pengujian tegangan alternator 28V, charging system, starting motor, kebersihan kutub aki, dan berat jenis elektrolit',
    icon: Zap,
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    items: ['Pengukuran Tegangan Aki (Min 25.2V)', 'Pemeriksaan Output Alternator (27.5V - 28.5V)', 'Pembersihan Terminal Kutub dari Korosi', 'Pengujian Fungsi Starter Motor & Harness']
  }
};

export const PreventiveMaintenanceView: React.FC<PreventiveMaintenanceViewProps> = ({
  category,
  equipments,
  onRefresh
}) => {
  const current = pmConfig[category] || pmConfig.pm_washing;
  const Icon = current.icon;
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');

  // Form state
  const initialEq = equipments[0];
  const [equipNo, setEquipNo] = useState(initialEq?.equip_no || initialEq?.no_unit || '');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [hm, setHm] = useState(Number(initialEq?.last_hm || 0));
  const [tech, setTech] = useState('Mekanik PM Workshop');
  const [notes, setNotes] = useState('');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // Local history cache
  const [historyList, setHistoryList] = useState<Array<{
    id: string;
    equip_no: string;
    tanggal: string;
    hm: number;
    tech: string;
    items_count: number;
    notes: string;
  }>>([
    {
      id: 'PM-001',
      equip_no: equipments[0]?.equip_no || 'EX-301',
      tanggal: '2026-09-10',
      hm: 4520,
      tech: 'Brayen (Mekanik)',
      items_count: current.items.length,
      notes: 'Pekerjaan selesai 100%, semua titik dalam kondisi prima.'
    },
    {
      id: 'PM-002',
      equip_no: equipments[1]?.equip_no || 'DZ-007',
      tanggal: '2026-09-08',
      hm: 5120,
      tech: 'Andi Herwan',
      items_count: current.items.length - 1,
      notes: 'Perlu penggantian seal minor pada servis berikutnya.'
    }
  ]);

  const handleToggle = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSelectAll = () => {
    const all: Record<string, boolean> = {};
    current.items.forEach(item => {
      all[item] = true;
    });
    setCheckedItems(all);
  };

  const handleSavePM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipNo) {
      alert('Harap pilih unit alat!');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        pm_type: category,
        equip_no: equipNo,
        tanggal,
        hm,
        tech,
        notes,
        checked_items: Object.keys(checkedItems).filter(k => checkedItems[k])
      };

      const res = await api.savePMRecord(payload);
      if (res.success) {
        alert(`Pekerjaan ${current.title} untuk unit ${equipNo} berhasil disimpan!`);
        // Add to history
        setHistoryList(prev => [
          {
            id: `PM-${Date.now().toString().slice(-4)}`,
            equip_no: equipNo,
            tanggal,
            hm,
            tech,
            items_count: Object.keys(checkedItems).filter(k => checkedItems[k]).length,
            notes: notes || 'Semua item checklist telah diperiksa & diverifikasi.'
          },
          ...prev
        ]);
        setCheckedItems({});
        setNotes('');
        setActiveTab('history');
        onRefresh();
      } else {
        alert(res.message || 'Gagal menyimpan PM record');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / current.items.length) * 100);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info Card */}
      <div className="bg-white border border-slate-200/80 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${current.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] tracking-wider uppercase">
                PM HUB MODULE
              </span>
              <h2 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
                {current.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl font-medium">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Tab Selector: Form Input vs Riwayat */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'form'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Formulir Input PM</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Pelaksanaan</span>
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        /* TAB 1: FORMULIR INPUT PM */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form Settings */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">
              Data Unit &amp; Pelaksana
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Pilih No. Lambung Unit *</label>
                <select
                  value={equipNo}
                  onChange={e => {
                    setEquipNo(e.target.value);
                    const eq = equipments.find(item => (item.equip_no || item.no_unit) === e.target.value);
                    if (eq) setHm(Number(eq.last_hm || 0));
                  }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                >
                  {equipments.map(eq => (
                    <option key={eq.id || eq.equip_no} value={eq.equip_no || eq.no_unit}>
                      {eq.equip_no || eq.no_unit} - {eq.model || eq.type} ({eq.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={e => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Hour Meter Saat PM (HM)</label>
                <input
                  type="number"
                  value={hm}
                  onChange={e => setHm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Leader Mekanik / PIC</label>
                <input
                  type="text"
                  value={tech}
                  onChange={e => setTech(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Catatan Temuan / Rekomendasi</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Catatan kondisi teknis saat pekerjaan berlangsung..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Checklist & Submit */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Daftar Poin Pemeriksaan (Checklist)</h3>
                  <p className="text-xs text-slate-400">Centang setiap item yang telah selesai dikerjakan mekanik</p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs"
                >
                  Centang Semua
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Progres Pekerjaan</span>
                  <span className="text-blue-600">{completedCount} / {current.items.length} Poin ({progressPercent}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2.5 pt-2">
                {current.items.map((item, idx) => {
                  const isChecked = !!checkedItems[item];
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggle(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-200 text-blue-900 shadow-sm'
                          : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-medium">{item}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Poin #{idx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Pastikan SOP K3 &amp; LOTO telah diterapkan selama pengerjaan.
              </span>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSavePM}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {submitting ? 'Menyimpan Log...' : `Simpan Laporan ${current.title}`}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: RIWAYAT PELAKSANAAN PM */
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-500 font-black uppercase text-[10px] tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4">No. Record</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Unit Alat</th>
                  <th className="py-3 px-4">HM Saat Servis</th>
                  <th className="py-3 px-4">Poin Selesai</th>
                  <th className="py-3 px-4">Leader Mekanik</th>
                  <th className="py-3 px-4">Catatan Servis</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {historyList.map((hist, idx) => (
                  <tr key={hist.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{hist.id}</td>
                    <td className="py-3.5 px-4 text-slate-500">{hist.tanggal}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black text-[11px]">
                        {hist.equip_no}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{hist.hm.toLocaleString()} HM</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        {hist.items_count} / {current.items.length} Poin Selesai
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{hist.tech}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={hist.notes}>
                      {hist.notes}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
