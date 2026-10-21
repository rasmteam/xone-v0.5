import React from 'react';
import { Project, NavigationTab } from '../types';

interface ConstructionDashboardViewProps {
  currentProject: Project;
  onNavigate: (tab: NavigationTab) => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
  onNavigateToCdeFolder?: (folderId?: string) => void;
}

export const ConstructionDashboardView: React.FC<ConstructionDashboardViewProps> = ({
  currentProject,
  onNavigate,
  onTriggerToast,
  onNavigateToCdeFolder
}) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-7" dir="rtl">
      {/* Top Executive Breadcrumb / Sub-bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#005652]/10 text-[#005652] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">apartment</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl leading-7 text-slate-900 font-bold leading-tight">پیشخوان مدیر ساخت و هماهنگی کارگاه</h1>
              <span className="bg-[#adebe4] text-[#2e6c67] text-[12px] font-bold tracking-wide px-2 py-0.5 rounded-full">هفته ۴۴ • فاز ۲ سازه</span>
            </div>
            <span className="text-sm leading-5 text-[#6e7978]">{currentProject.name} ({currentProject.code}) • مدیریت طرح و ساخت گروه باران</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-[#3e4947] text-[12px] font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#005652] animate-ping"></span>
            <span>آخرین به‌روزرسانی زنده کارگاه: ۱۰ دقیقه پیش</span>
          </div>
          <button
            onClick={() => onTriggerToast('ثبت گزارش روزانه', 'فرم ثبت گزارش روزانه کارگاه باز شد.', 'info')}
            className="flex items-center gap-2 bg-[#00716B] hover:bg-[#005652] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">add_task</span>
            <span>ثبت گزارش روزانه جدید</span>
          </button>
        </div>
      </div>

      {/* Section 1: 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Manager Immediate Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#965335]"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] uppercase tracking-wider text-[#6e7978] font-semibold">اقدام مدیر ساخت</span>
              <span className="w-8 h-8 rounded-lg bg-[#ffdbcd] text-[#71361a] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">notification_important</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl leading-[44px] text-slate-900 font-bold">۵</span>
              <span className="text-sm text-[#6e7978]">مورد در صف کارتابل</span>
            </div>
            <div className="mt-2 text-[#ba1a1a] text-sm font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-base">timer</span>
              <span>مهلت پاسخ فوری: کمتر از ۲۴ ساعت</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex flex-col gap-1 text-[12px] text-[#3e4947]">
            <div className="flex justify-between items-center">
              <span>۳ مورد SLA فوری</span>
              <span className="font-semibold text-[#965335]">۲ صورت‌وضعیت</span>
            </div>
            <div className="flex justify-between items-center">
              <span>۱ دستور تغییر مصالح</span>
              <span className="text-[#6e7978]">۲ گزارش تحویل</span>
            </div>
          </div>
        </div>

        {/* Card 2: Physical Progress (Donut Chart) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#005652]"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] uppercase tracking-wider text-[#6e7978] font-semibold">پیشرفت فیزیکی (WBS)</span>
              <span className="w-8 h-8 rounded-lg bg-[#9cf2ea] text-[#00201e] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">construction</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-3xl leading-[44px] text-[#005652] font-bold">۶۲.۴۰٪</span>
                <span className="text-[#005652] text-sm flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>۱.۸۲٪+ این هفته</span>
                </span>
              </div>
              {/* Circular Progress (conic-gradient) */}
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <div className="w-14 h-14 rounded-full shadow-inner border border-slate-200/60" style={{ background: 'conic-gradient(#00716b 0% 62.4%, #e2e8f0 62.4% 100%)' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex justify-between items-center text-[12px]">
            <span className="text-[#6e7978]">خط مبنا مصوب (Baseline):</span>
            <span className="font-semibold text-slate-900">۶۵.۸۰٪ (-۳.۴٪ انحراف)</span>
          </div>
        </div>

        {/* Card 3: Financial Progress (Donut Chart) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#296862]"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] uppercase tracking-wider text-[#6e7978] font-semibold">پیشرفت مالی پیمانکار</span>
              <span className="w-8 h-8 rounded-lg bg-[#adebe4] text-[#2e6c67] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">payments</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-3xl leading-[44px] text-[#296862] font-bold">۵۸.۵٪</span>
                <span className="text-sm text-[#6e7978]">۳.۴ از ۵.۸ م.ت</span>
              </div>
              {/* Circular Progress (conic-gradient) */}
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <div className="w-14 h-14 rounded-full shadow-inner border border-slate-200/60" style={{ background: 'conic-gradient(#00716b 0% 58.5%, #e2e8f0 58.5% 100%)' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex justify-between items-center text-[12px]">
            <span className="text-[#6e7978]">آخرین تسویه قطعی:</span>
            <span className="font-semibold text-[#296862]">صورت‌وضعیت ۴ کارگاهی</span>
          </div>
        </div>

        {/* Card 4: Change Orders */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#965335]/60"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] uppercase tracking-wider text-[#6e7978] font-semibold">دستورات تغییر (Change Orders)</span>
              <span className="w-8 h-8 rounded-lg bg-[#eceef0] text-[#3e4947] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">published_with_changes</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl leading-[44px] text-[#965335] font-bold">۴</span>
              <span className="text-sm text-[#6e7978]">دستور کار فعال</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[#3e4947] text-[13px]">
              <span className="font-semibold text-[#965335]">۱,۲۵۰,۰۰۰,۰۰۰+</span>
              <span className="text-[#6e7978]">تومان اثر ریالی</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex justify-between items-center text-[12px]">
            <span className="text-[#6e7978]">جاری:</span>
            <span className="font-medium text-slate-900 truncate">#۴۲ اصلاح سنگ تراورتن نما</span>
          </div>
        </div>

        {/* Card 5: SLA Delays */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 left-0 h-1 bg-[#ba1a1a]"></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] uppercase tracking-wider text-[#6e7978] font-semibold">معوقات زمانی (SLA)</span>
              <span className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">hourglass_bottom</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl leading-[44px] text-[#ba1a1a] font-bold">۳</span>
              <span className="text-sm text-[#6e7978]">مدرک فراتر از مهلت</span>
            </div>
            <div className="mt-1 text-[13px] text-[#ba1a1a] font-medium truncate">
              نقشه ازبیلت شفت (۸ روز تاخیر)
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex justify-between items-center text-[12px]">
            <button
              onClick={() => onTriggerToast('صدور اخطار تاخیر', 'اخطار کتبی تاخیر کارگاهی برای پیمانکار ثبت و ارسال شد.', 'info')}
              className="text-[#ba1a1a] hover:text-[#93000a] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span>صدور اخطار تاخیر کارگاهی</span>
              <span className="material-symbols-outlined text-sm">arrow_left</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: WBS & S-Curve (65%) + Clash Coordination (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Box: WBS & S-Curve Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00716B] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">stacked_line_chart</span>
                </div>
                <div>
                  <h2 className="text-xl leading-7 text-slate-900 font-bold leading-tight">برنامه زمان‌بندی و منحنی S پیشرفت (WBS &amp; S-Curve)</h2>
                  <p className="text-sm text-[#6e7978]">پایش همزمان خط مبنای مصوب قرارداد در برابر پیشرفت واقعی کارگاه</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-0.5 bg-slate-400"></span>
                  <span className="text-[12px] tracking-wide text-[#3e4947]">خط مبنا (Baseline 65.8%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-1 bg-[#005652] rounded"></span>
                  <span className="text-[12px] tracking-wide text-[#005652] font-bold">واقعی (Actual 62.4%)</span>
                </div>
                <span className="bg-[#eceef0] px-2.5 py-1 rounded text-xs font-semibold text-slate-900">هفته ۴۴ (جاری)</span>
              </div>
            </div>

            {/* SVG S-Curve Chart Area */}
            <div className="relative w-full h-56 pt-4">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="actualGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#005652" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#005652" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                {/* Grid Horizontal Lines */}
                <line stroke="#eceef0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="20" y2="20"></line>
                <line stroke="#eceef0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="65" y2="65"></line>
                <line stroke="#eceef0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="110" y2="110"></line>
                <line stroke="#eceef0" strokeDasharray="4" strokeWidth="1" x1="0" x2="700" y1="155" y2="155"></line>
                {/* Baseline S-Curve (Dashed Gray) */}
                <path d="M 0 190 Q 180 180 320 110 T 520 40 L 700 15" fill="none" stroke="#94a3b8" strokeDasharray="6,4" strokeWidth="2.5"></path>
                {/* Actual S-Curve with Area Fill */}
                <path d="M 0 190 Q 180 185 320 125 T 480 72 L 480 190 Z" fill="url(#actualGradient)"></path>
                <path d="M 0 190 Q 180 185 320 125 T 480 72" fill="none" stroke="#00716B" strokeWidth="3.5"></path>
                {/* Today Marker Line at Week 44 */}
                <line stroke="#00716B" strokeDasharray="3,3" strokeWidth="1.5" x1="480" x2="480" y1="10" y2="190"></line>
                {/* Today Point Marker */}
                <circle cx="480" cy="72" fill="#00716B" r="5" stroke="#ffffff" strokeWidth="2"></circle>
                <circle cx="480" cy="55" fill="#94a3b8" r="4" stroke="#ffffff" strokeWidth="1.5"></circle>
                {/* Annotation Badge */}
                <rect fill="#00716B" height="22" rx="4" width="120" x="420" y="30"></rect>
                <text fill="#ffffff" fontFamily="Vazirmatn" fontSize="11" textAnchor="middle" x="480" y="45">هفته ۴۴: ۶۲.۴٪ کارگاهی</text>
              </svg>
              {/* Chart X-Axis Labels */}
              <div className="flex justify-between items-center text-[11px] text-[#6e7978] pt-2 border-t border-slate-200/70 mt-1">
                <span>W01 (تجهیز)</span>
                <span>W12 (گودبرداری)</span>
                <span>W24 (فونداسیون)</span>
                <span>W36 (سقف طبقه ۱۰)</span>
                <span className="text-[#005652] font-bold">W44 (امروز • سقف ۲۲)</span>
                <span>W52 (تکمیل اسکلت)</span>
                <span>W68 (تاسیسات نهایی)</span>
              </div>
            </div>
          </div>

          {/* 4 Active Execution Phases Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-200/70">
            <div className="bg-[#f2f4f6] p-3 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-900">فاز فونداسیون و حائل</span>
                <span className="text-[#005652] font-bold">۱۰۰٪</span>
              </div>
              <div className="w-full bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#005652] h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-[11px] text-[#6e7978] mt-1 block">پایان یافته و تحویل دائم</span>
            </div>
            <div className="bg-[#f2f4f6] p-3 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-900">اسکلت بتنی (تا سقف ۲۲)</span>
                <span className="text-[#005652] font-bold">۸۸٪</span>
              </div>
              <div className="w-full bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#005652] h-1.5 rounded-full" style={{ width: '88%' }}></div>
              </div>
              <span className="text-[11px] text-[#005652] mt-1 block font-medium">زون A بتن‌ریزی فعال</span>
            </div>
            <div className="bg-[#f2f4f6] p-3 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-900">تاسیسات مکانیکی و شفت</span>
                <span className="text-[#296862] font-bold">۴۲٪</span>
              </div>
              <div className="w-full bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#296862] h-1.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
              <span className="text-[11px] text-[#6e7978] mt-1 block">رایزرها در طبقات ۶ الی ۱۶</span>
            </div>
            <div className="bg-[#f2f4f6] p-3 rounded-lg">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-slate-900">نازک‌کاری و وال‌پست</span>
                <span className="text-[#965335] font-bold">۱۵٪</span>
              </div>
              <div className="w-full bg-[#e0e3e5] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#965335] h-1.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <span className="text-[11px] text-[#6e7978] mt-1 block">تیغه‌چینی زیرزمین ۲ و ۱</span>
            </div>
          </div>
        </div>

        {/* Left Box: Clash Coordination & BIM (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/70 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#adebe4] text-[#2e6c67] flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">hub</span>
                </div>
                <div>
                  <h3 className="text-xl leading-7 text-slate-900 font-bold leading-tight">هماهنگی و کلش‌گیری (BIM)</h3>
                  <span className="text-[12px] tracking-wide text-[#6e7978]">بررسی تداخل دیسیپلین‌های کارگاه</span>
                </div>
              </div>
              <span className="bg-[#ffdad6] text-[#93000a] px-2 py-0.5 rounded text-xs font-bold">۳ کلش بحرانی</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#f2f4f6] p-3 rounded-lg border-r-2 border-[#ba1a1a]">
                <span className="text-[12px] tracking-wide text-[#6e7978] block">تعارضات باز کارگاهی</span>
                <span className="text-xl font-bold text-[#ba1a1a] mt-0.5 block">۱۲ مورد</span>
                <span className="text-[11px] text-[#6e7978]">۳ بحرانی • ۹ متوسط</span>
              </div>
              <div className="bg-[#f2f4f6] p-3 rounded-lg border-r-2 border-[#005652]">
                <span className="text-[12px] tracking-wide text-[#6e7978] block">رفع شده در کارگاه</span>
                <span className="text-xl font-bold text-[#005652] mt-0.5 block">۴۸ مورد</span>
                <span className="text-[11px] text-[#005652] font-medium">۸۰٪ موفقیت رفع</span>
              </div>
            </div>

            {/* Histogram Chart of weekly reduction */}
            <div className="bg-[#f2f4f6] p-3.5 rounded-lg mb-4">
              <div className="flex justify-between items-center text-xs mb-2 text-[#3e4947] font-medium">
                <span>روند کاهش تعارضات (۴ هفته اخیر)</span>
                <span className="text-[#005652] font-bold">نزولی (-۷۳٪)</span>
              </div>
              <div className="h-24 flex items-end justify-between gap-3 px-2 pt-2">
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#6e7978] font-mono">۴۵</span>
                  <div className="w-full bg-[#bdc9c7]/60 rounded-t h-20"></div>
                  <span className="text-[10px] text-[#6e7978]">W41</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#6e7978] font-mono">۳۲</span>
                  <div className="w-full bg-[#bdc9c7]/70 rounded-t h-14"></div>
                  <span className="text-[10px] text-[#6e7978]">W42</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#6e7978] font-mono">۲۱</span>
                  <div className="w-full bg-[#80d5ce] rounded-t h-9"></div>
                  <span className="text-[10px] text-[#6e7978]">W43</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#005652] font-bold font-mono">۱۲</span>
                  <div className="w-full bg-[#005652] rounded-t h-5"></div>
                  <span className="text-[10px] text-[#005652] font-bold">W44</span>
                </div>
              </div>
            </div>

            {/* Recent Critical Conflict Item */}
            <div className="bg-[#ffdad6]/20 p-2.5 rounded-lg border border-[#ba1a1a]/20 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#ba1a1a] text-lg mt-0.5">report_problem</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900">تداخل کانال تهویه طبقه ۱۸ با تیر سازه‌ای B4</span>
                <span className="text-[11px] text-[#6e7978]">ارجاع شده به دفتر فنی مشاور جهت بازبینی روتینگ</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200/70 flex justify-between items-center">
            <button
              onClick={() => onNavigate('bim')}
              className="text-xs font-bold text-[#005652] hover:text-[#00716B] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>مشاهده ماتریس تداخلات BIM و مدل سه‌بعدی</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
            <span className="text-[12px] tracking-wide text-[#6e7978]">Rev. 14.2</span>
          </div>
        </div>
      </div>

      {/* Section 3: Full-width Milestones Stepper */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#005652]/10 text-[#005652] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">flag</span>
            </div>
            <div>
              <h3 className="text-xl leading-7 text-slate-900 font-bold leading-tight">مایل‌استون‌های کلیدی فاز ساخت و اجرا</h3>
              <span className="text-sm text-[#6e7978]">نقاط عطف اصلی قرارداد احداث {currentProject.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#adebe4] text-[#2e6c67] px-3 py-1 rounded-full text-xs font-bold">۳ از ۷ مایل‌استون تکمیل شده</span>
            <span className="bg-[#eceef0] px-2.5 py-1 rounded-full text-xs text-[#6e7978] font-medium">وضعیت کل: طبق تعهدات</span>
          </div>
        </div>

        {/* Horizontal Stepper */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[900px] flex items-center justify-between relative px-4">
            {/* Stepper Background Line */}
            <div className="absolute top-4 left-8 right-8 h-1 bg-[#e6e8ea] -z-0"></div>
            {/* Completed Line Overlay */}
            <div className="absolute top-4 right-8 w-2/5 h-1 bg-[#005652] -z-0"></div>

            {/* Step 1: Done */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <div className="w-9 h-9 rounded-full bg-[#005652] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">گودبرداری و فونداسیون رادیه</span>
              <span className="text-[11px] text-[#005652] font-medium">فروردین ۱۴۰۲ • تکمیل</span>
            </div>
            {/* Step 2: Done */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <div className="w-9 h-9 rounded-full bg-[#005652] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg">check</span>
              </div>
              <span className="text-xs font-bold text-slate-900 leading-tight">اسکلت زیرزمین‌ها تا تراز ۰.۰</span>
              <span className="text-[11px] text-[#005652] font-medium">آبان ۱۴۰۲ • تکمیل</span>
            </div>
            {/* Step 3: Active / In Progress */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-32 text-center">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#005652] text-[#005652] flex items-center justify-center shadow-md animate-pulse">
                <span className="material-symbols-outlined text-xl">cached</span>
              </div>
              <span className="text-xs font-bold text-[#005652] leading-tight">بتن‌ریزی سقف ۲۲ و تکمیل اسکلت</span>
              <span className="text-[11px] bg-[#adebe4]/60 text-[#2e6c67] px-2 py-0.5 rounded font-semibold">در حال اجرا (۸۸٪)</span>
            </div>
            {/* Step 4: Pending */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <div className="w-9 h-9 rounded-full bg-[#e0e3e5] text-[#6e7978] flex items-center justify-center">
                <span className="text-xs font-bold">۴</span>
              </div>
              <span className="text-xs font-medium text-[#6e7978] leading-tight">شفت‌های مکانیکال و باسک‌داکت</span>
              <span className="text-[11px] text-[#6e7978]">موعد: آذر ۱۴۰۳</span>
            </div>
            {/* Step 5: Pending */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <div className="w-9 h-9 rounded-full bg-[#e0e3e5] text-[#6e7978] flex items-center justify-center">
                <span className="text-xs font-bold">۵</span>
              </div>
              <span className="text-xs font-medium text-[#6e7978] leading-tight">تیغه‌چینی و وال‌پست پیرامونی</span>
              <span className="text-[11px] text-[#6e7978]">موعد: بهمن ۱۴۰۳</span>
            </div>
            {/* Step 6: Pending */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <div className="w-9 h-9 rounded-full bg-[#e0e3e5] text-[#6e7978] flex items-center justify-center">
                <span className="text-xs font-bold">۶</span>
              </div>
              <span className="text-xs font-medium text-[#6e7978] leading-tight">تست گرم تاسیسات و آسانسورها</span>
              <span className="text-[11px] text-[#6e7978]">موعد: خرداد ۱۴۰۴</span>
            </div>
            {/* Step 7: Final */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <div className="w-9 h-9 rounded-full bg-[#e0e3e5] text-[#6e7978] flex items-center justify-center">
                <span className="material-symbols-outlined text-base">emoji_events</span>
              </div>
              <span className="text-xs font-medium text-[#6e7978] leading-tight">تحویل موقت کارگاه به بهره‌بردار</span>
              <span className="text-[11px] text-[#6e7978]">شهریور ۱۴۰۴</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: 3 Bottom Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bottom Card 1: IPC Tracker */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#296862] text-xl">request_quote</span>
                <h4 className="text-xl leading-7 text-slate-900 font-bold leading-tight">پایش صورت‌وضعیت‌ها (IPC)</h4>
              </div>
              <span className="text-xs font-bold text-[#296862]">قرارداد اصلی</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center bg-[#f2f4f6] p-2.5 rounded-lg">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">صورت‌وضعیت ۵ (در جریان)</span>
                  <span className="text-[11px] text-[#6e7978]">بررسی میدانی مهندس مترور</span>
                </div>
                <span className="text-xs font-bold text-[#965335] font-mono">۸۹۰ م.ت</span>
              </div>
              <div className="flex justify-between items-center bg-[#f2f4f6] p-2.5 rounded-lg">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">صورت‌وضعیت ۴ (پرداخت شده)</span>
                  <span className="text-[11px] text-[#005652]">تسویه شده در تاریخ ۱۴۰۳/۰۴/۱۵</span>
                </div>
                <span className="text-xs font-bold text-[#005652] font-mono">۷۴۰ م.ت</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-200/70 mt-3">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-[#6e7978]">سرجمع پرداختی‌ها:</span>
              <span className="font-bold text-slate-900">۳,۴۰۰,۰۰۰,۰۰۰ تومان</span>
            </div>
            <button
              onClick={() => onNavigateToCdeFolder?.('f-ph1-financial')}
              className="w-full py-2 rounded-lg bg-teal-50/60 border border-[#00716B]/20 text-[#00716B] hover:bg-teal-50 hover:text-[#005c57] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              مشاهده فولدر صورت‌وضعیت‌ها در CDE
            </button>
          </div>
        </div>

        {/* Bottom Card 2: Site Coordination Meetings (MoM) */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005652] text-xl">groups</span>
                <h4 className="text-xl leading-7 text-slate-900 font-bold leading-tight">صورت‌جلسات فنی کارگاه (MoM)</h4>
              </div>
              <span className="text-xs bg-[#eceef0] px-2 py-0.5 rounded font-medium text-[#6e7978]">هفتگی</span>
            </div>
            <div className="space-y-2.5">
              <div className="p-2.5 bg-[#f2f4f6] rounded-lg flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">جلسه کارگاهی ۴۴: هماهنگی رایزرها</span>
                  <span className="text-[10px] text-[#6e7978]">دیروز ۱۰:۰۰</span>
                </div>
                <p className="text-[11px] text-[#3e4947] line-clamp-1">توافق بر جابجایی داکت اگزاست بلوک جنوبی به منظور رفع کلش سازه</p>
              </div>
              <div className="p-2.5 bg-[#f2f4f6] rounded-lg flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">جلسه کارگاهی ۴۳: کیفیت بتن‌ریزی</span>
                  <span className="text-[10px] text-[#6e7978]">۷ روز پیش</span>
                </div>
                <p className="text-[11px] text-[#3e4947] line-clamp-1">تایید اسلامپ و مقاومت نمونه‌های ۲۸ روزه ستون‌های طبقه ۲۱</p>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-200/70 mt-3">
            <div className="flex justify-between items-center text-xs mb-2">
              <button
                onClick={() => onTriggerToast('ثبت صورت‌جلسه جدید', 'فرم ثبت صورت‌جلسه کارگاهی باز شد.', 'info')}
                className="text-[#005652] hover:text-[#00716B] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>ثبت صورت‌جلسه جدید</span>
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
              <span className="text-[#6e7978]">آرشیو (۴۴ مورد)</span>
            </div>
            <button
              onClick={() => onNavigateToCdeFolder?.('f-doc-mom')}
              className="w-full py-2 rounded-lg bg-teal-50/60 border border-[#00716B]/20 text-[#00716B] hover:bg-teal-50 hover:text-[#005c57] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              مشاهده فولدر صورت‌جلسات در CDE
            </button>
          </div>
        </div>

        {/* Bottom Card 3: Recent CDE Uploads */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3e4947] text-xl">cloud_sync</span>
                <h4 className="text-xl leading-7 text-slate-900 font-bold leading-tight">فایل‌های اخیر در CDE کارگاه</h4>
              </div>
              <span className="text-xs bg-[#9cf2ea] text-[#00201e] px-2 py-0.5 rounded font-bold">Xone CDE</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 hover:bg-[#f2f4f6] rounded transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="material-symbols-outlined text-[#296862] text-lg">image</span>
                  <span className="text-xs text-slate-900 font-medium truncate">Drone_Survey_W44_Orthophoto.tif</span>
                </div>
                <span className="text-[11px] text-[#6e7978] shrink-0">۲ ساعت پیش</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-[#f2f4f6] rounded transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="material-symbols-outlined text-[#ba1a1a] text-lg">picture_as_pdf</span>
                  <span className="text-xs text-slate-900 font-medium truncate">QC_Concrete_Test_28D_Floor21.pdf</span>
                </div>
                <span className="text-[11px] text-[#6e7978] shrink-0">۵ ساعت پیش</span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-[#f2f4f6] rounded transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <span className="material-symbols-outlined text-[#005652] text-lg">view_in_ar</span>
                  <span className="text-xs text-slate-900 font-medium truncate">Alpha_Tower_Structural_R14.ifc</span>
                </div>
                <span className="text-[11px] text-[#6e7978] shrink-0">دیروز</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-200/70 mt-3">
            <button
              onClick={() => onNavigateToCdeFolder?.('f-ph1')}
              className="w-full py-2 rounded-lg bg-teal-50/60 border border-[#00716B]/20 text-[#00716B] hover:bg-teal-50 hover:text-[#005c57] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              ورود به سامانه مدیریت مستندات (CDE)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
