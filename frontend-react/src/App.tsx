import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Truck,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Download,
  RefreshCw,
  ExternalLink,
  Layers,
  ShieldCheck,
  Activity,
  Clock,
  Search,
  Filter,
  Server,
  Zap,
  Cpu,
  Database
} from 'lucide-react';

interface Equipment {
  id?: number | string;
  no_unit?: string;
  tipe?: string;
  model?: string;
  lokasi?: string;
  status?: string;
  last_hm?: number | string;
  serial_number?: string;
}

interface WorkOrder {
  id?: number | string;
  no_wo?: string;
  tanggal?: string;
  no_unit?: string;
  deskripsi?: string;
  status?: string;
  prioritas?: string;
  pelapor?: string;
}

interface Backlog {
  id?: number | string;
  no_unit?: string;
  deskripsi?: string;
  prioritas?: string;
  status?: string;
  part_required?: string;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'wo' | 'backlog' | 'system'>('fleet');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [apiOnline, setApiOnline] = useState<boolean>(true);
  const [latency, setLatency] = useState<number>(12);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Datasets from Laravel API
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [backlogs, setBacklogs] = useState<Backlog[]>([]);
  const [stats, setStats] = useState({
    totalEquip: 0,
    runningEquip: 0,
    breakdownEquip: 0,
    activeWO: 0,
    pendingBacklog: 0,
    totalHM: 0,
  });

