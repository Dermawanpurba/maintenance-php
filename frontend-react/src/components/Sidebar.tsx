import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  ClipboardList,
  Wrench,
  Clock,
  ShieldCheck,
  Droplets,
  Zap,
  Hammer,
  Microscope,
  Cpu,
  Repeat,
  AlertTriangle,
  Truck,
  Gauge,
  HardHat,
  Briefcase,
  Wallet,
  FileText,
  Database,
  Package,
  Settings,
  Shield,
  HardDrive,
  ChevronRight,
  ChevronLeft,
  X,
  Boxes,
  UserCheck,
  Users,
  Layers,
  Disc,
  Activity,
  CalendarDays,
  FolderKanban,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export type NavTab =
  | 'top_management'
  | 'dashboard'
  | 'database_3d'
  | 'wo'
  | 'backlog'
  | 'bm_dashboard'
  | 'bm_inspection'
  | 'bm_greasing'
  | 'bm_washing'
  | 'bm_ac_electrical'
  | 'bm_bucket_blade'
  | 'bm_undercarriage'
  | 'bm_retorque'
  | 'bm_tyre'
  | 'pm_washing'
  | 'pm_greasing'
  | 'pm_inspection'
  | 'pm_torque'
  | 'pm_battery'
  | 'pcr'
  | 'ppu'
  | 'swab'
  | 'far'
  | 'sos'
  | 'p2h'
  | 'daily_hm'
  | 'aktifitas'
  | 'monthly_budget'
  | 'meetings'
  | 'target_jam_operasi'
  | 'planning_part_service'
  | 'fleet'
  | 'parts'
  | 'tools'
  | 'master_crew'
  | 'master_part_service'
  | 'ps_dt'
  | 'ps_exca'
  | 'ps_dozer'
  | 'ps_greder'
  | 'manage_users'
  | 'settings'
  | 'system';

export interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  counts: {
    equip: number;
    wo: number;
    backlog: number;
    parts: number;
  };
  isSecondaryOpen?: boolean;
  onToggleSecondary?: () => void;
  onOpenBDAwal?: () => void;
  onPrintExecSummary?: () => void;
}

interface SubMenuItem {
  id: NavTab | 'admin_redirect';
  title: string;
  icon: React.FC<any>;
  iconColor: string;
  count?: number;
  isExternal?: boolean;
  url?: string;
}

interface QuickAccessItem {
  title: string;
  tab?: NavTab;
  action?: () => void;
}

