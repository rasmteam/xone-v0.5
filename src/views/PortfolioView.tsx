import React, { useState, useMemo } from 'react';
import { Project, NavigationTab } from '../types';
import { PROJECTS } from '../data/mockData';
import { useDissolve } from '../hooks/useDissolve';

interface PortfolioViewProps {
  currentProject: Project;
  onSelectProject: (proj: Project) => void;
  onNavigate: (tab: NavigationTab) => void;
  onTriggerToast: (title: string, description: string, type?: 'success' | 'error' | 'info') => void;
  onOpenExcelIpc?: () => void;
  onOpenDocumentDossier?: (docId: string) => void;
  /** Home/landing tab of the active organizational role (dashboard vs construction dashboard) */
  homeTab?: NavigationTab;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  currentProject,
  onSelectProject,
  onNavigate,
  onTriggerToast,
  onOpenExcelIpc,
  onOpenDocumentDossier,
  homeTab = 'dashboard'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'onTrack' | 'issues' | 'finalizing'>('all');
  const [usageFilter, setUsageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'progress-desc' | 'progress-asc' | 'budget-desc' | 'code' | 'area-desc'>('progress-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [selectedDossierProject, setSelectedDossierProject] = useState<Project | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [comparedProjectIds, setComparedProjectIds] = useState<string[]>(['baran-kish', 'baran-4', 'baran-3']);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const dossierDissolve = useDissolve(!!selectedDossierProject);
  const compareDissolve = useDissolve(isCompareModalOpen);
  const newProjectDissolve = useDissolve(isNewProjectModalOpen);

  // New Project Form State
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    code: '',
    location: '',
    budget: '',
    usage: 'مسکونی لوکس',
    stage: 'فاز ۱: تهیه مدل مفهومی BIM و تاییدات اولیه'
  });

