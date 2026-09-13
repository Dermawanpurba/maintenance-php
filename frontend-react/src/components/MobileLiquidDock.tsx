import React from 'react';
import { LayoutDashboard, Wrench, Clock, ClipboardCheck, Truck } from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileLiquidDockProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileLiquidDock: React.FC<MobileLiquidDockProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const dockItems = [
    { id: 'dashboard' as NavTab, label: 'KPI', icon: LayoutDashboard },
    { id: 'fleet' as NavTab, label: 'Armada', icon: Truck },
    { id: 'wo' as NavTab, label: 'Work Order', icon: Wrench },
    { id: 'daily_hm' as NavTab, label: 'Daily HM', icon: Clock },
    { id: 'p2h' as NavTab, label: 'P2H', icon: ClipboardCheck },
  ];

  return (
    <div className="liquid-navigation-container md:hidden">
      <div className="liquid-dock">
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`dock-item ${isActive ? 'active' : ''}`}
              title={item.label}
              type="button"
            >
              <Icon className="dock-icon w-5 h-5" />
              <span className="dock-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
