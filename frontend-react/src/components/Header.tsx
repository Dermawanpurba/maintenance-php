import React from 'react';
import { Menu, RefreshCw, Shield, ExternalLink, Activity, AlertTriangle, Printer, PanelLeft } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenSidebar: () => void;
  apiOnline: boolean;
  latency: number;
  onRefresh: () => void;
  refreshing: boolean;
  onOpenBDAwal?: () => void;
  onPrintExecSummary?: () => void;
  isSecondaryOpen?: boolean;
  onToggleSecondary?: () => void;
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
  database_3d: {
    title: 'Relasi Database 3D & Arsitektur Menu ERP',
    subtitle: 'Visualisasi 3D interaktif yang menggambarkan hubungan relasi antar 24 tabel data operasional',
    tag: 'KNOWLEDGE GRAPH'
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
  bm_dashboard: {
    title: 'Basic Maintenance Executive Overview & Weekly Trends',
    subtitle: 'Grafik pemantauan tren kepatuhan mingguan (Week 40 - Week 43) dan matriks performa plant',
    tag: 'BASIC MAINTENANCE'
  },
  bm_inspection: {
    title: 'Basic Maintenance: 1. Weekly Inspection',
    subtitle: 'Pemeriksaan rutin mingguan kebocoran fluida, level oli hidrolik, dan integritas struktur',
    tag: 'BASIC MAINTENANCE'
  },
  bm_greasing: {
    title: 'Basic Maintenance: 2. Daily Greasing',
    subtitle: 'Pelumasan grease harian pada seluruh titik pin, bushing, swing circle, dan idler',
    tag: 'BASIC MAINTENANCE'
  },
  bm_washing: {
    title: 'Basic Maintenance: 3. Washing & Undercarriage Cleaning',
    subtitle: 'Pencucian lumpur bertekanan tinggi dan pembersihan kisi radiator unit tambang',
    tag: 'BASIC MAINTENANCE'
  },
  bm_ac_electrical: {
    title: 'Basic Maintenance: 4. AC & Electrical System',
    subtitle: 'Pengujian performa AC kabin, alternator charging 28V, motor starter, dan accu',
    tag: 'BASIC MAINTENANCE'
  },
  bm_bucket_blade: {
    title: 'Basic Maintenance: 5. Bucket / Blade / Wheel & Vessel',
    subtitle: 'Inspeksi adaptif model: Excavator (Tooth Bucket), Dump Truck (Wheel & Vessel), Dozer (Blade), Loader',
    tag: 'BASIC MAINTENANCE'
  },
  bm_undercarriage: {
    title: 'Basic Maintenance: 6. Clean Up UC & Chassis',
    subtitle: 'Pembersihan endapan lumpur padat pada frame track undercarriage atau kolong sasis roda & spakbor',
    tag: 'BASIC MAINTENANCE'
  },
  bm_retorque: {
    title: 'Basic Maintenance: 7. Retorque Component (UC / Wheel)',
    subtitle: 'Audit kekencangan torsi baut track shoe (580 Nm) atau baut roda dump truck (850 Nm) / loader (900 Nm)',
    tag: 'BASIC MAINTENANCE'
  },
  bm_tyre: {
    title: 'Basic Maintenance: 8. Tyre & Track Sag Inspection',
    subtitle: 'Pengukuran tekanan ban (105 PSI) & tread depth atau kekenduran rantai track sag (25-35 mm) & grouser',
    tag: 'BASIC MAINTENANCE'
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
    title: 'Planned Component Replacement (PCR)',
    subtitle: 'Jadwal peremajaan komponen utama (Engine, Transmission, Hydraulic Pump) terencana',
    tag: 'RELIABILITY'
  },
  ppu: {
    title: 'Program Pemeriksaan Undercarriage (PPU)',
    subtitle: 'Pengukuran keausan sprocket, track link, track shoe, dan idler unit alat berat berkala',
    tag: 'UC INSPECTION'
  },
  sos: {
    title: 'Scheduled Oil Sampling (SOS) & Condition Monitoring',
    subtitle: 'Pemantauan laboratorium pelumas, tren wear metals, kontaminasi, dan keandalan armada',
    tag: 'CONDITION MONITORING'
  },
  swab: {
    title: 'Component Swapping & Kanibalisasi Komponen',
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
    title: 'Aktivitas Mekanik & Logsheet Lapangan',
    subtitle: 'Pencatatan jam kerja efektif mekanik dan progres perbaikan di pit tambang',
    tag: 'DAILY OPS'
  },
  monthly_budget: {
    title: 'Maintenance Budget & Realization',
    subtitle: 'Monitoring anggaran, realisasi biaya perawatan, utilisasi budget & cost per unit armada alat berat',
    tag: 'BUDGET & COST'
  },
  meetings: {
    title: 'Notulen Rapat & Koordinasi Plant Bulanan',
    subtitle: 'Catatan hasil evaluasi mingguan, target KPI, dan instruksi manajemen plant',
    tag: 'COORDINATION'
  },
  target_jam_operasi: {
    title: 'Target Jam Operasi — Plan Alat Bulanan',
    subtitle: 'Rencana jam operasi harian per unit alat berat, next service, PM type, dan periode kalender',
    tag: 'PLAN ALAT'
  },
  planning_part_service: {
    title: 'Planning Part Service — Estimasi Kebutuhan Bulanan',
    subtitle: 'Kalkulasi kebutuhan suku cadang, oli & filter 1 bulan berjalan berbasis Target Jam Operasi dan Master Part Service',
    tag: 'PART SERVICE PLANNING'
  },
  fleet: {
    title: 'Master Unit & Monitoring Armada Alat Berat',
    subtitle: 'Kesiapan unit, lokasi site, dan status operasional (RFU / RWN / B/D)',
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
  master_crew: {
    title: 'Master Crew Teknisi & Struktur Komponen',
    subtitle: 'Manajemen personil mekanik, pelapor kerusakan pit, dan hierarki komponen',
    tag: 'CREW & COMPONENT'
  },
  master_part_service: {
    title: 'Master Part Service — Matrix Interval Periodic Service',
    subtitle: 'Database suku cadang & pelumas servis berkala interval PS 250, 500, 1000, 2000, 4000 jam',
    tag: 'PART SERVICE MATRIX'
  },
  ps_dt: {
    title: 'Master Part Service — Dump Truck (DT)',
    subtitle: 'Katalog Bill of Materials (BOM) suku cadang servis berkala PS 250, 500, 1000, 2000 unit Dump Truck',
    tag: 'PART SERVICE DT'
  },
  ps_exca: {
    title: 'Master Part Service — Excavator (Exca)',
    subtitle: 'Katalog Bill of Materials (BOM) suku cadang servis berkala PS 250, 500, 1000, 2000 unit Excavator',
    tag: 'PART SERVICE EXCA'
  },
  ps_dozer: {
    title: 'Master Part Service — Bulldozer (Dozer)',
    subtitle: 'Katalog Bill of Materials (BOM) suku cadang servis berkala PS 250, 500, 1000, 2000 unit Bulldozer',
    tag: 'PART SERVICE DOZER'
  },
  ps_greder: {
    title: 'Master Part Service — Motor Grader (Greder)',
    subtitle: 'Katalog Bill of Materials (BOM) suku cadang servis berkala PS 250, 500, 1000, 2000 unit Motor Grader',
    tag: 'PART SERVICE GREDER'
  },
  manage_users: {
    title: 'Kelola Pengguna & Hak Akses Fitur',
    subtitle: 'Persetujuan pendaftaran user baru, penugasan role, dan izin keamanan',
    tag: 'ACCESS CONTROL'
  },
  settings: {
    title: 'Pengaturan Sistem ERP & Parameter Site',
    subtitle: 'Konfigurasi identitas site tambang, interval refresh, dan pemeliharaan',
    tag: 'SETTINGS'
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
  onOpenBDAwal,
  onPrintExecSummary,
  isSecondaryOpen,
  onToggleSecondary
}) => {
  const current = titles[currentTab] || {
    title: 'WOSys ERP Management',
    subtitle: 'PT. Benamakmur Selaras Sejahtera',
    tag: 'MAINTENANCE'
  };

  return (
    <header className="h-16 flex-shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Hamburger (Mobile) / Sidebar Toggle (Desktop) + Title info */}
      <div className="flex items-center space-x-3 min-w-0">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 md:hidden transition-colors cursor-pointer"
          title="Buka Double Sidebar"
          type="button"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Quick Toggle Icon */}
        {onToggleSecondary && (
          <button
            onClick={onToggleSecondary}
            className="hidden md:flex p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title={isSecondaryOpen ? 'Sembunyikan Sub-Sidebar' : 'Buka Sub-Sidebar'}
            type="button"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-extrabold text-[9.5px] uppercase tracking-wider hidden sm:inline-block border border-blue-200/60">
              {current.tag}
            </span>
            <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
              {current.title}
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 hidden sm:inline-block" />
            <span className="text-xs text-emerald-600 font-semibold hidden md:inline">Online</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium truncate hidden md:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & Badges */}
      <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
        {/* Toggle Sub-Sidebar Pill Button (Desktop) */}
        {onToggleSecondary && (
          <button
            onClick={onToggleSecondary}
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            type="button"
          >
            <span>{isSecondaryOpen ? 'Sembunyikan Sub-Sidebar' : 'Buka Sub-Sidebar'}</span>
          </button>
        )}

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

        {/* Quick Breakdown Reporting Button */}
        {onOpenBDAwal && (
          <button
            onClick={onOpenBDAwal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black shadow-sm transition-all hover:shadow-md active:scale-95 animate-pulse"
            title="Lapor Breakdown Awal Unit (Emergency B/D)"
            type="button"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lapor BD Awal</span>
          </button>
        )}

        {/* Print Executive Summary */}
        {onPrintExecSummary && (
          <button
            onClick={onPrintExecSummary}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
            title="Cetak Resume Eksekutif (Print / PDF)"
            type="button"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Cetak Resume</span>
          </button>
        )}


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
