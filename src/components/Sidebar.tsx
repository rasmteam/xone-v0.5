import React from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  pendingApprovalsCount?: number;
  /** Home/landing tab of the active organizational role (dashboard vs construction dashboard) */
  homeTab?: NavigationTab;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  pendingApprovalsCount = 3,
  homeTab = 'dashboard'
}) => {
  const navItems: { tab: NavigationTab; label: string; icon: string; badge?: number }[] = [
    {
      tab: homeTab,
      label: 'خانه',
      icon: 'space_dashboard'
    },
    {
      tab: 'cde',
      label: 'CDE',
      icon: 'cloud_sync'
    },
    {
      tab: 'bim',
      label: 'BIM',
      icon: 'view_in_ar'
    },
    {
      tab: 'approvals',
      label: 'تاییدات',
      icon: 'fact_check',
      badge: pendingApprovalsCount
    },
    {
      tab: 'permissions',
      label: 'دسترسی‌ها',
      icon: 'admin_panel_settings'
    }
  ];

  return (
    <aside
      className="fixed right-0 top-16 bottom-0 w-16 bg-white border-l border-slate-200 z-40 flex flex-col items-center py-4 select-none shadow-xs"
      dir="rtl"
    >
      <nav className="flex flex-col gap-2.5 items-center w-full px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigate(item.tab)}
              className={`relative w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer group gap-0.5 ${
                isActive
                  ? 'bg-[#00716B] text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
              title={item.label}
              type="button"
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className={`text-[10px] ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on left in RTL */}
              <div className="absolute right-16 whitespace-nowrap bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-2.5 w-full px-2">
        {/* Portfolio shortcut */}
        <button
          onClick={() => onNavigate('portfolio')}
          className={`relative w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer group gap-0.5 ${
            currentTab === 'portfolio'
              ? 'bg-[#00716B] text-white shadow-xs'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="پورتفوی پروژه‌ها"
          type="button"
        >
          <span className="material-symbols-outlined text-xl">apartment</span>
          <span className="text-[10px] font-medium">پروژه‌ها</span>
          <div className="absolute right-16 whitespace-nowrap bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
            پورتفوی کل پروژه‌ها
          </div>
        </button>

        {/* Settings button */}
        <button
          onClick={() => onNavigate('permissions')}
          className="relative w-12 h-12 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors rounded-xl gap-0.5 cursor-pointer group"
          title="تنظیمات"
          type="button"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="text-[10px] font-medium">تنظیمات</span>
          <div className="absolute right-16 whitespace-nowrap bg-slate-900 text-white text-xs font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50">
            تنظیمات پروتکل CDE
          </div>
        </button>

        {/* Server online indicator */}
        <div className="flex items-center justify-center pt-1" title="اتصال سرور CDE برقرار است">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00716B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00716B]"></span>
          </span>
        </div>
      </div>
    </aside>
  );
};
