import React, { useState } from 'react';
import { NavigationTab } from '../types';

interface RoleSelectionViewProps {
  onRoleSelect: (role: 'cde' | 'construction') => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({
  onRoleSelect,
  onNavigate
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] flex flex-col justify-between antialiased" dir="rtl">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,51,48,0.06)]">
        <div className="h-16 max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-[#00716B] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[20px]">corporate_fare</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#005652] leading-none">BARAN GROUP</span>
                <span className="text-[13px] leading-none tracking-widest text-[#296862] font-bold">XONE PLATFORM</span>
              </div>
            </div>
            <div className="h-5 w-[1px] bg-[#bdc9c7] hidden md:block"></div>
            <nav className="hidden md:flex items-center gap-1">
              <a className="px-3 py-1.5 transition-colors bg-[#adece3] text-[#2e6c66] font-bold rounded cursor-default" aria-current="page">
                انتخاب نقش و ماژول
              </a>
              <a
                className="px-3 py-1.5 rounded text-base text-[#3e4947] hover:bg-[#eceef0] hover:text-[#191c1e] transition-colors cursor-pointer"
                onClick={() => onNavigate('portfolio')}
              >
                پرتفوی مدیران
              </a>
              <a
                className="px-3 py-1.5 rounded text-base text-[#3e4947] hover:bg-[#eceef0] hover:text-[#191c1e] transition-colors cursor-pointer"
                onClick={() => onNavigate('permissions')}
              >
                سازمان و دسترسی‌ها
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13px] tracking-wide text-[#3e4947] font-bold">پرتال ارشد مدیریتی</span>
              <span className="text-base text-[#005652] font-bold">مهندس علیرضا باران</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#005652] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-16 bg-[#f7f9fb] flex-1 flex flex-col justify-center">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-8 py-8 md:py-12 gap-8 md:gap-12 select-none">
          {/* Architectural Ambient Glow */}
          <div className="relative w-full">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 bg-[#9cf2ea]/20 blur-3xl rounded-full pointer-events-none -z-10"></div>

            {/* Header & Portal Branding Section */}
            <header className="flex flex-col items-center text-center max-w-3xl mx-auto px-4">
              {/* Luxury Brand Badge / Version Meta */}
              <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-full shadow-sm mb-6">
                <div className="w-5 h-5 flex items-center justify-center">
                  <img alt="نشان باران" className="h-5 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1VcTaKW9_L221pfLYoqkWr6KYLmigsxY64kd4MyaG3-gl7XqeBwaymhOKOrpbuW2CFx3oyLDigL-ICy2HGRki9csJZhzcOsi0hKXuLB8-bQAJgCAKDEBFKHAAHV1HKiXqEXujTT1rXERX2hm0V2L7_IBg0iegtZCV0I8cqE5PGKdwx_qXWcMTP3WtXorRp1LHbEzoA9WzFhxp4Cai0N6TsuIupNNsngSKhAFdZWAm-S8t0IGDvTQZGdtu6chb0rInuetWxCPbvVyg" />
                </div>
                <span className="h-3 w-px bg-[#bdc9c7]"></span>
                <span className="text-[13px] tracking-wider text-[#296862] font-bold">سامانه جامع XONE • SPATIAL CDE PLATFORM</span>
                <span className="h-3 w-px bg-[#bdc9c7]"></span>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[#005652] bg-[#b0eee6]/40 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005652] animate-pulse"></span>
                  <span>CoP V 0.5</span>
                </span>
              </div>

              {/* Main Portal Headings */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-10 mb-2 flex items-center justify-center">
                  <img alt="گروه ساختمانی باران" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1ViBRyqOwrQLV8gpJhKNrk7bCWyNAJj8aDyxyq33RHT-bv6aBkQokN9ujtW7P5dypO0k-QFPEvGkqGeQagfMkuAYjgFb0XOWuMQnmgDbjNnHD0TAV3VVlKAy176ptizCw1js4EQWa0F5ZdlNi1x622IxqbLtewFLrZikpS1fmtNr6AcVJjHy_pqefFLAyUaBdFnEALBtVnERS0xeg9K9oEzw8wlM8TKfm6Wh9NqFT6bld0ov_n7MzasPfMlhhTU-c95U5i3UBk7WA" />
                </div>
                <h1 className="text-[32px] leading-[40px] tracking-tight font-bold text-[#005652]">انتخاب محیط کاربری و نقش سازمانی</h1>
                <p className="text-lg leading-7 text-[#3e4947] max-w-2xl mt-1">
                  جهت ارزیابی و مرور یکپارچه جریان‌های فرآیندی پلتفرم <span className="text-[#005652] font-bold">Xone</span> در جلسه هیئت‌مدیره، لطفاً پرسونای مدیریتی مورد نظر خود را جهت ورود به میزکار تحلیلی انتخاب فرمایید.
                </p>
              </div>

              {/* Architectural Technical Coordinate / Metric Indicator */}
              <div className="mt-4 flex items-center gap-6 text-[#3e4947]/70 text-[13px] tracking-wide">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#005652]">security</span>
                  پروتکل ایزولاسیون ISO 19650-2
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#005652]">hub</span>
                  محیط داده مشترک (CDE) هلدینگ
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#005652]">view_in_ar</span>
                  ناظر بلادرنگ LOD 350
                </span>
              </div>
            </header>
          </div>

          {/* Role Selection Bento / Grid */}
          <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Role 1: Design Lead & CDE (Active) */}
              <div className="group relative flex flex-col justify-between bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden p-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#E6F1F0] flex items-center justify-center text-[#005652] group-hover:bg-[#00716B] group-hover:text-white transition-colors duration-300">
                      <span className="material-symbols-outlined text-[28px]">architecture</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b0eee6]/50 text-[#05504a] text-[13px] font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005652]"></span>فعال در پروتوتایپ
                    </span>
                  </div>
                  <div className="flex flex-col mb-3">
                    <span className="text-[13px] text-[#296862] font-bold tracking-wider mb-1">DESIGN LEAD &amp; CDE</span>
                    <h3 className="text-xl leading-7 font-bold text-[#191c1e] group-hover:text-[#005652] transition-colors">مدیر ارشد طراحی و CDE</h3>
                  </div>
                  <p className="text-lg leading-7 text-[#3e4947] mb-6">مرکز هدایت مدل‌سازی اطلاعات ساختمان (BIM)، هماهنگی دیسیپلین‌های مهندسی و صحه‌گذاری مدارک.</p>
                </div>
                <button
                  onClick={() => onRoleSelect('cde')}
                  className="w-full py-2.5 px-4 rounded bg-[#00716B] hover:bg-[#005652] text-white text-xl leading-7 font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>ورود به پیشخوان</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:-translate-x-1">arrow_back</span>
                </button>
              </div>

              {/* Role 2: Construction Coordination (Active) */}
              <div className="group relative flex flex-col justify-between bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden p-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#E6F1F0] flex items-center justify-center text-[#005652] group-hover:bg-[#00716B] group-hover:text-white transition-colors duration-300">
                      <span className="material-symbols-outlined text-[28px]">construction</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b0eee6]/50 text-[#05504a] text-[13px] font-bold tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005652]"></span>فعال در پروتوتایپ
                    </span>
                  </div>
                  <div className="flex flex-col mb-3">
                    <span className="text-[13px] text-[#296862] font-bold tracking-wider mb-1">CONSTRUCTION COORDINATION</span>
                    <h3 className="text-xl leading-7 font-bold text-[#191c1e] group-hover:text-[#005652] transition-colors">مدیر ساخت و کارگاه</h3>
                  </div>
                  <p className="text-lg leading-7 text-[#3e4947] mb-6">فرماندهی عملیات اجرایی برج‌ها، پایش برنامه زمان‌بندی و انطباق فیزیکی با مدل BIM.</p>
                </div>
                <button
                  onClick={() => onRoleSelect('construction')}
                  className="w-full py-2.5 px-4 rounded bg-[#00716B] hover:bg-[#005652] text-white text-xl leading-7 font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <span>ورود به پیشخوان</span>
                  <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:-translate-x-1">arrow_back</span>
                </button>
              </div>

              {/* Role 3: Commercial & Assets (Locked) */}
              <div className="relative flex flex-col justify-between bg-white/80 rounded-xl shadow-sm opacity-85 overflow-hidden p-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#eceef0] flex items-center justify-center text-[#6e7978]">
                      <span className="material-symbols-outlined text-[28px]">real_estate_agent</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e0e3e5] text-[#3e4947] text-[13px] tracking-wide">
                      <span className="material-symbols-outlined text-[14px]">lock</span>در دست توسعه
                    </span>
                  </div>
                  <div className="flex flex-col mb-3">
                    <span className="text-[13px] text-[#6e7978] font-bold tracking-wider mb-1">COMMERCIAL &amp; ASSETS</span>
                    <h3 className="text-xl leading-7 font-bold text-[#3e4947]">مدیریت فروش و امور خریداران</h3>
                  </div>
                  <p className="text-lg leading-7 text-[#6e7978] mb-6">مدیریت استک طبقات، پیگیری وصول مطالبات و اتصال پیشرفت فیزیکی به تعهدات قراردادی.</p>
                </div>
                <button
                  className="w-full py-2.5 px-4 rounded bg-[#e0e3e5] text-[#3e4947]/70 text-xl leading-7 font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  disabled
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>غیرفعال در نسخه دمو</span>
                </button>
              </div>

              {/* Role 4: Hospitality & FM (Locked) */}
              <div className="relative flex flex-col justify-between bg-white/80 rounded-xl shadow-sm opacity-85 overflow-hidden p-6">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#eceef0] flex items-center justify-center text-[#6e7978]">
                      <span className="material-symbols-outlined text-[28px]">apartment</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e0e3e5] text-[#3e4947] text-[13px] tracking-wide">
                      <span className="material-symbols-outlined text-[14px]">lock</span>در دست توسعه
                    </span>
                  </div>
                  <div className="flex flex-col mb-3">
                    <span className="text-[13px] text-[#6e7978] font-bold tracking-wider mb-1">HOSPITALITY &amp; FM</span>
                    <h3 className="text-xl leading-7 font-bold text-[#3e4947]">مدیریت بهره‌برداری و خدمات</h3>
                  </div>
                  <p className="text-lg leading-7 text-[#6e7978] mb-6">راهبری خدمات سبک زندگی اختصاصی، نگهداری پیشگیرانه تأسیسات و ارتباط با بهره‌برداران.</p>
                </div>
                <button
                  className="w-full py-2.5 px-4 rounded bg-[#e0e3e5] text-[#3e4947]/70 text-xl leading-7 font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  disabled
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>غیرفعال در نسخه دمو</span>
                </button>
              </div>
            </div>
          </section>

          {/* Interactive Demo Notification Banner & Role Selector Summary */}
          <div className="w-full bg-[#E6F1F0]/60 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00716B] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xl leading-7 text-[#005652] font-bold">امنیت و تفکیک سازمانی پایگاه داده</span>
                <span className="text-base leading-6 text-[#3e4947]">
                  کلیه داده‌ها و گردش‌کارهای هر نقش با الگوریتم‌های رمزنگاری TLS 256-bit و منطبق بر استاندارد ایزولاسیون ISO 19650 تفکیک شده‌اند.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-4 py-2 rounded bg-white text-[#005652] hover:bg-[#adece3] hover:text-[#2e6c66] transition-colors text-base leading-6 font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">help_outline</span>
                <span>راهنمای تعاملی جلسه پیچ‌دک</span>
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-2 rounded text-[#3e4947] hover:text-[#BA1A1A] transition-colors text-base leading-6 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>خروج از حساب</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white shadow-[0_-1px_6px_rgba(0,51,48,0.03)]">
        <div className="max-w-7xl mx-auto px-8 py-1 flex flex-col md:flex-row items-center justify-between text-[#3e4947] text-[13px] tracking-wide">
          <div className="flex items-center gap-5">
            <span className="text-[#005652] font-bold">سامانه یکپارچه هلدینگ باران (Xone v4.2)</span>
            <span>طراحی سازمانی مبتنی بر استانداردهای مهندسی</span>
          </div>
          <div>
            <span>کلیه حقوق و دسترسی‌های این درگاه محفوظ و مختص کادر اجرایی گروه باران است.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modal / Guide Drawer */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop-dissolve">
          <div className="bg-white max-w-lg w-full rounded-xl p-6 shadow-2xl flex flex-col gap-4 text-right animate-modal-dissolve">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005652] text-[24px]">tips_and_updates</span>
                <h4 className="text-xl leading-7 text-[#005652] font-bold">راهنمای سناریوی ارائه پیچ‌دک</h4>
              </div>
              <button onClick={() => setIsGuideOpen(false)} className="text-[#3e4947] hover:text-[#191c1e] cursor-pointer">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-[#3e4947] text-base leading-6 flex flex-col gap-3">
              <p>
                حاضرین گرامی و سرمایه‌گذاران محترم، در این نگارش دمو دو ماژول اصلی <strong>«راهبری CDE و طراحی»</strong> و <strong>«مدیریت ساخت و هماهنگی کارگاه»</strong> به‌طور کامل با داده‌های واقعی پروژه‌های باران پیوند خورده‌اند.
              </p>
              <div className="bg-[#f2f4f6] p-3 rounded-lg flex flex-col gap-2 text-[#191c1e]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#005652] shrink-0"></span>
                  <span><strong>سناریوی ۱:</strong> انتخاب مدیر طراحی برای بررسی مدل سه‌بعدی BIM، جدول تداخلات و کارتابل تاییدات فنی.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#005652] shrink-0"></span>
                  <span><strong>سناریوی ۲:</strong> انتخاب مدیر ساخت جهت ارزیابی منحنی S-Curve، فید زنده دوربین‌ها و صورت‌وضعیت‌ها.</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2 rounded bg-[#005652] text-white text-xl leading-7 cursor-pointer"
              >
                متوجه شدم • ادامه ارائه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
