import React, { useState, useRef } from 'react';
import {
  Check,
  Copy,
  Share2,
  Upload,
  Gauge,
  TrendingDown,
  FileText,
  Printer,
  ShoppingCart,
  Gift,
  ShieldCheck,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react';
import {
  BEFORE_AFTER_CASES,
  FREE_OPTIONS_INCLUDED,
  CONTRACT_TIMELINE_STEPS,
} from '../data/contentPagesData';
import { downloadOfficialSampleContract } from '../utils/documentExport';

interface TrumpCardsSectionProps {
  customBrandName: string;
  onChangeCustomBrand: (brand: string) => void;
  isComPackageInCart: boolean;
  onToggleComPackage: () => void;
  onOpenCustomInquiry: () => void;
}

export const TrumpCardsSection: React.FC<TrumpCardsSectionProps> = ({
  customBrandName,
  onChangeCustomBrand,
  isComPackageInCart,
  onToggleComPackage,
  onOpenCustomInquiry,
}) => {
  // 1. Live 5-second Brand & Logo Tester + Share Link
  const [brandLogoDataUrl, setBrandLogoDataUrl] = useState<string | null>(null);
  const [brandAccent, setBrandAccent] = useState<string>('#2563EB');
  const [brandIndustry, setBrandIndustry] = useState<string>('فروشگاه اینترنتی');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. Speed vs Slow WordPress Loss Calculator
  const [dailyVisitors, setDailyVisitors] = useState<number>(300);
  const [avgOrderToman, setAvgOrderToman] = useState<number>(2200000);

  // 3. Before/After Slider State
  const [activeCaseIdx, setActiveCaseIdx] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(52);

  const activeCase = BEFORE_AFTER_CASES[activeCaseIdx];

  // Calculate realistic monthly loss caused by a slow 6s website (lost ~4% potential buyers from bouncing mobile visitors)
  const lostCustomersPerDay = Math.max(1, Math.round(dailyVisitors * 0.014));
  const monthlyLossToman = lostCustomersPerDay * avgOrderToman * 30;

  const displayBrand = customBrandName.trim() || 'برند شما (مثلاً: گالری زرین)';
  const shareUrl = `https://pashalan.ir/?brand=${encodeURIComponent(
    displayBrand
  )}&industry=${encodeURIComponent(brandIndustry)}`;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBrandLogoDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrintSampleContract = () => {
    downloadOfficialSampleContract();
  };

  return (
    <section
      id="trump-cards"
      className="w-full py-14 sm:py-18 bg-white border-b border-slate-200"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-14">
        {/* ================================================================ */}
        {/* PART A: FREE OPTIONS & SPECIAL 20M .COM PACKAGE SPOTLIGHT        */}
        {/* ================================================================ */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-xs font-bold text-emerald-700">
                پکیج آماده فروش در ایران — بدون هزینه‌های پنهان
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                خدمات و آپشن‌های رایگان روی سفارش شما + پکیج ویژه ۲۰ میلیونی دامنه .com
              </h2>
            </div>

            <button
              type="button"
              onClick={onToggleComPackage}
              className={`px-5 py-3 rounded-xl font-extrabold text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
                isComPackageInCart
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-blue-600 text-white shadow-sm'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isComPackageInCart
                  ? 'پکیج ۲۰ میلیونی .com تیک خورد (در سبد خرید) ✓'
                  : 'تیک زدن پکیج دامنه .com + هاست رایگان (۲۰ میلیون)'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FREE_OPTIONS_INCLUDED.map((item, idx) => {
              const isComCard = idx === 0;
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-6 border flex flex-col justify-between gap-4 ${
                    isComCard
                      ? 'bg-slate-900 text-white border-slate-800 shadow-lg'
                      : 'bg-slate-50 text-slate-900 border-slate-200'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span
                        className={`font-bold ${
                          isComCard ? 'text-amber-300' : 'text-emerald-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                      <span
                        className={`font-mono font-extrabold tabular-nums ${
                          isComCard ? 'text-emerald-400' : 'text-blue-700'
                        }`}
                      >
                        {item.valueLabel}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold leading-snug">
                      {item.title}
                    </h3>
                    <p
                      className={`text-xs leading-relaxed ${
                        isComCard ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {isComCard ? (
                    <button
                      type="button"
                      onClick={onToggleComPackage}
                      className={`w-full py-2.5 rounded-xl text-xs font-black cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                        isComPackageInCart
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-white hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {isComPackageInCart
                          ? 'تیک خورده در سبد خرید شما (۲۰ میلیون)'
                          : 'تیک بزن و به سبد خرید اضافه کن (۲۰ میلیون)'}
                      </span>
                    </button>
                  ) : (
                    <div className="pt-2 border-t border-slate-200/80 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 shrink-0" />
                      <span>به‌صورت رایگان روی سفارش شما نصب و تحویل می‌شود</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* PART B: 5-SECOND LIVE BRAND + LOGO TESTER & SHAREABLE LINK        */}
        {/* ================================================================ */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-bold text-emerald-400">
              برگ برنده ۱ · تست زنده قبل از پرداخت ریالی
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold leading-snug">
              در ۵ ثانیه سایت را با نام برند و لوگوی خودتان ببینید و برای شریک‌تان بفرستید
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              اسم برندتان را بنویسید، لوگوی خودتان را آپلود کنید و رنگ سازمانی را
              انتخاب کنید؛ همان لحظه پیش‌نمایش زنده ساخته می‌شود و روی تمام ۱۴۰ طرح
              صفحه اعمال می‌گردد.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={customBrandName}
                onChange={(e) => onChangeCustomBrand(e.target.value)}
                placeholder="نام برند شما (مثلاً: فروشگاه زرین)"
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
              />
              <select
                value={brandIndustry}
                onChange={(e) => setBrandIndustry(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="فروشگاه اینترنتی" className="bg-slate-900">
                  فروشگاه اینترنتی و دیجیتال
                </option>
                <option value="کلینیک پزشکی و زیبایی" className="bg-slate-900">
                  کلینیک پزشکی و نوبت‌دهی
                </option>
                <option value="گالری طلا، مد و پوشاک" className="bg-slate-900">
                  گالری طلا، مد و پوشاک
                </option>
                <option value="شرکتی و بازرگانی" className="bg-slate-900">
                  شرکتی، صنعتی و صادراتی
                </option>
                <option value="دپارتمان املاک" className="bg-slate-900">
                  مشاورین املاک و مسکن
                </option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>{brandLogoDataUrl ? 'تغییر لوگوی برند' : 'آپلود لوگوی شما'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED'].map(
                  (hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setBrandAccent(hex)}
                      style={{ backgroundColor: hex }}
                      aria-label={`انتخاب رنگ ${hex}`}
                      className={`w-7 h-7 rounded-lg cursor-pointer transition-transform ${
                        brandAccent === hex
                          ? 'ring-2 ring-white scale-110'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  )
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>
                  {copiedLink
                    ? 'لینک دمو کپی شد ✓'
                    : 'کپی لینک پیش‌نمایش برای شریک شما'}
                </span>
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `این پیش‌نمایش زنده سایت «${displayBrand}» رو ببین: ${shareUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ارسال در واتساپ</span>
              </a>
            </div>
          </div>

          {/* Live Branded Mini-Site Preview Card */}
          <div className="lg:col-span-6 bg-white text-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-600">
              <span>پیش‌نمایش زنده با برند شما</span>
              <span dir="ltr" className="text-blue-700 font-bold">
                https://www.
                {(customBrandName.trim() || 'yourbrand')
                  .replace(/\s+/g, '')
                  .slice(0, 12)}
                .com
              </span>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  {brandLogoDataUrl ? (
                    <img
                      src={brandLogoDataUrl}
                      alt={displayBrand}
                      className="w-10 h-10 rounded-xl object-contain border border-slate-200 bg-white p-1"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: brandAccent }}
                      className="w-10 h-10 rounded-xl text-white font-black text-base flex items-center justify-center"
                    >
                      {displayBrand.slice(0, 1)}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {displayBrand}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {brandIndustry} · دارای اینماد و پرداخت اقساطی اسنپ‌پی
                    </div>
                  </div>
                </div>
                <span
                  style={{ backgroundColor: brandAccent }}
                  className="px-3 py-1.5 rounded-lg text-white text-[11px] font-bold"
                >
                  ورود / سبد خرید
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="text-xs font-bold" style={{ color: brandAccent }}>
                  نسخه آماده فروش آنلاین «{displayBrand}»
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  خرید آنلاین مستقیم از {displayBrand} با ارسال سریع به سراسر ایران
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1">
                  <span>درگاه شاپرک و زرین‌پال</span>
                  <span>·</span>
                  <span>۴ قسطه اسنپ‌پی</span>
                  <span>·</span>
                  <span>متصل به ترب و ایمالز</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-slate-900">
                    محصول یا خدمت ویژه ۱
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    موجود با گارانتی اصالت {displayBrand}
                  </div>
                  <div
                    className="font-mono font-extrabold mt-2 tabular-nums"
                    style={{ color: brandAccent }}
                  >
                    ۴,۸۵۰,۰۰۰ تومان
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="font-bold text-slate-900">
                    محصول یا خدمت ویژه ۲
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    امکان پرداخت ۴ قسطه اسنپ‌پی
                  </div>
                  <div
                    className="font-mono font-extrabold mt-2 tabular-nums"
                    style={{ color: brandAccent }}
                  >
                    ۷,۲۰۰,۰۰۰ تومان
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PART C: SPEED VS WORDPRESS LOSS CALCULATOR + BEFORE/AFTER SLIDER  */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Speed & Monthly Revenue Loss Calculator */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                <TrendingDown className="w-4 h-4" />
                <span>برگ برنده ۲ · مقایسه‌گر سرعت و ضرر سایت کند</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                سایت کدنویسی پاشالان (زیر ۱ ثانیه) در مقابل سایت‌های وردپرسی کند (۶ ثانیه)
              </h3>

              {/* Side by side speed bars */}
              <div className="space-y-2.5 bg-white border border-slate-200 rounded-2xl p-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5" />
                      سایت مهندسی پاشالان (امتیاز ۹۸/۱۰۰)
                    </span>
                    <span className="font-mono tabular-nums">۰.۷ ثانیه</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[96%] bg-emerald-500 rounded-full" />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between font-bold text-rose-700">
                    <span>قالب وردپرسی سنگین با افزونه‌های زیاد (امتیاز ۴۴)</span>
                    <span className="font-mono tabular-nums">۶.۴ ثانیه</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[38%] bg-rose-500 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Interactive Loss Sliders */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>بازدیدکننده روزانه سایت یا اینستاگرام شما:</span>
                    <span className="font-mono text-blue-700 tabular-nums">
                      {dailyVisitors.toLocaleString('fa-IR')} نفر در روز
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={dailyVisitors}
                    onChange={(e) => setDailyVisitors(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>میانگین مبلغ هر خرید یا قرارداد شما:</span>
                    <span className="font-mono text-blue-700 tabular-nums">
                      {avgOrderToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={15000000}
                    step={500000}
                    value={avgOrderToman}
                    onChange={(e) => setAvgOrderToman(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5">
              <div className="text-xs font-bold text-rose-900">
                ضرر تقریبی ماهانه شما در صورت داشتن سایت کند (از دست رفتن{' '}
                {lostCustomersPerDay.toLocaleString('fa-IR')} مشتری در روز):
              </div>
              <div className="text-2xl font-mono font-extrabold text-rose-700 tabular-nums">
                {monthlyLossToman.toLocaleString('fa-IR')} تومان در ماه
              </div>
              <p className="text-[11px] text-rose-800">
                هزینه یک سایت فوق‌سریع پاشالان تنها در چند روز اول از محل همین
                مشتریان نجات‌یافته برمی‌گردد.
              </p>
            </div>
          </div>

          {/* Interactive Before / After Case Study Slider */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-blue-600">
                    برگ برنده ۳ · مقایسه واقعی قبل و بعد (Before / After)
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                    اسلایدر را بکشید و تغییر واقعی سرعت و فروش را ببینید
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {BEFORE_AFTER_CASES.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCaseIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        activeCaseIdx === idx
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {c.industry.split(' ')[0]} {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Drag Comparison Viewport */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-white min-h-[250px] select-none">
                {/* AFTER Layer (Right / Full background) */}
                <div className="p-5 bg-emerald-50/70 min-h-[250px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800">
                      بعد از بازطراحی در پاشالان — {activeCase.businessName}
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-700 tabular-nums">
                      {activeCase.monthlyRevenueLift}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div className="p-3 rounded-xl bg-white border border-emerald-200">
                      <div className="text-[11px] text-slate-500">سرعت جدید:</div>
                      <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                        {activeCase.afterSpeedSec}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-emerald-200">
                      <div className="text-[11px] text-slate-500">
                        نرخ تبدیل جدید:
                      </div>
                      <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
                        {activeCase.afterConversion}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {activeCase.afterWins.map((w) => (
                      <li key={w} className="flex items-start gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* BEFORE Layer (Clipped by Slider) */}
                <div
                  style={{ clipPath: `inset(0 0 0 ${100 - sliderPos}%)` }}
                  className="absolute inset-0 p-5 bg-slate-900 text-white flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-400">
                      وضعیت قبلی سایت — {activeCase.businessName}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {activeCase.city}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[11px] text-slate-400">سرعت قبلی:</div>
                      <div className="text-sm font-extrabold text-rose-300 mt-0.5">
                        {activeCase.beforeSpeedSec}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                      <div className="text-[11px] text-slate-400">
                        نرخ تبدیل قبلی:
                      </div>
                      <div className="text-sm font-extrabold text-rose-300 mt-0.5">
                        {activeCase.beforeConversion}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {activeCase.beforeIssues.map((iss) => (
                      <li key={iss} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">✕</span>
                        <span>{iss}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vertical Divider Indicator */}
                <div
                  style={{ left: `${100 - sliderPos}%` }}
                  className="absolute inset-y-0 w-0.5 bg-blue-600 pointer-events-none z-10"
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Range Control for Smooth Dragging on Desktop & Touch */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>نمایش بیشتر وضعیت قبل</span>
                  <span>اسلایدر مقایسه را به چپ و راست بکشید</span>
                  <span>نمایش کامل وضعیت بعد در پاشالان</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={95}
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-ew-resize"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
              <span>{activeCase.summary}</span>
              <button
                type="button"
                onClick={onOpenCustomInquiry}
                className="text-blue-600 font-extrabold hover:underline cursor-pointer shrink-0"
              >
                درخواست استعلام بازطراحی / سایت اختصاصی ←
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PART D: TRANSPARENT CONTRACT + 7-DAY DELIVERY ROADMAP             */}
        {/* ================================================================ */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>برگ برنده ۴ · شفافیت کامل قرارداد و جدول تحویل روز به روز</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                از روز اول تا روز هفتم دقیقاً چه چیزی تحویل می‌گیرید؟
              </h3>
            </div>

            <button
              type="button"
              onClick={handlePrintSampleContract}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-colors self-start whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>مشاهده و دانلود نمونه قرارداد رسمی (PDF)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTRACT_TIMELINE_STEPS.map((step) => (
              <div
                key={step.day}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-blue-700">
                    {step.day}
                  </span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