interface ModuleConfig {
  id: string;
  railTitle: string;
  railIcon: React.FC<any>;
  cardTitle: string;
  cardBadge: string;
  cardDesc: string;
  ctaText: string;
  ctaIcon?: React.FC<any>;
  ctaAction: 'cta_bda' | 'cta_print' | 'cta_admin' | NavTab;
  submenus: SubMenuItem[];
  quickAccess: QuickAccessItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  counts,
  isSecondaryOpen: controlledIsSecondaryOpen,
  onToggleSecondary: controlledToggleSecondary,
  onOpenBDAwal,
  onPrintExecSummary
}) => {
  // Local state fallback if not controlled from parent
  const [internalSecondaryOpen, setInternalSecondaryOpen] = useState(true);
  const isSecondaryOpen =
    controlledIsSecondaryOpen !== undefined ? controlledIsSecondaryOpen : internalSecondaryOpen;

  const toggleSecondary = () => {
    if (controlledToggleSecondary) {
      controlledToggleSecondary();
    } else {
      setInternalSecondaryOpen(prev => !prev);
    }
  };

  // Mapping from NavTab to Module ID
  const tabToModuleMap: Record<NavTab, string> = {
    top_management: 'exec',
    dashboard: 'exec',
    database_3d: 'exec',

    wo: 'wo',
    backlog: 'wo',

    bm_dashboard: 'bm',
    bm_inspection: 'bm',
    bm_greasing: 'bm',
    bm_washing: 'bm',
    bm_ac_electrical: 'bm',
    bm_bucket_blade: 'bm',
    bm_undercarriage: 'bm',
    bm_retorque: 'bm',
    bm_tyre: 'bm',
    pm_washing: 'bm',
    pm_greasing: 'bm',
    pm_inspection: 'bm',
    pm_torque: 'bm',
    pm_battery: 'bm',

    pcr: 'reliability',
    ppu: 'reliability',
    sos: 'reliability',
    swab: 'reliability',
    far: 'reliability',

    p2h: 'daily',
    daily_hm: 'daily',
    aktifitas: 'daily',

    monthly_budget: 'plan',
    target_jam_operasi: 'plan',
    planning_part_service: 'plan',
    meetings: 'plan',

    fleet: 'master',
    parts: 'master',
    master_part_service: 'master',
    ps_dt: 'master',
    ps_exca: 'master',
    ps_dozer: 'master',
    ps_greder: 'master',
    tools: 'master',
    master_crew: 'master',

    manage_users: 'admin',
    settings: 'admin',
    system: 'admin'
  };

  const [activeModule, setActiveModule] = useState<string>(
    tabToModuleMap[currentTab] || 'exec'
  );

  // Sync active module if currentTab changes externally
  useEffect(() => {
    const targetModule = tabToModuleMap[currentTab];
    if (targetModule && targetModule !== activeModule) {
      setActiveModule(targetModule);
    }
  }, [currentTab]);

  // Master Module Definitions
  const modules: Record<string, ModuleConfig> = {
    exec: {
      id: 'exec',
      railTitle: 'Executive & KPI',
      railIcon: TrendingUp,
      cardTitle: 'Executive & KPI',
      cardBadge: 'EKSEKUTIF',
      cardDesc: 'Ringkasan tingkat tinggi performa armada, ketersediaan fisik (PA), MTBF & visualisasi 3D',
      ctaText: 'Cetak Resume Eksekutif',
      ctaIcon: Sparkles,
      ctaAction: 'cta_print',
      submenus: [
        { id: 'top_management', title: 'Top Management KPI', icon: LayoutDashboard, iconColor: 'text-emerald-500' },
        { id: 'dashboard', title: 'Operational Dashboard', icon: PieChart, iconColor: 'text-blue-500' },
        { id: 'database_3d', title: 'Relasi Database 3D', icon: Boxes, iconColor: 'text-cyan-500' }
      ],
      quickAccess: [
        { title: 'Physical Availability > 90%', tab: 'top_management' },
        { title: 'Visual Arsitektur 3D ERP', tab: 'database_3d' },
        { title: 'Status Breakdown Realtime', tab: 'dashboard' }
      ]
    },

    wo: {
      id: 'wo',
      railTitle: 'Work Order & Backlog',
      railIcon: ClipboardList,
      cardTitle: 'Work Order & Backlog',
      cardBadge: 'WO / DEFECT',
      cardDesc: 'Pencatatan perintah kerja (SPK), backlog defect, dan delegasi penanganan mekanik',
      ctaText: '+ Lapor BD Awal (Emergency)',
      ctaIcon: AlertTriangle,
      ctaAction: 'cta_bda',
      submenus: [
        { id: 'wo', title: 'Work Order Hub', icon: Wrench, iconColor: 'text-cyan-500', count: counts.wo },
        { id: 'backlog', title: 'Backlog Defect', icon: Clock, iconColor: 'text-amber-500', count: counts.backlog }
      ],
      quickAccess: [
        { title: 'Antrean Servis Terbuka', tab: 'wo' },
        { title: 'Defect Kritis Menunggu Part', tab: 'backlog' },
        { title: 'Form Emergency Breakdown', action: () => onOpenBDAwal && onOpenBDAwal() }
      ]
    },

    bm: {
      id: 'bm',
      railTitle: 'Basic Maintenance',
      railIcon: Wrench,
      cardTitle: 'Basic Maintenance',
      cardBadge: 'PERAWATAN',
      cardDesc: 'Inspeksi 8 pilar pemeliharaan dasar, pelumasan harian, pembersihan undercarriage & torsi',
      ctaText: '+ Mulai Inspeksi BM',
      ctaIcon: ShieldCheck,
      ctaAction: 'bm_inspection',
      submenus: [
        { id: 'bm_dashboard', title: 'Overview & Weekly Trends', icon: LayoutDashboard, iconColor: 'text-blue-500' },
        { id: 'bm_inspection', title: '1. Weekly Inspection', icon: ShieldCheck, iconColor: 'text-sky-500' },
        { id: 'bm_greasing', title: '2. Daily Greasing', icon: Wrench, iconColor: 'text-amber-500' },
        { id: 'bm_washing', title: '3. Washing & UC Cleaning', icon: Droplets, iconColor: 'text-cyan-500' },
        { id: 'bm_ac_electrical', title: '4. AC & Electrical System', icon: Zap, iconColor: 'text-purple-500' },
        { id: 'bm_bucket_blade', title: '5. Bucket / Blade / Wheel', icon: Hammer, iconColor: 'text-orange-500' },
        { id: 'bm_undercarriage', title: '6. Clean Up UC & Chassis', icon: Layers, iconColor: 'text-teal-500' },
        { id: 'bm_retorque', title: '7. Retorque Component', icon: Hammer, iconColor: 'text-rose-500' },
        { id: 'bm_tyre', title: '8. Tyre & Track Sag', icon: Disc, iconColor: 'text-indigo-500' }
      ],
      quickAccess: [
        { title: 'Tren Kepatuhan Week 43', tab: 'bm_dashboard' },
        { title: 'Audit Retorque Track Shoe (580 Nm)', tab: 'bm_retorque' },
        { title: 'Cek Tekanan Ban 105 PSI', tab: 'bm_tyre' }
      ]
    },

    reliability: {
      id: 'reliability',
      railTitle: 'Reliability & Komponen',
      railIcon: Microscope,
      cardTitle: 'Reliability & Komponen',
      cardBadge: 'KEANDALAN',
      cardDesc: 'Peremajaan komponen terencana (PCR), evaluasi keausan undercarriage (PPU), dan analisa oli (SOS)',
      ctaText: '+ Input Oil Sample (SOS)',
      ctaIcon: Droplets,
      ctaAction: 'sos',
      submenus: [
        { id: 'pcr', title: 'Component Replacement (PCR)', icon: Cpu, iconColor: 'text-orange-500' },
        { id: 'ppu', title: 'Pemeriksaan UC (PPU)', icon: Activity, iconColor: 'text-teal-500' },
        { id: 'sos', title: 'Oil Sampling (SOS)', icon: Droplets, iconColor: 'text-amber-500' },
        { id: 'swab', title: 'Component Swapping', icon: Repeat, iconColor: 'text-pink-500' },
        { id: 'far', title: 'Failure Analysis (FAR)', icon: AlertTriangle, iconColor: 'text-red-500' }
      ],
      quickAccess: [
        { title: 'Lab SOS — Wear Metals Kritis', tab: 'sos' },
        { title: 'Target Lifetime Engine (PCR)', tab: 'pcr' },
        { title: 'Investigasi Akar Masalah (RCA)', tab: 'far' }
      ]
    },

    daily: {
      id: 'daily',
      railTitle: 'Operasional Harian',
      railIcon: Truck,
      cardTitle: 'Operasional Harian',
      cardBadge: 'HARIAN',
      cardDesc: 'Pre-start safety checklist P2H, log hour meter & konsumsi solar, serta lembar kerja mekanik',
      ctaText: '+ Catat HM & Solar Harian',
      ctaIcon: Gauge,
      ctaAction: 'daily_hm',
      submenus: [
        { id: 'p2h', title: 'P2H & Inspeksi Harian', icon: ClipboardList, iconColor: 'text-cyan-500' },
        { id: 'daily_hm', title: 'Daily HM & Fuel', icon: Gauge, iconColor: 'text-purple-500' },
        { id: 'aktifitas', title: 'Laporan Aktivitas Mekanik', icon: HardHat, iconColor: 'text-amber-500' }
      ],
      quickAccess: [
        { title: 'Inspeksi Pre-Start Shift Pagi', tab: 'p2h' },
        { title: 'Log Jam Operasi Unit (HM)', tab: 'daily_hm' },
        { title: 'Efektivitas Mekanik Tambang', tab: 'aktifitas' }
      ]
    },

    plan: {
      id: 'plan',
      railTitle: 'Planning & Budget',
      railIcon: Briefcase,
      cardTitle: 'Planning & Koordinasi',
      cardBadge: 'RENCANA',
      cardDesc: 'Alokasi anggaran bulanan, target jam operasi unit, estimasi kebutuhan filter/oli & notulen rapat',
      ctaText: '+ Target Jam Operasi',
      ctaIcon: CalendarDays,
      ctaAction: 'target_jam_operasi',
      submenus: [
        { id: 'monthly_budget', title: 'Budget & Realization', icon: Wallet, iconColor: 'text-emerald-500' },
        { id: 'target_jam_operasi', title: 'Target Jam Operasi', icon: CalendarDays, iconColor: 'text-blue-500' },
        { id: 'planning_part_service', title: 'Planning Part Service', icon: ClipboardList, iconColor: 'text-cyan-500' },
        { id: 'meetings', title: 'Notulen Rapat Plant', icon: FileText, iconColor: 'text-amber-500' }
      ],
      quickAccess: [
        { title: 'Realisasi Biaya vs Anggaran', tab: 'monthly_budget' },
        { title: 'Kalkulasi Oli & Filter 1 Bulan', tab: 'planning_part_service' },
        { title: 'Notulen Evaluasi Mingguan', tab: 'meetings' }
      ]
    },

    master: {
      id: 'master',
      railTitle: 'Master & Gudang',
      railIcon: Database,
      cardTitle: 'Master & Gudang',
      cardBadge: 'DATA INDUK',
      cardDesc: 'Database armada unit, inventori suku cadang workshop, perkakas spesial, dan matrix part service',
      ctaText: '+ Cek Stok Suku Cadang',
      ctaIcon: Package,
      ctaAction: 'parts',
      submenus: [
        { id: 'fleet', title: 'Master Unit & Plan', icon: Truck, iconColor: 'text-indigo-500', count: counts.equip },
        { id: 'parts', title: 'Master Sparepart & Stok', icon: Package, iconColor: 'text-amber-500', count: counts.parts },
        { id: 'master_part_service', title: 'Master Part Service (Matrix)', icon: FolderKanban, iconColor: 'text-cyan-500' },
        { id: 'tools', title: 'Master Tools & Workshop', icon: Hammer, iconColor: 'text-orange-500' },
        { id: 'master_crew', title: 'Master Crew & Komponen', icon: Users, iconColor: 'text-teal-500' }
      ],
      quickAccess: [
        { title: 'Unit Ready For Use (RFU)', tab: 'fleet' },
        { title: 'Reorder Point Sparepart Kritis', tab: 'parts' },
        { title: 'Matrix Servis Berkala (PS)', tab: 'master_part_service' }
      ]
    },

    admin: {
      id: 'admin',
      railTitle: 'Sistem & Kontrol',
      railIcon: Settings,
      cardTitle: 'Sistem & Kontrol',
      cardBadge: 'KEAMANAN',
      cardDesc: 'Manajemen hak akses user, konfigurasi parameter site tambang, audit trail & backup data 1-klik',
      ctaText: 'Buka Filament 5 Admin',
      ctaIcon: Shield,
      ctaAction: 'cta_admin',
      submenus: [
        { id: 'manage_users', title: 'Kelola Pengguna & Akses', icon: UserCheck, iconColor: 'text-purple-500' },
        { id: 'settings', title: 'Pengaturan Sistem ERP', icon: Settings, iconColor: 'text-amber-500' },
        { id: 'system', title: 'Status Server & Backup', icon: HardDrive, iconColor: 'text-slate-500' },
        {
          id: 'admin_redirect',
          title: 'Filament Admin Panel',
          icon: Shield,
          iconColor: 'text-blue-500',
          isExternal: true,
          url: '/admin'
        }
      ],
      quickAccess: [
        { title: 'Arsip Backup Database .ZIP', tab: 'system' },
        { title: 'Persetujuan User Baru', tab: 'manage_users' },
        { title: 'Akses Portal Filament PHP 8.4', action: () => window.open('/admin', '_blank') }
      ]
    }
  };

  const currentModule = modules[activeModule] || modules['exec'];

  // Handler clicking rail icons
  const handleRailClick = (modId: string) => {
    setActiveModule(modId);
    // If secondary sidebar is collapsed, smoothly expand it
    if (!isSecondaryOpen) {
      if (controlledToggleSecondary) {
        controlledToggleSecondary();
      } else {
        setInternalSecondaryOpen(true);
      }
    }

    // Auto-select first tab of that module if current tab does not belong to it
    const targetMod = modules[modId];
    if (targetMod && targetMod.submenus.length > 0) {
      const isCurrentTabInMod = targetMod.submenus.some(sub => sub.id === currentTab);
      if (!isCurrentTabInMod) {
        const firstTab = targetMod.submenus[0];
        if (!firstTab.isExternal && firstTab.id !== 'admin_redirect') {
          onSelectTab(firstTab.id as NavTab);
        }
      }
    }
  };

  // Handler for primary CTA button
  const handleCtaClick = () => {
    const action = currentModule.ctaAction;
    if (action === 'cta_bda') {
      if (onOpenBDAwal) onOpenBDAwal();
    } else if (action === 'cta_print') {
      if (onPrintExecSummary) onPrintExecSummary();
    } else if (action === 'cta_admin') {
      window.open('/admin', '_blank');
    } else if (typeof action === 'string') {
      onSelectTab(action as NavTab);
    }
    onClose();
  };

  const CtaIcon = currentModule.ctaIcon || Sparkles;

  // The sidebar content used in both desktop and mobile drawer
  const sidebarContent = (
    <div className="flex h-full gap-2.5 sm:gap-3 relative select-none">
      {/* =========================================================================
           LEVEL 1: PRIMARY VERTICAL ICON RAIL (Bilah Ikon Kiri)
           ========================================================================= */}
      <aside
        id="primary-rail"
        className="w-[72px] flex-shrink-0 bg-[#0f172a] rounded-[28px] flex flex-col justify-between items-center py-4 px-2 shadow-xl shadow-slate-950/20 border border-slate-800/80 z-30 select-none transition-all duration-300"
      >
        {/* Top Group: Brand Mark + Dynamic Navigation Icons */}
        <div className="flex flex-col items-center w-full space-y-3">
          {/* App Master Logo Button */}
          <button
            type="button"
            onClick={() => handleRailClick('exec')}
            title="WOSys ERP — Beranda Eksekutif"
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600 hover:scale-105 active:scale-95 transition-transform duration-150 group cursor-pointer"
          >
            <Wrench className="w-6 h-6 text-blue-600 group-hover:rotate-12 transition-transform duration-200" />
          </button>

          <div className="w-8 h-px bg-white/10 my-1" />

          {/* Module Icons List */}
          <div className="flex flex-col items-center w-full space-y-2">
            {Object.keys(modules).map(modKey => {
              const mod = modules[modKey];
              const Icon = mod.railIcon;
              const isActive = modKey === activeModule;

              return (
                <button
                  key={mod.id}
                  id={`rail-item-${mod.id}`}
                  type="button"
                  onClick={() => handleRailClick(mod.id)}
                  title={mod.railTitle}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group relative cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-100 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-white scale-105' : 'text-slate-400 group-hover:text-white group-hover:scale-110'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Utility Actions (Filament Admin Panel) */}
        <div className="flex flex-col items-center space-y-2 w-full pt-2 border-t border-white/10">
          <a
            href="/admin"
            target="_blank"
            rel="noopener noreferrer"
            title="Buka Filament 5 Admin Panel"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <Shield className="w-5 h-5" />
          </a>
        </div>
      </aside>

      {/* =========================================================================
           LEVEL 2: SECONDARY COLLAPSIBLE SIDEBAR (Bilah Navigasi Sub-menu)
           ========================================================================= */}
      <aside
        id="secondary-sidebar"
        className={`sidebar-transition ${
          isSecondaryOpen
            ? 'w-72 opacity-100'
            : 'w-0 opacity-0 pointer-events-none p-0 border-0 overflow-hidden'
        } flex-shrink-0 bg-white rounded-[26px] shadow-sm border border-slate-200/80 flex flex-col justify-between overflow-hidden z-20`}
      >
        {/* Top Scrollable Content */}
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar p-4 space-y-4">
          {/* Header: Nama Brand & Tombol Ciutkan (<) */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
                <span className="text-sm font-black tracking-wider">WO</span>
              </div>
              <div className="truncate">
                <h1 className="text-sm font-bold text-slate-900 leading-tight truncate">
                  WOSys ERP
                </h1>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  Plant Maintenance Hub
                </p>
              </div>
            </div>

            {/* Tombol Collapse / Expand (<) */}
            <button
              type="button"
              onClick={toggleSecondary}
              title={isSecondaryOpen ? 'Sembunyikan Sidebar Sub-menu' : 'Buka Sidebar Sub-menu'}
              className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0 cursor-pointer"
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-300 ${
                  isSecondaryOpen ? '' : 'rotate-180'
                }`}
              />
            </button>
          </div>

          {/* Module Header Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {currentModule.cardTitle}
              </h2>
              <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 flex-shrink-0">
                {currentModule.cardBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {currentModule.cardDesc}
            </p>
          </div>

          {/* Primary Action CTA Button */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs rounded-full flex items-center justify-center space-x-2 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <CtaIcon className="w-4 h-4 text-white" />
            <span className="truncate">{currentModule.ctaText}</span>
          </button>

          {/* Submenu Navigation Group ("MENU UTAMA") */}
          <div className="space-y-1 pt-1">
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-2">
              MENU UTAMA
            </p>
            <div className="space-y-1">
              {currentModule.submenus.map((sub, idx) => {
                const SubIcon = sub.icon;
                const isActive = !sub.isExternal && currentTab === sub.id;

                if (sub.isExternal) {
                  return (
                    <a
                      key={`sub-ext-${idx}`}
                      href={sub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="submenu-item flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <SubIcon className={`w-4 h-4 ${sub.iconColor} flex-shrink-0`} />
                        <span className="truncate">{sub.title}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                    </a>
                  );
                }

                return (
                  <button
                    key={`sub-${sub.id}-${idx}`}
                    type="button"
                    onClick={() => {
                      onSelectTab(sub.id as NavTab);
                      onClose();
                    }}
                    className={`submenu-item w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <SubIcon
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? 'text-blue-600' : sub.iconColor
                        }`}
                      />
                      <span className="truncate">{sub.title}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {sub.count !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                            isActive
                              ? 'bg-blue-200/80 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {sub.count}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-blue-600 translate-x-0.5' : 'opacity-40'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Access Section ("AKSES CEPAT") */}
          {currentModule.quickAccess && currentModule.quickAccess.length > 0 && (
            <div className="pt-2 space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                AKSES CEPAT
              </p>
              {currentModule.quickAccess.map((qa, qIdx) => (
                <button
                  key={`qa-${qIdx}`}
                  type="button"
                  onClick={() => {
                    if (qa.action) {
                      qa.action();
                    } else if (qa.tab) {
                      onSelectTab(qa.tab);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center space-x-2.5 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium text-left cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="truncate">{qa.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom User Profile Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
              PL
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-900 truncate">Planner Plant</h4>
              <span className="text-[9.5px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded inline-block">
                PLANNER / ADMIN
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectTab('settings');
              onClose();
            }}
            title="Pengaturan Sistem"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
          />
          <div className="relative z-50 p-3 h-full flex items-center">
            {sidebarContent}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-900 shadow-md cursor-pointer"
              title="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Persistent Double Sidebar */}
      <div className="hidden md:flex h-full select-none flex-shrink-0">
        {sidebarContent}
      </div>
    </>
  );
};
