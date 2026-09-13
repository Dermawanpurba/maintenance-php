import React, { useState } from 'react';
import { ShieldCheck, Plus, Search, Droplets, Wrench, Hammer, Zap, CheckCircle2, X } from 'lucide-react';
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
    items: ['Cuci High-Pressure Undercarriage & Track Link', 'Pembersihan Radiator Fin & Oil Cooler', 'Pembersihan Kabin Operator', 'Pemeriksaan rembesan setelah pencucian']
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
  const [selectedUnit, setSelectedUnit] = useState(equipments[0]?.no_unit || '');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isDone, setIsDone] = useState(false);

  const handleToggle = (item: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSavePM = () => {
    setIsDone(true);
    setTimeout(() => {
      alert(`Pekerjaan ${current.title} untuk unit ${selectedUnit} berhasil dicatat!`);
      setCheckedItems({});
      setIsDone(false);
      onRefresh();
    }, 400);
  };

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
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-extrabold text-[9px] uppercase tracking-wider">
                PREVENTIVE MAINTENANCE
              </span>
              <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                {current.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl font-medium">
              {current.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={selectedUnit}
            onChange={e => setSelectedUnit(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-slate-800 font-bold"
          >
            {equipments.map(eq => (
              <option key={eq.id} value={eq.no_unit}>
                {eq.no_unit} - {eq.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Checklist Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Daftar Titik Pemeriksaan Standar Operasional ({selectedUnit})
            </h3>
            <p className="text-[11px] text-slate-500">
              Centang seluruh item setelah mekanik melakukan pekerjaan di lapangan
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
            Jadwal PM Rutin
          </span>
        </div>

        <div className="space-y-3">
          {current.items.map((item, idx) => {
            const checked = !!checkedItems[item];

            return (
              <div
                key={idx}
                onClick={() => handleToggle(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  checked
                    ? 'bg-emerald-50/50 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50/70 border-slate-200/70 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-bold">{item}</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {checked ? 'Terverifikasi' : 'Belum Dicek'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={handleSavePM}
            disabled={isDone}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Log Eksekusi PM</span>
          </button>
        </div>
      </div>
    </div>
  );
};
