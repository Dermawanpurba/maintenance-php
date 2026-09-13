import React from 'react';
import {
  Truck,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Package,
  Layers,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Equipment, WorkOrder, Backlog, DailyHM } from '../types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  equipments: Equipment[];
  workOrders: WorkOrder[];
  backlogs: Backlog[];
  dailyHms: DailyHM[];
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  equipments,
  workOrders,
  backlogs,
  dailyHms,
  onNavigate
}) => {
  const readyCount = equipments.filter(e => {
    const s = (e.status || '').toUpperCase();
    return s === 'READY' || s === 'RUNNING' || s === 'ACTIVE' || s === 'OPERASI';
  }).length;

  const breakdownCount = equipments.filter(e => {
    const s = (e.status || '').toUpperCase();
    return s === 'BREAKDOWN' || s === 'REPAIR' || s === 'MAINTENANCE';
  }).length;

  const standbyCount = equipments.length - readyCount - breakdownCount;

  const activeWOCount = workOrders.filter(w => {
    const s = (w.status || '').toUpperCase();
    return s !== 'CLOSED' && s !== 'COMPLETED';
  }).length;

  const physicalAvailability = equipments.length > 0
    ? Math.round((readyCount / equipments.length) * 100)
    : 0;

  const recentWOs = workOrders.slice(-5).reverse();
  const criticalBacklogs = backlogs.filter(b => (b.prioritas || '').toUpperCase() === 'HIGH').slice(0, 5);

  return (
    <div className="space-y-5">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => onNavigate('fleet')}
          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm cursor-pointer hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Armada</span>
            <Truck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-1">{equipments.length}</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Unit alat berat terdaftar</p>
        </div>

        <div
          onClick={() => onNavigate('fleet')}
          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm cursor-pointer hover:border-emerald-800/60 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Unit Siap Kerja</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{readyCount}</h3>
          <p className="text-[10px] text-emerald-500/80 mt-0.5">PA: {physicalAvailability}% (Kesiapan Fisik)</p>
        </div>

        <div
          onClick={() => onNavigate('fleet')}
          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm cursor-pointer hover:border-rose-800/60 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Breakdown</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-rose-400 mt-1">{breakdownCount}</h3>
          <p className="text-[10px] text-rose-500/80 mt-0.5">Sedang dalam perbaikan</p>
        </div>

        <div
          onClick={() => onNavigate('wo')}
          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm cursor-pointer hover:border-amber-800/60 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">WO Aktif</span>
            <Activity className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">{activeWOCount}</h3>
          <p className="text-[10px] text-amber-500/80 mt-0.5">Total WO: {workOrders.length}</p>
        </div>

        <div
          onClick={() => onNavigate('backlog')}
          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm cursor-pointer hover:border-violet-800/60 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Backlog Defect</span>
            <Clock className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-violet-400 mt-1">{backlogs.length}</h3>
          <p className="text-[10px] text-violet-400/80 mt-0.5">Temuan inspeksi/defect</p>
        </div>

        <div
          onClick={() => onNavigate('daily_hm')}
          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm cursor-pointer hover:border-teal-800/60 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-semibold uppercase tracking-wider">HM & Fuel Logs</span>
            <Zap className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-teal-400 mt-1">{dailyHms.length}</h3>
          <p className="text-[10px] text-teal-500/80 mt-0.5">Log akumulasi tercatat</p>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Recent Work Orders */}
        <div className="lg:col-span-2 bg-slate-900/70 rounded-xl border border-slate-800/80 overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>Surat Perintah Kerja (WO) Terkini</span>
            </div>
            <button
              onClick={() => onNavigate('wo')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
            >
              <span>Lihat Semua ({workOrders.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-slate-800/60">
            {recentWOs.length === 0 ? (
              <p className="text-center py-8 text-slate-500 text-xs">Belum ada Work Order tercatat.</p>
            ) : (
              recentWOs.map((wo, i) => (
                <div key={wo.id || i} className="p-3.5 hover:bg-slate-800/30 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-emerald-400">{wo.no_wo}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                        {wo.no_unit}
                      </span>
                      <span className="text-[10px] text-slate-500">{wo.tanggal}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1">{wo.deskripsi}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        wo.status === 'CLOSED'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      {wo.status || 'OPEN'}
                    </span>
                    <p className="text-[10px] text-amber-400 font-semibold uppercase mt-0.5">
                      {wo.prioritas || 'NORMAL'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Fleet Status & High Priority Backlogs */}
        <div className="space-y-5">
          {/* Status Breakdown Mini Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Distribusi Status Armada</span>
              <span className="text-emerald-400">{physicalAvailability}% Siap</span>
            </h4>
            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(readyCount / Math.max(equipments.length, 1)) * 100}%` }}
                className="bg-emerald-500 h-full"
                title={`Ready: ${readyCount}`}
              />
              <div
                style={{ width: `${(breakdownCount / Math.max(equipments.length, 1)) * 100}%` }}
                className="bg-rose-500 h-full"
                title={`Breakdown: ${breakdownCount}`}
              />
              <div
                style={{ width: `${(standbyCount / Math.max(equipments.length, 1)) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`Standby: ${standbyCount}`}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/40">
                <span className="block text-emerald-400 font-bold">{readyCount}</span>
                <span className="text-[10px] text-slate-400">Ready</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/40">
                <span className="block text-rose-400 font-bold">{breakdownCount}</span>
                <span className="text-[10px] text-slate-400">Breakdown</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-900/40">
                <span className="block text-amber-400 font-bold">{standbyCount}</span>
                <span className="text-[10px] text-slate-400">Standby</span>
              </div>
            </div>
          </div>

          {/* Critical Backlogs */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Defect Prioritas Tinggi</span>
              </span>
              <button
                onClick={() => onNavigate('backlog')}
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Lihat ({backlogs.length})
              </button>
            </div>
            <div className="space-y-2">
              {criticalBacklogs.length === 0 ? (
                <p className="text-center py-4 text-slate-500 text-xs">Tidak ada defect kritis.</p>
              ) : (
                criticalBacklogs.map((bl, i) => (
                  <div key={bl.id || i} className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white mr-2">{bl.no_unit}</span>
                      <span className="text-slate-300">{bl.deskripsi}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/50">
                      HIGH
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
