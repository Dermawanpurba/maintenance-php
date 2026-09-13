import React from 'react';
import { Menu, RefreshCw, Download, Database, ShieldCheck } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenSidebar: () => void;
  apiOnline: boolean;
  latency: number;
  onRefresh: () => void;
  refreshing: boolean;
  onBackup: () => void;
}

const titles: Record<NavTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Overview', subtitle: 'Ringkasan performa pemeliharaan armada & operasional' },
  fleet: { title: 'Monitoring Armada Unit', subtitle: 'Kesiapan unit alat berat, lokasi site, dan status operasional' },
  wo: { title: 'Surat Perintah Kerja (WO)', subtitle: 'Pencatatan dan pelacakan pekerjaan perbaikan alat' },
  backlog: { title: 'Daftar Backlog & Defect', subtitle: 'Temuan defect tertunda dan kebutuhan suku cadang' },
  daily_hm: { title: 'Log Hour Meter & Fuel Intake', subtitle: 'Pencatatan akumulasi jam operasi dan konsumsi BBM' },
  p2h: { title: 'Inspeksi Kelayakan Harian (P2H)', subtitle: 'Checklist pre-start inspection keselamatan alat' },
  parts: { title: 'Katalog Sparepart & Gudang', subtitle: 'Stok suku cadang, lokasi penyimpanan rak, dan batas minimum' },
  tools: { title: 'Special Tools Tracker', subtitle: 'Monitoring peminjaman dan kalibrasi perkakas kerja' },
  swab: { title: 'Swab & Kanibalisasi Part', subtitle: 'Dokumentasi pemindahan komponen antar unit armada' },
  far: { title: 'Laporan Analisis Kerusakan (FAR)', subtitle: 'Investigasi kegagalan komponen dan tindakan pencegahan' },
  meetings: { title: 'Notulen Rapat Operasional Plant', subtitle: 'Pencatatan keputusan rapat evaluasi maintenance mingguan' },
  system: { title: 'Status Sistem & Pencadangan', subtitle: 'Audit log, konkurensi SQLite WAL, dan arsip .ZIP 1-klik' },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSidebar,
  apiOnline,
  latency,
  onRefresh,
  refreshing,
  onBackup
}) => {
  const current = titles[currentTab] || { title: 'WOSys ERP', subtitle: 'Maintenance Management' };

  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none">
            {current.title}
          </h2>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block mt-1">
            {current.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Latency badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
          <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="font-mono text-[11px]">{latency}ms</span>
        </div>

        {/* Reload button */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Sinkronisasi Ulang Data"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* 1-Click Backup */}
        <button
          onClick={onBackup}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all hover:-translate-y-0.5"
          title="Unduh Backup Lengkap .ZIP"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Backup .ZIP</span>
        </button>
      </div>
    </header>
  );
};
