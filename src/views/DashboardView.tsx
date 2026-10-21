import React, { useState } from 'react';
import { Project, NavigationTab, ClashPreset } from '../types';

interface DashboardViewProps {
  currentProject: Project;
  onNavigate: (tab: NavigationTab) => void;
  onOpenDocumentDossier: (docId: string) => void;
  onOpenUpload: () => void;
  onTriggerToast: (title: string, desc: string, type?: 'success' | 'error' | 'info') => void;
  onOpenExcelIpc?: () => void;
  onOpenClashFilters?: (preset: ClashPreset) => void;
  onNavigateToCdeFolder?: (folderId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenDocumentDossier,
  onTriggerToast,
  onOpenExcelIpc,
  onOpenClashFilters,
  onNavigateToCdeFolder
}) => {
  const [approvalTab, setApprovalTab] = useState<'action' | 'history'>('action');

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-7" dir="rtl">
      {/* ==============================================
           ROW 1: TOP 5 KPI CARDS
           ============================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Workflows Action Required */}
        <div
          onClick={() => onNavigate('approvals')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 group-hover:text-[#00716B] transition-colors">اقدام مدیر طراحی</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
              <span className="material-symbols-outlined text-[19px]">assignment_late</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-['Markazi_Text'] text-amber-600">۳</span>
              <span className="text-xs font-medium text-slate-500">مورد در صف تایید نهایی</span>
            </div>
            <p className="text-[11px] text-amber-800 bg-amber-50 rounded px-2 py-0.5 mt-2 inline-block font-medium">
              مهلت پاسخ فوری: کمتر از ۲۴ ساعت
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>درخواست‌های معوق</span>
            <span className="font-bold text-amber-600">۱ مورد بحرانی</span>
          </div>
        </div>

        {/* KPI 2: Physical Design Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">پیشرفت فیزیکی طراحی</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
              <span className="material-symbols-outlined text-[19px]">architecture</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-['Markazi_Text'] text-[#00716B]">۷۸.۵٪</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 font-semibold mt-0.5">+۱.۲٪ این هفته</span>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                <div className="w-14 h-14 rounded-full shadow-inner border border-slate-200/60" style={{ background: 'conic-gradient(#00716b 0% 78.5%, #e2e8f0 78.5% 100%)' }}></div>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>خط مبنا (Baseline)</span>
            <span className="font-bold text-slate-700">مطابق برنامه زمان‌بندی</span>
          </div>
        </div>

        {/* KPI 3: Financial Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">پیشرفت مالی قرارداد طراحی</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-[#00716B] flex items-center justify-center border border-teal-100">
              <span className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-center justify-between gap-3 mt-1">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold font-['Markazi_Text'] text-slate-800">۶۴٪</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5">۴.۳ از ۶.۸ م.ت</span>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                <div className="w-14 h-14 rounded-full shadow-inner border border-slate-200/60" style={{ background: 'conic-gradient(#00716b 0% 64%, #e2e8f0 64% 100%)' }}></div>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>آخرین تسویه</span>
            <span className="font-bold text-slate-700">صورت‌وضعیت ۴ (معماری)</span>
          </div>
        </div>

        {/* KPI 4: Clashes & RFIs */}
        <div
          onClick={() => onNavigate('bim')}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-6 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 group-hover:text-[#00716B] transition-colors">تعارضات مدل و هماهنگی (Clash)</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <span className="material-symbols-outlined text-[19px]">rule</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-['Markazi_Text'] text-slate-800">۱۲</span>
              <span className="text-xs font-medium text-slate-500">تعارض باز فعال</span>
            </div>
            <p className="text-[11px] text-rose-700 bg-rose-50 rounded px-2 py-0.5 mt-2 inline-block font-medium">
              ۳ مورد بحرانی (نیاز به بازنگری)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>نرخ رفع تداخل</span>
            <span className="font-bold text-emerald-600">۴۸ حل‌شده (۸۰٪)</span>
          </div>
        </div>

        {/* KPI 5: SLA Overdue */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">معوقات زمانی (SLA)</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100">
              <span className="material-symbols-outlined text-[19px]">hourglass_bottom</span>
            </span>
          </div>
          <div className="my-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-['Markazi_Text'] text-rose-600">۲</span>
              <span className="text-xs font-medium text-rose-700">مدرک فراتر از مهلت</span>
            </div>
            <p className="text-[11px] text-rose-700 bg-rose-50 rounded px-2 py-0.5 mt-2 inline-block font-medium">
              تاخیر تحویل مشاور سازه (۳ روز)
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>اخطار انطباق</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTriggerToast('اخطار انطباق SLA ارسال شد', 'اخطار کتبی مرحله دوم برای مشاور سازه ارسال گردید.', 'info');
              }}
              className="font-bold text-rose-600 hover:underline"
            >
              ارسال اخطار دوم
            </button>
          </div>
        </div>
      </section>

      {/* ==============================================
           ROW 2: APPROVALS TABLE + CLASH COORDINATION CHART
           ============================================== */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Approvals Worktable (7 Cols) */}
        <div className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00716B]/10 text-[#00716B] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">در انتظار تایید (کارتابل تاییدات)</h2>
                <p className="text-[11px] text-slate-500">اسناد نیازمند تصمیم‌گیری چرخه ISO 19650</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setApprovalTab('action')}
                  className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                    approvalTab === 'action' ? 'bg-white text-[#00716B] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 text-[11px]'
                  }`}
                  type="button"
                >
                  <span className="text-[11px]">نیازمند اقدام</span>
                  <span className="w-4 h-4 rounded-full bg-[#00716B] text-white text-[10px] flex items-center justify-center font-bold">۳</span>
                </button>
                <button
                  onClick={() => setApprovalTab('history')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                    approvalTab === 'history' ? 'bg-white text-[#00716B] font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  تاریخچه (۴۲)
                </button>
              </div>
            </div>
          </div>

          {approvalTab === 'action' ? (
            <>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-right border-collapse text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-4">فرمت</th>
                      <th className="py-2.5 px-3">عنوان بسته مدرک مهندسی</th>
                      <th className="py-2.5 px-3">مهلت اقدام (SLA)</th>
                      <th className="py-2.5 px-4 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-teal-50/40 transition-colors">
                      <td className="py-2.5 px-4">
                        <span className="w-7 h-7 rounded-lg bg-teal-50 text-[#00716B] font-mono font-bold text-[11px] flex items-center justify-center border border-teal-200/80">RVT</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 text-xs">نقشه‌های شفت تاسیسات مکانیکی طبقات ۲۰ تا ۲۵</div>
                        <div className="text-[10px] text-slate-400">دکتر پورمند (مشاور مکانیک)</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200">
                          <span className="material-symbols-outlined text-[12px]">timer</span>۱ روز باقی‌مانده
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => onOpenDocumentDossier('doc-revit-core')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-[#00716B] hover:border-[#00716B]/30 hover:bg-slate-50 font-medium text-xs transition-colors shadow-sm cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>بررسی
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-teal-50/40 transition-colors">
                      <td className="py-2.5 px-4">
                        <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 font-mono font-bold text-[11px] flex items-center justify-center border border-rose-200/80">PDF</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 text-xs">دفترچه محاسبات فنی اتصال دال پس‌کشیده پودیوم</div>
                        <div className="text-[10px] text-slate-400">مهندس علیزاده (مشاور سازه)</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                          <span className="material-symbols-outlined text-[12px]">schedule</span>۲ روز مهلت بررسی
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => onOpenDocumentDossier('doc-xlsx-ipc5')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-[#00716B] hover:border-[#00716B]/30 hover:bg-slate-50 font-medium text-xs transition-colors shadow-sm cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>بررسی
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-teal-50/40 transition-colors">
                      <td className="py-2.5 px-4">
                        <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-mono font-bold text-[11px] flex items-center justify-center border border-amber-200/80">DWG</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 text-xs">وال‌سکشن و دیتایل‌های اجرایی کرتین‌وال نمای اصلی لابی</div>
                        <div className="text-[10px] text-slate-400">مهندس کیانی (توسعه معماری)</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                          <span className="material-symbols-outlined text-[12px]">warning</span>معوق (۲ روز تاخیر)
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => onOpenDocumentDossier('doc-dwg-riser')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-[#00716B] hover:border-[#00716B]/30 hover:bg-slate-50 font-medium text-xs transition-colors shadow-sm cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>بررسی
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">نمایش ۳ جریان نیازمند تصمیم‌گیری از ۴۵ سند CDE</span>
                <button
                  onClick={() => onNavigate('approvals')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00716B] text-white hover:bg-[#005c57] text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  <span className="text-[11px]">مشاهده کارتابل کامل</span>
                  <span className="material-symbols-outlined text-xs">arrow_back</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-14 text-center">
              <span className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-2xl">history</span>
              </span>
              <p className="text-sm font-bold text-slate-700">آرشیو تاییدات</p>
              <p className="text-[11px] text-slate-500 mt-1">۴۲ سند در چرخه ISO 19650 تایید و بایگانی شده‌اند.</p>
              <button
                onClick={() => onNavigate('approvals')}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#00716B]/20 bg-teal-50/40 hover:bg-teal-50 text-[#00716B] text-xs font-bold transition-colors cursor-pointer"
              >
                مشاهده در کارتابل تاییدات
                <span className="material-symbols-outlined text-sm">arrow_back</span>
              </button>
            </div>
          )}
        </div>

        {/* Clash Coordination Chart (5 Cols) */}
        <div className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-[22px]">crisis_alert</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">گزارشات هماهنگی و کلش‌گیری (Clash Coordination)</h3>
                </div>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#00716B] text-[18px]">bar_chart</span>
                  <span className="font-bold text-slate-800 text-[11px]">روند ۴ هفته گذشته: تعارضات رفع‌شده در برابر جدید</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>سرعت رفع: +۳۵٪
                </span>
              </div>
              <div className="flex items-center justify-end gap-3 text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#00716B]"></span>رفع‌شده (Resolved)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>جدید (New)</span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2 items-end h-28 border-b border-slate-200/60 pb-1 text-center">
                {[
                  { week: 'هفته ۱', resolved: 8, newCount: 12, rHeight: '33%', nHeight: '50%', isCurrent: false },
                  { week: 'هفته ۲', resolved: 18, newCount: 22, rHeight: '75%', nHeight: '90%', isCurrent: false },
                  { week: 'هفته ۳', resolved: 24, newCount: 15, rHeight: '100%', nHeight: '62%', isCurrent: false },
                  { week: 'هفته ۴ (جاری)', resolved: 21, newCount: 6, rHeight: '87%', nHeight: '25%', isCurrent: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      onOpenClashFilters?.({
                        status: 'open',
                        label: `هفته ${item.week} • ${item.newCount} تعارض جدید`,
                      })
                    }
                    className="flex flex-col items-center justify-end h-full gap-1 group cursor-pointer"
                    title={`مشاهده لیست تعارضات هفته ${item.week}`}
                  >
                    <div className="w-full flex items-end justify-center gap-1 h-20">
                      <div className="w-3 bg-[#00716B] rounded-t group-hover:opacity-80 transition-opacity" style={{ height: item.rHeight }} title={`${item.resolved} رفع‌شده`}></div>
                      <div className="w-3 bg-rose-400 rounded-t group-hover:opacity-80 transition-opacity" style={{ height: item.nHeight }} title={`${item.newCount} جدید`}></div>
                    </div>
                    <span className={`text-[9px] font-mono ${item.isCurrent ? 'text-[#00716B] font-bold' : 'text-slate-500'}`}>{item.week}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>مجموع رفع‌شده ۴ هفته اخیر: ۷۱ مورد</span>
                <span className="font-mono font-bold text-slate-700">۵۵ تعارض جدید</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
            <span className="text-slate-500 text-[11px]">آخرین به‌روزرسانی کلش: <b className="text-slate-700">امروز ۰۹:۳۰</b></span>
            <button
              onClick={() => onNavigate('bim')}
              className="inline-flex items-center gap-1 text-[#00716B] font-bold hover:underline text-xs cursor-pointer"
            >
              <span>مشاهده ماتریس تداخلات BIM</span>
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==============================================
           ROW 3: MILESTONES TIMELINE
           ============================================== */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-sm" id="design-milestones-timeline-sec">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-100 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-[#00716B]/10 text-[#00716B] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">flag</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">تایم‌لاین اجرایی و مایل‌استون‌های کلیدی پروژه</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1.5 text-xs text-slate-600">
              <span className="font-bold text-[#00716B]">۳ از ۸ مایل‌استون تکمیل‌شده</span>
              <span className="text-slate-300">•</span>
              <span>۱۵ فروردین تا ۳ آذر ۱۴۰۵</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>طبق برنامه
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('cde')}
              className="inline-flex items-center gap-1.5 text-[#00716B] hover:text-[#005c57] font-bold text-xs py-1.5 px-3 rounded-lg border border-[#00716B]/20 bg-teal-50/40 hover:bg-teal-50 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>مشاهده جدول کامل WBS
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 pt-2">
          <div className="min-w-[920px] relative px-4 flex items-start justify-between">
            <div className="absolute top-4 right-12 left-12 h-0.5 bg-slate-200 -z-0"></div>

            {[
              { title: 'نازک‌کاری مرکز داده‌ها', done: true, label: 'انجام شده' },
              { title: 'معماری طبقات ۲۱ تا ۲۵', done: true, label: 'انجام شده' },
              { title: 'فضای تجاری لبه پروژه', done: true, label: 'انجام شده' },
              { title: 'نمای طبقات فوقانی', done: false, label: 'انجام نشده' },
              { title: 'تاسیسات مکانیکی', done: false, label: 'انجام نشده' },
              { title: 'دیوارچینی نیم‌طبقه', done: false, label: 'انجام نشده' },
              { title: 'شوروم‌های جدید', done: false, label: 'انجام نشده' },
              { title: 'تحویل نهایی پروژه', done: false, label: 'انجام نشده (پایان ۱۴۰۵)', isFinal: true },
            ].map((m, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center w-28 group cursor-pointer">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2.5 shadow-sm transition-transform group-hover:scale-110 ${
                    m.done
                      ? 'bg-emerald-600 border-2 border-white text-white'
                      : m.isFinal
                      ? 'bg-white border-2 border-amber-500 border-dashed text-amber-600'
                      : 'bg-slate-100 border-2 border-slate-300 text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{m.done ? 'check' : m.isFinal ? 'flag' : 'radio_button_unchecked'}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 mb-1.5">{m.title}</div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    m.done
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                      : m.isFinal
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================
           ROW 4: BALANCED 3-COLUMN LOWER SUPPORTING CONTROLS
           ============================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Col 1: Financial Tracking (IPC Control) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-[20px]">receipt_long</span>
                <h3 className="text-xs font-bold text-slate-900">آخرین صورت وضعیت های طراحی</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">کنترل مالی</span>
            </div>
            <div className="space-y-3">
              {/* IPC In Review */}
              <div
                onClick={() => {
                  if (onOpenExcelIpc) onOpenExcelIpc();
                  else onNavigate('approvals');
                }}
                className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col gap-1 cursor-pointer hover:bg-amber-100/60 transition-all"
                title="کلیک جهت مشاهده و بررسی در قالب اکسل صورت وضعیت"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">صورت‌وضعیت شماره ۵ - سازه</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    در حال بررسی
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">بازنگری دال‌های پس‌کشیده و دیوارهای برشی</span>
                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-amber-200/50">
                  <span className="text-[11px] text-slate-500">مبلغ کارکرد مهر:</span>
                  <span className="text-sm font-bold font-['Markazi_Text'] text-amber-700">۴۸۰,۰۰۰,۰۰۰ تومان</span>
                </div>
              </div>
              {/* IPC Approved */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">صورت‌وضعیت شماره ۴ - معماری</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    تسویه شده
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">طراحی تفصیلی پلان‌های تیپ و نمای ترکیبی</span>
                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-emerald-200/50">
                  <span className="text-[11px] text-slate-500">پرداخت شده در ۱۴۰۳/۰۸/۱۰:</span>
                  <span className="text-sm font-bold font-['Markazi_Text'] text-emerald-700">۶۲۰,۰۰۰,۰۰۰ تومان</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3">
            <button
              onClick={() => onNavigateToCdeFolder?.('f-ph1-financial')}
              className="w-full py-2 rounded-lg bg-teal-50/60 border border-[#00716B]/20 text-[#00716B] hover:bg-teal-50 hover:text-[#005c57] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              مشاهده فولدر صورت‌وضعیت‌ها در CDE
            </button>
          </div>
        </div>

        {/* Col 2: Minutes of Meeting (MoM) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-[20px]">groups</span>
                <h3 className="text-xs font-bold text-slate-900">صورت‌جلسات فنی و هماهنگی (MoM)</h3>
              </div>
              <button
                onClick={() => onTriggerToast('ثبت جلسه جدید', 'فرم ثبت صورت‌جلسه هماهنگی باز شد.', 'info')}
                className="text-[11px] text-[#00716B] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                type="button"
              >
                <span>+ ثبت جلسه</span>
              </button>
            </div>
            <div className="space-y-2.5">
              {/* Meeting 1 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">جلسه هماهنگی رفع تداخل رایزرهای تاسیسات برق با خرپای سازه</span>
                    <span className="text-[11px] text-slate-500 block">حاضرین: مهندس پارسا، دکتر پورمند، مهندس علیزاده</span>
                  </div>
                  <button
                    onClick={() => onTriggerToast('دانلود صورت‌جلسه', 'فایل PDF صورت‌جلسه MOM-ALF-1042-019 دریافت گردید.', 'success')}
                    className="flex items-center gap-1 text-[11px] text-[#00716B] bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 flex-shrink-0 cursor-pointer"
                    title="دانلود فایل صورت‌جلسه"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    <span>PDF</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 border-t border-slate-200/50 pt-1.5 font-mono">
                  <span>تاریخ: ۱۹ آبان ۱۴۰۳</span>
                  <span>•</span>
                  <span>کد: MOM-ALF-1042-019</span>
                </div>
              </div>
              {/* Meeting 2 */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">بررسی اتصال شاسی‌های آسانسور پرسرعت ۳ متر بر ثانیه</span>
                    <span className="text-[11px] text-slate-500 block">حاضرین: تامین‌کننده تجهیزات، مشاور سازه، سرپرست کارگاه</span>
                  </div>
                  <button
                    onClick={() => onTriggerToast('دانلود صورت‌جلسه', 'فایل PDF صورت‌جلسه MOM-ALF-1042-018 دریافت گردید.', 'success')}
                    className="flex items-center gap-1 text-[11px] text-[#00716B] bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 flex-shrink-0 cursor-pointer"
                    title="دانلود فایل صورت‌جلسه"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    <span>PDF</span>
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 border-t border-slate-200/50 pt-1.5 font-mono">
                  <span>تاریخ: ۱۲ آبان ۱۴۰۳</span>
                  <span>•</span>
                  <span>کد: MOM-ALF-1042-018</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3">
            <button
              onClick={() => onNavigateToCdeFolder?.('f-doc-mom')}
              className="w-full py-2 rounded-lg bg-teal-50/60 border border-[#00716B]/20 text-[#00716B] hover:bg-teal-50 hover:text-[#005c57] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              مشاهده فولدر صورت‌جلسات در CDE
            </button>
          </div>
        </div>

        {/* Col 3: Recent Documents Feed */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00716B] text-[20px]">folder_open</span>
                <h3 className="text-xs font-bold text-slate-900">فایل های اخیراً بارگذاری‌شده در CDE</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">پوشه Documents</span>
            </div>
            <div className="space-y-2">
              {/* Item 1 */}
              <div
                onClick={() => onOpenDocumentDossier('doc-revit-core')}
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 font-mono text-[10px] font-bold flex items-center justify-center border border-rose-100">
                    PDF
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">گزارش آزمایش بارگذاری شمع‌های عمیق</span>
                    <span className="text-[10px] text-slate-400">توسط مهندس راد • ۳ ساعت پیش</span>
                  </div>
                </div>
                <button className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer" type="button">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
              {/* Item 2 */}
              <div
                onClick={() => onOpenDocumentDossier('doc-ifc-coord')}
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-teal-50 text-[#00716B] font-mono text-[10px] font-bold flex items-center justify-center border border-teal-100">
                    IFC
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">ساب‌مدل سازه ستون‌های مرکزی طبقه ۱۵</span>
                    <span className="text-[10px] text-slate-400">توسط مشاور بهساز سازه • دیروز</span>
                  </div>
                </div>
                <button className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer" type="button">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
              {/* Item 3 */}
              <div
                onClick={() => onOpenDocumentDossier('doc-dwg-riser')}
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-mono text-[10px] font-bold flex items-center justify-center border border-amber-100">
                    DWG
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">پلان مشاعات و استخر روف‌گاردن</span>
                    <span className="text-[10px] text-slate-400">توسط آتلیه معماری باران • ۲ روز پیش</span>
                  </div>
                </div>
                <button className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer" type="button">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
              {/* Item 4 */}
              <div
                onClick={() => onOpenDocumentDossier('doc-revit-core')}
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold flex items-center justify-center border border-emerald-100">
                    XLSX
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">ماتریس تخصیص مسئولیت‌ها RACI</span>
                    <span className="text-[10px] text-slate-400">توسط مدیر طراحی • ۳ روز پیش</span>
                  </div>
                </div>
                <button className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer" type="button">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 mt-3">
            <button
              onClick={() => onNavigateToCdeFolder?.('f-ph1')}
              className="w-full py-2 rounded-lg bg-teal-50/60 border border-[#00716B]/20 text-[#00716B] hover:bg-teal-50 hover:text-[#005c57] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">folder_open</span>
              مدیریت فایل‌ها در مخزن CDE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
