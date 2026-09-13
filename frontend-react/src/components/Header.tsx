import React from 'react';
import { Menu, RefreshCw, Download, Shield, ExternalLink, Activity } from 'lucide-react';
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

const titles: Record<NavTab, { title: string; subtitle: string; tag: string }> = {
  top_management: {
    title: 'Top Management Executive KPI & Plant Overview',
    subtitle: 'Ringkasan tingkat tinggi ketersediaan fisik armada (PA), MTBF, MTTR, dan utilisasi',
    tag: 'EXECUTIVE KPI'
  },
  dashboard: {
    title: 'Operational Dashboard & Real-Time Monitoring',
    subtitle: 'Status breakdown unit, antrean work order, dan operasional harian workshop',
    tag: 'OPERATIONAL'
  },
  wo: {
    title: 'Work Order Hub & Surat Perintah Kerja',
    subtitle: 'Pencatatan, delegasi mekanik, dan pelacakan riwayat servis breakdown',
    tag: 'WORK ORDERS'
  },
  backlog: {
    title: 'Backlog Management & Defect Register',
    subtitle: 'Daftar temuan defect inspeksi, urgensi penanganan, dan antrean suku cadang',
    tag: 'DEFECT LOG'
  },
  pm_washing: {
    title: 'PM Hub: 1. Unit Washing & Undercarriage Cleaning',
    subtitle: 'Pencucian lumpur bertekanan tinggi dan pembersihan radiator unit tambang',
    tag: 'PREVENTIVE'
  },
  pm_greasing: {
    title: 'PM Hub: 2. Greasing Full Points & Lubrication',
    subtitle: 'Pelumasan pin bushing, center joint, swing bearing, dan drive shaft',
    tag: 'PREVENTIVE'
  },
  pm_inspection: {
    title: 'PM Hub: 3. General Visual Inspection & Leaks',
    subtitle: 'Pemeriksaan kebocoran fluida, kekencangan hose, dan keretakan chassis',
    tag: 'PREVENTIVE'
  },
  pm_torque: {
    title: 'PM Hub: 4. Pengencangan Baut & Torque Check',
    subtitle: 'Verifikasi torsi baut track shoe, final drive, dan mounting engine',
    tag: 'PREVENTIVE'
  },
  pm_battery: {
    title: 'PM Hub: 5. Battery & Electrical System',
    subtitle: 'Pengujian alternator, motor starter, kabel grounding, dan voltase accu',
    tag: 'PREVENTIVE'
  },
  pcr: {
    title: 'Plan Component Replacement (PCR)',
    subtitle: 'Jadwal peremajaan komponen utama (Engine, Transmission, Hydraulic Pump) terencana',
    tag: 'RELIABILITY'
  },
  swab: {
    title: 'Swab & Kanibalisasi Komponen',
    subtitle: 'Dokumentasi resmi transfer komponen antar unit dengan nomor serial valid',
    tag: 'RELIABILITY'
  },
  far: {
    title: 'Failure Analysis Report (FAR)',
    subtitle: 'Laporan investigasi kegagalan teknis komponen dan evaluasi akar masalah (RCA)',
    tag: 'ANALYSIS'
  },
  p2h: {
    title: 'P2H & Checklist Inspeksi Harian',
    subtitle: 'Pemeriksaan kelayakan unit sebelum beroperasi (Pre-Start Safety Inspection)',
    tag: 'INSPECTION'
  },
  daily_hm: {
    title: 'Log Hour Meter & Pemakaian Bahan Bakar',
    subtitle: 'Pencatatan akumulasi jam operasi (HM) harian dan konsumsi solar/fuel',
    tag: 'HOUR METER'
  },
  aktifitas: {
    title: 'Aktifitas Mekanik & Logsheet Lapangan',
    subtitle: 'Pencatatan jam kerja efektif mekanik dan progress perbaikan di pit tambang',
    tag: 'DAILY OPS'
  },
  monthly_budget: {
    title: 'Plan Budget Bulanan Plant & Requisition',
    subtitle: 'Alokasi anggaran belanja suku cadang, pelumas, vendor machining, dan ban',
    tag: 'PLANNING'
  },
  meetings: {
    title: 'Notulen Rapat & Koordinasi Plant Bulanan',
    subtitle: 'Catatan hasil evaluasi mingguan, target KPI, dan instruksi manajemen plant',
    tag: 'COORDINATION'
  },
  fleet: {
    title: 'Master Unit & Monitoring Armada Alat Berat',
    subtitle: 'Kesiapan unit alat berat, lokasi site, dan status operasional (RFU / RWN / BD)',
    tag: 'FLEET MANAGEMENT'
  },
  parts: {
    title: 'Master Sparepart & Manajemen Gudang',
    subtitle: 'Katalog suku cadang, lokasi rak workshop, pergerakan stok, dan reorder point',
    tag: 'WAREHOUSE'
  },
  tools: {
    title: 'Master Perkakas & Special Tools Tracker',
    subtitle: 'Monitoring inventaris tools mekanik, status peminjaman, dan kalibrasi alat',
    tag: 'TOOLS'
  },
  system: {
    title: 'System Control, Konkurensi & Pencadangan',
    subtitle: 'Monitoring database SQLite WAL lokal, audit trail, dan arsip data .ZIP 1-klik',
    tag: 'SYSTEM'
  }
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
  const current = titles[currentTab] || {
    title: 'WOSys ERP Management',
    subtitle: 'PT. Benamakmur Selaras Sejahtera',
    tag: 'MAINTENANCE'
  };

  return (
    <header className="h-16 flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left: Hamburger + Title info */}
      <div className="flex items-center space-x-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 md:hidden transition-colors"
          title="Buka Menu"
          type="button"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[9.5px] uppercase tracking-wider hidden sm:inline-block border border-blue-200/60">
              {current.tag}
            </span>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
              {current.title}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate hidden md:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & Badges */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        {/* Latency / API status */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full ${
              apiOnline
                ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <span className="text-[11px] font-mono">{latency}ms</span>
        </div>

        {/* Reload button */}
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          title="Sinkronkan Data"
          type="button"
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`}
          />
        </button>

        {/* 1-Click Backup */}
        <button
          onClick={onBackup}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-sm transition-all hover:shadow-md active:scale-95"
          title="Unduh Backup Database .ZIP"
          type="button"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Backup .ZIP</span>
        </button>

        {/* Filament Admin Link */}
        <a
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition-all hover:shadow-md"
          title="Buka Filament 5 Admin Panel"
        >
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span>Admin</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
};
