import React from 'react';
import {
  LayoutDashboard,
  Truck,
  Wrench,
  AlertTriangle,
  Clock,
  ClipboardCheck,
  Package,
  Hammer,
  Repeat,
  FileSpreadsheet,
  FileText,
  Database,
  ChevronRight,
  X
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'fleet'
  | 'wo'
  | 'backlog'
  | 'daily_hm'
  | 'p2h'
  | 'parts'
  | 'tools'
  | 'swab'
  | 'far'
  | 'meetings'
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

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  counts
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<any>; count?: number }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'fleet', label: 'Monitoring Armada', icon: Truck, count: counts.equip },
    { id: 'wo', label: 'Work Orders (WO)', icon: Wrench, count: counts.wo },
    { id: 'backlog', label: 'Backlog Defect', icon: AlertTriangle, count: counts.backlog },
    { id: 'daily_hm', label: 'Log Hour Meter & Fuel', icon: Clock },
    { id: 'p2h', label: 'Inspeksi Harian (P2H)', icon: ClipboardCheck },
    { id: 'parts', label: 'Katalog Part & Stok', icon: Package, count: counts.parts },
    { id: 'tools', label: 'Special Tools Tracker', icon: Hammer },
    { id: 'swab', label: 'Swab / Kanibalisasi', icon: Repeat },
    { id: 'far', label: 'Laporan Kerusakan (FAR)', icon: FileSpreadsheet },
    { id: 'meetings', label: 'Notulen Rapat Plant', icon: FileText },
    { id: 'system', label: 'Status Server & Backup', icon: Database },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-none">WOSys ERP</h1>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase mt-1">
                React Fullstack
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Modul Pemeliharaan
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-700/80 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Database</span>
              <span className="text-emerald-400 font-bold">SQLite WAL</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Frontend</span>
              <span className="text-cyan-400 font-bold">React 18 SPA</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
