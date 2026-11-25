import React from 'react';
import {
  Eye,
  ArrowUpLeft,
  Check,
  Gift,
  Layers,
  Globe,
  Smartphone,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  SpatialKit,
  calculateReadyPlanPriceByPages,
} from '../data/spatialCatalog';

interface SpatialKitCardProps {
  kit: SpatialKit;
  pricingMode: 'ready-kit' | 'custom-agency';
  selectedPageCount: number;
  onOpenLivePreview: (kit: SpatialKit) => void;
  onSelectForOrder: (kit: SpatialKit, mode: 'ready-kit' | 'custom-agency') => void;
}

export const SpatialKitCard: React.FC<SpatialKitCardProps> = ({
  kit,
  pricingMode,
  selectedPageCount,
  onOpenLivePreview,
  onSelectForOrder,
}) => {
  const dynamicReadyPrice = calculateReadyPlanPriceByPages(selectedPageCount);
  const activePrice =
    pricingMode === 'ready-kit' ? dynamicReadyPrice : kit.customPriceToman;
  const activeDelivery =
    pricingMode === 'ready-kit'
      ? `تحویل ۴۸ ساعته (${selectedPageCount.toLocaleString('fa-IR')} صفحه کامل)`
      : kit.customDelivery;

  return (
    <article
      onClick={() => onOpenLivePreview(kit)}
      className="group bg-white border border-slate-200 hover:border-blue-600 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl cursor-pointer h-full"
    >
      <div>
        {/* Image Header with Picture-in-Picture Overlay & Instant Action Badges */}
        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b border-slate-100">
          <img
            src={kit.image}
            alt={kit.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallbackApplied) {
                target.dataset.fallbackApplied = '1';
                target.src = '/images/showcase_fintech_exchange_1793284715041.jpg?v=2';
              }
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-slate-950/20" />

          {/* Top Floating Badges inside Image */}
          <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold border border-white/15 shadow-sm">
              کد {kit.code} · {kit.categoryLabel}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold shadow-sm flex items-center gap-1">
              <Gift className="w-3 h-3 shrink-0" />
              <span>هاست ۶ ماهه + دامنه .ir رایگان</span>
            </span>
          </div>

          {/* Picture-in-Picture Mini Live Card inside the Image */}
          <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-white/40 shadow-lg flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate font-mono" dir="ltr">
                  {kit.liveUrlSlug.replace('https://', '')}
                </span>
              </div>
              <div className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                {kit.engineLabel}
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-blue-600 group-hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-xs transition-colors">
              <Eye className="w-3.5 h-3.5" />
              <span>نمای تمام‌صفحه</span>
            </span>
          </div>
        </div>

        {/* Dedicated Card Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 font-semibold mb-1">
              <span className="text-emerald-700 font-bold">{kit.impactMetric}</span>
              <span className="inline-flex items-center gap-1 text-slate-500">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>وب + موبایل</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
              {kit.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mt-1.5">
              {kit.summary}
            </p>
          </div>

          {/* Included Pages Preview Pill Strip */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>نمونه صفحات اختصاصی داخل این طرح:</span>
              </span>
              <span className="text-blue-600 font-bold">۱ تا ۱۰ صفحه</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(kit.sandboxTheme.navLinks || []).slice(0, 4).map((navItem) => (
                <span
                  key={navItem}
                  className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 font-medium"
                >
                  {navItem}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-bold">
                + پنل مدیریت
              </span>
            </div>
          </div>

          {/* Key Features Checklist */}
          <ul className="space-y-1.5 text-xs text-slate-700">
            {(kit.features || []).slice(0, 3).map((feat) => (
              <li key={feat} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing & Professional Dual CTA Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              {pricingMode === 'ready-kit'
                ? `تعرفه طرح آماده (${selectedPageCount.toLocaleString('fa-IR')} صفحه):`
                : 'تعرفه طراحی اختصاصی + اپ:'}
            </span>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>{activeDelivery}</span>
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-xl font-mono font-extrabold text-slate-900 tabular-nums">
                {activePrice.toLocaleString('fa-IR')}
              </span>
              <span className="text-xs font-bold text-slate-600">تومان</span>
            </div>
            {pricingMode === 'ready-kit' && (
              <span className="text-[10px] text-slate-500 block">
                متغیر از ۸ تا ۱۸ میلیون (۱ تا ۱۰ صفحه)
              </span>
            )}
          </div>
        </div>

        {/* High-Craft Karlancer-Style Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLivePreview(kit);
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>دمو و مشخصات کامل</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectForOrder(kit, pricingMode);
            }}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer shadow-sm shadow-blue-600/20"
          >
            <span>سفارش این طرح</span>
            <ArrowUpLeft className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </article>
  );
};
