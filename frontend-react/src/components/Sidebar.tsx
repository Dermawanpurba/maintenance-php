import React, { useState } from 'react';
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
  ChevronDown,
  ChevronLeft,
  X,
  Boxes,
  UserCheck,
  Users,
  Layers,
  Disc,
  Activity,
  CalendarDays
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
  | 'fleet'
  | 'parts'
  | 'tools'
  | 'master_crew'
  | 'manage_users'
  | 'settings'
  | 'system';

interface SidebarProps {
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
}

interface MenuItem {
  id: NavTab | 'admin_redirect';
  label: string;
  icon: React.FC<any>;
  iconColor: string;
  count?: number;
  isExternal?: boolean;
  url?: string;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: React.FC<any>;
  iconColor: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  counts
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    exec: true,
    wo: true,
    bm: true,
    pm: true,
    reliability: false,
    daily: false,
    plan: true,
    master: false,
    admin: false
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const menuGroups: MenuGroup[] = [
    {
      id: 'exec',
      label: 'Executive & KPI',
      icon: TrendingUp,
      iconColor: 'text-amber-400',
      items: [
        { id: 'top_management', label: 'Top Management KPI', icon: LayoutDashboard, iconColor: 'text-emerald-400' },
        { id: 'dashboard', label: 'Operational Dashboard', icon: PieChart, iconColor: 'text-blue-400' },
        { id: 'database_3d', label: 'Relasi Database 3D', icon: Boxes, iconColor: 'text-cyan-400' }
      ]
    },
    {
      id: 'wo',
      label: 'Work Order & Backlog',
      icon: ClipboardList,
      iconColor: 'text-blue-400',
      items: [
        { id: 'wo', label: 'Work Order Hub', icon: Wrench, iconColor: 'text-cyan-400', count: counts.wo },
        { id: 'backlog', label: 'Backlog Defect', icon: Clock, iconColor: 'text-amber-400', count: counts.backlog }
      ]
    },
    {
      id: 'bm',
      label: 'Basic Maintenance',
      icon: Wrench,
      iconColor: 'text-emerald-400',
      items: [
        { id: 'bm_dashboard', label: 'Overview & Weekly Trends', icon: LayoutDashboard, iconColor: 'text-blue-400' },
        { id: 'bm_inspection', label: '1. Weekly Inspection', icon: ShieldCheck, iconColor: 'text-sky-400' },
        { id: 'bm_greasing', label: '2. Daily Greasing', icon: Wrench, iconColor: 'text-amber-400' },
        { id: 'bm_washing', label: '3. Washing', icon: Droplets, iconColor: 'text-cyan-400' },
        { id: 'bm_ac_electrical', label: '4. AC & Electrical', icon: Zap, iconColor: 'text-purple-400' },
        { id: 'bm_bucket_blade', label: '5. Bucket / Blade / Wheel', icon: Hammer, iconColor: 'text-orange-400' },
        { id: 'bm_undercarriage', label: '6. Clean Up UC & Chassis', icon: Layers, iconColor: 'text-teal-400' },
        { id: 'bm_retorque', label: '7. Retorque (UC / Wheel)', icon: Hammer, iconColor: 'text-rose-400' },
        { id: 'bm_tyre', label: '8. Tyre & Track Sag', icon: Disc, iconColor: 'text-indigo-400' }
      ]
    },
    {
      id: 'reliability',
      label: 'Reliability & Comp',
      icon: Microscope,
      iconColor: 'text-orange-400',
      items: [
        { id: 'pcr',  label: 'Plan Component (PCR)',       icon: Cpu,          iconColor: 'text-orange-400' },
        { id: 'ppu',  label: 'Pemeriksaan UC (PPU)',        icon: Activity,     iconColor: 'text-teal-400'   },
        { id: 'sos',  label: 'Oil Sampling (SOS)',          icon: Droplets,     iconColor: 'text-amber-400'  },
        { id: 'swab', label: 'Swab Component',              icon: Repeat,       iconColor: 'text-pink-400'   },
        { id: 'far',  label: 'Failure Analysis (FAR)',      icon: AlertTriangle, iconColor: 'text-red-400'   }
      ]
    },
    {
      id: 'daily',
      label: 'Daily Operations',
      icon: Truck,
      iconColor: 'text-purple-400',
      items: [
        { id: 'p2h', label: 'P2H & Inspeksi Harian', icon: ClipboardList, iconColor: 'text-cyan-300' },
        { id: 'daily_hm', label: 'Input Daily HM & Fuel', icon: Gauge, iconColor: 'text-purple-300' },
        { id: 'aktifitas', label: 'Laporan Aktifitas', icon: HardHat, iconColor: 'text-amber-300' }
      ]
    },
    {
      id: 'plan',
      label: 'Planning & Coordination',
      icon: Briefcase,
      iconColor: 'text-emerald-400',
      items: [
        { id: 'monthly_budget', label: 'Plan Budget Bulanan', icon: Wallet, iconColor: 'text-emerald-300' },
        { id: 'target_jam_operasi', label: 'Target Jam Operasi', icon: CalendarDays, iconColor: 'text-blue-400' },
        { id: 'meetings', label: 'Notulen Rapat Plant', icon: FileText, iconColor: 'text-yellow-300' }
      ]
    },
    {
      id: 'master',
      label: 'Master & Warehouse',
      icon: Database,
      iconColor: 'text-emerald-400',
      items: [
        { id: 'fleet', label: 'Master Unit & Plan', icon: Truck, iconColor: 'text-indigo-400', count: counts.equip },
        { id: 'parts', label: 'Master Part & Stock', icon: Package, iconColor: 'text-amber-400', count: counts.parts },
        { id: 'tools', label: 'Master Tool & Workshop', icon: Hammer, iconColor: 'text-orange-400' },
        { id: 'master_crew', label: 'Master Crew & Komponen', icon: Users, iconColor: 'text-teal-400' }
      ]
    },
    {
      id: 'admin',
      label: 'System Control',
      icon: Settings,
      iconColor: 'text-rose-400',
      items: [
        { id: 'manage_users', label: 'Kelola User & Akses', icon: UserCheck, iconColor: 'text-purple-400' },
        { id: 'settings', label: 'Pengaturan Sistem', icon: Settings, iconColor: 'text-amber-400' },
        {
          id: 'admin_redirect',
          label: 'Filament Admin Panel',
          icon: Shield,
          iconColor: 'text-blue-400',
          isExternal: true,
          url: '/admin'
        },
        { id: 'system', label: 'Status Server & Backup', icon: HardDrive, iconColor: 'text-slate-300' }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`
          ${collapsed ? 'capsule-sidebar collapsed' : 'capsule-sidebar expanded'}
          fixed md:sticky top-0 bottom-0 left-0 z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 !w-[270px]' : '-translate-x-full md:translate-x-0'}
          bg-[#0f172a] text-white
          flex flex-col
        `}
      >
        {/* Circular Floating Collapse Button (Desktop Only) */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-collapse-btn hidden md:flex"
          title={collapsed ? 'Buka Sidebar' : 'Lipat Sidebar'}
          aria-label="Toggle Sidebar"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Brand Header */}
        <div
          className={`p-4 border-b border-white/10 flex items-center ${
            collapsed ? 'justify-center' : 'justify-between space-x-3'
          }`}
        >
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-black tracking-tight uppercase text-white truncate">
                  WOSys ERP
                </span>
                <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest truncate">
                  Maintenance Hub
                </span>
              </div>
            )}
          </div>