  // Filter and Sort Projects
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((proj) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        proj.name.toLowerCase().includes(q) ||
        proj.code.toLowerCase().includes(q) ||
        proj.location.toLowerCase().includes(q) ||
        (proj.usage && proj.usage.toLowerCase().includes(q)) ||
        (proj.contractor && proj.contractor.toLowerCase().includes(q));

      let matchesStatus = true;
      if (statusFilter === 'onTrack') matchesStatus = proj.status === 'onTrack';
      if (statusFilter === 'issues') matchesStatus = proj.status === 'critical' || proj.status === 'atRisk';
      if (statusFilter === 'finalizing') matchesStatus = proj.status === 'finalizing';

      let matchesUsage = true;
      if (usageFilter !== 'all') {
        matchesUsage = proj.usage?.includes(usageFilter) || false;
      }

      return matchesSearch && matchesStatus && matchesUsage;
    }).sort((a, b) => {
      if (sortBy === 'progress-desc') return b.progress - a.progress;
      if (sortBy === 'progress-asc') return a.progress - b.progress;
      if (sortBy === 'code') return a.code.localeCompare(b.code);
      if (sortBy === 'area-desc') {
        const parseArea = (str?: string) => (str ? parseInt(str.replace(/[^0-9]/g, ''), 10) || 0 : 0);
        return parseArea(b.area) - parseArea(a.area);
      }
      if (sortBy === 'budget-desc') {
        const parseBudget = (str: string) => parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
        return parseBudget(b.budget) - parseBudget(a.budget);
      }
      return 0;
    });
  }, [searchQuery, statusFilter, usageFilter, sortBy]);

  const handleSelectAndGo = (proj: Project, destinationTab: NavigationTab = homeTab) => {
    onSelectProject(proj);
    onNavigate(destinationTab);
    onTriggerToast(
      'تغییر پروژه فعال',
      `پروژه «${proj.name}» به عنوان پروژه فعال انتخاب شد و به ${
        destinationTab === 'dashboard' ? 'پیشخوان' : destinationTab === 'cde' ? 'اسناد CDE' : 'BIM'
      } منتقل شدید.`,
      'success'
    );
  };

  const toggleCompareProject = (id: string) => {
    if (comparedProjectIds.includes(id)) {
      if (comparedProjectIds.length > 1) {
        setComparedProjectIds((prev) => prev.filter((p) => p !== id));
      } else {
        onTriggerToast('خطا در مقایسه', 'حداقل یک پروژه برای مقایسه باید انتخاب شده باشد.', 'error');
      }
    } else {
      if (comparedProjectIds.length >= 3) {
        onTriggerToast('محدودیت مقایسه', 'امکان مقایسه همزمان حداکثر ۳ پروژه وجود دارد.', 'info');
      } else {
        setComparedProjectIds((prev) => [...prev, id]);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* 1. Header Card: Baran Corporate Identity & Executive Portal */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00716B] to-[#004e4a] text-white flex items-center justify-center shadow-md shadow-[#00716B]/20 shrink-0">
            <span className="material-symbols-outlined text-3xl">corporate_fare</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00716B]/10 text-[#00716B] border border-[#00716B]/20">
                گروه سرمایه‌گذاری و ساختمانی باران • Baran Investment Group
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                پلتفرم CDE یکپارچه ISO 19650
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-markazi text-slate-900 tracking-tight">
              درگاه مدیریت و انتخاب پروژه‌های هلدینگ باران
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              سامانه متمرکز پایش سبد پروژه‌ها، محیط مشترک تبادل داده‌ها (CDE)، مدلسازی اطلاعات ساخت (BIM) و مدیریت یکپارچه اسناد و اعتبارات عمرانی
            </p>
          </div>
        </div>

        {/* User Profile & System Status */}
        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00716B] to-teal-400 text-white font-bold text-lg flex items-center justify-center shadow-xs">
            سپ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 font-markazi text-base">مهندس سهراب پارسا</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#00716B] text-white">مدیر ارشد پروژه‌ها</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">سطح دسترسی ۵: ناظر عالیه و مدیر ارشد پورتفوی هلدینگ</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                سرور ابری Xone (پایدار)
              </span>
              <span>•</span>
              <span>همگام با کاتالوگ جامع باران کیش</span>
            </div>
          </div>
        </div>
      </div>
      {/* 4. Toolbar: Search, Filters, Sort, and View Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="جستجو در پروژه‌های باران (باران ۱، ۲، ۳، ۴، ۵، کیش، یونیک وان، پیور وان)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00716B] focus:ring-2 focus:ring-[#00716B]/20 outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips & Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              همه ({PROJECTS.length})
            </button>
            <button
              onClick={() => setStatusFilter('onTrack')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'onTrack'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              در حال ساخت ({PROJECTS.filter((p) => p.status === 'onTrack').length})
            </button>
            <button
              onClick={() => setStatusFilter('finalizing')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'finalizing'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              بهره‌برداری ({PROJECTS.filter((p) => p.status === 'finalizing').length})
            </button>
            <button
              onClick={() => setStatusFilter('issues')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                statusFilter === 'issues'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ریسک اجرایی ({PROJECTS.filter((p) => p.status === 'critical' || p.status === 'atRisk').length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium focus:border-[#00716B] outline-hidden cursor-pointer"
          >
            <option value="progress-desc">پیشرفت فیزیکی (بیشترین)</option>
            <option value="progress-asc">پیشرفت فیزیکی (کمترین)</option>
            <option value="area-desc">زیربنای کل (بیشترین)</option>
            <option value="budget-desc">ارزش برآوردی بودجه</option>
            <option value="code">کد پروژه (ISO Code)</option>
          </select>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#00716B] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="نمای شبکه‌ای کارت‌های عمودی"
            >
              <span className="material-symbols-outlined text-lg">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#00716B] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="نمای جدول مقایسه‌ای"
            >
              <span className="material-symbols-outlined text-lg">table_rows</span>
            </button>
          </div>

          {/* Compare Modal Button */}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#00716B]">compare_arrows</span>
            <span>مقایسه پروژه‌ها</span>
          </button>

          {/* New Project Button */}
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#00716B] hover:bg-[#005a55] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>ثبت پروژه در CDE</span>
          </button>
        </div>
      </div>

      {/* 5. Main Content: Vertical Card Grid View or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((proj) => {
            const isCurrentActive = proj.id === currentProject.id;
            const variance = (proj.progress - proj.baselineProgress).toFixed(1);
            const isAhead = parseFloat(variance) >= 0;

            return (
              <div
                key={proj.id}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-xl ${
                  isCurrentActive
                    ? 'border-2 border-[#00716B] ring-4 ring-[#00716B]/15 relative'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Active Project Ribbon */}
                {isCurrentActive && (
                  <div className="bg-[#00716B] text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between shrink-0">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      پروژه فعال کنونی در سیستم
                    </span>
                    <span className="text-[10px] opacity-80">پیشخوان آماده</span>
                  </div>
                )}

                {/* Vertical Card Image Container (Portrait aspect-ratio 3/4) */}
                <div className="relative aspect-3/4 w-full overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={proj.image}
                    alt={proj.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-black/40 pointer-events-none"></div>

                  {/* Top Overlay: Project Code & Year / Status */}
                  <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                    <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg font-mono text-xs text-white font-bold tracking-wider border border-white/20 shadow-xs">
                      {proj.code}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {proj.year && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/25">
                          سال {proj.year}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-xs ${
                          proj.status === 'critical'
                            ? 'bg-rose-500/90 text-white border-rose-400'
                            : proj.status === 'atRisk'
                            ? 'bg-amber-500/90 text-white border-amber-400'
                            : proj.status === 'finalizing'
                            ? 'bg-emerald-600/90 text-white border-emerald-400'
                            : 'bg-[#00716B]/90 text-white border-teal-400'
                        }`}
                      >
                        {proj.statusText}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Image Overlay: Project Title, Location, Floors, Units */}
                  <div className="absolute bottom-3 right-3 left-3 text-white pointer-events-none">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                      <span className="material-symbols-outlined text-xs text-teal-300">location_on</span>
                      <span className="truncate">{proj.location}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-markazi text-white leading-tight drop-shadow-md">
                      {proj.name}
                    </h3>

                    {/* Key Vertical Card Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-teal-200 mt-1.5 font-medium">
                      {proj.floors && (
                        <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                          {proj.floors}
                        </span>
                      )}
                      {proj.unitsCount && (
                        <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                          {proj.unitsCount} واحد
                        </span>
                      )}
                      {proj.area && (
                        <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                          زیربنا: {proj.area}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body: Stage, Progress, Stats, and Actions */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
                  {/* Current Stage */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2 text-xs">
                    <span className="material-symbols-outlined text-slate-500 text-base shrink-0 mt-0.5">
                      construction
                    </span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">وضعیت اجرایی:</span>
                      <span className="text-slate-800 font-medium line-clamp-1">{proj.stage}</span>
                    </div>
                  </div>

                  {/* Physical Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-semibold">پیشرفت فیزیکی واقعی</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black font-markazi text-slate-900 font-mono">
                          {proj.progress}٪
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isAhead ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {isAhead ? `+${variance}٪` : `${variance}٪`}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          proj.status === 'critical'
                            ? 'bg-rose-500'
                            : proj.status === 'atRisk'
                            ? 'bg-amber-500'
                            : proj.status === 'finalizing'
                            ? 'bg-emerald-500'
                            : 'bg-[#00716B]'
                        }`}
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Authentic Stats Grid from Catalog */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block mb-0.5">مساحت زمین</span>
                      <span className="font-bold text-slate-800 font-markazi text-sm block">
                        {proj.landArea || '—'}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        مشاعات: {proj.commonArea || '—'}
                      </span>
                    </div>

                    <div className="bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block mb-0.5">وضعیت BIM و CDE</span>
                      <span className="font-bold text-[#00716B] font-markazi text-sm block">
                        {proj.lod}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {proj.clashesCount === 0 ? 'بدون کلش' : `${proj.clashesCount} کلش فعال`}
                      </span>
                    </div>
                  </div>

                  {/* Critical Issue / Note if applicable */}
                  {proj.criticalIssues && (
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#00716B] text-sm shrink-0">info</span>
                      <span className="truncate">{proj.criticalIssues}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {/* Primary Button */}
                    <button
                      onClick={() => handleSelectAndGo(proj)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isCurrentActive
                          ? 'bg-[#00716B] text-white shadow-sm hover:bg-[#005a55]'
                          : 'bg-slate-900 hover:bg-[#00716B] text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isCurrentActive ? 'dashboard' : 'login'}
                      </span>
                      <span>{isCurrentActive ? 'ورود به پیشخوان پروژه جاری' : 'انتخاب پروژه و ورود'}</span>
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-4">تصویر و مشخصات پروژه</th>
                  <th className="p-4">موقعیت و کاربری</th>
                  <th className="p-4">زیربنا و مشخصات کالبدی</th>
                  <th className="p-4 text-center">پیشرفت فیزیکی</th>
                  <th className="p-4">بودجه و اعتبارات</th>
                  <th className="p-4">وضعیت</th>
                  <th className="p-4">سطح BIM</th>
                  <th className="p-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((proj) => {
                  const isCurrentActive = proj.id === currentProject.id;
                  const variance = (proj.progress - proj.baselineProgress).toFixed(1);
                  const isAhead = parseFloat(variance) >= 0;

                  return (
                    <tr
                      key={proj.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrentActive ? 'bg-[#00716B]/5 font-semibold' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={proj.image}
                            alt={proj.name}
                            className="w-12 h-16 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {proj.code}
                              </span>
                              {proj.year && (
                                <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold">
                                  {proj.year}
                                </span>
                              )}
                              {isCurrentActive && (
                                <span className="bg-[#00716B] text-white text-[9px] px-1.5 py-0.2 rounded font-bold">
                                  فعال
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-slate-900 font-markazi text-base block mt-0.5">
                              {proj.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600">
                        <span className="block font-medium">{proj.location}</span>
                        <span className="text-[11px] text-slate-400">{proj.usage}</span>
                      </td>

                      <td className="p-4 text-slate-700">
                        <span className="block font-medium">زیربنا: {proj.area}</span>
                        <span className="text-[11px] text-slate-400">{proj.floors} • {proj.unitsCount ? `${proj.unitsCount} واحد` : ''}</span>
                      </td>

                      <td className="p-4 text-center min-w-[140px]">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="font-bold font-markazi text-base text-slate-900">
                            {proj.progress}٪
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1 rounded ${
                              isAhead ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                            }`}
                          >
                            {isAhead ? `+${variance}٪` : `${variance}٪`}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              proj.status === 'critical' ? 'bg-rose-500' : 'bg-[#00716B]'
                            }`}
                            style={{ width: `${proj.progress}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-[#00716B] font-markazi text-sm block">
                          {proj.budget}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{proj.financialSpent}</span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            proj.status === 'critical'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : proj.status === 'atRisk'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : proj.status === 'finalizing'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}
                        >
                          {proj.statusText}
                        </span>
                      </td>

                      <td className="p-4 text-slate-600">
                        <span className="font-medium text-[11px] block">{proj.lod}</span>
                        <span className="text-[10px] text-slate-400">
                          {proj.clashesCount === 0 ? 'بدون کلش' : `${proj.clashesCount} کلش`}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSelectAndGo(proj)}
                            className="px-3 py-1.5 rounded-lg bg-[#00716B] hover:bg-[#005a55] text-white text-xs font-bold transition-colors cursor-pointer"
                            title="انتخاب و مشاهده پیشخوان"
                          >
                            {isCurrentActive ? 'پیشخوان' : 'انتخاب'}
                          </button>
                          <button
                            onClick={() => setSelectedDossierProject(proj)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="شناسنامه پروژه"
                          >
                            <span className="material-symbols-outlined text-base">info</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Corporate Support & ISO 19650 Standards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Support Card 1: ISO Standards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00716B] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-markazi text-base">
              استاندارد ایزو ۱۹۶۵۰ در هلدینگ باران
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              کلیه نام‌گذاری‌ها، بازنگری‌ها و جریان‌های کاری تایید اسناد بر اساس ویرایش نهایی ISO 19650-1,2 استانداردسازی شده است.
            </p>
          </div>
        </div>

        {/* Support Card 2: Help Desk & Corporate Support */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">support_agent</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-markazi text-base">
              میز پشتیبانی و راهبری سیستم (Corporate Support)
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              دفتر مدیریت پروژه‌ها (PMO) و تیم راهبری BIM هلدینگ به صورت آنلاین آماده پاسخگویی و رفع تعارضات ساختاری می‌باشند.
            </p>
          </div>
        </div>

        {/* Support Card 3: Xone Cloud Infrastructure */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">cloud_done</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-markazi text-base">
              امنیت و پایداری مخزن Xone Cloud (v4.2)
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              ذخیره‌سازی رمزنگاری‌شده اسناد، هش SHA-256 فایل‌های مهندسی و نسخه پشتیبان خودکار ساعتی در مراکز داده امن هلدینگ.
            </p>
          </div>
        </div>
      </div>

      {/* 7. Corporate Footer */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00716B] text-lg">corporate_fare</span>
          <span className="font-semibold text-slate-700">
            گروه ساختمانی و سرمایه‌گذاری باران • سامانه مدیریت سبد پروژه‌ها و CDE یکپارچه
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span>منبع داده‌ها: کاتالوگ تعاملی باران کیش</span>
          <span>•</span>
          <span className="font-mono">نسخه سامانه: ۴.۲.۸</span>
        </div>
      </div>

      {/* MODAL 1: Project Technical Dossier Modal */}
      {dossierDissolve.visible && selectedDossierProject && (
        <div
          className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 ${dossierDissolve.closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
          onClick={() => setSelectedDossierProject(null)}
        >
          <div
            className={`bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-200 shadow-2xl flex flex-col ${dossierDissolve.closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center font-bold text-lg">
                  <span className="material-symbols-outlined text-2xl">apartment</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-200 px-2 py-0.5 rounded text-slate-800">
                      {selectedDossierProject.code}
                    </span>
                    {selectedDossierProject.year && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        سال {selectedDossierProject.year}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {selectedDossierProject.statusText}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-markazi text-slate-900 mt-1">
                    شناسنامه فنی و معماری: {selectedDossierProject.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedDossierProject(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Photo & High-level Specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="aspect-3/4 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
                  <img
                    src={selectedDossierProject.image}
                    alt={selectedDossierProject.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 font-markazi text-base">
                    مشخصات کالبدی و جغرافیایی (مندرج در کاتالوگ باران)
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">موقعیت دقیق:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">کاربری اصلی:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.usage}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">تعداد طبقات:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.floors}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">سطح زیربنای کل:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.area}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">مساحت زمین:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.landArea || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">تعداد واحدها:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.unitsCount ? `${selectedDossierProject.unitsCount} واحد` : '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">زیربنای مسکونی:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.residentialArea || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">زیربنای مشاعات:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.commonArea || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">پیمانکار عمومی:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.contractor}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">هماهنگ‌کننده BIM:</span>
                      <span className="font-semibold text-slate-800">{selectedDossierProject.bimCoordinator}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Financial Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-xs text-slate-400 font-medium block">پیشرفت فیزیکی واقعی</span>
                  <div className="text-3xl font-bold font-markazi text-slate-900 mt-1">
                    {selectedDossierProject.progress}٪
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    خط مبنای مصوب: {selectedDossierProject.baselineProgress}٪
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-xs text-slate-400 font-medium block">ارزش برآوردی بودجه</span>
                  <div className="text-2xl font-bold font-markazi text-[#00716B] mt-1">
                    {selectedDossierProject.budget}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {selectedDossierProject.financialSpent}
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-xs text-slate-400 font-medium block">شاخص‌های BIM و CDE</span>
                  <div className="text-2xl font-bold font-markazi text-slate-900 mt-1">
                    {selectedDossierProject.lod}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {selectedDossierProject.clashesCount === 0 ? 'بدون کلش' : `${selectedDossierProject.clashesCount} تداخل فعال`} • {selectedDossierProject.documentsCount} سند در CDE
                  </span>
                </div>
              </div>

              {/* Construction Stage and Issues */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="text-xs font-bold text-slate-700 mb-1">گزارش مرحله اجرایی جاری:</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedDossierProject.stage}</p>
                {selectedDossierProject.criticalIssues && (
                  <div className="mt-3 p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-700 text-base">info</span>
                    <span><strong>نکته کلیدی:</strong> {selectedDossierProject.criticalIssues}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setSelectedDossierProject(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                بستن شناسنامه
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSelectAndGo(selectedDossierProject, 'cde');
                    setSelectedDossierProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  مشاهده اسناد CDE
                </button>
                <button
                  onClick={() => {
                    handleSelectAndGo(selectedDossierProject);
                    setSelectedDossierProject(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#00716B] hover:bg-[#005a55] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>انتخاب و ورود به پیشخوان</span>
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Compare Projects Modal */}
      {compareDissolve.visible && (
        <div
          className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 ${compareDissolve.closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className={`bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-200 shadow-2xl flex flex-col ${compareDissolve.closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">compare_arrows</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-markazi text-slate-900">
                    مقایسه شاخص‌های پروژه‌های هلدینگ باران
                  </h3>
                  <p className="text-xs text-slate-500">
                    مقایسه پهلو به پهلوی زیربنا، تعداد واحدها، پیشرفت، بودجه و مشخصات معماری
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Selection chips */}
            <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">انتخاب پروژه‌ها برای مقایسه:</span>
              {PROJECTS.map((p) => {
                const isSelected = comparedProjectIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleCompareProject(p.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00716B] text-white border-[#00716B]'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-[#00716B]'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {p.name}
                  </button>
                );
              })}
            </div>

            {/* Comparison Table */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparedProjectIds.map((id) => {
                  const p = PROJECTS.find((proj) => proj.id === id);
                  if (!p) return null;
                  return (
                    <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                      <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-900">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-black/70 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                          {p.code}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-bold font-markazi text-slate-900">{p.name}</h4>
                        <span className="text-xs text-slate-500">{p.location}</span>
                      </div>

                      <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">پیشرفت واقعی:</span>
                          <span className="font-bold font-markazi text-base text-[#00716B]">{p.progress}٪</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">زیربنای کل:</span>
                          <span className="font-semibold text-slate-800">{p.area}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">تعداد واحدها:</span>
                          <span className="font-semibold text-slate-800">{p.unitsCount ? `${p.unitsCount} واحد` : '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">بودجه مصوب:</span>
                          <span className="font-bold font-markazi text-[#00716B]">{p.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">سطح مدل BIM:</span>
                          <span className="font-semibold">{p.lod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">پیمانکار:</span>
                          <span className="font-semibold truncate max-w-[150px]">{p.contractor}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleSelectAndGo(p);
                          setIsCompareModalOpen(false);
                        }}
                        className="w-full py-2 rounded-xl bg-[#00716B] hover:bg-[#005a55] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        انتخاب این پروژه
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                بستن مقایسه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: New Project Registration Modal */}
      {newProjectDissolve.visible && (
        <div
          className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 ${newProjectDissolve.closing ? 'animate-backdrop-dissolve-out' : 'animate-backdrop-dissolve'}`}
          onClick={() => setIsNewProjectModalOpen(false)}
        >
          <div
            className={`bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl flex flex-col overflow-hidden ${newProjectDissolve.closing ? 'animate-modal-dissolve-out' : 'animate-modal-dissolve'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00716B]/10 text-[#00716B] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">add_business</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-markazi text-slate-900">
                    ثبت و استقرار پروژه جدید در CDE
                  </h3>
                  <p className="text-xs text-slate-500">
                    ایجاد مخزن مشترک داده‌ها و ساختار شاخه‌های ایزو ۱۹۶۵۰
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">نام پروژه جدید</label>
                <input
                  type="text"
                  placeholder="مثال: برج مسکونی باران ۶"
                  value={newProjectForm.name}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00716B] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">کد پروژه (ISO Code)</label>
                  <input
                    type="text"
                    placeholder="PRJ-BRN6"
                    value={newProjectForm.code}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:border-[#00716B] outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">کاربری</label>
                  <select
                    value={newProjectForm.usage}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, usage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00716B] outline-hidden"
                  >
                    <option value="مسکونی لوکس">مسکونی لوکس</option>
                    <option value="تجاری - مسکونی">تجاری - مسکونی</option>
                    <option value="تجاری - تفریحی">تجاری - تفریحی</option>
                    <option value="اقامتی و هتل">اقامتی و هتل</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">موقعیت جغرافیایی</label>
                  <input
                    type="text"
                    placeholder="بلوار خیام، قطعه ارغوان"
                    value={newProjectForm.location}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00716B] outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">برآورد بودجه اولیه</label>
                  <input
                    type="text"
                    placeholder="۶۵۰ میلیارد تومان"
                    value={newProjectForm.budget}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00716B] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">مرحله شروع CDE</label>
                <input
                  type="text"
                  value={newProjectForm.stage}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, stage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#00716B] outline-hidden"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                <span>ساختار فولدرهای ISO 19650 و سطوح دسترسی پیش‌فرض به صورت خودکار ایجاد خواهند شد.</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  if (!newProjectForm.name.trim()) {
                    onTriggerToast('خطا در ثبت', 'لطفاً نام پروژه را وارد فرمایید.', 'error');
                    return;
                  }
                  setIsNewProjectModalOpen(false);
                  onTriggerToast(
                    'ثبت موفقیت‌آمیز پروژه',
                    `مخزن CDE پروژه «${newProjectForm.name}» با موفقیت در زیرساخت ابری مستقر گردید.`,
                    'success'
                  );
                }}
                className="px-5 py-2 rounded-xl bg-[#00716B] hover:bg-[#005a55] text-white text-xs font-bold transition-colors"
              >
                استقرار پروژه در CDE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
