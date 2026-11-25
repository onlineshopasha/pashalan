import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  ShoppingCart,
  ArrowUpLeft,
  Gift,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { HERO_BANNER_SLIDES } from '../data/contentPagesData';

interface HeroShowcaseSliderProps {
  onAddComPackageToCart: () => void;
  isComPackageInCart: boolean;
  onOpenCustomInquiry: () => void;
}

export const HeroShowcaseSlider: React.FC<HeroShowcaseSliderProps> = ({
  onAddComPackageToCart,
  isComPackageInCart,
  onOpenCustomInquiry,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const currentSlide = HERO_BANNER_SLIDES[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? HERO_BANNER_SLIDES.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % HERO_BANNER_SLIDES.length);
  };

  const handlePrimaryAction = () => {
    if (currentSlide.primaryActionType === 'add-com-pack') {
      onAddComPackageToCart();
    } else if (currentSlide.primaryActionType === 'custom-inquiry') {
      onOpenCustomInquiry();
    } else if (currentSlide.primaryActionType === 'scroll-templates') {
      document
        .getElementById('category-shelves')
        ?.scrollIntoView({ behavior: 'smooth' });
    } else if (currentSlide.primaryActionType === 'scroll-trump') {
      document
        .getElementById('trump-cards')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#090D16] text-white border-b border-slate-800">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-5">
        {/* Main Full-Width Editorial Slider Frame — Single Crisp Photo Per Slide */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl min-h-[460px] sm:min-h-[500px] grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Right Content Column (RTL): Clear Offer, Price Highlight, Free Bonuses, CTA */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between gap-6 bg-gradient-to-l from-[#0B1120] via-[#0B1120] to-[#0F172A] z-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-400">
                <span>{currentSlide.kicker}</span>
                <span aria-hidden="true" className="text-slate-500">
                  ·
                </span>
                <span className="font-mono text-amber-300 tabular-nums">
                  {currentSlide.priceHighlight}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl xl:text-[38px] font-extrabold text-white leading-[1.3] tracking-tight text-balance">
                {currentSlide.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {currentSlide.subtitle}
              </p>

              {/* Prominent Free Options Grid inside Banner */}
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>آپشن‌ها و خدمات رایگان برجسته در این طرح:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSlide.freeOptions.map((opt) => (
                    <div
                      key={opt}
                      className="flex items-start gap-2 text-xs text-slate-100 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap shrink-0"
              >
                {currentSlide.primaryActionType === 'add-com-pack' && (
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                )}
                <span>
                  {currentSlide.primaryActionType === 'add-com-pack' &&
                  isComPackageInCart
                    ? 'پکیج ۲۰ میلیونی .com در سبد خرید شماست ✓'
                    : currentSlide.primaryActionLabel}
                </span>
                <ArrowUpLeft className="w-4 h-4 shrink-0" />
              </button>

              <a
                href={currentSlide.secondaryHref}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs sm:text-sm transition-colors whitespace-nowrap shrink-0"
              >
                {currentSlide.secondaryActionLabel}
              </a>
            </div>
          </div>

          {/* Left Visual Column (RTL): Single Clean Full-Height Photograph (Zero CLS) */}
          <div className="lg:col-span-6 relative h-[260px] sm:h-[320px] lg:h-auto lg:min-h-[500px] bg-slate-900 overflow-hidden">
            <img
              key={currentSlide.id}
              src={currentSlide.image}
              alt={currentSlide.title}
              width={720}
              height={405}
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

            {/* Clean Bottom Strip Inside Photo Showing Exact Price & Free Domain Offer */}
            <div className="absolute bottom-4 inset-x-4 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2.5 text-xs">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-extrabold text-white">
                    {activeIndex === 0
                      ? 'دامنه .com رایگان + هاست رایگان'
                      : activeIndex === 1
                      ? 'دامنه .ir رایگان + ۶ ماه هاست رایگان'
                      : activeIndex === 2
                      ? 'طراحی اختصاصی Figma + سورس‌کد ۱۰۰٪'
                      : 'اتصال رایگان اینماد، درگاه، اسنپ‌پی و ترب'}
                  </div>
                  <div className="text-[11px] text-slate-300 font-mono tabular-nums">
                    {currentSlide.priceHighlight}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="اسلاید قبلی"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="اسلاید بعدی"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Slide Selector Tabs + Prominent Quick Offer Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {HERO_BANNER_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`text-right px-4 py-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-white text-slate-950 border-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div
                    className={`text-[11px] font-mono tabular-nums ${
                      isActive ? 'text-blue-700 font-extrabold' : 'text-emerald-400 font-bold'
                    }`}
                  >
                    0{idx + 1}. {slide.priceHighlight}
                  </div>
                  <div className="text-xs font-extrabold truncate mt-0.5">
                    {idx === 0
                      ? 'پکیج ویژه دامنه .com + هاست رایگان'
                      : idx === 1
                      ? 'طرح آماده ۱ تا ۱۰ صفحه (.ir رایگان)'
                      : idx === 2
                      ? 'طراحی اختصاصی (استعلام قیمت)'
                      : 'پکیج آماده فروش + سرعت زیر ۱ ثانیه'}
                  </div>
                </div>
                <ShieldCheck
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