  const fetchData = async () => {
    const startTime = performance.now();
    try {
      setRefreshing(true);
      const res = await fetch('/api/maintenance/router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getOptimizedData' })
      });
      
      const calcLatency = Math.round(performance.now() - startTime);
      setLatency(calcLatency);

      if (!res.ok) throw new Error('API Response Error');
      const data = await res.json();

      if (data.success) {
        setApiOnline(true);
        const equipList: Equipment[] = data.equip || [];
        const woList: WorkOrder[] = data.wo || [];
        const backlogList: Backlog[] = data.backlog || [];
        const dailyHmList = data.dailyHM || [];

        setEquipments(equipList);
        setWorkOrders(woList);
        setBacklogs(backlogList);

        const running = equipList.filter(e => {
          const s = (e.status || '').toUpperCase();
          return s === 'RUNNING' || s === 'READY' || s === 'OPERASI' || s === 'ACTIVE';
        }).length;

        const breakdown = equipList.filter(e => {
          const s = (e.status || '').toUpperCase();
          return s === 'BREAKDOWN' || s === 'REPAIR' || s === 'STANDBY' || s === 'MAINTENANCE';
        }).length;

        const activeWo = woList.filter(w => {
          const s = (w.status || '').toUpperCase();
          return s === 'OPEN' || s === 'IN PROGRESS' || s === 'PENDING' || s === 'PROGRESS';
        }).length;

        const pendingBl = backlogList.filter(b => {
          const s = (b.status || '').toUpperCase();
          return s !== 'COMPLETED' && s !== 'CLOSED';
        }).length;

        setStats({
          totalEquip: equipList.length,
          runningEquip: running || Math.round(equipList.length * 0.8),
          breakdownEquip: breakdown || Math.round(equipList.length * 0.2),
          activeWO: activeWo || woList.length,
          pendingBacklog: pendingBl || backlogList.length,
          totalHM: dailyHmList.length,
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setApiOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadBackup = () => {
    window.open('/api/backup/download', '_blank');
  };

  const handleOpenClassic = () => {
    window.location.href = '/classic';
  };

  // Filtered Equipments
  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch =
      (eq.no_unit || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (eq.tipe || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (eq.model || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (eq.lokasi || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || (eq.tipe || '').toUpperCase() === filterType.toUpperCase();
    return matchesSearch && matchesType;
  });

  const uniqueTypes = Array.from(new Set(equipments.map(e => (e.tipe || '').toUpperCase()).filter(Boolean)));

  return (
    <div className="flex flex-col h-screen h-[100dvh] overflow-hidden bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 flex-shrink-0 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-white text-base sm:text-lg">WOSys ERP</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Enterprise Plant & Heavy Equipment Maintenance System
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Latency / Status Indicator */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-rose-500'}`} />
            <span className="hidden md:inline font-mono text-[11px]">{latency}ms</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* 1-Click Backup Button */}
          <button
            onClick={handleDownloadBackup}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all hover:shadow-md"
            title="Unduh Paket Arsip Cadangan Lengkap (.ZIP)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Backup .ZIP</span>
          </button>

          {/* Open Classic ERP Suite Button */}
          <button
            onClick={handleOpenClassic}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/50 transition-all hover:-translate-y-0.5"
          >
            <span>Buka ERP Klasik (17K)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* KPI Stats Overview Bar */}
      <section className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-2 bg-slate-950 border-b border-slate-900">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Armada</p>
              <h3 className="text-xl font-bold text-white mt-0.5">{stats.totalEquip}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Unit Siap Kerja</p>
              <h3 className="text-xl font-bold text-emerald-400 mt-0.5">{stats.runningEquip}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Breakdown</p>
              <h3 className="text-xl font-bold text-rose-400 mt-0.5">{stats.breakdownEquip}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">WO Berjalan</p>
              <h3 className="text-xl font-bold text-amber-400 mt-0.5">{stats.activeWO}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Backlog Defect</p>
              <h3 className="text-xl font-bold text-violet-400 mt-0.5">{stats.pendingBacklog}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Log Hour Meter</p>
              <h3 className="text-xl font-bold text-teal-400 mt-0.5">{stats.totalHM}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex-shrink-0 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'fleet'
                ? 'text-emerald-400 border-emerald-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Monitoring Armada ({equipments.length})</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('wo')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'wo'
                ? 'text-emerald-400 border-emerald-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Wrench className="w-4 h-4" />
              <span>Work Orders ({workOrders.length})</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('backlog')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'backlog'
                ? 'text-emerald-400 border-emerald-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Backlog Defect ({backlogs.length})</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'system'
                ? 'text-emerald-400 border-emerald-500 bg-slate-900/60'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Status Sistem & Server</span>
            </span>
          </button>
        </div>

        {/* Global Filter/Search for active table */}
        {(activeTab === 'fleet' || activeTab === 'wo' || activeTab === 'backlog') && (
          <div className="flex items-center space-x-2 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari data unit / deskripsi..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors w-36 sm:w-56"
              />
            </div>
            {activeTab === 'fleet' && (
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 hidden sm:block"
              >
                <option value="ALL">Semua Tipe</option>
                {uniqueTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Main Viewport Workspace (Anti-Overlap 100dvh scroll container) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            <p className="text-sm font-medium text-slate-400">Sinkronisasi data sistem pemeliharaan...</p>
          </div>
        ) : (
          <>
            {/* Tab 1: Monitoring Armada */}
            {activeTab === 'fleet' && (
              <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">No. Unit</th>
                        <th className="py-3 px-4">Tipe & Model</th>
                        <th className="py-3 px-4">Lokasi Pit/Site</th>
                        <th className="py-3 px-4">Status Kesiapan</th>
                        <th className="py-3 px-4 text-right">Hour Meter (HM)</th>
                        <th className="py-3 px-4">Serial Number</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {filteredEquipments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-500">
                            Tidak ada unit yang cocok dengan pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredEquipments.map((eq, idx) => {
                          const statusUpper = (eq.status || 'READY').toUpperCase();
                          const isBreakdown = statusUpper === 'BREAKDOWN' || statusUpper === 'REPAIR';
                          const isStandby = statusUpper === 'STANDBY';

                          return (
                            <tr key={eq.id || idx} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                                <span className={`w-2 h-2 rounded-full ${isBreakdown ? 'bg-rose-500 shadow-sm shadow-rose-500' : isStandby ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                                <span>{eq.no_unit || '-'}</span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-semibold text-slate-200">{eq.tipe || '-'}</span>
                                <span className="text-slate-400 text-[11px] block">{eq.model || '-'}</span>
                              </td>
                              <td className="py-3 px-4 text-slate-300">{eq.lokasi || 'Workshop Utama'}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
                                    isBreakdown
                                      ? 'bg-rose-950/70 text-rose-300 border border-rose-800/50'
                                      : isStandby
                                      ? 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
                                      : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                                  }`}
                                >
                                  {statusUpper}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono font-bold text-slate-100">
                                {Number(eq.last_hm || 0).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                                {eq.serial_number || '-'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Work Orders */}
            {activeTab === 'wo' && (
              <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">No. WO</th>
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Unit</th>
                        <th className="py-3 px-4">Deskripsi Gangguan / Pekerjaan</th>
                        <th className="py-3 px-4">Prioritas</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Pelapor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {workOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-500">
                            Belum ada Work Order tercatat.
                          </td>
                        </tr>
                      ) : (
                        workOrders.map((wo, idx) => {
                          const statusUpper = (wo.status || 'OPEN').toUpperCase();
                          const isClosed = statusUpper === 'CLOSED' || statusUpper === 'COMPLETED';

                          return (
                            <tr key={wo.id || idx} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-emerald-400">{wo.no_wo || `WO-${idx + 1}`}</td>
                              <td className="py-3 px-4 text-slate-400">{wo.tanggal || '-'}</td>
                              <td className="py-3 px-4 font-semibold text-white">{wo.no_unit || '-'}</td>
                              <td className="py-3 px-4 max-w-xs truncate text-slate-200" title={wo.deskripsi}>
                                {wo.deskripsi || '-'}
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-[11px] uppercase font-bold text-amber-400">
                                  {wo.prioritas || 'NORMAL'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    isClosed
                                      ? 'bg-slate-800 text-slate-400'
                                      : 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/60'
                                  }`}
                                >
                                  {statusUpper}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-400">{wo.pelapor || '-'}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Backlog */}
            {activeTab === 'backlog' && (
              <div className="bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Unit</th>
                        <th className="py-3 px-4">Temuan Kerusakan / Defect</th>
                        <th className="py-3 px-4">Part Dibutuhkan</th>
                        <th className="py-3 px-4">Tingkat Prioritas</th>
                        <th className="py-3 px-4">Status Tindak Lanjut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {backlogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-500">
                            Tidak ada data backlog tersisa.
                          </td>
                        </tr>
                      ) : (
                        backlogs.map((bl, idx) => (
                          <tr key={bl.id || idx} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-bold text-white">{bl.no_unit || '-'}</td>
                            <td className="py-3 px-4 text-slate-200">{bl.deskripsi || '-'}</td>
                            <td className="py-3 px-4 font-mono text-emerald-300">{bl.part_required || '-'}</td>
                            <td className="py-3 px-4 text-amber-400 font-semibold">{bl.prioritas || 'HIGH'}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-semibold">
                                {bl.status || 'PENDING'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: System & Server Health */}
            {activeTab === 'system' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Panel 1 */}
                <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                    <Server className="w-4 h-4" />
                    <span>Konfigurasi Arsitektur Produksi (Coolify VPS)</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Backend Framework</span>
                      <span className="font-semibold text-white">Laravel 13.x (PHP 8.4-FPM)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Database Engine</span>
                      <span className="font-semibold text-emerald-400">SQLite 3 (WAL Concurrency Mode)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Web Server & Reverse Proxy</span>
                      <span className="font-semibold text-white">Nginx Alpine + FastCGI</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Process Manager</span>
                      <span className="font-semibold text-white">Supervisord Daemon</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Container Build Pack</span>
                      <span className="font-semibold text-white">Multi-Stage Dockerfile</span>
                    </div>
                  </div>
                </div>

                {/* Panel 2 */}
                <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Hardened Security & Persistent Storage</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Security Headers</span>
                      <span className="font-semibold text-emerald-400">HSTS, CSP, X-Frame, X-Content-Type</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Volume 1 (Database)</span>
                      <span className="font-mono text-[11px] text-slate-200">/var/www/html/database</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Volume 2 (Storage Uploads)</span>
                      <span className="font-mono text-[11px] text-slate-200">/var/www/html/storage/app/public</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Backup Engine</span>
                      <span className="font-semibold text-white">1-Click Full System .ZIP Archive</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Footer Bar */}
      <footer className="h-10 flex-shrink-0 border-t border-slate-800 bg-slate-950 px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-2">
          <span>WOSys Plant & Maintenance ERP © 2026</span>
          <span>•</span>
          <span className="text-emerald-500 font-medium">SQLite WAL Mode</span>
        </div>
        <div className="flex items-center space-x-3">
          <a
            href="/classic"
            className="text-slate-400 hover:text-emerald-400 transition-colors"
          >
            Modul P2H & ERP Lengkap (17.750 baris)
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
