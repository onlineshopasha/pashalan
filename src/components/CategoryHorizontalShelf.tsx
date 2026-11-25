import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  Sliders,
  Globe,
  Heart,
  Layers,
  Check,
  ShoppingBag,
} from 'lucide-react';
import {
  SpatialKit,
  calculateReadyPlanPriceByPages,
} from '../data/spatialCatalog';
import { CategoryShelfDefinition } from '../data/megaTemplatesCatalog';

export type SandboxModalTab =
  | 'live-site'
  | 'customizer-studio'
  | 'admin-3d'
  | 'specs-pricing';

interface CategoryHorizontalShelfProps {
  shelf: CategoryShelfDefinition;
  templates: SpatialKit[];
  selectedPageCount: number;
  pricingMode: 'ready-kit' | 'custom-agency';
  customBrandName?: string;
  cartItemIds?: string[];
  onToggleCartKit?: (kit: SpatialKit, mode: 'ready-kit' | 'custom-agency') => void;
  onOpenFullScreen: (kit: SpatialKit, initialTab?: SandboxModalTab) => void;
  onOrderKit: (kit: SpatialKit, mode: 'ready-kit' | 'custom-agency') => void;
}

export const CategoryHorizontalShelf: React.FC<CategoryHorizontalShelfProps> = ({
  shelf,
  templates,
  selectedPageCount,
  pricingMode,
  customBrandName,
  cartItemIds = [],
  onToggleCartKit,
  onOpenFullScreen,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [showAllCards, setShowAllCards] = useState<boolean>(false);
  const readyPrice = calculateReadyPlanPriceByPages(selectedPageCount);

  const handleScroll = (dir: 'right' | 'left') => {
    if (!showAllCards) {
      setShowAllCards(true);
    }
    setTimeout(() => {
      if (!trackRef.current) return;
      const offset = dir === 'left' ? -680 : 680;
      trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }, 10);
  };

  const renderedTemplates = showAllCards ? templates : templates.slice(0, 4);

  return (
    <div
      onMouseEnter={() => {
        if (!showAllCards) setShowAllCards(true);
      }}
      onTouchStart={() => {
        if (!showAllCards) setShowAllCards(true);
      }}
      className="bg-[#11141E] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 text-white"
    >
      {/* Shelf Header: Category Title + 20 Live Iranian Templates Badge + Left/Right Swipe Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{shelf.badgeText} (لایو ایرانی)</span>
            </span>
            <h3 className="text-base sm:text-xl font-black text-white">
              {shelf.title}
            </h3>
          </div>
          <p className="text-xs text-slate-300">{shelf.subtitle}</p>
        </div>

        {/* Fixed Swipe Buttons for this Category Row */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span className="text-[11px] text-slate-300 hidden md:inline">
            ورق زدن ۲۰ سایت زنده ایرانی این دسته:
          </span>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="قبلی"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-colors cursor-pointer shadow-lg"
          >
            <span>ورق بزنید ({templates.length.toLocaleString('fa-IR')} طرح)</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cards Track (20 Real Iranian Live Cards per Row) */}
      <div
        ref={trackRef}
        onScroll={() => {
          if (!showAllCards) setShowAllCards(true);
        }}
        className="flex items-stretch gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {renderedTemplates.map((kit, idx) => {
          const displayPrice =
            pricingMode === 'ready-kit' ? readyPrice : kit.customPriceToman;
          const liveUrl = kit.liveReferenceUrl || kit.realExternalDemoUrl;
          const cleanHost = liveUrl
            .replace(/^https?:\/\/(www\.)?/, '')
            .replace(/\/$/, '');
          const likesCount = 190 + ((idx * 37) % 340);
          const viewsCount = (2.1 + ((idx * 7) % 45) * 0.1).toFixed(1);
          const brandLabel = customBrandName?.trim()
            ? customBrandName.trim()
            : kit.title.split('—')[0].split('،')[0].trim();
          const previewItems = kit.sandboxTheme.items.slice(0, 2);

          return (
            <article
              key={kit.id}
              onClick={() => onOpenFullScreen(kit, 'live-site')}
              className="w-[310px] sm:w-[335px] shrink-0 snap-start rounded-3xl bg-[#161925] border border-white/10 hover:border-emerald-400/60 p-3 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between shadow-lg cursor-pointer group"
            >
              <div>
                {/* Top Browser Frame + Subject-Specific Live Mini-Website UI Preview */}
                <div className="relative w-full rounded-2xl overflow-hidden bg-[#0B0E17] aspect-[16/10.5] border border-white/10 flex flex-col justify-between p-1.5">
                  {/* Browser Bar */}
                  <div className="relative z-20 flex items-center justify-between gap-1.5 px-2 py-1 rounded-t-xl bg-[#161B26] border border-b-0 border-white/10">
                    <div className="flex items-center gap-1 shrink-0">
                      <Globe className="w-3 h-3 text-emerald-400" />
                      <span className="text-[8.5px] font-mono font-bold text-emerald-300 uppercase">
                        LIVE IRAN
                      </span>
                    </div>

                    <div
                      dir="ltr"
                      className="flex-1 max-w-[58%] px-2 py-0.5 rounded-md bg-black/60 border border-white/10 text-[9.5px] font-mono text-emerald-300 truncate flex items-center justify-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="truncate">{cleanHost}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-300 shrink-0">
                      <span className="flex items-center gap-0.5 text-rose-400 font-bold">
                        <Heart className="w-2.5 h-2.5 fill-rose-400" />
                        {likesCount}
                      </span>
                      <span className="hidden sm:flex items-center gap-0.5 text-slate-300">
                        <Eye className="w-2.5 h-2.5" />
                        {viewsCount}k
                      </span>
                    </div>
                  </div>

                  {/* Subject-Specific Mini-Website UI Canvas */}
                  <div className="relative flex-1 w-full overflow-hidden rounded-b-xl border border-white/10 bg-slate-950 flex flex-col justify-between">
                    {/* Topic-Matched Background Photo */}
                    <img
                      src={kit.image}
                      alt={kit.title}
                      width={360}
                      height={225}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/75" />

                    {/* Mini Website Top Header Inside Preview */}
                    <div className="relative z-10 px-2.5 py-1.5 bg-slate-950/80 backdrop-blur-xs border-b border-white/10 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-4 h-4 rounded-md text-[9px] font-black text-white bg-slate-800 border border-white/20 flex items-center justify-center shrink-0">
                          {brandLabel.slice(0, 1)}
                        </span>
                        <span className="text-[10px] font-black text-white truncate">
                          {brandLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 overflow-hidden">
                        {kit.sandboxTheme.navLinks.slice(0, 2).map((nav) => (
                          <span
                            key={nav}
                            className="text-[8.5px] text-slate-200 bg-white/10 px-1.5 py-0.5 rounded truncate max-w-[68px]"
                          >
                            {nav}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mini Website Hero Headline + 2 Real Topic Product Pills */}
                    <div className="relative z-10 p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black text-white bg-slate-900/95 border border-white/25">
                          کد {kit.code} · {kit.referenceBrandFa || cleanHost}
                        </span>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-0.5 rounded bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-[8.5px] font-black flex items-center gap-0.5 shadow"
                        >
                          <span>سایت واقعی</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <div className="text-[10.5px] font-extrabold text-white line-clamp-1 leading-snug">
                        {kit.sandboxTheme.heroHeadline}
                      </div>

                      {/* 2 Mini Product/Service Cards Specific to This Template */}
                      <div className="grid grid-cols-2 gap-1 pt-0.5">
                        {previewItems.map((it) => (
                          <div
                            key={it.id}
                            className="bg-slate-900/90 border border-white/15 rounded-lg px-2 py-1 flex items-center justify-between gap-1"
                          >
                            <span className="text-[8.5px] text-slate-200 font-bold truncate">
                              {it.name.split('—').pop()?.trim() || it.name}
                            </span>
                            <span className="text-[8.5px] font-mono font-black text-emerald-400 shrink-0">
                              {(it.priceToman / 1000000).toFixed(1)}م
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Title & Price Row */}
                <div className="pt-3 px-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-white font-black text-xs sm:text-sm truncate leading-tight">
                      {kit.title}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] font-mono tabular-nums shadow shrink-0">
                      {pricingMode === 'ready-kit'
                        ? `${(displayPrice / 1000000).toFixed(1)} م.ت`
                        : 'استعلام قیمت'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-white/65">
                    <span className="text-emerald-400 font-bold truncate">
                      {kit.engineLabel}
                    </span>
                    <span className="text-amber-300 font-bold shrink-0">
                      هاست و دامنه .ir رایگان
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Action Buttons + Tick-to-Cart Button */}
              <div>
                <div className="grid grid-cols-3 gap-1.5 pt-3 mt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFullScreen(kit, 'live-site');
                    }}
                    className="py-2 px-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500/40 text-emerald-200 font-black text-[10.5px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">سایت زنده</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenFullScreen(kit, 'customizer-studio');
                    }}
                    className="py-2 px-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-[10.5px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Sliders className="w-3 h-3 text-amber-300 shrink-0" />
                    <span className="truncate">شخصی‌سازی</span>
                  </button>

                  {onToggleCartKit ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCartKit(kit, pricingMode);
                      }}
                      className={`py-2 px-1.5 rounded-xl font-black text-[10.5px] transition-colors cursor-pointer flex items-center justify-center gap-1 shadow ${
                        cartItemIds.includes(`kit-${kit.id}`)
                          ? 'bg-blue-500 text-white'
                          : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                      }`}
                    >
                      {cartItemIds.includes(`kit-${kit.id}`) ? (
                        <Check className="w-3 h-3 shrink-0" />
                      ) : (
                        <ShoppingBag className="w-3 h-3 shrink-0" />
                      )}
                      <span className="truncate">
                        {cartItemIds.includes(`kit-${kit.id}`)
                          ? 'در سبد ✓'
                          : 'تیک در سبد'}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFullScreen(kit, 'admin-3d');
                      }}
                      className="py-2 px-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/40 text-purple-200 font-bold text-[10.5px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Layers className="w-3 h-3 text-purple-300 shrink-0" />
                      <span className="truncate">پنل مدیر</span>
                    </button>
                  )}
                </div>

                <div className="pt-2 px-1 flex items-center justify-between gap-2 text-[10.5px]">
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      سایت مرجع زنده ({cleanHost}) ↗
                    </span>
                  </a>
                  <span className="text-slate-400 font-mono text-[10px] shrink-0 flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    لایو
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