          {/* Close Button on Mobile */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="sidebar-nav flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuGroups.map(group => {
            const GroupIcon = group.icon;
            const isGroupOpen = openGroups[group.id] !== false;

            return (
              <div key={group.id} className="menu-group">
                {/* Group Accordion Header */}
                {!collapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon className={`w-3.5 h-3.5 ${group.iconColor}`} />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                        {group.label}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-transform duration-200 ${
                        isGroupOpen ? '' : '-rotate-90'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="w-6 h-px bg-white/10 mx-auto my-2" />
                )}

                {/* Sub Menu Items */}
                {(!collapsed ? isGroupOpen : true) && (
                  <div className={`mt-1 space-y-0.5 ${!collapsed ? 'pl-2 border-l border-white/10 ml-3' : ''}`}>
                    {group.items.map((item, idx) => {
                      const ItemIcon = item.icon;
                      const isActive = !item.isExternal && currentTab === item.id;

                      if (item.isExternal) {
                        return (
                          <a
                            key={`${group.id}-ext-${idx}`}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                              flex items-center rounded-xl transition-all
                              ${
                                collapsed
                                  ? 'w-10 h-10 mx-auto justify-center hover:bg-white/10 text-slate-400'
                                  : 'w-full h-10 px-3 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 gap-2.5'
                              }
                            `}
                            title={item.label}
                          >
                            <ItemIcon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                          </a>
                        );
                      }

                      return (
                        <button
                          key={`${group.id}-${item.id}-${idx}`}
                          type="button"
                          onClick={() => {
                            onSelectTab(item.id as NavTab);
                            onClose();
                          }}
                          className={`
                            flex items-center rounded-xl transition-all duration-200 group cursor-pointer
                            ${
                              collapsed
                                ? `w-10 h-10 mx-auto justify-center ${
                                    isActive
                                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                  }`
                                : `w-full h-9 px-2.5 text-xs font-semibold gap-2.5 ${
                                    isActive
                                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                                      : 'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-0.5'
                                  }`
                            }
                          `}
                          title={item.label}
                        >
                          <ItemIcon
                            className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-white' : item.iconColor
                            }`}
                          />
                          {!collapsed && (
                            <div className="flex-1 flex items-center justify-between min-w-0">
                              <span className="truncate text-left">{item.label}</span>
                              {item.count !== undefined && (
                                <span
                                  className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                                    isActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-white/10 text-slate-400 group-hover:text-white'
                                  }`}
                                >
                                  {item.count}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer (Profile Card) */}
        <div className="p-3 border-t border-white/10 bg-black/20 mt-auto rounded-b-[28px]">
          <div
            className={`flex items-center ${
              collapsed ? 'justify-center mb-2' : 'space-x-3 mb-2 p-2 rounded-2xl bg-white/5'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md">
              P
            </div>
            {!collapsed && (
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="text-xs font-black text-white truncate leading-tight">
                  Planner Plant
                </div>
                <div className="text-[8px] text-blue-300 font-extrabold uppercase tracking-wider">
                  Admin / Plant Team
                </div>
              </div>
            )}
          </div>

          <a
            href="/admin"
            className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
              collapsed
                ? 'w-10 h-10 p-0 mx-auto bg-white/10 text-white hover:bg-white/20'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Akses Filament Admin"
          >
            <Shield className="w-3.5 h-3.5" />
            {!collapsed && <span>Admin Panel</span>}
          </a>
        </div>
      </aside>
    </>
  );
};
